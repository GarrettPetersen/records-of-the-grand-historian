#!/usr/bin/env node

import fs from 'node:fs';

// Read the chapter
const chapter = JSON.parse(fs.readFileSync('data/shiji/015.json', 'utf8'));

// Translation corrections - mapping ID to correct English translation
const corrections = {
  // First batch of corrections
  's209': 'Seventeenth year: Saved Zheng; the Jin army departed. Zhonghang Wen Zi said to Tian Chang: "Now I know the reason for our defeat."',
  's269': 'Xiang Zi. First year, mourning not yet ended, ascended the Xia Wu building, lured the King of Dai, and killed him with a gold ladle. Enfeoffed Bo Lu Zi Zhou as Lord of Dai Cheng.',
  's338': 'Twenty-eighth year: The Yue people came to welcome the princess.',
  's378': 'Forty-fourth year: Extinguished Qi. Qi was a descendant of Xia.',
  's392': 'Thirty-fourth year: Solar eclipse, daytime darkness. Stars appeared.',
  's504': 'Chu Jian Wang Zhong, first year. Extinguished Ju.',
  's554': 'Fourth year: Shu Zhang Quan killed Huai Gong. The crown prince died early; ministers established the crown prince\'s son as Ling Gong.',
  's563': 'Qin Ling Gong, first year. Gave birth to Xian Gong.',
  's583': 'Third year: Zheng established the younger son of You as Xu Gong, first year.',
  's609': 'Sixth year: Jin Lie Gong\'s first year. Wei built the city of Liang.',
  's677': 'Forty-fourth year: Attacked Lu, Ju, and Anyang.',
  's699': 'Sixteenth year: Attacked Qin, built Lin Jin and Yuan Li.',
  's707': 'Seventh year: Dug trenches in Luo, built the city of Chong Quan. First levied grain tax.',
  's709': 'Han Jing Hou Qian, first year. Attacked Zheng, took Yong Qiu. Zheng built Jing city.',
  's717': 'Eighteenth year: Wen Hou received the classics from Zi Xia. When passing Duan Gan Mu\'s gate, he always bowed from his chariot.',
  's735': 'Twentieth year: Divined for a chancellor; Li Ke and Di Huang contended.',
  's771': 'Twenty-fourth year: Qin attacked us, reaching Yang Hu.',
  's783': 'Second year: The three Jin states came to attack us, reaching Cheng Qiu.',
  's789': 'Twenty-sixth year: Mount Guo collapsed, blocking the Yellow River.',
  's799': 'Second year: Zheng killed their chancellor Si Zi Yang.',
  // Second batch
  's801': 'Fourth year: Defeated the Zheng army, besieged Zheng. The Zheng people killed Zi Yang.',
  's817': 'Fourth year: Zheng chancellor Zi Yang\'s followers killed their lord Xu Gong.',
  's835': 'Sixth year: Saved Lu. Zheng Fu Shu rebelled.',
  's839': 'Eleventh year: Attacked Lu, took Zui.',
  's843': 'Thirty-second year: Attacked Zheng, built the city of Suan Zao.',
  's846': 'Ninth year: Attacked Han, took Fu Shu.',
  's860': 'Ninth year: Attacked Han\'s Yi Yang, took six towns.',
  's862': 'Ninth year: Qin attacked Yi Yang, took six towns.',
  's869': 'Tenth year: Fought with Jin at Wu Cheng. Established the county of Shan.',
  's870': 'Thirty-fifth year: Qi attacked and took Xiang Ling.',
  's875': 'Fifteenth year: Lu defeated us at Ping Lu.',
  's879': 'Thirty-sixth year: Qin invaded Yin Jin.',
  's884': 'Sixteenth year: Met with Jin and Wei at Zhu Ze.',
  's896': 'Thirteenth year: Shu took our Nan Zheng.',
  's911': 'Nineteenth year: Tian Chang\'s great-grandson Tian He began to be ranked as a feudal lord. Moved Kang Gong to the seacoast, giving him one city for sustenance.',
  's915': 'Second year: Built the cities of An Yi and Wang Yuan.',
  's920': 'Twentieth year: Attacked Lu, defeated them. Tian He died.',
  's929': 'Twenty-first year: Tian He\'s son Huan Gong Wu established.',
  's932': 'Second year: Built the city of Que Yang.',
  's960': 'Seventh year: Attacked Qi, reaching Sang Qiu.',
  // Third batch
  's961': 'Seventh year: Attacked Qi, reaching Sang Qiu. Zheng defeated Jin.',
  's962': 'Seventh year: Attacked Qi, reaching Sang Qiu.',
  's965': 'Twenty-fifth year: Attacked Yan, took Sang Qiu.',
  's968': 'Sixth year: First established counties of Pu, Lan Tian, and Shan Ming.',
  's978': 'Ninth year: Di defeated us at Hua. Attacked Qi, reaching Ling Qiu.',
  's979': 'Ninth year: Attacked Qi, reaching Ling Qiu.',
  's980': 'Ninth year: Attacked Qi, reaching Ling Qiu.',
  's983': 'Qi Wei Wang Yin, first year. From Tian Chang to Wei Wang, Wei Wang first made Qi strong in the world.',
  's987': 'Tenth year: Jin Jing Gong Ju Jiu, first year.',
  's990': 'Fourth year: Shu attacked our Zi Fang.',
  's996': 'Eleventh year: Wei, Han, and Zhao extinguished Jin, leaving no descendants.',
  's997': 'Han Ai Hou, first year. Divided the Jin state.',
  's998': 'Eleventh year: Divided the Jin state.',
  's1028': 'Sixth year: Lu attacked and entered Yang Guan. Jin attacked and reached Wei Ling.',
  's1034': 'Third year: Attacked Wei, took seventy-three outer cities. Wei defeated us at Lin.',
  's1041': 'Sixteenth year: Attacked Chu, took Lu Yang.',
  's1044': 'Tenth year: Wei took our Lu Yang.',
  's1052': 'Fifth year: Attacked Qi at Zhen. Wei defeated us at Huai.',
  's1058': 'Sixteenth year: Great epidemic among the people. Solar eclipse.',
  's1060': 'Second year: Wei defeated us at Ma Ling.',
  // Fourth batch
  's1061': 'Sixth year: Defeated Wei at Zhu Ze, besieged Hui Wang.',
  's1064': 'Tenth year: Song Ti Cheng, first year.',
  's1067': 'Seventeenth year: Gold rained in Que Yang, from fourth month to eighth month.',
  's1068': 'Third year: Qi attacked our Guan.',
  's1070': 'Seventh year: Invaded Qi, reaching the Great Wall.',
  's1073': 'Eleventh year: Attacked Wei and took Guan. Zhao invaded our Great Wall.',
  's1085': 'Nineteenth year: Defeated Han and Wei at Luo Yin.',
  's1086': 'Fifth year: Met with Han at Zhai Yang. Built the city of Wu Du.',
  's1095': 'Sixth year: Attacked Song, took Yi Tai.',
  's1102': 'Fifth year: Congratulated Qin.',
  's1103': 'Twenty-first year: Zhang Sang fought with Jin at Shi Men, beheaded 60,000, the Son of Heaven congratulated.',
  's1121': 'Twenty-third year: Fought with Wei at Shao Liang, captured their crown prince.',
  's1123': 'Ninth year: Wei defeated us at Hua. Great rain for three months.',
  's1124': 'Thirteenth year: Wei defeated us at Hua.',
  's1131': 'Tenth year: Took Zhao\'s Pi Lao. Wei Cheng Hou, first year.',
  's1138': 'Ninth year: Sent sacrificial meat to Qin.',
  's1149': 'Twelfth year: Star fell in daytime with sound.',
  's1159': 'Han Zhao Hou, first year. Qin defeated us at Xi Shan.',
  's1163': 'Twenty-first year: Zou Ji appeared before Wei Wang by playing zither.',
  's1168': 'Second year: Song took our Huang Chi. Wei took our Zhu.'
};

