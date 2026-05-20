#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1101: [
    'On day bingzi, the Emperor returned and halted at Changchun Garden.',
    'On bingzi day, the Emperor returned to Changchun Garden.',
  ],
  s1102: [
    'Third month, day bingxu: Alu was made general at Jingzhou.',
    'In the third month, on bingxu day, Alu became Jingzhou general.',
  ],
  s1103: [
    'Summer, fourth month, day jiazi: envoys were sent to invest Bing, younger brother of the King of Korea Li Yun, as royal younger-brother heir.',
    'In the fourth month, envoys invested Li Yun\'s brother Bing as Korean royal younger-brother heir.',
  ],
  s1104: [
    'On day dingmao, the Emperor made an inspection tour to Rehe.',
    'On dingmao day, the Emperor toured Rehe.',
  ],
  s1105: [
    'On day jisi, Pacification Commissioner-in-chief Yinti again took command of the army.',
    'On jisi day, Pacification Commissioner Yinti resumed army command.',
  ],
  s1106: [
    'On day guiwei, the garrison troops at Fuzhou mutinied; General Huang Bingyue could not restrain them, was stripped of office, and the ringleaders were beheaded.',
    'On guiwei day, Fuzhou garrison troops mutinied; Huang Bingyue was dismissed and the leaders executed.',
  ],
  s1107: [
    'Fifth month, day wuxu: Shi Shilun died; Zhang Dayou was appointed acting director-general of grain transport.',
    'In the fifth month, Shi Shilun died and Zhang Dayou became acting grain transport director-general.',
  ],
  s1108: [
    'Sixth month: because Fengtian had had good harvests several years running, the maritime ban was relaxed.',
    'In the sixth month, Fengtian\'s successive harvests led to relaxation of the maritime ban.',
  ],
  s1109: [
    'Siamese rice was cheap; entry into the interior was permitted and its tax was remitted.',
    'Cheap Siamese rice was allowed inland tax-free.',
  ],
  s1110: [
    'On day xinwei, Zhili was ordered to divert two hundred thousand shi of tribute grain for relief reserves.',
    'On xinwei day, Zhili was told to set aside two hundred thousand shi of tribute grain for relief.',
  ],
  s1111: [
    'On day bingzi, Zhao Hongxie died; his elder brother\'s son, Director Zhao Zhiyuan, was given the additional rank of Vice Censor-in-chief and appointed acting Zhili governor.',
    'On bingzi day, Zhao Hongxie died; his nephew Zhao Zhiyuan became acting Zhili governor with vice censor rank.',
  ],
  s1112: [
    'Autumn, seventh month, day dingyou: Western Expedition general Qilide memorialized on garrison-farming matters at Ulan Gumu.',
    'In the seventh month, Qilide reported on farming garrisons at Ulan Gumu.',
  ],
  s1113: [
    'He asked for increased troops for defense.',
    'He requested more troops for defense.',
  ],
  s1114: [
    'Commander-in-chief Tula was ordered to lead troops there.',
    'Commander-in-chief Tula was sent with troops.',
  ],
  s1115: [
    'On day renyin, Sertu was ordered to proceed to Tibet to take overall command of Sichuan frontier troops.',
    'On renyin day, Sertu was ordered to Tibet to command Sichuan frontier forces.',
  ],
  s1116: [
    'On day wushen, Cai Ting was made governor of Sichuan.',
    'On wushen day, Cai Ting became Sichuan governor.',
  ],
  s1117: [
    'Sacrificial rites and burial honors were granted to the late Zhili governor Zhao Hongxie, posthumous title Su Min.',
    'The late Zhao Hongxie received sacrificial honors and posthumous name Su Min.',
  ],
  s1118: [
    'Eighth month, day bingyin: judicial executions for this year were suspended.',
    'In the eighth month, executions were halted for the year.',
  ],
  s1119: [
    'The wife and children of the late Commander Lan Li had earlier been enrolled in the banner for crimes; now, the Emperor, mindful of his merit at Taiwan, pardoned them to return to their native place and exempted further pursuit.',
    'Lan Li\'s family, once banished to the banners, were pardoned home for his Taiwan merit and freed from further recovery.',
  ],
  s1120: [
    'On day jimao, the Emperor halted at Khantemur Dabahan Ang\'a.',
    'On jimao day, the Emperor camped at Khantemur Dabahan Ang\'a.',
  ],
  s1121: [
    'Coming foreign vassals were granted silver, coins, saddles, and horses; accompanying hunt troops received silver and coins.',
    'Visiting vassals and hunt troops received silver, coins, saddles, and horses.',
  ],
  s1122: [
    'Ninth month, day jiashen: the Emperor halted at Rehe.',
    'In the ninth month, on jiashen day, the Emperor was at Rehe.',
  ],
  s1123: [
    'On day yiyou, the Emperor instructed the Grand Secretaries, saying: "Some say that Our hunting beyond the passes in the north wears out the troops.',
    'On yiyou day, the Emperor told the Grand Secretaries some claimed his northern hunts exhausted the army.',
  ],
  s1124: [
    'They do not know that in long peace one must not forget military preparedness.',
    'He said long peace must not erase readiness for war.',
  ],
  s1125: [
    'When campaigns arise repeatedly, through martial discipline and ministers\' strength success is achieved—all this comes from diligent training."',
    'Repeated campaigns succeeded through discipline and training, he said.',
  ],
  s1126: [
    '" On day jiawu, Nian Gengyao and Gasitu asked to increase the surcharge proportionally to make up deficits in official treasuries.',
    'On jiawu day, Nian Gengyao and Gasitu sought a higher surcharge to cover official deficits.',
  ],
  s1127: [
    'The Emperor said: "The surcharge should only be discussed for reduction—how can it be increased?',
    'The Emperor said surcharges should be reduced, not raised.',
  ],
  s1128: [
    'Most of this deficit arose from military use.',
    'Most deficits came from military needs.',
  ],
  s1129: [
    'When officers and soldiers passed through, there were sometimes gifts of support.',
    'Troops passing through sometimes received local gifts.',
  ],
  s1130: [
    'At first public funds were diverted; over time this became deficit; in former years there was already an edict for remission.',
    'Diverted public funds had become chronic deficits; earlier edicts had already granted relief.',
  ],
  s1131: [
    'Now military needs are urgent; the Ministry treasury will at once be allocated and sent to Xi\'an for ready use.',
    'With military needs urgent, treasury funds would be sent to Xi\'an at once.',
  ],
  s1132: [
    '" On day wuxu, the Emperor returned to the capital.',
    'On wuxu day, the Emperor returned to the capital."',
  ],
  s1133: [
    'On day dingwei, the court halted at Miyun and inspected the river dikes.',
    'On dingwei day, the entourage stopped at Miyun to inspect dikes.',
  ],
  s1134: [
    'On day gengxu, the Emperor returned to Beijing.',
    'On gengxu day, the Emperor returned to Beijing.',
  ],
  s1135: [
    'Winter, tenth month, day xinyou: Prince Yong Yinzhen, Hongsheng, Yanxin, Sun Zhaji, Longkodo, Zhabina, and Wu\'erzhan were ordered to inspect the granaries.',
    'In the tenth month, Yinzhen, Hongsheng, Yanxin, Sun Zhaji, Longkodo, Zhabina, and Wu\'erzhan inspected granaries.',
  ],
  s1136: [
    'On day renxu, Aisin Gioro De\'erjin was made Mongol commander-in-chief, and An Yu general at Hangzhou.',
    'On renxu day, De\'erjin became Mongol commander-in-chief and An Yu Hangzhou general.',
  ],
  s1137: [
    'On day xinwei, Zhabina was made governor-general of Jiangnan and Jiangxi.',
    'On xinwei day, Zhabina became governor-general of Jiangnan and Jiangxi.',
  ],
  s1138: [
    'On day guiyou, the Emperor visited the Southern Park for the hunt.',
    'On guiyou day, the Emperor hunted at the Southern Park.',
  ],
  s1139: [
    'Li Shude was made general at Fuzhou, and Huang Guocai governor of Fujian.',
    'Li Shude became Fuzhou general and Huang Guocai Fujian governor.',
  ],
  s1140: [
    'Eleventh month, day wuzi: the Emperor fell ill and returned to halt at Changchun Garden.',
    'In the eleventh month, the Emperor fell ill and withdrew to Changchun Garden.',
  ],
  s1141: [
    'Imperial Prince Yinyin and State-Founding Duke Wu\'erzhan were made Manchu commanders-in-chief.',
    'Prince Yinyin and Duke Wu\'erzhan became Manchu commanders-in-chief.',
  ],
  s1142: [
    'On day gengyin, the fourth imperial son Yinzhen was ordered to perform the Heaven sacrifice in the Emperor\'s stead.',
    'On gengyin day, the fourth son Yinzhen was ordered to sacrifice to Heaven for the Emperor.',
  ],
  s1143: [
    'On day jiawu, the Emperor grew critically ill; at the hour jiaxu of that day, the Emperor died, aged sixty-nine.',
    'On jiawu day the Emperor fell gravely ill; at the jiaxu hour he died, aged sixty-nine.',
  ],
  s1144: [
    'That same evening he was moved into the inner palace and mourning was proclaimed.',
    'That night his body was moved to the inner palace and mourning began.',
  ],
  s1145: [
    'Second month of the first year of Yongzheng, the posthumous honorific title was respectfully submitted.',
    'In the second month of Yongzheng 1, the posthumous title was conferred.',
  ],
  s1146: [
    'Ninth month, day dingchou: interment at Jing Mausoleum.',
    'In the ninth month, on dingchou day, he was buried at Jing Mausoleum.',
  ],
  s1147: [
    'The commentators say: The Sagely Ancestor was benevolent and filial by nature, with wisdom and courage heaven-bestowed.',
    'The annalists say Kangxi was naturally benevolent, filial, wise, and brave.',
  ],
  s1148: [
    'He early received the great enterprise and was diligent in government and loving toward the people.',
    'He took the throne young, ruled diligently, and loved the people.',
  ],
  s1149: [
    'He ordered the classics and marshaled military affairs; the realm was unified—though called a reign of consolidation, it was in truth like a founding.',
    'He unified the realm through culture and arms—a consolidation reign that was almost a founding.',
  ],
  s1150: [
    'His sagely learning was profound and he honored Confucianism and valued the Way.',
    'His learning was deep; he honored Confucianism and the Way.',
  ],
  s1151: [
    'In spare moments he investigated things and penetrated Heaven and man—a thing unseen in any age before or since.',
    'In leisure he studied nature and united Heaven and humanity as none had before.',
  ],
  s1152: [
    'Over time the Way transformed customs; wind shifted and habits changed; all under Heaven were harmonious and great peace was attained.',
    'Long rule reformed customs until the empire was harmonious and at peace.',
  ],
  s1153: [
    'That prosperous and serene scene makes later ages gaze back with longing even to this day without ceasing.',
    'Later ages still long for that prosperous, peaceful age.',
  ],
  s1154: [
    'The Classic says: "As a ruler, one stops at benevolence.',
    'The Classic says a ruler rests in benevolence.',
  ],
  s1155: [
    '" It also says: "When the Way flourishes and virtue reaches utmost goodness, the people cannot forget."',
    'It also says flourishing virtue makes the people never forget."',
  ],
  s1156: [
    '" Alas, how grand!',
    'Alas, how magnificent!"',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_008_b12.mjs <translation.json>'
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
