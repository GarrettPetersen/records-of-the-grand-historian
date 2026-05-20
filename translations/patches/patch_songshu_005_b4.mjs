#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'In the seventh month of autumn, on renyin, Consulting Military Adviser under the General Who Campaigns against Invaders Du Ji was made Qingzhou Inspector.',
    'In the seventh month of autumn, on renyin, Du Ji, consulting adviser to the General Who Campaigns against Invaders, was appointed Qingzhou inspector.',
  ],
  s0302: [
    'On renzi, Empress Yuan died.',
    'On renzi, Empress Yuan (the Yuan empress) died.',
  ],
  s0303: [
    'In the eighth month, Xu, Yan, Qing, and Ji provinces suffered great floods; on jiwei, envoys were sent to inspect and grant relief.',
    'In the eighth month great floods struck Xu, Yan, Qing, and Ji; on jiwei envoys were dispatched to inspect the damage and distribute relief.',
  ],
  s0304: [
    'On renzi of the ninth month, the late Empress Yuan was buried at Changning Mausoleum.',
    'On renzi of the ninth month the Yuan empress was interred at Changning Mausoleum.',
  ],
  s0305: [
    'In the tenth month of winter, on wuwu, former Danyang Prefect Liu Zhan was guilty of crimes, and he and his accomplices were executed.',
    'In the tenth month of winter, on wuwu, former Danyang prefect Liu Zhan was found guilty; he and his faction were put to death.',
  ],
  s0306: [
    'A general amnesty was proclaimed for the empire; civil and military officials were granted one rank in nobility.',
    'A general amnesty was declared, and civil and military officials advanced one noble rank.',
  ],
  s0307: [
    'Grand General, Concurrent Grand Secretary, Supervisor of the Masters of Writing, and Yangzhou Inspector Prince of Pengcheng Yikang was made Jiangzhou Inspector, retaining the title of Grand General.',
    'Prince of Pengcheng Yikang—grand general, concurrent grand secretary, supervisor of the Masters of Writing, and Yangzhou inspector—was made Jiangzhou inspector while keeping his grand general title.',
  ],
  s0308: [
    'Minister of Works and Southern Yanzhou Inspector Prince of Jiangxia Yigong was made Grand Secretary and Supervisor of the Masters of Writing.',
    'Prince of Jiangxia Yigong, minister of works and Southern Yanzhou inspector, became grand secretary and supervisor of the Masters of Writing.',
  ],
  s0309: [
    'On wuyin, General of the Guard Prince of Linchuan Yiqing retained his present title as Southern Yanzhou Inspector; Vice Director of the Masters of Writing and General Who Protects the Army Yin Jingren was made Yangzhou Inspector, retaining the post of Vice Director.',
    'On wuyin, General of the Guard Prince of Linchuan Yiqing remained Southern Yanzhou inspector under his existing title; Vice Director Yin Jingren, also general who protects the army, became Yangzhou inspector while keeping the vice directorship.',
  ],
  s0310: [
    'On bingxu of the eleventh month, Director of the Masters of Writing Liu Yirong was made General of the Central Army; Supervisor of the Palace Library Xu Tanzhi was made General of the Central Household Guards.',
    'On bingxu of the eleventh month, Director Liu Yirong was appointed general of the central army and Palace Library supervisor Xu Tanzhi general of the central household guards.',
  ],
  s0311: [
    'On dinghai, an edict said: "The grain and seed for fields previously granted to the people of Yang and Southern Xu provinces, and the rent grain from Yan, both Yu, Qing, and Xu provinces that in recent years was reduced and should be collected and forwarded—all are remitted by half."',
    'On dinghai an edict declared: "Field grain and seed earlier granted to Yang and Southern Xu, and half the rent grain from Yan, both Yu, Qing, and Xu that recent tax relief still required to be forwarded, are all remitted."',
  ],
  s0312: [
    'Where there is no harvest this year, [21] all are fully remitted.',
    'Where the harvest fails this year, [21] all obligations are cancelled outright.',
  ],
  s0313: [
    'All overdue debts are to be favorably assessed and reduced.',
    'Every outstanding debt is to be leniently reviewed and reduced.',
  ],
  s0314: [
    'Moreover, the appraisal taxes of the provinces and commanderies and the market levies in each place are often vexatious and harsh.',
    'Provincial and commandery appraisal taxes and local market dues are also often burdensome and severe.',
  ],
  s0315: [
    'The profits of mountains and marshes are in some places still prohibited;',
    'Revenue from mountains and marshes is still barred in some districts;',
  ],
  s0316: [
    'the categories subject to corvée conscription even reach infants and children.',
    'and corvée categories even extend to the very young.',
  ],
  s0317: [
    'All such practices harm governance and injure the people.',
    'Such abuses damage good rule and hurt the common people.',
  ],
  s0318: [
    'From now on let all act according to the laws and statutes, striving to the utmost for leniency and relief.',
    'Henceforth all are to follow statute and law, doing their utmost to grant leniency and ease.',
  ],
  s0319: [
    'If anything is unsuitable, speak of it separately according to the matter; do not hastily pursue momentary convenience and thereby violate the purpose of hidden cherishing and relief.',
    'Where something will not work, report it on its merits; do not chase short-term expedients and betray the intent of compassionate governance.',
  ],
  s0320: [
    'Let those in charge clearly proclaim this downward and declare my intent.',
    'Let responsible officials proclaim this clearly throughout the realm and make my will known.',
  ],
  s0321: [
    '"] On guichou, Vice Director of the Masters of Writing and Yangzhou Inspector Yin Jingren died.',
    'On guichou, Vice Director and Yangzhou inspector Yin Jingren died.',
  ],
  s0322: [
    'On guihai of the twelfth month, Grand Master of Splendid Happiness Wang Qiu was made Vice Director of the Masters of Writing.',
    'On guihai of the twelfth month, Grand Master of Splendid Happiness Wang Qiu was appointed vice director of the Masters of Writing.',
  ],
  s0323: [
    '[22] On wuchen, Southern Yuzhou Inspector Prince of Shixing Jun was made Yangzhou Inspector; Xiangzhou Inspector Prince of Wuling Jun was made Southern Yuzhou Inspector; Prince of Nanping Shuo was made Xiangzhou Inspector.',
    '[22] On wuchen, Prince of Shixing Jun moved from Southern Yuzhou to Yangzhou; Prince of Wuling Jun took Southern Yuzhou from Xiangzhou; and Prince of Nanping Shuo became Xiangzhou inspector.',
  ],
  s0324: [
    'That year, the King of Wudu, the King of Henan, and the state of Baekje sent envoys presenting tribute goods.',
    'That year the kings of Wudu and Henan and the state of Baekje sent envoys with tribute.',
  ],
  s0325: [
    'In the second month of spring in year 18, on yimao, Yuzhang Prefect Yu Dengzhi was made Jiangzhou Inspector.',
    'In the second month of spring, year 18, on yimao, Yuzhang prefect Yu Dengzhi was appointed Jiangzhou inspector.',
  ],
  s0326: [
    'In the fifth month of summer, on renwu, [23] General of the Guard and Southern Yanzhou Inspector Prince of Linchuan Yiqing and General Who Campaigns North and Southern Xuzhou Inspector Prince of Nanqiao Yixuan were both granted Opening Office with ceremonial equal to the Three Excellencies.',
    'In the fifth month of summer, on renwu, [23] Prince of Linchuan Yiqing, general of the guard and Southern Yanzhou inspector, and Prince of Nanqiao Yixuan, general who campaigns north and Southern Xuzhou inspector, both received opening office equal to the Three Excellencies.',
  ],
  s0327: [
    'On guisi, the commandery of Songxi was established in Jiao Province.',
    'On guisi the commandery of Songxi was set up in Jiao Province.',
  ],
  s0328: [
    'That month, the Han River overflowed its banks.',
    'That month the Han River flooded.',
  ],
  s0329: [
    'On wuchen of the sixth month, envoys were sent to tour the regions and grant relief.',
    'On wuchen of the sixth month envoys were dispatched to tour the districts and distribute relief.',
  ],
  s0330: [
    'On xinwei, General of the Central Army Liu Yirong died.',
    'On xinwei, general of the central army Liu Yirong died.',
  ],
  s0331: [
    'On wuxu of the seventh month of autumn, Xuzhou and Yanzhou Inspector Zhao Bofu was made General of the Central Army.',
    'On wuxu in the seventh month of autumn, Xuzhou and Yanzhou inspector Zhao Bofu was appointed general of the central army.',
  ],
  s0332: [
    'On xinhai of the tenth month of winter, Prefect of Badong and Jianping commanderies Zang Zhi was made Xuzhou and Yanzhou Inspector.',
    'On xinhai of the tenth month of winter, Zang Zhi, prefect of Badong and Jianping, became Xuzhou and Yanzhou inspector.',
  ],
  s0333: [
    'On yimao, the commanderies of Nanyan, Puyang, and Nanguangping in Southern Xuzhou were abolished.',
    'On yimao the Southern Xuzhou commanderies Nanyan, Puyang, and Nanguangping were abolished.',
  ],
  s0334: [
    'On wuzi of the eleventh month, Vice Director of the Masters of Writing Wang Qiu died.',
    'On wuzi of the eleventh month, Vice Director Wang Qiu died.',
  ],
  s0335: [
    '[24] On jihai, Danyang Prefect Meng Yi was made Vice Director of the Masters of Writing.',
    '[24] On jihai, Danyang prefect Meng Yi was appointed vice director of the Masters of Writing.',
  ],
  s0336: [
    'Yang Nachang of the Di again raided Hanzhong.',
    'Yang Nachang of the Di again invaded Hanzhong.',
  ],
  s0337: [
    'On guihai of the twelfth month, Dragon Cavalry General Pei Fangming and Liang and Qin provinces Inspector Liu Zhendao were dispatched to attack him.',
    'On guihai of the twelfth month, Dragon Cavalry General Pei Fangming and Liang-Qin inspector Liu Zhendao were sent to suppress him.',
  ],
  s0338: [
    'That month, [25] Jinning Prefect Cuan Songzi rebelled; Ningzhou Inspector Xu Xun suppressed and pacified him.',
    'That month, [25] Jinning prefect Cuan Songzi rose in rebellion; Ningzhou inspector Xu Xun put down the revolt.',
  ],
  s0339: [
    'That year, Sute, Goguryeo, Sumali, and Linyi all sent envoys presenting tribute goods.',
    'That year envoys from Sute, Goguryeo, Sumali, and Linyi arrived with tribute.',
  ],
  s0340: [
    'On yisi of the first month in year 19, an edict said: "What one builds upon is the root—the distant teaching of sages and worthies;',
    'On yisi of the first month, year 19, an edict declared: "What is founded upon is the root—the far-off instruction of sages and worthies;',
  ],
  s0341: [
    'when the root is established, transformation through culture takes form, and reverent learning is held in esteem.',
    'once the root stands firm, culture takes shape through teaching, and devoted study is prized above all.',
  ],
  s0342: [
    'Therefore they were charged with the three virtues and honored with the four arts, so as to take in all proper directions and bring them to measure and rule.',
    'Hence the three virtues were enjoined and the four arts exalted, enabling every proper path to be gathered in and brought to standard.',
  ],
  s0343: [
    'In flourishing kingship and sage ages, [26] all necessarily followed this path.',
    'In ages of great kings and holy rulers, [26] none failed to walk this way.',
  ],
  s0344: [
    'When Yongchu first received the mandate, statutes and regulations were broad and far-reaching, intending to mold the myriad categories in the crucible and blend diverse customs into one; there were edicts to the directing offices to greatly open schools, but we repeatedly encountered hardships and disturbances and did not reach completion in building them.',
    'At the founding of Yongchu the laws were proclaimed on a grand scale, aiming to shape all ranks in the crucible and unify disparate customs; edicts ordered the responsible offices to open schools widely, yet repeated calamities left construction unfinished.',
  ],
  s0345: [
    'Ever gazing upon the former design, we think to spread the great achievement.',
    'Ever looking back to the plans of old, we long to extend that magnificent enterprise.',
  ],
  s0346: [
    'Now the four corners are at peace, barbarians and Chinese alike look in admiration, and broadly instructing the heirs—sons of the nobility—is truly the task of the age.',
    'Now the realm is tranquil, north and south look to the court, and to train the crown princes broadly is truly the urgent business of the time.',
  ],
  s0347: [
    'Let us at once model the established regulations and extend and display the resplendent enterprise."',
    'Let the court at once follow the settled precedent and raise high this splendid undertaking."',
  ],
  s0348: [
    'On jiaxu of the fourth month of summer, having recovered from long illness, he for the first time performed the yue sacrifice; [27] a general amnesty was proclaimed for the empire.',
    'On jiaxu of the fourth month of summer, recovered from a long illness, he offered the yue ancestral rites for the first time; [27] a general amnesty followed.',
  ],
  s0349: [
    'On gengyin of the fifth month, Liang and Qin provinces Inspector Liu Zhendao and Dragon Cavalry General Pei Fangming defeated Yang Nachang of the Di, and Chou Pool was pacified.',
    'On gengyin of the fifth month, Liu Zhendao and Pei Fangming crushed the Di leader Yang Nachang and pacified Chou Pool.',
  ],
  s0350: [
    'In the intercalary month, the capital region suffered rain flooding;',
    'In the intercalary month the capital was inundated by rain;',
  ],
  s0351: [
    'on dingsi, envoys were sent to tour and grant relief.',
    'on dingsi envoys were sent to inspect the damage and distribute relief.',
  ],
  s0352: [
    'On renwu of the sixth month, Juqu Wuhui of Northern Liang was made General Who Campaigns in the West and Liangzhou Inspector.',
    'On renwu of the sixth month, Juqu Wuhui of Northern Liang was appointed general who campaigns in the west and Liangzhou inspector.',
  ],
  s0353: [
    'In the seventh month of autumn, Liang and Qin provinces Inspector Liu Zhendao was made Yongzhou Inspector; Dragon Cavalry General Pei Fangming was made Liang and Southern Qin provinces Inspector.',
    'In the seventh month of autumn, Liu Zhendao moved from Liang and Qin to Yongzhou, and Pei Fangming became inspector of Liang and Southern Qin.',
  ],
  s0354: [
    'On the last day of jiaxu, there was a solar eclipse.',
    'At the end of jiaxu month-day, the sun was eclipsed.',
  ],
  s0355: [
    'On jiashen of the tenth month of winter, Rouran sent envoys presenting tribute goods.',
    'On jiashen of the tenth month of winter, Rouran sent envoys with tribute.',
  ],
  s0356: [
    'On jihai, Jinning Prefect Zhou Wansui was made Ningzhou Inspector.',
    'On jihai, Jinning prefect Zhou Wansui was appointed Ningzhou inspector.',
  ],
  s0357: [
    'On bingshen of the twelfth month, an edict said: "The heirs—sons are beginning to assemble and studies are just flourishing.',
    'On bingshen of the twelfth month an edict said: "The crown princes are gathering and learning is rising anew.',
  ],
  s0358: [
    'Since the subtle words were extinguished, nearly a thousand years have passed; moved by the matter we think of the man, and a sigh rises in the heart.',
    'Since the subtle teachings fell silent, nearly a millennium has gone by; reflecting on the affair, we think of the man and cannot but sigh.',
  ],
  s0359: [
    'The descendants of the Sage venerated in sacrifice—let succession be swiftly deliberated and appointed.',
    'Let the line of the Sage honored in sacrifice be quickly chosen for succession.',
  ],
  s0360: [
    'On the site of the former temple, let it be specially built, and as of old provide for sacrifice and appoint an overseer, with offerings in the four seasons.',
    'On the ground of the former shrine let a temple be specially erected; as before, provide for sacrifice, appoint a custodian, and offer seasonal rites in the four seasons.',
  ],
  s0361: [
    'Que Li has in the past suffered bandit turmoil; the school halls lie ruined—issue orders to Lu Commandery as well to repair the study halls and recruit students.',
    'Que Li has endured raids and disorder; its academy lies in ruins—order Lu Commandery likewise to restore the school buildings and enroll students.',
  ],
  s0362: [
    'Worthies and sages of old, and even a scrap of goodness, might still have their burial mounds guarded and pasturage on them forbidden—how much more Confucius, whose virtue marks the living generation and whose merit covers a hundred ages, while his tomb and grave lie waste and overgrown and brambles go uncut.',
    'Men of old, however slight their merit, might still have their mounds protected and grazing forbidden—how much more Confucius, whose virtue illumines the age and whose merit spans a hundred generations, while his grave lies desolate and thorns go untrimmed.',
  ],
  s0363: [
    'Let several households beside the tomb be exempted to take charge of sprinkling and sweeping.',
    'Exempt several households beside the tomb to tend sprinkling and sweeping.',
  ],
  s0364: [
    '"] The leading clansmen of Lu Commandery, Kong Jing and four other households totaling five, dwelling near Confucius\u2019s tomb, had their tax and corvée remitted, were supplied for sprinkling and sweeping, and moreover planted six hundred pine and cypress trees.',
    'Five leading households of Lu Commandery, including Kong Jing, living beside Confucius\u2019s tomb, were exempted from tax and corvée, supplied for upkeep, and planted six hundred pine and cypress trees.',
  ],
  s0365: [
    'That year, the state of Pohuang sent envoys presenting tribute goods.',
    'That year envoys from Pohuang arrived with tribute.',
  ],
  s0366: [
    'In the first month of spring in year 20, the Wan Spring and Thousand Autumns gates were opened east and west of the Terrace City.',
    'In the first month of spring, year 20, the Wan Spring and Thousand Autumns gates were opened on the east and west of the Terrace City.',
  ],
  s0367: [
    'On jiaxu of the second month, Jiangzhou Inspector Yu Dengzhi was made General of the Central Household Guards.',
    'On jiaxu of the second month, Jiangzhou inspector Yu Dengzhi became general of the central household guards.',
  ],
  s0368: [
    'On gengshen, [28] Prince of Luling Shao was made Jiangzhou Inspector.',
    'On gengshen, [28] Prince of Luling Shao was appointed Jiangzhou inspector.',
  ],
  s0369: [
    'Chou Pool was lost to the Northern barbarians.',
    'Chou Pool fell to the Northern Wei.',
  ],
  s0370: [
    'On jiashen, the imperial carriage reviewed troops at Baixia.',
    'On jiashen the emperor reviewed the army at Baixia.',
  ],
  s0371: [
    'On xinhai of the third month, General Who Pacifies the West and Jingzhou Inspector Prince of Hengyang Yiji was promoted to General Who Campaigns in the West.',
    'On xinhai of the third month, Prince of Hengyang Yiji, general who pacifies the west and Jingzhou inspector, was promoted to general who campaigns in the west.',
  ],
  s0372: [
    'Prefect of Baxi and Zitong commanderies Shen Tan was made Liang and Southern Qin provinces Inspector.',
    'Shen Tan, prefect of Baxi and Zitong, was appointed inspector of Liang and Southern Qin.',
  ],
  s0373: [
    'On jiawu of the fourth month of summer, the sixth prince, Dan, was established as Prince of Guangling.',
    'On jiawu of the fourth month of summer, the sixth prince Dan was enfeoffed as Prince of Guangling.',
  ],
  s0374: [
    'On guichou of the fifth month, General of the Central Household Guards Yu Dengzhi died.',
    'On guichou of the fifth month, general of the central household guards Yu Dengzhi died.',
  ],
  s0375: [
    'On guichou of the seventh month of autumn, Yang Wende was made General Who Campaigns in the West and Northern Qinzhou Inspector and enfeoffed as King of Wudu.',
    'On guichou of the seventh month of autumn, Yang Wende was made general who campaigns in the west and Northern Qinzhou inspector and enfeoffed as king of Wudu.',
  ],
  s0376: [
    'On xinyou, Colonel of the Southern Man Xiao Sihua was made Yongzhou Inspector.',
    'On xinyou, Colonel of the Southern Man Xiao Sihua was appointed Yongzhou inspector.',
  ],
  s0377: [
    'On jiazi, former Yongzhou Inspector Liu Zhendao and Liang and Southern Qin provinces Inspector Pei Fangming were guilty of crimes, cast into prison, and died there.',
    'On jiazi, former Yongzhou inspector Liu Zhendao and Liang-Southern Qin inspector Pei Fangming were found guilty, imprisoned, and died in custody.',
  ],
  s0378: [
    'On guiwei of the eighth month, Commandant of Punishments Tao Minzu was made Guangzhou Inspector.',
    'On guiwei of the eighth month, Commandant of Punishments Tao Minzu was appointed Guangzhou inspector.',
  ],
  s0379: [
    'On gengwu of the twelfth month of winter, Shixing Interior Secretary Tan Hezhi was made Jiaozhou Inspector.',
    'On gengwu of the twelfth month of winter, Shixing interior secretary Tan Hezhi was appointed Jiaozhou inspector.',
  ],
  s0380: [
    'On renwu, an edict said: "The state takes the people as its root; the people take food as their Heaven.',
    'On renwu an edict declared: "The state rests on the people; the people rest on grain.',
  ],
  s0381: [
    'Thus if one man stops plowing, hunger is sure to reach others.',
    'When a single farmer leaves the fields, hunger reaches his neighbors.',
  ],
  s0382: [
    'When the granaries are full, ritual and propriety arise.',
    'Full granaries give rise to ritual and decorum.',
  ],
  s0383: [
    'Of late in every place poverty is exhausted and households have no stored surplus.',
    'Lately every district is destitute and homes hold no reserve grain.',
  ],
  s0384: [
    'When taxes and corvée are for a time uneven, people harbor grief and distress;',
    'when levies fall unevenly, the people sink into misery;',
  ],
  s0385: [
    'when the year is sometimes not ripe, sickness and want visit neighboring houses.',
    'when harvests fail, sickness and want spread from door to door.',
  ],
  s0386: [
    'It is truly because governmental virtue does not win trust that we reach these abuses;',
    'This indeed comes of a government whose virtue has not won the people\u2019s trust;',
  ],
  s0387: [
    'yet also because plowing and sericulture are not widespread and the land\u2019s benefit is much left unused.',
    'yet also because farming and sericulture are not broad enough and much of the land\u2019s yield goes untapped.',
  ],
  s0388: [
    'Prefects and magistrates slight the means of instructing and guiding through moral transformation, and the common people forget the meaning of diligent apportionment of labor.',
    'Magistrates neglect to teach and guide, and the people forget their share of honest toil.',
  ],
  s0389: [
    'Ever speaking of broadly aiding the people, at dawn we bear it in mind.',
    'We speak constantly of relieving the people, and at daybreak the thought is still upon us.',
  ],
  s0390: [
    'Though regulations and orders issue repeatedly, in the end none are warned and encouraged—yet we sit and look for increase and growth; how can it be attained?',
    'Edicts rain down yet no one is moved to reform—still we expect abundance to appear of itself; how can that happen?',
  ],
  s0391: [
    'Let the responsible offices proclaim the old provisions and strive to the utmost in earnest instruction and assessment.',
    'Let the responsible offices publish the old statutes and press hard on earnest supervision and instruction.',
  ],
  s0392: [
    'All who wander and eat without fixed occupation are to be ordered to attach to occupations; examine and assess diligence and sloth, apply rewards and punishments, observe capacity in administration, and strictly carry out demotion and promotion.',
    'Vagrants are to be made to settle into work; diligence and idleness are to be checked, rewards and punishments enforced, competence in office observed, and promotion and dismissal applied rigorously.',
  ],
  s0393: [
    'In antiquity the emperor personally plowed the imperial fields and respectfully supplied the sacrificial grain; looking up to former kings, we think to follow the established canon.',
    'Ancient kings plowed the sacred fields themselves and furnished the sacrificial grain; looking to their example, we mean to follow that ordinance.',
  ],
  s0394: [
    'Let a measure of a thousand mu be set aside and the auspicious day divined.',
    'Let a thousand mu be marked out and the propitious day chosen by divination.',
  ],
  s0395: [
    'I shall personally lead the hundred officials and perform rites in the suburban fields, hoping that sincerity and simplicity will be spread upon this people."',
    'I shall lead the hundred officials in person to perform the suburban rites, so that honest simplicity may reach the people."',
  ],
  s0396: [
    'That year, Hexi, Goguryeo, Baekje, and Wa all sent envoys presenting tribute goods.',
    'That year envoys from Hexi, Goguryeo, Baekje, and Wa arrived with tribute.',
  ],
  s0397: [
    'That year, many provinces and commanderies suffered flood and drought damaging the crops; the people suffered great famine.',
    'That year floods and droughts ruined the harvest across many provinces and commanderies, and famine gripped the people.',
  ],
  s0398: [
    'Envoys were sent to open the granaries for relief and bestow grain and seed.',
    'Envoys were dispatched to open the storehouses, grant relief, and distribute grain and seed.',
  ],
  s0399: [
    'On jihai of the first month of spring in year 21, in Southern Xu, Southern Yu, and the region west of the Zhe River in Yang Province, [29] wine was prohibited throughout.',
    'On jihai of the first month of spring, year 21, Southern Xu, Southern Yu, and the lands west of the Zhe River in Yang Province [29] were placed under a general ban on wine.',
  ],
  s0400: [
    'A general amnesty was proclaimed for the empire.',
    'A general amnesty was declared for the empire.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_songshu_005_b4.mjs <translation.json>'
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
