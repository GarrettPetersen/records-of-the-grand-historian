#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'In the eighth month, day jiwei, Prince of Wuxing Yang Shaoxian, Southern Liangzhou inspector, was made inspector of Qin and Southern Qin provinces.',
    'On jiwei day in the eighth month, Prince of Wuxing Yang Shaoxian, inspector of Southern Liangzhou, was made inspector of Qin and Southern Qin.',
  ],
  s0302: [
    'In the tenth month of winter, day dingmao, Trustworthy Martial General Yuan Qinghe was made General Who Pacifies the North and led troops on the northern expedition.',
    'On dingmao day in the tenth month of winter, Trustworthy Martial General Yuan Qinghe became General Who Pacifies the North and marched north at the head of the army.',
  ],
  s0303: [
    'In the intercalary twelfth month, day bingwu, thunder sounded twice in the southwest.',
    'On bingwu day in the intercalary twelfth month, thunder rolled twice from the southwest.',
  ],
  s0304: [
    'In the first year of Datong, spring, first month, day wushen new moon, the era name was changed and a general amnesty granted for the empire.',
    'On the wushen new moon of the first month in Datong 1, the era name was changed and the empire received a general amnesty.',
  ],
  s0305: [
    'In the second month, day jimao, the Old Man star appeared.',
    'On jimao day in the second month, the Old Man star appeared.',
  ],
  s0306: [
    'On day xinsi, the imperial carriage personally performed sacrifice at the Bright Hall.',
    'On xinsi day the emperor sacrificed at the Bright Hall in person.',
  ],
  s0307: [
    'On day dinghai, the imperial carriage personally plowed the sacred field.',
    'On dinghai day the emperor plowed the sacred field in person.',
  ],
  s0308: [
    'On day xinchou, Goguryeo and Dandan each sent envoys bearing tribute.',
    'On xinchou day Goguryeo and Dandan each sent envoys with tribute.',
  ],
  s0309: [
    'In the third month, day xinwei, the King of Huole, King Andle Sadan, sent envoys bearing tribute.',
    'On xinwei day in the third month, King Andle Sadan of Huole sent envoys with tribute.',
  ],
  s0310: [
    'In the fourth month of summer, day gengzi, Persia presented tribute.',
    'On gengzi day in the fourth month of summer, Persia sent tribute.',
  ],
  s0311: [
    'On day jiachen, Wei General Who Guards the East Liu Ji was made Xuzhou inspector.',
    'On jiachen day Wei General Who Guards the East Liu Ji was made inspector of Xuzhou.',
  ],
  s0312: [
    'On day renxu, General Who Pacifies the North, Prince of Luling Xu, was made General Who Pacifies the South and Jiangzhou inspector.',
    'On renxu day General Who Pacifies the North, Prince of Luling Xu, became General Who Pacifies the South and inspector of Jiangzhou.',
  ],
  s0313: [
    'In the seventh month of autumn, day yimao, the Old Man star appeared.',
    'On yimao day in the seventh month of autumn, the Old Man star appeared.',
  ],
  s0314: [
    'On day xinmao, Funan sent envoys bearing tribute.',
    'On xinmao day Funan sent envoys with tribute.',
  ],
  s0315: [
    'In the tenth month of winter, day xinmao, former South Yanzhou inspector Xiao Yuanzao was made Guard Army General.',
    'On xinmao day in the tenth month of winter, former South Yanzhou inspector Xiao Yuanzao was made Guard Army General.',
  ],
  s0316: [
    'In the eleventh month, day dingwei, Central Guard General, Special Advancement, Right Grand Master of Brilliant Happiness Xu Mian died.',
    'On dingwei day in the eleventh month, Central Guard General Xu Mian, Special Advancement and Right Grand Master of Brilliant Happiness, died.',
  ],
  s0317: [
    'On day renxu, Northern Liangzhou inspector Lan Qin attacked Hanzhong, took it, and Wei Liangzhou inspector Yuan Luo surrendered.',
    'On renxu day Northern Liangzhou inspector Lan Qin attacked Hanzhong, captured it, and Wei Liangzhou inspector Yuan Luo surrendered.',
  ],
  s0318: [
    'On day guihai, those who submitted in Liang province were granted exemptions according to rank.',
    'On guihai day those who came over in Liang province received graded tax exemptions.',
  ],
  s0319: [
    'On day jiazi, Valiant General, Prince of Yinping Yang Fashen, Northern Yizhou inspector, was promoted to General Who Pacifies the North.',
    'On jiazi day Valiant General Yang Fashen, Prince of Yinping and inspector of Northern Yizhou, was promoted to General Who Pacifies the North.',
  ],
  s0320: [
    'The moon passed the Left Horn star.',
    'The moon crossed the Left Horn star.',
  ],
  s0321: [
    'In the twelfth month, day yiyou, Wei Northern Xuzhou inspector Yang Huiyi was made General Who Pacifies the North.',
    'On yiyou day in the twelfth month, Wei Northern Xuzhou inspector Yang Huiyi was made General Who Pacifies the North.',
  ],
  s0322: [
    'On day wuxu, General Who Pacifies the West and Qin and Southern Qin inspector Prince of Wuxing Yang Shaoxian was promoted to Chariots and Cavalry General; General Who Pacifies the North and Northern Yizhou inspector Prince of Yinping Yang Fashen was promoted to Flying Cavalry General.',
    'On wuxu day General Who Pacifies the West Yang Shaoxian, Prince of Wuxing and inspector of Qin and Southern Qin, was promoted to Chariots and Cavalry General, and General Who Pacifies the North Yang Fashen, Prince of Yinping and inspector of Northern Yizhou, was promoted to Flying Cavalry General.',
  ],
  s0323: [
    'On day xinchou, General Who Pacifies the West, Jingzhou inspector Prince Yi of Xiangdong was promoted to General Who Secures the West.',
    'On xinchou day General Who Pacifies the West, Prince Yi of Xiangdong, inspector of Jingzhou, was promoted to General Who Secures the West.',
  ],
  s0324: [
    'In the second year, spring, first month, day jiachen, acting Colonel Director of Retainers Zang Dun was made Colonel Director of Retainers.',
    'On jiachen day in the first month of spring, year 2, acting Colonel Director of Retainers Zang Dun was confirmed as Colonel Director of Retainers.',
  ],
  s0325: [
    'In the second month, day yihai, the imperial carriage personally plowed the sacred field.',
    'On yihai day in the second month the emperor plowed the sacred field in person.',
  ],
  s0326: [
    'On day bingxu, the Old Man star appeared.',
    'On bingxu day the Old Man star appeared.',
  ],
  s0327: [
    'In the third month, day gengshen, an edict said: "Government lies in nurturing the people; virtue extends to covering all things; commands from above are like wind, the people respond like grass.',
    'On gengshen day in the third month an edict declared: "To govern is to nourish the people; virtue spreads over all things; the command from above is wind, and the people bend like grass.',
  ],
  s0328: [
    'I am scant in virtue; fortune came in its season; I turned disorder to order—and suddenly three decades have passed.',
    'My virtue is slight; fortune came when the hour demanded it; I set chaos right—and in a breath three decades are gone.',
  ],
  s0329: [
    'I have not made the gates stand open without closing, guards unnecessary beyond the borders; frontiers remain blocked, chariots and writing not yet unified.',
    'I have not brought the realm to the age when gates need never shut and guards need not stand beyond the seas; frontiers still divide us, and chariots and script are not yet one.',
  ],
  s0330: [
    'The people weary from transport; soldiers toil at the frontier.',
    'The people are worn down by transport, and soldiers labor on the borders.',
  ],
  s0331: [
    'Fields are stripped for grain, and there is no halt.',
    'Fields are emptied for grain, and the burden will not stop.',
  ],
  s0332: [
    'The way of governance is unclear, policy often perverse; the hundred officials offer no heart-nourishing words, the four listeners lack flying-ear hearing; provinces cease examination, commanderies forget joint rule.',
    'The path of rule is dim and policy often turns crooked; the hundred ministers give no counsel that nourishes the heart, the four listeners hear with no flying ear; provinces stop their inspections, and commanderies forget to govern together.',
  ],
  s0333: [
    'Thus wrongs and blame go unheard.',
    'Wrong and blame pile up with no way to reach me.',
  ],
  s0334: [
    'Law is mocked and twisted, wrongs bred from affairs; the petition stone stands empty, the complaint bell hangs idle.',
    'Men mock the written law and twist it to their ends; the petition stone stands bare, the complaint bell rings to no one.',
  ],
  s0335: [
    'Does not the Book say: "The limbs and thighs are men; worthy ministers make the sage."',
    'Does not the Book say, "The arms and legs are men; worthy ministers make the sage"?',
  ],
  s0336: [
    'Truly we rely on worthy aides to remedy our failures.',
    'I truly depend on worthy assistants to mend what I lack.',
  ],
  s0337: [
    'All in court, each offer loyal counsel; whatever policy is inconvenient to the people—lay it all out.',
    'All who stand in court, each speak your loyal mind; every policy that harms the people, lay it out in full.',
  ],
  s0338: [
    'If far away, inspectors and two-thousand-bushel commandery chiefs shall all memorialize.',
    'If you are far off, inspectors and commandery chiefs of two-thousand-bushel rank shall all report upward.',
  ],
  s0339: [
    'Common people with grievances—all shall be transmitted.',
    'If common people have words to speak, transmit them all.',
  ],
  s0340: [
    'I will personally review and ease their suffering.',
    'I will read them myself and ease what is wrong.',
  ],
  s0341: [
    'Civil and military in office—recommend what you know; dukes, marquises, generals, ministers—employ by talent; fill gaps and mend omissions; hide nothing."',
    'Civil and military officers in post, recommend those you know; dukes, marquises, generals, and ministers, appoint by talent; fill what is missing and mend what is broken; conceal nothing."',
  ],
  s0342: [
    'In the fourth month of summer, day yimao, Flying Cavalry Grand General Yuan Faseng, with open office and third-rank ceremonial parity, was made Grand Commandant and Grand Army General.',
    'On yimao day in the fourth month of summer, Flying Cavalry Grand General Yuan Faseng, with an open office and third-rank ceremonial parity, was made Grand Commandant and Grand Army General.',
  ],
  s0343: [
    'Earlier, Right Assistant Director of the Masters of Writing Jiang Zisi submitted a sealed memorial, speaking fully of the gains and losses in governance.',
    'Earlier, Right Assistant Director of the Masters of Writing Jiang Zisi submitted a sealed memorial that laid out the gains and losses of government in full.',
  ],
  s0344: [
    'In the fifth month, day guimao, an edict said: "The ancients said: leaks in the roof above—the knowledge lies below.',
    'On guimao day in the fifth month an edict said, "The ancients said that when the roof leaks above, the knowledge is below.',
  ],
  s0345: [
    'My accumulated faults—I cannot perceive them myself.',
    'The faults I have piled up, I cannot see for myself.',
  ],
  s0346: [
    'The sealed memorial of Jiang Zisi and others as above—the Masters of Writing shall promptly examine; whatever harms the people—stop it at once; report in detail quickly, without delay."',
    'The sealed memorial of Jiang Zisi and the others, as above, is to be examined at once by the Masters of Writing; whatever harms the people is to be stopped immediately and reported in detail without delay."',
  ],
  s0347: [
    'On day yisi, former Wei Liangzhou inspector Yuan Luo was made General Who Conquers the North and Qing and Ji inspector.',
    'On yisi day former Wei Liangzhou inspector Yuan Luo was made General Who Conquers the North and inspector of Qing and Ji.',
  ],
  s0348: [
    'In the sixth month, day dinghai, an edict said: "Directors of the Southern Suburb, Bright Hall, tombs, and temples share rank with Gentlemen-Attendance—too light for their duties; they may be treated as Regular Attendant Cavalier."',
    'On dinghai day in the sixth month an edict said, "The directors of the Southern Suburb, Bright Hall, tombs, and temples share rank with Gentlemen-Attendance, which is too slight for their charge; they may be treated as Regular Attendant Cavalier."',
  ],
  s0349: [
    'In the tenth month of winter, day yihai, an edict ordered a major northern expedition.',
    'On yihai day in the tenth month of winter an edict ordered a great northern campaign.',
  ],
  s0350: [
    'In the eleventh month, day jihai, an edict ordered the northern expedition army to withdraw.',
    'On jihai day in the eleventh month an edict ordered the northern expedition force to return.',
  ],
  s0351: [
    'On day xinhai, the capital was shaken by earthquake.',
    'On xinhai day the capital shook with an earthquake.',
  ],
  s0352: [
    'In the twelfth month, day renshen, Wei requested peace; an edict granted it.',
    'On renshen day in the twelfth month Wei asked for peace, and an edict granted it.',
  ],
  s0353: [
    'On day dingyou, Wu Xing commandery governor, Commandant of Cavalry Escort, Marquis of Liting Zhang Zuan was made Minister of Personnel.',
    'On dingyou day Zhang Zuan, governor of Wu Xing, Commandant of Cavalry Escort, and Marquis of Liting, was made Minister of Personnel.',
  ],
  s0354: [
    'In the third year, spring, first month, day xinchou, the imperial carriage personally sacrificed at the Southern Suburb, and a general amnesty was granted for the empire;',
    'On xinchou day in the first month of spring, year 3, the emperor sacrificed at the Southern Suburb in person and proclaimed a general amnesty;',
  ],
  s0355: [
    'filial and diligent farmers were granted one rank of nobility.',
    'filial and diligent farmers received one rank of nobility.',
  ],
  s0356: [
    'That night the Vermilion Bird Gate burned.',
    'That night the Vermilion Bird Gate was destroyed by fire.',
  ],
  s0357: [
    'On day renyin, though the sky was cloudless, ash rained down, yellow in color.',
    'On renyin day the sky was clear, yet yellow ash fell like rain.',
  ],
  s0358: [
    'On day guimao, Secretariat Director Prince of Shaoling Lun was made Jiangzhou inspector.',
    'On guimao day Secretariat Director Prince of Shaoling Lun was made inspector of Jiangzhou.',
  ],
  s0359: [
    'In the second month, day yiyou, the Old Man star appeared.',
    'On yiyou day in the second month the Old Man star appeared.',
  ],
  s0360: [
    'On day dinghai, the imperial carriage personally plowed the sacred field.',
    'On dinghai day the emperor plowed the sacred field in person.',
  ],
  s0361: [
    'On day jichou, Left Vice Director of the Masters of Writing He Jingrong was made Central Authority General; Guard Army General Xiao Yuanzao was made Right Pacification General and Left Vice Director of the Masters of Writing.',
    'On jichou day Left Vice Director of the Masters of Writing He Jingrong was made Central Authority General, and Guard Army General Xiao Yuanzao was made Right Pacification General and Left Vice Director of the Masters of Writing.',
  ],
  s0362: [
    'Right Vice Director of the Masters of Writing Xie Ju was made Right Grand Master of Brilliant Happiness.',
    'Right Vice Director of the Masters of Writing Xie Ju was made Right Grand Master of Brilliant Happiness.',
  ],
  s0363: [
    'On day gengyin, General Who Pacifies the South, Prince of Luling Xu, was made Central Guard General and Guard Army General.',
    'On gengyin day General Who Pacifies the South, Prince of Luling Xu, was made Central Guard General and Guard Army General.',
  ],
  s0364: [
    'In the third month, day wuxu, Crown Prince Zhaoming\'s son Zi was made Prince of Wuchang, and Tan was made Prince of Yiyang.',
    'On wuxu day in the third month Crown Prince Zhaoming\'s son Zi was enfeoffed as Prince of Wuchang, and Tan as Prince of Yiyang.',
  ],
  s0365: [
    'In the fourth month of summer, day dingmao, Prince of Hedong Yu, governor of Southern Langye and Pengcheng commanderies, was made South Xuzhou inspector.',
    'On dingmao day in the fourth month of summer Prince of Hedong Yu, governor of Southern Langye and Pengcheng, was made inspector of South Xuzhou.',
  ],
  s0366: [
    'In the fifth month, day bingshen, former Yangzhou inspector Prince of Wuling Ji was restored as Yangzhou inspector.',
    'On bingshen day in the fifth month former Yangzhou inspector Prince of Wuling Ji was restored to Yangzhou.',
  ],
  s0367: [
    'In the sixth month, frost fell in the Qushan borderlands of Qing province.',
    'In the sixth month frost fell in the Qushan region of Qing province.',
  ],
  s0368: [
    'In the seventh month of autumn, day guimao, Wei sent envoys on a friendly mission.',
    'On guimao day in the seventh month of autumn Wei sent envoys on a friendly visit.',
  ],
  s0369: [
    'On day jiyou, Prince of Yiyang Tan died.',
    'On jiyou day Prince of Yiyang Tan died.',
  ],
  s0370: [
    'That month snow fell in Qing province and harmed the crops.',
    'That month Qing province saw snow that damaged the grain.',
  ],
  s0371: [
    'In the eighth month, day jiashen, the Old Man star appeared.',
    'On jiashen day in the eighth month the Old Man star appeared.',
  ],
  s0372: [
    'On day xinmao, the imperial carriage visited King Asoka Temple and granted amnesty for the empire.',
    'On xinmao day the emperor visited King Asoka Temple and proclaimed amnesty for the empire.',
  ],
  s0373: [
    'In the ninth month, South Yanzhou suffered great famine.',
    'In the ninth month South Yanzhou fell into severe famine.',
  ],
  s0374: [
    'That month wild rice and barnyard grass grew spontaneously across some two thousand qing within Northern Xuzhou.',
    'That month wild rice and barnyard grass sprang up across some two thousand qing in Northern Xuzhou.',
  ],
  s0375: [
    'In the intercalary month, day jiazi, General Who Secures the West, Jingzhou inspector Prince Yi of Xiangdong was promoted to General Who Guards the West; Yangzhou inspector Prince of Wuling Ji was made General Who Secures the West and Yizhou inspector.',
    'On jiazi day in the intercalary month General Who Secures the West, Prince Yi of Xiangdong, inspector of Jingzhou, was promoted to General Who Guards the West, and Yangzhou inspector Prince of Wuling Ji was made General Who Secures the West and inspector of Yizhou.',
  ],
  s0376: [
    'In the tenth month of winter, day bingchen, the capital was shaken by earthquake.',
    'On bingchen day in the tenth month of winter the capital shook with an earthquake.',
  ],
  s0377: [
    'That year famine spread.',
    'That year the land knew famine.',
  ],
  s0378: [
    'In the fourth year, spring, first month, day gengchen, Central Army General Prince of Xuancheng Daqi was made Central Army Grand General and Yangzhou inspector.',
    'On gengchen day in the first month of spring, year 4, Central Army General Prince of Xuancheng Daqi was made Central Army Grand General and inspector of Yangzhou.',
  ],
  s0379: [
    'In the second month, day jihai, the imperial carriage personally plowed the sacred field.',
    'On jihai day in the second month the emperor plowed the sacred field in person.',
  ],
  s0380: [
    'In the third month, day wuyin, the Henan kingdom sent envoys bearing tribute.',
    'On wuyin day in the third month the Henan kingdom sent envoys with tribute.',
  ],
  s0381: [
    'On day guiwei, Rouran sent envoys bearing tribute.',
    'On guiwei day Rouran sent envoys with tribute.',
  ],
  s0382: [
    'In the fifth month, day jiaxu, Wei sent envoys on a friendly mission.',
    'On jiaxu day in the fifth month Wei sent envoys on a friendly visit.',
  ],
  s0383: [
    'In the seventh month of autumn, day jiwei, Prince of Yueyang Cha, governor of Southern Langye and Pengcheng commanderies, was made East Yangzhou inspector.',
    'On jiwei day in the seventh month of autumn Prince of Yueyang Cha, governor of Southern Langye and Pengcheng, was made inspector of East Yangzhou.',
  ],
  s0384: [
    'On day guihai, an edict proclaimed general amnesty on account of Li Yin, a convict of the Eastern Smelterworks, who had surrendered a true-form relic of the Tathagata.',
    'On guihai day an edict granted general amnesty because Li Yin, a convict of the Eastern Smelterworks, had surrendered a true-form relic of the Tathagata.',
  ],
  s0385: [
    'In the eighth month, day jiachen, an edict said: "The twelve provinces—South Yanzhou, North Xuzhou, West Xuzhou, East Xuzhou, Qing, Ji, North and South Qing, Wu, Ren, Tong, and Sui—having suffered famine, shall receive partial amnesty of overdue rents and old debts; do not collect this year\'s three levies."',
    'On jiachen day in the eighth month an edict said, "The twelve provinces—South Yanzhou, North Xuzhou, West Xuzhou, East Xuzhou, Qing, Ji, North and South Qing, Wu, Ren, Tong, and Sui—having endured famine, are granted partial amnesty of overdue rents and old debts; this year\'s three levies are not to be collected."',
  ],
  s0386: [
    'In the twelfth month of winter, day dinghai, Adjunct National University Tutor Huang Kan submitted his fifty-volume Exegesis of the Record of Rites.',
    'On dinghai day in the twelfth month of winter Adjunct National University Tutor Huang Kan submitted his fifty-volume Exegesis of the Record of Rites.',
  ],
  s0387: [
    'In the fifth year, spring, first month, day yimao, Guard Army General Prince of Luling Xu was made Flying Cavalry General with open office and third-rank ceremonial parity; Right Pacification General and Left Vice Director of the Masters of Writing Xiao Yuanzao was made Central Guard General with open office and third-rank ceremonial parity.',
    'On yimao day in the first month of spring, year 5, Guard Army General Prince of Luling Xu was made Flying Cavalry General with an open office and third-rank ceremonial parity, and Right Pacification General Xiao Yuanzao, Left Vice Director of the Masters of Writing, was made Central Guard General with an open office and third-rank ceremonial parity.',
  ],
  s0388: [
    'Central Authority General and Danyang governor He Jingrong was made Director of the Masters of Writing under his former title; Minister of Personnel Zhang Zuan became Vice Director of the Masters of Writing; Minister of Justice Liu Ru became Minister of Personnel.',
    'Central Authority General He Jingrong, governor of Danyang, was made Director of the Masters of Writing under his former title; Minister of Personnel Zhang Zuan became Vice Director of the Masters of Writing; and Minister of Justice Liu Ru became Minister of Personnel.',
  ],
  s0389: [
    'On day dingsi, Censor-in-Chief He Chen, participating in ritual affairs, memorialized: "For the southern and northern suburban rites and the going and coming of the sacred-field plowing, the imperial carriage should be used; the ceremonial chariot should no longer be used.',
    'On dingsi day Censor-in-Chief He Chen, who shared charge of ritual affairs, memorialized, "For the southern and northern suburban rites and the going and coming of the sacred-field plowing, the imperial carriage should be used, and the ceremonial chariot should no longer be used.',
  ],
  s0390: [
    'For both suburban rites use the plain carriage; for the sacred field use the regular carriage going and coming; in both cases let an attendant-in-ordinary ride as companion; suspend the grand general and grand marshal of stud posts."',
    'For both suburban rites use the plain carriage; for the sacred field use the regular carriage both ways; in both cases let an attendant-in-ordinary ride as companion; and suspend the grand general and grand marshal of stud posts."',
  ],
  s0391: [
    'An edict referred the matter to the Masters of Writing for broad deliberation and implementation.',
    'An edict sent the matter to the Masters of Writing for broad deliberation and implementation.',
  ],
  s0392: [
    'The plain carriage was renamed the Datong Carriage.',
    'The plain carriage was given the name Datong Carriage.',
  ],
  s0393: [
    'For bright hall ancestral rites the jade carriage was used.',
    'For bright hall ancestral rites the jade carriage was to be used.',
  ],
  s0394: [
    'On day xinwei, the imperial carriage personally sacrificed at the Southern Suburb; an edict granted one rank of nobility to filial and diligent farmers and to those called good men in provinces, districts, and village groups, and ordered local offices to report them promptly.',
    'On xinwei day the emperor sacrificed at the Southern Suburb in person; an edict granted one rank of nobility to filial and diligent farmers and to those called good men in provinces, districts, and village groups, and ordered local offices to report them without delay.',
  ],
  s0395: [
    'In the third month, day jiwei, an edict said: "My four listeners are lacking, my five perceptions often obscured; approved memorials go out and errors may occur.',
    'On jiwei day in the third month an edict said, "My four listeners are lacking and my five perceptions often clouded; approved memorials go out from court and mistakes may follow.',
  ],
  s0396: [
    'All policy inconvenient to the people—province, commandery, and county must speak at once; no concealment.',
    'Whatever policy harms the people, province, commandery, and county must speak at once; nothing may be hidden.',
  ],
  s0397: [
    'If grievances arise, local officials bear the blame.',
    'If grievances arise, the officials of that region bear the fault.',
  ],
  s0398: [
    'From now on, this is the permanent standard."',
    'From this day forward, let this be the lasting rule."',
  ],
  s0399: [
    'In the seventh month of autumn, day jimao, Flying Cavalry General Prince of Luling Xu, with open office and third-rank ceremonial parity, was made Jingzhou inspector; Prince Yi of Xiangdong was made Guard Army General and Right Pacification General.',
    'On jimao day in the seventh month of autumn Flying Cavalry General Prince of Luling Xu, with an open office and third-rank ceremonial parity, was made inspector of Jingzhou, and Prince Yi of Xiangdong was made Guard Army General and Right Pacification General.',
  ],
  s0400: [
    'In the eighth month, day yiyou, Funan sent envoys bearing live rhinoceros and tribute.',
    'On yiyou day in the eighth month Funan sent envoys with a live rhinoceros and other tribute.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_003_b4.mjs <translation.json>'
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
