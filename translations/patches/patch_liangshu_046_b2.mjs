#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Separately he attacked Wuchang and took it.',
    'He also attacked Wuchang and took it.',
  ],
  s0102: [
    'Jing crossed upstream of Reed Islet to press Wensheng and the others; You\'an with the host attacked and Jing was greatly defeated, all his boats captured.',
    'Jing moved above Reed Islet to crush Wensheng; You\'an attacked with the army, shattered Jing, and seized every ship.',
  ],
  s0103: [
    'Just then Jing secretly sent a raid that seized E prefecture, capturing inspector Fang Zhu and others and returning; morale was greatly shaken; Xu Wensheng fled by Hankou; the armies were utterly routed; You\'an then surrendered to Jing.',
    'Then Jing sent raiders by a hidden road, took E prefecture, and captured Fang Zhu; panic spread; Wensheng fled up the Han; the army collapsed; You\'an surrendered to Jing.',
  ],
  s0104: [
    'Jing killed him—for his many vacillations.',
    'Jing killed him for his repeated betrayals.',
  ],
  s0105: [
    'Kan was son of Ze\'s second elder brother Cen.',
    'Kan was son of Ze\'s second brother Cen.',
  ],
  s0106: [
    'From youth fierce and brave, skilled at using troops; also in Supreme Clarity he returned with his uncles to Shizu; Shizu made him bearer of the staff, General of Loyal Martial, inspector of Yun, Marquis of Zhonglu, fief a thousand households.',
    'From youth he was fierce and knew war; in Supreme Clarity he returned with his uncles; Shizu made him staff bearer, General of Loyal Martial, Yun inspector, and Marquis of Zhonglu with a thousand households.',
  ],
  s0107: [
    'With his uncle You\'an he followed Wang Sengbian to campaign against the Prince of Hedong and pacified him.',
    'With his uncle You\'an he followed Wang Sengbian against the Prince of Hedong and pacified him.',
  ],
  s0108: [
    'Again following Sengbian downstream he continued Xu Wensheng\'s army to Baling; hearing Hou Jing had raided and seized E prefecture and was coming west, he with Sengbian and the others held Baling to await him.',
    'Following Sengbian downriver he took over Wensheng\'s line at Baling; hearing Jing had taken E and was coming west, he and Sengbian held Baling to meet him.',
  ],
  s0109: [
    'When Jing arrived he besieged it many weeks, could not take it, and fled.',
    'Jing besieged it for weeks, failed, and fled.',
  ],
  s0110: [
    'He was transferred Grand Treasurer, Pacifying North general, commander of Ding military affairs, inspector of Ding, added Direct and Regular Palace Attendant, fief increased five hundred households.',
    'He became Grand Treasurer, Pacifying North general, Ding commander and inspector, Direct and Regular Palace Attendant, fief up five hundred households.',
  ],
  s0111: [
    'He still followed Sengbian pursuing Jing to Jiangxia and besieged the city.',
    'He followed Sengbian in pursuit to Jiangxia and besieged the city.',
  ],
  s0112: [
    'Jing\'s general Song Zixian abandoned the city and fled; Kan pursued to Yangpu and captured him alive.',
    'Song Zixian abandoned the city and fled; Kan chased to Yangpu and took him alive.',
  ],
  s0113: [
    'In the third year of Great Treasure the armies reached Gushu; Jing\'s general Hou Zijian met them in battle; Kan with Chen Baxian, Wang Lin and others led crack troops to strike, routing Zijian greatly, and reached Stonehead.',
    'In Great Treasure year three the armies reached Gushu; Hou Zijian met them; Kan with Chen Baxian and Wang Lin led elites, broke Zijian, and pushed on to Stonehead.',
  ],
  s0114: [
    'Jing personally led his faction to join battle; Kan with the armies fought fiercely, routing Jing greatly; Jing fled east.',
    'Jing fought in person; Kan and the host struck hard, shattered him, and Jing fled east.',
  ],
  s0115: [
    'For merit he was first; he was made Pacifying East general, inspector of East Yang, fief increased a thousand households.',
    'His merit ranked first; he was made Pacifying East general, East Yang inspector, fief up a thousand households.',
  ],
  s0116: [
    'In Chengsheng year two he again with Wang Sengbian suppressed Lu Na and others at Changsha and made them surrender.',
    'In Chengsheng year two he again followed Wang Sengbian against Lu Na at Changsha and forced surrender.',
  ],
  s0117: [
    'Again he campaigned against the Prince of Wuling at Xiling and likewise pacified him.',
    'He also campaigned against the Prince of Wuling at Xiling and pacified him.',
  ],
  s0118: [
    'Later Jiangling fell; Qi installed the True Yang Marquis to continue Liang; Kan was made inspector of Zhen and governor of Wuxing.',
    'After Jiangling fell Qi set up the True Yang Marquis to continue Liang; Kan became Zhen inspector and Wuxing governor.',
  ],
  s0119: [
    'Also made Pacifying South general, commander of South Yu military affairs, inspector of South Yu, Marquis of Liyang, given a suite of martial music.',
    'He was also made Pacifying South general, South Yu commander and inspector, Marquis of Liyang, with martial music.',
  ],
  s0120: [
    'Also added Regular Palace Attendant and Great General Who Pacifies the East.',
    'He was also made Regular Palace Attendant and Great General Who Pacifies the East.',
  ],
  s0121: [
    'Just then Chen Baxian raided and seized the capital, seized Wang Sengbian and killed him.',
    'Then Chen Baxian seized the capital, took Wang Sengbian, and killed him.',
  ],
  s0122: [
    'Kan, Sengbian\'s son-in-law, was governor of Wuxing.',
    'Kan was Sengbian\'s son-in-law and governor of Wuxing.',
  ],
  s0123: [
    'Because Baxian was neither noble by birth nor his troops were crude and mixed, in headquarters days Kan never took Baxian to heart;',
    'Baxian was low-born and his troops were a rabble; in headquarters days Kan never took him seriously;',
  ],
  s0124: [
    'when he became governor of his home commandery he constantly bound his clan by law without indulgence—Baxian hated him to the teeth.',
    'as home governor he bound his clan by law without mercy—Baxian hated him to the bone.',
  ],
  s0125: [
    'When Sengbian was defeated Kan then held Wuxing to resist him, sending deputy Du Tai to attack Chen Qian at Changcheng—but was in turn defeated by Qian.',
    'When Sengbian fell Kan held Wuxing against him and sent Du Tai to strike Chen Qian at Changcheng—but Qian beat him.',
  ],
  s0126: [
    'Baxian then sent general Zhou Wenyun to campaign against Kan; Kan sent his cousin Beisou out to resist and was again broken by Wenyun; he fled to Yixing and Baxian personally led troops to besiege him.',
    'Baxian sent Zhou Wenyun against him; Kan sent his cousin Beisou out and was beaten again; he fled to Yixing and Baxian besieged him in person.',
  ],
  s0127: [
    'Just then Qi general Liu Damo and others raided the capital; Baxian was afraid and returned to ally with the Qi men.',
    'Then Liu Damo of Qi struck the capital; Baxian feared and turned back to treat with Qi.',
  ],
  s0128: [
    'When Kan heard the Qi army had withdrawn he surrendered and then met disaster.',
    'When Kan heard Qi had withdrawn he surrendered—and was killed.',
  ],
  s0129: [
    'Yin Zichun, styled Youwen, was a man of Guzang in Wuwei commandery.',
    'Yin Zichun, styled Youwen, was from Guzang in Wuwei.',
  ],
  s0130: [
    'At the end of Yixi in Jin, his great-grandfather Xi followed Song Gaozu south, reaching Nanping, and there made home.',
    'At the end of Jin Yixi his great-grandfather Xi followed Song Gaozu south to Nanping and settled there.',
  ],
  s0131: [
    'Father Zhibo was Gaozu\'s neighbor; from youth they were friendly; he once entered Gaozu\'s sleeping chamber and saw a strange light in five colors; he grasped Gaozu\'s hand and said: "Your Grace will surely rise to great nobility—not the lot of a subject.',
    'His father Zhibo lived next to Gaozu; they were friends from youth; once he entered Gaozu\'s bedchamber and saw a five-colored light; he took Gaozu\'s hand and said, "You are destined for greatness—not the fate of a subject.',
  ],
  s0132: [
    'The realm is in disorder; he who settles the black-haired folk—is it not you?',
    'The realm is in chaos; will you not be the one to save the people?',
  ],
  s0133: [
    '" Gaozu said: "Pray speak no more.',
    '" Gaozu said, "Say no more.',
  ],
  s0134: [
    '" Thereupon their affection grew still closer; whenever Gaozu had need it was as from an outer treasury.',
    '" Their bond deepened; whenever Gaozu needed anything it was as if he had another treasury.',
  ],
  s0135: [
    'When Gaozu ascended the throne he reached inspector of Liang and Qin.',
    'When Gaozu took the throne he rose to inspector of Liang and Qin.',
  ],
  s0136: [
    'Zichun, at the beginning of Heavenly Surveillance, began office as General of Manifest Grace and governor of Xiyang.',
    'Zichun began under Heavenly Surveillance as General of Manifest Grace and Xiyang governor.',
  ],
  s0137: [
    'In the Ordinary era he was repeatedly promoted to General of Bright Might and inspector of South Liang;',
    'In the Ordinary era he rose to General of Bright Might and South Liang inspector;',
  ],
  s0138: [
    'also transferred General of Trustworthy Might, commander of Liang, Qin, and Hua military affairs, inspector of Liang and Qin.',
    'then General of Trustworthy Might, commander of Liang, Qin, and Hua, and inspector of Liang and Qin.',
  ],
  s0139: [
    'In the second year of Supreme Clarity he campaigned against rebel barbarians in the gorges and pacified them.',
    'In Supreme Clarity year two he put down rebel tribes in the gorges.',
  ],
  s0140: [
    'He was summoned as Left Guard general, then transferred palace attendant.',
    'He was summoned as Left Guard general, then made palace attendant.',
  ],
  s0141: [
    'When Hou Jing rebelled Shizu ordered Zichun to follow General Who Commands the Army Wang Sengbian in attacking the Prince of Shaoling at E prefecture and pacifying him.',
    'When Hou Jing rebelled Shizu ordered Zichun to follow Wang Sengbian against the Prince of Shaoling at E and pacify him.',
  ],
  s0142: [
    'Again with Left Guard general Xu Wensheng he campaigned east against Hou Jing; reaching Shell Ford they met Jing; Zichun fought fiercely, always foremost among the armies, repeatedly defeating Jing.',
    'Again with Xu Wensheng he marched east against Hou Jing; at Shell Ford they met Jing; Zichun fought at the fore and beat him again and again.',
  ],
  s0143: [
    'When E prefecture fell the armies then retreated in defeat.',
    'When E prefecture fell the army retreated in rout.',
  ],
  s0144: [
    'In the second year of Great Treasure he died at Jiangling.',
    'In Great Treasure year two he died at Jiangling.',
  ],
  s0145: [
    'His grandson Hao was known from youth.',
    'His grandson Hao was known while still young.',
  ],
  s0146: [
    'On leaving office he was Court Attendant on Duty, successively Jin Department director in the Secretariat.',
    'He began as Court Attendant on Duty and rose to director of the Jin Department in the Secretariat.',
  ],
  s0147: [
    'Later he entered Zhou.',
    'Later he went over to Zhou.',
  ],
  s0148: [
    'He compiled Pavilions in Splendor in twenty scrolls.',
    'He wrote Pavilions in Splendor in twenty scrolls.',
  ],
  s0149: [
    'The historian says: Hu Sengyou\'s bravery and capacity were renowned; several times he seized the standard and broke the enemy;',
    'The historian writes: Hu Sengyou was famed for courage; again and again he took the standard and broke the foe;',
  ],
  s0150: [
    'when he gave his body and died for his integrity in the king\'s service—even the loyal martyrs of antiquity—how could they surpass him?',
    'when he gave his life for the throne—even the martyrs of old—who could surpass him?',
  ],
  s0151: [
    'Xu Wensheng at first achieved merit yet could not finish establishing his name—injustice.',
    'Xu Wensheng won merit at first yet could not finish his fame—shame.',
  ],
  s0152: [
    'Du Ze knew the principle of timely change and the fitness of turning toward or away; moreover he repeatedly commanded armies and often extinguished rebels and invaders—merit illustrious, dying a great minister of restoration.',
    'Du Ze read the moment and chose the right side; he led armies again and again and crushed rebels—bright merit, a pillar of restoration.',
  ],
  s0153: [
    'Righteous indeed!',
    'How righteous!',
  ],
  s0154: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0155: [
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_046_b2.mjs <translation.json>'
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
