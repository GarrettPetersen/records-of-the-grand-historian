#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'At court, though noble and eminent, his nature was frugal and spare; the house where he lived had no enclosing walls raised, no attendants or guards, and when one entered it was bleak as a plain scholar\'s poverty.',
    'At court he was great in rank yet spare in habit; he built no compound walls, kept no guards, and his rooms looked as bare as any poor scholar\'s.',
  ],
  s0102: [
    'At the time people admired his restraint; Gaozu also held him in high esteem.',
    'Men praised his modesty; Gaozu prized him as well.',
  ],
  s0103: [
    'In humble days he had not studied; once ennobled he read books in rough fashion, calling himself short on letters and often admiring Zhou Bo\'s weightiness.',
    'He had never studied in youth; after rank came to him he read a little, called himself unlettered, and often spoke of Zhou Bo\'s solid bearing.',
  ],
  s0104: [
    'In the sixteenth year he was again given brevet staff and made Area Commander of Yuzhou military affairs, Trustworthy Martial General, and Yuzhou Inspector.',
    'In year sixteen he again received brevet staff, command of Yuzhou forces, the title Trustworthy Martial General, and the inspector\'s seal.',
  ],
  s0105: [
    'Before he set out, Gaozu led the court in a farewell feast for Daogen at Wude Hall, summoned artisans to observe him, and had them paint his likeness.',
    'On the eve of his departure Gaozu feasted him at Wude Hall, called in painters to study his face, and ordered his portrait made.',
  ],
  s0106: [
    'Daogen, abashed, declined: "What your servant can repay the state is only a life left over;',
    'Daogen flushed and refused: "All I can still offer the realm is whatever life remains;',
  ],
  s0107: [
    'but the realm is at peace, and your servant grieves that there is no place worthy to die."',
    'yet the world is at peace, and I mourn that there is nowhere left to spend it."',
  ],
  s0108: [
    'Yuzhou welcomed Daogen back and all rejoiced.',
    'Yuzhou had him again and the people rejoiced.',
  ],
  s0109: [
    'Gaozu often said: "Wherever Feng Daogen is, the court need not remember there is still a province."',
    'Gaozu would say, "With Feng Daogen in place, the throne forgets it still holds a province."',
  ],
  s0110: [
    'Kang Xuan, styled Changming, was a native of Lantian in Hua Mountain.',
    'Kang Xuan, styled Changming, came from Lantian on Hua Mountain.',
  ],
  s0111: [
    'His ancestors came out of Kangju.',
    'His line sprang from Kangju.',
  ],
  s0112: [
    'At first Han set a Protector-General and made all the Western Regions submit.',
    'In early Han a Protector-General was set and the western lands were brought to heel.',
  ],
  s0113: [
    'Kangju too sent a hostage prince to wait on the edicts at Hexi and so remained as common folk; afterward they took Kang as surname.',
    'Kangju also sent a royal hostage to wait on the court at Hexi and stayed as settlers; later they took Kang for their name.',
  ],
  s0114: [
    'In Jin times turmoil rose in Longyou and the Kang clan moved to Lantian.',
    'Under Jin, Longyou fell into chaos and the Kang moved to Lantian.',
  ],
  s0115: [
    'Xuan\'s great-grandfather served as Fu Jian\'s crown-prince household steward and begat Mu; Mu became Yao Chang\'s Henan Intendant.',
    'His great-grandfather served Fu Jian\'s heir as household steward and begat Mu, who became Yao Chang\'s Henan intendant.',
  ],
  s0116: [
    'In the early Yongchu era of Song, Mu led more than three thousand families of the township into the south of Xiangyang\'s Xian.',
    'In Song\'s early Yongchu years Mu led three thousand-odd township families south of Xiangyang\'s Xian.',
  ],
  s0117: [
    'Song set up Hua Mountain commandery\'s Lantian county as a lodging in Xiangyang and made Mu Governor of Qin and Liang provinces.',
    'Song lodged them as Lantian county in Hua Mountain commandery at Xiangyang and named Mu governor of Qin and Liang.',
  ],
  s0118: [
    'Before he took the appointment he died.',
    'He died before he could take the post.',
  ],
  s0119: [
    'Xuan\'s paternal uncle Yuanlong and father Yuanfu were both pushed forward by the displaced and in turn became Hua Mountain Administrator.',
    'His uncle Yuanlong and father Yuanfu, leaders among the exiles, each in turn held Hua Mountain.',
  ],
  s0120: [
    'Xuan from youth was bold and high-spirited.',
    'From youth Xuan was bold and full of purpose.',
  ],
  s0121: [
    'When Qi Wendi was Yongzhou Inspector his recruits were all drawn from great houses; Xuan alone was summoned for talent as Western Bureau Secretary.',
    'When Qi Wendi governed Yongzhou he took only men of great families; Xuan alone entered as Western Bureau secretary on merit.',
  ],
  s0122: [
    'In the third year of Yongming he was made Court Attendant.',
    'In Yongming year three he became court attendant.',
  ],
  s0123: [
    'When Wendi was in the Eastern Palace he drew him in for old favor as Palace Guard Attendant; he left office on his mother\'s mourning.',
    'Wendi in the Eastern Palace recalled him as guard attendant; he left for his mother\'s mourning.',
  ],
  s0124: [
    'When mourning ended he was made Quelling Might General and Hua Mountain Administrator.',
    'After mourning he became Quelling Might General and Hua Mountain administrator.',
  ],
  s0125: [
    'He won the wasted land with sincerity and gentle rule.',
    'He ruled the ravaged district with open hand and honest heart until it was glad to obey.',
  ],
  s0126: [
    'He was transferred to Vanguard General and again made Hua Mountain Administrator.',
    'He rose to vanguard general and again held Hua Mountain.',
  ],
  s0127: [
    'In the first year of Yongyuan the righteous army rose; Xuan raised the commandery to answer Gaozu, himself leading three thousand daredevils and two hundred fifty private horses to follow.',
    'In Yongyuan year one the righteous army rose; Xuan raised his commandery for Gaozu and led three thousand bold men and two hundred fifty horses of his own.',
  ],
  s0128: [
    'He was made Central Army Staff Officer to the Prince of Nankang of the Western Corps, with the added title Assists-the-State General.',
    'He was made staff officer to the Prince of Nankang and given the added rank Assists-the-State General.',
  ],
  s0129: [
    'As the righteous host besieged Zhang Chong at Yingcheng day after day without end, Donghun\'s general Wu Ziyang walled at Jiahu with a very sharp army; Xuan followed Wang Mao and stormed him to slaughter.',
    'While the loyal army pinned Zhang Chong at Yingcheng, Donghun\'s Wu Ziyang held Jiahu with a fierce host; Xuan rode with Wang Mao and broke them in the slaughter.',
  ],
  s0130: [
    'From then on he often led mobile troops, rushing wherever need pressed, and his beheadings and captures were many.',
    'After that he usually led flying columns, answering every alarm, and his kills and captures piled high.',
  ],
  s0131: [
    'In the first year of Tianjian he was enfeoffed as Baron of Nan\'an with a fief of three hundred households.',
    'In Tianjian year one he was made Baron of Nan\'an, three hundred households.',
  ],
  s0132: [
    'He was made Assists-the-State General and Administrator of Jingling.',
    'He became assists-the-state general and Jingling administrator.',
  ],
  s0133: [
    'When Wei besieged Liang province, Inspector Wang Zhenguo sent asking rescue; Xuan led the commandery troops to him and the Wei army withdrew.',
    'Wei besieged Liangzhou; Wang Zhenguo called for aid; Xuan marched with the commandery levy and Wei drew off.',
  ],
  s0134: [
    'In the seventh year the three passes of Si province were pressed by Wei; an edict gave Xuan brevet staff and Martial Host General to lead troops to relieve them.',
    'In year seven Wei pressed Si\'s three passes; Xuan received brevet staff and Martial Host General and marched to relieve them.',
  ],
  s0135: [
    'In the ninth year he was transferred to brevet staff, Area Commander of North Yanzhou forces along the Huai, Quelling Distance General, and North Yanzhou Inspector.',
    'In year nine he took brevet staff, command along the Huai frontier, Quelling Distance General, and North Yanzhou.',
  ],
  s0136: [
    'When fugitives at Mount Xiong surrendered the city to Wei, Xuan galloped and sent his Major Huo Fengbo to divide the army and hold the passes.',
    'When Mount Xiong\'s outlaws handed their walls to Wei, Xuan sent Major Huo Fengbo ahead to seize the heights.',
  ],
  s0137: [
    'The Wei army came but could not cross beyond Xiong city.',
    'Wei came and could not pass Xiong city.',
  ],
  s0138: [
    'The next year Qing province Inspector Zhang Ji was killed by the local man Xu Daojiao; Xuan again sent Major Mao Rongbo to suppress and settle it.',
    'Next year Zhang Ji of Qingzhou was killed by Xu Daojiao; Xuan sent Major Mao Rongbo to crush the revolt.',
  ],
  s0139: [
    'He was summoned as Chief of Staff to the Prince of Linchuan, Pacifies-the-Frontier Cavalry General, and soon transferred to Vermilion-Robe Palace Attendant.',
    'He entered service as the Prince of Linchuan\'s chief of staff and left valiant cavalry general, then became vermilion-robe attendant.',
  ],
  s0140: [
    'In the thirteenth year he was made Crown Prince Right Guard Leader with a hundred men in armor, dwelling in the palace with Area Commander Xiao Jingzhi.',
    'In year thirteen he became crown prince right guard leader with a hundred armored men, on palace duty with Xiao Jingzhi.',
  ],
  s0141: [
    'Xuan stood eight feet tall with peerless looks; though he held high office he still practiced martial arts.',
    'Xuan stood eight feet, unmatched in bearing, and still drilled in arms though he wore high rank.',
  ],
  s0142: [
    'When Gaozu visited Deyang Hall for horse games he ordered Xuan to shoot from horseback; he drew the bow and pierced the mark, and the watchers were pleased.',
    'Gaozu watched horse games at Deyang Hall and bade Xuan shoot from the saddle; his arrow struck true and the court was delighted.',
  ],
  s0143: [
    'That day the emperor had a painter draft Xuan\'s form and sent a palace emissary holding it to ask, "Do you know this picture?"',
    'That day he had artists paint Xuan and sent an emissary with the scroll: "Do you know this face?"',
  ],
  s0144: [
    'Such was the degree of his favor.',
    'So close was he to the throne.',
  ],
  s0145: [
    'At the time the Wei surrenderer Wang Zu offered a plan to dam the Huai and flood Shouyang.',
    'Then Wang Zu, a man who had come over from Wei, urged damming the Huai to drown Shouyang.',
  ],
  s0146: [
    'Zu quoted a northern children\'s rhyme: "Jing Mountain is the upper gate, Floating Mountain the lower gate, Tong and Tuo the rushing ditch, together flooding Juye marsh."',
    'Zu quoted a northern rhyme: "Jing Mountain the upper gate, Floating Mountain the lower, Tong and Tuo the rushing trench, flooding Juye as one."',
  ],
  s0147: [
    'Gaozu thought it sound and sent hydraulic engineers Chen Chengbai and Works General Zu Chong to view the ground; all said the Huai\'s sand and silt were light and drifting, not firm, and the work could not succeed.',
    'Gaozu agreed and sent Chen Chengbai and Zu Chong to survey; all said the Huai\'s sand was loose and shifting and the work would never hold.',
  ],
  s0148: [
    'Gaozu would not accept it and mobilized men of Xu and Yang, taking one man from every five households of twenty.',
    'Gaozu overruled them and drafted Xu and Yang, one man from every five households in a group of twenty.',
  ],
  s0149: [
    'Xuan was given brevet staff and made Area Commander of all Huai military affairs, also overseeing the dam works; laborers and fighting men together numbered two hundred thousand.',
    'Xuan received brevet staff, command on the Huai, and oversight of the dam—two hundred thousand workers and soldiers together.',
  ],
  s0150: [
    'South of Zhongli they raised Floating Mountain, north to Jieshi, piling earth along the banks until the ridge met in midstream.',
    'South of Zhongli they built Floating Mountain north to Jieshi, heaping earth along the shore until the crests joined in mid-river.',
  ],
  s0151: [
    'In the fourteenth year, as the dam was about to close, the Huai raced wild and broke open again and again; the masses were distressed.',
    'In year fourteen, as the dam neared closure, the Huai surged and tore it open again and again, and the workers despaired.',
  ],
  s0152: [
    'Some said the Yangtze and Huai held many flood-dragons that ride wind and rain to burst banks and cliffs and hate iron; so they brought iron from east and west smelters, great cauldrons and tripods down to hoes, tens of millions of pounds, and sank them at the dam site.',
    'Some said dragons of the Jiang and Huai ride storms to burst earthworks and loathe iron; they hauled tens of millions of pounds of cauldrons, tripods, and hoes from eastern and western forges and sank them into the breach.',
  ],
  s0153: [
    'Still it would not close; then they felled trees for well-curb frames, filled them with great stones, and heaped earth above.',
    'Still the waters would not join; then they cut timber into well-curb cages, packed them with boulders, and piled earth on top.',
  ],
  s0154: [
    'For a hundred li along the Huai, hill and wood and stone, none great or small, were utterly exhausted; bearers\' shoulders were worn through.',
    'For a hundred li along the Huai every hill and tree and stone, large or small, was stripped bare; porters\' shoulders wore to the bone.',
  ],
  s0155: [
    'In summer plague raged; the dead lay pillow to pillow and flies and gnats droned day and night as one sound.',
    'Summer brought plague; corpses lay stacked and flies and gnats hummed without cease.',
  ],
  s0156: [
    'Gaozu pitied the laborers\' long toil and sent Right Vice Director of the Masters of Writing Yuan Ang and Attendant Xie Ju with brevet staff to comfort them and grant tax relief.',
    'Gaozu pitied their long labor and sent Yuan Ang and Xie Ju with brevet staff to comfort the workers and lighten their taxes.',
  ],
  s0157: [
    'That winter cold was fierce too; the Huai and Si froze solid; soldiers died seven or eight in ten; Gaozu again sent gifts of coats and trousers.',
    'Winter froze the Huai and Si; seven or eight in ten soldiers died of cold; Gaozu sent coats and trousers again.',
  ],
  s0158: [
    'In the eleventh month Wei sent General Yang Dayan, proclaiming he would burst the dam; Xuan ordered the armies to strike camp and bivouac in the open to await him.',
    'In the eleventh month Yang Dayan of Wei boasted he would break the dam; Xuan had the hosts break camp and wait in the open.',
  ],
  s0159: [
    'He sent his son Yue to offer challenge and beheaded Wei\'s Prince of Xianyang Household Major Xu Fangxing; the Wei army drew back a little.',
    'He sent his son Yue to fight; Yue slew Xu Fangxing, major of the Prince of Xianyang\'s household, and Wei fell back a little.',
  ],
  s0160: [
    'In the twelfth month Wei sent Vice Director of the Masters of Writing Li Xianding to supervise the host in battle; Xuan with Xuzhou Inspector Liu Sigu and others faced them.',
    'In the twelfth month Li Xianding of Wei led the armies; Xuan and Liu Sigu of Xuzhou met them.',
  ],
  s0161: [
    'Gaozu also sent Right Guard General Chang Yizhi, Grand Master of the Stud Yu Hongwen, Palace Attendant Cao Shizong, and Xu Yuanhe in succession to hold the line.',
    'Gaozu sent Chang Yizhi, Yu Hongwen, Cao Shizong, and Xu Yuanhe in turn to reinforce the defense.',
  ],
  s0162: [
    'In the fifteenth year, fourth month, the dam was finished at last.',
    'In year fifteen, fourth month, the dam closed at last.',
  ],
  s0163: [
    'It ran nine li long, one hundred forty zhang wide below, forty-five zhang wide above, twenty zhang high, nineteen zhang five chi deep.',
    'It stretched nine li, one hundred forty zhang at the base, forty-five at the crown, twenty high, nineteen zhang five chi deep.',
  ],
  s0164: [
    'Dikes flanked it and qi willow was planted together; soldiers settled in peace, ranked along its top.',
    'Banks were flanked with dikes and planted with qi willow; the troops camped in ranks along the crest.',
  ],
  s0165: [
    'Its water was clear; looking down one saw the tombs of those who dwelt below, every one plain beneath.',
    'The water ran clear; looking down you could see the graves of the living below as if on a map.',
  ],
  s0166: [
    'Someone said to Xuan: "The four waterways are Heaven\'s way of regulating breath; they cannot be blocked long.',
    'A man told Xuan, "The four great rivers are how Heaven vents its breath—they cannot stay dammed forever.',
  ],
  s0167: [
    'If you cut the sluice to flow east, the wandering flood will spread wide and slow, and the dam may endure."',
    'Open the sluice eastward and the flood will spread and ease—the dam may hold."',
  ],
  s0168: [
    'Xuan agreed and opened the sluice to the east.',
    'Xuan agreed and cut the eastern sluice.',
  ],
  s0169: [
    'He also planted false reports in Wei: "What men of Liang fear is opening the sluice; they do not fear field battle."',
    'He also fed Wei a lie: "Liang fears the sluice, not open battle."',
  ],
  s0170: [
    'The Wei men believed it and indeed cut the mountain five zhang deep, opening the sluice to pour north; water divided day and night yet the sluice did not lessen.',
    'Wei believed him and dug five zhang into the mountain, opening the sluice north; water split day and night yet the sluice barely fell.',
  ],
  s0171: [
    'That month the Wei army at last broke and returned.',
    'That month Wei broke and marched home.',
  ],
  s0172: [
    'Where the waters reached, land along both banks of the Huai for several hundred li was flooded.',
    'The flood spread several hundred li along both banks of the Huai.',
  ],
  s0173: [
    'Wei\'s Shouyang garrison slowly shifted its halt to Eight-Dukes Mountain; south of this the inhabitants scattered to hills and ridges.',
    'Wei\'s Shouyang garrison drew back toward Eight-Dukes Mountain; south of there people fled to the hills.',
  ],
  s0174: [
    'At first, when the dam rose on the border of Xuzhou, Inspector Zhang Baozi proclaimed within his circuit that he himself would surely oversee the work.',
    'When the dam began on Xuzhou soil, Inspector Zhang Baozi announced in his district that the work was his to command.',
  ],
  s0175: [
    'Afterward Xuan came in another office to supervise construction and Baozi was deeply ashamed.',
    'Then Xuan arrived in another post to oversee the work and Baozi burned with shame.',
  ],
  s0176: [
    'Soon an edict made Baozi accept Xuan\'s command; in every matter he first consulted him, and from this he slandered Xuan as trafficking with Wei; Gaozu did not accept it, yet when the work ended still summoned Xuan away.',
    'Soon Baozi was ordered under Xuan\'s command and had to consult him on everything; he then accused Xuan of dealing with Wei; Gaozu dismissed the charge but recalled Xuan when the work was done.',
  ],
  s0177: [
    'Before long Xuan was made Holder of Staff, Area Commander of Si province military affairs, Trustworthy Martial General, Si Inspector, and concurrently Administrator of Anlu, with two hundred added households on his fief.',
    'Soon he took staff, command of Si, Trustworthy Martial General, the inspectorate, Anlu as well, and two hundred added households.',
  ],
  s0178: [
    'After Xuan left, Baozi did not maintain the dam; by autumn in the eighth month the Huai swelled violently and the dam broke entirely, rushing to the sea, and Zu Chong was imprisoned.',
    'After Xuan left, Baozi let the dam rot; in autumn of the eighth month the Huai burst and the whole work collapsed into the sea, and Zu Chong went to prison.',
  ],
  s0179: [
    'Xuan held the province three years, greatly repairing walls and moats, and was known for stern rule.',
    'For three years in office he rebuilt walls and ditches and was famed for stern government.',
  ],
  s0180: [
    'Xuan was easy and seldom fearful; at court he seemed before others as if he could not speak, and was called long in forbearance.',
    'Xuan was mild and slow to fear; in court he looked as though he could not find words, and men called him long-suffering.',
  ],
  s0181: [
    'In the ministries, whenever in cold months he saw officials in rags, he would send them padded coats—such was his habit of giving.',
    'In the ministries, whenever winter showed an officer in tatters, he sent a padded coat—so he gave.',
  ],
  s0182: [
    'His son Yue succeeded.',
    'His son Yue inherited.',
  ],
  s0183: [
    'In the fourth year a great northern campaign was launched; the Prince of Linchuan as Yangzhou Inspector directed the armies from Luokou; Yizhi\'s provincial troops accepted his command as vanguard and attacked Wei\'s Liangcheng garrison and took it.',
    'In year four came the great northern expedition; the Prince of Linchuan commanded from Luokou; Yizhi\'s provincial army served as vanguard, stormed Wei\'s Liangcheng garrison, and took it.',
  ],
  s0184: [
    'In the fifth year Gaozu, because the campaign had run long, issued an edict to withdraw the armies; the hosts dispersed each to their own; Wei\'s Prince of Zhongshan Yuan Ying seized the moment to pursue, took Matou, and moved all grain stores within the walls north.',
    'In year five Gaozu ordered withdrawal after the long campaign; as the hosts scattered, Yuan Ying of Wei pursued, seized Matou, and hauled every grain store north.',
  ],
  s0185: [
    'Counselors all said: "Wei is moving grain north; they surely will not march south again."',
    'The counselors said, "Wei hauls grain north—they will not come south again."',
  ],
  s0186: [
    'Gaozu said: "Not so—this is surely an advance in force, not their true intent."',
    'Gaozu said, "No. This is a feint for advance, not retreat."',
  ],
  s0187: [
    'He then sent earthworkers to repair ditches and fortify Zhongli, charging Yizhi to prepare for battle and defense.',
    'He sent laborers to dig trenches and strengthen Zhongli and told Yizhi to ready for siege and defense.',
  ],
  s0188: [
    'That winter Ying indeed led his Prince of Anle Yuan Daoming, Quelling East General Yang Dayan, and a host of several hundred thousand to raid Zhongli.',
    'That winter Ying came with Yuan Daoming, Yang Dayan, and hundreds of thousands to strike Zhongli.',
  ],
  s0189: [
    'Zhongli\'s north was blocked by the Huai; the Wei men built a floating bridge on the west bank of Shaoyang Isle to cross the Huai as a road.',
    'North of Zhongli lay the Huai; Wei built a floating bridge from Shaoyang Isle\'s west bank to cross the river.',
  ],
  s0190: [
    'Ying held the east bank, Dayan the west, and together they pressed the assault on the city.',
    'Ying held the east bank, Dayan the west, and together they besieged the walls.',
  ],
  s0191: [
    'At the time the men in the city were only three thousand; Yizhi directed the defense and met each threat as it came.',
    'Only three thousand men held the city; Yizhi commanded and met each assault where it fell.',
  ],
  s0192: [
    'The Wei army then loaded earth on carts to fill the moat and made the masses carry earth behind them, with stern cavalry from the rear driving them on.',
    'Wei loaded carts with earth for the moat and drove the people forward with earth on their backs, cavalry pressing from behind.',
  ],
  s0193: [
    'Whoever could not turn back in time was buried by the earth they bore; soon the moat was full.',
    'Men who could not turn in time were buried under their own loads; soon the ditch was full.',
  ],
  s0194: [
    'Ying and Dayan themselves directed the fight, attacking bitterly day and night in rotating shifts; men fell and climbed again, none retreating.',
    'Ying and Dayan fought in person, attacking day and night in relays; men fell from the walls and climbed back, none yielding.',
  ],
  s0195: [
    'They also set flying towers and battering rams; wherever they struck, the city earth crumbled.',
    'They raised flying towers and battering rams; each blow shook earth from the walls.',
  ],
  s0196: [
    'Yizhi then patched the gaps with mud; though the rams entered they could not break the wall.',
    'Yizhi smeared the breaches with mud; the rams entered the gap yet could not bring the wall down.',
  ],
  s0197: [
    'Yizhi was skilled at archery; wherever the assault grew desperate he galloped to save it, and every bowshot he loosed felled its man without fail.',
    'Yizhi shot well; wherever the fight turned desperate he rode to it, and every arrow he loosed dropped its man.',
  ],
  s0198: [
    'In a single day they fought several tens of rounds; dead and wounded before and behind ran to the ten thousands, and Wei\'s slain were level with the wall.',
    'They fought dozens of clashes in a day; casualties mounted to the tens of thousands, and Wei\'s dead piled even with the ramparts.',
  ],
  s0199: [
    'In the sixth year, fourth month, Gaozu sent Cao Jingzong and Wei Rui leading two hundred thousand men to rescue them; when they arrived they fought Wei and broke them utterly; Ying, Dayan, and the rest each fled for their lives.',
    'In year six, fourth month, Gaozu sent Cao Jingzong and Wei Rui with two hundred thousand; they met Wei and shattered them; Ying and Dayan fled for their lives.',
  ],
  s0200: [
    'Yizhi then led light troops in pursuit to Luokou and returned.',
    'Yizhi led light horse in pursuit to Luokou and turned back.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_018_b2.mjs <translation.json>'
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
