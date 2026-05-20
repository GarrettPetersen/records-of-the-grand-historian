#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 44, Biography 38',
    'Book of Liang, Volume 44, Biography 38',
  ],
  s0002: [
    'The eleven sons of the Heir Apparent Taizong; the two sons of Emperor Shizu',
    'The eleven sons of Heir Apparent Taizong; the two sons of Emperor Shizu',
  ],
  s0003: [
    'Empress Wang of the Heir Apparent Taizong bore the Lamented Crown Prince Daqi, the Prince of Nan commandery Dalian; Lady Chen the Shure gave birth to the Prince of Xunyang Daxin; the left lady bore the Prince of Nanhai Dalin and the Prince of Anlu Dachun; Lady Xie bore the Duke of Liuyang Daya; Lady Zhang bore the Prince of Xinxing Dazhuang; Bao Zhaohua bore the Prince of Xiyang Dajun; Lady Fan bore the Prince of Wuning Dawei; Chu Xiuhua bore the Prince of Jianping Daqiu; Lady Chen bore the Prince of Yi\'an Daxin; Lady Zhu bore the Prince of Suijian Dazhi.',
    'Empress Wang of Heir Apparent Taizong bore Lamented Crown Prince Daqi and Prince of Nan commandery Dalian; Lady Chen the Shure bore Prince of Xunyang Daxin; the left lady bore Princes Dalin of Nanhai and Dachun of Anlu; Lady Xie bore Duke of Liuyang Daya; Lady Zhang bore Prince of Xinxing Dazhuang; Bao Zhaohua bore Prince of Xiyang Dajun; Lady Fan bore Prince of Wuning Dawei; Chu Xiuhua bore Prince of Jianping Daqiu; Lady Chen bore Prince of Yi\'an Daxin; Lady Zhu bore Prince of Suijian Dazhi.',
  ],
  s0004: [
    'The remaining sons are not recorded in this book.',
    'The remaining sons are not recorded in this book.',
  ],
  s0005: [
    'The Prince of Xunyang, Daxin, courtesy name Renshu.',
    'Prince of Xunyang Daxin, styled Renshu.',
  ],
  s0006: [
    'From youth he was clever and bright and skilled at literary composition.',
    'From youth he was clever and bright and wrote well.',
  ],
  s0007: [
    'In the fourth year of Zhongdatong, as imperial grandson he was enfeoffed Duke of Dangyang with a fief of one thousand five hundred households.',
    'In the fourth year of Zhongdatong he was enfeoffed Duke of Dangyang with a fief of fifteen hundred households.',
  ],
  s0008: [
    'In the first year of Great Unity he went out as bearer of the staff, commander of military affairs in the five prefectures of E, north and south of Si, Ding, and Xin, General of Light Chariots, and inspector of E prefecture.',
    'In the first year of Great Unity he went out as bearer of the staff, commander of the five E-region prefectures, General of Light Chariots, and inspector of E.',
  ],
  s0009: [
    'He was thirteen; the Heir Apparent Taizong, because he was young, feared he had not yet grasped the people\'s hearts and admonished him: "In affairs great or small, entrust all to your staff—do not let a thread of worry touch your mind.',
    'He was thirteen; Taizong, fearing he had not grasped the people\'s hearts, admonished him, "In affairs great or small, entrust all to your staff—do not let a thread of worry touch your mind.',
  ],
  s0010: [
    '" Though Daxin did not personally handle prefectural affairs, whenever he spoke it accorded with reason and all were struck and submitted.',
    '" Though he did not handle prefectural affairs himself, whenever he spoke it accorded with reason and all were struck and submitted.',
  ],
  s0011: [
    'In the seventh year he was summoned as palace attendant and concurrently commander of the Stone City garrison.',
    'In the seventh year he was summoned as palace attendant and concurrently commander of the Stone City garrison.',
  ],
  s0012: [
    'In the first year of Supreme Purity he went out as General of the Cloud Banner and inspector of Jiangzhou.',
    'In the first year of Supreme Purity he went out as General of the Cloud Banner and inspector of Jiangzhou.',
  ],
  s0013: [
    'In the second year Hou Jing raided the capital region.',
    'In the second year Hou Jing raided the capital region.',
  ],
  s0014: [
    'Daxin gathered soldiers; men near and far came to him until his force reached tens of thousands, and with the upriver armies he hurried to relieve the palace.',
    'Daxin gathered soldiers; men near and far joined until his force reached tens of thousands, and with upriver armies he hurried to relieve the palace.',
  ],
  s0015: [
    'In the third year the city fell; Senior Armor Xiao Shao fled south and proclaimed a secret edict adding Daxin as regular palace attendant and promoting his title to General Who Pacifies the South.',
    'In the third year the city fell; Senior Armor Xiao Shao fled south and proclaimed a secret edict making Daxin regular palace attendant and General Who Pacifies the South.',
  ],
  s0016: [
    'In the first year of Great Treasure he was enfeoffed Prince of Xunyang with a fief of two thousand households.',
    'In the first year of Great Treasure he was enfeoffed Prince of Xunyang with a fief of two thousand households.',
  ],
  s0017: [
    'Earlier Liyang magistrate Zhuang Tie had surrendered the city to Hou Jing, then brought his mother to defect; Daxin, because Tie was an old general, treated him with great courtesy and entrusted all military affairs to him, and also made him interior minister of Yuzhang.',
    'Earlier Liyang magistrate Zhuang Tie had surrendered to Hou Jing, then brought his mother to defect; Daxin, because Tie was an old general, treated him generously and entrusted all military affairs to him, and made him interior minister of Yuzhang.',
  ],
  s0018: [
    'Hou Jing repeatedly sent armies west to raid; Daxin always had Tie defeat them and the bandit could not advance.',
    'Hou Jing repeatedly sent armies west to raid; Daxin always had Tie defeat them and the bandit could not advance.',
  ],
  s0019: [
    'At the time the Prince of Poyang Fan led his host abandoning Hefei and encamped at Zhakou, waiting for relief armies to gather before advancing together.',
    'The Prince of Poyang Fan had abandoned Hefei and encamped at Zhakou, waiting for relief armies before advancing together.',
  ],
  s0020: [
    'Daxin heard and summoned Fan west, lodging him at Pencheng with very rich grain supplies, to join strength in removing the calamity.',
    'Daxin summoned Fan west, lodged him at Pencheng with rich grain supplies, to join strength against the calamity.',
  ],
  s0021: [
    'Then Zhuang Tie held Yuzhang in rebellion; Daxin sent the middle army aide Wei Yue and others with troops to attack; Tie was defeated and again begged surrender.',
    'Then Zhuang Tie held Yuzhang in rebellion; Daxin sent middle army aide Wei Yue and others to attack; Tie was defeated and again begged surrender.',
  ],
  s0022: [
    'The Prince of Poyang\'s heir Si had earlier traveled with Tie and therefore praised his talent and stratagem, and that as an old general he should be used in a great affair; if he surrendered to Jiangzhou his head would surely not be spared—Si asked to rescue him.',
    'Poyang\'s heir Si had traveled with Tie and praised his talent, saying that as an old general he should be used in a great affair; if he surrendered to Jiangzhou his head would not be spared—Si asked to rescue him.',
  ],
  s0023: [
    'Fan agreed and sent the general Hou Zhen with five thousand picked armor to save Tie; by night they stormed and broke Wei Yue\'s camp.',
    'Fan agreed and sent general Hou Zhen with five thousand picked armor to save Tie; by night they stormed and broke Wei Yue\'s camp.',
  ],
  s0024: [
    'Daxin heard and was greatly afraid; then the two fiefs raised strife and hearts turned divided.',
    'Daxin heard and was greatly afraid; the two fiefs raised strife and hearts turned divided.',
  ],
  s0025: [
    'Jing\'s general Ren Yue overran the land as far as Pencheng; Daxin sent the marshal Wei Zhi to meet battle and was defeated.',
    'Jing\'s general Ren Yue overran the land to Pencheng; Daxin sent marshal Wei Zhi to meet battle and was defeated.',
  ],
  s0026: [
    'At the time there were still more than a thousand warriors in the tent, who all said: "Without grain stores we cannot hold firm.',
    'There were still more than a thousand warriors in the tent, who all said, "Without grain stores we cannot hold firm.',
  ],
  s0027: [
    'If with light horse we go to Jianzhou to plan a later rising, that is the best stratagem.',
    'If with light horse we go to Jianzhou to plan a later rising, that is the best stratagem.',
  ],
  s0028: [
    '" Daxin had not decided when his mother Lady Chen the Shure said: "Today the sage ruler is advanced in years and the heir ten thousandfold blessed—you have long been absent from his face and do not think to bow at the palace gate; moreover I am old, and you would cross a perilous road with no grain—can this be called filial?',
    '" Daxin had not decided when his mother Lady Chen said, "Today the sage ruler is old and the heir blessed—you have long been absent and do not think to bow at the palace gate; I am old, and you would cross a perilous road with no grain—can this be filial?',
  ],
  s0029: [
    'I will never go.',
    'I will never go.',
  ],
  s0030: [
    'She clutched her breast and wept bitterly; Daxin then stopped.',
    'She clutched her breast and wept bitterly; Daxin then stopped.',
  ],
  s0031: [
    'He then made peace with Yue.',
    'He then made peace with Yue.',
  ],
  s0032: [
    'In the autumn of the second year he was killed; he was twenty-nine.',
    'In the autumn of the second year he was killed at twenty-nine.',
  ],
  s0033: [
    'The Prince of Nanhai, Dalin, courtesy name Renxuan.',
    'Prince of Nanhai Dalin, styled Renxuan.',
  ],
  s0034: [
    'In the second year of Great Unity he was enfeoffed Duke of Ningguo with a fief of one thousand five hundred households.',
    'In the second year of Great Unity he was enfeoffed Duke of Ningguo with fifteen hundred households.',
  ],
  s0035: [
    'From youth he was quick and clever.',
    'From youth he was quick and clever.',
  ],
  s0036: [
    'At eleven he suffered mourning for the left lady; he wept until wasted and was famed for filial piety.',
    'At eleven he mourned the left lady, wept until wasted, and was famed for filial piety.',
  ],
  s0037: [
    'Later he entered the National University, placed first in the classics examination and policy shooting, was made gentleman of the Secretariat, and promoted to gentleman in the Yellow Gate.',
    'Later he entered the National University, placed first in classics and policy, became Secretariat gentleman, and rose to Yellow Gate gentleman.',
  ],
  s0038: [
    'In the eleventh year he was made acting long-term palace attendant.',
    'In the eleventh year he was made acting long-term palace attendant.',
  ],
  s0039: [
    'He went out as General of Light Chariots and magistrate of Langye and Pengcheng commanderies.',
    'He went out as General of Light Chariots and magistrate of Langye and Pengcheng.',
  ],
  s0040: [
    'When Hou Jing rebelled he was made bearer of the staff and General of Proclaimed Grace, encamped at Xinting.',
    'When Hou Jing rebelled he was made bearer of the staff and General of Proclaimed Grace, encamped at Xinting.',
  ],
  s0041: [
    'Soon he was summoned back to garrison the Duan Gate and command military affairs south of the city.',
    'Soon he was summoned back to garrison the Duan Gate and command military affairs south of the city.',
  ],
  s0042: [
    'Men of the day all urged seizing outside goods to supply rewards; Dalin alone said: "Goods are for rewarding warriors—but cattle can feed the army.',
    'Men of the day urged seizing outside goods for rewards; Dalin alone said, "Goods reward warriors—but cattle can feed the army.',
  ],
  s0043: [
    '" He ordered cattle taken and got more than a thousand head; within the city they relied on this to feast the troops.',
    '" He ordered cattle taken and got more than a thousand head; the city relied on this to feast the troops.',
  ],
  s0044: [
    'In the first year of Great Treasure he was enfeoffed Prince of Nanhai commandery with a fief of two thousand households.',
    'In the first year of Great Treasure he was enfeoffed Prince of Nanhai with two thousand households.',
  ],
  s0045: [
    'He went out as bearer of the staff, commander of military affairs in Yang and South Xu prefectures, General Who Pacifies the South, and inspector of Yangzhou.',
    'He went out as bearer of the staff, commander of Yang and South Xu, General Who Pacifies the South, and inspector of Yangzhou.',
  ],
  s0046: [
    'He was also made General Who Pacifies the East and magistrate of Wu commandery.',
    'He was also made General Who Pacifies the East and magistrate of Wu commandery.',
  ],
  s0047: [
    'At the time Zhang Biao raised righteousness in Kuaiji; Wu men Lu Linggong and Yingchuan Yu Mengqing and others urged Dalin to flee to Biao.',
    'Zhang Biao raised righteousness in Kuaiji; Wu men Lu Linggong and Yingchuan Yu Mengqing urged Dalin to flee to Biao.',
  ],
  s0048: [
    'Dalin said: "If Biao succeeds, he will not need my strength;',
    'Dalin said, "If Biao succeeds, he will not need my strength;',
  ],
  s0049: [
    'if he is broken and defeated, they will blame it on my persuasion.',
    'if he is broken and defeated, they will blame my persuasion.',
  ],
  s0050: [
    'I cannot go.',
    'I cannot go.',
  ],
  s0051: [
    'In the autumn of the second year he was killed in the commandery; he was twenty-five.',
    'In the autumn of the second year he was killed in the commandery at twenty-five.',
  ],
  s0052: [
    'The Prince of Nan commandery, Dalian, courtesy name Renjing.',
    'Prince of Nan commandery Dalian, styled Renjing.',
  ],
  s0053: [
    'From youth handsome and bright, skilled at literary composition, his bearing and carriage graceful; he had a subtle gift for design, was masterly in music, and also good at painting.',
    'From youth handsome and bright, he wrote well, bore himself gracefully, had a gift for design, mastered music, and painted well.',
  ],
  s0054: [
    'In the second year of Great Unity he was enfeoffed Duke of Lincheng with a fief of one thousand five hundred households.',
    'In the second year of Great Unity he was enfeoffed Duke of Lincheng with fifteen hundred households.',
  ],
  s0055: [
    'In the seventh year he and the Prince of Nanhai together entered the National University, placed first in policy shooting, and were made gentlemen of the Secretariat.',
    'In the seventh year he and Prince Dalin together entered the National University, placed first in policy, and became Secretariat gentlemen.',
  ],
  s0056: [
    'In the tenth year the Founding Emperor visited Zhufang; Dalian and his elder brother Dalin both followed.',
    'In the tenth year the Founding Emperor visited Zhufang; Dalian and his brother Dalin both followed.',
  ],
  s0057: [
    'The Founding Emperor asked: "Have you practiced riding?',
    'The Founding Emperor asked, "Have you practiced riding?',
  ],
  s0058: [
    '" They answered: "We have not received edict and dare not practice on our own.',
    '" They answered, "We have not received edict and dare not practice on our own.',
  ],
  s0059: [
    '" He ordered each given a horse to try; the Dalian brothers mounted and circled, each showing the rhythm of the gallop; the Founding Emperor was greatly pleased and at once gave them the horses they rode.',
    '" He ordered each given a horse; the brothers mounted and circled, each showing the rhythm of the gallop; the Founding Emperor was greatly pleased and gave them the horses they rode.',
  ],
  s0060: [
    'When they memorialized thanks the wording was also very fine.',
    'When they memorialized thanks the wording was also very fine.',
  ],
  s0061: [
    'Another day the Founding Emperor said to the Heir Apparent Taizong: "Yesterday seeing Dalin and Dalian—their bearing is lovable and enough to comfort me in my old age.',
    'Another day the Founding Emperor said to Taizong, "Yesterday seeing Dalin and Dalian—their bearing is lovable and enough to comfort me in my old age.',
  ],
  s0062: [
    '" He was promoted to gentleman in the Yellow Gate, then palace attendant, soon concurrently commander of the Stone City garrison.',
    '" He rose to Yellow Gate gentleman, then palace attendant, soon concurrently commander of the Stone City garrison.',
  ],
  s0063: [
    'In the first year of Supreme Purity he went out as bearer of the staff, General of Light Chariots, and inspector of East Yangzhou.',
    'In the first year of Supreme Purity he went out as bearer of the staff, General of Light Chariots, and inspector of East Yangzhou.',
  ],
  s0064: [
    'When Hou Jing invaded the capital Dalian led forty thousand men to the rescue.',
    'When Hou Jing invaded the capital Dalian led forty thousand men to the rescue.',
  ],
  s0065: [
    'When the terrace city fell the relief armies scattered and he returned to Yangzhou.',
    'When the terrace city fell the relief armies scattered and he returned to Yangzhou.',
  ],
  s0066: [
    'In the third year bandits of Kuaiji led by Tian Ling gathered tens of thousands in party and attacked; Dalian ordered the middle army aide Zhang Biao to strike and behead them.',
    'In the third year Kuaiji bandits led by Tian Ling gathered tens of thousands and attacked; Dalian ordered middle army aide Zhang Biao to strike and behead them.',
  ],
  s0067: [
    'In the first year of Great Treasure he was enfeoffed Prince of Nan commandery with a fief of two thousand households.',
    'In the first year of Great Treasure he was enfeoffed Prince of Nan commandery with two thousand households.',
  ],
  s0068: [
    'Jing again sent his generals Zhao Bochao and Liu Shenmao to attack; Dalian made preparations to await them.',
    'Jing again sent generals Zhao Bochao and Liu Shenmao to attack; Dalian prepared to await them.',
  ],
  s0069: [
    'Then the general Liu Yi surrendered the city to the bandit; Dalian abandoned the city and fled; reaching Xin\'an he was taken by the bandit.',
    'Then general Liu Yi surrendered the city to the bandit; Dalian abandoned the city and fled; at Xin\'an he was taken.',
  ],
  s0070: [
    'Hou Jing made him General of Light Chariots with acting charge of Yangzhou affairs, then promoted to General Who Pacifies the South and inspector of Jiangzhou.',
    'Hou Jing made him General of Light Chariots with acting charge of Yangzhou, then General Who Pacifies the South and inspector of Jiangzhou.',
  ],
  s0071: [
    'Dalian, pressed in the bandit\'s grip, always thought of escape, and made a pact with the bandit: "In military and civil affairs I take no part.',
    'Pressed in the bandit\'s grip, Dalian always thought of escape and made a pact, "In military and civil affairs I take no part.',
  ],
  s0072: [
    'Wait for my life or death—only listen for the bell.',
    'Wait for my life or death—only listen for the bell.',
  ],
  s0073: [
    '" He wished to meet the bandit with few attendants and thus slip away; the bandit also trusted him.',
    '" He wished to meet the bandit with few attendants and slip away; the bandit also trusted him.',
  ],
  s0074: [
    'The affair did not succeed.',
    'The affair did not succeed.',
  ],
  s0075: [
    'In the autumn of the second year he was killed; he was twenty-five.',
    'In the autumn of the second year he was killed at twenty-five.',
  ],
  s0076: [
    'The Prince of Anlu, Dachun, courtesy name Renjing.',
    'Prince of Anlu Dachun, styled Renjing.',
  ],
  s0077: [
    'From youth he read widely in letters and records.',
    'From youth he read widely in letters and records.',
  ],
  s0078: [
    'By nature filial and careful, his build round and imposing, his belt ten arm-spans around.',
    'By nature filial and careful, his build imposing, his belt ten arm-spans around.',
  ],
  s0079: [
    'In the sixth year of Great Unity he was enfeoffed Duke of Xifeng with a fief of one thousand five hundred households.',
    'In the sixth year of Great Unity he was enfeoffed Duke of Xifeng with fifteen hundred households.',
  ],
  s0080: [
    'He was made gentleman of the Secretariat.',
    'He was made Secretariat gentleman.',
  ],
  s0081: [
    'Later he was General of Peaceful Distance and in charge of Stone City garrison affairs.',
    'Later he was General of Peaceful Distance and in charge of Stone City garrison affairs.',
  ],
  s0082: [
    'When Hou Jing invaded within the passes Dachun fled to Jingkou and followed the Prince of Shaoling to the rescue, fought at Zhongshan, and was taken by the bandit.',
    'When Hou Jing invaded Dachun fled to Jingkou and followed the Prince of Shaoling to the rescue, fought at Zhongshan, and was taken.',
  ],
  s0083: [
    'When the capital fell, in the first year of Great Treasure he was enfeoffed Prince of Anlu commandery with a fief of two thousand households.',
    'When the capital fell, in the first year of Great Treasure he was enfeoffed Prince of Anlu with two thousand households.',
  ],
  s0084: [
    'He went out as bearer of the staff, General of the Cloud Banner, and inspector of East Yangzhou.',
    'He went out as bearer of the staff, General of the Cloud Banner, and inspector of East Yangzhou.',
  ],
  s0085: [
    'In the autumn of the second year he was killed; he was twenty-two.',
    'In the autumn of the second year he was killed at twenty-two.',
  ],
  s0086: [
    'The Duke of Liuyang, Daya, courtesy name Renfeng.',
    'Duke of Liuyang Daya, styled Renfeng.',
  ],
  s0087: [
    'In the ninth year of Great Unity he was enfeoffed Duke of Liuyang with a fief of one thousand five hundred households.',
    'In the ninth year of Great Unity he was enfeoffed Duke of Liuyang with fifteen hundred households.',
  ],
  s0088: [
    'From youth clever and alert, handsome in bearing, he was especially loved by the Founding Emperor.',
    'From youth clever and handsome, he was especially loved by the Founding Emperor.',
  ],
  s0089: [
    'In the third year of Supreme Purity the capital fell; the bandit had already scaled the wall, yet Daya still ordered his attendants to fight at the barrier; the bandit grew numerous and he lowered himself by rope.',
    'In the third year of Supreme Purity the capital fell; the bandit had scaled the wall, yet Daya still ordered his men to fight; the bandit grew numerous and he lowered himself by rope.',
  ],
  s0090: [
    'He then fell ill from indignation and died; he was seventeen.',
    'He then fell ill from indignation and died at seventeen.',
  ],
  s0091: [
    'The Prince of Xinxing, Dazhuang, courtesy name Renli.',
    'Prince of Xinxing Dazhuang, styled Renli.',
  ],
  s0092: [
    'In the ninth year of Great Unity he was enfeoffed Duke of Gaotang with a fief of one thousand five hundred households.',
    'In the ninth year of Great Unity he was enfeoffed Duke of Gaotang with fifteen hundred households.',
  ],
  s0093: [
    'In the first year of Great Treasure he was enfeoffed Prince of Xinxing commandery with a fief of two thousand households.',
    'In the first year of Great Treasure he was enfeoffed Prince of Xinxing with two thousand households.',
  ],
  s0094: [
    'He went out as bearer of the staff, commander of military affairs in South Xuzhou, General of Firm Resolve, and inspector of South Xuzhou.',
    'He went out as bearer of the staff, commander of South Xuzhou, General of Firm Resolve, and inspector of South Xuzhou.',
  ],
  s0095: [
    'In the autumn of the second year he was killed; he was eighteen.',
    'In the autumn of the second year he was killed at eighteen.',
  ],
  s0096: [
    'The Prince of Xiyang, Dajun, courtesy name Renfu.',
    'Prince of Xiyang Dajun, styled Renfu.',
  ],
  s0097: [
    'By nature grave and steady, he did not play rashly.',
    'By nature grave and steady, he did not play rashly.',
  ],
  s0098: [
    'At seven the Founding Emperor once asked what book he was reading; he answered: "Studying the Odes."',
    'At seven the Founding Emperor asked what book he read; he answered, "Studying the Odes."',
  ],
  s0099: [
    'He was then ordered to recite; his tones were clear and elegant, and the Founding Emperor gave him one scroll of Wang Xizhi\'s calligraphy.',
    'Ordered to recite, his tones were clear and elegant, and the Founding Emperor gave him one scroll of Wang Xizhi\'s calligraphy.',
  ],
  s0100: [
    'In the first year of Great Treasure he was enfeoffed Prince of Xiyang commandery with a fief of two thousand households.',
    'In the first year of Great Treasure he was enfeoffed Prince of Xiyang with two thousand households.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_044_b1.mjs <translation.json>'
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
