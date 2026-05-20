#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'The Changes says: "The noble man withdraws from the world without vexation; he stands alone without fear.',
    'The Changes says, "The noble man may leave the world yet feel no vexation; he may stand alone yet feel no fear.',
  ],
  s0002: [
    '" Confucius called Changju and Jieni recluses.',
    '" Confucius praised Changju and Jieni as men who had withdrawn.',
  ],
  s0003: [
    'Recluses of old, shamed to hear of abdication and transfer of the throne, loftily yielded the imperial seat and took the chariot of ten thousand as filth and disgrace, going to death without regret.',
    'Men of old who withdrew, shamed by tales of abdication, refused the throne and treated imperial power as stain and shame, facing death without regret.',
  ],
  s0004: [
    'These lightly valued life and heavily valued the Way, hoping to leave the common world—they are recluses of the highest kind.',
    'They prized the Way above life and sought to step outside the world—the highest sort of recluse.',
  ],
  s0005: [
    'Some took office as gatekeepers, others lodged as ministers beneath the pillar, dwelling in ease to seek their aim and standing in filth without shame on their faces.',
    'Some served as gatekeepers or clerks under the pillar, living simply to pursue their purpose and dwelling in corruption without losing their color.',
  ],
  s0006: [
    'This is what is called great reclusion hidden in market and court—the next rank down.',
    'This is the great recluse who hides in market and court—the next rank.',
  ],
  s0007: [
    'Some went naked and feigned madness, blind and mute, cutting themselves off from the age, casting aside rites and music to return to the Way, enduring the abandonment of filial piety and kindness without care.',
    'Some stripped naked and played mad, blind and mute, rejecting the age, casting off rites and music for the Way and enduring without filial kindness.',
  ],
  s0008: [
    'These preserved the body and kept far from harm, attaining the Way of the great Odes—the next rank down again.',
    'These kept body whole and harm distant, attaining the great Odes\' Way—again the next rank.',
  ],
  s0009: [
    'Yet alike they did not lose the reach of silence and speech; they had the reclusive man\'s steadfast good fortune.',
    'Yet all alike kept the balance of silence and speech and possessed the reclusive man\'s steadfast fortune.',
  ],
  s0010: [
    'Compared with those who end their lives in a chaotic age and strive for profit against the times—can they be spoken of in the same year?',
    'How can they be named in the same breath as men who waste their lives in chaos and scramble for profit?',
  ],
  s0011: [
    'Mencius says: "People today toward rank and stipend—gaining them is like gaining life, losing them is like losing life.',
    'Mencius says, "Today\'s men treat rank and salary as they do life itself—gain feels like birth, loss like death.',
  ],
  s0012: [
    '" The Huainanzi says: "All men mirror themselves in still water, not in rushing flood.',
    '" The Huainanzi says, "Everyone takes his mirror from still water, never from a rushing torrent.',
  ],
  s0013: [
    '" Who can clarify the muddy, stir the pure, check greed and halt rivalry? Only the recluse!',
    '" Who can clarify what is foul, lift what is pure, and curb greed and rivalry? Only the recluse.',
  ],
  s0014: [
    'From antiquity no emperor or king has failed to honor this Way.',
    'Every emperor and king since antiquity has honored this Way.',
  ],
  s0015: [
    'Though Tang Yao did not bow to Chao and Xu, and King Wu of Zhou did not descend to Yi and Qi;',
    'Tang Yao would not bow to Chao and Xu, and King Wu would not humble himself before Yi and Qi;',
  ],
  s0016: [
    'Han Gaozu in his insolence yet received the long bow of Huang and Qi, and Guangwu applied the law yet bent his will before Yan and Zhou;',
    'yet Han Gaozu, for all his rudeness, met Huang and Qi with a long bow, and Guangwu bent the law for Yan and Zhou;',
  ],
  s0017: [
    'from then on, generation after generation has had such men!',
    'and since then every age has known such men.',
  ],
  s0018: [
    'In the splendor of Liang they continued this wind and teaching.',
    'Liang at its height carried on this tradition.',
  ],
  s0019: [
    'These were men whose virtue could be taken as model and whose learning and craft could be taken as pattern—hence they fill the "Biographies of Retired Gentlemen."',
    'Their conduct could be honored and their arts imitated—hence this "Biographies of Retired Gentlemen."',
  ],
  s0020: [
    'He Dian, styled Zishe, was a man of Qian in Lujiang commandery.',
    'He Dian, styled Zishe, came from Qian in Lujiang commandery.',
  ],
  s0021: [
    'His grandfather Shangzhi was Song Minister of Works.',
    'His grandfather Shangzhi had been Song Minister of Works.',
  ],
  s0022: [
    'His father Shuo was Grand Administrator of Yidu.',
    'His father Shuo was grand administrator of Yidu.',
  ],
  s0023: [
    'Shuo had long suffered wind illness and without cause harmed his wife; by law he was put to death.',
    'Shuo had long suffered a wind disorder and, without cause, killed his wife; he was executed by law.',
  ],
  s0024: [
    'Dian at eleven nearly destroyed himself in grief.',
    'At eleven Dian nearly destroyed himself in mourning.',
  ],
  s0025: [
    'When grown, moved by the family calamity, he wished to renounce marriage and office; Shangzhi forced him to marry a woman of the Wang clan of Langya.',
    'Grown, he wished to renounce marriage and office after the family tragedy; Shangzhi forced him to wed a woman of the Wang clan of Langya.',
  ],
  s0026: [
    'When the rites were complete and he was to go fetch the bride in person, Dian wept again and again, begging to hold to his original resolve, and at last was released.',
    'When the rites ended and he was to fetch the bride, Dian wept and begged to keep his resolve until the wedding was called off.',
  ],
  s0027: [
    'His bearing was square and refined; he mastered many books and was skilled in discourse.',
    'Square and refined in bearing, he mastered many books and excelled in talk.',
  ],
  s0028: [
    'His family was originally of the first great clans, with many noble kin by marriage.',
    'His house was of the highest clans, with many noble connections.',
  ],
  s0029: [
    'Though Dian did not enter the city offices, he wandered the human world without cap or belt, sometimes driving a brushwood cart and treading grass sandals, going wherever his heart wished and returning drunk; many scholar-officials admired and followed him, and men of the time called him the "Universal Recluse."',
    'Though he never entered the prefectural city, he roamed the world bareheaded, sometimes in a brushwood cart and grass sandals, wandering until drunk while scholars flocked to him—men called him the Universal Recluse.',
  ],
  s0030: [
    'His elder brother Qiu also lived in retirement on Tiger Hill in Wu commandery.',
    'His elder brother Qiu also dwelt in seclusion on Tiger Hill in Wu commandery.',
  ],
  s0031: [
    'When Qiu died, Dian ate vegetables and drank no wine until the three years were done; his sash and belt were half what they had been.',
    'When Qiu died, Dian ate only vegetables and drank no wine for three years, his sash and belt half their former width.',
  ],
  s0032: [
    'At the end of Song\'s Taishi era he was summoned as Crown Prince\'s Household Steward.',
    'Late in Song Taishi he was summoned as crown prince\'s household steward.',
  ],
  s0033: [
    'Early in Qi he was repeatedly summoned as Palace Secretary and Crown Prince\'s Household Vice-Attendant; he never accepted.',
    'Early in Qi he was repeatedly summoned as palace secretary and crown prince\'s household vice-attendant and always refused.',
  ],
  s0034: [
    'With Xie Tiao of Chen commandery, Zhang Rong of Wu, and Kong Zhigui of Kuaiji he was bosom friend.',
    'With Xie Tiao of Chen commandery, Zhang Rong of Wu, and Kong Zhigui of Kuaiji he was inseparable friend.',
  ],
  s0035: [
    'His cousin Dun took the Eastern Hedge Gate garden as his dwelling; Zhigui built a house for him there.',
    'His cousin Dun lived in the Eastern Hedge Gate garden; Zhigui built him a house there.',
  ],
  s0036: [
    'Within the garden was the tomb of Bian the Loyal Martyr; Dian planted flowers beside the tomb and whenever he drank always raised a cup and poured a libation.',
    'In the garden lay the tomb of Bian the Loyal Martyr; Dian planted flowers beside it and never drank without pouring a libation.',
  ],
  s0037: [
    'Earlier, Chu Yuan and Wang Jian were chancellors; Dian told someone: "I wrote in my \'Praise for the Qi Annals,\' \'Yuan is already a great clan, Jian also a national flower;',
    'When Chu Yuan and Wang Jian were chancellors, Dian said, "In my Praise for the Qi Annals I wrote, \'Yuan is already a great clan, Jian also a national flower;',
  ],
  s0038: [
    'not relying on maternal kin, how could they spare thought for the state.\'',
    'not relying on maternal kin—how could they spare thought for the state?\'',
  ],
  s0039: [
    '" When Wang Jian heard this he wished to visit Dian but knew he could not be seen and stopped.',
    '" Wang Jian wished to visit when he heard this but knew Dian would not receive him and desisted.',
  ],
  s0040: [
    'Prince Jingling of Yuzhang ordered his carriage to visit Dian; Dian slipped out the back gate and fled.',
    'Prince Jingling of Yuzhang drove to visit him; Dian fled by the back gate.',
  ],
  s0041: [
    'The Minister of Works, Prince Ziliang of Jingling, wished to go see him; Dian was then at Falun Temple, and Ziliang went to invite him; Dian came to the mat in a kerchief, and Ziliang was endlessly delighted and sent Dian Ji Kang\'s wine cup and Xu Jingshan\'s wine kettle.',
    'Prince Ziliang of Jingling wished to see him; Dian was at Falun Temple and Ziliang went to invite him; Dian took the mat in a kerchief while Ziliang rejoiced and sent Ji Kang\'s wine cup and Xu Jingshan\'s wine kettle.',
  ],
  s0042: [
    'In youth Dian once suffered from wasting thirst and dysentery and for years was not cured.',
    'In youth he suffered wasting thirst and dysentery for years without cure.',
  ],
  s0043: [
    'Later at Stone Buddha Monastery in Wu he established a lecture; at the lecture hall he napped by day and dreamed of a Taoist of extraordinary appearance who gave him a handful of pills; in the dream he swallowed them, and from then on he recovered—men of the time took it as the response of pure virtue.',
    'Later at Stone Buddha Monastery in Wu he lectured; napping in the hall he dreamed a Taoist of strange aspect gave him a handful of pills; he swallowed them in the dream and recovered—men called it the reward of pure virtue.',
  ],
  s0044: [
    'By nature he was free and easy, fond of giving; gifts came from far and near and he refused none, soon scattering them again.',
    'Free and generous by nature, he accepted gifts from far and near and soon gave them all away again.',
  ],
  s0045: [
    'Once passing along Vermilion Bird Gate Street, someone stole clothing from behind his cart; he saw it but said nothing; a bystander seized the thief and returned the clothes; Dian then gave the clothes to the thief; the thief dared not accept; Dian ordered him reported to the authorities; the thief in fear then accepted and was urged to leave quickly.',
    'Once on Vermilion Bird Gate Street a man stole clothes from behind his cart; Dian saw but said nothing; when a bystander caught the thief and returned the clothes, Dian gave them to the thief; the thief refused until Dian threatened to report him, then fled in haste.',
  ],
  s0046: [
    'Dian had fine discernment in human relations and promoted many; he knew Qiu Chi of Wu commandery as a child and praised Jiang Yan of Jiyang in humble circumstances—both exactly as he said.',
    'He judged men finely and advanced many; as a boy he marked Qiu Chi of Wu and Jiang Yan of Jiyang in poverty—both proved as he said.',
  ],
  s0047: [
    'When Dian was old he again married the daughter of Kong Si of Lu; Si was also a recluse.',
    'In old age he again married the daughter of Kong Si of Lu, himself a recluse.',
  ],
  s0048: [
    'Though married, Dian still did not meet his wife face to face, building a separate room to lodge her—no one understood his intent.',
    'Though married, he never met his wife face to face but lodged her in a separate room—no one fathomed why.',
  ],
  s0049: [
    'Zhang Rong of Wu in youth had been dismissed from office and wrote poetry with lofty words; Dian answered in verse: "Long ago I heard of the eastern capital\'s sun—not yet before the bamboo annals."',
    'Zhang Rong of Wu, dismissed young, wrote lofty verse; Dian replied, "Long ago I heard of the eastern capital\'s sun—not yet before the bamboo annals."',
  ],
  s0050: [
    'Though in jest, Rong took the wound to heart.',
    'Though jest, Rong brooded on the barb.',
  ],
  s0051: [
    'When Dian later married, Rong first wrote a poem to gift Dian: "Alas, Master He—at dusk you meet debauched lewdness."',
    'When Dian married at last, Rong sent verse: "Alas, Master He—at dusk you meet debauched lewdness."',
  ],
  s0052: [
    'Dian too was wounded but had no way to explain.',
    'Dian smarted too but could not answer.',
  ],
  s0053: [
    'Gaozu had old ties with Dian; when he took the throne he wrote by hand: "Long ago in much leisure I could visit your hidden track, sit among bamboo by a clear pool, forget present speech for ancient talk—what joy!',
    'Gaozu had known Dian; on taking the throne he wrote, "Long ago in leisure I visited your hidden path, sat in bamboo by a clear pool, forgot present for ancient talk—what joy!',
  ],
  s0054: [
    'For a time I left hill and garden—fourteen years; human affairs were hard and obstructed—what more can be said.',
    'I left your hill garden fourteen years; affairs were hard—what more can be said.',
  ],
  s0055: [
    'Since Heaven\'s mandate was mine I have often wished to meet; I searched for you in secret, laboring much on mountain slopes.',
    'Since Heaven\'s mandate fell to me I have longed to meet you and searched the mountains in secret with great labor.',
  ],
  s0056: [
    'Yan Guang brushed aside the ninefold gates, trod the nine ranks, spoke of Heaven and man and old friendship—what harm if he would not be subject?',
    'Yan Guang brushed past the nine gates, walked the nine ranks, spoke of Heaven and man and old ties—what harm in one who would not bow?',
  ],
  s0057: [
    'Wen first visited Zihuan in skin cap; Bozhuang met Wenshu in silk gauze—seeking precedents in former ages, there are none without earlier examples.',
    'Wen first visited Zihuan in skin cap; Bozhuang met Wenshu in gauze silk—former ages offer precedents enough.',
  ],
  s0058: [
    'Now I gift you a deer-skin kerchief and the like.',
    'Now I send you a deer-skin kerchief and the like.',
  ],
  s0059: [
    'In a few days I hope you can enter."',
    'In a few days I hope you will come in."',
  ],
  s0060: [
    'Dian was led into Hualin Garden in cloth and coarse dress; Gaozu was very pleased, composed poetry and set out wine, favor and courtesy as of old.',
    'Dian entered Hualin Garden in kerchief and homespun; Gaozu rejoiced, set out verse and wine, and treated him with the old kindness.',
  ],
  s0061: [
    'An edict followed: "Former Recluse He Dian—lofty in his Way, his will content with a knee\'s breadth of room, casting off the bodily frame, nesting his aim in the deep dark.',
    'An edict followed: "Former recluse He Dian—lofty in the Way, content with a knee\'s breadth of room, casting off the body, nesting his aim in the deep dark.',
  ],
  s0062: [
    'I toil at sunset thinking on government and still look up to former sages;',
    'I toil at government till sunset and still look up to former sages;',
  ],
  s0063: [
    'how much more when I have obtained one of the same time and do not govern with him.',
    'how much more when I hold one of the same age and do not govern with him.',
  ],
  s0064: [
    'Throat and lips have urgent duty and must await the state\'s good men; I truly hope you will come graciously and bend to counsel and correction.',
    'Throat and lips have urgent work and must await the state\'s good men; I truly hope you will come and bend to counsel.',
  ],
  s0065: [
    'He may be summoned as Palace Attendant."',
    'Let him be summoned as palace attendant."',
  ],
  s0066: [
    'He pleaded illness and did not go.',
    'He pleaded illness and did not go.',
  ],
  s0067: [
    'Another edict said: "Recluse He Dian dwells in integrity beyond things, lets his heart roam outside the dust; the easy and level wind he leads comes from far by nature.',
    'Another edict said: "Recluse He Dian dwells in integrity beyond things and lets his heart roam outside the dust; the easy wind he leads comes from afar by nature.',
  ],
  s0068: [
    'Formerly, following his constant aim, we spoke freely at banquet; I cherish Ziling in feeling as well as old friendship.',
    'Formerly, following his constant aim, we spoke freely at banquet; I cherish Ziling in feeling and old friendship alike.',
  ],
  s0069: [
    'In former ages Zhongyu transcended the vulgar and received salary from the Han court;',
    'In former ages Zhongyu transcended the vulgar and took salary from Han;',
  ],
  s0070: [
    'Andao in reclusive will did not decline Jin stipend.',
    'Andao in reclusive will did not decline Jin stipend.',
  ],
  s0071: [
    'This is the great track of former generations, what past worthies held in common.',
    'This is the great track of former generations, what past worthies shared.',
  ],
  s0072: [
    'Let additional stipend be discussed and granted, issued from the place of residence; daily expenses as needed shall be separately supplied by the Imperial Commissary.',
    'Let additional stipend be discussed and granted from his place of residence; daily needs shall be separately supplied by the Imperial Commissary.',
  ],
  s0073: [
    'Since your virtue shines high, the precedent is the same as below the palace wall."',
    'Since your virtue shines high, the precedent is the same as below the palace wall."',
  ],
  s0074: [
    'In the third year of Tianjian he died, aged sixty-eight.',
    'In Tianjian year three he died, aged sixty-eight.',
  ],
  s0075: [
    'An edict said: "The newly appointed Palace Attendant He Dian lingered at his hermitage by the ford and did not change white-haired to the end.',
    'An edict said: "The newly appointed palace attendant He Dian lingered at his ford-side hermitage and did not change to the end.',
  ],
  s0076: [
    'Suddenly he reached ruin and death; my grief redoubles.',
    'Suddenly he died; my grief redoubles.',
  ],
  s0077: [
    'Let there be given one set of first-rank funeral timber, condolence money twenty thousand, and fifty bolts of cloth.',
    'Grant one set of first-rank funeral timber, twenty thousand in condolence money, and fifty bolts of cloth.',
  ],
  s0078: [
    'What the funeral requires shall be managed by the inner directorate."',
    'Funeral needs shall be managed by the inner directorate."',
  ],
  s0079: [
    'He also charged Dian\'s younger brother Yin: "Your worthy elder brother the Recluse at a tender age brushed away his robes and held one course to hoary head.',
    'He also charged Yin, Dian\'s younger brother: "Your worthy brother the recluse at a tender age brushed away office and held one course to hoary head.',
  ],
  s0080: [
    'His heart wandered outside things and did not cling to near traces;',
    'His heart wandered outside things and did not cling to near traces;',
  ],
  s0081: [
    'he cast off the bodily frame and lodged it in far principle.',
    'he cast off the body and lodged it in far principle.',
  ],
  s0082: [
    'His nature\'s winning reach rose higher when stirred;',
    'His nature\'s winning reach rose higher when stirred;',
  ],
  s0083: [
    'in literary gatherings and wine virtue he touched the distance ever farther.',
    'in literary gatherings and wine virtue he touched ever farther distances.',
  ],
  s0084: [
    'I received the mandate and took the chart, thinking to extend sound teaching long.',
    'I received the mandate and took the chart, thinking to extend sound teaching.',
  ],
  s0085: [
    'At court many gentlemen have already honored and perfected custom;',
    'At court many gentlemen have already honored and perfected custom;',
  ],
  s0086: [
    'in the wild there are outer ministers—this hard-to-advance should be enlarged.',
    'in the wild there are outer ministers—this hard-to-advance path should be enlarged.',
  ],
  s0087: [
    'I was about to rely on your pure emblem to loft the great enterprise.',
    'I was about to rely on your pure emblem to loft the great enterprise.',
  ],
  s0088: [
    'Long ago in plain cloth our feeling was pledged early; I endowed you with Zhongyu\'s rank and treated you with Ziling\'s rites; on days of leisure for reading I received you in kerchief—remote as Fen and She, here was my trust.',
    'Long ago in plain cloth our bond was early; I gave you Zhongyu\'s rank and Ziling\'s rites; on days of leisure I received you in kerchief—remote as Fen and She, here was my trust.',
  ],
  s0089: [
    'In one morning ten thousand years—my good heart is shaken with mourning.',
    'In one morning ten thousand years—my heart is shaken with mourning.',
  ],
  s0090: [
    'You were friendly in pure utmost; kin and followers have withered;',
    'You were friendly in pure utmost; kin and followers have withered;',
  ],
  s0091: [
    'the wish to grow old together makes the reversal all the harder;',
    'the wish to grow old together makes the reversal all the harder;',
  ],
  s0092: [
    'enduring regret wound tight—how can it be borne?',
    'enduring regret wound tight—how can it be borne?',
  ],
  s0093: [
    'Gone forever—what can be done!"',
    'Gone forever—what can be done!"',
  ],
  s0094: [
    'Dian had no son; the clan made his younger cousin Geng\'s son Chi heir.',
    'Dian had no son; the clan made his younger cousin Geng\'s son Chi heir.',
  ],
  s0095: [
    'Yin, styled Ziji, was Dian\'s younger brother.',
    'Yin, styled Ziji, was Dian\'s younger brother.',
  ],
  s0096: [
    'At eight sui in mourning he grieved and wasted himself like an adult.',
    'At eight he mourned with grief and waste like an adult.',
  ],
  s0097: [
    'When grown he loved learning.',
    'Grown, he loved learning.',
  ],
  s0098: [
    'He took Liu Huan of Pei as teacher, receiving the Changes, the Record of Rites, and the Mao Odes, and also entered Dinglin Temple on Bell Mountain to hear the inner canon—all his studies he mastered.',
    'He studied under Liu Huan of Pei, taking the Changes, the Record of Rites, and the Mao Odes, and entered Dinglin Temple on Bell Mountain for the inner canon—mastering all.',
  ],
  s0099: [
    'Yet he gave free rein to wild conduct; men of the time did not yet know him—only Huan and Zhou Yong of Runan deeply prized and marked him as extraordinary.',
    'Yet he gave free rein to wild conduct; his age did not yet know him—only Huan and Zhou Yong of Runan deeply prized him.',
  ],
  s0100: [
    'He first left home as Qi Secretary in the Palace, moved to Crown Prince\'s Household Attendant.',
    'He first left home as Qi secretary in the palace and became crown prince\'s household attendant.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error('Usage: node translations/patches/patch_liangshu_051_b1.mjs <translation.json>');
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
if (patched !== Object.keys(T).length) process.exitCode = 1;
