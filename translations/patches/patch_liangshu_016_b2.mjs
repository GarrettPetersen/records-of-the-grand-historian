#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Soon he was recalled and made Bearer of Credentials, General Who Assists the State, Area Commander of all North Xuzhou military affairs, and North Xuzhou Inspector.',
    'Soon recalled, he became bearer of credentials, General Who Assists the State, area commander of North Xuzhou, and North Xuzhou inspector.',
  ],
  s0102: [
    'He posted at Baixia, then was transferred to Area Commander of all South Yanzhou military affairs and South Yanzhou Inspector.',
    'He posted at Baixia, then became area commander of South Yanzhou and South Yanzhou inspector.',
  ],
  s0103: [
    'Soon he was advanced to command military affairs in North Xu, Xu, Yan, Qing, and Ji—five provinces in all—while his general ranks remained as before.',
    'Soon he was advanced to command the five provinces North Xu, Xu, Yan, Qing, and Ji, with his general ranks unchanged.',
  ],
  s0104: [
    'At the end of the Yongyuan era he was summoned as Attendant Within and guarded the palace city.',
    'At the end of Yongyuan he was summoned as attendant within and guarded the palace city.',
  ],
  s0105: [
    'When the Righteous Army arrived, Concurrent Commandant of the Guard Jiang Yan fled.',
    'When the righteous army came, Concurrent Commandant of the Guard Jiang Yan fled.',
  ],
  s0106: [
    'Ji held the concurrent commandantship and assisted Wang Ying in commanding all military affairs within the city.',
    'Ji held the concurrent guard commandancy and assisted Wang Ying in commanding the city\'s forces.',
  ],
  s0107: [
    'Donghun was then depraved and cruel; the Righteous Army had besieged the city for a long time, and within the walls all wished to rebel, yet none dared act first.',
    'Donghun was depraved and cruel; the righteous army had long besieged the city, and everyone inside wished to turn, yet none dared move first.',
  ],
  s0108: [
    'North Xuzhou Inspector Wang Zhenguo consulted with Ji; Ji then had Direct Attendant Zhang Qi kill Donghun in Hede Hall.',
    'North Xuzhou inspector Wang Zhenguo plotted with Ji; Ji had Direct Attendant Zhang Qi kill Donghun in Hede Hall.',
  ],
  s0109: [
    'Ji summoned Right Vice Director of the Masters of Writing Wang Liang and others to sit in a row before the western bell in the hall and said: "Of old Jie had dark virtue, and the tripod moved to Yin;',
    'Ji summoned Right Vice Director Wang Liang and others to sit before the western bell in the hall and said, "Of old Jie had dark virtue, and the tripod moved to Yin;',
  ],
  s0110: [
    'Shang\'s Zhou was violent and cruel, and the tripod moved to Zhou.',
    'Shang\'s Zhou was violent and cruel, and the tripod moved to Zhou.',
  ],
  s0111: [
    'Now the lone man has cut himself off from Heaven; the four seas already belong to the sage lord—this is truly the time of Weizi leaving Yin, Xiang Bo returning to Han. You must exert yourselves!"',
    'Now the tyrant has cut himself off from Heaven; the four seas already belong to the sage lord—this is Weizi leaving Yin, Xiang Bo returning to Han. You must exert yourselves!"',
  ],
  s0112: [
    'Then he sent National University Erudite Fan Yun, Attendant Pei Changmu, and others to Stone City to present themselves to Gaozu; Gaozu made Ji Attendant Within and Left Palace Guard General.',
    'Then he sent National University erudite Fan Yun, attendant Pei Changmu, and others to Stone City to see Gaozu; Gaozu made Ji attendant within and left palace guard general.',
  ],
  s0113: [
    'When Gaozu oversaw all state affairs, Ji was transferred to Left Staff Officer of the Grand Marshal.',
    'When Gaozu took charge of all affairs, Ji became the grand marshal\'s left staff officer.',
  ],
  s0114: [
    'When the Liang regime was established he was made Cavalier Attendant-in-Ordinary and Director of the Secretariat.',
    'When the Liang court was set up he became cavalier attendant-in-ordinary and director of the secretariat.',
  ],
  s0115: [
    'When Gaozu accepted the abdication, Ji was enfeoffed as Marquis of Jiang\'an for his merit, with a fief of one thousand households.',
    'When Gaozu took the throne, Ji was enfeoffed as Marquis of Jiang\'an for merit, with a fief of one thousand households.',
  ],
  s0116: [
    'He was again made Attendant Within and Chancellor of the National University, with concurrent Rapid Cavalry General; he was transferred to Protector General and Yangzhou Chief Rectifier, then dismissed over an affair.',
    'He again became attendant within and chancellor of the National University, with concurrent rapid cavalry general; he became protector general and Yangzhou chief rectifier, then was dismissed over an affair.',
  ],
  s0117: [
    'Soon he was made Minister of Revenue, Front General, and Right Crown Prince Palace Guard Commander, then again dismissed over an official matter.',
    'Soon he became minister of revenue, front general, and right crown prince palace guard commander, then was again dismissed over official business.',
  ],
  s0118: [
    'Soon he was made Minister of Sacrificial Affairs, then transferred to Cavalier Attendant-in-Ordinary, Director of Capital Crimes, and Yangzhou Chief Rectifier, with this office concurrently in charge of guard-army affairs.',
    'Soon he became minister of sacrificial affairs, then cavalier attendant, director of capital crimes, and Yangzhou chief rectifier, concurrently commanding guard-army affairs.',
  ],
  s0119: [
    'Soon he was transferred to Guard Army General, his chief rectifier title and marquisate remaining as before.',
    'Soon he became guard army general, keeping his chief rectifier title and marquisate.',
  ],
  s0120: [
    'At that time Wei invaded Qingzhou; an edict granted him temporary credentials and acting charge of the province.',
    'Wei then invaded Qingzhou; he was ordered to hold temporary credentials and act for the province.',
  ],
  s0121: [
    'When the Wei army withdrew he went out as Cavalier Attendant-in-Ordinary and General, Wuxing Administrator, with salary rank at two thousand dan.',
    'When the Wei army withdrew he went out as cavalier attendant and general, Wuxing administrator, at salary rank two thousand dan.',
  ],
  s0122: [
    'On taking office he inquired after the old residents left behind and promoted their sons and grandsons to right offices; his governance was called lenient and forgiving.',
    'On taking office he sought out old residents and set their sons and grandsons in right offices; his rule was called lenient and forgiving.',
  ],
  s0123: [
    'His title was advanced to Cloud-Banner General and he was summoned as Left Vice Director of the Masters of Writing.',
    'He was advanced to Cloud-Banner General and summoned as left vice director of the Masters of Writing.',
  ],
  s0124: [
    'The imperial carriage was about to visit Ji\'s house; because of the intense heat the Emperor stayed instead at the Vice Director\'s office. By old custom items for an imperial visit were reimbursed from the Grand Provisioner\'s feast allowance; because Ji was pure and poor, the Emperor hand-edicted that he should not accept them.',
    'The emperor was about to visit Ji\'s house; in the intense heat he stayed at the vice director\'s office instead. Old custom reimbursed visit supplies from the Grand Provisioner; because Ji was poor, the emperor hand-edicted that he accept nothing.',
  ],
  s0125: [
    'He went out as Bearer of Credentials, Cavalier Attendant-in-Ordinary, Area Commander of Qing and Ji military affairs, Pacification North General, and Inspector of Qing and Ji provinces.',
    'He went out as bearer of credentials, cavalier attendant, area commander of Qing and Ji, Pacification North general, and inspector of Qing and Ji.',
  ],
  s0126: [
    'When Wei invaded Qushan, an edict ordered Ji to station temporarily at Liuli and command all armies.',
    'When Wei invaded Qushan, Ji was ordered to hold Liuli temporarily and command all armies.',
  ],
  s0127: [
    'On his return his title was advanced to Garrison North General.',
    'On return his title was advanced to Garrison North general.',
  ],
  s0128: [
    'Earlier Yuzhou bordered the frontier, and local custom often led people to trade with Wei.',
    'Earlier Yuzhou lay on the frontier, and its people often traded with Wei.',
  ],
  s0129: [
    'When Qushan rebelled, some connected with Wei; they were already uneasy;',
    'When Qushan rebelled, some made contact with Wei; they were already uneasy;',
  ],
  s0130: [
    'moreover Ji was lax and undefended, and his staff often encroached and fleeced.',
    'moreover Ji was lax and undefended, and his staff often preyed on the province.',
  ],
  s0131: [
    'Provincial men Xu Daojiao and others night-attacked the provincial seat and killed Ji; he was sixty-three.',
    'Provincial men Xu Daojiao and others attacked the seat by night and killed Ji, aged sixty-three.',
  ],
  s0132: [
    'The responsible office memorialized to strip his enfeoffment and lands.',
    'The responsible office memorialized to strip his fief and lands.',
  ],
  s0133: [
    'Ji\'s nature was fierce and bright, and he was good at making friends.',
    'Ji was fierce and bright, and good at friendship.',
  ],
  s0134: [
    'In office he never accumulated wealth; his salary he always distributed to kin and friends, and his house had no surplus.',
    'He never hoarded in office; he gave his salary to kin and friends, and his house held no surplus.',
  ],
  s0135: [
    'When he first left Wuxing commandery and was summoned as Vice Director, his route passed his Wu homeland; those waiting to see Ji filled the waterways and roads.',
    'When he first left Wuxing and was summoned as vice director, his route passed Wu country; those waiting for Ji filled land and water.',
  ],
  s0136: [
    'Ji returned to the capital alone with simple baggage; no one recognized him—such was his plain simplicity.',
    'Ji returned to the capital alone with plain baggage; no one knew him—such was his austerity.',
  ],
  s0137: [
    'Ji\'s eldest daughter Chu Yuan married into the Kong clan of Kuaiji; having no son, she returned to her clan.',
    'Ji\'s eldest daughter Chu Yuan married the Kong clan of Kuaiji; childless, she returned to her clan.',
  ],
  s0138: [
    'When Ji was killed, his daughter used her body to shield the blade and died before her father.',
    'When Ji was killed, his daughter shielded him with her body and died before her father.',
  ],
  s0139: [
    'Ji\'s son Song has a separate biography.',
    'Ji\'s son Song has a separate biography.',
  ],
  s0140: [
    'Juan, styled Lingyuan, was Ji\'s cousin.',
    'Juan, styled Lingyuan, was Ji\'s cousin.',
  ],
  s0141: [
    'In youth he was famed for grasping principle, could hold pure talk, and reached Capital Crimes Director in office; he died early in the Tianjian era.',
    'In youth he was famed for grasping principle and pure talk; he reached director of capital crimes and died early in Tianjian.',
  ],
  s0142: [
    'Wang Ying, styled Fengguang, was a native of Linyi in Langye.',
    'Wang Ying, styled Fengguang, came from Linyi in Langye.',
  ],
  s0143: [
    'His father Mao was Minister of the Imperial Stud and Marquis of Xiang of Nanxiang.',
    'His father Mao was Minister of the Imperial Stud and Marquis of Xiang of Nanxiang.',
  ],
  s0144: [
    'Ying was chosen to marry the Princess of Linhuai of Song, was made Commandant of the Horse Guards, removed as Aide in the Masters of Writing, and rose through offices to Crown Prince Attendant, Pacification Army Staff Officer, and Cavalier Attendant-in-Ordinary, then Left Western Aide of the Secretariat.',
    'Ying was chosen to marry Song\'s Princess of Linhuai, became commandant of the horse guards, left the Masters of Writing aide post, and rose to crown prince attendant, pacification army staff officer, cavalier attendant, and left western aide of the secretariat.',
  ],
  s0145: [
    'When Qi Gaodi was Rapid Cavalry General, he brought Ying in as participation officer.',
    'When Qi Gaodi was Rapid Cavalry General, he brought Ying in as participation officer.',
  ],
  s0146: [
    'Shortly after, he went out as Yixing Administrator, replacing Xie Chaozong.',
    'Soon he went out as Yixing administrator, replacing Xie Chaozong.',
  ],
  s0147: [
    'When Chaozong left the commandery he and Ying had become enemies; once back in the capital he slandered Ying to Mao.',
    'Chaozong left the commandery on bad terms with Ying; back in the capital he slandered Ying to Mao.',
  ],
  s0148: [
    'Mao spoke of it at court; because Ying\'s support of his post was insufficient, he was dismissed from his commandery and cast aside.',
    'Mao raised it at court; Ying\'s upkeep of office was judged insufficient, and he lost his commandery and was cast aside.',
  ],
  s0149: [
    'After a long while he was made Front Army Advisory Staff Officer, Secretariat Gentleman, Grand Marshal Participation Officer—before he could take up the post he entered mourning for his mother.',
    'Long after, he became front army advisory staff officer, secretariat gentleman, and grand marshal participation officer; before taking post he mourned his mother.',
  ],
  s0150: [
    'When mourning ended he was made Yellow Gate Attendant, went out as Xuancheng Administrator, and was transferred to Rapid Cavalry Chief Clerk.',
    'After mourning he became yellow gate attendant, went out as Xuancheng administrator, then rapid cavalry chief clerk.',
  ],
  s0151: [
    'He was again made Yellow Gate Attendant and Secretariat Marshal, then Crown Prince Junior Tutor, and soon transferred to Attendant Within; he left office on his father\'s mourning.',
    'He again became yellow gate attendant and secretariat marshal, then crown prince junior tutor, soon attendant within; he left office for his father\'s mourning.',
  ],
  s0152: [
    'When mourning ended he was again made Attendant Within with concurrent Colonel of the Archers\' Guard, then Champion General and Dongyang Administrator.',
    'After mourning he again became attendant within and colonel of the archers\' guard, then champion general and Dongyang administrator.',
  ],
  s0153: [
    'In the commandery he had benevolent government and was transferred to Wuxing Administrator.',
    'In office he ruled with benevolence and was transferred to Wuxing administrator.',
  ],
  s0154: [
    'Mingdi labored anxiously over common government; Ying twice held commanderies and in both had a name for ability.',
    'Mingdi toiled over common government; Ying twice held commanderies and in both won a name for ability.',
  ],
  s0155: [
    'He was greatly praised.',
    'He was greatly praised.',
  ],
  s0156: [
    'On his return he was made Crown Prince Grand Tutor and Central Army Commander.',
    'On return he became crown prince grand tutor and central army commander.',
  ],
  s0157: [
    'At the start of Yongyuan, government lay with petty men; Ying kept his post but could not judge right and wrong.',
    'At the start of Yongyuan petty men held power; Ying kept his post but could not speak on right and wrong.',
  ],
  s0158: [
    'Ying\'s cousin Liang was then in power; though he had never been close to Ying, he now wished to draw him into shared office.',
    'Cousin Liang was then in power; though never close to Ying, he now wished to draw him into shared office.',
  ],
  s0159: [
    'He was transferred to Left Vice Director of the Masters of Writing but did not take up the post.',
    'He was transferred to left vice director but did not take up the post.',
  ],
  s0160: [
    'When Protector General Cui Huijing raised the Prince of Jiangxia from Jingkou in revolt, Ying was granted temporary credentials, led troops to resist Huijing at Hutou, was night-attacked by Huijing, his host scattered, and Ying threw himself into the water and entered Le You on a raft, thereby returning to the terrace city.',
    'When Protector General Cui Huijing raised the Prince of Jiangxia from Jingkou, Ying held temporary credentials, led troops to resist Huijing at Hutou, was night-attacked, his host scattered, threw himself into the water, rafted into Le You, and so returned to the terrace city.',
  ],
  s0161: [
    'When Huijing was defeated, Ying returned to the Defender-in-Chief\'s residence.',
    'When Huijing was defeated, Ying returned to the defender-in-chief\'s residence.',
  ],
  s0162: [
    'When the Righteous Army arrived, he was again granted temporary credentials and made Area Commander of all palace-city military affairs.',
    'When the righteous army came, he again held temporary credentials and commanded palace-city forces.',
  ],
  s0163: [
    'When Jiankang was pacified, Gaozu as Chancellor of State brought Ying in as Left Chief Clerk, advanced him to Champion General, and had him escort the imperial carriage to welcome Emperor He from Jiangling.',
    'When Jiankang was pacified, Gaozu as chancellor of state brought Ying in as left chief clerk, advanced him to champion general, and had him escort the imperial carriage to welcome Emperor He from Jiangling.',
  ],
  s0164: [
    'When the Emperor reached Southern Province, he abdicated at a separate palace.',
    'When the emperor reached Southern Province, he abdicated at a separate palace.',
  ],
  s0165: [
    'When Gaozu ascended the throne, Ying was transferred to Attendant Within and Pacification Army General, enfeoffed as Duke of Jiancheng with a fief of one thousand households.',
    'When Gaozu took the throne, Ying became attendant within and pacification army general, enfeoffed as Duke of Jiancheng with a fief of one thousand households.',
  ],
  s0166: [
    'Soon he was transferred to Left Vice Director of the Masters of Writing, his attendant within and pacification army titles remaining as before.',
    'Soon he became left vice director, keeping attendant within and pacification army titles.',
  ],
  s0167: [
    'Shortly after, he was made Protector General, then transferred to Cavalier Attendant-in-Ordinary, Central Army General, and Danyang Intendant.',
    'Soon he became protector general, then cavalier attendant, central army general, and Danyang intendant.',
  ],
  s0168: [
    'After three years in office he was transferred to Attendant Within and Minister of the Household for the Imperial Clan, with concurrent Left Palace Guard General.',
    'After three years in office he became attendant within and minister of the imperial clan, with concurrent left palace guard general.',
  ],
  s0169: [
    'Soon he was transferred to Director of the Masters of Writing and Cloud-Banner General, his attendant within title remaining as before.',
    'Soon he became director of the Masters of Writing and Cloud-Banner general, keeping attendant within.',
  ],
  s0170: [
    'He was repeatedly advanced in title to Left Central Authority General and granted one set of martial pipes and drums.',
    'He was repeatedly advanced to Left Central Authority general and granted one set of pipes and drums.',
  ],
  s0171: [
    'Ying\'s nature was pure and cautious; in office he was respectful and earnest, and Gaozu valued him deeply.',
    'Ying was pure and cautious; in office he was respectful and earnest, and Gaozu valued him deeply.',
  ],
  s0172: [
    'In the fifteenth year of Tianjian he was transferred to Left Minister of the Household for the Imperial Clan, open office with third-rank ceremonial parity, his Danyang intendant and attendant within titles remaining as before.',
    'In Tianjian year fifteen he became left minister of the imperial clan with open office and third-rank ceremonial parity, keeping Danyang intendant and attendant within.',
  ],
  s0173: [
    'When Ying was about to take his appointment, the seal craftsmen cast his seal; six castings and six times the tortoise was ruined; once finished, the neck was hollow and not solid, yet they patched it and used it.',
    'When Ying was about to take office, seal craftsmen cast his seal; six castings ruined six tortoises; when finished the neck was hollow, yet they patched it and used it.',
  ],
  s0174: [
    'After six days in office he died suddenly of illness.',
    'After six days in office he died suddenly.',
  ],
  s0175: [
    'He was posthumously made Attendant Within, Left Minister of the Household for the Imperial Clan, and open office with third-rank ceremonial parity.',
    'Posthumously he was made attendant within, left minister of the imperial clan, and open office with third-rank ceremonial parity.',
  ],
  s0176: [
    'Chen Minister of Personnel Yao Cha said: Confucius said, "Yin had three worthies: Weizi left it; Jizi became its slave; Bigan remonstrated and died."',
    'Chen Minister of Personnel Yao Cha said: Confucius said, "Yin had three worthies: Weizi left; Jizi became a slave; Bigan remonstrated and died."',
  ],
  s0177: [
    'Wang Liang\'s standing in a chaotic age—his rank and position were plain to see.',
    'Wang Liang\'s standing in chaotic times—rank and position were plain to see.',
  ],
  s0178: [
    'In what he took and rejected, how did he differ from the three worthies?',
    'In what he took and rejected, how did he differ from the three worthies?',
  ],
  s0179: [
    'Yet when he served the Rising King, he received lenient policy and helped found the dynasty—he must surely have felt shame at heart.',
    'Yet serving the Rising King under lenient rule and helping found the dynasty, he must have felt shame at heart.',
  ],
  s0180: [
    'Then he brought ruin on himself—not misfortune.',
    'Then he brought ruin on himself—not misfortune.',
  ],
  s0181: [
    'The Changes says: "When one occupies what is not one\'s to occupy, the body must be in peril."',
    'The Changes says, "Occupy what is not yours to occupy, and the body must be in peril."',
  ],
  s0182: [
    'In advance and retreat, Liang lost what he should have stood on.',
    'In advance and retreat, Liang lost what he should have stood on.',
  ],
  s0183: [
    'Pity!',
    'Pity!',
  ],
  s0184: [
    'Zhang Ji seized the moment to shift course—that too was its time.',
    'Zhang Ji seized the moment to shift course—that too was its time.',
  ],
  s0185: [
    'Wang Ying\'s seal was cast six times and six times the tortoise was ruined—was it a spirit punishing fullness?',
    'Wang Ying\'s seal was cast six times and six times the tortoise was ruined—did a spirit punish excess?',
  ],
  s0186: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0187: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_016_b2.mjs <translation.json>'
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
