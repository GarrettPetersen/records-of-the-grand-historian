#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'In the twelfth month, on jiaxu, Li Xiuzhi, Staff Officer of the Right Army, was made Jiao Province Inspector.',
    'On jiaxu of the twelfth month, Right Army staff officer Li Xiuzhi was appointed inspector of Jiao Province.',
  ],
  s0202: [
    'On gengyin, the fifth imperial son Shao was established as Prince of Luling, and Lang, son of Prince of Jiangxia Yigong, as Prince of Nanfeng County.',
    'On gengyin the fifth prince, Shao, was enfeoffed as Prince of Luling, and Lang, son of Prince of Jiangxia Yigong, as prince of Nanfeng county.',
  ],
  s0203: [
    'In the first month of spring of the tenth year, on jiayin, Prince of Jingling Yixuan was changed in enfeoffment to Prince of Nanqiao.',
    'In the tenth year, on jiayin of the first spring month, Prince of Jingling Yixuan was redesignated Prince of Nanqiao.',
  ],
  s0204: [
    'Wang Zhongde, Pacifying-North General and Xu Province Inspector, was additionally made Yan Province Inspector; Duan Hong, Administrator of Huainan, was made Qing Province Inspector.',
    'Pacifying-North general Wang Zhongde, already inspector of Xu, was also given Yan Province; Huainan administrator Duan Hong became inspector of Qing.',
  ],
  s0205: [
    'On jiwei, a general amnesty was proclaimed for all under Heaven.',
    'On jiwei the court proclaimed a general amnesty throughout the realm.',
  ],
  s0206: [
    'Orphans and the aged living alone, and those afflicted with the six infirmities who could not support themselves, were each granted five hu of grain.',
    'Each orphan or elderly person living alone, and anyone disabled by the six infirmities who could not support himself, received five hu of grain.',
  ],
  s0207: [
    'Yixin, Prince of Changsha, General of the Rear and Yu Province Inspector, was advanced in title to General of the Army.',
    'Prince of Changsha Yixin, rear general and inspector of Yu, was promoted to General of the Army.',
  ],
  s0208: [
    'In the fourth month of summer, on wuxu, Qing Province Inspector Duan Hong was additionally made Ji Province Inspector.',
    'In summer\u2019s fourth month, on wuxu, Qing inspector Duan Hong was also given Ji Province.',
  ],
  s0209: [
    'Marquis of Fengyang County Xiao Sihua was made Inspector of Liang and Southern Qin provinces.',
    'Xiao Sihua, Marquis of Fengyang County, was appointed inspector of Liang and Southern Qin.',
  ],
  s0210: [
    'In the fifth month, the king of Linyi sent envoys presenting tribute goods.',
    'In the fifth month the king of Linyi (Champa) sent envoys with tribute.',
  ],
  s0211: [
    'In the sixth month, on yihai, former Qing Province Inspector Wei Lang was made Guang Province Inspector.',
    'On yihai of the sixth month, former Qing inspector Wei Lang was made inspector of Guang.',
  ],
  s0212: [
    'The state of Heluodan in Campa sent envoys presenting tribute goods.',
    'Heluodan in Campa sent envoys bearing tribute.',
  ],
  s0213: [
    'In the seventh month of autumn, on wuxu, a partial amnesty was granted in Yi, Liang, and Qin provinces.',
    'On wuxu in the seventh autumn month, Yi, Liang, and Qin received a partial amnesty.',
  ],
  s0214: [
    'The commanderies of Songning and Songxing were established in Yi Province.',
    'Yi Province gained two new commanderies, Songning and Songxing.',
  ],
  s0215: [
    'In the eighth month, on dingchou, Taiyuan Commandery was established in Qing Province.',
    'On dingchou of the eighth month Taiyuan Commandery was set up within Qing Province.',
  ],
  s0216: [
    'On xinsi, Protector of the Army Dao Yanzhi died.',
    'On xinsi Dao Yanzhi, Protector of the Army, passed away.',
  ],
  s0217: [
    'In the eleventh month of winter, the Di chieftain Yang Nadu raided Hanzhuan.',
    'That winter, in the eleventh month, the Di leader Yang Nadu attacked Hanzhuan.',
  ],
  s0218: [
    'On dingwei, Liang Province Inspector Zhen Fahu abandoned the city and fled; Nadu seized Liang Province.',
    'On dingwei Liang inspector Zhen Fahu abandoned his post and fled, and Nadu took possession of Liang.',
  ],
  s0219: [
    'In the first month of spring of the eleventh year, the outlaw Ma Daxuan and his band of several hundred men raided Mount Tai; [13] the province and commanderies suppressed and pacified them.',
    'In the eleventh year\u2019s first spring month, the fugitive Ma Daxuan led several hundred followers in a raid on Mount Tai; [13] provincial and commandery forces suppressed and pacified them.',
  ],
  s0220: [
    'In the second month, on guiyou, Jiaozhi Administrator Li Danzhi was made Jiao Province Inspector.',
    'On guiyou of the second month, Jiaozhi administrator Li Danzhi became inspector of Jiao.',
  ],
  s0221: [
    'In the fourth month of summer, Liang and Southern Qin Inspector Xiao Sihua defeated the Di chieftain Yang Nadu, and Liang Province was pacified.',
    'In summer\u2019s fourth month Xiao Sihua, inspector of Liang and Southern Qin, defeated the Di leader Yang Nadu and restored order in Liang.',
  ],
  s0222: [
    'In the fifth month, on dingmao, a partial amnesty was granted in Liang and Southern Qin provinces north of Jian\u2019ge Pass.',
    'On dingmao of the fifth month a partial amnesty was declared for Liang and Southern Qin north of Jian\u2019ge.',
  ],
  s0223: [
    'On wuyin, Juqu Maoqian of Northern Liang was made Campaigning-West Grand General and Liang Province Inspector.',
    'On wuyin Juqu Maoqian of Northern Liang was appointed Grand General campaigning west and inspector of Liang.',
  ],
  s0224: [
    'That month the capital suffered great flooding.',
    'That month severe floods struck the capital.',
  ],
  s0225: [
    'In the sixth month, on dingwei, Wei Commandery was abolished.',
    'On dingwei of the sixth month Wei Commandery was abolished.',
  ],
  s0226: [
    'That year Linyi, Funan, and Heluodan sent envoys presenting tribute goods.',
    'That year envoys from Linyi, Funan, and Heluodan arrived with tribute.',
  ],
  s0227: [
    'In the first month of spring of the twelfth year, on xinyou, a general amnesty was proclaimed for all under Heaven.',
    'On xinyou in the twelfth year\u2019s first spring month the court proclaimed a general amnesty.',
  ],
  s0228: [
    'On xinwei, the imperial carriage personally performed sacrifice at the southern suburb.',
    'On xinwei the emperor personally sacrificed at the southern suburban altar.',
  ],
  s0229: [
    'On guiyou, Feng Hong, ruler of the Yellow Dragon state, was enfeoffed as Prince of Yan.',
    'On guiyou Feng Hong of the Yellow Dragon state received the enfeoffment of Prince of Yan.',
  ],
  s0230: [
    'In the fourth month of summer, on yiyou, [14] Vice Director of the Masters of Writing Yin Jingren was additionally made General of the Central Army.',
    'In summer\u2019s fourth month, on yiyou, [14] Masters of Writing vice director Yin Jingren was also made General of the Central Army.',
  ],
  s0231: [
    'On bingchen, an edict said: "The house of Zhou attained tranquility through its many officers; the rise of the Han house likewise relied on obtaining capable men.',
    'On bingchen an edict declared: "The Zhou house found peace through its many officers, and the Han rose in glory by winning able men.',
  ],
  s0232: [
    'Waking and sleeping I delight in worthies—it has been so for many days—yet sage discernment is hard to attain, and bright promotion has had no effect.',
    'I have long dreamed and waked with joy in worthy men, yet true discernment remains beyond reach and my calls to elevate talent have borne no fruit.',
  ],
  s0233: [
    'Thus outstanding talent remains in the wilds and the storehouses stand empty at court; ever recalling the records of old, my shame in virtue runs deep.',
    'Talented men still wander outside office while the court\u2019s storehouses stand empty; pondering the examples of antiquity, I am deeply ashamed of my own virtue.',
  ],
  s0234: [
    'To raise those whom you know is the Kongzi\u2019s earnest teaching; to present scholars and assign them office is the established standard of former ages.',
    '"Recommend those you know" is Confucius\u2019s earnest teaching; presenting scholars and appointing them to office is the settled standard of former ages.',
  ],
  s0235: [
    'Let an edict now be proclaimed within and without, that each may make recommendations.',
    'Let an edict go forth within and without the court, and let every office submit recommendations.',
  ],
  s0236: [
    'They shall be weighed and promoted by measure, to observe what use they can serve."',
    'They shall be assessed and advanced according to their measure, that we may see what service they can render."',
  ],
  s0237: [
    '” That night the capital suffered an earthquake.',
    'That night the capital was struck by an earthquake.',
  ],
  s0238: [
    'In the sixth month, Danyang, Huainan, Wuxing, and Yixing suffered great flooding; in the capital people traveled by boat.',
    'In the sixth month Danyang, Huainan, Wuxing, and Yixing were inundated, and in the capital people went about by boat.',
  ],
  s0239: [
    'On jiyou, several million hu of grain from Xu, Yu, and Southern Yan provinces and from Kuaiji and Xuancheng commanderies were granted to the people of the five flood-stricken commanderies.',
    'On jiyou several million hu of grain from Xu, Yu, and Southern Yan and from Kuaiji and Xuancheng were distributed to the people of the five flood-stricken commanderies.',
  ],
  s0240: [
    'That month the sale of wine was prohibited.',
    'That month the court banned the sale of wine.',
  ],
  s0241: [
    'The Lion Country sent envoys presenting tribute goods.',
    'The Lion Country (Sri Lanka) sent envoys with tribute.',
  ],
  s0242: [
    'In the seventh month of autumn, on xinyou, [15] the states of Campasataka and Funan both sent envoys presenting tribute goods.',
    'On xinyou in the seventh autumn month, [15] Campasataka and Funan each sent envoys with tribute.',
  ],
  s0243: [
    'In the eighth month, on renshen, the three commanderies of Southern Jinshou, Southern Xinba, and Northern Baxi were established in Yi Province.',
    'On renshen of the eighth month Yi Province gained the three new commanderies of Southern Jinshou, Southern Xinba, and Northern Baxi.',
  ],
  s0244: [
    '[16] On yihai, all overdue obligations in the flood-stricken commanderies were remitted.',
    '[16] On yihai all outstanding levies in the flood-stricken commanderies were forgiven.',
  ],
  s0245: [
    'In the ninth month, the bandit Zhang Xun of Shu Commandery rose in rebellion.',
    'In the ninth month the outlaw Zhang Xun of Shu Commandery took up arms.',
  ],
  s0246: [
    'In the eleventh month of winter, Gou Daofu, Acting Staff Officer of the Right Army, was made Jiao Province Inspector.',
    'In the eleventh winter month Right Army acting staff officer Gou Daofu was appointed inspector of Jiao.',
  ],
  s0247: [
    'In the first month of spring of the thirteenth year, on guichou, the Emperor was ill and did not hold court audience.',
    'On guichou in the thirteenth year\u2019s first spring month the emperor fell ill and ceased holding court.',
  ],
  s0248: [
    'In the third month, on jiwei, Tan Daoji, Minister of Works and Jiang Province Inspector, was guilty and executed.',
    'On jiwei of the third month Tan Daoji, Minister of Works and inspector of Jiang, was found guilty and put to death.',
  ],
  s0249: [
    'On gengshen, a general amnesty was proclaimed for all under Heaven.',
    'On gengshen the court proclaimed a general amnesty.',
  ],
  s0250: [
    'Yixuan, Prince of Nanqiao and General of the Central Army, was made Pacifying-South General and Jiang Province Inspector.',
    'Prince of Nanqiao Yixuan, central army general, was made Pacifying-South general and inspector of Jiang.',
  ],
  s0251: [
    'In the fifth month of summer, on wuchen, Wang Zhongde, Pacifying-North General and Inspector of Xu and Yan provinces, was advanced in title to Pacifying-North Grand General.',
    'On wuchen in the fifth summer month pacifying-north general Wang Zhongde, inspector of Xu and Yan, was promoted to Pacifying-North Grand General.',
  ],
  s0252: [
    'On gengchen, Wang Fangpai, Staff Officer of the Campaigning-North General, was made Yan Province Inspector.',
    'On gengchen campaigning-north staff officer Wang Fangpai was appointed inspector of Yan.',
  ],
  s0253: [
    'In the sixth month, Goguryeo and the King of Wudu sent envoys presenting tribute goods.',
    'In the sixth month Goguryeo and the King of Wudu sent envoys with tribute.',
  ],
  s0254: [
    'In the eighth month, on gengyin, Yin Jingren, Vice Director of the Masters of Writing and General of the Central Army, was changed to Protector of the Army.',
    'On gengyin of the eighth month Yin Jingren relinquished his posts as vice director and central army general and became Protector of the Army.',
  ],
  s0255: [
    'In the ninth month, on guichou, the second imperial son Jun was established as Prince of Shixing, and the third imperial son Jun as Prince of Wuling.',
    'On guichou of the ninth month the second prince, Jun, was enfeoffed as Prince of Shixing and the third prince, Jun, as Prince of Wuling.',
  ],
  s0256: [
    'In the first month of spring of the fourteenth year, on xinmao, the imperial carriage personally performed sacrifice at the southern suburb, and a general amnesty was proclaimed for all under Heaven.',
    'On xinmao in the fourteenth year\u2019s first spring month the emperor sacrificed at the southern suburb and proclaimed a general amnesty.',
  ],
  s0257: [
    'Civil and military officials were granted one rank in status;',
    'Civil and military officials were each advanced one rank in status;',
  ],
  s0258: [
    'orphans and the aged living alone, and those afflicted with the six infirmities who could not support themselves, were each granted five hu of grain.',
    'and each orphan or elderly person living alone, and anyone disabled by the six infirmities who could not support himself, received five hu of grain.',
  ],
  s0259: [
    'In the second month, on renzi, Liu Zhendao, Colonel of Footsoldiers, was made Inspector of Liang and Southern Qin provinces.',
    'On renzi of the second month footsoldier colonel Liu Zhendao was appointed inspector of Liang and Southern Qin.',
  ],
  s0260: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0261: [
    'In the fourth month of summer, on dingwei, Zhou Jizhi, General Who Assists the State, was made Yi Province Inspector.',
    'On dingwei in the fourth summer month state-assisting general Zhou Jizhi was made inspector of Yi.',
  ],
  s0262: [
    'In the eighth month of autumn, on wuwu, Xu Senzhi, Gentleman of the Gold Section in the Masters of Writing, was made Jiao Province Inspector.',
    'On wuwu in the eighth autumn month Xu Senzhi of the Masters of Writing gold section was appointed inspector of Jiao.',
  ],
  s0263: [
    'In the twelfth month of winter, on xinyou, the rite of congratulating on snow was suspended.',
    'On xinyou of the twelfth winter month the court suspended the snow-congratulation ceremony.',
  ],
  s0264: [
    'The states of Henan, the King of Hexi, and Heluodan all sent envoys presenting tribute goods.',
    'Henan, the King of Hexi, and Heluodan each sent envoys with tribute.',
  ],
  s0265: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0266: [
    'In the second month of spring of the fifteenth year, on dingwei, Murong Yan of Tuyuhun, General Who Pacifies the East, was made Pacifying-West General and Inspector of Qin and He provinces.',
    'On dingwei in the fifteenth year\u2019s second spring month Murong Yan of Tuyuhun, eastern pacifying general, was made western pacifying general and inspector of Qin and He.',
  ],
  s0267: [
    'In the fourth month of summer, on jiachen, Prince of Yan Hong sent envoys presenting tribute goods.',
    'On jiachen in the fourth summer month Prince of Yan Hong sent envoys with tribute.',
  ],
  s0268: [
    '[19] The consort of the Crown Prince of the Yin clan was established, and kings, dukes, and those below were each granted gifts according to rank.',
    '[19] The crown prince\u2019s consort of the Yin clan was installed, and kings, dukes, and officials below them received graded gifts.',
  ],
  s0269: [
    'On jisi, King Zhen of Wa was made Pacifying-East General.',
    'On jisi the king of Wa (Japan), Zhen, was appointed Pacifying-East general.',
  ],
  s0270: [
    'On jichou, Yin Mu, Special Grand Master and Right Grand Master of the Palace, died.',
    'On jichou special grand master Yin Mu, Right Grand Master of the Palace, passed away.',
  ],
  s0271: [
    'On xinmao, Wang Zhongde, Pacifying-North Grand General and Xu Province Inspector, died.',
    'On xinmao pacifying-north grand general Wang Zhongde, inspector of Xu, died.',
  ],
  s0272: [
    'On renchen, Liu Zunkao, General of the Right Guard, was made Inspector of Xu and Yan provinces.',
    'On renchen right guard general Liu Zunkao was appointed inspector of Xu and Yan.',
  ],
  s0273: [
    'In the seventh month of autumn, on xinwei, there was an earthquake.',
    'On xinwei in the seventh autumn month an earthquake struck.',
  ],
  s0274: [
    'On jiaxu, Xu Xun, Administrator of Chen and Nandun commanderies, was made Ning Province Inspector.',
    'On jiaxu Chen and Nandun administrator Xu Xun was made inspector of Ning.',
  ],
  s0275: [
    'In the eighth month, on xinchou, Zhao Bofu, General of the Left Guard, was made Inspector of Xu and Yan provinces.',
    'On xinchou of the eighth month left guard general Zhao Bofu was appointed inspector of Xu and Yan.',
  ],
  s0276: [
    'On jiayin, Lu Hui, Administrator of Shixing, was made Guang Province Inspector.',
    'On jiayin Shixing administrator Lu Hui became inspector of Guang.',
  ],
  s0277: [
    'On dingsi, Wang Fangpai, Yan Province Inspector, was made Inspector of Qing and Ji provinces.',
    'On dingsi Yan inspector Wang Fangpai was given Qing and Ji as well.',
  ],
  s0278: [
    'That year the King of Wudu, the state of Henan, Goguryeo, Wa, Funan, and Linyi all sent envoys presenting tribute goods.',
    'That year the King of Wudu, Henan, Goguryeo, Wa (Japan), Funan, and Linyi all sent tribute missions.',
  ],
  s0279: [
    'In the first month of spring of the sixteenth year, on wuyin, the imperial carriage reviewed troops at the northern suburb.',
    'On wuyin in the sixteenth year\u2019s first spring month the emperor reviewed troops at the northern suburb.',
  ],
  s0280: [
    'On gengyin, Yikang, Prince of Pengcheng, Minister over the Masses, Recorder of the Masters of Writing, and Yang Province Inspector, was advanced in rank to Grand General; he continued as Minister over the Masses, and the rest of his offices remained as before.',
    'On gengyin Prince of Pengcheng Yikang, Minister over the Masses, recorder of the Masters of Writing, and Yang inspector, was promoted to Grand General while retaining the ministry and his other posts.',
  ],
  s0281: [
    'Yigong, Prince of Jiangxia, Campaigning-North General, Commissioner with Credentials Equal to the Three Dukes, and Southern Yan Province Inspector, was advanced in rank to Minister of Works; his inspectorship remained as before.',
    'Prince of Jiangxia Yigong, campaigning-north general with credentials equal to the Three Dukes and inspector of Southern Yan, was promoted to Minister of Works and kept his inspectorship.',
  ],
  s0282: [
    'Wang Jinghong, Special Grand Master and Left Grand Master of the Palace, was given the privilege of a separate office equal to the Three Dukes.',
    'Wang Jinghong, Special Grand Master and Left Grand Master of the Palace, received an opening office equal to the Three Dukes.',
  ],
  s0283: [
    'On guisi, Jing Province was again divided to establish Xiang Province.',
    'On guisi Jing was again partitioned to create Xiang Province.',
  ],
  s0284: [
    'In the second month, on jihai, Yiji, Prince of Hengyang and Southern Xu Province Inspector, was made Pacifying-West General and Jing Province Inspector.',
    'On jihai of the second month Prince of Hengyang Yiji, inspector of Southern Xu, was made western pacifying general and inspector of Jing.',
  ],
  s0285: [
    'On dingwei, Prince of Shixing Jun was made Xiang Province Inspector.',
    'On dingwei Prince of Shixing Jun was appointed inspector of Xiang.',
  ],
  s0286: [
    'On guihai, the six commanderies of Baxi, Zitong, Southern Dangqu, and Southern Hanzhong from Liang Province and Nan\u2019an and Huaining from Southern Qin Province were severed [20] and placed under Yi Province.',
    'On guihai six commanderies—Baxi, Zitong, Southern Dangqu, and Southern Hanzhong from Liang and Nan\u2019an and Huaining from Southern Qin [20]—were detached and assigned to Yi.',
  ],
  s0287: [
    'Baling Commandery was established from Changsha and Jiangxia commanderies and placed under Xiang Province.',
    'Baling Commandery was carved out of Changsha and Jiangxia and placed under Xiang.',
  ],
  s0288: [
    'In the fourth month of summer, on dingsi, Yixuan, Prince of Nanqiao, Pacifying-South General and Jiang Province Inspector, was made Campaigning-North General and Southern Xu Province Inspector.',
    'On dingsi in the fourth summer month Prince of Nanqiao Yixuan, pacifying-south general and Jiang inspector, became campaigning-north general and inspector of Southern Xu.',
  ],
  s0289: [
    'Yiqing, Prince of Linchuan and Pacifying-West General, was made General of the Guard and Jiang Province Inspector.',
    'Prince of Linchuan Yiqing, western pacifying general, was made Guard general and inspector of Jiang.',
  ],
  s0290: [
    'In the sixth month, on jiyou, Murong Yan of Longxi Tuyuhun was changed in enfeoffment to King of Henan.',
    'On jiyou of the sixth month Murong Yan of Longxi Tuyuhun was redesignated King of Henan.',
  ],
  s0291: [
    'On guichou, Murong Shibin of Tuyuhun was made Pacifying-West General, and Murong Fanni of Tuyuhun was made Pacifying-Army General.',
    'On guichou Murong Shibin of Tuyuhun was made western pacifying general and Murong Fanni pacifying-army general.',
  ],
  s0292: [
    'In the eighth month of autumn, on gengzi, the fourth imperial son Shuo was established as Prince of Nanping.',
    'On gengzi in the eighth autumn month the fourth prince, Shuo, was enfeoffed as Prince of Nanping.',
  ],
  s0293: [
    'On yiwei of the intercalary month, Yixin, Prince of Changsha, General of the Army and Yu Province Inspector, died.',
    'On yiwei of the intercalary month Prince of Changsha Yixin, army general and Yu inspector, died.',
  ],
  s0294: [
    'On wuxu, Huainan was again divided from Yu Province to establish Southern Yu Province.',
    'On wuxu Huainan was again split from Yu to form Southern Yu Province.',
  ],
  s0295: [
    'On guimao, Liu Zunkao, General of the Left Guard, was made Yu Province Inspector.',
    'On guimao left guard general Liu Zunkao was appointed inspector of Yu.',
  ],
  s0296: [
    'On wushen, Prince of Shixing Jun, Xiang Province Inspector, was made Southern Yu Province Inspector, and Prince of Wuling Jun was made Xiang Province Inspector.',
    'On wushen Prince of Shixing Jun exchanged Xiang for Southern Yu, and Prince of Wuling Jun took Xiang in his place.',
  ],
  s0297: [
    'In the twelfth month of winter, on yihai, the Crown Prince underwent the capping ceremony, and a general amnesty was proclaimed for all under Heaven.',
    'On yihai in the twelfth winter month the crown prince came of age in the capping rite and the court proclaimed a general amnesty.',
  ],
  s0298: [
    'That year the King of Wudu, the King of Henan, Linyi, and Goguryeo sent envoys presenting tribute goods.',
    'That year the kings of Wudu and Henan, together with Linyi and Goguryeo, sent tribute missions.',
  ],
  s0299: [
    'In the fourth month of summer of the seventeenth year, on wuwu, the new moon, there was a solar eclipse.',
    'In the seventeenth year\u2019s fourth summer month, on the new moon of wuwu, a solar eclipse occurred.',
  ],
  s0300: [
    'In the fifth month, on guisi, Liu Zhan, General of the Army of the Palace Guard, left office on account of his mother\u2019s mourning.',
    'On guisi of the fifth month palace guard army general Liu Zhan resigned to observe mourning for his mother.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_songshu_005_b3.mjs <translation.json>'
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
