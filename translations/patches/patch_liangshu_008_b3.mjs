#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Already turning back yet doubting again, as if he sought something and then lost it;',
    'Turning homeward yet doubting again, as though he had sought something and then lost it;',
  ],
  s0202: [
    'Deeming heaven and earth without heart, he suddenly plunged forever into concealment of his bodily form.',
    'Deeming heaven and earth heartless, he suddenly sank forever from mortal sight.',
  ],
  s0203: [
    'Alas, how mournful!',
    'Alas, how mournful!',
  ],
  s0204: [
    'Approaching the dark obscurity of the hidden palace, settling his spirit\'s rest in clear seclusion;',
    'He entered the hidden palace\'s dark silence and laid his spirit to rest in clear seclusion;',
  ],
  s0205: [
    'Transmitting his sounding glory through splendid canon, viewing his virtue\'s achievement in posthumous title;',
    'His fame is handed down in grand rite; his virtue is read in his posthumous name;',
  ],
  s0206: [
    'Hang loyalty and constancy upon sun and moon, spread great fame through heaven and earth;',
    'Loyalty and constancy hang with sun and moon; his great name spreads through heaven and earth;',
  ],
  s0207: [
    'Only this petty minister\'s record of words—truly holding the brush without shame.',
    'Only this humble minister\'s written record—truly pen in hand without shame.',
  ],
  s0208: [
    'Alas, how mournful!',
    'Alas, how mournful!',
  ],
  s0209: [
    'The crown prince\'s humane virtue had long been manifest; when he passed away, court and commoners were stunned with regret.',
    'The crown prince\'s humane virtue was long renowned; at his death court and countryside alike were stricken with grief.',
  ],
  s0210: [
    'Men and women of the capital ran to the palace gates, wailing and filling the roads.',
    'Men and women of the capital rushed to the palace gates, wailing until the roads were full.',
  ],
  s0211: [
    'Common folk of the four quarters, and people of the frontier marches, hearing of the mourning all wept bitterly.',
    'Commoners in every quarter, even people on the frontier marches, wept bitterly when they heard of the mourning.',
  ],
  s0212: [
    'His collected literary works numbered twenty juan;',
    'His collected literary works ran to twenty juan;',
  ],
  s0213: [
    'he also compiled ancient and modern canonical edicts in literary language, making Correct Sequence in ten juan;',
    'he also compiled ancient and modern edicts in literary language as Correct Sequence in ten juan;',
  ],
  s0214: [
    'the finest of his five-character poems he made Literary Flowers in twenty juan;',
    'his finest five-character poems he gathered as Literary Flowers in twenty juan;',
  ],
  s0215: [
    'Literary Selections in thirty juan.',
    'Literary Selections in thirty juan.',
  ],
  s0216: [
    'Lamented Crown Prince Daqi, styled Renzong, was Emperor Taizong\'s eldest son by the chief consort.',
    'Lamented Crown Prince Daqi, styled Renzong, was Taizong\'s eldest son by the chief consort.',
  ],
  s0217: [
    'In the fifth month of Putong year 4, day dingyou, he was born.',
    'He was born in the fifth month of Putong year 4, on dingyou day.',
  ],
  s0218: [
    'In Zhongdatong year 4 he was enfeoffed Prince of Xuancheng commandery, fief of two thousand households.',
    'In Zhongdatong year 4 he was made Prince of Xuancheng commandery with a fief of two thousand households.',
  ],
  s0219: [
    'Soon he became Attendant-in-Ordinary and General of the Central Guard, with one set of martial music granted.',
    'Soon he was made Attendant-in-Ordinary and Central Guard general, with one set of martial music granted.',
  ],
  s0220: [
    'In Datong year 4 he was appointed Bearer of the Staff, Commander of all military affairs of Yang and Xu provinces, Grand General of the Central Army, and Governor of Yangzhou, Attendant-in-Ordinary as before.',
    'In Datong year 4 he was made Bearer of the Staff, commander of Yang and Xu military affairs, Central Army grand general, and Governor of Yangzhou, remaining Attendant-in-Ordinary.',
  ],
  s0221: [
    'In the tenth month of Taqing year 2, Hou Jing raided the capital; an edict made the crown prince Grand Commander within the Terrace.',
    'In the tenth month of Taqing year 2 Hou Jing attacked the capital; by edict the crown prince became Grand Commander within the Terrace.',
  ],
  s0222: [
    'In the fifth month of the third year, Taizong took the throne.',
    'In the fifth month of year 3 Taizong took the throne.',
  ],
  s0223: [
    'On dinghai of the sixth month he was established as crown prince.',
    'On dinghai of the sixth month he was established crown prince.',
  ],
  s0224: [
    'In the eighth month of Dabao year 2 the rebel Jing deposed Taizong and was about to kill the crown prince; at that time Jing\'s partisans claimed Jing\'s order summoned the crown prince. The crown prince was lecturing on the Laozi and was about to rise from the couch when the executioners suddenly arrived.',
    'In the eighth month of Dabao year 2 the rebel Jing deposed Taizong and meant to kill the crown prince; Jing\'s men claimed an order from Jing summoned him. The crown prince was lecturing on the Laozi and was rising from his couch when executioners burst in.',
  ],
  s0225: [
    'The crown prince\'s countenance did not change; he said slowly: "I have long known this—alas that it comes so late.',
    'The crown prince\'s face did not change; he said calmly, "I have long known this—only that it comes so late.',
  ],
  s0226: [
    '" The executioners wished to strangle him with his sash.',
    '" The executioners meant to strangle him with his sash.',
  ],
  s0227: [
    'The crown prince said: "That cannot serve to kill me.',
    'The crown prince said, "That will not do to kill me.',
  ],
  s0228: [
    '" He then pointed to the rope beneath the tent pole and ordered it taken to strangle him to death; he was then twenty-eight.',
    '" He pointed to the rope on the tent pole and ordered them to take it and strangle him; he was twenty-eight.',
  ],
  s0229: [
    'The crown prince by nature was mild and harmonious, and also of dignified spirit and bearing; in the rebels\' hands he never bent his will.',
    'By nature the crown prince was mild and harmonious, with a dignified spirit and bearing; even in rebel hands he never bent his will.',
  ],
  s0230: [
    'At first, when Hou Jing marched west, he took the crown prince with him; when he was defeated and returned, the ranks were no longer in good order. The crown prince\'s boat lagged behind and could not keep up with the rebel host; his close attendants and trusted followers all urged him to take this chance to flee north.',
    'At first, when Hou Jing marched west he took the crown prince along; when defeated on his return the ranks were no longer disciplined. The crown prince\'s boat fell behind the rebel host, and his close attendants all urged him to seize the chance and flee north.',
  ],
  s0231: [
    'The crown prince said: "House and state are ruined—I have no thought of living;',
    'The crown prince said, "House and state are ruined—I have no wish to live;',
  ],
  s0232: [
    'the sovereign suffers dust and hardship—how could I bear to leave him?',
    'the sovereign is lost in hardship—how could I bear to leave him?',
  ],
  s0233: [
    'If I flee and hide now, I am rebelling against my father, not merely avoiding bandits.',
    'If I flee and hide now, I rebel against my father; it is not merely to avoid bandits.',
  ],
  s0234: [
    '" Thereupon he wept and sobbed aloud and ordered them to press forward at once.',
    '" He wept aloud and ordered them to press forward at once.',
  ],
  s0235: [
    'The rebels, because the crown prince had bearing and capacity, always feared him and, dreading future trouble, struck at him first.',
    'The rebels, seeing the crown prince\'s bearing and capacity, always feared him; dreading future trouble, they struck at him first.',
  ],
  s0236: [
    'In the fourth month of Chengsheng year 1 he was posthumously titled Lamented Crown Prince.',
    'In the fourth month of Chengsheng year 1 he was posthumously titled Lamented Crown Prince.',
  ],
  s0237: [
    'The crown prince was clever and keen, quite in Shizu\'s manner, yet fierce, violent, and suspicious.',
    'The crown prince was clever and keen, much in Shizu\'s manner, yet fierce, violent, and suspicious.',
  ],
  s0238: [
    'Emperor Jing at imperial mandate posthumously titled him Crown Prince Minhuai.',
    'Emperor Jing, acting on imperial mandate, posthumously titled him Crown Prince Minhuai.',
  ],
  s0239: [
    'Yao Cha, Minister of Personnel of Chen, said: Mencius has a saying: "Rising at cockcrow to labor in goodness—these are followers of Shun.',
    'Yao Cha, Chen Minister of Personnel, said: Mencius says, "Rising at cockcrow to labor in goodness—these are followers of Shun.',
  ],
  s0240: [
    '" If plain-clothed girdled scholars in field and furrow toil at it all day, the benefit is already broad.',
    '" For plain-clothed scholars in field and furrow to labor at it all day, the benefit is already great.',
  ],
  s0241: [
    'How much more one who occupies the position of doubled brightness, dwells in the honor of the principal heir, keeps thought without slackness, and advances in filial piety!',
    'How much more for one who holds the place of doubled brightness, dwells in the honor of the principal heir, keeps thought without slackness, and advances in filial piety!',
  ],
  s0242: [
    'How far could the virtue of great Shun be!',
    'How far off could the virtue of great Shun be!',
  ],
  s0243: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0244: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_008_b3.mjs <translation.json>'
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
