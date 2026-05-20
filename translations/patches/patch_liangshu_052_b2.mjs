#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Minzu loved and favored him exceedingly for his early brilliance.',
    'Minzu loved and favored him exceedingly for his early brilliance.',
  ],
  s0102: [
    'Minzu once set four boxes of silver in a row before them and had the grandsons each take one; Jizhi was then only four and alone did not take.',
    'Minzu once set four boxes of silver before them and had the grandsons each take one; Jizhi was only four and alone did not take.',
  ],
  s0103: [
    'When asked why, Jizhi said: "If there is a gift, it should go first to fathers and uncles—it should not pass to grandsons—therefore I do not take."',
    'When asked why, Jizhi said: "If there is a gift, it should go first to fathers and uncles—not to grandsons—therefore I do not take."',
  ],
  s0104: ['Minzu admired him all the more.', 'Minzu admired him all the more.'],
  s0105: [
    'At five he lost his mother and mourned as if an adult.',
    'At five he lost his mother and mourned as if an adult.',
  ],
  s0106: [
    'Earlier, before his mother fell ill, she had him dye clothes outside;',
    'Earlier, before his mother fell ill, she had him dye clothes outside;',
  ],
  s0107: [
    'after her death the household at last redeemed them; Jizhi embraced them and wailed—hearers were all moved to sorrow.',
    'after her death the household at last redeemed them; Jizhi embraced them and wailed—hearers were all moved to sorrow.',
  ],
  s0108: [
    'When grown he loved learning and was indifferent to glory and profit.',
    'When grown he loved learning and was indifferent to glory and profit.',
  ],
  s0109: [
    'He began his career as Gentleman of the Kingdom of Guiyang and Army Aide on the Western Campaign of the Northern General of the Gentlemen, and did not take office—people of the time called him "the Invited Gentleman."',
    'He began as Gentleman of the Kingdom of Guiyang and Army Aide on the Western Campaign of the Northern General of the Gentlemen, and did not take office—people called him "the Invited Gentleman."',
  ],
  s0110: [
    'When mourning for his father ended, Liu Bing, who was concurrently Administrator of Danyang, appointed him Chief Clerk of the Rear Army and concurrently Commandery Merit Officer.',
    'When mourning for his father ended, Liu Bing, concurrently administrator of Danyang, appointed him Chief Clerk of the Rear Army and concurrently Commandery Merit Officer.',
  ],
  s0111: [
    'He went out as Magistrate of Wangcai; shortly afterward he was excused on grounds of illness.',
    'He went out as magistrate of Wangcai; shortly afterward he was excused on grounds of illness.',
  ],
  s0112: [
    'At the time Liu Bing and Yuan Can, because Qi Gaozu\'s power grew daily, were about to plot against him; Bing had always esteemed Jizhi and wished to settle strategy with him.',
    'At the time Liu Bing and Yuan Can, because Qi Gaozu\'s power grew daily, were about to plot against him; Bing had always esteemed Jizhi and wished to settle strategy with him.',
  ],
  s0113: [
    'Jizhi held that Yuan and Liu were Confucians and would surely come to ruin, and firmly declined to go.',
    'Jizhi held that Yuan and Liu were Confucians and would surely come to ruin, and firmly declined to go.',
  ],
  s0114: ['Shortly afterward Bing and the others were executed.', 'Shortly afterward Bing and the others were executed.'],
  s0115: [
    'At the beginning of Qi he was Director of the Ministry of Justice Comparison Section; at the time Chu Yuan was Minister of Works and was on good terms with Jizhi, repeatedly making him Registrar of the Masters of Works and Minister of Works, entrusting him with bureau affairs.',
    'At the beginning of Qi he was Director of the Ministry of Justice Comparison Section; Chu Yuan was Minister of Works and was on good terms with Jizhi, repeatedly making him Registrar of the Masters of Works and Minister of Works, entrusting him with bureau affairs.',
  ],
  s0116: [
    'When Yuan died, Minister of Works Wang Jian, because Yuan had utmost conduct, wished to posthumously title him Duke Wenxiao; Jizhi petitioned: "Wenxiao was Sima Daozi\'s posthumous title—I fear the man was not wholly good; better Wenjian."',
    'When Yuan died, Wang Jian wished to posthumously title him Duke Wenxiao; Jizhi petitioned: "Wenxiao was Sima Daozi\'s posthumous title—I fear the man was not wholly good; better Wenjian."',
  ],
  s0117: ['Jian followed this.', 'Jian followed this.'],
  s0118: [
    'Jizhi also asked Jian to erect a stele for Yuan and saw to it from start to finish—very much the conduct of an official; people of the time praised this.',
    'Jizhi also asked Jian to erect a stele for Yuan and saw to it from start to finish—very much official conduct; people praised this.',
  ],
  s0119: ['He was transferred to Retainer of the Masters of Affairs in the Grand Marshal\'s office.', 'He was transferred to Retainer of the Masters of Affairs in the Grand Marshal\'s office.'],
  s0120: [
    'He went out as Army Aide to the Champion and Administrator of Dongguan; in the commandery he was known as pure and harmonious.',
    'He went out as Army Aide to the Champion and administrator of Dongguan; in the commandery he was known as pure and harmonious.',
  ],
  s0121: [
    'On return he was appointed Attendant of the Scattered Cavalry and concurrently Colonel of the Left Guard, then transferred to Army Adviser on the Western Campaign.',
    'On return he was appointed Attendant of the Scattered Cavalry and Colonel of the Left Guard, then transferred to Army Adviser on the Western Campaign.',
  ],
  s0122: [
    'When Qi Wudi died, Mingdi became regent, executed and purged those unlike himself; Jizhi could not flatter his intent and Mingdi quite feared him, so he sent him out as Chief Clerk Who Assists the State and Administrator of Beihai.',
    'When Qi Wudi died, Mingdi became regent and purged dissenters; Jizhi could not flatter him and Mingdi feared him, sending him out as Chief Clerk Who Assists the State and administrator of Beihai.',
  ],
  s0123: [
    'Chief aide on a frontier post—plain scholars rarely held it.',
    'Chief aide on a frontier post—plain scholars rarely held it.',
  ],
  s0124: [
    'Some urged Jizhi to call at his gate and apologize; once Mingdi saw him he kept him, making him Army Adviser on the Rapid Cavalry and concurrently Director of the Left in the Secretariat.',
    'Some urged Jizhi to call at his gate and apologize; once Mingdi saw him he kept him, making him Army Adviser on the Rapid Cavalry and Director of the Left in the Secretariat.',
  ],
  s0125: [
    'He was then transferred to Administrator of Jian\'an; his government prized quiet purity and the people found it easy.',
    'He was then transferred to administrator of Jian\'an; his government prized quiet purity and the people found it easy.',
  ],
  s0126: [
    'On return he was Attendant of the Secretariat and transferred to General Who Strikes the Foe and concurrently Minister of Justice.',
    'On return he was Attendant of the Secretariat and transferred to General Who Strikes the Foe and minister of justice.',
  ],
  s0127: [
    'When the Liang regime was established, he was transferred to Attendant of the Yellow Gate.',
    'When the Liang regime was established, he was transferred to Attendant of the Yellow Gate.',
  ],
  s0128: [
    'He often said that serving to the rank of two-thousand-dan salary fulfilled his original wish, and he would not busy himself with worldly affairs—then he pleaded illness and returned to his home village.',
    'He often said that serving to two-thousand-dan salary fulfilled his original wish, and he would not busy himself with worldly affairs—then he pleaded illness and returned home.',
  ],
  s0129: [
    'At the beginning of Tianjian he was appointed Grand Master of the Palace at his home.',
    'At the beginning of Tianjian he was appointed Grand Master of the Palace at his home.',
  ],
  s0130: [
    'Gaozu said: "Liang has possessed the realm, yet I never saw this man."',
    'Gaozu said: "Liang has possessed the realm, yet I never saw this man."',
  ],
  s0131: ['In the tenth year he died at home, aged seventy-five.', 'In the tenth year he died at home, aged seventy-five.'],
  s0132: [
    'Jizhi was by nature pure and bitter beyond compare; he also lived in seclusion for more than ten years, and at death his house had only bare walls—sons and grandsons had no means for burial; hearers all grieved for his resolve.',
    'Jizhi was pure and bitter beyond compare; he lived in seclusion more than ten years, and at death his house had only bare walls—descendants had no means for burial; hearers grieved for his resolve.',
  ],
  s0133: ['Xiao Shisu', 'Xiao Shisu'],
  s0134: ['Xiao Shisu was a man of Lanling.', 'Xiao Shisu came from Lanling.'],
  s0135: [
    'His grandfather Sihua was Song General of the West on Equal Terms with the Three Excellencies;',
    'His grandfather Sihua was Song General of the West on Equal Terms with the Three Excellencies;',
  ],
  s0136: ['his father Huiming was Administrator of Wuxing;', 'his father Huiming was administrator of Wuxing;'],
  s0137: ['both had great fame.', 'both had great fame.'],
  s0138: [
    'Shisu was orphaned young and poor and was taken in and supported by his uncle Huixiu.',
    'Shisu was orphaned young and poor and was taken in by his uncle Huixiu.',
  ],
  s0139: [
    'He began his career as Army Aide in the Law Section of the Qi Minister of Works, transferred to Assistant Gentleman of the Secretariat, Attendant of the Heir Apparent, and Director of the Three Excellencies Section in the Secretariat.',
    'He began as Army Aide in the Law Section of the Qi Minister of Works, transferred to Assistant Gentleman of the Secretariat, Attendant of the Heir Apparent, and Director of the Three Excellencies Section.',
  ],
  s0140: ['At the end of Yongyuan he was Groom of the Heir Apparent.', 'At the end of Yongyuan he was Groom of the Heir Apparent.'],
  s0141: [
    'When the Liang regime was established, Gaozu appointed him Retainer of the Masters of Affairs in the Rapid Cavalry and Central Commandant.',
    'When the Liang regime was established, Gaozu appointed him Retainer of the Masters of Affairs in the Rapid Cavalry and Central Commandant.',
  ],
  s0142: [
    'At the beginning of Tianjian he was Friend of the Prince of Linchuan, then again Junior Mentor of the Heir Apparent and Assistant to the Administrator of Danyang.',
    'At the beginning of Tianjian he was Friend of the Prince of Linchuan, then Junior Mentor of the Heir Apparent and assistant to the administrator of Danyang.',
  ],
  s0143: [
    'On first taking office Gaozu bestowed eighty thousand cash; Shisu in one morning scattered it among kin and friends.',
    'On first taking office Gaozu bestowed eighty thousand cash; Shisu in one morning scattered it among kin and friends.',
  ],
  s0144: [
    'He was again transferred to Western Section Clerk of the Left in the Minister of Works and Concurrent Administrator of Southern Xuzhou.',
    'He was again transferred to Western Section Clerk of the Left in the Minister of Works and concurrent administrator of Southern Xuzhou.',
  ],
  s0145: [
    'By nature he was quiet and retiring, with few desires; he loved learning, could speak with pure refinement, and profit and glory did not touch his lips—joy and anger did not show on his face.',
    'Quiet and retiring by nature, with few desires; he loved learning, spoke with pure refinement, and profit and glory did not touch his lips—joy and anger did not show on his face.',
  ],
  s0146: [
    'Among people and in office he was always according to feeling, open and direct, never proud of himself; naturally plain and simple—scholar-gentry all honored him for this.',
    'Among people and in office he was open and direct, never proud; naturally plain and simple—scholars all honored him for this.',
  ],
  s0147: [
    'When at Jingkou he already had the will to end his days there and built a house on Mt She.',
    'When at Jingkou he already had the will to end his days there and built a house on Mt She.',
  ],
  s0148: [
    'He was summoned as Attendant of the Secretariat and then declined and did not go; he returned to his mountain dwelling, lived alone and screened affairs, and kin and friends could not reach his hedge gate.',
    'Summoned as Attendant of the Secretariat, he declined; he returned to his mountain dwelling, lived alone, and kin and friends could not reach his hedge gate.',
  ],
  s0149: [
    'His wife was the daughter of Grand Marshal Wang Jian; long separated from him, in the end there were no sons.',
    'His wife was the daughter of Grand Marshal Wang Jian; long separated from him, in the end there were no sons.',
  ],
  s0150: ['In the eighth year he died.', 'In the eighth year he died.'],
  s0151: [
    'Kin and friends traced his conduct and deeds and gave the posthumous title Recluse Zhenwen.',
    'Kin and friends traced his conduct and gave the posthumous title Recluse Zhenwen.',
  ],
  s0152: [
    'Commentary section marker in the source text.',
    'Marker denoting the historian\'s commentary section in the source text.',
  ],
  s0153: [
    'The historian says: Gu Xianzhi and Tao Jizhi cited age to withdraw; Xiao Shisu had little taste for office.',
    'The historian says: Gu Xianzhi and Tao Jizhi cited age to withdraw; Xiao Shisu had little taste for office.',
  ],
  s0154: [
    'Compared with those who hug salary and cling to favor, lingering among men—how utterly different!',
    'Compared with those who hug salary and cling to favor, lingering among men—how utterly different!',
  ],
  s0155: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0156: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_052_b2.mjs <translation.json>'
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
