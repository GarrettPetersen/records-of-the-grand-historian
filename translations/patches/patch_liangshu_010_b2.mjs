#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'He had served eight generals, and the province and commandery praised him.',
    'He served eight commanders in turn, and the province spoke well of him.',
  ],
  s0102: [
    'When Qi Mingdi was inspector, he greatly favored and esteemed him.',
    'When Qi Mingdi held the inspectorship, he singled Xiang out for favor.',
  ],
  s0103: [
    'When Mingdi became regent, he summoned him to the capital, intending to employ him in great matters.',
    'Once he took the regency, he called Xiang to the capital for a major appointment.',
  ],
  s0104: [
    'Each night he would draw Xiang and his fellow townsman Pei Shuye into long talk; Xiang would always answer vaguely and not engage.',
    'Nightly he drew Xiang and Pei Shuye into conversation; Xiang would murmur and not truly reply.',
  ],
  s0105: [
    'The emperor asked Shuye, and Shuye reported what Xiang had said.',
    'The emperor questioned Shuye, and Shuye repeated Xiang\'s words.',
  ],
  s0106: [
    'Xiang said: "Do not be the first to bring good fortune; do not be the first to bring disaster.',
    'Xiang said, "Do not be first to court fortune, nor first to invite ruin.',
  ],
  s0107: [
    '" From this there was a slight offense.',
    '" From that moment he fell slightly out of favor.',
  ],
  s0108: [
    'He was sent out as Chief Clerk for the Campaign against the Barbarians and Administrator of Yiyang.',
    'He was posted as chief clerk on the campaign-against-barbarians staff and administrator of Yiyang.',
  ],
  s0109: [
    'Before long the Jian\'an garrison was besieged by Wei; Xiang was again made commandant of Jian\'an, concurrently Administrator of Biancheng and Xincai, and ordered to lead the forces of Guangcheng, Yiyang, and Ruyin to its relief.',
    'Soon the Jian\'an garrison was surrounded by Wei; Xiang was again made its commandant, with Biancheng and Xincai, and led troops from Guangcheng, Yiyang, and Ruyin to relieve it.',
  ],
  s0110: [
    'When Xiang reached Jian\'an, the Wei army withdrew.',
    'Xiang reached Jian\'an and the Wei forces pulled back.',
  ],
  s0111: [
    'Earlier Wei had set up Jingting garrison on the Huai, which constantly raided; repeated attacks could not stop them; Xiang led crack troops against it, the bandits were utterly routed, and all abandoned the city and fled.',
    'Wei had built Jingting garrison on the Huai as a raiding base; repeated strikes failed to break it until Xiang led elite troops, routed the enemy, and drove them from the walls.',
  ],
  s0112: [
    'At the end of Jianwu he was summoned as General of Mobile Columns and sent out as Major of the Southern Gentlemen of the Palace and Administrator of Southern Xincai.',
    'Late in Jianwu he was recalled as general of mobile columns and sent out as southern palace major and administrator of Southern Xincai.',
  ],
  s0113: [
    'When the Qi Prince of Nankang held Jingzhou, Xiang was transferred to Major of the Western Gentlemen and Administrator of Xinxing; he took a shortcut and reached Jiangyang first.',
    'When the Prince of Nankang took Jingzhou, Xiang became western palace major and administrator of Xinxing and, by a direct route, reached Jiangyang ahead of the rest.',
  ],
  s0114: [
    'At that time the Prince of Shi\'an Yao Guang had raised troops in the capital; the Nankang Prince\'s chief clerk Xiao Yinggou had not yet arrived; Army Aide Liu Shanyang was already in the province; Shanyang\'s deputy Pan Shao wished to plot rebellion; Xiang feigned calling Shao to discuss affairs and at once beheaded him at the city gate—the province and headquarters were then pacified.',
    'The Prince of Shi\'an Yao Guang had risen in the capital; Yinggou had not yet reached the province; Liu Shanyang was already there, and his deputy Pan Shao meant to rebel; Xiang lured Shao to the gate on pretense of counsel and cut off his head, and the province was secured.',
  ],
  s0115: [
    'He was transferred to Inspector of Sizhou but declined and did not take the post.',
    'He was offered Sizhou but refused the appointment.',
  ],
  s0116: [
    'When Gaozu\'s righteous army rose, Xiang and Yinggou together launched the great enterprise.',
    'When Gaozu raised the righteous army, Xiang and Yinggou opened the great undertaking together.',
  ],
  s0117: [
    'When the Western Headquarters was established, Xiang was made Central Army Commander, with the additional titles Regular Attendant and Administrator of Nanjun.',
    'With the Western Headquarters in being, Xiang became central army commander, also regular attendant and administrator of Nanjun.',
  ],
  s0118: [
    'On all military and state affairs, Yinggou largely decided through Xiang.',
    'In military and civil matters alike, Yinggou leaned on Xiang for judgment.',
  ],
  s0119: [
    'When Gaozu besieged Ying city without taking it, Yinggou sent Minister of Ceremonies Xi Chayan to Gaozu\'s army.',
    'While Gaozu still held Ying city under siege, Yinggou sent Xi Chayan, minister of ceremonies, to his camp.',
  ],
  s0120: [
    'Xiang submitted a plan: "A desperate wall is easy to hold; to assault and take it is strategically difficult;',
    'Xiang offered counsel: "A cornered city holds easily; to storm it is the harder course.',
  ],
  s0121: [
    'to stall armor before a stout city is what military strategists dread.',
    'To pin an army before strong walls is what every strategist warns against.',
  ],
  s0122: [
    'Truly one ought greatly to broaden strategy and inquire into and accept the counsel of the multitude.',
    'You should widen the plan and gather every voice.',
  ],
  s0123: [
    'From army commanders down to common men, all should be made to offer what they see and express all they think; choose the good and follow it, select the able and employ them; do not reject words because of the person, do not let numbers obscure the few.',
    'From generals to common soldiers, let each speak his mind; take what is sound, use who is fit, and never silence a good word for its speaker nor drown the few in the many.',
  ],
  s0124: [
    'One must also measure our multitude\'s strength, gauge the enemy\'s firewood and grain, spy on their human sentiment, and weigh their disposition.',
    'Weigh our numbers, measure their fuel and grain, read their hearts, and judge their position.',
  ],
  s0125: [
    'If the enemy are many but food is scant, then one should plan to hold out by the day;',
    'If they are many and hungry, count the days and hold;',
  ],
  s0126: [
    'if food is abundant but strength is thin, then one should concentrate all forces and attack.',
    'if they are well fed but few, mass every man and strike.',
  ],
  s0127: [
    'If grain and strength are both sufficient so that neither assault nor defense can break them, then one should scatter gold and jewels and set loose double agents, so that their wise are not used and their fools harbor suspicion—this is how Wei Wu established the great enterprise.',
    'If grain and arms are both ample and neither siege nor assault will bend them, scatter gold and sow distrust until the clever are ignored and the foolish turn on one another—that is how Cao Cao won an empire.',
  ],
  s0128: [
    'If none of the three courses is feasible, one should think of shifts and expedients, observe human sentiment, and reckon our grain stores.',
    'If none of these three paths will serve, seek another way, watch the mood of men, and count our stores.',
  ],
  s0129: [
    'If where virtue moves the ten thousand li answer in accord, and where benevolence dwells near and far return to righteousness, with gold and silk long accumulated and grain transport again full—then one may array siege lines and hold loosely, drawing it out by months and years; this is how Wang Jian conquered Chu.',
    'If virtue draws the realm to you and benevolence gathers the distant, with treasure hoarded and convoys full, then ring the walls and wait the seasons out, as Wang Jian broke Chu.',
  ],
  s0130: [
    'If the siege does not quickly yield surrender, assault cannot yet bring it down, covert routes cannot be used, gold and grain are not stored up, the realm is not of one house, and human sentiment cannot be foreseen—then one should further consider altering the plan.',
    'If the city will not fall soon, assault will not avail, no secret road is open, no hoard lies ready, the land is not one, and hearts cannot be read—then the plan itself must change.',
  ],
  s0131: [
    'The way of altering plans truly depends on heroic resolve; its deeper essentials are hard to set down on paper; I venture to lay them before Minister Xi and especially hope he will lend his ear.',
    'To change course demands bold decision; what matters most cannot be written here—I lay it before Minister Xi and beg him to weigh it.',
  ],
  s0132: [
    '" Gaozu praised and adopted it.',
    '" Gaozu approved and took the counsel to heart.',
  ],
  s0133: [
    'Before long Yinggou died.',
    'Soon after, Yinggou died.',
  ],
  s0134: [
    'At that time Gaozu\'s brother the Prince of Shixing Dan was holding Xiangyang; Xiang sent envoys to welcome Dan to join in military and state affairs.',
    'Gaozu\'s brother the Prince of Shixing, Dan, was then holding Xiangyang; Xiang sent to bring him into counsel on army and state.',
  ],
  s0135: [
    'Emperor He added forbidden troops to Xiang, to enter and leave the palace offices; he firmly declined and would not accept.',
    'Emperor He offered him palace guards to pass in and out of the inner offices; Xiang refused outright.',
  ],
  s0136: [
    'He was transferred to Attendant-in-Ordinary and Right Vice Director of the Masters of Writing.',
    'He was made attendant-in-ordinary and right vice director of the Masters of Writing.',
  ],
  s0137: [
    'Soon he was given Bearer of the Staff, General Who Pacifies the Army, and Jingzhou Inspector.',
    'Soon after he received the staff as general who pacifies the army and inspector of Jingzhou.',
  ],
  s0138: [
    'Xiang again firmly yielded in favor of Dan.',
    'Again Xiang pressed his refusal in Dan\'s favor.',
  ],
  s0139: [
    'In Tianjian year 1 he was summoned as Attendant-in-Ordinary and General of Chariots and Cavalry; for merit he was enfeoffed as Marquis of Ningdu with a fief of two thousand households.',
    'In the first year of Tianjian he was recalled as attendant-in-ordinary and general of chariots and cavalry and, for merit, made marquis of Ningdu with two thousand households.',
  ],
  s0140: [
    'Xiang repeatedly declined, even to the point of earnest pleading; he was then instead made Right Grandee for Splendid Merit, Attendant-in-Ordinary as before.',
    'Xiang declined again and again, until his plea was desperate; he was then given right grandee for splendid merit while keeping attendant-in-ordinary.',
  ],
  s0141: [
    'He was given twenty trusted attendants; his enfeoffment was changed to Duke of Fengcheng, fief as before.',
    'Twenty trusted attendants were granted him, and his title was raised to duke of Fengcheng with the same fief.',
  ],
  s0142: [
    'In year 2 he memorialized to retire; an edict released him from Attendant-in-Ordinary and advanced him to Special Advance.',
    'In the second year he asked to leave office; the court removed him from attendant-in-ordinary and made him special advance.',
  ],
  s0143: [
    'In year 3 he was transferred to Bearer of the Staff, Regular Attendant, General of Chariots and Cavalry, and Xiangzhou Inspector.',
    'In the third year he went out with the staff as regular attendant, general of chariots and cavalry, and inspector of Xiangzhou.',
  ],
  s0144: [
    'Xiang was skilled in administrative affairs; in the province four years, he was praised by the common people.',
    'Xiang knew the work of office; through four years in the province the people praised him.',
  ],
  s0145: [
    'South of the provincial city, facing the water, was a steep peak; old folk handed down the saying: "When an inspector climbs this mountain he is soon replaced."',
    'South of the city, above the river, stood a sharp peak; elders said, "Whichever inspector climbs this hill is soon replaced."',
  ],
  s0146: [
    'For this reason successive administrations dared not go there.',
    'For that reason no governor had dared approach it.',
  ],
  s0147: [
    'Xiang built terraces and pavilions on the spot, invited his subordinates, and thereby showed his modest self-restraint.',
    'Xiang raised halls and towers there, called his officers to him, and showed he did not fear the omen.',
  ],
  s0148: [
    'In year 6 he was summoned as Attendant-in-Ordinary and Right Grandee for Splendid Merit with twenty trusted attendants; before he arrived he was made Left Vice Director and Grandee with the Golden Seal and Purple Tassel, Attendant-in-Ordinary as before.',
    'In the sixth year he was recalled as attendant-in-ordinary and right grandee for splendid merit with twenty attendants; before he reached court he was named left vice director and grandee with the golden seal and purple tassel, still attendant-in-ordinary.',
  ],
  s0149: [
    'He died of illness on the road, aged seventy-four; the emperor wore plain mourning and raised lament; posthumously he was granted Right Grandee for Splendid Merit.',
    'He died on the journey, at seventy-four; the emperor mourned in undyed dress and posthumously made him right grandee for splendid merit.',
  ],
  s0150: [
    'Earlier, a city bureau aide of the Jing headquarters, Qi Shizhan, had conscripted ten thousand men to dig the armory\'s fire-prevention pool and found a belt hook of gold and leather, richly carved in relief; the inscription read: "We grant you a golden hook—already duke and marquis."',
    'Earlier Qi Shizhan, a city bureau aide in the Jing headquarters, had ten thousand men dig the armory\'s fire pool and unearthed a gold-and-leather belt hook, finely worked in relief, inscribed: "We grant you the golden hook—you are already duke and marquis."',
  ],
  s0151: [
    'Shizhan was the son-in-law of Xiang\'s elder brother.',
    'Shizhan had married the daughter of Xiang\'s elder brother.',
  ],
  s0152: [
    'The daughter secretly gave it to Xiang; Xiang delighted to wear it; within the year he had grown exalted.',
    'The girl stole it to Xiang; he wore it gladly, and within a year his rise had come.',
  ],
  s0153: [
    'Cai Daogong, styled Huaijian, was from Guanjun in Nanyang.',
    'Cai Daogong, styled Huaijian, came from Guanjun in Nanyang.',
  ],
  s0154: [
    'His father Jun had been Song Inspector of Yizhou.',
    'His father Jun had served as Song inspector of Yizhou.',
  ],
  s0155: [
    'Daogong in youth was generous and broad in capacity.',
    'In youth Daogong was open-handed and large-minded.',
  ],
  s0156: [
    'When Qi Wendi was Prince of Yongzhou he was summoned to fill the post of chief clerk and was then made Supernumerary Regular Attendant.',
    'When Qi Wendi held Yongzhou he was called in as chief clerk and soon made supernumerary regular attendant.',
  ],
  s0157: [
    'Later, for repeated military merit, he was transferred to Colonel of the Swift Cavalry and Rear Army General.',
    'After further victories he rose to colonel of the swift cavalry and rear army general.',
  ],
  s0158: [
    'At the end of Jianwu he went out as Major of the State-Supporting Army and Magistrate of Runan.',
    'Late in Jianwu he went out as state-supporting army major and magistrate of Runan.',
  ],
  s0159: [
    'When the Qi Prince of Nankang held Jingzhou, Daogong was recommended as Army Aide of the Western Gentlemen and given the additional title General Who Supports the State.',
    'When the Prince of Nankang took Jingzhou, Daogong was recommended as western palace army aide and made general who supports the state.',
  ],
  s0160: [
    'At the beginning of Tianjian, for merit he was enfeoffed as Marquis of Hanshou with a fief of seven hundred households and advanced to General Who Pacifies the North.',
    'Early in Tianjian, for merit, he was made marquis of Hanshou with seven hundred households and promoted to general who pacifies the north.',
  ],
  s0161: [
    'In year 3 Wei besieged Sizhou; at the time the city held fewer than five thousand men and food would barely last half a year; the Wei army attacked day and night without cease; Daogong met each thrust as it came and beat it back.',
    'In the third year Wei laid siege to Sizhou; fewer than five thousand remained inside, with grain for barely half a year; Wei assaulted without pause, and Daogong turned back every blow.',
  ],
  s0162: [
    'Wei then built great wagons loaded with earth and advanced on all four sides, intending to fill the moat; Daogong lined the moat with tower ships and fighting vessels to receive them, and the Wei men could not advance.',
    'Wei built great carts heaped with earth and pushed from every side to fill the ditch; Daogong set tower ships and battle craft in the moat to meet them, and they could not come on.',
  ],
  s0163: [
    'They also secretly dug covered channels to drain the moat water; Daogong hauled earth in loads and tamped them shut.',
    'They dug hidden channels to draw off the moat; Daogong answered with basket after basket of earth rammed into the breach.',
  ],
  s0164: [
    'The standoff lasted more than a hundred days; those killed and captured before and after were beyond counting.',
    'For more than a hundred days they held; the slain and taken mounted beyond reckoning.',
  ],
  s0165: [
    'Wei built great scaling ladders and battering engines, and the siege grew daily more urgent; Daogong raised an earthen mountain inside the city more than twenty zhang high;',
    'Wei raised siege towers and rams, and the press of attack tightened; inside the walls Daogong piled an earthen hill twenty zhang and more;',
  ],
  s0166: [
    'he made many long spears, two zhang five feet in length, fitted with long blades, and set strong men to stab the Wei soldiers climbing the walls.',
    'he forged long pikes two zhang five feet long with heavy blades and set his stoutest men to spear the Wei climbers on the walls.',
  ],
  s0167: [
    'The Wei army greatly feared this and was about to withdraw.',
    'Wei grew afraid of these weapons and prepared to pull back.',
  ],
  s0168: [
    'It happened that Daogong\'s illness grew grave; he called his elder brother\'s son Sengyi, his younger cousin Ling\'en, and the generals and said: "I have received the state\'s deep grace and could not destroy the bandit horde; my suffering now grows worse and I cannot hold out much longer—you must hold fast unto death and not let me die with regret."',
    'Then Daogong\'s sickness turned mortal; he summoned his nephew Sengyi, his cousin Ling\'en, and the commanders and said, "The state loaded me with favor, yet I could not break the enemy; my pain deepens and the wall cannot stand long—you must die where you stand and leave me no shame in the grave."',
  ],
  s0169: [
    'He also ordered his staff of office brought and told Sengyi: "To bear the mandate beyond the border—on this alone I relied;',
    'He had his credential staff brought and told Sengyi, "I crossed the frontier on this charge alone;',
  ],
  s0170: [
    'since I cannot bear it back to court, I mean to carry it with me in death; let it follow the coffin."',
    'I cannot return it to the throne—then let it go into the earth with me beside the coffin."',
  ],
  s0171: [
    'All wept.',
    'Every man wept.',
  ],
  s0172: [
    'In the fifth month of that year he died.',
    'He died in the fifth month of that year.',
  ],
  s0173: [
    'When Wei learned Daogong was dead, their attacks grew fiercer still.',
    'Learning Daogong was gone, Wei pressed the assault all the harder.',
  ],
  s0174: [
    'Earlier the court had sent Yingzhou Inspector Cao Jingzong with an army to relieve the city; Jingzong reached Zao Gorge and halted his troops without advancing.',
    'The court had already sent Cao Jingzong of Yingzhou with a relief host; Jingzong came to Zao Gorge and camped without moving.',
  ],
  s0175: [
    'By the eighth month grain inside the city was exhausted, and it fell.',
    'In the eighth month the city\'s grain ran out, and Sizhou fell.',
  ],
  s0176: [
    'Edict: "Bearer of the Staff, Commander-in-Chief of the military affairs of Sizhou, General Who Pacifies the North, Inspector of Sizhou, and Founding Marquis of Hanshou Daogong—his capacity and conduct are thorough and careful, his talent and will penetrating and fierce.',
    'An edict said, "Bearer of the staff, commander-in-chief of Sizhou, general who pacifies the north, inspector of Sizhou, and founding marquis of Hanshou, Cai Daogong—his mind was careful, his talent fierce and clear.',
  ],
  s0177: [
    'From the first founding of the royal enterprise he devoted his strength in the western marches.',
    'From the first days of the founding he gave his strength to the western frontier.',
  ],
  s0178: [
    'Receiving appointment on the border, his achievements shone in every post he held.',
    'On the frontier his service shone wherever he was posted.',
  ],
  s0179: [
    'When bandits pressed upon us, he defended with utter loyalty; stratagems issued one after another, and reports of victory came day by day.',
    'When the enemy closed in he held with full loyalty, scheming without rest and sending victory after victory.',
  ],
  s0180: [
    'Alas that, seized by illness, he suddenly fell—yet the defense he left behind held firm and shifted the enemy\'s momentum.',
    'Suddenly illness took him—but the ramparts he left stood, and even in death he turned the season against the foe.',
  ],
  s0181: [
    'Had he not forgotten himself for the state and joined loyalty with steadfast fruit, how could he die yet leave the defense standing, exhausted yet unbent at the last?',
    'Only one who gives himself to the realm and binds loyalty to resolve could die and still keep the city, spent yet unbroken.',
  ],
  s0182: [
    'When I think on this, grief wounds my breast; let special honors be added beyond the usual measure.',
    'My heart grieves at the thought; let his reward exceed the common rule.',
  ],
  s0183: [
    'This too has its constant precedent.',
    'So the rites also command.',
  ],
  s0184: [
    'Let him be posthumously made General Who Pacifies the West; Bearer of the Staff, Commander-in-Chief, Inspector, and Marquis as before; let his coffin be sought out and provisions made as fitting.',
    'Let him be posthumously made general who pacifies the west, with staff, command, inspectorship, and marquisate unchanged; seek out his coffin and grant what the occasion requires.',
  ],
  s0185: [
    '" In year 8 Wei agreed to return Daogong\'s remains; his family exchanged female musicians for them, and he was buried at Xiangyang.',
    '" In the eighth year Wei agreed to send back his body; the family traded court musicians for it, and he was buried at Xiangyang.',
  ],
  s0186: [
    'His son Dan succeeded; he died while Administrator of Hedong.',
    'His son Dan inherited the title and died as administrator of Hedong.',
  ],
  s0187: [
    'Grandson Gu died young, and the fief was abolished.',
    'Grandson Gu died early and the marquisate was extinguished.',
  ],
  s0188: [
    'Yang Gongze, styled Junyi, was from Xi county in Tianshui.',
    'Yang Gongze, styled Junyi, came from Xi county in Tianshui.',
  ],
  s0189: [
    'His father Zhonghuai in the first year of Song Taishi was a general under Yin Yan, Inspector of Yuzhou.',
    'His father Zhonghuai, in the first year of Song Taishi, served as a general under Yin Yan, inspector of Yuzhou.',
  ],
  s0190: [
    'When Yan rebelled, Support-the-State General Liu Xu attacked him; Zhonghuai fought fiercely and died at Hengtang.',
    'When Yan rose in rebellion, Liu Xu, general who supports the state, marched against him; Zhonghuai fought hard and fell at Hengtang.',
  ],
  s0191: [
    'Gongze had followed his father in the army; though not yet of age, he dashed into the ranks, embraced the corpse, and wailed until breath left him for a long while; Xu ordered Zhonghuai\'s head returned.',
    'Gongze was with the army though still a boy; he broke into the line, caught up his father\'s body, and cried until he fainted; Xu had the head sent back.',
  ],
  s0192: [
    'When the burial was done, Gongze walked on foot, carrying the coffin home to his native place, and thereby became renowned.',
    'After the rites he bore the coffin home on foot and won fame for it.',
  ],
  s0193: [
    'He passed through the offices to Supernumerary Regular Attendant.',
    'He rose through office to supernumerary regular attendant.',
  ],
  s0194: [
    'Liangzhou Inspector Fan Bonian appointed him Administrator of Songxi and commandant of the White Horse garrison.',
    'Fan Bonian, inspector of Liangzhou, made him administrator of Songxi and commandant of White Horse garrison.',
  ],
  s0195: [
    'The Di bandit Li Wunu rebelled and attacked White Horse; Gongze held firm for a long time until arrows and grain were spent, then fell to the bandits; he shouted curses at them in a loud voice.',
    'The Di chieftain Li Wunu rose and struck White Horse; Gongze held until shafts and grain were gone, then was taken; he cursed the enemy without lowering his voice.',
  ],
  s0196: [
    'Wunu admired his spirit and treated him all the more generously, inviting him to join in their enterprise.',
    'Wunu honored his courage and treated him well, asking him to serve alongside them.',
  ],
  s0197: [
    'Gongze pretended to agree while plotting against them; when the plot leaked, he fled home on a single horse.',
    'Gongze feigned consent and plotted their ruin; when the plot was discovered he escaped alone on horseback.',
  ],
  s0198: [
    'Liangzhou Inspector Wang Xuanmiao reported the matter in a memorial; Qi Gaodi issued an edict of praise.',
    'Wang Xuanmiao, inspector of Liangzhou, memorialized the court; Qi Gaodi issued an edict commending him.',
  ],
  s0199: [
    'He was made Administrator of Jinshou and in his post was pure, holding himself with integrity.',
    'He was appointed administrator of Jinshou and governed with clean hands.',
  ],
  s0200: [
    'In the Yongming era he was Army Aide on the Northern Garrison staff of the General Who Guards the North.',
    'In the Yongming era he served as army aide on the northern garrison staff under the general who guards the north.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_010_b2.mjs <translation.json>'
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
