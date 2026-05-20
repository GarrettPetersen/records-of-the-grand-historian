#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'In the eighth month, day gengyin, Xuzhou Inspector Cheng Jingjuan captured Wei\'s Tong city.',
    'On gengyin day in the eighth month, Xuzhou inspector Cheng Jingjuan took Wei\'s Tong city.',
  ],
  s0102: [
    'In the ninth month, day wushen, he again captured Suiling city.',
    'On wushen day in the ninth month, he captured Suiling city as well.',
  ],
  s0103: [
    'On wuwu, North Yanzhou Inspector Zhao Jingyue besieged Jingshan.',
    'On wuwu day, North Yanzhou inspector Zhao Jingyue laid siege to Jingshan.',
  ],
  s0104: [
    'On renxu, General Who Displays Boldness Pei Sui raided Shouyang, entered the outer wall, but did not capture it.',
    'On renxu day, General Who Displays Boldness Pei Sui struck Shouyang, broke into the outer wall, and failed to take the city.',
  ],
  s0105: [
    'In the tenth month of winter, day wuyin, Pei Sui and Yuan Shu attacked Wei\'s Jianling city and broke it.',
    'On wuyin day in the tenth month of winter, Pei Sui and Yuan Shu stormed Wei\'s Jianling city and broke it.',
  ],
  s0106: [
    'On xinsi, they again broke Qumu.',
    'On xinsi day they broke Qumu as well.',
  ],
  s0107: [
    'General Who Sweeps Barbarians Peng Baosun captured Langye.',
    'General Who Sweeps Barbarians Peng Baosun took Langye.',
  ],
  s0108: [
    'On jiashen, he again captured Tanqiu city.',
    'On jiashen day he captured Tanqiu city as well.',
  ],
  s0109: [
    'On xinmao, Pei Sui broke Dicheng.',
    'On xinmao day Pei Sui broke Dicheng.',
  ],
  s0110: [
    'On bingshen, he again captured Picheng, then advanced and encamped at Lijiang.',
    'On bingshen day he took Picheng as well, then pushed forward and encamped at Lijiang.',
  ],
  s0111: [
    'On renyin, Wei\'s Donghai Administrator Wei Jingxin surrendered Siwu city.',
    'On renyin day, Wei\'s Donghai administrator Wei Jingxin surrendered Siwu city.',
  ],
  s0112: [
    'General Who Establishes the Distance and Administrator Cao Shizong broke Wei\'s Quyang city.',
    'General Who Establishes the Distance Cao Shizong broke Wei\'s Quyang city.',
  ],
  s0113: [
    'On jiachen, he again captured Qinxu.',
    'On jiachen day he captured Qinxu as well.',
  ],
  s0114: [
    'The defenders of Wei\'s Mei and Panxi all abandoned their cities and fled.',
    'The garrisons at Wei\'s Mei and Panxi all abandoned their cities and fled.',
  ],
  s0115: [
    'In the eleventh month, day bingchen, Peng Baosun captured Dongguan city.',
    'On bingchen day in the eleventh month, Peng Baosun took Dongguan city.',
  ],
  s0116: [
    'On renxu, Pei Sui attacked An city of Shouyang and captured it.',
    'On renxu day Pei Sui assaulted An city at Shouyang and took it.',
  ],
  s0117: [
    'On bingyin, Wei\'s Matou and Ancheng both came to surrender.',
    'On bingyin day Wei\'s Matou and Ancheng both surrendered.',
  ],
  s0118: [
    'In the twelfth month, day wuyin, Wei\'s Jingshan city surrendered.',
    'On wuyin day in the twelfth month, Wei\'s Jingshan city surrendered.',
  ],
  s0119: [
    'On yisi, General of Martial Valor Li Guoxing attacked Pingjing Pass and captured it.',
    'On yisi day General of Martial Valor Li Guoxing attacked Pingjing Pass and took it.',
  ],
  s0120: [
    'On xinchou, Xinwei Chief Clerk Yang Faqian attacked Wuyang Pass;',
    'On xinchou day Xinwei chief clerk Yang Faqian attacked Wuyang Pass;',
  ],
  s0121: [
    'On renyin, he attacked Xian Pass: both were captured.',
    'on renyin day he attacked Xian Pass as well, and both passes fell.',
  ],
  s0122: [
    'In the first month of spring of the sixth year, day bingwu, General Who Pacifies the North Prince Gang of Jin\'an sent Chief Clerk Liu Jin to break Wei\'s South Xiang commandery, and Major Dong Dangmen to break Wei\'s Jincheng.',
    'On bingwu day in the first month of spring, year 6, General Who Pacifies the North Prince Gang of Jin\'an sent chief clerk Liu Jin to break Wei\'s South Xiang commandery and major Dong Dangmen to break Wei\'s Jincheng.',
  ],
  s0123: [
    'On gengxu, he again broke Maquan and Diaoyang, two cities.',
    'On gengxu day he broke Maquan and Diaoyang as well.',
  ],
  s0124: [
    'On xinhai, the imperial carriage personally sacrificed at the Southern Suburbs, and a general amnesty was granted for the empire.',
    'On xinhai day the emperor sacrificed at the Southern Suburbs in person and proclaimed a general amnesty.',
  ],
  s0125: [
    'On gengshen, Wei\'s General Who Guards the East and Xuzhou Inspector Yuan Faseng brought Pengcheng over to the court.',
    'On gengshen day Wei\'s General Who Guards the East and Xuzhou inspector Yuan Faseng surrendered Pengcheng to the court.',
  ],
  s0126: [
    'On jisi, Yongzhou\'s vanguard broke Wei\'s Xincai commandery.',
    'On jisi day Yongzhou\'s vanguard broke Wei\'s Xincai commandery.',
  ],
  s0127: [
    'An edict said: "The plan in the temple is settled, and the royal strategy is now to be raised.',
    'An edict said, "The plan in the temple is fixed and the royal strategy is about to unfold.',
  ],
  s0128: [
    'Palace Attendant and General Who Leads the Army Marquis Yuanzao of Xichang may at once take command in person, advancing as before;',
    'Palace attendant and General Who Leads the Army Marquis Yuanzao of Xichang is to take the field in person at once and advance as before;',
  ],
  s0129: [
    'General Who Guards the North, South Yanzhou Inspector Prince Zong of Yuzhang shall marshal the bold heroes, racing forward like the wind;',
    'General Who Guards the North and South Yanzhou inspector Prince Zong of Yuzhang shall marshal the bold heroes and race forward like the wind;',
  ],
  s0130: [
    'The remaining armies shall be dispatched on fixed days, first, middle, and rear columns all kept in strict readiness.',
    'the remaining armies are to be sent out on fixed days, with first, middle, and rear columns kept in strict readiness.',
  ],
  s0131: [
    'I myself shall move the Six Armies like gathering clouds, and dragon boats shall cross the river."',
    'I myself shall move the Six Armies like gathering clouds, and dragon boats shall cross the river."',
  ],
  s0132: [
    'On guiyou, Wei\'s Zheng city was captured.',
    'On guiyou day Wei\'s Zheng city was taken.',
  ],
  s0133: [
    'On jiaxu, Wei\'s General Who Guards the East and Xuzhou Inspector Yuan Faseng was made Minister of Works.',
    'On jiaxu day Wei\'s General Who Guards the East and Xuzhou inspector Yuan Faseng was made Minister of Works.',
  ],
  s0134: [
    'In the second month, day dingchou, the Old Man star appeared.',
    'On dingchou day in the second month the Old Man star appeared.',
  ],
  s0135: [
    'On gengchen, South Xuzhou Inspector Prince Xu of Luling returned to court and received the military plan.',
    'On gengchen day South Xuzhou inspector Prince Xu of Luling returned to court to receive the military plan.',
  ],
  s0136: [
    'On yiwei, Zhao Jingyue took Wei\'s Longgang city.',
    'On yiwei day Zhao Jingyue took Wei\'s Longgang city.',
  ],
  s0137: [
    'In the third month, day bingwu, Jupiter appeared in the Southern Dipper.',
    'On bingwu day in the third month Jupiter appeared in the Southern Dipper.',
  ],
  s0138: [
    'Newly submitted chiefs of the people were granted tax exemption; all crimes and faults were not to be questioned.',
    'Chiefs among the newly submitted people were granted tax exemption, and all past crimes and faults were forgiven.',
  ],
  s0139: [
    'On jiyou, the emperor traveled to Baixia city and inspected the encampments of the Six Armies.',
    'On jiyou day the emperor went to Baixia city and inspected the encampments of the Six Armies.',
  ],
  s0140: [
    'On yichou, General Who Guards the North, South Yanzhou Inspector Prince Zong of Yuzhang was temporarily stationed at Pengcheng, commanding all armies and concurrently administering Xuzhou affairs.',
    'On yichou day General Who Guards the North and South Yanzhou inspector Prince Zong of Yuzhang was posted at Pengcheng to command all armies and concurrently administer Xuzhou affairs.',
  ],
  s0141: [
    'On jisi, Wei\'s Acting General Who Pacifies the East Yuan Jinglong was made Hengzhou Inspector, and Wei\'s General Who Conquers Barbarians Yuan Jingzhong was made Guangzhou Inspector.',
    'On jisi day Wei\'s acting General Who Pacifies the East Yuan Jinglong was made Hengzhou inspector, and Wei\'s General Who Conquers Barbarians Yuan Jingzhong was made Guangzhou inspector.',
  ],
  s0142: [
    'In the fifth month of summer, day jiyou, the Suyu dam was built, and the Cao Gong dam was repaired in Jiyin.',
    'On jiyou day in the fifth month of summer the Suyu dam was built and the Cao Gong dam repaired in Jiyin.',
  ],
  s0143: [
    'Venus appeared in daylight.',
    'Venus was seen in daylight.',
  ],
  s0144: [
    'On renzi, Central Army Protector Xiahou Dan was dispatched to oversee military affairs at Shouyang and campaign north.',
    'On renzi day Central Army Protector Xiahou Dan was sent to command the armies at Shouyang and march north.',
  ],
  s0145: [
    'In the sixth month, day gengchen, Prince Zong of Yuzhang fled to Wei, and Wei again held Pengcheng.',
    'On gengchen day in the sixth month Prince Zong of Yuzhang fled to Wei, and Wei reoccupied Pengcheng.',
  ],
  s0146: [
    'In the seventh month of autumn, day renxu, a general amnesty was granted for the empire.',
    'On renxu day in the seventh month of autumn a general amnesty was proclaimed.',
  ],
  s0147: [
    'In the eighth month, day bingzi, Cavalier Attendant-in-Ordinary Cao Zongzong was made Concurrent Director of Palace Attendants.',
    'On bingzi day in the eighth month Cavalier Attendant-in-Ordinary Cao Zongzong was made concurrent Director of Palace Attendants.',
  ],
  s0148: [
    'On renwu, the Old Man star appeared.',
    'On renwu day the Old Man star appeared.',
  ],
  s0149: [
    'In the twelfth month, day wuzi, Prince Lun of Shaoling was guilty of crime, removed from office, and stripped of title and fief.',
    'On wuzi day in the twelfth month Prince Lun of Shaoling was found guilty, removed from office, and stripped of title and fief.',
  ],
  s0150: [
    'On renchen, the capital shook with an earthquake.',
    'On renchen day the capital was shaken by an earthquake.',
  ],
  s0151: [
    'On the first day of the first month of spring of the seventh year, day xinchou, those guilty below capital punishment were pardoned.',
    'On the new year, xinchou day in the first month of spring, year 7, all below capital punishment were pardoned.',
  ],
  s0152: [
    'On dingmao, Huaguo sent envoys bearing tribute.',
    'On dingmao day Huaguo sent envoys with tribute.',
  ],
  s0153: [
    'In the second month, day jiaxu, the northern campaign armies stood down from alert.',
    'On jiaxu day in the second month the northern campaign armies stood down from alert.',
  ],
  s0154: [
    'Henan sent envoys bearing tribute.',
    'Henan sent envoys with tribute.',
  ],
  s0155: [
    'On dinghai, the Old Man star appeared.',
    'On dinghai day the Old Man star appeared.',
  ],
  s0156: [
    'In the third month, day yimao, Goguryeo sent envoys bearing tribute.',
    'On yimao day in the third month Goguryeo sent envoys with tribute.',
  ],
  s0157: [
    'In the fourth month of summer, day yiyou, Grand Preceptor Prince Hong of Linchuan died.',
    'On yiyou day in the fourth month of summer Grand Preceptor Prince Hong of Linchuan died.',
  ],
  s0158: [
    'Crossing officers were established at southern river fords, with increased stipends.',
    'Crossing officers were established at southern river fords, and their stipends were increased.',
  ],
  s0159: [
    'An edict ordered all ministers in office, each to recommend those they knew; all upright officials were to be recommended and reported; each province was to nominate two men yearly, each large commandery one.',
    'An edict ordered every minister in office to recommend those he knew; all upright officials were to be brought forward, with two nominations per province each year and one per large commandery.',
  ],
  s0160: [
    'In the sixth month, day jimao, Linyi sent envoys bearing tribute.',
    'On jimao day in the sixth month Linyi sent envoys with tribute.',
  ],
  s0161: [
    'In the ninth month of autumn, day jiyou, General of Agile Cavalry, Grand General with Staff Equal to the Three Dignities, and Jingzhou Inspector Prince Hui of Poyang died.',
    'On jiyou day in the ninth month of autumn General of Agile Cavalry, Grand General with Staff Equal to the Three Dignities, and Jingzhou inspector Prince Hui of Poyang died.',
  ],
  s0162: [
    'In the tenth month of winter, day xinwei, Danyang Prefect Prince Yi of Xiangdong was made Jingzhou Inspector.',
    'On xinwei day in the tenth month of winter Danyang prefect Prince Yi of Xiangdong was made Jingzhou inspector.',
  ],
  s0163: [
    'In the third month, day xinwei, the imperial carriage went to Tongtai Temple and offered the body in renunciation.',
    'On xinwei day in the third month the emperor went to Tongtai Temple and offered his body in renunciation.',
  ],
  s0164: [
    'On jiaxu, he returned to the palace, granted a general amnesty, and changed the reign era.',
    'On jiaxu day he returned to the palace, proclaimed a general amnesty, and changed the reign era.',
  ],
  s0165: [
    'Left Guard General Xiao Yuanzao was made Central Army Protector.',
    'Left Guard General Xiao Yuanzao was made Central Army Protector.',
  ],
  s0166: [
    'Linyi and Shizi each sent envoys bearing tribute.',
    'Linyi and Shizi each sent envoys with tribute.',
  ],
  s0167: [
    'In the fifth month of summer, day bingyin, Cheng Jingjuan captured Wei\'s Lintong and Zhuyi.',
    'On bingyin day in the fifth month of summer Cheng Jingjuan took Wei\'s Lintong and Zhuyi.',
  ],
  s0168: [
    'In the eighth month of autumn, day renchen, the Old Man star appeared.',
    'On renchen day in the eighth month of autumn the Old Man star appeared.',
  ],
  s0169: [
    'In the tenth month of winter, day gengxu, Wei\'s East Yuzhou Inspector Yuan Qinghe brought Guoyang over to the court.',
    'On gengxu day in the tenth month of winter Wei\'s East Yuzhou inspector Yuan Qinghe surrendered Guoyang to the court.',
  ],
  s0170: [
    'On jiayin, a partial amnesty was granted for East Yuzhou.',
    'On jiayin day a partial amnesty was granted for East Yuzhou.',
  ],
  s0171: [
    'In the eleventh month, day dingmao, Central Army Protector Xiao Yuanzao was made Northern Campaign Commander and General Who Conquers the North, stationed at Guoyang.',
    'On dingmao day in the eleventh month Central Army Protector Xiao Yuanzao was made Northern Campaign Commander and General Who Conquers the North and stationed at Guoyang.',
  ],
  s0172: [
    'On wuchen, Director of the Masters of Writing, Central Guard General, and Grand General with Staff Equal to the Three Dignities Yuan Ang was additionally made Director of the Palace Library.',
    'On wuchen day Director of the Masters of Writing, Central Guard General, and Grand General with Staff Equal to the Three Dignities Yuan Ang was additionally made Director of the Palace Library.',
  ],
  s0173: [
    'West Xuzhou was established at Guoyang.',
    'West Xuzhou was established at Guoyang.',
  ],
  s0174: [
    'Goguryeo sent envoys bearing tribute.',
    'Goguryeo sent envoys with tribute.',
  ],
  s0175: [
    'In the first month of spring of the second year, day gengshen, Minister of Works Yuan Faseng, in his existing office, additionally led the Central Army.',
    'On gengshen day in the first month of spring, year 2, Minister of Works Yuan Faseng, retaining his existing office, additionally led the Central Army.',
  ],
  s0176: [
    'Director of the Palace Library, Director of the Masters of Writing, Central Guard General, and Grand General with Staff Equal to the Three Dignities Yuan Ang was promoted to General Who Pacifies the Center.',
    'Director of the Palace Library, Director of the Masters of Writing, Central Guard General, and Grand General with Staff Equal to the Three Dignities Yuan Ang was promoted to General Who Pacifies the Center.',
  ],
  s0177: [
    'Minister of the Court of the Palace Guard Xiao Ang was made General Who Leads the Army.',
    'Minister of the Court of the Palace Guard Xiao Ang was made General Who Leads the Army.',
  ],
  s0178: [
    'On yiyou, Ruru sent envoys bearing tribute.',
    'On yiyou day Ruru sent envoys with tribute.',
  ],
  s0179: [
    'In the second month, day jiawu, the Old Man star appeared.',
    'On jiawu day in the second month the Old Man star appeared.',
  ],
  s0180: [
    'That month, the Hanshan dam was built.',
    'That month the Hanshan dam was built.',
  ],
  s0181: [
    'In the third month, day renxu, Jiangzhou Inspector Prince Ji of Nankang was made General Who Pacifies the Right.',
    'On renxu day in the third month Jiangzhou inspector Prince Ji of Nankang was made General Who Pacifies the Right.',
  ],
  s0182: [
    'In the fourth month of summer, day xinchou, Wei\'s Yingzhou Inspector Yuan Yuanda brought Yiyang over to the court, and North Si province was established.',
    'On xinchou day in the fourth month of summer Wei\'s Yingzhou inspector Yuan Yuanda surrendered Yiyang to the court, and North Si province was established.',
  ],
  s0183: [
    'At that time Wei was in great disorder; its Prince Hao of Beihai, Prince Yu of Linhuai, and Prince Yue of Runan all came fleeing;',
    'At that time Wei was in great disorder; Prince Hao of Beihai, Prince Yu of Linhuai, and Prince Yue of Runan all fled to the court;',
  ],
  s0184: [
    'Its North Qingzhou Inspector Yuan Shijun and South Jingzhou Inspector Li Zhi also surrendered their territories.',
    'and North Qingzhou inspector Yuan Shijun and South Jingzhou inspector Li Zhi also surrendered their territories.',
  ],
  s0185: [
    'In the sixth month, day dinghai, Wei\'s Prince Yu of Linhuai asked to return to his native state, and permission was granted.',
    'On dinghai day in the sixth month Wei\'s Prince Yu of Linhuai asked to return home, and permission was granted.',
  ],
  s0186: [
    'In the tenth month of winter, day dinghai, Wei\'s Prince Hao of Beihai was made ruler of Wei, and Eastern Palace Direct Attendant General Chen Qingzhi was dispatched to guard and escort him back north.',
    'On dinghai day in the tenth month of winter Wei\'s Prince Hao of Beihai was made ruler of Wei, and Eastern Palace Direct Attendant General Chen Qingzhi was sent to guard and escort him back north.',
  ],
  s0187: [
    'Wei\'s Yuzhou Inspector Deng Xian brought his territory over to the court.',
    'Wei\'s Yuzhou inspector Deng Xian surrendered his territory to the court.',
  ],
  s0188: [
    'In the first month of Zhongda Tong year 1, day xinyou, the imperial carriage personally sacrificed at the Southern Suburbs, a general amnesty was granted for the empire, and filial sons and diligent farmers were granted one rank of nobility.',
    'On xinyou day in the first month of Zhongda Tong 1 the emperor sacrificed at the Southern Suburbs in person, proclaimed a general amnesty, and granted one rank of nobility to filial sons and diligent farmers.',
  ],
  s0189: [
    'On jiazi, Wei\'s Prince Yue of Runan asked to return to his native state, and permission was granted.',
    'On jiazi day Wei\'s Prince Yue of Runan asked to return home, and permission was granted.',
  ],
  s0190: [
    'On xinsi, the imperial carriage personally sacrificed at the Hall of Enlightenment.',
    'On xinsi day the emperor sacrificed at the Hall of Enlightenment in person.',
  ],
  s0191: [
    'In the second month, day jiashen, Danyang Prefect Prince Ji of Wuling was made Jiangzhou Inspector.',
    'On jiashen day in the second month Danyang prefect Prince Ji of Wuling was made Jiangzhou inspector.',
  ],
  s0192: [
    'On xinchou, Ruru sent envoys bearing tribute.',
    'On xinchou day Ruru sent envoys with tribute.',
  ],
  s0193: [
    'In the third month, day bingchen, Henan Prince Aluozhen was made General Who Pacifies the West, Inspector of West Qin, He, and Sha provinces.',
    'On bingchen day in the third month Henan Prince Aluozhen was made General Who Pacifies the West and inspector of West Qin, He, and Sha provinces.',
  ],
  s0194: [
    'On gengchen, Central Army Protector Xiao Yuanzao was made Central Military General.',
    'On gengchen day Central Army Protector Xiao Yuanzao was made Central Military General.',
  ],
  s0195: [
    'In the fourth month of summer, day guiwei, General Who Pacifies the Right Prince Ji of Nankang was made Protector General.',
    'On guiwei day in the fourth month of summer General Who Pacifies the Right Prince Ji of Nankang was made Protector General.',
  ],
  s0196: [
    'On guisi, Chen Qingzhi attacked Wei\'s Liang city, took it, advanced and stormed Kaocheng, and captured Wei Prince Yuan Huiye of Jiyin.',
    'On guisi day Chen Qingzhi attacked Wei\'s Liang city and took it, then advanced to storm Kaocheng and captured Wei Prince Yuan Huiye of Jiyin.',
  ],
  s0197: [
    'In the fifth month, day wuchen, Daliang was captured.',
    'On wuchen day in the fifth month Daliang was taken.',
  ],
  s0198: [
    'On guiyou, Hulao city was captured.',
    'On guiyou day Hulao city was taken.',
  ],
  s0199: [
    'Wei\'s ruler Yuan Ziyou abandoned Luoyang and fled to Hebei.',
    'Wei\'s ruler Yuan Ziyou abandoned Luoyang and fled north to Hebei.',
  ],
  s0200: [
    'On yihai, Yuan Hao entered Luoyang.',
    'On yihai day Yuan Hao entered Luoyang.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_003_b2.mjs <translation.json>'
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
