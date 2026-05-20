#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'Fifth month, day wushen: pay silver for rations to banner soldiers of the Three Surnames.',
    'In the fifth month, on wushen day, rations silver was issued to Three Surnames banner troops.',
  ],
  s0802: [
    'On day dingsi, because rebellious Miao at Guzhou and Taigong in Guizhou caused trouble, Ha Yuansheng was appointed Yangwei General to command troops of four provinces in suppression.',
    'On dingsi day, Ha Yuansheng was made Yangwei General to lead four provinces\' forces against Guizhou\'s rebellious Miao.',
  ],
  s0803: [
    'On day jiazi, Prince Guo, the fourth and fifth imperial sons, Grand Secretaries Ortai and Zhang Tingyu, and others were ordered to handle Miao frontier affairs.',
    'On jiazi day, Prince Guo, the fourth and fifth sons, Ortai, Zhang Tingyu, and others were assigned Miao frontier affairs.',
  ],
  s0804: [
    'Minister of Works Batai was dismissed from office.',
    'Minister of Works Batai was stripped of his post.',
  ],
  s0805: [
    'Minister of Justice Zhang Zhao and Vice Censor-in-chief De Xishou were ordered to investigate and inspect Miao frontier affairs.',
    'Zhang Zhao and De Xishou were sent to audit Miao frontier administration.',
  ],
  s0806: [
    'On day dingmao, Ha Yuansheng memorialized on suppressing rebellious Miao; Huangping and Shibing were wholly pacified.',
    'On dingmao day, Ha Yuansheng reported Huangping and Shibing pacified.',
  ],
  s0807: [
    'Sixth month, day yihai: the Ministry of Revenue was ordered to investigate surcharges in all provinces.',
    'In the sixth month, the Ministry of Revenue was ordered to audit provincial surcharges.',
  ],
  s0808: [
    'On day guiwei, Chake\'dan was made Minister of Works.',
    'On guiwei day, Chake\'dan became Minister of Works.',
  ],
  s0809: [
    'On day jiashen, native chiefs who had risen from licentiate student status were permitted to take examinations on equal terms.',
    'On jiashen day, student-born native chiefs were allowed to sit civil examinations like others.',
  ],
  s0810: [
    'On day xinmao, tribute goods presented from all provinces were reduced.',
    'On xinmao day, provincial tribute offerings were cut back.',
  ],
  s0811: [
    'The Luzon state was famine-stricken and asked to buy grain.',
    'Luzon, suffering famine, requested to purchase grain.',
  ],
  s0812: [
    'This was granted.',
    'The request was granted.',
  ],
  s0813: [
    'On day bingshen, Dong Fang was ordered as vice general to assist in suppressing Miao bandits.',
    'On bingshen day, Dong Fang was made vice general to help suppress Miao rebels.',
  ],
  s0814: [
    'Autumn, seventh month, day yimao: Ortai asked to resign his earldom and grand secretaryship.',
    'In the seventh month, Ortai asked to give up his earldom and grand secretary post.',
  ],
  s0815: [
    'This was granted; leave to nurse illness was given while salary continued.',
    'The court agreed; he was granted sick leave but kept his salary.',
  ],
  s0816: [
    'Acting Gansu Provincial Commander Liu Shiming, for failure to detect soldiers\' robbery, was sentenced to decapitation.',
    'Acting Gansu commander Liu Shiming was sentenced to death for not detecting troop robbery.',
  ],
  s0817: [
    'On day bingchen, Zhu Shi was ordered to go inspect Zhejiang seawalls.',
    'On bingchen day, Zhu Shi was sent to survey Zhejiang\'s sea dikes.',
  ],
  s0818: [
    'On day xinyou, Mai Zhu and Cha Lang\'a were made Grand Secretaries; Zhang Guangsi was made governor-general of Huguang.',
    'On xinyou day, Mai Zhu and Cha Lang\'a became Grand Secretaries and Zhang Guangsi Huguang governor-general.',
  ],
  s0819: [
    'Eighth month, day jisi, an edict said: "In former management of the Miao frontier, the aim was altogether to pacify the people\'s lives.',
    'In the eighth month, an edict said Miao administration had been meant to secure the people.',
  ],
  s0820: [
    'Yet poor management caused rebellious Miao to burst forth, colluding with subdued Miao and plundering residents.',
    'Poor management had let rebels ally with pacified Miao and raid the populace.',
  ],
  s0821: [
    'Thus the mind to secure the people became a policy that abused them.',
    'Intent to comfort the people had turned into oppression.',
  ],
  s0822: [
    'Turn back to the original intent—can one not feel shame?',
    'Measured against the original aim, how could one not feel ashamed?',
  ],
  s0823: [
    'All of Guizhou\'s land tax and grain levies for this year are wholly remitted.',
    'Guizhou\'s taxes and grain levies for the year were wholly remitted.',
  ],
  s0824: [
    'For districts ravaged by bandits, three years\' remission, to show intent to pacify, console, and relieve.',
    'Bandit-stricken districts received three years\' relief to show care and consolation.',
  ],
  s0825: [
    '" (closing quotation mark in the source.)',
    'The edict continued."',
  ],
  s0826: [
    'On day dinghai, the Emperor fell ill.',
    'On dinghai day, the Emperor fell ill.',
  ],
  s0827: [
    'On day wuzi, the Emperor grew critically ill; an edict proclaimed succession to the fourth imperial son, Prince of Bao Hongli.',
    'On wuzi day, gravely ill, he proclaimed succession to Prince of Bao Hongli.',
  ],
  s0828: [
    'On day jichou, the Emperor died, aged fifty-eight.',
    'On jichou day, the Emperor died at fifty-eight.',
  ],
  s0829: [
    'That year, eleventh month, day dingwei: the posthumous honorific Jingtian Changyun Jianzhong Biaozheng Wenwu Yingming Kuanren Xinyi Ruisheng Daxiao Zhicheng Xian was respectfully submitted; temple name Shizong.',
    'In the eleventh month, the full posthumous title and temple name Shizong were conferred.',
  ],
  s0830: [
    'Third month of Qianlong 2, interment at Tai Mausoleum.',
    'In the third month of Qianlong 2, he was buried at Tai Mausoleum.',
  ],
  s0831: [
    'The commentators say: The Sagely Ancestor\'s government prized leniency and benevolence; Shizong succeeded with severity and clarity.',
    'The annalists say Kangxi favored leniency while Yongzheng ruled with severity.',
  ],
  s0832: [
    'Commentators compared them to Han Wendi and Jingdi.',
    'Critics likened the pair to Han Wendi and Jingdi.',
  ],
  s0833: [
    'Only in brotherly affection was there suspicion of want of depth.',
    'Only brotherly affection seemed less than wholehearted.',
  ],
  s0834: [
    'Yet the Prince of Huainan\'s violence and arrogance carried fault of his own making—not entirely from Wendi\'s scant kindness.',
    'Yet the Prince of Huainan\'s arrogance invited his fall—not wholly Wendi\'s coldness.',
  ],
  s0835: [
    'The Emperor studied the art of rule and especially worried over lower officials\' exhaustion and distress.',
    'The Emperor studied governance and especially pitied overworked local officials.',
  ],
  s0836: [
    'A close minister said prefectural and district income was great and ought to be trimmed.',
    'A favorite urged cutting back what prefectures and districts collected.',
  ],
  s0837: [
    'He rebuked him, saying: "You have never served as prefect or magistrate—how would you know their hardship?',
    'He snapped: "You have never been a magistrate—how would you know their difficulty?"',
  ],
  s0838: [
    '" What sublime words—these show true grasp of governing essentials!',
    'What words—proof he understood the essentials of rule!',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_009_b09.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  s.literal = pair[0];
  s.idiomatic = pair[1];
  patched++;
}

const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) {
  console.error(`Missing: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
