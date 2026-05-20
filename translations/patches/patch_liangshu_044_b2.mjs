#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'He went out as General of Proclaimed Grace and governor of Danyang.',
    'He went out as General of Proclaimed Grace and governor of Danyang.',
  ],
  s0102: [
    'In the second year he supervised Yangzhou, general as before.',
    'In the second year he supervised Yangzhou, keeping his general\'s title.',
  ],
  s0103: [
    'By autumn he was killed; he was thirteen.',
    'By autumn he was killed at thirteen.',
  ],
  s0104: [
    'The Prince of Wuning, Dawei, courtesy name Renrong.',
    'Prince of Wuning Dawei, styled Renrong.',
  ],
  s0105: [
    'Handsome in bearing, his brows and eyes like a painting.',
    'Handsome in bearing, brows and eyes like a painting.',
  ],
  s0106: [
    'In the first year of Great Treasure he was enfeoffed Prince of Wuning commandery with a fief of two thousand households.',
    'In the first year of Great Treasure he was enfeoffed Prince of Wuning with two thousand households.',
  ],
  s0107: [
    'In the second year he went out as General of Trusted Might and governor of Danyang.',
    'In the second year he went out as General of Trusted Might and governor of Danyang.',
  ],
  s0108: [
    'That autumn he was killed; he was thirteen.',
    'That autumn he was killed at thirteen.',
  ],
  s0109: [
    'The Prince of Jianping, Daqiu, courtesy name Renting.',
    'Prince of Jianping Daqiu, styled Renting.',
  ],
  s0110: [
    'In the first year of Great Treasure he was enfeoffed Prince of Jianping commandery with a fief of two thousand households.',
    'In the first year of Great Treasure he was enfeoffed Prince of Jianping with two thousand households.',
  ],
  s0111: [
    'By nature bright and clever from early youth.',
    'By nature bright and clever from early youth.',
  ],
  s0112: [
    'Earlier, when Hou Jing besieged the capital, the Founding Emperor had long turned his heart to Buddhism; whenever he made a vow he always said: "If there are living beings who should suffer every pain, let it all be transferred to my body in their stead.',
    'When Hou Jing besieged the capital, the Founding Emperor had long turned to Buddhism; whenever he vowed he said, "If living beings should suffer every pain, let it all pass to my body in their stead.',
  ],
  s0113: [
    '" Daqiu was just seven; hearing this he was startled and said to his mother: "If the ruler is still like this, how dare I refuse?',
    '" Daqiu was just seven; hearing this he said to his mother, "If the ruler is still like this, how dare I refuse?',
  ],
  s0114: [
    '" He then worshiped Buddha at the six hours and likewise said: "Whatever living beings should receive bitter retribution, let Daqiu receive it all in their stead.',
    '" He worshiped Buddha at the six hours and said, "Whatever living beings should receive bitter retribution, let Daqiu receive it all in their stead.',
  ],
  s0115: [
    '" Such was his early wisdom.',
    '" Such was his early wisdom.',
  ],
  s0116: [
    'In the second year he went out as General of Light Chariots and concurrently commander of the Stone City garrison.',
    'In the second year he went out as General of Light Chariots and concurrently commander of the Stone City garrison.',
  ],
  s0117: [
    'That autumn he was killed; he was eleven.',
    'That autumn he was killed at eleven.',
  ],
  s0118: [
    'The Prince of Suijian, Dazhi, courtesy name Renying.',
    'Prince of Suijian Dazhi, styled Renying.',
  ],
  s0119: [
    'From youth bold and strong with martial spirit; when the capital fell he sighed: "A great man ought to destroy these bandit slaves.',
    'From youth bold with martial spirit; when the capital fell he sighed, "A great man ought to destroy these bandit slaves.',
  ],
  s0120: [
    '" His nurse in alarm covered his mouth: "Do not speak rashly—calamity will come!',
    '" His nurse covered his mouth in alarm, "Do not speak rashly—calamity will come!',
  ],
  s0121: [
    '" Dazhi laughed: "Calamity will not come from these words.',
    '" Dazhi laughed, "Calamity will not come from these words.',
  ],
  s0122: [
    'In the first year of Great Treasure he was enfeoffed Prince of Suijian commandery with a fief of two thousand households.',
    'In the first year of Great Treasure he was enfeoffed Prince of Suijian with two thousand households.',
  ],
  s0123: [
    'In the second year he was General of Peaceful Distance and was killed; he was ten.',
    'In the second year he was General of Peaceful Distance and was killed at ten.',
  ],
  s0124: [
    'The sons of Emperor Shizu: Lady Xu bore the Loyal and Upright Heir Fang Deng; Lady Wang bore the Upright and Gracious Heir Fang Zhu; the Lamented and Cherished Crown Prince Fang Ju',
    'Emperor Shizu\'s sons: Lady Xu bore Loyal and Upright Heir Fang Deng; Lady Wang bore Upright and Gracious Heir Fang Zhu; Lamented and Cherished Crown Prince Fang Ju',
  ],
  s0125: [
    'Opening bracket of an editorial note in the source text.',
    'The source text opens an editorial parenthesis here.',
  ],
  s0126: [
    '(his birth mother is not recorded in this book; he has a separate biography)〉',
    '(his birth mother is not recorded in this book; he has a separate biography)〉',
  ],
  s0127: [
    'Lady Xia the Worthy bore Emperor Jing.',
    'Lady Xia the Worthy bore Emperor Jing.',
  ],
  s0128: [
    'The remaining sons all have no biography in this book.',
    'The remaining sons have no biography in this book.',
  ],
  s0129: [
    'The Loyal and Upright Heir Fang Deng, courtesy name Shixiang, was the eldest son of Emperor Shizu.',
    'Loyal and Upright Heir Fang Deng, styled Shixiang, was Emperor Shizu\'s eldest son.',
  ],
  s0130: [
    'His mother was Lady Xu.',
    'His mother was Lady Xu.',
  ],
  s0131: [
    'From youth clever and keen, with outstanding talent, skilled at riding and shooting, especially gifted in ingenious design.',
    'From youth clever and keen, with outstanding talent, skilled at riding and shooting, especially gifted in ingenious design.',
  ],
  s0132: [
    'By nature he loved forests and springs and especially favored untrammeled wandering.',
    'By nature he loved forests and springs and favored untrammeled wandering.',
  ],
  s0133: [
    'He once composed a discourse saying: "Life in the world is like a white colt crossing a crack.',
    'He once wrote, "Life in the world is like a white colt crossing a crack.',
  ],
  s0134: [
    'One jug of wine is enough to nurture the nature;',
    'One jug of wine is enough to nurture the nature;',
  ],
  s0135: [
    'one basket of food is enough to delight the form.',
    'one basket of food is enough to delight the form.',
  ],
  s0136: [
    'Born among weeds, buried in ditches—how do tile coffin and stone outer coffin differ from this?',
    'Born among weeds, buried in ditches—how do tile coffin and stone outer coffin differ?',
  ],
  s0137: [
    'I once dreamed I was a fish and then transformed into a bird.',
    'I once dreamed I was a fish and then became a bird.',
  ],
  s0138: [
    'While dreaming, what joy could match it;',
    'While dreaming, what joy could match it;',
  ],
  s0139: [
    'when I awoke, what sorrow of that kind;',
    'when I awoke, what sorrow of that kind;',
  ],
  s0140: [
    'truly because I fall far short of fish and birds.',
    'truly because I fall far short of fish and birds.',
  ],
  s0141: [
    'Thus fish and birds fly and float, following their nature and will;',
    'Thus fish and birds fly and float, following their nature and will;',
  ],
  s0142: [
    'my advance and retreat always rest in another\'s grasp.',
    'my advance and retreat always rest in another\'s grasp.',
  ],
  s0143: [
    'Raising a hand I fear to touch; moving a foot I fear to fall.',
    'Raising a hand I fear to touch; moving a foot I fear to fall.',
  ],
  s0144: [
    'If I could at last roam with fish and birds, leaving the human world would be like doffing shoes."',
    'If I could roam with fish and birds at last, leaving the human world would be like doffing shoes."',
  ],
  s0145: [
    'Earlier Lady Xu had lost favor through jealousy; Fang Deng felt ill at ease.',
    'Earlier Lady Xu had lost favor through jealousy; Fang Deng felt ill at ease.',
  ],
  s0146: [
    'Emperor Shizu heard and also disliked Fang Deng; Fang Deng grew more afraid and therefore set forth this discourse to declare his intent.',
    'Shizu heard and also disliked Fang Deng; he grew more afraid and set forth this discourse to declare his intent.',
  ],
  s0147: [
    'When the Founding Emperor wished to see the eldest sons of the princes, Shizu sent Fang Deng to attend; Fang Deng gladly boarded the boat, hoping to escape worry and disgrace.',
    'When the Founding Emperor wished to see princes\' eldest sons, Shizu sent Fang Deng to attend; he gladly boarded the boat, hoping to escape worry and disgrace.',
  ],
  s0148: [
    'Reaching Yaoshui he met Hou Jing\'s rebellion; Shizu summoned him; Fang Deng memorialized: "Formerly Shensheng did not love his life—how would Fang Deng cherish his?',
    'Reaching Yaoshui he met Hou Jing\'s rebellion; Shizu summoned him; Fang Deng memorialized, "Formerly Shensheng did not love his life—how would I cherish mine?',
  ],
  s0149: [
    '" Shizu read the letter, sighed, knew he had no mind to return, and assigned him ten thousand foot and horse to relieve the capital.',
    '" Shizu read the letter, sighed, knew he had no mind to return, and assigned him ten thousand foot and horse to relieve the capital.',
  ],
  s0150: [
    'Whenever the bandit came to attack Fang Deng always met arrows and stones in person.',
    'Whenever the bandit attacked Fang Deng always met arrows and stones in person.',
  ],
  s0151: [
    'When the palace city fell Fang Deng returned to Jingzhou, gathered soldiers and horses, and won great harmony among the host—Shizu then sighed at his ability.',
    'When the palace city fell he returned to Jingzhou, gathered soldiers and horses, and won great harmony among the host—Shizu then sighed at his ability.',
  ],
  s0152: [
    'Fang Deng also urged building walls and palisades against the unforeseen.',
    'He also urged building walls and palisades against the unforeseen.',
  ],
  s0153: [
    'When finished, towers and battlements faced one another, the circuit more than seventy li.',
    'When finished, towers and battlements faced one another for more than seventy li.',
  ],
  s0154: [
    'Shizu viewed it with great pleasure, entered and said to Lady Xu: "If I had another son like this, what more would I worry about!',
    'Shizu viewed it with great pleasure and said to Lady Xu, "If I had another son like this, what more would I worry about!',
  ],
  s0155: [
    '" Lady Xu did not answer, wept, and withdrew.',
    '" Lady Xu did not answer, wept, and withdrew.',
  ],
  s0156: [
    'Shizu in anger therefore set forth her shameful conduct and posted it on the great gate.',
    'Shizu in anger set forth her shameful conduct and posted it on the great gate.',
  ],
  s0157: [
    'Fang Deng came to audience and felt still more endangered.',
    'Fang Deng came to audience and felt still more endangered.',
  ],
  s0158: [
    'At the time the Prince of Hedong was inspector of Xiangzhou and did not accept the headquarters\' orders; Fang Deng begged to campaign against him and Shizu granted it.',
    'The Prince of Hedong was inspector of Xiangzhou and did not accept headquarters orders; Fang Deng begged to campaign against him and Shizu granted it.',
  ],
  s0159: [
    'He was made commander and ordered to lead twenty thousand picked troops south to attack.',
    'He was made commander and ordered to lead twenty thousand picked troops south.',
  ],
  s0160: [
    'As Fang Deng set out he told those close to him: "On this campaign I shall surely die without second thought;',
    'Setting out he told those close to him, "On this campaign I shall surely die without second thought;',
  ],
  s0161: [
    'if in death I gain my aim, how would I love life.',
    'if in death I gain my aim, how would I love life.',
  ],
  s0162: [
    '" Reaching Maxi, the Prince of Hedong led his army to meet battle; Fang Deng attacked; the army was defeated and he drowned; he was twenty-two.',
    '" Reaching Maxi, the Prince of Hedong met him in battle; Fang Deng attacked; the army was defeated and he drowned at twenty-two.',
  ],
  s0163: [
    'Shizu heard and did not grieve.',
    'Shizu heard and did not grieve.',
  ],
  s0164: [
    'Later, recalling his talent, he posthumously made him palace attendant, central army commander, and inspector of Yangzhou, titled Loyal and Upright Heir, and also performed a soul-summoning rite to mourn him.',
    'Later, recalling his talent, he posthumously made him palace attendant, central army commander, and inspector of Yangzhou, titled Loyal and Upright Heir, and performed a soul-summoning rite to mourn him.',
  ],
  s0165: [
    'Fang Deng annotated Fan Ye\'s Book of Later Han but did not finish;',
    'He annotated Fan Ye\'s Book of Later Han but did not finish;',
  ],
  s0166: [
    'what he compiled, Records of Thirty Kingdoms and Master Quiet Dwelling, circulated in the world.',
    'what he compiled, Records of Thirty Kingdoms and Master Quiet Dwelling, circulated in the world.',
  ],
  s0167: [
    'The Upright and Gracious Heir Fang Zhu, courtesy name Zhixiang, was Emperor Shizu\'s second son.',
    'Upright and Gracious Heir Fang Zhu, styled Zhixiang, was Shizu\'s second son.',
  ],
  s0168: [
    'His mother was Lady Wang.',
    'His mother was Lady Wang.',
  ],
  s0169: [
    'From youth clever, alert, and broadly learned, he understood the Laozi and Changes, was skilled in Dark Learning discourse, his bearing clear and surpassing, his argument sharp as a blade—he was especially loved by Shizu, and his mother Lady Wang also held favor.',
    'From youth clever and broadly learned, he understood the Laozi and Changes, was skilled in Dark Learning, clear in bearing, sharp in argument—especially loved by Shizu, and his mother Lady Wang also held favor.',
  ],
  s0170: [
    'When Fang Deng was destroyed Shizu said to him: "Without casting something aside, how can anything rise.',
    'When Fang Deng was destroyed Shizu said to him, "Without casting something aside, how can anything rise.',
  ],
  s0171: [
    '" He was made Pacifying Central Army as Shizu\'s deputy, went out as inspector of E prefecture, garrisoned Jiangxia, with Bao Quan as acting officer to block the downstream route.',
    '" He was made Pacifying Central Army as Shizu\'s deputy, went out as inspector of E, garrisoned Jiangxia, with Bao Quan as acting officer to block downstream.',
  ],
  s0172: [
    'At the time Shizu sent Xu Wensheng to command the armies in stalemate with Hou Jing\'s general Ren Yue.',
    'Shizu sent Xu Wensheng to command armies in stalemate with Hou Jing\'s general Ren Yue.',
  ],
  s0173: [
    'Fang Zhu relied on Wensheng being near and did not tend military affairs, daily drinking and making merry with Bao Quan.',
    'Fang Zhu relied on Wensheng being near and neglected military affairs, daily drinking with Bao Quan.',
  ],
  s0174: [
    'Hou Jing learned of it and sent his general Song Zixian with several hundred light horse by a bypath to strike.',
    'Hou Jing learned of it and sent general Song Zixian with several hundred light horse by a bypath to strike.',
  ],
  s0175: [
    'Wind and rain made the sky dark; when Zixian arrived the people ran to report, yet Fang Zhu and Bao Quan still did not believe it and said: "Lord Xu Wensheng\'s great army is below—how could the barbarian come?',
    'Wind and rain darkened the sky; when Zixian arrived the people ran to report, yet Fang Zhu and Bao Quan still did not believe and said, "Xu Wensheng\'s great army is below—how could the barbarian come?',
  ],
  s0176: [
    '" Only then were they ordered to shut the gate; the bandit horse had already entered and the city fell; Zixian seized Fang Zhu and returned.',
    '" Only then were they ordered to shut the gate; bandit horse had already entered and the city fell; Zixian seized Fang Zhu and returned.',
  ],
  s0177: [
    'When Wang Sengbian\'s army reached Cai Isle, Jing then killed him.',
    'When Wang Sengbian\'s army reached Cai Isle, Jing killed him.',
  ],
  s0178: [
    'Shizu posthumously made him palace attendant and grand general.',
    'Shizu posthumously made him palace attendant and grand general.',
  ],
  s0179: [
    'His posthumous title was Upright and Gracious Heir.',
    'His posthumous title was Upright and Gracious Heir.',
  ],
  s0180: [
    'The historian says: The sons of the Heir Apparent Taizong and Emperor Shizu, though they opened territories, met a time of chaos and separation;',
    'The historian writes: The sons of Taizong and Shizu, though they opened territories, met chaos and separation;',
  ],
  s0181: [
    'once seized by bandits, most died untimely deaths.',
    'once seized by bandits, most died untimely deaths.',
  ],
  s0182: [
    'Alas!',
    'Alas!',
  ],
  s0183: [
    'Lamentable indeed.',
    'Lamentable indeed.',
  ],
  s0184: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0185: [
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_044_b2.mjs <translation.json>'
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
