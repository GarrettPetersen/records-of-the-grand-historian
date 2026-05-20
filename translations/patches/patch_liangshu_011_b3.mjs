#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'When Jiankang was pacified, Gaozu ordered Sengzhen to lead his troops first into the inner palace; with Zhang Hongce he sealed and inspected the treasury. That same day he kept his current post as acting Administrator of Nan Pengcheng, was promoted to Attendant-in-Ordinary of the Yellow Gate, and concurrently Colonel of the Valiant Cavalry of the Tiger guards.',
    'When Jiankang fell, Gaozu had Sengzhen lead his men first into the inner palace; with Zhang Hongce he sealed and checked the treasury. That day he kept his rank as acting Nan Pengcheng administrator, was made Attendant-in-Ordinary of the Yellow Gate, and held the Tiger guards colonelcy.',
  ],
  s0202: [
    'When Gaozu accepted the abdication, he was made Champion General and front army marshal, enfeoffed as Marquis of Pinggu district with a fief of twelve hundred households.',
    'When Gaozu took the throne, he was made Champion General and front army marshal, enfeoffed as Marquis of Pinggu with twelve hundred households.',
  ],
  s0203: [
    'Soon he was transferred to Attending Within and Right Guard General.',
    'Soon he became Attending Within and Right Guard General.',
  ],
  s0204: [
    'Before long he was transferred to Left Guard General, added Cavalier Attendant-in-Ordinary, entered regular duty at the Secretariat, and had overall charge of palace guard service.',
    'Before long he became Left Guard General, was made Cavalier Attendant-in-Ordinary, took regular duty in the Secretariat, and oversaw the palace guard.',
  ],
  s0205: [
    'In the winter of the fourth year of Tianjian a great northern campaign was launched; from then on military affairs multiplied, and Sengzhen by day was on duty at the Central Secretariat and by night returned to the Secretariat.',
    'In winter of Tianjian year 4 the court launched a major northern campaign; military business piled up, and Sengzhen spent his days at the Central Secretariat and his nights back at the Secretariat.',
  ],
  s0206: [
    'In the summer of the fifth year he was again ordered to lead elite Feathered Forest troops out from Liangcheng.',
    'In summer of year 5 he was again ordered to lead crack Feathered Forest troops from Liangcheng.',
  ],
  s0207: [
    'That winter the army returned; he kept his current post and was made concurrent Crown Prince\'s Assistant in the Palace.',
    'That winter the army came home; he kept his post and was made concurrent crown prince\'s assistant in the palace.',
  ],
  s0208: [
    'Sengzhen had been away from home long and submitted a memorial asking to visit his ancestral tombs.',
    'Long away from home, Sengzhen petitioned to visit his family graves.',
  ],
  s0209: [
    'Gaozu wished to honor him and made him governor of his native province, granting him Bearer of the Staff with credentials, General Who Pacifies the North, and Southern Yanzhou Inspector.',
    'Gaozu meant to honor him with his home province and appointed him Bearer of the Staff, General Who Pacifies the North, and Southern Yanzhou inspector.',
  ],
  s0210: [
    'In office Sengzhen treated subordinates fairly and showed no favor to kin.',
    'In office Sengzhen was even-handed with subordinates and never favored relatives.',
  ],
  s0211: [
    'His father\'s elder brother\'s son had earlier made his living selling scallions; when Sengzhen arrived, he abandoned the trade to seek a provincial post.',
    'A son of his father\'s elder brother had sold scallions for a living; when Sengzhen came to the province, the man quit the trade to seek an official post.',
  ],
  s0212: [
    'Sengzhen said: "I bear the state\'s heavy grace and have no means to repay it; you each have your proper station—how can you rashly seek to overstep? You should quickly return to the scallion shop.',
    'Sengzhen said, "I owe the state a heavy debt I cannot repay; you each have your proper place—how can you seek promotion rashly? Go back to your scallion stall at once.',
  ],
  s0213: [
    '」 Sengzhen\'s old house stood north of the market; before it was the postal inspector\'s office, and fellow townsmen all urged moving the office to enlarge his residence.',
    'Sengzhen\'s old house stood north of the market, with the postal inspector\'s office in front; neighbors all urged moving the office to enlarge his home.',
  ],
  s0214: [
    'Sengzhen said angrily: "The postal inspector\'s office is a government building; since it was established it has stood here—how can it be moved to enlarge my private house!',
    'Sengzhen snapped, "The postal inspector\'s office is a government building; it has stood here since it was built—how can you move it to enlarge my private house!',
  ],
  s0215: [
    '」 His elder sister had married into the Yu clan and lived west of the market in a small house facing the road, mixed among shop stalls; Sengzhen often led his full guard retinue to her home and was not ashamed.',
    'His elder sister had married a Yu and lived west of the market in a little house on the street amid the shops; Sengzhen often led his full guard escort to her door and felt no shame.',
  ],
  s0216: [
    'After a hundred days in the province he was summoned as Commandant of the Guards; soon he was added Cavalier Attendant-in-Ordinary, given one set of ceremonial drums and pipes, and held Secretariat duty as before.',
    'After a hundred days in the province he was recalled as Commandant of the Guards, soon made Cavalier Attendant-in-Ordinary, given ceremonial drums and pipes, and kept his Secretariat duty as before.',
  ],
  s0217: [
    'Sengzhen had great merit, held overall charge of the ruler\'s inner circle, and enjoyed favor so dense that none could compare.',
    'Sengzhen had great merit, stood at the heart of power, and enjoyed favor so close that none could match him.',
  ],
  s0218: [
    'By nature he was very respectful and cautious; when on duty in the palace, even in great heat he dared not loosen his clothing.',
    'Deeply respectful and cautious by nature, on palace duty he would not loosen his clothes even in fierce summer heat.',
  ],
  s0219: [
    'Whenever he attended the imperial seat he held his breath and bowed; he never once raised his chopsticks to the fruit set before him.',
    'Whenever he attended the throne he held his breath and bowed low; he never once touched the fruit set before him.',
  ],
  s0220: [
    'Once, when drunk, he took a mandarin orange and ate it.',
    'Once, drunk, he took a mandarin and ate it.',
  ],
  s0221: [
    'Gaozu laughingly said to him: "That is a great advance.',
    'Gaozu laughed and said, "That is real progress.',
  ],
  s0222: [
    '」 Beyond his salary he was also given a hundred thousand cash each month;',
    'Beyond his salary he also received a hundred thousand cash a month;',
  ],
  s0223: [
    'other gifts and rewards were unceasing.',
    'and other gifts and rewards never stopped.',
  ],
  s0224: [
    'In the tenth year he fell ill; the imperial carriage visited him, and palace emissaries brought medicine several times a day.',
    'In year 10 he fell ill; the emperor came in person, and palace envoys brought medicine several times daily.',
  ],
  s0225: [
    'Sengzhen told relatives and friends: "I was once in Meng county with fever and turned yellow; then I surely thought I would not survive. The lord said to me, \'You have the look of wealth and rank—you will surely not die and should soon recover on your own\'—and indeed I soon recovered.',
    'Sengzhen told kin, "Once in Meng county I had fever and turned yellow and was sure I would die. His Majesty said, \'You have a nobleman\'s look—you will not die and will soon recover\'—and I did.',
  ],
  s0226: [
    'Now, having wealth and rank, I have turned yellow again; the affliction is exactly the same as before—I surely will not rise again.',
    'Now that I am wealthy and honored I have turned yellow again with the same illness as then—I will not get up again.',
  ],
  s0227: [
    '」 In the end it was as he said.',
    'In the end it was as he said.',
  ],
  s0228: [
    'He died at the Commandant of the Guards residence, aged fifty-eight.',
    'He died at the Commandant of the Guards residence at fifty-eight.',
  ],
  s0229: [
    'Gaozu that same day came to the mourning hall. The edict said: "Thinking fondly of the old and honoring the end—the former kings\' fine model;',
    'Gaozu came to the mourning hall that same day. The edict said, "Cherishing the old and honoring the dead is the ancient kings\' model;',
  ],
  s0230: [
    'pursuing glory with added rank—the rule of every dynasty.',
    'adding posthumous glory is the rule of every age.',
  ],
  s0231: [
    'Cavalier Attendant-in-Ordinary, Commandant of the Guards, and Marquis of Pinggu district Sengzhen—his talent and thought were broad and penetrating, his knowledge and bearing detailed and accomplished; he exhausted loyalty and full ritual and knew nothing he would not do.',
    'Cavalier Attendant-in-Ordinary, Commandant of the Guards, and Marquis of Pinggu Sengzhen had broad talent and penetrating thought, detailed knowledge and accomplished bearing, gave exhaustive loyalty and full ritual, and left nothing undone.',
  ],
  s0232: [
    'With us in shared hardship, his feelings embraced both adversity and ease.',
    'He shared our hardships, his heart holding both hard times and good.',
  ],
  s0233: [
    'When the great undertaking was first built, splendid merit was achieved.',
    'When the great enterprise was first raised, he won splendid merit.',
  ],
  s0234: [
    'When he held palace guard duty, morning and evening he gave full sincerity.',
    'In palace guard service he gave his utmost morning and evening.',
  ],
  s0235: [
    'Just as he was to share responsibility at the high ministries and elevate the court\'s trust,',
    'Just as he was to take his place among the highest ministers and bear the court\'s heavy trust,',
  ],
  s0236: [
    'he suddenly met death and loss—grief filled the breast.',
    'he suddenly died—grief filled our hearts.',
  ],
  s0237: [
    'Superior rites should be added to exalt the favored mandate.',
    'Let superior rites be added to honor his service.',
  ],
  s0238: [
    'He may posthumously be granted General of Fast Cavalry and Office equaling the Three Excellencies in Staff; Cavalier Attendant, drums and pipes, and marquisate as before.',
    'Posthumously grant him General of Fast Cavalry and an office equal to the Three Excellencies in staff; his cavalier attendant rank, drums and pipes, and marquisate remain as before.',
  ],
  s0239: [
    'Eastern garden secret vessels are given, one set of court robes and one suit of clothes; whatever the funeral requires shall be prepared as needed.',
    'Grant eastern-garden funeral vessels, one court robe, and one suit of clothes; prepare whatever the funeral requires.',
  ],
  s0240: [
    'Posthumous title: Marquis Zhongjing.',
    'Posthumous title: Loyal and Respectful Marquis.',
  ],
  s0241: [
    '」 Gaozu grieved deeply and spoke with tears streaming.',
    'Gaozu grieved deeply and wept as he spoke.',
  ],
  s0242: [
    'His eldest son Jun died early; Jun\'s son Dan succeeded.',
    'His eldest son Jun died young; Jun\'s son Dan inherited.',
  ],
  s0243: [
    'Chen Minister of Personnel Yao Cha said: Zhang Hongce was steady and careful, Lü Sengzhen diligent without slack, and Zheng Shaoshu loyal and bright—they helped found the royal enterprise, and all three contributed strength.',
    'Chen Minister of Personnel Yao Cha said: Zhang Hongce was steady and careful, Lü Sengzhen tireless in duty, and Zheng Shaoshu loyal and upright; in founding the dynasty all three gave real force.',
  ],
  s0244: [
    'Sengzhen\'s solemn reverence in the forbidden palace and Shaoshu\'s intimate counsel in subtle words at the knee—they surely knew a minister\'s duty.',
    'Sengzhen\'s grave courtesy in the palace guard and Shaoshu\'s candid words at close audience show they understood a subject\'s duty.',
  ],
  s0245: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0246: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_011_b3.mjs <translation.json>'
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
