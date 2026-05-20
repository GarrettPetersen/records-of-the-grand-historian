#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Soon Kan was made Area Commander-in-Chief of all Northern Expedition forces, encamped at Richeng; when Chen Qingzhi lost discipline, the advance halted.',
    'He was soon named northern expedition commander and took post at Richeng, but Chen Qingzhi’s breach of orders stopped the march.',
  ],
  s0102: [
    'That year an edict appointed him Bearer of the Staff, General of the Cloud Banner, and Inspector of Qing and Ji provinces.',
    'The same year brought staff authority, General of the Cloud Banner, and the Qing-Ji inspectorate.',
  ],
  s0103: [
    'In the fourth year of Zhongdatong he was appointed Full Staff Bearer, Area Commander of Xiqiu forces, General Who Pacifies the North, and Inspector of Yanzhou, to join the Grand Commandant Yuan Faseng on the northern campaign.',
    'Zhongdatong year 4 made him full staff bearer, Xiqiu area commander, General Who Pacifies the North, and Yanzhou inspector on Yuan Faseng’s northern campaign.',
  ],
  s0104: [
    'Faseng had first memorialized: “I have old ties with Kan and wish to march together.',
    'Faseng had already written, “Kan and I are old friends—I ask to campaign at his side.',
  ],
  s0105: [
    '” The High Ancestor then summoned Kan to ask strategy; Kan laid out a full plan of conquest.',
    '” The emperor called Kan in for strategy, and Kan set out a complete plan of attack.',
  ],
  s0106: [
    'The High Ancestor then said: “I know you wish to go with the Grand Commandant.',
    'The emperor said, “I know you want to march with the Grand Commandant.',
  ],
  s0107: [
    '” Kan said: “Your servant, having torn himself from the north to return to court, constantly thinks of giving his life, yet in truth I never wished to go with Faseng.',
    '” Kan answered, “Since I came south I have lived to serve—but I never wanted to travel with Faseng.',
  ],
  s0108: [
    'Northerners already call me a Wu man; southerners already call me a barbarian captive—if I now go with Faseng, I am still one flock chasing another, which not only betrays my heart but also makes the Xiongnu despise Han.',
    'The north calls me a southerner; the south calls me a turncoat. Marching with Faseng would still look like birds of a feather—and teach the barbarians to scorn the Han.',
  ],
  s0109: [
    '” The High Ancestor said: “The court now must have you go.',
    '” The emperor said, “The court needs you on this march.',
  ],
  s0110: [
    '” An edict then appointed him Grand Army Marshal.',
    '” He was named Grand Army Marshal by edict.',
  ],
  s0111: [
    'The High Ancestor said to Kan:',
    'The emperor told Kan:',
  ],
  s0112: [
    '“The post of Army Marshal has long been vacant; this time it is set up for you.',
    '“Army Marshal has been empty for years—I restore it for you.',
  ],
  s0113: [
    '” On the march, at Guanzhu, Yuan Shu again lost his army at Qiao.',
    '” At Guanzhu, Yuan Shu lost his force at Qiao.',
  ],
  s0114: [
    'When the campaign ended, he entered court as Palace Attendant.',
    'The expedition over, he returned as Palace Attendant.',
  ],
  s0115: [
    'In the fifth year he was enfeoffed Marquis of Gaochang with a fief of a thousand households.',
    'Year 5 made him Marquis of Gaochang, fief of one thousand households.',
  ],
  s0116: [
    'In the sixth year he went out as General of the Cloud Banner and Grand Administrator of Jin’an.',
    'Year 6 sent him out as General of the Cloud Banner and Jin’an grand administrator.',
  ],
  s0117: [
    'The Min and Yue peoples were prone to rebellion; no former administrator had been able to stop it. When Kan arrived he attacked, beheaded the ringleaders Chen Cheng and Wu Man, and thereafter the commandery was quiet and none dared offend.',
    'Min-Yue custom bred revolt; no prior governor had quelled it. Kan struck, killed the chiefs Chen Cheng and Wu Man, and the district went still—none dared raise a hand.',
  ],
  s0118: [
    'Before long he was summoned as Left Commandant of the Heir Apparent’s Guard.',
    'Soon he was recalled as Left Commandant of the Heir Apparent’s Guard.',
  ],
  s0119: [
    'In the third year of Datong the imperial carriage visited the Leyou Gardens; Kan was among those feasted.',
    'Datong year 3 brought the emperor to Leyou Gardens; Kan joined the feast.',
  ],
  s0120: [
    'The Palace Storehouse then reported that a new double-edged spear was complete, twenty-four feet long and thirteen inches in girth; the High Ancestor therefore gave Kan a horse and bade him try it.',
    'The palace workshops had finished a new double-edged spear—twenty-four feet long, thirteen inches around—and the emperor gave Kan a horse to test it.',
  ],
  s0121: [
    'Kan took the spear, mounted, and thrust left and right with consummate skill; the High Ancestor was pleased and also composed thirty rhymes of “Martial Feast Poetry” to show Kan, who answered on the spot at imperial command. The High Ancestor read it and said: “I have heard that the benevolent are brave; now I see that the brave are benevolent—one may say the legacy of Zou and Lu, worthy men unbroken.',
    'Kan mounted, spear in hand, and fenced with flawless grace. Delighted, the emperor wrote thirty rhymes of “Martial Feast Poetry” and Kan answered at once from his seat. The emperor read them and said, “They say the benevolent are brave—today I see brave men who are benevolent. Zou and Lu live on; worthies never die out.',
  ],
  s0122: [
    'In the sixth year he was transferred to Left Chief Clerk of the Minister of Education.',
    'Year 6 moved him to Left Chief Clerk under the Minister of Education.',
  ],
  s0123: [
    'In the eighth year he was transferred to Minister of the Court for Dependencies.',
    'Year 8 made him Minister of the Court for Dependencies.',
  ],
  s0124: [
    'At the time the Director of the Imperial Secretariat He Jingrong held power; Kan shared the ministry with him but never paid social calls.',
    'He Jingrong of the Secretariat held sway; Kan shared his ministry but never visited him.',
  ],
  s0125: [
    'A eunuch, Zhang Sengyin, came to wait on Kan; Kan said: “My couch is not for castrated men to sit on.',
    'The eunuch Zhang Sengyin came to call; Kan said, “My bed is not for eunuchs.',
  ],
  s0126: [
    '” He never went forward; contemporaries praised his uprightness.',
    '” He would not receive him—and men praised his integrity.',
  ],
  s0127: [
    'In the ninth year he went out as Full Staff Bearer, General of Majestic Martiality, and Inspector of Hengzhou.',
    'Year 9 sent him out with full staff, General of Majestic Martiality, and the Hengzhou inspectorate.',
  ],
  s0128: [
    'In the first year of Taiqing he was summoned as Palace Attendant.',
    'Taiqing year 1 recalled him as Palace Attendant.',
  ],
  s0129: [
    'When a great northern expedition was launched, Kan was again made Bearer of the Staff and General of the Champion to supervise construction of the Hanshan dam; in twenty days the dam stood.',
    'A great northern campaign put him back as staff bearer and General of the Champion, overseeing the Hanshan dam—finished in twenty days.',
  ],
  s0130: [
    'Kan urged the commander-in-chief, the Marquis of Zhenyang, to strike Pengcheng while the waters were high; he would not listen.',
    'Kan begged the Marquis of Zhenyang to take Pengcheng by flood; the marquis refused.',
  ],
  s0131: [
    'Before long Wei reinforcements came in force; Kan repeatedly urged striking them while still far from home, and the next day urged battle again—none of it was accepted—so Kan led his own troops to encamp on the dam.',
    'Wei reinforcements swelled; Kan urged hitting them on the march, then urged battle again at dawn—both refused—so he drew his men up on the dam.',
  ],
  s0132: [
    'When the armies were defeated, Kan formed ranks and withdrew slowly.',
    'When the host broke, Kan formed ranks and fell back in order.',
  ],
  s0133: [
    'In the second year he was again Minister of the Court for Dependencies.',
    'Year 2 restored him as Minister of the Court for Dependencies.',
  ],
  s0134: [
    'Hou Jing rebelled and took Liyang; the High Ancestor asked Kan for a plan against Jing.',
    'Hou Jing rebelled and seized Liyang; the emperor asked Kan how to crush him.',
  ],
  s0135: [
    'Kan said: “Jing’s treason has long been plain; he may yet charge like a boar, but we should swiftly hold Caishi and have the Prince of Shaoling seize Shouchun.',
    'Kan said, “Jing’s treachery has been obvious for years. He may still rush like a cornered boar—seize Caishi at once and let the Prince of Shaoling take Shouchun.',
  ],
  s0136: [
    'If Jing cannot advance and loses his nest, this rabble will break up of itself.',
    'Block his advance, cut off his refuge, and this mob will scatter on its own.',
  ],
  s0137: [
    '” The debaters said Jing would not dare press the capital at once; the plan was shelved, and Kan was ordered to lead a thousand-odd horsemen to encamp before the Wang Gate.',
    '” Councillors said Jing would not dare march on the capital yet; the plan died, and Kan was told to hold a thousand horse before the Wang Gate.',
  ],
  s0138: [
    'When Jing reached Xinlin, he pursued Kan into the city as deputy to the Prince of Xuancheng, commander of all forces within the walls.',
    'Jing reached Xinlin and drove Kan inside as deputy to the Prince of Xuancheng, commander of the city’s defense.',
  ],
  s0139: [
    'Jing had come so suddenly that commoners rushed in together; public and private were chaos, order gone.',
    'Jing struck too fast; people poured through the gates in chaos, public and private alike.',
  ],
  s0140: [
    'Kan then divided sectors for defense, interposing kinsmen of the imperial house throughout.',
    'Kan divided the walls into sectors and posted imperial clansmen along each line.',
  ],
  s0141: [
    'Soldiers fought to enter the armory and take weapons for themselves; the officials could not stop them until Kan ordered several men beheaded—then it ceased.',
    'Soldiers stormed the armory for arms; officials could not stop them until Kan had several beheaded.',
  ],
  s0142: [
    'When the bandits pressed the wall the host panicked; Kan falsely announced he had intercepted a letter saying “the Prince of Shaoling and the Marquis of Xichang have already reached the near road.”',
    'As the enemy closed in, panic spread; Kan claimed a captured dispatch: “The Prince of Shaoling and the Marquis of Xichang are almost here.”',
  ],
  s0143: [
    'The host was somewhat calmed.',
    'The city steadied a little.',
  ],
  s0144: [
    'The bandits attacked the eastern side gate, setting a great fire; Kan personally resisted, dousing the flames with water; when the fire died he drew his bow and shot several men dead, and the bandits withdrew.',
    'The rebels hit the eastern side gate with fire; Kan met them himself, drowned the flames, shot down several men, and drove them back.',
  ],
  s0145: [
    'He was promoted Palace Attendant and General of the Army Instructor.',
    'He was made Palace Attendant and General of the Army Instructor.',
  ],
  s0146: [
    'An edict sent five thousand taels of gold, ten thousand taels of silver, and ten thousand bolts of silk to reward the warriors; Kan declined to accept.',
    'The throne sent five thousand taels of gold, ten thousand of silver, and ten thousand bolts of silk for the troops; Kan refused it.',
  ],
  s0147: [
    'To his personal following of more than a thousand he gave private rewards besides.',
    'His own following of a thousand men he rewarded from his purse.',
  ],
  s0148: [
    'The bandits built pointed wooden donkeys to assault the wall, which arrows and stones could not stop; Kan made pheasant-tail torches with iron heads, soaked them in oil, and hurled them onto the donkeys to burn them—all were soon consumed.',
    'The rebels raised pointed wooden “donkeys” proof against shot and stone; Kan devised pheasant-tail torches tipped with iron, oil-soaked, and burned the engines to ash.',
  ],
  s0149: [
    'The bandits also raised earthen hills east and west to overlook the wall; the city was shaken with fear until Kan ordered tunnels dug to draw off the earth so the hills could not stand.',
    'They piled earthworks east and west to dominate the walls; terror rose until Kan tunneled under them and stole their fill—the mounds collapsed.',
  ],
  s0150: [
    'The bandits also built tower-carts for assault, more than ten rods high, intending to shoot down into the city; Kan said: “The cart is high and the ropes slack—when it comes it must fall; we may watch lying down without troubling to prepare.',
    'They built assault towers ten rods high to rain arrows into the city. Kan said, “Too tall, ropes too slack—they will topple. Lie back and watch; no need to prepare.',
  ],
  s0151: [
    '” When the cart moved it indeed fell; all were convinced.',
    '” The tower moved and fell; the whole city believed him.',
  ],
  s0152: [
    'The bandits, having attacked repeatedly without success, then built a long encirclement.',
    'Failing again and again, the rebels threw up a long siege line.',
  ],
  s0153: [
    'Zhu Yi and Zhang Wan debated sallying out; the High Ancestor asked Kan, and Kan said: “No.',
    'Zhu Yi and Zhang Wan urged a sortie; the emperor asked Kan, who said, “No.',
  ],
  s0154: [
    'The bandits have attacked the city many days and could not take it, so they raise a long encirclement to lure those in the city who would surrender.',
    'They could not breach the walls, so they ring us to breed defectors.',
  ],
  s0155: [
    'If we strike now and send few men, we cannot break the bandits; if we send many, one defeat and we will trample one another—the gates are narrow, the bridges small, and we will suffer great rout; this shows weakness, not the spreading of royal majesty.',
    'Sortie with few and we achieve nothing; with many, one slip and we will crush each other at the narrow gates and bridges—a rout that shows weakness, not imperial might.',
  ],
  s0156: [
    '” They did not listen and sent a thousand-odd men out; before blades met they fled at sight of the enemy, and in the scramble for the bridge many fell into the water—more than half died.',
    '” They ignored him and sent out a thousand men; before steel met they ran, fought for the bridge, and more than half drowned.',
  ],
  s0157: [
    'Earlier Kan’s eldest son Dan had been taken by Jing and brought beneath the wall to show Kan; Kan said to him: “I have poured out my clan for the lord and still regret it is not enough—how could I reckon on this one son? I hope you will kill him soon.',
    'Jing had taken Kan’s eldest son Dan and brought him under the wall. Kan called, “I have spent my house for the throne and still call it little—why spare one son? Kill him quickly, I beg you.',
  ],
  s0158: [
    '” Several days later they brought him again; Kan said to Dan: “Long I thought you dead—are you still alive?',
    '” Days later they brought him again. Kan said, “I thought you long dead—still here?',
  ],
  s0159: [
    'I have given my body to the state and sworn to die in the ranks; I will never let you govern whether I advance or retreat.',
    'My body belongs to the realm; I die in the line. You will never move me.',
  ],
  s0160: [
    'Thereupon he drew his bow and shot at him.',
    'He drew his bow and shot.',
  ],
  s0161: [
    'The bandits were moved by his loyalty and did not harm the son either.',
    'Even the rebels honored his faith and spared the boy.',
  ],
  s0162: [
    'Jing sent the Compeer of the Third Rank Fu Shizhe to call Kan and speak: “The marquis has come from afar to inquire after the Son of Heaven—why do you shut him out and not admit him in good time?',
    'Jing sent Fu Shizhe, Compeer of the Third Rank, to parley: “The marquis has come far to greet the Son of Heaven—why shut the gates?',
  ],
  s0163: [
    'The Director is a great minister of the state and ought to report to the court.',
    'You are a pillar of the realm—you should speak to the throne.',
  ],
  s0164: [
    '” Kan said: “After the marquis fled and submitted to the state, he was entrusted with a great frontier post—what hardship could he suffer?',
    '” Kan said, “After your flight you were trusted with a great frontier command—what grievance could you have?',
  ],
  s0165: [
    'Why suddenly raise arms?',
    'Why draw swords now?',
  ],
  s0166: [
    'Now you drive this rabble to the royal city; barbarian horses drink at the Huai, arrows cluster at the imperial hall—has any subject ever come to this?',
    'You herd this mob to the capital—barbarian horses at the Huai, arrows at the throne. What subject ever did this?',
  ],
  s0167: [
    'Your servant bears heavy grace from the state and must carry out the temple’s plan to sweep away great treason—I cannot rashly accept empty words and open the gate to welcome robbers.',
    'I owe the dynasty a great debt; I execute the court’s design and scourge traitors—I will not heed sweet lies and open the gate to thieves.',
  ],
  s0168: [
    'I beg the marquis to look to his own end soon.',
    'Marquis, see to your own end.',
  ],
  s0169: [
    '” Shizhe also said: “The marquis served his lord with utmost loyalty yet was not understood by the court; he only wished to face the Supreme One and remove wicked ministers—being in the army he therefore came in armor; how is that rebellion?',
    '” Shizhe said, “The marquis served with perfect loyalty and the court misunderstood him. He only wished to see the emperor and purge villains—being in the field he wore armor. How is that treason?',
  ],
  s0170: [
    '” Kan said: “The sage lord has held the four seas nearly fifty years, bright and wise, nothing hidden in the darkest place—what wicked ministers could remain at court?',
    '” Kan said, “Our sage has ruled fifty years, clear-sighted to the deepest shadow—what villains still sit in court?',
  ],
  s0171: [
    'To gloss over wrong, surely there are crafty words.',
    'To dress up crime, of course there are clever lies.',
  ],
  s0172: [
    'Moreover the marquis himself raised bare blades against the gate-towers—serving one’s lord with utmost loyalty, is it truly thus?',
    'And you yourself brought naked steel to the palace—is that loyalty?',
  ],
  s0173: [
    '” Shizhe had no reply and then said: “In the north I long admired your wind and virtue and always regretted in this life I never met you face to face; I wish to lay aside armor and see you once.',
    '” Shizhe was silent, then said, “In the north I long admired you and regretted we never met. Let me doff armor and see you once.',
  ],
  s0174: [
    'Kan removed his helmet for him; Shizhe gazed a long while and departed.',
    'Kan took off his helmet; Shizhe stared a long time and left.',
  ],
  s0175: [
    'Such was the esteem in which northerners held him.',
    'Northerners revered him to that degree.',
  ],
  s0176: [
    'Later came great rain; the earthen hills within the city collapsed and the bandits exploited it, pressing in; though they fought bitterly they could not hold them back until Kan ordered fire cast in abundance and built a fire-wall to cut their path, then slowly built an inner wall; the bandits could not advance.',
    'Heavy rain collapsed the inner earthworks; the enemy poured through. Kan ordered a rain of fire, built a fire-wall across their path, and raised an inner rampart behind it—they could not pass.',
  ],
  s0177: [
    'In the twelfth month he fell ill and died within the palace compound, aged fifty-four.',
    'Twelfth month: illness took him inside the palace at fifty-four.',
  ],
  s0178: [
    'An edict granted the eastern-garden secret coffin, five hundred bolts each of cloth and silk, three million cash, posthumous appointment as Palace Attendant and General Who Protects the Army, and one set of martial pipes.',
    'The throne sent the eastern-garden coffin, five hundred bolts of cloth and silk, three million cash, posthumous Palace Attendant and General Who Protects the Army, and a martial pipe band.',
  ],
  s0179: [
    'From youth Kan was fierce and brave, with strength beyond other men; the bow he used drew more than ten piculs.',
    'Young he was fierce, strength beyond measure—his bow pulled more than ten piculs.',
  ],
  s0180: [
    'Once at the Yao temple in Yanzhou he kicked off from the wall, climbed straight up five xun, and traversed sideways for seven paces.',
    'At Yanzhou’s Yao temple he kicked off a wall, climbed five xun straight up, and walked seven paces along the face.',
  ],
  s0181: [
    'At the Si Bridge there were several stone men, eight feet tall and ten arm-spans around; Kan seized them and struck them against each other until all were shattered.',
    'At Si Bridge stood stone figures eight feet tall, ten arm-spans round; Kan smashed them together until all broke.',
  ],
  s0182: [
    'Kan by nature was extravagant, skilled in music, and himself composed the two tunes “Gathering Lotuses” and “Oar Song,” very fresh in conception.',
    'Extravagant by nature, skilled in music, he composed “Gathering Lotuses” and “Oar Song”—both strikingly new.',
  ],
  s0183: [
    'Concubines attended in ranks, luxury pushed to the limit.',
    'Concubines lined his halls in utmost luxury.',
  ],
  s0184: [
    'There was the zither-player Lu Taixi, who wore deer-horn plectra seven inches long.',
    'His zitherist Lu Taixi wore deer-horn picks seven inches long.',
  ],
  s0185: [
    'The dancer Zhang Jingwan had a waist of one foot six inches; contemporaries all praised her dancing in the palm of the hand.',
    'The dancer Zhang Jingwan’s waist measured a foot and six inches—men said she could dance in the palm of one’s hand.',
  ],
  s0186: [
    'There was also Sun Jingyu, who could bend her back to the ground and take up a jade hairpin from the mat with her mouth.',
    'Sun Jingyu could arch backward to the floor and pick up a jade hairpin from the mat with her teeth.',
  ],
  s0187: [
    'The throne granted the singer Wang Er’er; the Eastern Palace also granted the singer Qu Ou’zhi—both perfected strange tunes, unmatched in their day.',
    'The emperor gave him the singer Wang Er’er; the heir apparent gave Qu Ou’zhi—both masters of uncanny song, peerless in their time.',
  ],
  s0188: [
    'When he first went to Hengzhou, on two great barges at Fuqi he raised a three-bay water-pavilion spanning the beams, adorned with pearls and jade, hung with brocade, screens and curtains lavishly set, female musicians arrayed; riding the tide they cast off the cables, wine set along the waves, the embankment lined with onlookers, the road choked.',
    'Setting out for Hengzhou he moored two great barges at Fuqi, built a three-bay water hall across them in pearl and jade and brocade, filled it with screens, musicians, and concubines, cast off on the tide with wine along the shore—crowds blocked the banks.',
  ],
  s0189: [
    'In Datong, the Wei envoy Yang Fei had been Kan’s schoolmate in the north; an edict ordered Kan to extend Fei the same feast.',
    'In Datong the Wei envoy Yang Fei—Kan’s old northern classmate—was told to share Kan’s table by imperial order.',
  ],
  s0190: [
    'Guests numbered more than three hundred; vessels were all gold, jade, and mixed treasures; three companies of female musicians performed until evening, and more than a hundred serving maids each held golden-flower candles.',
    'Three hundred guests drank from gold and jeweled cups while three female ensembles played; at dusk a hundred maids bore golden-flower candles.',
  ],
  s0191: [
    'Kan could not drink but loved guests and company; all day he offered toasts, sharing their drunkenness and sobriety.',
    'Kan could not drink but loved company—he toasted all day and matched every guest, drunk or sober.',
  ],
  s0192: [
    'He was generous in nature and had breadth of bearing; once returning south he reached Lian mouth and set out wine; a guest, Zhang Rucai, drunk in the boat set a fire that spread to more than seventy vessels, gold and silk burned beyond counting.',
    'Broad and magnanimous, he once feasted at Lian mouth on the way south; a guest, Zhang Rucai, drunk aboard set a fire that burned seventy boats and uncounted gold and silk.',
  ],
  s0193: [
    'When Kan heard of it he paid no heed and ordered wine without pause.',
    'Kan heard and never broke stride—wine kept flowing.',
  ],
  s0194: [
    'Rucai, ashamed and afraid, fled into hiding; Kan comforted him and had him return, treating him as before.',
    'Rucai fled in shame; Kan coaxed him back and treated him as ever.',
  ],
  s0195: [
    'The third son was Yun.',
    'His third son was Yun.',
  ],
  s0196: [
    'Yun, courtesy name Zipeng.',
    'Yun, styled Zipeng.',
  ],
  s0197: [
    'He followed Kan within the palace compound; when the city fell he hid at Yangping.',
    'He followed Kan inside the palace; when the city fell he hid at Yangping.',
  ],
  s0198: [
    'Hou Jing summoned him back and treated him very generously.',
    'Hou Jing called him back and favored him richly.',
  ],
  s0199: [
    'When Jing was defeated, Yun secretly plotted against him and went east with him.',
    'When Jing fell, Yun plotted in secret and followed him east.',
  ],
  s0200: [
    'Jing was defeated on the Song River and had only three boats left; he went downriver intending to make for Mengshan.',
    'Jing lost on the Song River with three boats left and put to sea for Mengshan.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_039_b2.mjs <translation.json>'
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
