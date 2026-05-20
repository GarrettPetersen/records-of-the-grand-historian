#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/002.json';
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

const T = {
  s0101: {
    literal:
      'In the eleventh month of the second year, Taizong led his army toward Longmen Pass, crossed on the ice, and encamped at Baibi, where he faced the rebel general Song Jingang in a stalemate.',
    idiomatic:
      'In the eleventh month of Wude 2 Taizong marched on Longmen Pass, crossed the frozen river, and camped at Baibi to hold Song Jingang at bay.',
  },
  s0102: {
    literal:
      'Before long Prince of Yong\'an Xiaoji was defeated at Xia County; Yu Jun, Dugu Huai\'en, and Tang Jian were all seized by the rebel generals Xun Xiang and Yuchi Jingde and were being taken back to Huai Prefecture.',
    idiomatic:
      'Soon after, Prince of Yong\'an Xiaoji was beaten at Xia County; Yu Jun, Dugu Huai\'en, and Tang Jian fell into the hands of Xun Xiang and Yuchi Jingde and were marched toward Huai Prefecture.',
  },
  s0103: {
    literal:
      'Taizong sent Yin Kaishan and Qin Shubao to intercept them on the Meiliang River, routed them utterly, and Xiang and the rest barely escaped with their lives; he took the whole force captive and returned to Baibi.',
    idiomatic:
      'Taizong sent Yin Kaishan and Qin Shubao to ambush them on the Meiliang River, crushed the column, and captured the lot; Xiang alone slipped away. The army then returned to Baibi.',
  },
  s0104: {
    literal:
      'Thereupon the generals all asked to give battle. Taizong said: "Jingang has hung his army a thousand li out and driven deep into our territory; his crack troops and fierce commanders are all here.',
    idiomatic:
      'The commanders all pressed for battle. Taizong said: "Jingang has marched a thousand li and plunged deep into our land; every elite soldier and bold captain he has is in this camp.',
  },
  s0105: {
    literal:
      'Wuzhou holds Taiyuan and relies on Jingang alone as his shield.',
    idiomatic:
      'Wuzhou sits in Taiyuan and trusts Jingang alone to shield him.',
  },
  s0106: {
    literal:
      'Though their numbers are great, within they are hollow; they mean to fight quickly.',
    idiomatic:
      'Their host looks vast, but it is empty at the core—they want a swift decision.',
  },
  s0107: {
    literal:
      'We shall hold our camps, store our strength, and blunt their edge; when grain is gone and plans exhausted, they will flee of themselves.',
    idiomatic:
      'We will stand fast, husband our strength, and break their momentum; when supplies fail and schemes run dry, they will break and run without our chasing them.',
  },
  s0108: {
    literal: '"',
    idiomatic: '[End of his reply.]',
  },
  s0109: {
    literal:
      'In the second month of the third year Jingang at last fled with his starving troops; Taizong pursued him to Jie Prefecture.',
    idiomatic:
      'In the second month of Wude 3 Jingang finally broke away with a starving army; Taizong chased him to Jie Prefecture.',
  },
  s0110: {
    literal:
      'Jingang drew up his battle line seven li from north to south to block the imperial army.',
    idiomatic:
      'Jingang formed a line seven li long from north to south to meet the Tang forces.',
  },
  s0111: {
    literal:
      'Taizong sent Supervisors Li Shiji, Cheng Yaojin, and Qin Shubao to face the north; Zhai Zhangsun and Qin Wutong the south.',
    idiomatic:
      'Taizong posted Li Shiji, Cheng Yaojin, and Qin Shubao on the north; Zhai Zhangsun and Qin Wutong on the south.',
  },
  s0112: {
    literal: 'The armies gave a little ground in the fighting and were taken advantage of by the rebels.',
    idiomatic: 'The Tang lines buckled slightly and the rebels pressed the advantage.',
  },
  s0113: {
    literal:
      'Taizong led his elite cavalry to strike them, charged through to the rear of their formation, and the rebel host was utterly broken; the pursuit ran for several tens of li.',
    idiomatic:
      'Taizong himself led the elite horse, hit their rear, and shattered them; the pursuit carried tens of li.',
  },
  s0114: {
    literal:
      'Jingde and Xiang led eight thousand men to surrender; Taizong again had Jingde command them, intermingled with the camps.',
    idiomatic:
      'Jingde and Xiang brought eight thousand men over; Taizong put Jingde in charge of them, mixed in among his own units.',
  },
  s0115: {
    literal:
      'Qu Tu Tong, fearing they would turn traitor, urgently petitioned on the matter.',
    idiomatic:
      'Qu Tu Tong, fearing treachery, urgently asked that they be disarmed or removed.',
  },
  s0116: {
    literal:
      'Taizong said: "In old times the Duke of Xiao laid his open heart in another\'s breast, and men gave their lives to the end; now that I entrust Jingde, what is there to doubt?',
    idiomatic:
      'Taizong said: "Long ago the Duke of Xiao trusted men with his whole heart, and they died for him without reserve. Jingde has my trust—why should I doubt him?',
  },
  s0117: {
    literal:
      '" Thereupon Liu Wuzhou fled to the Turks, and Bing and Fen were all restored to the old boundaries.',
    idiomatic:
      'Liu Wuzhou fled to the Turks; Bing and Fen were recovered in full.',
  },
  s0118: {
    literal:
      'An edict promoted him on the spot to Chief Minister of the Yizhou Circuit headquarters.',
    idiomatic:
      'By edict he was promoted in the field to Chief Minister of the Yizhou Circuit headquarters.',
  },
  s0119: {
    literal:
      'In the seventh month he took overall command of the armies attacking Wang Shichong at Luoyang and halted at Gu Prefecture.',
    idiomatic:
      'In the seventh month he took supreme command against Wang Shichong at Luoyang and encamped at Gu Prefecture.',
  },
  s0120: {
    literal:
      'Shichong led thirty thousand picked troops and drew up at Ciyong Stream; Taizong provoked him with light cavalry.',
    idiomatic:
      'Shichong brought thirty thousand elite troops to Ciyong Stream; Taizong baited him with a light horse screen.',
  },
  s0121: {
    literal:
      'At the time they were badly outnumbered and fell into a tight encirclement; those about him were all afraid.',
    idiomatic:
      'Outnumbered, he was hemmed in; even his attendants feared the worst.',
  },
  s0122: {
    literal:
      'Taizong ordered those at his side to withdraw first and alone brought up the rear.',
    idiomatic:
      'Taizong sent his companions ahead and alone covered the retreat.',
  },
  s0123: {
    literal:
      'Shichong\'s fierce general Shan Xiongxin with several hundred horsemen came pressing along both sides of the road, spears crossing as they vied forward; Taizong was nearly undone.',
    idiomatic:
      'Shan Xiongxin, Shichong\'s boldest captain, closed in with hundreds of horse along the road; Taizong came within a hair of defeat.',
  },
  s0124: {
    literal:
      'Taizong shot left and right; none failed to fall at the twang of the bowstring, and he took their great general Yan Xie.',
    idiomatic:
      'He shot to either flank; every arrow found its mark, and he captured the great general Yan Xie.',
  },
  s0125: {
    literal:
      'Shichong thereupon abandoned the Ciyong garrison and withdrew to the Eastern Capital.',
    idiomatic:
      'Shichong then abandoned the Ciyong strongpoint and pulled back to the Eastern Capital.',
  },
  s0126: {
    literal:
      'Taizong sent Campaign General Shi Wanbao from the south of Yiyang to hold Longmen, Liu Dewei from the east of the Taihang range to invest Henei, and Wang Junkuo from Luokou to sever the rebel grain route.',
    idiomatic:
      'He sent Shi Wanbao south from Yiyang to seize Longmen, Liu Dewei east of the Taihang to besiege Henei, and Wang Junkuo from Luokou to cut Shichong\'s supply line.',
  },
  s0127: {
    literal:
      'He also sent Huang Junhan by night to float boats down the Xiaoshui and strike Huiluo city, which was taken.',
    idiomatic:
      'Huang Junhan was sent by night down the Xiaoshui with a fleet to storm Huiluo city and took it.',
  },
  s0128: {
    literal:
      'South of the Yellow River none failed to answer the call; fortresses and walled towns surrendered one after another.',
    idiomatic:
      'South of the Yellow River the country rose in answer; strongpoints surrendered in succession.',
  },
  s0129: {
    literal: 'The main army advanced and encamped on Mount Mang.',
    idiomatic: 'The main force moved up and camped on Mount Mang.',
  },
  s0130: {
    literal:
      'In the ninth month Taizong with five hundred horsemen went ahead to reconnoiter the field and suddenly met more than ten thousand of Shichong\'s men; they joined battle, broke them again, beheaded more than three thousand, took the great general Chen Zhilue, and Shichong barely escaped with his life.',
    idiomatic:
      'In the ninth month, scouting with five hundred horse, he stumbled on more than ten thousand of Shichong\'s troops, routed them, took three thousand heads and the general Chen Zhilue, and Shichong fled alone.',
  },
  s0131: {
    literal:
      'Yang Qing, whom Shichong had appointed commander of Yun Prefecture, sent envoys to offer surrender; Taizong sent Li Shiji with troops out by the Xuanyuan Pass road to pacify his following.',
    idiomatic:
      'Yang Qing, Shichong\'s commander at Yun Prefecture, sent envoys to submit; Taizong sent Li Shiji by the Xuanyuan road to bring his troops over.',
  },
  s0132: {
    literal:
      'The nine prefectures of Xing, Bian, Wei, and Yu surrendered in turn.',
    idiomatic:
      'Xing, Bian, Wei, and Yu—the nine prefectures of the region—came over one after another.',
  },
  s0133: {
    literal: 'Shichong then begged Dou Jiande for rescue.',
    idiomatic: 'Shichong turned to Dou Jiande for aid.',
  },
  s0134: {
    literal: 'In the second month of the fourth year he again advanced and encamped at Qingcheng Palace.',
    idiomatic: 'In the second month of Wude 4 he moved forward again to Qingcheng Palace.',
  },
  s0135: {
    literal:
      'Before the ramparts were finished, twenty thousand of Shichong\'s men came from Fangzhu Gate and drew up along the valley water.',
    idiomatic:
      'Before the camp was complete, twenty thousand of Shichong\'s troops issued from Fangzhu Gate and formed along the stream.',
  },
  s0136: {
    literal:
      'Taizong arrayed his elite cavalry on Mount Mang to the north and ordered Qu Tu Tong with five thousand foot soldiers to cross the water and strike them, charging him: "When the infantry clash, set off smoke; I shall lead the cavalry south.',
    idiomatic:
      'Taizong lined his elite horse on the northern slope of Mount Mang and ordered Qu Tu Tong with five thousand foot to cross and attack, telling him: "The moment the foot engage, light the signal—I will come down with the cavalry."',
  },
  s0137: {
    literal:
      '" As soon as the lines met, Taizong charged with his cavalry, thrust himself forward at the head, and coordinated with Tong inside and out.',
    idiomatic:
      'The instant the armies met, Taizong drove in with his horse, took the lead himself, and struck in concert with Tong from both sides.',
  },
  s0138: {
    literal:
      'The rebel host fought to the death; they scattered and re-formed several times.',
    idiomatic:
      'The enemy fought with desperate fury, breaking and re-forming again and again.',
  },
  s0139: {
    literal:
      'From the hour chen until wu the rebel lines at last gave way.',
    idiomatic:
      'From mid-morning until noon the enemy line finally broke.',
  },
  s0140: {
    literal:
      'He loosed his troops in pursuit; more than eight thousand were captured or slain, and he then advanced and encamped beneath the city walls.',
    idiomatic:
      'He sent the army in pursuit; eight thousand were killed or taken, then he pitched camp under the city walls.',
  },
  s0141: {
    literal:
      'Shichong dared not come out again but clung to the walls and waited for Jiande\'s relief.',
    idiomatic:
      'Shichong would not sally again; he held the walls and waited for Jiande.',
  },
  s0142: {
    literal:
      'Taizong ordered the armies to dig trenches and ring the city in a long encirclement.',
    idiomatic:
      'Taizong had trenches dug and a full cordon drawn round the city.',
  },
  s0143: {
    literal:
      'Prince of Wu Du Fuwei sent his generals Chen Zhengtong and Xu Zhaozong with two thousand elite troops to join the camp.',
    idiomatic:
      'Du Fuwei, Prince of Wu, sent Chen Zhengtong and Xu Zhaozong with two thousand picked men to the camp.',
  },
  s0144: {
    literal:
      'Shen Yue, bogus prefectural marshal of Zheng Prefecture, surrendered Hulao; General Wang Junkuo answered him and captured the bogus Prince of Jing Wang Xingben.',
    idiomatic:
      'Shen Yue, Shichong\'s marshal at Zheng Prefecture, surrendered Hulao; Wang Junkuo moved up and seized the bogus Prince of Jing, Wang Xingben.',
  },
  s0145: {
    literal:
      'Dou Jiande came with more than a hundred thousand men to relieve Shichong and reached Suanzao.',
    idiomatic:
      'Dou Jiande marched to Shichong\'s aid with more than a hundred thousand men and reached Suanzao.',
  },
  s0146: {
    literal:
      'Xiao Yu, Qu Tu Tong, and Feng Deyi all said that with enemies before and behind them success was not assured and asked to withdraw the army to Gu Prefecture to watch developments.',
    idiomatic:
      'Xiao Yu, Qu Tu Tong, and Feng Deyi all warned that caught between Shichong and Jiande the position was perilous and urged a withdrawal to Gu Prefecture to wait.',
  },
  s0147: {
    literal:
      'Taizong said: "Shichong\'s grain is exhausted and hearts within and without are divided; we need not labor to attack—we may sit and gather the spoil of their exhaustion.',
    idiomatic:
      'Taizong said: "Shichong is out of grain and his people are splitting within and without. We need not storm the walls—we can let exhaustion do our work.',
  },
  s0148: {
    literal:
      'Jiande has newly defeated Meng Haigong; his generals are proud and his soldiers slack—we should advance and seize Hulao, choking their throat.',
    idiomatic:
      'Jiande has just crushed Meng Haigong; his officers are arrogant and his men lax. We should seize Hulao and grip him by the throat.',
  },
  s0149: {
    literal:
      'If the enemy dare meet us in a pitched fight, we are sure to break them.',
    idiomatic:
      'If they dare meet us in the open, we will break them.',
  },
  s0150: {
    literal:
      'If they will not fight, within ten days Shichong will collapse of himself.',
    idiomatic:
      'If they refuse battle, Shichong will fall apart within ten days.',
  },
  s0151: {
    literal:
      'If we do not advance quickly and the enemy enters Hulao, the cities newly submitted cannot be held.',
    idiomatic:
      'If we delay and Jiande takes Hulao, every city that just submitted will slip from our grasp.',
  },
  s0152: {
    literal:
      'When the two foes combine their strength, what then shall we do?',
    idiomatic:
      'When the two of them join forces, what will we do then?"',
  },
  s0153: {
    literal:
      'Tong again asked to lift the siege and take a strong position to await changes; Taizong would not permit it.',
    idiomatic:
      'Qu Tu Tong again asked to raise the siege and fall back to defensible ground; Taizong refused.',
  },
  s0154: {
    literal:
      'Thereupon he left Tong to assist Prince of Qi Yuanji in besieging Shichong and himself led three thousand five hundred foot and horse toward Hulao.',
    idiomatic:
      'He left Qu Tu Tong with Prince of Qi Yuanji to keep the siege and marched in person with thirty-five hundred foot and horse for Hulao.',
  },
  s0155: {
    literal:
      'Jiande came up from west of Xingyang and built ramparts at Banzhu; Taizong encamped at Hulao, and the two sides faced each other for more than twenty days.',
    idiomatic:
      'Jiande advanced from west of Xingyang and fortified Banzhu; Taizong held Hulao. For twenty days the armies watched each other.',
  },
  s0156: {
    literal:
      'Spies reported: "Jiande is watching for our fodder to run out; he plans to wait until we pasture our horses north of the river, then strike Hulao."',
    idiomatic:
      'Intelligence reported that Jiande meant to wait until Tang fodder gave out, then attack while the horses were grazing north of the river.',
  },
  s0157: {
    literal:
      'Taizong knew their plan and therefore pastured his horses north of the river to lure them.',
    idiomatic:
      'Taizong saw the trap and deliberately grazed his horses north of the river as bait.',
  },
  s0158: {
    literal:
      'At dawn the next day Jiande indeed came with his whole host, drew up his troops along the Fan River, and Shichong\'s general Guo Shiheng formed to the south, stretching for several li amid clamor; the generals were greatly afraid.',
    idiomatic:
      'At dawn Jiande came in full strength, lined the Fan River for miles, and Guo Shiheng, Shichong\'s general, formed to the south—the din terrified Taizong\'s officers.',
  },
  s0159: {
    literal:
      'Taizong took a few horsemen up a high mound to look them over and said to the generals: "The rebels rose in Shandong and have never seen a great foe.',
    idiomatic:
      'Taizong rode to a hill with a handful of men, studied the host, and told his commanders: "These men came out of Shandong and have never met a real army.',
  },
  s0160: {
    literal:
      'Now they cross difficult ground yet are arrogant—that means no discipline;',
    idiomatic:
      'They have crossed hard country yet strut about—that means no discipline.',
  },
  s0161: {
    literal:
      'they press the city yet draw up in battle—that shows they hold us light.',
    idiomatic:
      'They crowd the walls yet offer battle—that means they think little of us.',
  },
  s0162: {
    literal:
      'If we hold our troops and do not go out, their spirit will fade; when the line stands long the soldiers hunger, and they are sure to withdraw of themselves—pursue and strike, and nowhere will we fail.',
    idiomatic:
      'Hold still and their spirit will sink; stand in line till noon and they will hunger and pull back. Then pursue—and we cannot fail.',
  },
  s0163: {
    literal:
      'I make this pact with you: we shall break them after the hour wu."',
    idiomatic:
      'I swear to you—we will break them after noon."',
  },
  s0164: {
    literal:
      'Jiande drew up his formation; from chen to wu the soldiers were hungry and weary, all sitting in their ranks; they also quarreled over drinking water, and after a while drew back.',
    idiomatic:
      'Jiande formed his line; from morning to noon his men grew hungry and slack, sitting in the ranks, scrambling for water, then edging back.',
  },
  s0165: {
    literal: 'Taizong said: "They can be struck!"',
    idiomatic: 'Taizong cried: "Now—hit them!"',
  },
  s0166: {
    literal:
      '" He personally led light cavalry in pursuit to lure them; the masses followed on.',
    idiomatic:
      'He himself led the light horse forward in a feigned chase; the main body came after.',
  },
  s0167: {
    literal:
      'Jiande turned his army and formed; before he could set his ranks in order Taizong was first upon them in the assault; wherever he went, none could stand.',
    idiomatic:
      'Jiande wheeled to form, but before the ranks settled Taizong was already among them; nothing held against his charge.',
  },
  s0168: {
    literal:
      'Presently the armies joined in battle and dust and clamor rose on every side.',
    idiomatic:
      'Soon the whole field was locked in battle, dust and shouting everywhere.',
  },
  s0169: {
    literal:
      'Taizong led Shi Danai, Cheng Yaojin, Qin Shubao, Yu Wenxin, and others, banners waving, straight through to the rear of their formation, and raised our standards.',
    idiomatic:
      'Taizong with Shi Danai, Cheng Yaojin, Qin Shubao, Yu Wenxin, and others drove their banners through to the enemy rear and planted the Tang colors.',
  },
  s0170: {
    literal:
      'When the rebels looked back and saw them, they broke in great disorder.',
    idiomatic:
      'The enemy looked behind, saw Tang banners in their rear, and collapsed.',
  },
  s0171: {
    literal:
      'The pursuit ran thirty li; more than three thousand heads were taken, fifty thousand of their host were captured, and Jiande was seized alive on the field.',
    idiomatic:
      'The pursuit ran thirty li: three thousand heads, fifty thousand prisoners, and Jiande taken alive on the field.',
  },
  s0172: {
    literal:
      'Taizong rebuked him, saying: "I took up arms to punish guilt, and that guilt lies with Wang Shichong; gain or loss, survival or ruin, does not concern you—why did you cross the border and strike my army?"',
    idiomatic:
      'Taizong upbraided him: "I marched to punish Wang Shichong. Your quarrel was not mine—why did you cross my border and meet my blades?"',
  },
  s0173: {
    literal:
      'Jiande trembled in his thighs and said: "Had I not come, I feared you would weary yourself with a distant campaign."',
    idiomatic:
      'Jiande shook and said: "If I had stayed away, I feared you would wear yourself out marching so far."',
  },
  s0174: {
    literal:
      'Gaozu heard and was greatly pleased and wrote with his own hand:',
    idiomatic:
      'When Gaozu heard, he was overjoyed and wrote in his own hand:',
  },
  s0175: {
    literal:
      '"The house of Sui is split asunder; the passes of Xiaoshan and Hangu are cut off.',
    idiomatic:
      '"The Sui house is broken; Xiaoshan and Hangu stand between us and the east.',
  },
  s0176: {
    literal:
      'Two mighty foes joined their strength and were swept away in a morning.',
    idiomatic:
      'Two great enemies joined—and you cleared them in a single morning.',
  },
  s0177: {
    literal:
      'The army won the victory yet not another man fell.',
    idiomatic:
      'The battle was won without another man lost.',
  },
  s0178: {
    literal:
      'A minister without shame, a father without grief—all that is your achievement."',
    idiomatic:
      'No shame to the minister, no grief to the father—that glory is yours alone."',
  },
  s0179: {
    literal:
      '" He then led Jiande to beneath the walls of the Eastern Capital.',
    idiomatic:
      'He then paraded Jiande before the Eastern Capital.',
  },
  s0180: {
    literal:
      'Shichong, in fear, led more than two thousand of his officials to the camp gate to surrender; Shandong was entirely pacified.',
    idiomatic:
      'Shichong, in terror, came with two thousand officials to the camp gate and submitted; Shandong was pacified.',
  },
  s0181: {
    literal:
      'Taizong entered and held the palace city; he ordered Xiao Yu, Dou Ji, and others to seal the treasuries, taking nothing for themselves, and ordered Recorder Fang Xuanling to gather the Sui maps and registers.',
    idiomatic:
      'Taizong entered the palace precinct, set Xiao Yu and Dou Ji to seal the vaults without plunder, and had Fang Xuanling collect the Sui archives and maps.',
  },
  s0182: {
    literal:
      'Thereupon more than fifty of their chief accomplices, including Duan Da, were executed; all who had been wrongly imprisoned were released, and those put to death without cause were mourned and eulogized.',
    idiomatic:
      'More than fifty ringleaders, including Duan Da, were put to death; the innocent were freed, and those wrongly executed were mourned and given posthumous praise.',
  },
  s0183: {
    literal:
      'He held a great feast for the officers and distributed rewards in graded amounts.',
    idiomatic:
      'He feasted the army and gave rewards by rank.',
  },
  s0184: {
    literal:
      'Gaozu sent Left Vice Director of the Department of State Affairs Pei Ji to offer congratulations in the camp.',
    idiomatic:
      'Gaozu sent Pei Ji, Left Vice Director of the Department of State Affairs, to congratulate the army.',
  },
  s0185: {
    literal: 'In the sixth month he returned in triumph.',
    idiomatic: 'In the sixth month he marched home in triumph.',
  },
  s0186: {
    literal:
      'Taizong personally donned golden armor, arrayed ten thousand iron-clad horses and thirty thousand armored soldiers, with front and rear bands of martial music, and presented the two bogus rulers and the Sui ritual vessels and imperial carriages at the imperial temple.',
    idiomatic:
      'Taizong wore golden armor, paraded ten thousand armored horses and thirty thousand mail-clad troops with full martial music, and presented the two captive kings and the Sui regalia at the ancestral temple.',
  },
  s0187: {
    literal:
      'Gaozu was greatly pleased and performed the ritual of drinking to the army\'s return to feast him.',
    idiomatic:
      'Gaozu rejoiced and held the "drink on return" rite to honor him.',
  },
  s0188: {
    literal:
      'Gaozu held that from antiquity the old offices could not match extraordinary merit, and therefore set forth separate titles of honor to signal merit and virtue.',
    idiomatic:
      'Gaozu judged that ancient titles could not match such merit and created new honors to mark it.',
  },
  s0189: {
    literal:
      'In the tenth month he was given the additional title Heavenly Stratagem General and Chief of the Shaanxi-East Circuit headquarters, ranking above kings and dukes.',
    idiomatic:
      'In the tenth month he received the added title Heavenly Stratagem General and chief of the Shaanxi-East headquarters, ranking above princes and dukes.',
  },
  s0190: {
    literal:
      'His fief was increased by twenty thousand households, making thirty thousand in all with what he had before.',
    idiomatic:
      'His fief rose by twenty thousand households to thirty thousand in all.',
  },
  s0191: {
    literal:
      'He was granted one golden chariot, robes of the nine symbols, a pair of jade disks, six thousand jin of gold, front and rear martial music and the nine orchestras, and forty ceremonial swords.',
    idiomatic:
      'He received a golden chariot, full royal regalia, a pair of jade disks, six thousand jin of gold, imperial music, and forty ceremonial swords.',
  },
  s0192: {
    literal:
      'At that time the realm was gradually pacified, and Taizong turned his keen attention to the classics, opening a Hall of Literary Endeavor to await men of talent from the four quarters.',
    idiomatic:
      'As the realm grew quiet, Taizong turned to scholarship and opened the Hall of Literary Endeavor for scholars from every quarter.',
  },
  s0193: {
    literal:
      'Du Ruhui of the Circuit Bureau of Merits and eighteen others were made academicians; they took turns on duty below the pavilion, received his warm countenance, and discussed the classics with him—sometimes until deep in the night.',
    idiomatic:
      'Du Ruhui and eighteen others of the circuit staff became academicians, rotating below the pavilion to debate the classics with him far into the night.',
  },
  s0194: {
    literal:
      'Before long Liu Heita, a former officer of Dou Jiande, raised troops in revolt and seized Ming Prefecture.',
    idiomatic:
      'Soon Liu Heita, once Jiande\'s officer, rebelled and held Ming Prefecture.',
  },
  s0195: {
    literal:
      'In the twelfth month Taizong took overall command and marched east to attack.',
    idiomatic:
      'In the twelfth month Taizong took supreme command and marched east against him.',
  },
  s0196: {
    literal:
      'In the first month of the fifth year he advanced on Feixiang, divided his forces to cut the rebel grain route, and faced them for two months.',
    idiomatic:
      'In the first month of Wude 5 he moved on Feixiang, detached columns to sever supplies, and held Heita at bay for two months.',
  },
  s0197: {
    literal:
      'Heita, hard pressed, sought battle; he led twenty thousand foot and horse, crossed the Ming River to the south at dawn, and pressed the imperial army at first light.',
    idiomatic:
      'Heita, cornered, forced a battle: at dawn he led twenty thousand foot and horse south across the Ming River and struck at daybreak.',
  },
  s0198: {
    literal:
      'Taizong personally led his elite cavalry, struck their horse troops, broke them, pressed the advantage to trample their infantry, and the rebels were utterly routed; more than ten thousand heads were taken.',
    idiomatic:
      'Taizong led the elite horse himself, shattered the cavalry, rolled over the foot, and broke Heita completely—more than ten thousand heads.',
  },
  s0199: {
    literal:
      'Earlier Taizong had ordered a dam on the upper Ming to shallow the water so Heita could cross.',
    idiomatic:
      'Before the fight Taizong had dammed the upper Ming to shallow the river so Heita would cross.',
  },
  s0200: {
    literal:
      'When battle came he ordered the dam broken; the water rose greatly, more than a zhang deep, and when the rebels were already beaten, those who ran into the water all drowned.',
    idiomatic:
      'At the clash he had the dam opened; the flood rose more than ten feet, and the broken army drowned in the Ming by the thousands.',
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

if (!existsSync(transPath)) {
  console.log(
    `No ${transPath}; standalone T ready (${Object.keys(T).length} entries, s0101–s0200).`
  );
  process.exit(0);
}

const data = JSON.parse(readFileSync(transPath, 'utf8'));
if (data.metadata.chapter !== '002') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 002; standalone T ready (${Object.keys(T).length} entries).`
  );
  process.exit(0);
}

const sessionIds = new Set(data.sentences.map((s) => s.originalId || s.id));
const hasRange = [...expectedIds].every((id) => sessionIds.has(id));

if (!hasRange) {
  console.log(
    `Session lacks s0101–s0200; standalone T ready (${Object.keys(T).length} entries). Re-run after the next start-translation batch.`
  );
  process.exit(0);
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
console.log('Applied', applied, 'translations (s0101–s0200) to', transPath);
