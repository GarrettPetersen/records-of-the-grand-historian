#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'The Han, inheriting Qin\'s burning of books, greatly expanded Confucian instruction; Imperial University students often numbered in the tens of thousands, and district and commandery schoolhouses were all filled.',
    'Han, after Qin\'s book-burning, greatly promoted Confucian learning—Imperial University enrollees often ran to tens of thousands, and every district school was full.',
  ],
  s0002: [
    'Those studying in mountains and marshes might even set up as shop rows—the flourishing was such.',
    'Scholars in remote hills sometimes opened roadside stalls to teach—the scale was that great.',
  ],
  s0003: [
    'At the end of Han, amid turmoil and ruin, the Way declined.',
    'Late Han chaos made the tradition fade.',
  ],
  s0004: [
    'After Wei\'s Zhengshi era, dark and empty learning was still honored, and Confucians were few.',
    'From Wei\'s Zhengshi reign on, abstruse learning held sway and few remained true Confucians.',
  ],
  s0005: [
    'At the time Xun Yi, Zhi Yu, and their like, though they revised the new rites and changed offices and ranks, could not alter custom or shift the wind.',
    'Xun Yi, Zhi Yu, and others revised rites and offices but could not change society.',
  ],
  s0006: [
    'From then on the Central Plains collapsed in ruin, and the gentry were wiped out;',
    'Then the heartland collapsed and the elite perished;',
  ],
  s0007: [
    'the left bank of the Yangtze was newly founded, with not a day to spare;',
    'the south was newly settled, with no leisure for anything else;',
  ],
  s0008: [
    'and so it continued through Song and Qi.',
    'and so it went through Song and Qi.',
  ],
  s0009: [
    'The National University was sometimes opened, yet encouragement of study was not broad; establishments rarely lasted ten years—mostly for show on paper—while abandonment stretched over many generations; it was cast aside as if trivial.',
    'The National University opened now and then, but study was not widely urged; it rarely stood ten years, was often mere form, and was neglected for generations.',
  ],
  s0010: [
    'In the villages none opened halls; among ministers and grandees few mastered the classics.',
    'Villages had no schools; high officials rarely knew the classics.',
  ],
  s0011: [
    'Great scholars at court studied alone and would not nurture the multitude;',
    'Court masters studied alone and would not teach crowds;',
  ],
  s0012: [
    'the young were isolated and narrow, clutching the classics with no one to lecture and practice with.',
    'youth were isolated, holding texts with no one to instruct them.',
  ],
  s0013: [
    'The three virtues and six arts had long been abandoned.',
    'The three virtues and six arts had long lain in ruin.',
  ],
  s0014: [
    'When Gaozu gained the realm he deeply lamented this and issued an edict seeking eminent scholars to regulate the five rites, fix the six pitch-pipes, revise the dipper calendar, and correct weights and measures.',
    'Gaozu, having won the realm, deeply regretted this and ordered a search for great scholars to settle the five rites, six pitch-pipes, calendar, and weights.',
  ],
  s0015: [
    'In the fourth year of Tianjian an edict said: "In the two Han dynasties those who rose to office were all through classical learning; embracing the elegant Way, they established names and completed conduct.',
    'In Tianjian year four an edict said: "Under the two Han, promotion came through the classics; embracing the Way, men won fame and formed character.',
  ],
  s0016: [
    'Wei and Jin drifted in frivolity, Confucian teaching sank and ceased, and standards of conduct were not planted—this is the cause.',
    'Wei and Jin grew frivolous, Confucian teaching collapsed, and morals were not built—that is why.',
  ],
  s0017: [
    'I, from morning to evening after court, think to hear of outstanding men; to gather scholars and gain men is truly a matter of reward.',
    'I, weary from dawn court, long to hear of talent; to gather scholars deserves reward.',
  ],
  s0018: [
    'Let there be one Erudite for each of the Five Classics, broadly open halls, and recruit the young within.',
    'Appoint one Erudite per Five Classic, open halls widely, and recruit young students.',
  ],
  s0019: [
    '"; Thereupon Ming Shanbin of Pingyuan, Shen Jun of Wuxing, Yan Zhizhi of Jianping, and He Chang of Kuaiji were appointed erudites, each presiding over one hall.',
    '"; then Ming Shanbin of Pingyuan, Shen Jun of Wuxing, Yan Zhizhi of Jianping, and He Chang of Kuaiji became erudites, each heading a hall.',
  ],
  s0020: [
    'Each hall had several hundred students, supplied with grain stipends.',
    'Each hall held hundreds of students on grain stipends.',
  ],
  s0021: [
    'Those who in the archery examination showed penetrating mastery were at once appointed officials.',
    'Those who passed the archery examination with clear mastery were made officials at once.',
  ],
  s0022: [
    'Within a dozen months those bearing the classics in satchels on their backs gathered at the capital like clouds.',
    'Within months scholars with satchels of classics flocked to the capital.',
  ],
  s0023: [
    'Students were also selected and sent to Cloud Gate Mountain in Kuaiji to study under He Yin of Lujiang.',
    'Students were sent to Cloud Gate Mountain in Kuaiji to study with He Yin of Lujiang.',
  ],
  s0024: [
    'Erudites and libationers were dispatched to establish schools in prefectures and commanderies.',
    'Erudites and libationers were sent to found schools in the provinces.',
  ],
  s0025: [
    'In the seventh year another edict said: "To found a state and rule the people, establishing teaching comes first; to polish the person and sharpen conduct depends on classical learning.',
    'In year seven another edict said: "To found a state and govern the people, teaching comes first; self-cultivation depends on the classics.',
  ],
  s0026: [
    'I, at the beginning of bright mandate, have made the realm my dwelling; though I have cultivated elegant pursuits and opened arts on every side, finished vessels are not yet broad and the root of intent is still lacking.',
    'I began with bright mandate and hold the realm; though I have pursued learning and arts, too few are fully formed and the root of intent still lacks.',
  ],
  s0027: [
    'It is not to mold and cast the noble scions and bring them within measure;',
    'It is not merely to mold noble youth into measure;',
  ],
  s0028: [
    'I wish to model deep respect for elders and, from the family, impose law on the state.',
    'I wish to honor elders and let family discipline shape the state.',
  ],
  s0029: [
    'Now where sound and instruction reach, barbarian and Chinese share one wind.',
    'Now where teaching reaches, barbarians and Chinese share one custom.',
  ],
  s0030: [
    'Let the great schools be broadly opened, the sons of the nobility widely gathered, attend to those ten bonds, and spread these three virtues, so that the potter\'s wheel reaches far and subtle words are set forth.',
    'Open the great schools, gather noble sons, uphold the ten bonds and three virtues, so teaching reaches far and subtle doctrine is displayed.',
  ],
  s0031: [
    'Thereupon the crown prince, princes, imperial clansmen, kings, and marquises first took up study.',
    'Then crown prince, princes, imperial kin, kings, and marquises began their studies.',
  ],
  s0032: [
    'Gaozu himself bent the carriage and performed the offering sacrifice to the former teacher and former sage, followed it with feasting talk, and rewarded them with silks—vast and grand was the procession of the Great Way.',
    'Gaozu himself came in his carriage to sacrifice to the ancient sages, feasted and spoke with them, and gave silk gifts—so grandly did the Great Way proceed.',
  ],
  s0033: [
    'Fu Manrong, He Tongzhi, and Fan Zhen had old fame in the world;',
    'Fu Manrong, He Tongzhi, and Fan Zhen were already famed;',
  ],
  s0034: [
    'among contemporary Confucians, Yan Zhizhi, He Chang, and others were first chosen for these posts.',
    'among scholars of the day Yan Zhizhi, He Chang, and others led the appointments.',
  ],
  s0035: [
    'Now they are all gathered into this "Biographies of Confucian Scholars."',
    'They are now collected in this Biography of Confucian Scholars.',
  ],
  s0036: [
    'Fu Manrong',
    'Fu Manrong',
  ],
  s0037: [
    'Fu Manrong, courtesy name Gongyi, was a man of Anqiu in Pingchang.',
    'Fu Manrong, styled Gongyi, was from Anqiu in Pingchang.',
  ],
  s0038: [
    'His great-grandfather Tao was Jin Director of Composition.',
    'His great-grandfather Tao was Jin Director of Composition.',
  ],
  s0039: [
    'His father Yin-zhi was Song Master of Records in the Department of State Affairs.',
    'His father Yin-zhi was Song Master of Records in the Secretariat.',
  ],
  s0040: [
    'Manrong lost his father early and lived as a guest in Nanhai with his mother and elder brother.',
    'Manrong was orphaned young and lodged in Nanhai with his mother and brother.',
  ],
  s0041: [
    'In youth he was devoted to learning, skilled in the Laozi and Changes, bold and fond of grand talk, and often said: "He Yan doubted nine matters in the Changes.',
    'Young, he studied hard, knew the Laozi and Changes, was bold and fond of bold talk, and often said: "He Yan doubted nine points in the Changes.',
  ],
  s0042: [
    'In my view Yan did not study at all—thus one knows Ping-shu had his shortcomings.',
    'By my lights Yan never studied—so Ping-shu had his flaws.',
  ],
  s0043: [
    '" He gathered pupils and taught to make his living.',
    '"; he gathered students and taught for a living.',
  ],
  s0044: [
    'He served as staff aide to the Rapid Cavalry General.',
    'He was staff aide to the Rapid Cavalry General.',
  ],
  s0045: [
    'Emperor Ming of Song loved the Book of Changes, gathered court ministers in the Clear Summer Hall to lecture, and ordered Manrong to hold the classic.',
    'Song Emperor Ming loved the Changes, gathered the court in Clear Summer Hall, and had Manrong hold the text.',
  ],
  s0046: [
    'Manrong was always handsome in bearing; the emperor constantly compared him to Ji Kang and had the Wu man Lu Tanwei paint Ji Kang\'s portrait to give him.',
    'Manrong was handsome; the emperor likened him to Ji Kang and had Lu Tanwei paint Ji Kang\'s image as a gift.',
  ],
  s0047: [
    'He was promoted to Secretariat staff aide.',
    'He became Secretariat staff aide.',
  ],
  s0048: [
    'When Yuan Can was Governor of Danyang he invited him as magistrate of Jiangning; Manrong entered court as Outer Director in the Ministry of War.',
    'Yuan Can as Danyang governor made him Jiangning magistrate; he entered as Outer Director in the Ministry of War.',
  ],
  s0049: [
    'At the end of the Shengming era he was chief clerk to the Army of Assistance and Governor of Nanhai.',
    'Late in Shengming he was chief clerk to the Army of Assistance and Nanhai governor.',
  ],
  s0050: [
    'Early in Qi he was Regular Attendant and Cavalier Attendant-in-Ordinary.',
    'Early Qi he was Regular Attendant and Cavalier Attendant-in-Ordinary.',
  ],
  s0051: [
    'Early in Yongming he was Director of the Crown Prince\'s Household and attended the crown prince\'s lectures.',
    'Early Yongming he directed the crown prince\'s household and attended his lectures.',
  ],
  s0052: [
    'Guard General Wang Jian was deeply friendly with him and had him join Sima Xian of Henei and Lu Cheng of Wu commandery in compiling Explanations of Mourning Dress, and when that was done wished to fix rites and music with them.',
    'Wang Jian befriended him and had him join Sima Xian and Lu Cheng to draft Explanations of Mourning Dress; when done Jian wished to fix rites and music with them.',
  ],
  s0053: [
    'When Jian died Manrong was promoted to Secretariat Gentleman and staff adviser to the Grand Marshal, then went out as Governor of Wuchang.',
    'Jian died; Manrong became Secretariat Gentleman and Grand Marshal staff adviser, then Wuchang governor.',
  ],
  s0054: [
    'In the Jianwu era he entered as Palace Regular.',
    'In Jianwu he entered as Palace Regular.',
  ],
  s0055: [
    'At the time Emperor Ming did not value Confucian learning; Manrong\'s house lay east of Waguan Temple, and in the reception hall he set a high seat—whenever guests came he mounted it to lecture, and pupils often numbered in the dozens or hundreds.',
    'Ming did not esteem Confucianism; east of Waguan Temple Manrong set a high seat in his hall and lectured to dozens or hundreds of students.',
  ],
  s0056: [
    'When the Liang regime was being founded, as an old Confucian he was summoned as Marshal and went out as Governor of Linhai.',
    'When Liang was founded he was summoned as Marshal as an elder scholar, then Linhai governor.',
  ],
  s0057: [
    'In the first year of Tianjian he died in office, aged eighty-two.',
    'In Tianjian year one he died in office at eighty-two.',
  ],
  s0058: [
    'He wrote commentaries on the Book of Changes, Mao Odes, Collected Explanations of Mourning Dress, Laozi, Zhuangzi, and Explanations of the Analects.',
    'He wrote on the Changes, Mao Odes, mourning dress, Laozi, Zhuangzi, and the Analects.',
  ],
  s0059: [
    'His son Gao Peng appears in Biographies of Good Officials.',
    'His son Gao Peng is in Biographies of Good Officials.',
  ],
  s0060: [
    'He Tongzhi',
    'He Tongzhi',
  ],
  s0061: [
    'He Tongzhi, courtesy name Shiwei, was a man of Qian in Lujiang, sixth-generation descendant of Regional Inspector Yun.',
    'He Tongzhi, styled Shiwei, of Qian in Lujiang, was sixth generation from Inspector Yun.',
  ],
  s0062: [
    'His grandfather Shao-zhi was Song Supernumerary Cavalier Attendant-in-Ordinary.',
    'His grandfather Shao-zhi was Song Supernumerary Cavalier Attendant-in-Ordinary.',
  ],
  s0063: [
    'His father Xin was Qi Court Gentleman.',
    'His father Xin was Qi Court Gentleman.',
  ],
  s0064: [
    'Tongzhi in youth loved the Three Rites, studied with heart alone, was strong and wholly devoted, his hand never leaving the scroll; he read two hundred chapters of ritual discourse and could recite nearly all from memory.',
    'Young Tongzhi loved the Three Rites, studied alone with tireless devotion, read two hundred chapters of ritual discourse and could recite most by heart.',
  ],
  s0065: [
    'At the time Grand Marshal Wang Jian was the age\'s Confucian leader and greatly esteemed him.',
    'Grand Marshal Wang Jian, the age\'s Confucian leader, greatly esteemed him.',
  ],
  s0066: [
    'He first took office as Yangzhou staff member, then became a scholar at the Zongming Hall, and was repeatedly promoted to Secretariat and Cavalry staff officer and Director of the Ancestral Temples.',
    'He began as Yangzhou staff, became Zongming Hall scholar, and rose to Secretariat cavalry staff officer and Director of Ancestral Temples.',
  ],
  s0067: [
    'In the Jianwu era of Qi he was staff recorder to the Army of the North and attended the crown prince\'s lectures, holding the post of chief of the Danyang district.',
    'In Qi Jianwu he was northern army recorder, attended crown prince lectures, and was Danyang district chief.',
  ],
  s0068: [
    'At the time Infantry Commandant Liu Huan and Recluse Wu Bao had already died; among eminent Confucians of the capital only Tongzhi remained.',
    'Liu Huan and Wu Bao were dead; in the capital only Tongzhi remained among great scholars.',
  ],
  s0069: [
    'Tongzhi was clear and practiced in matters of number; at the time the state\'s auspicious and inauspicious ritual rules all took his decision, and his name weighed in the world.',
    'Tongzhi knew ritual detail; state rites for fortune and misfortune all followed his judgment, and his fame was great.',
  ],
  s0070: [
    'He served as Infantry Commandant and Erudite of the National University, then was promoted to staff adviser to the Rapid Cavalry General and transferred to Marshal.',
    'He was Infantry Commandant and university erudite, then rapid-cavalry staff adviser and marshal.',
  ],
  s0071: [
    'At the end of Yongyuan, when the capital was in military turmoil, Tongzhi still gathered students to lecture and discuss, diligent and unwearying.',
    'At Yongyuan\'s end, amid capital turmoil, he still lectured students tirelessly.',
  ],
  s0072: [
    'Early in the Restoration he was appointed General of Valiant Cavalry.',
    'Early in the Restoration he became General of Valiant Cavalry.',
  ],
  s0073: [
    'When Gaozu took the throne he honored Confucian learning and made Tongzhi Left Director of the Department of State Affairs.',
    'Gaozu honored Confucianism and made him Left Director of the Secretariat.',
  ],
  s0074: [
    'At the time the hundred offices were newly founded; Tongzhi, following the Rites, settled decisions and contributed much.',
    'Offices were newly founded; Tongzhi settled many matters by the Rites.',
  ],
  s0075: [
    'In the second year of Tianjian he died in office, aged fifty-five.',
    'In Tianjian year two he died in office at fifty-five.',
  ],
  s0076: [
    'Gaozu deeply mourned him and was about to confer posthumous office;',
    'Gaozu mourned him and meant to grant posthumous rank;',
  ],
  s0077: [
    'by precedent a left director received no posthumous appointment, but a special edict granted Yellow Gate Gentleman, to the glory of Confucians.',
    'left directors had no posthumous rank by precedent, but an edict made him Yellow Gate Gentleman—honor for scholars.',
  ],
  s0078: [
    'His writings—essays and ritual discourse—numbered over a hundred pieces.',
    'He left over a hundred essays and ritual treatises.',
  ],
  s0079: [
    'Sons: Chaoyin and Chaohui.',
    'Sons: Chaoyin and Chaohui.',
  ],
  s0080: [
    'Fan Zhen, courtesy name Zizhen, was a man of Wuyang in Nanxiang.',
    'Fan Zhen, styled Zizhen, was from Wuyang in Nanxiang.',
  ],
  s0081: [
    'Sixth-generation descendant of Jin\'s General Who Pacifies the North Wang.',
    'He was sixth generation from Jin General Who Pacifies the North Wang.',
  ],
  s0082: [
    'His grandfather Qu-zhi was Secretariat Gentleman.',
    'His grandfather Qu-zhi was Secretariat Gentleman.',
  ],
  s0083: [
    'His father Meng died early.',
    'His father Meng died young.',
  ],
  s0084: [
    'Zhen was orphaned young and poor, and served his mother with filial care.',
    'Orphaned and poor, he served his mother with filial care.',
  ],
  s0085: [
    'Before he had reached the capping age he heard that Liu Huan of Pei commandery was gathering a crowd to lecture.',
    'Before capping age he heard Liu Huan of Pei was lecturing to a crowd.',
  ],
  s0086: [
    'He first went to follow him—outstanding among the group yet diligent in study; Huan marveled at him and personally capped him.',
    'He went to study—stood out yet worked hard; Huan marveled and capped him himself.',
  ],
  s0087: [
    'He remained at Huan\'s gate for years, coming and going home, always in straw sandals and plain cloth, walking on foot along the road.',
    'Years at Huan\'s gate he went home in straw sandals and plain cloth, walking on foot.',
  ],
  s0088: [
    'Many at Huan\'s gate were chariots and noble travelers; Zhen in that company felt not the least shame.',
    'Huan\'s gate held carriages and nobles; Zhen among them felt no shame.',
  ],
  s0089: [
    'When grown he was broadly versed in the classics, especially skilled in the Three Rites.',
    'Grown, he mastered the classics, especially the Three Rites.',
  ],
  s0090: [
    'His nature was upright; he loved stern words and lofty discourse and did not put his scholar friends at ease.',
    'Upright by nature, he loved sharp talk and lofty argument and unsettled his peers.',
  ],
  s0091: [
    'Only with his cousin on his mother\'s side, Xiao Chen, was he close; Chen was famed for eloquence and always yielded to Zhen\'s terse phrasing.',
    'Only his maternal cousin Xiao Chen was close; Chen was famed for eloquence yet yielded to Zhen\'s brevity.',
  ],
  s0092: [
    'He first took office as Registrar to the Pacifier of the Barbarians of Qi, and was repeatedly promoted to Director in the Palace Secretariat.',
    'He began as Qi Pacifier registrar and rose to Palace Secretariat director.',
  ],
  s0093: [
    'In the Yongming era, when peace was made with Wei and yearly embassies were exchanged, men of talent and learning were specially chosen as envoys.',
    'In Yongming, at peace with Wei and yearly embassies, the ablest scholars were chosen as envoys.',
  ],
  s0094: [
    'Zhen and his cousin Yun, Xiao Chen, Yan Youming of Langye, and Pei Zhaoming of Hedong in succession bore the mission, all famed in neighboring states.',
    'Zhen, his cousin Yun, Xiao Chen, Yan Youming, and Pei Zhaoming served in turn and were famed abroad.',
  ],
  s0095: [
    'At the time Prince of Jingling Zi Liang greatly gathered guests, and Zhen also took part.',
    'Prince of Jingling Zi Liang gathered many guests, and Zhen was among them.',
  ],
  s0096: [
    'In the Jianwu era he was promoted to chief clerk of the Army of the Palace Guard.',
    'In Jianwu he became Palace Guard chief clerk.',
  ],
  s0097: [
    'He went out as Governor of Yidu; when his mother died he left office and returned to live in the southern provinces.',
    'He was Yidu governor; at his mother\'s death he left office and lived in the south.',
  ],
  s0098: [
    'When the righteous army arrived, Zhen came in black hemp mourning to welcome them.',
    'When the righteous army came, Zhen came in hemp mourning to welcome it.',
  ],
  s0099: [
    'Gaozu and Zhen had old ties from the Western Lodge; seeing him he was very pleased.',
    'Gaozu had Western Lodge ties with Zhen and was very pleased to see him.',
  ],
  s0100: [
    'When Jiankang was pacified he made Zhen Governor of Jin\'an; in the commandery he was pure and frugal, living only on public salary.',
    'When Jiankang fell he made Zhen Jin\'an governor; in office he was frugal and lived on salary alone.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_048_b1.mjs <translation.json>'
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
