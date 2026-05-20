#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'In the sixth month, on day renwu, a general amnesty was granted for the empire.',
    'On renwu day in the sixth month a general amnesty was proclaimed.',
  ],
  s0202: [
    'On day xinhai, Wei\'s Huaiyin Administrator Jin Hong brought Huyang city within the border.',
    'On xinhai day Wei\'s Huaiyin administrator Jin Hong surrendered Huyang city to the court.',
  ],
  s0203: [
    'In the intercalary month, on day jiwei, General of the Right for Administration, Army Protector, Prince Ji of Nankang died.',
    'On jiwei day in the intercalary month General of the Right for Administration, army protector, Prince Ji of Nankang died.',
  ],
  s0204: [
    'On day jimao, Wei\'s Erzhu Rong attacked and killed Yuan Hao and again held Luoyang.',
    'On jimao day Wei\'s Erzhu Rong attacked and killed Yuan Hao and reoccupied Luoyang.',
  ],
  s0205: [
    'In autumn, the ninth month, on day xinsi, the ornamental pillar at Zhuque Bridge was destroyed by fire.',
    'On xinsi day in the ninth month of autumn the ornamental pillar at Zhuque Bridge burned.',
  ],
  s0206: [
    'General Who Pacifies the North Yang Kan was made Inspector of Qing and Ji provinces.',
    'General Who Pacifies the North Yang Kan was made inspector of Qing and Ji provinces.',
  ],
  s0207: [
    'On day guisi, the imperial carriage went to Tongtai Temple, established a four-section unrestricted great assembly, and thereupon offered the body in renunciation; officials from dukes and ministers downward offered one hundred million in coin to ransom him.',
    'On guisi day the emperor went to Tongtai Temple, opened a four-section unrestricted great assembly, and offered his body in renunciation; from dukes and ministers downward all contributed one hundred million in coin to ransom him.',
  ],
  s0208: [
    'In the tenth month of winter, on day jiyou, the imperial carriage returned to the palace, granted a general amnesty, and changed the reign era.',
    'On jiyou day in the tenth month of winter the emperor returned to the palace, proclaimed a general amnesty, and changed the reign era.',
  ],
  s0209: [
    'In the eleventh month, on day bingxu, Grand General Who Pacifies the Center, Grand General with Staff Equal to the Three Dignities Yuan Ang was additionally made Director of the Palace Secretariat.',
    'On bingxu day in the eleventh month Grand General Who Pacifies the Center Yuan Ang, Grand General with Staff Equal to the Three Dignities, was additionally made Director of the Palace Secretariat.',
  ],
  s0210: [
    'Grand General Who Guards the Capital, Grand General with Staff Equal to the Three Dignities Prince Wei of Nanping was additionally made Junior Tutor of the Crown Prince.',
    'Grand General Who Guards the Capital Prince Wei of Nanping, Grand General with Staff Equal to the Three Dignities, was additionally made Junior Tutor of the Crown Prince.',
  ],
  s0211: [
    'Grand Masters for Golden Seal and Purple Sash Xiao Chen and Lu Gao were both promoted to Special Advancement.',
    'Grand Masters for Golden Seal and Purple Sash Xiao Chen and Lu Gao were both promoted to Special Advancement.',
  ],
  s0212: [
    'Minister of Works, Central Army General Yuan Faseng was promoted to General of Chariots and Cavalry.',
    'Minister of Works and Central Army General Yuan Faseng was promoted to General of Chariots and Cavalry.',
  ],
  s0213: [
    'General of the Interior Guard Xiao Yuanzao was made General of the Central Guard.',
    'General of the Interior Guard Xiao Yuanzao was made General of the Central Guard.',
  ],
  s0214: [
    'Central Army Commander Xiao Ang was made Army Commander.',
    'Central army commander Xiao Ang was made army commander.',
  ],
  s0215: [
    'On day wuzi, Wei\'s Bazhou Inspector Yan Shixin surrendered his city.',
    'On wuzi day Wei\'s Bazhou inspector Yan Shixin surrendered his city.',
  ],
  s0216: [
    'In the twelfth month, on day dingsi, the kingdom of Panpan sent envoys offering local products.',
    'On dingsi day in the twelfth month Panpan sent envoys with tribute.',
  ],
  s0217: [
    'In the second year, spring, first month, on day wuyin, Yongzhou Inspector Prince Gang of Jin\'an was made Grand General of Agile Cavalry and Yangzhou Inspector; South Xuzhou Inspector Prince Xu of Luling was made General Who Pacifies the North and Yongzhou Inspector.',
    'On wuyin day in the first month of spring, year 2, Yongzhou inspector Prince Gang of Jin\'an was made Grand General of Agile Cavalry and Yangzhou inspector, and South Xuzhou inspector Prince Xu of Luling was made General Who Pacifies the North and Yongzhou inspector.',
  ],
  s0218: [
    'On day guiwei, the Old Man star appeared.',
    'On guiwei day the Old Man star appeared.',
  ],
  s0219: [
    'In the fourth month of summer, on day gengshen, great hail fell.',
    'On gengshen day in the fourth month of summer heavy hail fell.',
  ],
  s0220: [
    'On day renshen, King of Henan Fofu was made General Who Pacifies the West and Inspector of West Qin and He provinces.',
    'On renshen day King of Henan Fofu was made General Who Pacifies the West and inspector of West Qin and He provinces.',
  ],
  s0221: [
    'In the sixth month, on day dingsi, Wei\'s Grand Tutor Prince Yue of Runan was dispatched back north to serve as Wei\'s ruler.',
    'On dingsi day in the sixth month Wei\'s Grand Tutor Prince Yue of Runan was sent back north to reign over Wei.',
  ],
  s0222: [
    'On day gengshen, Wei\'s Left Vice Director of the Masters of Writing Fan Zun was made General Who Pacifies the North and Governor of Si province, accompanying Yuan Yue north to campaign.',
    'On gengshen day Wei\'s Left Vice Director Fan Zun was made General Who Pacifies the North and governor of Si province and marched north with Yuan Yue.',
  ],
  s0223: [
    'The kingdom of Linyi sent envoys offering local products.',
    'Linyi sent envoys with tribute.',
  ],
  s0224: [
    'On day renshen, the kingdom of Funan sent envoys offering local products.',
    'On renshen day Funan sent envoys with tribute.',
  ],
  s0225: [
    'In the eighth month of autumn, on day gengxu, the imperial carriage went to Deyang Hall, held a music assembly, and saw off Wei\'s ruler Yuan Yue with a farewell banquet.',
    'On gengxu day in the eighth month of autumn the emperor went to Deyang Hall, held a music assembly, and gave a farewell banquet for Wei\'s ruler Yuan Yue.',
  ],
  s0226: [
    'Mountain bandits gathered, raiding the counties under Kuaiji commandery.',
    'Mountain bandits gathered and raided the counties under Kuaiji commandery.',
  ],
  s0227: [
    'In the ninth month, on day renwu, acting Superlative Martial General Zhan Haizhen was given a tally of authority to suppress them.',
    'On renwu day in the ninth month acting Superlative Martial General Zhan Haizhen was given command authority to suppress them.',
  ],
  s0228: [
    'In the third year, spring, first month, on day xinsi, the imperial carriage personally sacrificed at the Southern Suburbs, granted a general amnesty for the empire, and filial sons, obedient brothers, and diligent farmers were granted one rank of nobility.',
    'On xinsi day in the first month of spring, year 3, the emperor sacrificed at the Southern Suburbs in person, proclaimed a general amnesty, and granted one rank of nobility to filial sons, obedient brothers, and diligent farmers.',
  ],
  s0229: [
    'On day bingshen, Wei\'s Vice Director of the Masters of Writing Zheng Xianhu was made Grand General Who Conquers the North.',
    'On bingshen day Wei\'s Vice Director Zheng Xianhu was made Grand General Who Conquers the North.',
  ],
  s0230: [
    'In the second month, on day xinchou, the imperial carriage personally sacrificed at the Hall of Enlightenment.',
    'On xinchou day in the second month the emperor sacrificed at the Hall of Enlightenment in person.',
  ],
  s0231: [
    'On day jiayin, the Old Man star appeared.',
    'On jiayin day the Old Man star appeared.',
  ],
  s0232: [
    'On day yimao, Special Advancement Xiao Chen died.',
    'On yimao day Special Advancement Xiao Chen died.',
  ],
  s0233: [
    'On day yichou, Guangzhou Inspector Yuan Jinglong was made General of the Right for Administration.',
    'On yichou day Guangzhou inspector Yuan Jinglong was made General of the Right for Administration.',
  ],
  s0234: [
    'In the fourth month of summer, on day yisi, Crown Prince Tong died.',
    'On yisi day in the fourth month of summer Crown Prince Tong died.',
  ],
  s0235: [
    'In the sixth month, on day dingwei, former Crown Prince Mentor Xiao Yuanyou was made General of the Central Guard.',
    'On dingwei day in the sixth month former Crown Prince Mentor Xiao Yuanyou was made General of the Central Guard.',
  ],
  s0236: [
    'Vice Director of the Masters of Writing Xu Mian was additionally made Special Advancement and Grand Master for Golden Seal Serving at the Right.',
    'Vice Director Xu Mian was additionally made Special Advancement and Right Grand Master for Golden Seal.',
  ],
  s0237: [
    'The kingdom of Dandan sent envoys offering local products.',
    'Dandan sent envoys with tribute.',
  ],
  s0238: [
    'On day guichou, Crown Prince Zhaoming\'s son Duke of Huarong Huan, South Xuzhou Inspector, was made Prince of Yuzhang commandery; Duke of Zhijiang Yu was made Prince of Hedong commandery; and Duke of Qu\'e Cha was made Prince of Yueyang commandery.',
    'On guichou day Crown Prince Zhaoming\'s son Huan, Duke of Huarong and South Xuzhou inspector, was made Prince of Yuzhang commandery; Yu, Duke of Zhijiang, was made Prince of Hedong commandery; and Cha, Duke of Qu\'e, was made Prince of Yueyang commandery.',
  ],
  s0239: [
    'In the seventh month of autumn, on day yihai, Prince Gang of Jin\'an was made Crown Prince.',
    'On yihai day in the seventh month of autumn Prince Gang of Jin\'an was made Crown Prince.',
  ],
  s0240: [
    'A general amnesty was granted for the empire; heirs who succeeded their fathers and those who showed loyalty, filial piety, martial and civil merit, cleanness, and diligence in service were all granted one rank of nobility.',
    'A general amnesty was proclaimed; heirs who succeeded their fathers and those who had served with loyalty, filial piety, martial and civil merit, integrity, and diligence all received one rank of nobility.',
  ],
  s0241: [
    'On day yiyou, Palace Attendant and Minister of the Five Armies Xie Ju was made Minister of Personnel.',
    'On yiyou day Palace Attendant and Minister of the Five Armies Xie Ju was made Minister of Personnel.',
  ],
  s0242: [
    'On day gengyin, an edict said: "Extending grace to the six relations, righteousness displayed among the nine kin-groups, bestowing marquisates in rank—this too is fitting.',
    'On gengyin day an edict said, "To extend grace to the six relations, make righteousness shine among the nine kin-groups, and bestow marquisates in rank is only fitting.',
  ],
  s0243: [
    'All imperial clansmen within mourning obligations may be granted fief-income Marquis of the Village and Pavilion, each in descending order according to nearness or distance.',
    'All clansmen within the prescribed degrees of mourning may receive fief-income as Marquis of the Village and Pavilion, graded by nearness or distance.',
  ],
  s0244: [
    'As for close intimates, the old regulations shall apply.',
    'For close intimates, the old regulations still apply.',
  ],
  s0245: [
    '" On day renchen, Minister of Personnel He Jingrong was made Right Vice Director of the Masters of Writing.',
    '" On renchen day Minister of Personnel He Jingrong was made Right Vice Director of the Masters of Writing.',
  ],
  s0246: [
    'On day guisi, the Old Man star appeared.',
    'On guisi day the Old Man star appeared.',
  ],
  s0247: [
    'In the ninth month, on day gengwu, Crown Prince Mentor Xiao Yuanzao was made General Who Conquers the North and South Yanzhou Inspector.',
    'On gengwu day in the ninth month Crown Prince Mentor Xiao Yuanzao was made General Who Conquers the North and South Yanzhou inspector.',
  ],
  s0248: [
    'On day wuyin, Langyaxiu submitted a memorial offering local products.',
    'On wuyin day Langyaxiu submitted a memorial with tribute.',
  ],
  s0249: [
    'In the tenth month of winter, on day jiyou, the court went to Tongtai Temple; Gaozu ascended the dharma seat and expounded the meaning of the Mahaparinirvana Sutra for the four assemblies, continuing until day yimao.',
    'On jiyou day in the tenth month of winter the court went to Tongtai Temple; Gaozu took the dharma seat and expounded the Mahaparinirvana Sutra for the four assemblies, continuing until yimao day.',
  ],
  s0250: [
    'Former Marquis of Leshan county Xiao Zhengze, having been exiled for crime, now gathered fugitives and sought to raid Guangzhou; local forces suppressed and pacified him.',
    'Former Marquis of Leshan county Xiao Zhengze, exiled for crime, now gathered fugitives and sought to raid Guangzhou; local forces crushed and pacified him.',
  ],
  s0251: [
    'In the eleventh month, on day yiwei, the court went to Tongtai Temple; Gaozu ascended the dharma seat and continued expounding the meaning of the Mahaprajnaparamita Sutra until xinchou day in the twelfth month.',
    'On yiwei day in the eleventh month the court went to Tongtai Temple; Gaozu took the dharma seat and continued expounding the Mahaprajnaparamita Sutra until xinchou day in the twelfth month.',
  ],
  s0252: [
    'That year, Wuxing commandery produced wild grain fit to eat.',
    'That year Wuxing commandery produced wild grain fit for food.',
  ],
  s0253: [
    'In the fourth year, spring, first month, on the first day bingyin, Grand General Who Guards the Capital, Grand General with Staff Equal to the Three Dignities Prince Wei of Nanping was promoted to Grand Marshal; Minister of Works Yuan Faseng was promoted to Grand Preceptor; Director of the Masters of Writing, General of the Interior Guard, Grand General with Staff Equal to the Three Dignities Yuan Ang was promoted to Minister of Works.',
    'On bingyin, the new moon of the first month of spring, year 4, Prince Wei of Nanping was promoted to Grand Marshal; Yuan Faseng from Minister of Works to Grand Preceptor; and Yuan Ang, Director of the Masters of Writing and General of the Interior Guard, to Minister of Works.',
  ],
  s0254: [
    'Prince Zhengde, son of Prince Hong of Linchuan Jinghui, was made Prince of Linhe commandery.',
    'Zhengde, son of Prince Hong of Linchuan Jinghui, was made Prince of Linhe commandery.',
  ],
  s0255: [
    'On day wuchen, Danyang Prefect Prince Lun of Shaoling was made Yangzhou Inspector.',
    'On wuchen day Danyang prefect Prince Lun of Shaoling was made Yangzhou inspector.',
  ],
  s0256: [
    'Crown Prince Right Guard Leader Xue Fahu was made General Who Pacifies the North and Governor of Si province, guarding and escorting Yuan Yue into Luoyang.',
    'Crown Prince Right Guard Leader Xue Fahu was made General Who Pacifies the North and governor of Si province to guard and escort Yuan Yue into Luoyang.',
  ],
  s0257: [
    'On day gengwu, legitimate imperial grandson Daqi was made Prince of Xuancheng commandery.',
    'On gengwu day legitimate imperial grandson Daqi was made Prince of Xuancheng commandery.',
  ],
  s0258: [
    'On day guiwei, Wei\'s South Yanzhou Inspector Liu Shiming surrendered his city; Wei\'s South Yanzhou was changed to Qiao province, and Shiming was made inspector.',
    'On guiwei day Wei\'s South Yanzhou inspector Liu Shiming surrendered his city; South Yanzhou was renamed Qiao province and Shiming was made its inspector.',
  ],
  s0259: [
    'In the second month, on day renyin, the Old Man star appeared.',
    'On renyin day in the second month the Old Man star appeared.',
  ],
  s0260: [
    'Newly appointed Grand Preceptor Yuan Faseng returned north to become ruler of Eastern Wei.',
    'Newly appointed Grand Preceptor Yuan Faseng returned north to reign as ruler of Eastern Wei.',
  ],
  s0261: [
    'General of the Right for Administration Yuan Jinglong was made General Who Conquers the North and Xuzhou Inspector; Cloud Banner General Yang Kan was made General Who Pacifies the North and Yanzhou Inspector; Cavalier Attendant-in-Ordinary Yuan Shu was made General Who Guards the North.',
    'General of the Right for Administration Yuan Jinglong was made General Who Conquers the North and Xuzhou inspector; Cloud Banner General Yang Kan was made General Who Pacifies the North and Yanzhou inspector; and Cavalier Attendant-in-Ordinary Yuan Shu was made General Who Guards the North.',
  ],
  s0262: [
    'On day gengxu, newly appointed Yangzhou Inspector Prince Lun of Shaoling was guilty of crime and demoted to commoner.',
    'On gengxu day newly appointed Yangzhou inspector Prince Lun of Shaoling was found guilty and reduced to commoner status.',
  ],
  s0263: [
    'On day renzi, Jiangzhou Inspector Prince Ji of Wuling was made Yangzhou Inspector; Army Commander Xiao Ang was made Jiangzhou Inspector.',
    'On renzi day Jiangzhou inspector Prince Ji of Wuling was made Yangzhou inspector, and army commander Xiao Ang was made Jiangzhou inspector.',
  ],
  s0264: [
    'On day bingchen, Shaoling county captured one white deer.',
    'On bingchen day Shaoling county captured a white deer.',
  ],
  s0265: [
    'In the third month, on day gengwu, Palace Attendant and Director of the Imperial Academy Xiao Zixian memorialized to establish one assistant instructor for the imperial commentary Filial Piety Classic, with ten students devoted to mastering Gaozu\'s exposition of the Filial Piety Meanings.',
    'On gengwu day in the third month Palace Attendant and Director of the Imperial Academy Xiao Zixian memorialized to appoint one assistant instructor for the imperial Filial Piety Classic, with ten students devoted to Gaozu\'s exposition of its meanings.',
  ],
  s0266: [
    'In the fourth month of summer, on day renshen, the kingdom of Panpan sent envoys offering local products.',
    'On renshen day in the fourth month of summer Panpan sent envoys with tribute.',
  ],
  s0267: [
    'In the seventh month of autumn, on day jiachen, stars fell like rain.',
    'On jiachen day in the seventh month of autumn stars fell like rain.',
  ],
  s0268: [
    'In the eighth month, on day bingzi, Special Advancement Lu Gao died.',
    'On bingzi day in the eighth month Special Advancement Lu Gao died.',
  ],
  s0269: [
    'In the ninth month, on day yisi, Crown Prince Mentor and Heir of Nanping Prince Ke was made Army Commander; General Who Pacifies the North and Yongzhou Inspector Prince Xu of Luling was made General Who Pacifies the North; Western Central Commander and Jingzhou Inspector Prince Yi of Xiangdong was made General Who Pacifies the West; and Minister of Works Yuan Ang additionally held the directorship of the Masters of Writing.',
    'On yisi day in the ninth month Crown Prince Mentor Ke, heir of Prince of Nanping, was made army commander; General Who Pacifies the North Prince Xu of Luling, Yongzhou inspector, was made General Who Pacifies the North; Western Central Commander Prince Yi of Xiangdong, Jingzhou inspector, was made General Who Pacifies the West; and Minister of Works Yuan Ang additionally held the directorship of the Masters of Writing.',
  ],
  s0270: [
    'In the eleventh month, on day jiyou, the kingdom of Goguryeo sent envoys offering local products.',
    'On jiyou day in the eleventh month Goguryeo sent envoys with tribute.',
  ],
  s0271: [
    'In the twelfth month, on day gengchen, Grand Preceptor Yuan Faseng was made Grand General of Agile Cavalry, with staff equal to the Three Dignities, and Yingzhou Inspector.',
    'On gengchen day in the twelfth month Grand Preceptor Yuan Faseng was made Grand General of Agile Cavalry with staff equal to the Three Dignities and Yingzhou inspector.',
  ],
  s0272: [
    'In the fifth year, spring, first month, on day xinmao, the imperial carriage personally sacrificed at the Southern Suburbs, granted a general amnesty for the empire, and filial sons, obedient brothers, and diligent farmers were granted one rank of nobility.',
    'On xinmao day in the first month of spring, year 5, the emperor sacrificed at the Southern Suburbs in person, proclaimed a general amnesty, and granted one rank of nobility to filial sons, obedient brothers, and diligent farmers.',
  ],
  s0273: [
    'The night before, on bing eve, Director of the Southern Suburbs Xie Dizhi and others went to inspect the suburban site; suddenly they heard strange fragrance three times wafting on the wind, and when the rites were about to begin and the music welcoming the spirits had finished, divine light filled the altar in red, purple, yellow, and white mixed colors, lasting about the time to eat a meal before vanishing.',
    'On the eve before, at the third watch of bing night, Director of the Southern Suburbs Xie Dizhi and others inspected the ritual ground and suddenly smelled strange fragrance three times on the wind; when the rites were about to begin and the music welcoming the spirits had ended, divine light filled the altar in red, purple, yellow, and white, lingering for the time of a meal before fading.',
  ],
  s0274: [
    'Concurrent Grand Preceptor Prince Ji of Wuling and others reported it.',
    'Concurrent Grand Preceptor Prince Ji of Wuling and others reported the omen.',
  ],
  s0275: [
    'On day wushen, the capital shook with an earthquake.',
    'On wushen day the capital was shaken by an earthquake.',
  ],
  s0276: [
    'On day jiyou.',
    'On jiyou day,',
  ],
  s0277: [
    'A broom star appeared.',
    'a broom star was seen.',
  ],
  s0278: [
    'On day xinhai, the imperial carriage personally sacrificed at the Hall of Enlightenment.',
    'On xinhai day the emperor sacrificed at the Hall of Enlightenment in person.',
  ],
  s0279: [
    'On day guichou, Prince Daqi of Xuancheng was made Central Army General.',
    'On guichou day Prince Daqi of Xuancheng was made Central Army General.',
  ],
  s0280: [
    'The kingdom of Henan sent envoys offering local products.',
    'Henan sent envoys with tribute.',
  ],
  s0281: [
    'In the second month, on day guiwei, the court went to Tongtai Temple, held a four-section great assembly, and Gaozu ascended the dharma seat to open the lecture on the Gold-letter Mahaprajnaparamita Sutra, continuing until day jichou.',
    'On guiwei day in the second month the court went to Tongtai Temple and held a four-section great assembly; Gaozu took the dharma seat and opened the Gold-letter Mahaprajnaparamita Sutra, continuing until jichou day.',
  ],
  s0282: [
    'The Old Man star appeared.',
    'The Old Man star was seen.',
  ],
  s0283: [
    'In the third month, on day bingchen, Grand Marshal Prince Wei of Nanping died.',
    'On bingchen day in the third month Grand Marshal Prince Wei of Nanping died.',
  ],
  s0284: [
    'In the fourth month of summer, on day guiyou, Censor-in-Chief Zang Dun was made concurrent Army Commander.',
    'On guiyou day in the fourth month of summer Censor-in-Chief Zang Dun was made concurrent army commander.',
  ],
  s0285: [
    'In the fifth month, on day wuzi, the capital flooded; the imperial thoroughfare was navigable by boat.',
    'On wuzi day in the fifth month the capital flooded and boats could pass along the imperial thoroughfare.',
  ],
  s0286: [
    'In the sixth month, on day jimao, Wei Jianyi city chief Lan Bao killed Wei\'s East Xuzhou Inspector and surrendered Xiapi city.',
    'On jimao day in the sixth month Wei Jianyi city chief Lan Bao killed Wei\'s East Xuzhou inspector and surrendered Xiapi city.',
  ],
  s0287: [
    'In the seventh month of autumn, on day xinmao, Xiapi was changed to Wuzhou.',
    'On xinmao day in the seventh month of autumn Xiapi was renamed Wuzhou.',
  ],
  s0288: [
    'In the eighth month, on day gengshen, former Xuzhou Inspector Yuan Jinglong was made General of the Right for Administration.',
    'On gengshen day in the eighth month former Xuzhou inspector Yuan Jinglong was made General of the Right for Administration.',
  ],
  s0289: [
    'The Old Man star appeared.',
    'The Old Man star was seen.',
  ],
  s0290: [
    'On day jiazi, the kingdom of Persia sent envoys offering local products.',
    'On jiazi day Persia sent envoys with tribute.',
  ],
  s0291: [
    'On day jiashen, General of the Central Guard Xiao Yuanyou died.',
    'On jiashen day General of the Central Guard Xiao Yuanyou died.',
  ],
  s0292: [
    'In the ninth month, on day jihai, Light Chariot General Prince Zhengde of Linhe was made General of the Central Guard.',
    'On jihai day in the ninth month Light Chariot General Prince Zhengde of Linhe was made General of the Central Guard.',
  ],
  s0293: [
    'On day jiayin, Director of the Masters of Writing and Minister of Works Yuan Ang was made Special Advancement and Grand Master for Golden Seal Serving at the Left, retaining the Ministry of Works.',
    'On jiayin day Director of the Masters of Writing and Minister of Works Yuan Ang was made Special Advancement and Left Grand Master for Golden Seal, retaining the Ministry of Works.',
  ],
  s0294: [
    'The kingdom of Panpan sent envoys offering local products.',
    'Panpan sent envoys with tribute.',
  ],
  s0295: [
    'In the tenth month of winter, on day gengshen, Right Vice Director of the Masters of Writing He Jingrong was made Left Vice Director of the Masters of Writing; Minister of Personnel Xie Ju was made Right Vice Director of the Masters of Writing; and Palace Attendant and Director of the Imperial Academy Xiao Zixian was made Minister of Personnel.',
    'On gengshen day in the tenth month of winter Right Vice Director He Jingrong was made Left Vice Director of the Masters of Writing; Minister of Personnel Xie Ju was made Right Vice Director; and Palace Attendant and Director of the Imperial Academy Xiao Zixian was made Minister of Personnel.',
  ],
  s0296: [
    'In the sixth year, spring, second month, on day guihai, the imperial carriage personally plowed the sacred field, granted a general amnesty for the empire, and filial sons, obedient brothers, and diligent farmers were granted one rank of nobility.',
    'On guihai day in the second month of spring, year 6, the emperor plowed the sacred field in person, proclaimed a general amnesty, and granted one rank of nobility to filial sons, obedient brothers, and diligent farmers.',
  ],
  s0297: [
    'In the third month, on day jihai, Acting King of Henan Kedazhen was made Inspector of West Qin and He provinces and King of Henan.',
    'On jihai day in the third month Acting King of Henan Kedazhen was made inspector of West Qin and He provinces and King of Henan.',
  ],
  s0298: [
    'On day jiachen, the kingdom of Baekje sent envoys offering local products.',
    'On jiachen day Baekje sent envoys with tribute.',
  ],
  s0299: [
    'In the fourth month of summer, on day dingmao, Mars was in the Southern Dipper.',
    'On dingmao day in the fourth month of summer Mars stood in the Southern Dipper.',
  ],
  s0300: [
    'In the seventh month of autumn, on day jiachen, the kingdom of Linyi sent envoys offering local products.',
    'On jiachen day in the seventh month of autumn Linyi sent envoys with tribute.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_003_b3.mjs <translation.json>'
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