// Apply corrections
for (const block of chapter.content) {
  if (block.type === 'paragraph') {
    for (const sentence of block.sentences) {
      if (corrections[sentence.id]) {
        sentence.translations[0] = {
          lang: 'en',
          text: corrections[sentence.id],
          translator: 'Garrett Petersen',
          model: 'grok-1.5'
        };
      }
    }
  } else if (block.type === 'table_header') {
    for (const sentence of block.sentences) {
      if (corrections[sentence.id]) {
        sentence.translations[0] = {
          lang: 'en',
          text: corrections[sentence.id],
          translator: 'Garrett Petersen',
          model: 'grok-1.5'
        };
      }
    }
  } else if (block.type === 'table_row') {
    for (const cell of block.cells) {
      if (corrections[cell.id]) {
        cell.translation = corrections[cell.id];
        cell.translator = 'Garrett Petersen';
        cell.model = 'grok-1.5';
      }
    }
  }
}

// Update metadata
chapter.meta.translators = [{
  name: 'Garrett Petersen',
  sentences: Object.keys(corrections).length
}];
chapter.meta.citation = 'Translation: Garrett Petersen';

// Write back
fs.writeFileSync('data/shiji/015.json', JSON.stringify(chapter, null, 2));
console.log(`Applied ${Object.keys(corrections).length} translation corrections`);
