#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'While in Wu he had several lapses involving drink; he was transferred to Administrator of Dongyang.',
    'In Wu he had several lapses with wine; he was transferred to administrator of Dongyang.',
  ],
  s0302: [
    'In office Yuan hated the powerful and wealthy as if they were mortal enemies; he treated the poor and lowly as his own children and sons, and the local gentry especially feared and respected him.',
    'In office Yuan hated the rich and powerful like mortal foes and treated the poor like his own kin—the gentry especially feared him.',
  ],
  s0303: [
    'After slightly more than a year in Dongyang, he was again slandered by those he had punished; convicted on the charges, he was dismissed and sent home.',
    'After a year in Dongyang, those he had punished slandered him again; convicted, he was dismissed and sent home.',
  ],
  s0304: [
    'Yuan was upright and incorruptible; living among men, he cut off all petitions and visits and never paid calls on others.',
    'Upright and free of private bias, Yuan cut off petitions and visits and never called on others.',
  ],
  s0305: [
    'In letters to high and low alike, he observed equal courtesy throughout.',
    'In letters to high and low alike, he kept equal courtesy.',
  ],
  s0306: [
    'In every encounter he never softened his bearing toward others—and for this vulgar men often despised him.',
    'He never softened his manner toward anyone he met—and vulgar men often despised him for it.',
  ],
  s0307: [
    'His integrity and fairness were truly unrivaled under Heaven.',
    'His integrity was truly unrivaled under Heaven.',
  ],
  s0308: [
    'Though he governed several commanderies, whenever tempting gain came within sight he never changed in heart; wife and children knew hunger and cold like the poorest of men.',
    'Though he governed several commanderies, tempting gain never changed his heart; wife and children knew hunger and cold like the poorest men.',
  ],
  s0309: [
    'When he left Dongyang and returned home, year after year he never spoke of honor or disgrace—and scholars all the more admired him for it.',
    'When he left Dongyang for home, year after year he never spoke of honor or disgrace—and scholars admired him all the more.',
  ],
  s0310: [
    'He was lightly attached to wealth yet loved righteousness, rushing to relieve others in distress; his words were never hollow or false—this was surely his nature.',
    'He scorned wealth yet loved righteousness, rushed to help the desperate, and never spoke falsely—it was his nature.',
  ],
  s0311: [
    'He would often jestingly tell people: "If you can get one false word from me, I\'ll thank you with a bolt of silk."',
    'He often jested: "Get one false word from me and I\'ll thank you with a bolt of silk."',
  ],
  s0312: [
    'The crowd all watched for it—they could never record a single instance.',
    'All watched for it—they never caught a single false word.',
  ],
  s0313: [
    'Later he was again raised to Staff Counselor of the Pacifying West and Army Aide of the Central Pacification.',
    'Later he was raised again as staff counselor of the Pacifying West and army aide of the Central Pacification.',
  ],
  s0314: [
    'In the second year of Putong he died, aged fifty-two.',
    'In the second year of Putong he died, aged fifty-two.',
  ],
  s0315: [
    'Gaozu bestowed rich posthumous gifts on him.',
    'Gaozu bestowed rich posthumous gifts on him.',
  ],
  s0316: [
    'Commentary section marker in the source text.',
    'Marker denoting the historian\'s commentary section in the source text.',
  ],
  s0317: [
    'Yao Cha, Minister of Personnel of Chen, said: Earlier histories had chapters on "Orderly Officials"—what was that about?',
    'Yao Cha, Chen Minister of Personnel, said: Earlier histories had chapters on orderly officials—why?',
  ],
  s0318: [
    'The age made it so.',
    'The age made it so.',
  ],
  s0319: [
    'Under Han Wudi corvée labor grew heavy and corruption rose; orderly governance could not contain it, so harsh punishments and executions were wielded to overcome the tide—yet much resentment and excess followed.',
    'Under Han Wudi corvée grew heavy and corruption rose; orderly rule could not cope, so harsh punishments and executions were used—and much resentment and excess followed.',
  ],
  s0320: [
    'When Liang rose, square corners were rounded and ornament pared to plainness; the people were taught filial piety and sibling duty and urged toward farming and sericulture—until fierce and cunning men turned into men like You Yu, and the frivolous became steadfast and honest.',
    'When Liang rose, corners were rounded and ornament stripped to plainness; the people were taught filial piety and urged toward farming and sericulture—fierce and cunning men became like You Yu, the frivolous turned steadfast.',
  ],
  s0321: [
    'Pure custom had spread; the people knew restraint on their own.',
    'Pure custom had spread; the people knew restraint on their own.',
  ],
  s0322: [
    'The people of Yao and Shun—a home behind every door worthy of being sealed with praise—this was indeed credible.',
    'The people of Yao and Shun, a sealed home behind every door—this was indeed true.',
  ],
  s0323: [
    'As for cruel officials—Liang had no need of them.',
    'As for cruel officials—Liang had no need of them.',
  ],
  s0324: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0325: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_053_b4.mjs <translation.json>'
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
