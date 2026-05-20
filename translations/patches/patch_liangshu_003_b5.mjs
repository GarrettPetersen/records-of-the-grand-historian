#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'In the ninth month, day gengshen, Director of the Court of Judicature Dao Gai was made Minister of Personnel.',
    'On gengshen day in the ninth month, Director of the Court of Judicature Dao Gai was made Minister of Personnel.',
  ],
  s0402: [
    'In the eleventh month of winter, day yihai, Wei sent envoys on a friendly visit.',
    'On yihai day in the eleventh month of winter, Wei sent envoys on a friendly visit.',
  ],
  s0403: [
    'In the twelfth month, day guiwei, Wu commandery grand administrator Xie Ju was made Supervisor of the Palace Secretariat; the newly appointed Palace Secretariat Director Prince of Poyang Fan was made Central Guard General.',
    'On guiwei day in the twelfth month, Wu commandery grand administrator Xie Ju was made Supervisor of the Palace Secretariat, and the newly appointed Palace Secretariat Director Prince of Poyang Fan was made Central Guard General.',
  ],
  s0404: [
    'In year 6, spring, first month, gengxu new moon, a partial amnesty was granted for Si, Yu, Xu, and Yan provinces.',
    'On the gengxu new moon of the first month in spring, year 6, Si, Yu, Xu, and Yan provinces received a partial amnesty.',
  ],
  s0405: [
    'In the second month, day jihai, the imperial carriage personally plowed the sacred field.',
    'On jihai day in the second month the emperor plowed the sacred field in person.',
  ],
  s0406: [
    'On bingwu, Prince of Shaoling Lun, Jiangzhou inspector, was made General Who Pacifies the West and Yingzhou inspector; Cloud-Banner General Prince of Yuzhang Huan was made Jiangzhou inspector.',
    'On bingwu day Prince of Shaoling Lun, inspector of Jiangzhou, became General Who Pacifies the West and inspector of Yingzhou, and Cloud-Banner General Prince of Yuzhang Huan became inspector of Jiangzhou.',
  ],
  s0407: [
    'Qin commandery presented one white deer.',
    'Qin commandery presented a white deer.',
  ],
  s0408: [
    'In the fourth month of summer, day guiwei, an edict said: "Fated rulers who rise in their age inherit the worthy and pass down their enterprise; their fame does not perish, yet generations pass away. The two guest houses receive rank, the three respectful houses stand by obligation; as time recedes, old graves grow over with weeds, and gazing back at antiquity fills the heart with sorrow.',
    'On guiwei day in the fourth month of summer an edict said, "Fated kings inherit the worthy and pass down their work; fame endures, yet generations turn. The two guest houses receive rank, the three respectful houses stand by obligation; as time recedes, old tombs grow over with weeds, and looking back at antiquity fills the heart with sorrow.',
  ],
  s0409: [
    'The tombs of the Jin, Song, and Qi dynasties—wherever officials are assigned, let them diligently guard against wanton damage by common people.',
    'The tombs of Jin, Song, and Qi—wherever officials are assigned, let them guard diligently and not allow common people to damage them at will.',
  ],
  s0410: [
    'Where guard troops are too few, send reinforcements to fill the ranks.',
    'Where there are too few guard troops, send reinforcements to fill the ranks.',
  ],
  s0411: [
    'Where there were no watchers before, allot them in due measure."',
    'Where there were no watchers before, allot them in due measure."',
  ],
  s0412: [
    'In the fifth month, day wuyin, former Qing and Ji province inspector Yuan Luo was made Right Grand Master of Brilliant Happiness.',
    'On wuyin day in the fifth month, former Qing and Ji province inspector Yuan Luo was made Right Grand Master of Brilliant Happiness.',
  ],
  s0413: [
    'On jimao, the King of Henan sent envoys presenting horses and local products.',
    'On jimao day the King of Henan sent envoys with horses and local products.',
  ],
  s0414: [
    'In the sixth month, day dingwei, Pingyang county presented one white deer.',
    'On dingwei day in the sixth month, Pingyang county presented a white deer.',
  ],
  s0415: [
    'In the seventh month of autumn, day dinghai, Wei sent envoys on a friendly visit.',
    'On dinghai day in the seventh month of autumn, Wei sent envoys on a friendly visit.',
  ],
  s0416: [
    'In the eighth month, day wuwu, a general amnesty was granted for the empire.',
    'On wuwu day in the eighth month the empire received a general amnesty.',
  ],
  s0417: [
    'On xinwei, an edict said: "To govern a state there is a proper form, and one must consult the court; hence the Masters of Writing have director, vice-director, aide, and clerk, who attend court each morning to deliberate affairs of the day, consider them together, and then report upward.',
    'On xinwei day an edict said, "Governing a state has its proper form, and one must consult the court; hence the Masters of Writing have director, vice-director, aide, and clerk, who attend court each morning to deliberate the day\'s affairs, consider them together, and then report upward.',
  ],
  s0418: [
    'Lately this has not been so; whenever a doubtful matter arises, officials merely stand waiting for a decision.',
    'Lately this has not been so; whenever a doubtful matter arises, officials merely stand waiting for a decision.',
  ],
  s0419: [
    'The ancients said that unless the ruler is Yao or Shun, how can every utterance be treated as infallible?',
    'The ancients said that unless the ruler is Yao or Shun, how can every utterance be treated as infallible?',
  ],
  s0420: [
    'Thus even the sage Emperor Yao consulted the Four Peaks, and the wise Emperor Shun relied on many advisors.',
    'Thus even the sage Emperor Yao consulted the Four Peaks, and the wise Emperor Shun relied on many advisors.',
  ],
  s0421: [
    'How could someone of my limited virtue presume to decide alone?',
    'How could someone of my limited virtue decide alone?',
  ],
  s0422: [
    'From now on, whenever the Masters of Writing encounter doubtful matters, they must first deliberate in the court hall and then report upward—this must not become mere routine.',
    'From now on, whenever the Masters of Writing encounter doubtful matters, they must first deliberate in the court hall and then report upward—this must not become mere routine.',
  ],
  s0423: [
    'Urgent military matters requiring prior consultation will follow established precedent."',
    'Urgent military matters requiring prior consultation will follow established precedent."',
  ],
  s0424: [
    'Panpan sent envoys bearing tribute.',
    'Panpan sent envoys with tribute.',
  ],
  s0425: [
    'In the ninth month, An province was moved to Dingyuan commandery under Northern Xu province\'s supervision, and Dingyuan commandery was reassigned to An province.',
    'In the ninth month An province was moved to Dingyuan commandery under Northern Xu province\'s supervision, and Dingyuan commandery was reassigned to An province.',
  ],
  s0426: [
    'Shi Commandery grand administrator Cui Shuo reported one stalk of auspicious grain with twelve ears.',
    'Shi commandery grand administrator Cui Shuo reported a stalk of auspicious grain with twelve ears.',
  ],
  s0427: [
    'On wuxu, Special Advancement, Left Grand Master of Brilliant Happiness, and Minister of Works Yuan Ang died.',
    'On wuxu day Special Advancement Yuan Ang, Left Grand Master of Brilliant Happiness and Minister of Works, died.',
  ],
  s0428: [
    'In the eleventh month of winter, day jimao, the capital received a partial amnesty.',
    'On jimao day in the eleventh month of winter the capital received a partial amnesty.',
  ],
  s0429: [
    'In the twelfth month, day renzi, Prince of Yuzhang Huan, Jiangzhou inspector, died.',
    'On renzi day in the twelfth month Prince of Yuzhang Huan, inspector of Jiangzhou, died.',
  ],
  s0430: [
    'General Who Protects the Army Prince of Xiangdong Yi was made General Who Guards the South and Jiangzhou inspector.',
    'General Who Protects the Army Prince of Xiangdong Yi was made General Who Guards the South and inspector of Jiangzhou.',
  ],
  s0431: [
    'Gui province was established at Shi\'an in Xiang province under Xiang province\'s supervision;',
    'Gui province was established at Shi\'an in Xiang province under Xiang province\'s supervision;',
  ],
  s0432: [
    'twenty-four southern Guilin commanderies were abolished and all reassigned to Gui province.',
    'twenty-four southern Guilin commanderies were abolished and all reassigned to Gui province.',
  ],
  s0433: [
    'In year 7, spring, first month, day xinsi, the imperial carriage personally sacrificed at the Southern Suburb; a general amnesty was granted for the empire; those displaced or who had lost their ancestral lands were each permitted to return to their fields and homes, with taxes remitted for five years.',
    'On xinsi day in the first month of spring, year 7, the emperor sacrificed at the Southern Suburb in person, proclaimed a general amnesty, and allowed the displaced and those who had lost ancestral lands to return to their fields and homes with five years of tax remission.',
  ],
  s0434: [
    'On xinchou, the imperial carriage personally sacrificed at the Bright Hall.',
    'On xinchou day the emperor sacrificed at the Bright Hall in person.',
  ],
  s0435: [
    'In the second month, day yisi, Acting King of Dangchang Liang Mitai was made General Who Pacifies the West, inspector of He and Liang provinces, and King of Dangchang.',
    'On yisi day in the second month Acting King of Dangchang Liang Mitai was made General Who Pacifies the West, inspector of He and Liang provinces, and King of Dangchang.',
  ],
  s0436: [
    'On xinhai, the imperial carriage personally plowed the sacred field.',
    'On xinhai day the emperor plowed the sacred field in person.',
  ],
  s0437: [
    'On yimao, the capital was shaken by an earthquake.',
    'On yimao day the capital was shaken by an earthquake.',
  ],
  s0438: [
    'On dingsi, Central Guard General Prince of Poyang Fan was made General Who Guards the North and Yong province inspector.',
    'On dingsi day Central Guard General Prince of Poyang Fan was made General Who Guards the North and inspector of Yong province.',
  ],
  s0439: [
    'In the third month, day yihai, the King of Dangchang sent envoys presenting horses and local products.',
    'On yihai day in the third month the King of Dangchang sent envoys with horses and local products.',
  ],
  s0440: [
    'Goguryeo, Baekje, and Huaguo each sent envoys bearing tribute.',
    'Goguryeo, Baekje, and Huaguo each sent envoys with tribute.',
  ],
  s0441: [
    'In the fourth month of summer, day wushen, Wei sent envoys on a friendly visit.',
    'On wushen day in the fourth month of summer, Wei sent envoys on a friendly visit.',
  ],
  s0442: [
    'In the fifth month, day guisi, Palace Attendant Prince of Nankang Huili was made concurrent commander of the guard.',
    'On guisi day in the fifth month Palace Attendant Prince of Nankang Huili was made concurrent commander of the guard.',
  ],
  s0443: [
    'In the ninth month of autumn, day wuyin, Rouran sent envoys bearing tribute.',
    'On wuyin day in the ninth month of autumn Rouran sent envoys with tribute.',
  ],
  s0444: [
    'In the tenth month of winter, day bingwu, Palace Attendant Liu Ru was made Minister of Personnel.',
    'On bingwu day in the tenth month of winter Palace Attendant Liu Ru was made Minister of Personnel.',
  ],
  s0445: [
    'In the eleventh month, day bingzi, an edict halted the conscription of women for corvée labor wherever they were employed.',
    'On bingzi day in the eleventh month an edict halted the conscription of women for corvée labor wherever they were employed.',
  ],
  s0446: [
    'On dingchou, an edict said: "When the people are too fortunate, the state suffers misfortune; repeated acts of grace only prolong theft and fraud—I know this is a sickness.',
    'On dingchou day an edict said, "When the people are too fortunate, the state suffers misfortune; repeated acts of grace only prolong theft and fraud—I know this is a sickness.',
  ],
  s0447: [
    'Yet if I do not grant further amnesty, that is not the heart of a benevolent man.',
    'Yet if I do not grant further amnesty, that is not the heart of a benevolent man.',
  ],
  s0448: [
    'All unpaid taxes and deficits owed before dawn on the ninth day of the eleventh month of year 7—whatever amount among the people—when reported to the Masters of Writing, and whatever remains uncollected by the supervising offices, shall all be forgiven and remitted.',
    'All unpaid taxes and deficits owed before dawn on the ninth day of the eleventh month of year 7—whatever amount among the people—when reported to the Masters of Writing, and whatever remains uncollected by the supervising offices, shall all be forgiven and remitted.',
  ],
  s0449: [
    '" Another edict said: "To use Heaven\'s way and divide Earth\'s benefits—this is the instruction of the ancient sages.',
    '" Another edict said, "To use Heaven\'s way and divide Earth\'s benefit—this is the instruction of the ancient sages.',
  ],
  s0450: [
    'All abandoned fields and homesteads seized by the state, beyond what the government itself develops, shall all be distributed to the poor, each receiving land in measure of his capacity.',
    'All abandoned fields and homesteads seized by the state, beyond what the government itself develops, shall all be distributed to the poor, each receiving land in measure of his capacity.',
  ],
  s0451: [
    'I have heard that lately powerful houses and wealthy families have widely seized public fields, renting them at high rates to the poor—a practice that harms the times and damages governance, a pestilence beyond measure.',
    'I have heard that lately powerful houses and wealthy families have widely seized public fields, renting them at high rates to the poor—a practice that harms the times and damages governance, a pestilence beyond measure.',
  ],
  s0452: [
    'From now on public fields may in no case be leased to powerful families;',
    'From now on public fields may in no case be leased to powerful families;',
  ],
  s0453: [
    'those already leased are specially permitted not to be pursued for recovery.',
    'those already leased are specially permitted not to be pursued for recovery.',
  ],
  s0454: [
    'Where wealthy households supply seed and grain to share cultivation with the poor, that is not within the prohibition."',
    'Where wealthy households supply seed and grain to share cultivation with the poor, that is not within the prohibition."',
  ],
  s0455: [
    'On jichou, Grand Master for Golden Seal and Purple Sash Zang Dun was made Commander of the Guard.',
    'On jichou day Grand Master for Golden Seal and Purple Sash Zang Dun was made Commander of the Guard.',
  ],
  s0456: [
    'In the twelfth month, day renyin, an edict said: "The ancients said that to lose even one thing is like falling into a moat—hardly an exaggeration.',
    'On renyin day in the twelfth month an edict said, "The ancients said that to lose even one thing is like falling into a moat—hardly an exaggeration.',
  ],
  s0457: [
    'I have long chilled my heart and emptied my resolve; at meals I set down my chopsticks, at sleep I rise from my pillow, sitting alone in worry, indignant until dawn—not for one man alone, but for the myriad people.',
    'I have long chilled my heart and emptied my resolve; at meals I set down my chopsticks, at sleep I rise from my pillow, sitting alone in worry, indignant until dawn—not for one man alone, but for the myriad people.',
  ],
  s0458: [
    'Provincial governors are often not men of talent; local magistrates are tigers given wings—Yang Fu was thus aggrieved, Jia Yi thus moved to tears.',
    'Provincial governors are often not men of talent; local magistrates are tigers given wings—Yang Fu was thus aggrieved, Jia Yi thus moved to tears.',
  ],
  s0459: [
    'Among the people exactions multiply endlessly: some supply kitchen expenses, some stable and treasury costs, some entertain envoys, some host guests—all without personal expense, drawing everything from the populace.',
    'Among the people exactions multiply endlessly: some supply kitchen expenses, some stable and treasury costs, some entertain envoys, some host guests—all without personal expense, drawing everything from the populace.',
  ],
  s0460: [
    'Patrol forces are also widely dispatched under the pretext of blocking bandits, yet theft continues and violent plunder increases—demanding provisions, demanding porter fees.',
    'Patrol forces are also widely dispatched under the pretext of blocking bandits, yet theft continues and violent plunder increases—demanding provisions, demanding porter fees.',
  ],
  s0461: [
    'They also permit robbery among themselves, mutually extorting until common people\'s lives are exhausted and wealthy households ruined.',
    'They also permit robbery among themselves, mutually extorting until common people\'s lives are exhausted and wealthy households ruined.',
  ],
  s0462: [
    'This breeds resentment and cruelty—not in one matter alone.',
    'This breeds resentment and cruelty—not in one matter alone.',
  ],
  s0463: [
    'Though repeatedly forbidden, it persists; outer offices must investigate openly and report each case as it arises.',
    'Though repeatedly forbidden, it persists; outer offices must investigate openly and report each case as it arises.',
  ],
  s0464: [
    'Furthermore, private relay stations, military colonies, hostel inns, and ironworks—even monasteries and nunneries—within their boundaries should only guard according to limits;',
    'Furthermore, private relay stations, military colonies, hostel inns, and ironworks—even monasteries and nunneries—within their boundaries should only guard according to limits;',
  ],
  s0465: [
    'yet many overextend their enclosures, dividing waterways and land to block fishing and firewood gathering, leaving common people nowhere to turn.',
    'yet many overextend their enclosures, dividing waterways and land to block fishing and firewood gathering, leaving common people nowhere to turn.',
  ],
  s0466: [
    'From now on, whoever oversteps boundaries in blocking access shall himself be punished by military law.',
    'From now on, whoever oversteps boundaries in blocking access shall himself be punished by military law.',
  ],
  s0467: [
    'On government-developed lands within the public domain, none may arbitrarily establish private colonies competing with the state for profit.',
    'On government-developed lands within the public domain, none may arbitrarily establish private colonies competing with the state for profit.',
  ],
  s0468: [
    'Gathering firewood for cooking must not be forbidden.',
    'Gathering firewood for cooking must not be forbidden.',
  ],
  s0469: [
    'Fishing and hunting likewise must not be interrogated.',
    'Fishing and hunting likewise must not be interrogated.',
  ],
  s0470: [
    'Whoever does not comply shall be punished by death."',
    'Whoever does not comply shall be punished by death."',
  ],
  s0471: [
    'Wei sent envoys on a friendly visit.',
    'Wei sent envoys on a friendly visit.',
  ],
  s0472: [
    'On bingchen, the Scholar Grove Hall was established west of the palace to gather scholars.',
    'On bingchen day the Scholar Grove Hall was established west of the palace to gather scholars.',
  ],
  s0473: [
    'That year, Jiao province native Li Bin attacked Inspector Xiao Zi; Zi paid bribes and fled back to Yue province.',
    'That year Jiao province native Li Bin attacked Inspector Xiao Zi; Zi paid bribes and fled back to Yue province.',
  ],
  s0474: [
    'In spring of year 8, first month, Liu Jinggong of Ancheng commandery, wielding heterodox arts, rebelled; Administrator Xiao Shuo abandoned the commandery and fled east; Jinggong seized the commandery, attacked Luling, took Yuzhang, and his demonic faction swelled to tens of thousands, pressing toward Xingan and Chaisang.',
    'In the first month of spring, year 8, Liu Jinggong of Ancheng commandery, wielding heterodox arts, rebelled; Administrator Xiao Shuo abandoned the commandery and fled east; Jinggong seized the commandery, attacked Luling, took Yuzhang, and his demonic faction swelled to tens of thousands, pressing toward Xingan and Chaisang.',
  ],
  s0475: [
    'In the second month, day wuxu, Prince of Xiangdong Yi, Jiangzhou inspector, sent Central Army Cao Ziye to suppress them.',
    'On wuxu day in the second month Prince of Xiangdong Yi, inspector of Jiangzhou, sent Central Army Cao Ziye to suppress them.',
  ],
  s0476: [
    'In the third month, day wuchen, he thoroughly defeated them; Jinggong was captured and sent to the capital, beheaded at Jiankang market.',
    'On wuchen day in the third month he thoroughly defeated them; Jinggong was captured and sent to the capital and beheaded at Jiankang market.',
  ],
  s0477: [
    'That month, Songping garrison was established at Xincai and Gaotang in Jiangzhou to reclaim barbarian lands.',
    'That month Songping garrison was established at Xincai and Gaotang in Jiangzhou to reclaim barbarian lands.',
  ],
  s0478: [
    'Yue province Inspector Chen Hou, Luo province Inspector Ning Ju, An province Inspector Li Zhi, and Ai province Inspector Ruan Han jointly marched against Li Bin in Jiao province.',
    'Yue province inspector Chen Hou, Luo province inspector Ning Ju, An province inspector Li Zhi, and Ai province inspector Ruan Han jointly marched against Li Bin in Jiao province.',
  ],
  s0479: [
    'In the intercalary first month of spring, year 9, day bingchen, an earthquake occurred and hair grew from the ground.',
    'On bingchen day in the intercalary first month of spring, year 9, an earthquake occurred and hair grew from the ground.',
  ],
  s0480: [
    'In the second month, day jiaxu, thirty Jiangzhou households were required to furnish one slave household, sent to Si province.',
    'On jiaxu day in the second month, thirty Jiangzhou households were required to furnish one slave household, sent to Si province.',
  ],
  s0481: [
    'In the third month, Grand Tutor of the Heir Apparent Xie Ju was made Vice Director of the Masters of Writing.',
    'In the third month Grand Tutor of the Heir Apparent Xie Ju was made Vice Director of the Masters of Writing.',
  ],
  s0482: [
    'In the fourth month of summer, the King of Linyi broke Dez prefecture and attacked Li Bin; Bin\'s general Fan Xiu then defeated the King of Linyi at Jiude, and the King of Linyi fled in defeat.',
    'In the fourth month of summer the King of Linyi broke Dez prefecture and attacked Li Bin; Bin\'s general Fan Xiu then defeated the King of Linyi at Jiude, and the King of Linyi fled in defeat.',
  ],
  s0483: [
    'In the eleventh month of winter, day xinchou, General Who Pacifies the West Prince of Wuling Ji, Yi province inspector, was promoted to General Who Conquers the West with open office and ceremonial parity of the Three Dignities.',
    'On xinchou day in the eleventh month of winter General Who Pacifies the West Prince of Wuling Ji, inspector of Yi province, was promoted to General Who Conquers the West with an open office and ceremonial parity of the Three Dignities.',
  ],
  s0484: [
    'In the twelfth month, day renxu, Commander of the Guard Zang Dun died;',
    'On renxu day in the twelfth month Commander of the Guard Zang Dun died;',
  ],
  s0485: [
    'Light Chariots General Prince of Hedong Yu was made Commander of the Guard.',
    'Light Chariots General Prince of Hedong Yu was made Commander of the Guard.',
  ],
  s0486: [
    'In spring of year 10, first month, Li Bin usurped title and office in Jiaozhi, appointing officials.',
    'In the first month of spring, year 10, Li Bin usurped title and office in Jiaozhi, appointing officials.',
  ],
  s0487: [
    'In the third month, day jiawu, the imperial carriage visited Lanling and paid respects at Jianning tomb.',
    'On jiawu day in the third month the emperor visited Lanling and paid respects at Jianning tomb.',
  ],
  s0488: [
    'On xinchou, he reached Xiuling.',
    'On xinchou day he reached Xiuling.',
  ],
  s0489: [
    'On renyin, an edict said: "I have been away from my homeland more than fifty years; ever turning my gaze eastward, not a day passes without longing.',
    'On renyin day an edict said, "I have been away from my homeland more than fifty years; ever turning my gaze eastward, not a day passes without longing.',
  ],
  s0490: [
    'Now the four quarters come in submission, the outer seas are bounded, lawsuits grow simpler, and state affairs are somewhat at ease—only now have I been able to pay reverence at the imperial tombs, yet my grief only deepens.',
    'Now the four quarters come in submission, the outer seas are bounded, lawsuits grow simpler, and state affairs are somewhat at ease—only now have I been able to pay reverence at the imperial tombs, yet my grief only deepens.',
  ],
  s0491: [
    'Elders of my old home arrived in succession from afar, their faces eager as if returning to a father; I should have means to comfort their hearts.',
    'Elders of my old home arrived in succession from afar, their faces eager as if returning to a father; I should have means to comfort their hearts.',
  ],
  s0492: [
    'All are granted one rank of nobility and additional gifts.',
    'All are granted one rank of nobility and additional gifts.',
  ],
  s0493: [
    'The counties and districts passed through shall not levy this year\'s land tax.',
    'The counties and districts passed through shall not levy this year\'s land tax.',
  ],
  s0494: [
    'Those indebted for corvée labor at the supervisory offices shall be remitted for two years.',
    'Those indebted for corvée labor at the supervisory offices shall be remitted for two years.',
  ],
  s0495: [
    'All inner and outer attendants, army commanders, and personal attendants shall receive graded gifts of money and grain."',
    'All inner and outer attendants, army commanders, and personal attendants shall receive graded gifts of money and grain."',
  ],
  s0496: [
    'Thereupon he composed the poem "Returning to the Old Homeland."',
    'Thereupon he composed the poem "Returning to the Old Homeland."',
  ],
  s0497: [
    'On guimao, an edict said: "The officials of the imperial tombs, reverent in service and diligent in labor, are all granted one rank of nobility and additional gifts."',
    'On guimao day an edict said, "The officials of the imperial tombs, reverent in service and diligent in labor, are all granted one rank of nobility and additional gifts."',
  ],
  s0498: [
    'On dingwei, Benevolent Might General Prince of Linchuan Zhengyi, South Xu province inspector, was promoted to General Who Pacifies the East.',
    'On dingwei day Benevolent Might General Prince of Linchuan Zhengyi, inspector of South Xu province, was promoted to General Who Pacifies the East.',
  ],
  s0499: [
    'On jiyou, he visited Beigu Tower north of Jingkou city and renamed it North Gazing.',
    'On jiyou day he visited Beigu Tower north of Jingkou city and renamed it North Gazing.',
  ],
  s0500: [
    'On gengxu, he visited Huibin Pavilion and feasted the elders of the imperial homeland and the welcoming crowds from nearby counties, young and old numbering several thousand; each received two thousand coins.',
    'On gengxu day he visited Huibin Pavilion and feasted the elders of the imperial homeland and the welcoming crowds from nearby counties, young and old numbering several thousand; each received two thousand coins.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_003_b5.mjs <translation.json>'
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
