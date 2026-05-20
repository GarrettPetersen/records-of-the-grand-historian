#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'When the city opened, Pi then surrendered.',
    'When the city opened, Pi surrendered.',
  ],
  s0302: [
    'He beheaded Fengbo and Wansheng.',
    'He executed Fengbo and Wansheng.',
  ],
  s0303: [
    'Gaozu assessed merit for pacifying Shu, restored Yuanqi\'s title General Who Pacifies the West, added eight hundred households to his fief, and with the previous grant made two thousand in all.',
    'Gaozu weighed merit for pacifying Shu, restored Yuanqi as General Who Pacifies the West, added eight hundred households to his fief, and with the earlier grant brought the total to two thousand.',
  ],
  s0304: [
    'Yuanqi appointed his fellow townsman Yu Qianlou as Recording Secretary aide, and also obtained Jingzhou Inspector Xiao Yaoxin\'s former retainer Jiang Guangji; he treated both generously and entrusted them with provincial affairs.',
    'Yuanqi made his townsman Yu Qianlou recording secretary aide and took on Xiao Yaoxin\'s former guest Jiang Guangji; both were richly favored and given charge of the province.',
  ],
  s0305: [
    'Qianlou was very upright and clean; Guangji was full of stratagems; both urged good government.',
    'Qianlou was scrupulously honest, Guangji resourceful in counsel, and both pressed for sound rule.',
  ],
  s0306: [
    'When Yuanqi overcame Jilian, he took none of the city\'s treasures for himself, diligently cared for the people\'s affairs, and never spoke of wealth or women.',
    'When Yuanqi defeated Jilian he kept none of the city\'s wealth, worked hard for the people, and never spoke of money or women.',
  ],
  s0307: [
    'By nature he could drink well—to a hu without losing control—and now he gave it up entirely.',
    'He could naturally drink a hu without disorder, but from then on he abstained completely.',
  ],
  s0308: [
    'Shu lands unanimously praised him.',
    'All Shu united in praise of him.',
  ],
  s0309: [
    'Yuanqi\'s nephew-by-marriage Liang Jinsun was frivolous by nature and differed from Qianlou in aim and conduct; he therefore said to Yuanqi: "Within the city they speak of three provincial inspectors—how can Your Lordship bear it!',
    'Yuanqi\'s nephew Liang Jinsun was flighty and at odds with Qianlou in character; he told Yuanqi, "The city calls this place ruled by three inspectors—how can you endure it!',
  ],
  s0310: [
    '」 From this Yuanqi grew distant toward Qianlou and Guangji, and his record in office slightly declined.',
    'From that Yuanqi distanced Qianlou and Guangji, and his governance slackened.',
  ],
  s0311: [
    'After two years in the province, because his mother was old he begged leave to return and support her; an edict granted it.',
    'After two years in the province his mother\'s age moved him to ask to go home and care for her; the court assented.',
  ],
  s0312: [
    'He was summoned to be Right Guard General, and Marquis of Xichang Xiao Yuanzao replaced him.',
    'He was recalled as Right Guard General, and Marquis of Xichang Xiao Yuanzao took his place.',
  ],
  s0313: [
    'At this time Liangzhou Chief Clerk Xiahou Daqian rebelled at Nanzheng and brought in Wei troops; White Horse Garrison Commander Yin Tianbao sent riders posthaste to report to Shu; Wei generals Wang Jingyin and Kong Ling raided Eastern and Western Jinshou, all sending urgent appeals; the multitude urged Yuanqi to rush to their relief.',
    'Then Liangzhou chief clerk Xiahou Daqian turned Nanzheng over to Wei; Yin Tianbao of White Horse Garrison galloped word to Shu; Wang Jingyin and Kong Ling of Wei attacked the two Jinshou posts and all cried for help; many pressed Yuanqi to march at once.',
  ],
  s0314: [
    'Yuanqi said: "The court is ten thousand li away; troops cannot arrive at once. If bandits spread their harm, then it will be time to strike them down—the duty to oversee and suppress, whose if not mine?',
    'Yuanqi said, "The court is ten thousand li off; armies cannot come overnight. If the enemy spreads, then we must beat them back—the task of command, who but me?',
  ],
  s0315: [
    'Why rush off at once to rescue them?',
    'Why hurry to rescue them now?',
  ],
  s0316: [
    '」 Qianlou and the others earnestly remonstrated, but he would not listen to any.',
    'Qianlou and the rest pleaded hard, but he would hear none of it.',
  ],
  s0317: [
    'Gaozu also lent Yuanqi credentials, making him regional commander of punitive campaign military affairs, to rescue Hanzhong.',
    'Gaozu also gave Yuanqi the staff and made him commander of the punitive forces to relieve Hanzhong.',
  ],
  s0318: [
    'By the time he arrived, Wei had already taken both Jinshou posts.',
    'When he arrived, Wei had already overrun both Jinshou.',
  ],
  s0319: [
    'Yuanzao was about to arrive.',
    'Yuanzao was nearing.',
  ],
  s0320: [
    'Yuanqi went to some lengths preparing his return baggage; grain stores, equipment, and weapons—almost nothing was left behind.',
    'Yuanqi busied himself packing for the return; grain, stores, and arms—hardly anything remained.',
  ],
  s0321: [
    'Yuanzao entered the city and deeply resented him; he thereupon memorialized that Yuanqi had delayed and showed no concern for military affairs.',
    'Yuanzao entered the city full of grievance and memorialized that Yuanqi had lingered and neglected the army.',
  ],
  s0322: [
    'He was taken into the provincial prison; in prison he hanged himself, aged forty-eight.',
    'He was committed to the provincial jail and hanged himself there, aged forty-eight.',
  ],
  s0323: [
    'The authorities pursued impeachment and stripped his noble land; an edict reduced his fief by half, then re-enfeoffed him as Marquis of Songzi district with a fief of one thousand households.',
    'The offices pursued charges and stripped his fief; an edict halved his estate, then made him Marquis of Songzi with a thousand households.',
  ],
  s0324: [
    'Earlier, when Yuanqi was in Jing province, the Prince of Sui as inspector had Yuanqi appointed as aide, but Registrar Yu Bi firmly refused and would not allow it—Yuanqi resented this.',
    'Earlier in Jingzhou the Prince of Sui had posted Yuanqi as aide, but registrar Yu Bi stood firm against it, and Yuanqi bore a grudge.',
  ],
  s0325: [
    'When the great army had reached the capital, Bi was inside the city and greatly feared.',
    'When the main force reached the capital, Bi was within the walls and terrified.',
  ],
  s0326: [
    'When the city was pacified, Yuanqi first sent men to welcome Bi, telling others: "If Registrar Yu Bi were killed by disorderly troops, I could not clear myself."',
    'When the city fell, Yuanqi sent first to receive Bi and told people, "If Registrar Yu Bi were killed in the turmoil, I could never prove my innocence."',
  ],
  s0327: [
    '」 He therefore sent him away with generous gifts.',
    'He then sent Bi off with rich gifts.',
  ],
  s0328: [
    'In youth he once went to his Xiju farmstead; a monk came to beg of him; Yuanqi asked the farmer: "How much rice do you have?',
    'As a young man he once visited his farm at Xiju; a monk came begging; Yuanqi asked the farmer, "How much rice is there?',
  ],
  s0329: [
    '」 The reply came: "Twenty hu."',
    'The answer was, "Twenty hu."',
  ],
  s0330: [
    '」 Yuanqi gave it all away.',
    'Yuanqi gave the whole amount away.',
  ],
  s0331: [
    'People of the time praised his great magnanimity.',
    'Men of the day praised his largeness of spirit.',
  ],
  s0332: [
    'When Yuanqi first went to Yizhou, he crossed through Jiangling to fetch his mother; his mother practiced the Way and was then living in a lodge, and would not come out.',
    'When Yuanqi first took Yizhou he passed Jiangling to bring his mother; she followed the Way and was in a lodge, and refused to leave it.',
  ],
  s0333: [
    'Yuanqi bowed and begged her to go together.',
    'Yuanqi bowed and pleaded that she come with him.',
  ],
  s0334: [
    'His mother said: "A poor family\'s son who suddenly gains wealth—how can it long be kept? I would rather die than enter ruin with you.',
    'His mother said, "A poor boy who suddenly grows rich cannot keep it long; I would rather die than share your downfall.',
  ],
  s0335: [
    '」 When Yuanqi reached Badong and heard of turmoil in Shu, he had Jiang Guangji cast the divination sticks; they produced the hexagram Jian; he sighed and said: "Am I a Deng Ai, that I should come to this?',
    'At Badong he heard Shu was in revolt and had Jiang Guangji divine; the hexagram was Jian; he sighed, "Am I Deng Ai, to meet such an end?',
  ],
  s0336: [
    '」 In the end it turned out just as the divination had indicated.',
    'In the end all came to pass as the divination foretold.',
  ],
  s0337: [
    'His son Keng succeeded.',
    'His son Keng inherited.',
  ],
  s0338: [
    'Chen Minister of Personnel Yao Cha said: At the end of Yongyuan, Jing province had still no sign of trouble; Xiao Yingchen mustered all Chu\'s troops and was first to answer the righteous rising.',
    'Chen Minister of Personnel Yao Cha said: In late Yongyuan Jingzhou had not yet stirred; Xiao Yingchen gathered all Chu\'s forces and led the response to the righteous cause.',
  ],
  s0339: [
    'Was it Heaven\'s opening, or men\'s stirring counsel?',
    'Was it Heaven\'s prompting, or human design?',
  ],
  s0340: [
    'If not, how could their swift rallying be so decisive?',
    'Otherwise how could men have rallied so swiftly and so surely?',
  ],
  s0341: [
    'Yingda and his uncle and nephew—blessings flowed to later generations; Xiahou, Yang, and Deng all enjoyed lofty fame—magnificent!',
    'Yingda and his kin reaped fortune for their heirs; Xiahou, Yang, and Deng all won great renown—splendid!',
  ],
  s0342: [
    'Xiang\'s care and solidity, Yang and Cai\'s integrity—gentlemen may take them as models.',
    'Xiang\'s prudence and weight, Yang and Cai\'s clean conduct—men of worth may esteem them.',
  ],
  s0343: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0344: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_010_b4.mjs <translation.json>'
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
