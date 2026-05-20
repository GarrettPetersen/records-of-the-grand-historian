#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'When Dan died, Shaoshu attended and escorted the coffin; all praised him for it.',
    'When Dan died, Shaoshu escorted the coffin in person, and everyone praised him.',
  ],
  s0102: [
    'On reaching the capital, Minister of Works Xu Xiaosi saw him and was struck, saying, "A man in the mold of Zu Ti."',
    'At the capital, Minister of Works Xu Xiaosi took notice and said, "This is Zu Ti\'s kind of man."',
  ],
  s0103: [
    'When Gaozu took charge of Sizhou, he appointed Shaoshu Middle Army Aide, with charge of the long patrol, and from then on Shaoshu bound himself closely to him.',
    'When Gaozu held Sizhou, he made Shaoshu Middle Army Aide in charge of the long patrol, and Shaoshu thereafter attached himself closely.',
  ],
  s0104: [
    'When Gaozu left the province and returned to the capital, he dismissed his guests with thanks; Shaoshu alone pressed hard to be allowed to stay.',
    'When Gaozu left the province for the capital and released his guests, Shaoshu alone insisted on remaining.',
  ],
  s0105: [
    'Gaozu said to him, "Your talent will surely find use; I cannot benefit you yet—you should seek another path."',
    'Gaozu told him, "Your talent will surely serve somewhere; I cannot help you yet. You should look elsewhere."',
  ],
  s0106: [
    'Shaoshu said, "Having pledged myself, my loyalty admits no second heart."',
    'Shaoshu said, "I have pledged myself. My loyalty knows no second allegiance."',
  ],
  s0107: [
    'Gaozu firmly would not agree, and so Shaoshu returned to Shouyang.',
    'Gaozu still refused, and Shaoshu went back to Shouyang.',
  ],
  s0108: [
    'Inspector Xiao Yaochang pressed him hard to serve, but in the end Shaoshu would not accept the post.',
    'Inspector Xiao Yaochang pressed him repeatedly, yet Shaoshu never accepted command.',
  ],
  s0109: [
    'Yaochang grew angry and was about to imprison him; rescue and mediation won his release.',
    'Yaochang flew into a rage and meant to imprison him, but others intervened and he was spared.',
  ],
  s0110: [
    'When Gaozu became Inspector of Yongzhou, Shaoshu came west by hidden routes and was appointed Chief of Ningman and Administrator of Fufeng.',
    'When Gaozu took Yongzhou, Shaoshu stole west by back roads and was made Chief of Ningman and Administrator of Fufeng.',
  ],
  s0111: [
    'After Donghun had killed the chief ministers of state, he grew quite suspicious of Gaozu.',
    'Once Donghun had slain the court\'s leading ministers, his suspicion of Gaozu deepened.',
  ],
  s0112: [
    'Shaoshu\'s elder brother Zhi served as Donghun\'s personal attendant in the rear palace; Donghun sent him to Yongzhou, ostensibly to visit Shaoshu, but in truth to set him on Gaozu as an assassin.',
    'Shaoshu\'s brother Zhi was Donghun\'s rear-palace attendant; Donghun sent him to Yongzhou under the pretense of visiting Shaoshu, while secretly ordering him to kill Gaozu.',
  ],
  s0113: [
    'Shaoshu learned of it and secretly reported the matter to Gaozu.',
    'Shaoshu learned the plot and secretly told Gaozu.',
  ],
  s0114: [
    'When Zhi arrived, Gaozu set wine for him at Shaoshu\'s quarters and jested with Zhi, saying, "The court sent you to plot against me. Today\'s idle feast is your best chance to take me."',
    'When Zhi came, Gaozu feasted him at Shaoshu\'s house and said in jest, "The court sent you to kill me. This leisurely banquet is your finest opening."',
  ],
  s0115: [
    'Host and guest laughed aloud together.',
    'Host and guest burst out laughing.',
  ],
  s0116: [
    'He had Zhi climb the city wall and look about the offices; soldiers, weapons, boats, and war-horses—nothing was not ample and strong.',
    'He sent Zhi up on the ramparts to tour the compound: troops, arms, boats, and horses were all lavishly supplied.',
  ],
  s0117: [
    'Zhi withdrew and said to Shaoshu, "Yongzhou\'s strength is not easily taken."',
    'On leaving, Zhi told Shaoshu, "Yongzhou is not a prize easily seized."',
  ],
  s0118: [
    'Shaoshu said, "Brother, when you return, tell the Son of Heaven everything plainly."',
    'Shaoshu said, "Go back and report all of this faithfully to the throne."',
  ],
  s0119: [
    'If brother means to take Yongzhou, I ask only to meet your host with these troops in a single battle.',
    'If you come for Yongzhou, I will meet your army in open battle with these men.',
  ],
  s0120: [
    'He saw his brother off at South Xian; they clung to each other and wept as they parted.',
    'He sent his brother off at South Xian, and the two held each other, weeping, before they separated.',
  ],
  s0121: [
    'When the righteous army rose, he was made General of the Champions, then changed to General of Valiant Cavalry; he followed east to Jiangzhou, while Shaoshu was left to oversee the province and supervise grain transport for Jiang and Xiang—nothing fell short.',
    'When the righteous army rose, he became General of the Champions, then General of Valiant Cavalry, and marched east to Jiangzhou; Shaoshu stayed to govern the province and supply Jiang and Xiang with grain, without a single lapse.',
  ],
  s0122: [
    'At the beginning of Tianjian he entered the capital as Minister of the Guards.',
    'In early Tianjian he entered court as Minister of the Guards.',
  ],
  s0123: [
    'Shaoshu was loyal in serving his lord; of all he heard abroad, not the slightest thread was hidden.',
    'Shaoshu served with absolute loyalty; whatever reached him from outside, he concealed nothing.',
  ],
  s0124: [
    'Whenever he spoke to Gaozu of affairs, if they went well he said, "I am too dull to deserve credit; these are all the sagely lord\'s measures."',
    'When he reported good news to Gaozu, he said, "I am too dull for praise; this is the sagely lord\'s doing alone."',
  ],
  s0125: [
    'If they went ill, he said, "My counsel was shallow; I thought the matter should be thus, and nearly misled the court thereby—my fault is grave."',
    'If matters went wrong, he said, "My judgment was shallow. I thought it should be done this way and nearly led the court astray. The fault is mine."',
  ],
  s0126: [
    'Gaozu trusted and favored him deeply.',
    'Gaozu cherished and relied on him utterly.',
  ],
  s0127: [
    'On his mother\'s death he left office for mourning.',
    'He left office to mourn his mother.',
  ],
  s0128: [
    'Shaoshu\'s nature was utmost in filial piety; Gaozu often sent men to moderate his weeping.',
    'Shaoshu\'s filial devotion ran deep; Gaozu repeatedly sent attendants to restrain his grief.',
  ],
  s0129: [
    'Before long he was recalled as General of the Champions and Right Army Major, enfeoffed as Marquis of Yingdao with a fief of one thousand households.',
    'Soon he returned as General of the Champions and Right Army Major, enfeoffed Marquis of Yingdao with a thousand-household fief.',
  ],
  s0130: [
    'Shortly after he was again Minister of the Guards, with the additional title General of the Champions.',
    'He was soon again Minister of the Guards, also bearing the rank General of the Champions.',
  ],
  s0131: [
    'Because the households of Yingdao county were depleted and in distress, his enfeoffment was changed to Marquis of Dongxing, the fief remaining as before.',
    'As Yingdao\'s households had withered, his title was shifted to Marquis of Dongxing, the fief unchanged.',
  ],
  s0132: [
    'Earlier, Shaoshu had lost his father young; he served his mother and grandmother with a filial name, and toward his elder brother he was reverent and careful.',
    'From youth he had lost his father; he was famed for honoring mother and grandmother, and deferential toward his elder brother.',
  ],
  s0133: [
    'Once he stood in high office, his salary, gifts, and tribute from all quarters he sent entirely to his brother\'s household.',
    'In high rank, every stipend, gift, and tribute went straight to his brother\'s house.',
  ],
  s0134: [
    'In the third year, Wei armies besieged Hefei; Shaoshu in his former title commanded the armies garrisoning Dong Pass. When the affair was settled, he again became Minister of the Guards.',
    'In year three, Wei besieged Hefei; Shaoshu commanded the armies at Dong Pass. After peace returned, he was again Minister of the Guards.',
  ],
  s0135: [
    'Soon after, Yiyang fell to Wei, and Sizhou\'s seat was moved south of the Pass.',
    'Then Yiyang fell to Wei, and the Sizhou headquarters shifted south of the Pass.',
  ],
  s0136: [
    'In the fourth year, Shaoshu was made Bearer of the Staff, General Who Subdues the Barbarians, and Inspector of Sizhou.',
    'In year four he was made Bearer of the Staff, General Who Subdues the Barbarians, and Inspector of Sizhou.',
  ],
  s0137: [
    'Shaoshu raised walls and moats, repaired weapons, opened fields and stored grain, gathered in displaced people—the common folk found peace under him.',
    'He built ramparts, sharpened arms, opened fields, hoarded grain, and received refugees until the people rested easy.',
  ],
  s0138: [
    'By nature he was somewhat proud and quick-tempered, comporting himself as one who held power; yet he could give his heart to others and recommend many men, and the gentry for that reason rallied to him.',
    'He was proud and quick-tempered, mindful of his power, yet open-handed in friendship and generous in recommendations, and scholars gathered to him.',
  ],
  s0139: [
    'In the sixth year he was summoned as Left General, with the additional office Regular Attendant of the Scattered Cavalry and chief rectifier of Si and Yu provinces.',
    'In year six he was recalled as Left General, also Regular Attendant of the Scattered Cavalry and chief rectifier of Si and Yu.',
  ],
  s0140: [
    'When Shaoshu reached home his illness was grave.',
    'By the time Shaoshu reached home, he was desperately ill.',
  ],
  s0141: [
    'An edict appointed him at his dwelling; he was carried back to his office in a litter, and palace envoys with medicine came several times in a single day.',
    'The throne invested him at his house, had him borne back to office in a litter, and sent physicians from court several times a day.',
  ],
  s0142: [
    'In the seventh year he died in his official residence, aged forty-five.',
    'In year seven he died at his government house, forty-five years old.',
  ],
  s0143: [
    'Gaozu meant to attend his lying-in-state, but Shaoshu\'s lane and courtyard were too narrow for the imperial carriage, and so he stopped.',
    'Gaozu wished to visit the bier, but Shaoshu\'s alley was too cramped for the imperial coach, and he desisted.',
  ],
  s0144: [
    'The edict read: "To recall the dead and honor merit is what former kings held dear;',
    'The edict said, "To honor the dead and reward merit is what former kings treasured;',
  ],
  s0145: [
    'to keep faith with the loyal across ages is the same rule in every time."',
    'to hold fast to old loyalty across ages is one law for every dynasty."',
  ],
  s0146: [
    'Regular Attendant of the Scattered Cavalry, Right Guard General, and Marquis of Dongxing, Shaoshu, stood upright and pure in person, loyal and earnest in serving his lord; through long service at the frontier court his merit and feeling were plain to see.',
    'Shaoshu, Regular Attendant of the Scattered Cavalry, Right Guard General, and founding Marquis of Dongxing, was upright in conduct and utterly loyal; from long service on the frontier his devotion and deeds shone clear.',
  ],
  s0147: [
    'From the righteous beginning he truly raised lofty achievement; as shepherd of the borderlands the good he wrought where he ruled was manifest.',
    'From the first rising of the righteous cause he won great merit; governing the marches, his achievements where he served were evident.',
  ],
  s0148: [
    'He was just then to receive further trust and share in the work of the heart and backbone;',
    'He was on the verge of greater trust, to stand at the ruler\'s right hand;',
  ],
  s0149: [
    'suddenly he fell to death and ruin, and grief pierced the breast."',
    'when suddenly he fell—grief cuts to the bone."',
  ],
  s0150: [
    'He should receive added honors and this exalted bestowal.',
    'Let him receive added honors and this lofty posthumous grace.',
  ],
  s0151: [
    'He may be posthumously made Regular Attendant of the Scattered Cavalry and General of the Guards, with one set of martial music, Eastern Garden secret rites, one court robe, one suit of garments, and whatever the funeral requires supplied as needed.',
    'Posthumously: Regular Attendant of the Scattered Cavalry and General of the Guards, with martial music, Eastern Garden rites, court robes, a full suit, and whatever the funeral demands supplied at need.',
  ],
  s0152: [
    'His posthumous title was Loyal."',
    'His temple name was Loyal."',
  ],
  s0153: [
    'After Shaoshu\'s death, Gaozu once said tearfully to the court, "Zheng Shaoshu set his will on loyal fierceness; when things went well he praised his lord, when they went ill he took the blame on himself—today there is scarcely his equal."',
    'After Shaoshu died, Gaozu once told the court through tears, "Zheng Shaoshu lived for loyalty; in success he praised his lord, in failure he blamed himself. I doubt we shall see his like again."',
  ],
  s0154: [
    'Such was the measure of his esteem and regret.',
    'So deeply was he valued and mourned.',
  ],
  s0155: [
    'His son Zhen inherited the title.',
    'His son Zhen succeeded.',
  ],
  s0156: [
    'Lü Sengzhen',
    'Lü Sengzhen',
  ],
  s0157: [
    'Lü Sengzhen, style name Yuanyu, was a native of Fan in Dongping commandery.',
    'Lü Sengzhen, styled Yuanyu, came from Fan in Dongping.',
  ],
  s0158: [
    'His family had long dwelt in Guangling.',
    'His clan had lived in Guangling for generations.',
  ],
  s0159: [
    'He rose from cold poverty.',
    'He rose from humble want.',
  ],
  s0160: [
    'As a boy, when he followed his teacher in study, a physiognomist surveyed all the pupils and, pointing at Sengzhen, told the master, "This one has an extraordinary voice; he has the look of one enfeoffed."',
    'Still a boy at his teacher\'s school, a physiognomist reviewed the pupils, pointed at Sengzhen, and told the master, "That voice is not ordinary. He has the bearing of a man who will be enfeoffed."',
  ],
  s0161: [
    'Past twenty, he attached himself to Song\'s Administrator of Danyang, Liu Bing; after Bing was executed, he served the founding Emperor Wen as a clerk in the Secretariat gate.',
    'Past twenty he served Song\'s Danyang administrator Liu Bing; after Bing\'s death he entered the founding Emperor Wen\'s gate as a Secretariat clerk.',
  ],
  s0162: [
    'He stood seven feet five inches; his bearing was very imposing.',
    'He was seven feet five inches tall, with a commanding presence.',
  ],
  s0163: [
    'Among his peers he seldom treated anyone lightly; his colleagues all respected him.',
    'Among equals he rarely indulged in familiarity; his fellows all honored him.',
  ],
  s0164: [
    'When the founding emperor was Inspector of Yuzhou, he made Sengzhen Master of Documents with concurrent charge of Mengling, and in office he answered his post.',
    'When the founding emperor held Yuzhou, he made Sengzhen Master of Documents and concurrent Magistrate of Mengling, and he performed well.',
  ],
  s0165: [
    'When the founding emperor moved to command the guards, Sengzhen was appointed chief clerk.',
    'When the founding emperor took command of the guards, Sengzhen became chief clerk.',
  ],
  s0166: [
    'When the sorcerer-rebel Tang Yu raided Dongyang, the founding emperor led troops east to attack and had Sengzhen oversee the army\'s bureau of affairs on the march.',
    'When the sorcerer rebel Tang Yu struck Dongyang, the founding emperor marched east and put Sengzhen in charge of the army\'s marching bureau.',
  ],
  s0167: [
    'Sengzhen\'s house lay east of the Jianyang Gate; from the day he took the commission to march, each day his route passed the Jianyang Gate road and never turned in at his private quarters—the founding emperor trusted him all the more for it.',
    'His home stood east of Jianyang Gate; from the day he was ordered out, his road passed the gate daily and never turned homeward, and the founding emperor prized him the more.',
  ],
  s0168: [
    'When he became Administrator of Danyang, he was again ordered to be the commandery\'s chief postal inspector.',
    'As Administrator of Danyang he was again made the commandery\'s chief postal inspector.',
  ],
  s0169: [
    'When Qi\'s Prince of Sui, Zilong, went out as Inspector of Jingzhou, Qi Wudi made Sengzhen his guard captain and he followed to the province.',
    'When Qi\'s Prince of Sui Zilong went to Jing as inspector, Qi Wudi made Sengzhen his guard captain on the march to the province.',
  ],
  s0170: [
    'In the ninth year of Yongming, Inspector of Yongzhou Wang Huan rebelled; an edict sent Sengzhen under the Pacifying-the-North General Cao Hu west as Master of Documents, with concurrent charge of Xincheng.',
    'In Yongming year nine, Yongzhou inspector Wang Huan rebelled; Sengzhen was sent west under Pacifying-the-North General Cao Hu as Master of Documents, with concurrent magistracy of Xincheng.',
  ],
  s0171: [
    'When Wei armies raided north of the Mian, Minister of Works Chen Xianda went out to attack; at first sight he was struck and, dismissing others, called Sengzhen to the upper seat and said, "You have a noble countenance; later you will not diminish—strive hard."',
    'When Wei raided north of the Mian, Minister of Works Chen Xianda took the field; at first meeting he was astonished, dismissed the room, seated Sengzhen above, and said, "You bear a noble face. Your later days will not fade. Drive yourself."',
  ],
  s0172: [
    'In the second year of Jianwu, Wei launched a great southern invasion on five routes at once.',
    'In Jianwu year two, Wei invaded south on a great scale, five armies advancing together.',
  ],
  s0173: [
    'Gaozu led troops to relieve Yiyang; Sengzhen followed in the army.',
    'Gaozu marched to relieve Yiyang, and Sengzhen went with the host.',
  ],
  s0174: [
    'The Prince of Changsha, Xuanwu King, was then Inspector of Liangzhou.',
    'The Prince of Changsha, the Xuanwu King, then held Liangzhou.',
  ],
  s0175: [
    'Wei besieged for months on end; spies could not pass anywhere, and the road between Yiyang and Yongzhou was cut.',
    'Wei besieged month after month; no spy could get through, and the road from Yiyang to Yongzhou was severed.',
  ],
  s0176: [
    'Gaozu wished to send an envoy to Xiangyang to seek word of Liangzhou; all feared the journey and none dared go, but Sengzhen pressed to go as envoy and that very day set out alone in a single boat.',
    'Gaozu meant to send someone to Xiangyang for news of Liangzhou; all shrank from the road, but Sengzhen insisted and that same day sailed alone upstream.',
  ],
  s0177: [
    'Once he reached Xiangyang he hurried the relief armies and also obtained the Xuanwu King\'s letter before returning; Gaozu praised him highly.',
    'At Xiangyang he drove the relief forces, secured the Xuanwu King\'s letter, and returned; Gaozu commended him in the highest terms.',
  ],
  s0178: [
    'When the affair was settled, he was appointed Supervisor of the Forest of Feathers.',
    'After peace he was made Supervisor of the Forest of Feathers.',
  ],
  s0179: [
    'When Donghun took the throne, Minister of Works Xu Xiaosi managed court affairs and wished to work with him; Sengzhen judged that security would not last and in the end did not go.',
    'When Donghun succeeded, Xu Xiaosi ran the government and sought his help; Sengzhen guessed the ground would not hold and never went.',
  ],
  s0180: [
    'By then Gaozu already held Yongzhou; Sengzhen pressed hard to return west and was appointed Magistrate of Zou.',
    'Gaozu already held Yongzhou; Sengzhen begged to go west and was made Magistrate of Zou.',
  ],
  s0181: [
    'Once he arrived, Gaozu appointed him Middle Army Aide and entrusted him as heart and backbone.',
    'On arrival Gaozu made him Middle Army Aide and trusted him as his right hand.',
  ],
  s0182: [
    'Sengzhen secretly nurtured men willing to die for him; those who came to him were very many.',
    'Sengzhen quietly gathered men who would die for him, and a great host rallied.',
  ],
  s0183: [
    'Gaozu gathered many fierce fighters; scholars and commoners answered the call, and those who assembled were more than ten thousand. He therefore ordered a survey of open ground west of the city wall, intending to raise several thousand rooms as lodging, felling much timber and bamboo and sinking it in the Tanxi, heaping thatch in mounds like hills—all unused.',
    'Gaozu drew fierce fighters until more than ten thousand gathered; he had the open ground west of the wall surveyed for thousands of lodgings, cut timber and bamboo and sank it in Tan Creek, and piled thatch into hillocks—yet used none of it.',
  ],
  s0184: [
    'Sengzhen alone grasped the intent and on his own also prepared several hundred oars.',
    'Sengzhen alone understood the plan and privately stockpiled hundreds of oars.',
  ],
  s0185: [
    'When the righteous army rose, Gaozu summoned Sengzhen and Zhang Hongce by night to fix the plan; at dawn he mustered the host and marched, taking all the Tanxi timber and bamboo, fitting it as war-boats and thatching them with straw—everything ready at once.',
    'When the righteous army rose, Gaozu called Sengzhen and Zhang Hongce at night to decide; at dawn the host moved out, pulled up the Tanxi timber and bamboo, rigged them as warships roofed with thatch, and had all in an instant.',
  ],
  s0186: [
    'As the armies were about to march, the generals indeed quarreled over oars; Sengzhen then produced those he had prepared beforehand, giving two to each boat, and the quarrel ceased.',
    'As the armies prepared to sail, the generals fought over oars; Sengzhen brought out his hidden store, two oars per vessel, and the dispute died.',
  ],
  s0187: [
    'Gaozu made Sengzhen Supporting-the-State General and Colonel of the Footmen; he went in and out of the sleeping quarters, conveying the lord\'s intent.',
    'Gaozu made him Supporting-the-State General and Colonel of Footmen, entering the inner quarters to speak the ruler\'s mind.',
  ],
  s0188: [
    'When the army reached Ying city, Sengzhen led his command to camp at the Crescent Fortress; soon after he advanced and seized Qicheng.',
    'At Ying, Sengzhen encamped his men at Crescent Fortress, then pressed forward and took Qicheng.',
  ],
  s0189: [
    'When Yingzhou was pacified, Gaozu advanced Sengzhen to Grand General of the Vanguard.',
    'After Ying fell, Gaozu promoted him to Grand General of the Vanguard.',
  ],
  s0190: [
    'The great host halted at Jiangning; Gaozu ordered Sengzhen and Wang Mao to lead picked troops to seize the Red Nose Ford first.',
    'The army stopped at Jiangning; Gaozu sent Sengzhen and Wang Mao with elite troops to take Red Nose Ford first.',
  ],
  s0191: [
    'That day, Donghun\'s general Li Jushi came with his host to fight; Sengzhen and the others intercepted and broke them utterly.',
    'That day Donghun\'s general Li Jushi brought his force to battle; Sengzhen intercepted and shattered them.',
  ],
  s0192: [
    'Then he and Mao advanced to Whiteboard Bridge and raised a fortress; once the ramparts stood, Mao moved his camp to Yuecheng while Sengzhen alone held Whiteboard.',
    'He and Mao pushed to Whiteboard Bridge and built a fort; when it stood, Mao shifted to Yuecheng and Sengzhen held Whiteboard alone.',
  ],
  s0193: [
    'Li Jushi secretly reconnoitered and knew the defenders were few; he led ten thousand crack troops and came straight to press the wall.',
    'Li Jushi spied and saw how thin the garrison was; he led ten thousand elite men straight against the walls.',
  ],
  s0194: [
    'Sengzhen told his officers and men, "Our strength cannot match them now; we must not give battle;',
    'Sengzhen told the troops, "We are too few to fight them head-on;',
  ],
  s0195: [
    'nor shoot at them from afar—wait until they reach the moat, then strike with combined force and break them."',
    'and we must not loose arrows from afar. When they reach the ditch, we break them together."',
  ],
  s0196: [
    'Before long they all crossed the ditch and tore up the palisade; Sengzhen sent men up on the wall, stones and arrows flying together, while he himself led three hundred horse and foot out behind them; the defenders on the corners also leaped down from the wall, and inner and outer struck together—Jushi scattered at once, and captured arms and armor beyond counting.',
    'Soon they crossed the moat and wrenched down the stakes; Sengzhen put men on the wall with stones and arrows raining, led three hundred horse and foot around their rear, and had the corner guards leap down as well—inner and outer struck as one, Jushi fled instantly, and arms taken were beyond reckoning.',
  ],
  s0197: [
    'Sengzhen again advanced and seized Yuecheng.',
    'Sengzhen pressed on and took Yuecheng.',
  ],
  s0198: [
    'Donghun\'s great general Wang Zhenguo drew up chariots as camps, with their backs to the Huai in battle array.',
    'Donghun\'s great general Wang Zhenguo formed chariot encampments with his back to the Huai.',
  ],
  s0199: [
    'Wang Mao and the other hosts attacked; Sengzhen sent fire-chariots to burn their camps.',
    'Wang Mao and the allied armies struck; Sengzhen rolled fire-chariots against the camps and burned them.',
  ],
  s0200: [
    'That same day the enemy lines collapsed.',
    'That same day the enemy host dissolved.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_011_b2.mjs <translation.json>'
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
