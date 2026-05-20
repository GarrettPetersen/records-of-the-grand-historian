#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 3, Basic Annals 3',
    'Book of Liang, Volume 3, Annals 3',
  ],
  s0002: [
    'Emperor Wu, Part 3',
    'Emperor Wu, Lower Annals',
  ],
  s0003: [
    'In the first month of spring, first day yihai, year 1 of Putong, the reign title was changed and a general amnesty was proclaimed for the empire.',
    'On yihai, the first day of spring in Putong 1 (520 CE), the era name was changed and a general amnesty was declared.',
  ],
  s0004: [
    'Civil and military officials were granted rank for their labors; those showing filial piety and diligence in farming received one rank of nobility; especially poor households were exempted from regular levies; widowers, widows, orphans, and solitaries all received additional relief.',
    'Meritorious civil and military officials were rewarded with rank; filial and diligent farmers gained one noble rank; the poorest households were exempt from regular taxes; widowers, widows, orphans, and the alone received extra relief.',
  ],
  s0005: [
    'On bingzi, there was a solar eclipse.',
    'On bingzi day there was a solar eclipse.',
  ],
  s0006: [
    'On jimao, Prince of Linchuan Hong, Minister over the Masses, was made Grand Commandant and Yangzhou Inspector; General Who Pacifies the Right and Supervisor of Yangzhou Xiao Jing was made General Who Pacifies the West and Yingzhou Inspector.',
    'On jimao, Minister over the Masses and Prince of Linchuan Hong became Grand Commandant and Yangzhou inspector; General Who Pacifies the Right Xiao Jing, supervisor of Yangzhou, became General Who Pacifies the West and Yingzhou inspector.',
  ],
  s0007: [
    'Wang Dan, Left Vice Director of the Masters of Writing, left office on account of his mother\'s mourning; Jinzi-guanglu Grand Master Wang Fen was made Left Vice Director of the Masters of Writing.',
    'Left Vice Director Wang Dan resigned for mourning; Jinzi-guanglu Grand Master Wang Fen replaced him as Left Vice Director of the Masters of Writing.',
  ],
  s0008: [
    'On gengzi, Funan and Goguryeo each sent envoys presenting tribute goods.',
    'On gengzi, Funan and Goguryeo each sent envoys with tribute.',
  ],
  s0009: [
    'In the second month, on renzi, the Old Man Star appeared.',
    'In the second month, on renzi, the Old Man Star was seen.',
  ],
  s0010: [
    'On guichou, Goguryeo crown prince An was made General Who Pacifies the East and King of Goguryeo.',
    'On guichou, Goguryeo crown prince An was made General Who Pacifies the East and king of Goguryeo.',
  ],
  s0011: [
    'In the third month, on bingxu, the state of Huaguo sent envoys presenting tribute goods.',
    'In the third month, on bingxu, Huaguo sent envoys with tribute.',
  ],
  s0012: [
    'In summer, the fourth month, on jiawu, the King of Henan sent envoys presenting tribute goods.',
    'In the fourth month of summer, on jiawu, the King of Henan sent envoys with tribute.',
  ],
  s0013: [
    'In the sixth month, on dingwei, Protector of the Army General Wei Rui was made General of Chariots and Cavalry.',
    'In the sixth month, on dingwei, Protector of the Army Wei Rui was promoted to General of Chariots and Cavalry.',
  ],
  s0014: [
    'In autumn, the seventh month, on jimao, the Yangtze, Huai, and sea all overflowed together.',
    'In the seventh month of autumn, on jimao, the Yangtze, Huai, and the coast all flooded at once.',
  ],
  s0015: [
    'On xinmao, General of Trustworthy Might Prince of Shaoling Lun was made Jiangzhou Inspector.',
    'On xinmao, General of Trustworthy Might and Prince of Shaoling Lun was made Jiangzhou inspector.',
  ],
  s0016: [
    'In the eighth month, on gengxu, the Old Man Star appeared.',
    'In the eighth month, on gengxu, the Old Man Star was seen.',
  ],
  s0017: [
    'On jiazi, the newly appointed General of Chariots and Cavalry Wei Rui died.',
    'On jiazi, the newly appointed General of Chariots and Cavalry Wei Rui died.',
  ],
  s0018: [
    'In the ninth month, on yihai, a morning star appeared in the east, its light blazing like fire.',
    'In the ninth month, on yihai, a morning star appeared in the east, blazing like fire.',
  ],
  s0019: [
    'In winter, the tenth month, on xinhai, General Who Proclaims Grace Prince of Changsha Shenye was made Protector of the Army General.',
    'In the tenth month of winter, on xinhai, General Who Proclaims Grace and Prince of Changsha Shenye was made Protector of the Army.',
  ],
  s0020: [
    'On xinyou, Intendant of Danyang Prince of Jin\'an Gang was made General Who Pacifies the West and Yizhou Inspector.',
    'On xinyou, Danyang intendant and Prince of Jin\'an Gang was made General Who Pacifies the West and Yizhou inspector.',
  ],
  s0021: [
    'In the first month of spring, year 2, on jiaxu, South Xuzhou Inspector Prince of Yuzhang Zong was made General Who Guards the Right.',
    'In spring of year 2, on jiaxu, South Xuzhou inspector and Prince of Yuzhang Zong was made General Who Guards the Right.',
  ],
  s0022: [
    'The newly appointed Yizhou Inspector Prince of Jin\'an Gang was changed to Xuzhou Inspector.',
    'The newly appointed Yizhou inspector, Prince of Jin\'an Gang, was reassigned as Xuzhou inspector.',
  ],
  s0023: [
    'On xinsi, the imperial carriage personally performed sacrifice at the Southern Suburbs.',
    'On xinsi, the emperor personally sacrificed at the Southern Suburbs.',
  ],
  s0024: [
    'An edict said: "The spring office governs the qi—reverently and respectfully making offering in return; earthen vessels and gourds express sincerity, the azure bi completes the rite; my thoughts follow Heaven\'s covering, spreading this nourishing care.',
    'An edict said, "The spring office governs the vital breath; with reverent offering I return thanks—earthen vessels and gourds show sincerity, the azure bi completes the rite; my thoughts follow Heaven\'s shelter, spreading this care for all.',
  ],
  s0025: [
    'All among the people who are solitary elderly or orphaned young and cannot support themselves—the responsible officials in commanderies and counties shall all take them in for rearing, provide clothing and food, ensuring full sufficiency each time until the end of their lives.',
    'Any solitary elder or orphaned child who cannot support himself shall be taken in by the local commandery or county, given food and clothing in full measure, and cared for to the end of life.',
  ],
  s0026: [
    'Also at the capital a Garden for the Solitary and Alone was established—orphans and young have a home, white-haired elders do not lack.',
    'A Garden for the Solitary and Alone was also established at the capital, so orphans and young have a refuge and white-haired elders do not go wanting.',
  ],
  s0027: [
    'If they reach the end of their allotted span, generous arrangements shall be made.',
    'When they reach the end of their lives, generous arrangements are to be made.',
  ],
  s0028: [
    'Especially poor households shall not be charged rent and levies.',
    'The poorest households are exempt from rent and levies.',
  ],
  s0029: [
    '"On wuzi, a general amnesty was proclaimed for the empire.',
    'On wuzi, a general amnesty was proclaimed for the empire.',
  ],
  s0030: [
    'In the second month, on xinchou, the imperial carriage personally performed sacrifice at the Bright Hall.',
    'In the second month, on xinchou, the emperor personally sacrificed at the Bright Hall.',
  ],
  s0031: [
    'In the third month, on gengyin, heavy snow fell, three chi deep on level ground.',
    'In the third month, on gengyin, heavy snow piled three chi deep on level ground.',
  ],
  s0032: [
    'In summer, the fourth month, on yimao, the Northern and Southern Suburban altars were rebuilt.',
    'In the fourth month of summer, on yimao, the Northern and Southern Suburban altars were rebuilt.',
  ],
  s0033: [
    'On bingchen, an edict said: "Reverently conforming to August Heaven, the calendar and stars admit no deviation.',
    'On bingchen, an edict said, "Reverently conforming to August Heaven, the calendar and stars must not be violated.',
  ],
  s0034: [
    'Personally holding plow and hoe, exerting full strength in reverent offering, above harmonizing with the stellar birds, below instructing the people in the seasons, ordering the eastern labors in their ranks—the rite does not belong in the south.',
    'Personally holding plow and hoe and offering full reverence, harmonizing above with the stars and instructing below the people in the seasons, ordering the eastern labors in their ranks—the rite does not belong in the south.',
  ],
  s0035: [
    'Former ages followed precedent with deviation from ritual form; in the direction of Zhen one may select fertile wilds and prepare these thousand mu, that the old statutes may be fulfilled."',
    'Former ages followed precedent in ways that violated ritual; in the east one may select fertile land and prepare these thousand mu, so the old statutes may be fulfilled."',
  ],
  s0036: [
    'In the fifth month, on guimao, fire broke out in Wanyan Hall and spread to burn three thousand rooms of the rear palace.',
    'In the fifth month, on guimao, Wanyan Hall caught fire and the blaze spread through three thousand rooms of the rear palace.',
  ],
  s0037: [
    'On dingsi, an edict said: "Princes, dukes, and ministers—now submitting memorials congratulating us on auspicious omens—though this is the hundred officials\' sincere care for the state, in my heart there is much shame.',
    'On dingsi, an edict said, "Princes, dukes, and ministers now submit memorials congratulating us on auspicious omens; though this shows the hundred officials\' care for the state, I feel much shame.',
  ],
  s0038: [
    'If grace overflowed like springs and rivers, benevolence covered the moving and rooted, the qi harmonized like the jade measure, governance reached great peace, and auspicious blessings descended—then one might be without shame for virtue;',
    'If grace overflowed like springs, benevolence covered all living things, the seasons ran true, governance reached great peace, and blessings descended—then one might feel no shame;',
  ],
  s0039: [
    'but the way of governance has many gaps, pure transformation is not yet fixed—how then to look up and accord with the harmony of the stars, or reach far to the dark bestowal?',
    'but the way of governance has many gaps and pure custom is not yet fixed—how then can I accord with heavenly harmony or earn distant blessing?',
  ],
  s0040: [
    'This only makes my slightness more manifest and adds further to the fault.',
    'This only exposes my slightness and adds to the fault.',
  ],
  s0041: [
    'From now on congratulations on auspicious omens may cease."',
    'From now on, congratulations on auspicious omens are to cease."',
  ],
  s0042: [
    'In the sixth month, on dingmao, General of Trustworthy Might and Yizhou Inspector Wen Sengming rebelled with his province and went over to Wei.',
    'In the sixth month, on dingmao, General of Trustworthy Might and Yizhou inspector Wen Sengming rebelled and defected to Wei.',
  ],
  s0043: [
    'In autumn, the seventh month, on dingyou, Acting Chief Master of Construction Pei Su was given the credential and directed the massed armies in a northern campaign.',
    'In the seventh month of autumn, on dingyou, Acting Chief Master of Construction Pei Su was given command and directed the armies on a northern campaign.',
  ],
  s0044: [
    'On jiayin, the Old Man Star appeared.',
    'On jiayin, the Old Man Star was seen.',
  ],
  s0045: [
    'Wei\'s Jingzhou Inspector Huan Shuxing led his host in surrender.',
    'Wei\'s Jingzhou inspector Huan Shuxing surrendered with his forces.',
  ],
  s0046: [
    'In the eighth month, on dinghai, in Shigu village of Shiping commandery the ground opened by itself into a well, six chi six cun square and thirty-two zhang deep.',
    'In the eighth month, on dinghai, the ground in Shigu village, Shiping commandery, opened by itself into a well six chi six cun square and thirty-two zhang deep.',
  ],
  s0047: [
    'In winter, the eleventh month, Baekje and Silla each sent envoys presenting tribute goods.',
    'In the eleventh month of winter, Baekje and Silla each sent envoys with tribute.',
  ],
  s0048: [
    'In the twelfth month, on wuchen, Baekje King Yulong, General Who Guards the East, was made Grand General Who Pacifies the East.',
    'In the twelfth month, on wuchen, Baekje king Yulong, General Who Guards the East, was promoted to Grand General Who Pacifies the East.',
  ],
  s0049: [
    'In the first month of spring, year 3, on gengzi, Director of the Masters of Writing Yuan Ang was made Supervisor of the Masters of Writing; Wu commandery Administrator Wang Dan was made Left Vice Director of the Masters of Writing; Left Vice Director Wang Fen was made Right Grand Master of the Palace.',
    'In spring of year 3, on gengzi, Director of the Masters of Writing Yuan Ang became Supervisor of the Masters of Writing; Wu commandery administrator Wang Dan became Left Vice Director; Left Vice Director Wang Fen became Right Grand Master of the Palace.',
  ],
  s0050: [
    'On gengxu, the capital suffered an earthquake.',
    'On gengxu, the capital was shaken by an earthquake.',
  ],
  s0051: [
    'On jiwei, General Who Proclaims Resolution Prince of Luling Xu was made Yongzhou Inspector.',
    'On jiwei, General Who Proclaims Resolution and Prince of Luling Xu was made Yongzhou inspector.',
  ],
  s0052: [
    'In the third month, on yimao, Prince of Baling Xiao Ping died.',
    'In the third month, on yimao, Prince of Baling Xiao Ping died.',
  ],
  s0053: [
    'In summer, the fourth month, on dingmao, Prince of Ruyin Liu Duan died.',
    'In the fourth month of summer, on dingmao, Prince of Ruyin Liu Duan died.',
  ],
  s0054: [
    'In the fifth month, first day renchen, there was a solar eclipse; it ended.',
    'On renchen, the first day of the fifth month, there was a solar eclipse; when it ended,',
  ],
  s0055: [
    'On guisi, an amnesty was proclaimed for the empire.',
    'on guisi an amnesty was proclaimed for the empire.',
  ],
  s0056: [
    'Orders were also sent out to the four directions: the people\'s hardships were all to be reported at once; dukes, ministers, and the hundred officials were each to submit sealed memorials; regional inspectors and commanderies were to recommend worthy, upright, and plain-speaking men.',
    'Orders went out to the four directions: popular hardships were to be reported at once; officials were to submit sealed memorials; regional inspectors and commanderies were to recommend worthy, upright, and plain-speaking men.',
  ],
  s0057: [
    'In autumn, the eighth month, on xinyou, construction of the two suburban altars and the sacred field was completed, and craftsmen were rewarded in varying degrees.',
    'In the eighth month of autumn, on xinyou, the two suburban altars and the sacred field were completed, and craftsmen were rewarded in varying degrees.',
  ],
  s0058: [
    'On jiazi, the Old Man Star appeared.',
    'On jiazi, the Old Man Star was seen.',
  ],
  s0059: [
    'Bali and Baiti each sent envoys presenting tribute goods.',
    'Bali and Baiti each sent envoys with tribute.',
  ],
  s0060: [
    'In winter, the tenth month, on bingzi, Supervisor of the Masters of Writing Yuan Ang was additionally made Central Guard General.',
    'In the tenth month of winter, on bingzi, Supervisor of the Masters of Writing Yuan Ang was additionally made Central Guard General.',
  ],
  s0061: [
    'In the eleventh month, on jiawu, Pacification Army General, Bearer of the Staff with the Same Three Dignities as the Three Lords, and Army Inspector Prince of Shixing Dan died.',
    'In the eleventh month, on jiawu, Pacification Army General, Bearer of the Staff with ministerial honors, and Army Inspector Prince of Shixing Dan died.',
  ],
  s0062: [
    'On xinchou, Crown Prince\'s Household Director Xiao Yuanzao was made Army Inspector General.',
    'On xinchou, Crown Prince\'s Household Director Xiao Yuanzao was made Army Inspector.',
  ],
  s0063: [
    'In the first month of spring, year 4, on xinmao, the imperial carriage personally performed sacrifice at the Southern Suburbs and a general amnesty was proclaimed for the empire.',
    'In spring of year 4, on xinmao, the emperor personally sacrificed at the Southern Suburbs and proclaimed a general amnesty.',
  ],
  s0064: [
    'All who suffered extreme poverty or illness received relief; orders were sent out to the four directions, and lawsuits were promptly adjudicated.',
    'All who suffered extreme poverty or illness received relief; orders went out to the four directions and lawsuits were promptly heard.',
  ],
  s0065: [
    'On bingwu, the imperial carriage personally performed sacrifice at the Bright Hall.',
    'On bingwu, the emperor personally sacrificed at the Bright Hall.',
  ],
  s0066: [
    'In the second month, on gengwu, the Old Man Star appeared.',
    'In the second month, on gengwu, the Old Man Star was seen.',
  ],
  s0067: [
    'On yihai, he personally plowed the sacred field.',
    'On yihai, the emperor personally plowed the sacred field.',
  ],
  s0068: [
    'An edict said: "The meaning of plowing the sacred field is great indeed!',
    'An edict said, "The meaning of plowing the sacred field is great indeed!',
  ],
  s0069: [
    'Sacred grain rises from it, ritual form is thereby made manifest—ancient sage kings all used this practice.',
    'Sacred grain rises from it and ritual form is made manifest; ancient sage kings all used this practice.',
  ],
  s0070: [
    'Reflecting on the eight policies, reaching these thousand mu, dukes, ministers, and the hundred officials reverently performed the rites; the ninefold push completed the ceremony, fragrant offering unceasing.',
    'Reflecting on the eight policies at these thousand mu, dukes, ministers, and the hundred officials reverently performed the rites; the ninefold push completed the ceremony and the fragrant offering did not cease.',
  ],
  s0071: [
    'Moreover wind and cloud accorded with the pitch pipes, the qi-signs were bright and splendid; on reviewing this auspicious day, I think to add reward and encouragement.',
    'Moreover wind and cloud accorded with the pitch pipes and the signs were bright; on this auspicious day I wish to add reward and encouragement.',
  ],
  s0072: [
    'Orders may be sent out far and near to open wide good fields; public and private plots alike shall exhaust the land\'s advantage.',
    'Orders are to go out far and near to open good fields; public and private plots alike must make full use of the land.',
  ],
  s0073: [
    'If one wishes to attach to farming but lacks seed grain, additional loans and relief shall also be granted, always making the benefit broad and complete.',
    'If one wishes to farm but lacks seed grain, loans and relief are also to be granted, always making the benefit broad and complete.',
  ],
  s0074: [
    'Those showing filial piety and diligence in farming are granted one rank of nobility.',
    'Those showing filial piety and diligence in farming receive one rank of nobility.',
  ],
  s0075: [
    'The offices participating in the plowing shall, on the appointed day, offer labor wine."',
    'The offices participating in the plowing shall, on the appointed day, offer labor wine."',
  ],
  s0076: [
    'In the third month, on renyin, General Who Guards the Right Prince of Yuzhang Zong was made General Who Pacifies the North and South Yanzhou Inspector.',
    'In the third month, on renyin, General Who Guards the Right and Prince of Yuzhang Zong was made General Who Pacifies the North and South Yanzhou inspector.',
  ],
  s0077: [
    'In the sixth month, on yichou, Yizhou was divided to establish Xin province; Jiaozhou was divided to establish Ai province; Guangzhou was divided to establish Cheng, South Ding, He, and Jian provinces; Huo province was divided to establish Yi province.',
    'In the sixth month, on yichou, Yizhou was split to create Xin province; Jiaozhou to create Ai province; Guangzhou to create Cheng, South Ding, He, and Jian provinces; and Huo province to create Yi province.',
  ],
  s0078: [
    'In autumn, the eighth month, on dingmao, the Old Man Star appeared.',
    'In the eighth month of autumn, on dingmao, the Old Man Star was seen.',
  ],
  s0079: [
    'In winter, the tenth month, on gengwu, Supervisor of the Masters of Writing and Central Guard General Yuan Ang was made Director of the Masters of Writing, retaining his original title as Bearer of the Staff with the Same Three Dignities as the Three Lords.',
    'In the tenth month of winter, on gengwu, Supervisor of the Masters of Writing and Central Guard General Yuan Ang became Director of the Masters of Writing while retaining his ministerial honors.',
  ],
  s0080: [
    'On jimao, Protector of the Army General Chang Yizhi died.',
    'On jimao, Protector of the Army Chang Yizhi died.',
  ],
  s0081: [
    'In the eleventh month, first day guiwei, there was a solar eclipse.',
    'On guiwei, the first day of the eleventh month, there was a solar eclipse.',
  ],
  s0082: [
    'The Metal Star appeared in daylight.',
    'Venus was visible in daylight.',
  ],
  s0083: [
    'On jiachen, Left Vice Director of the Masters of Writing Wang Dan died.',
    'On jiachen, Left Vice Director Wang Dan died.',
  ],
  s0084: [
    'In the twelfth month, on wuwu, iron coin was first cast.',
    'In the twelfth month, on wuwu, iron coin was first cast.',
  ],
  s0085: [
    'Langyaxiu sent envoys presenting tribute goods.',
    'Langyaxiu sent envoys with tribute.',
  ],
  s0086: [
    'In the first month of spring, year 5, Left Grand Master of the Palace and Bearer of the Staff with the Same Three Dignities as the Three Lords Prince of Nanping Wei was made Grand General Who Guards the Realm; he was changed to hold Right Grand Master of the Palace, his Bearer of the Staff status unchanged.',
    'In spring of year 5, Left Grand Master of the Palace and Bearer of the Staff Prince of Nanping Wei was made Grand General Who Guards the Realm and reassigned as Right Grand Master of the Palace with ministerial honors unchanged.',
  ],
  s0087: [
    'General Who Conquers the West, Bearer of the Staff with the Same Three Dignities as the Three Lords, and Jingzhou Inspector Prince of Poyang Hui was promoted to General of Agile Cavalry.',
    'General Who Conquers the West, Bearer of the Staff, and Jingzhou inspector Prince of Poyang Hui was promoted to General of Agile Cavalry.',
  ],
  s0088: [
    'Minister of the Imperial Treasury Xiahou Dan was made Central Army Protector.',
    'Minister of the Imperial Treasury Xiahou Dan was made Central Army Protector.',
  ],
  s0089: [
    'Right Grand Master of the Palace Wang Fen was made Left Grand Master of the Palace and additionally granted Special Advancement.',
    'Right Grand Master of the Palace Wang Fen became Left Grand Master of the Palace and was additionally granted Special Advancement.',
  ],
  s0090: [
    'On xinmao, General Who Pacifies the North and South Yanzhou Inspector Prince of Yuzhang Zong was promoted to General Who Guards the North.',
    'On xinmao, General Who Pacifies the North and South Yanzhou inspector Prince of Yuzhang Zong was promoted to General Who Guards the North.',
  ],
  s0091: [
    'General Who Pacifies the West and Yongzhou Inspector Prince of Jin\'an Gang was promoted to General Who Pacifies the North.',
    'General Who Pacifies the West and Yongzhou inspector Prince of Jin\'an Gang was promoted to General Who Pacifies the North.',
  ],
  s0092: [
    'In the second month, on gengwu, Special Advancement and Left Grand Master of the Palace Wang Fen died.',
    'In the second month, on gengwu, Special Advancement and Left Grand Master of the Palace Wang Fen died.',
  ],
  s0093: [
    'On dingchou, the Old Man Star appeared.',
    'On dingchou, the Old Man Star was seen.',
  ],
  s0094: [
    'In the third month, on jiaxu, Yangzhou and Jiangzhou were divided to establish East Yangzhou.',
    'In the third month, on jiaxu, Yangzhou and Jiangzhou were split to create East Yangzhou.',
  ],
  s0095: [
    'In summer, the fourth month, on yiwei, General of Cloud Pennons Prince of Nankang Ji was made Jiangzhou Inspector.',
    'In the fourth month of summer, on yiwei, General of Cloud Pennons and Prince of Nankang Ji was made Jiangzhou inspector.',
  ],
  s0096: [
    'In the sixth month, on yiyou, dragons fought at Qu\'e Wang\'s embankment and then traveled west to Jianling city.',
    'In the sixth month, on yiyou, dragons fought at Qu\'e Wang\'s embankment and then moved west to Jianling city.',
  ],
  s0097: [
    'Where they passed, trees were snapped and uprooted, opening ground several tens of zhang.',
    'Along their path trees were snapped and uprooted, tearing open ground several tens of zhang wide.',
  ],
  s0098: [
    'On wuzi, Kuaiji Administrator Prince of Wuling Ji was made East Yangzhou Inspector.',
    'On wuzi, Kuaiji administrator and Prince of Wuling Ji was made East Yangzhou inspector.',
  ],
  s0099: [
    'On gengzi, Supernumerary Cavalier Attendant-in-Ordinary Yuan Shu was made General Who Pacifies the North and Inspector of North Qing and Yan provinces, leading the host on a northern campaign.',
    'On gengzi, Supernumerary Cavalier Attendant-in-Ordinary Yuan Shu was made General Who Pacifies the North and inspector of North Qing and Yan provinces, leading forces on a northern campaign.',
  ],
  s0100: [
    'In autumn, the seventh month, on xinwei, volunteers in the northern campaign were granted one rank.',
    'In the seventh month of autumn, on xinwei, volunteers in the northern campaign were granted one rank.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_003_b1.mjs <translation.json>'
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
