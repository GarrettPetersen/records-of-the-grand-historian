#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'He Yang, styled Delian, was a man of Shanyin in Kuaiji.',
    'He Yang, styled Delian, was from Shanyin in Kuaiji.',
  ],
  s0302: [
    'His grandfather Daoli was skilled in the Three Rites and served Song as Gentleman of the Three Dukes in the Secretariat and Magistrate of Jiankang.',
    'His grandfather Daoli mastered the Three Rites and served Song as Secretariat Three-Dukes Gentleman and Jiankang magistrate.',
  ],
  s0303: [
    'Yang in youth inherited the family profession.',
    'Yang in youth inherited the family learning.',
  ],
  s0304: [
    'In Qi times Liu Huan of Pei was Assistant Administrator of Kuaiji; seeing Yang he deeply valued and regarded him as extraordinary.',
    'In Qi, Pei\'s Liu Huan as Kuaiji assistant deeply valued him.',
  ],
  s0305: [
    'Once he went with him to visit Zhang Rong of Wu commandery; pointing at Yang he said to Rong: "This lad is bright and keen; in future he will be patriarch of the Ru."',
    'Visiting Wu\'s Zhang Rong with him, he said, "This youth is bright; he will head the Confucians."',
  ],
  s0306: [
    'Huan returned and recommended him as a National University student.',
    'Huan returned and recommended him as National University student.',
  ],
  s0307: [
    'He was recommended on the Classics Examinations, made Libationer of Yangzhou, and soon concurrently National University Assistant Instructor.',
    'Recommended on the Classics, he became Yangzhou Libationer, then National University assistant instructor.',
  ],
  s0308: [
    'He passed through Regular Attendant, Erudite of the Imperial University, and Vice Director of the Court of Imperial Sacrifices; he left office on his mother\'s death.',
    'He served as Regular Attendant, Imperial University erudite, and Court of Imperial Sacrifices vice director, then left for mourning.',
  ],
  s0309: [
    'At the beginning of Tianjian he again became Vice Director; the relevant offices recommended him to handle guest rites; summoned to audience he expounded ritual meaning—Gaozu was struck and edicted that he attend court on the first and fifteenth and join the Hualin lectures.',
    'Early Tianjian he returned as vice director, was recommended for guest rites, expounded ritual to Gaozu, who had him attend on new and full moon and join Hualin lectures.',
  ],
  s0310: [
    'At the beginning of the fourth year the five halls were opened; Yang was made concurrent Erudite of the Five Classics; by separate edict he fixed rites for the Crown Prince and compiled Meanings of the Five Classics.',
    'In year four the five halls opened; Yang became concurrent erudite, fixed the crown prince\'s rites, and compiled Five Classics meanings.',
  ],
  s0311: [
    'Yang knew all old ritual matters.',
    'Yang knew all old ritual precedents.',
  ],
  s0312: [
    'At that time Gaozu was just establishing rites and music; Yang\'s proposals were mostly put into practice.',
    'As Gaozu was establishing rites and music, most of Yang\'s proposals were adopted.',
  ],
  s0313: [
    'In the seventh year he was appointed Commandant of Footsoldiers and led as Erudite of the Five Classics.',
    'In year seven he became Commandant of Footsoldiers and led as Five Classics erudite.',
  ],
  s0314: [
    'In the ninth year he fell ill; medicine and inquiries were sent; he died in the hall, aged fifty-nine.',
    'In year nine he fell ill; the court sent medicine; he died in the hall at fifty-nine.',
  ],
  s0315: [
    'His works included several hundred items of Exegeses on Rites, Changes, Laozi, and Zhuangzi, Court Deliberations, and Guest Rites Notes in 145 juan.',
    'He wrote hundreds of exegeses on Rites, Changes, Laozi, and Zhuangzi, court deliberations, and Guest Rites Notes in 145 juan.',
  ],
  s0316: [
    'Yang was especially expert in Rites; hall pupils often numbered in the hundreds; disciples who passed the Classics Examinations and court answers reached several tens.',
    'He excelled in Rites; his hall had hundreds of pupils and dozens who passed examinations.',
  ],
  s0317: [
    'Two sons.',
    'He had two sons.',
  ],
  s0318: [
    'Ge, styled Wenming.',
    'Ge, styled Wenming.',
  ],
  s0319: [
    'In youth he mastered the Three Rites; when grown he thoroughly studied the Classic of Filial Piety, Analects, Mao Odes, and Zuo Tradition.',
    'In youth he mastered the Three Rites; grown, he mastered Filial Piety, Analects, Mao Odes, and Zuo.',
  ],
  s0320: [
    'He first took office as Gentleman of the Kingdom of Jin\'an and concurrent Erudite of the Imperial University, attending the Prince of Xiangdong in study.',
    'He began as Jin\'an kingdom gentleman and concurrent Imperial University erudite, tutoring the Prince of Xiangdong.',
  ],
  s0321: [
    'By edict at Yongfu Palace he lectured on Rites for the three princes of Shaoling, Xiangdong, and Wuling.',
    'By edict at Yongfu Palace he taught Rites to the princes of Shaoling, Xiangdong, and Wuling.',
  ],
  s0322: [
    'He was gradually promoted Staff Officer in the Prince of Xiangdong\'s kingdom and transferred Gentleman of Ritual Protocol in the Secretariat.',
    'He rose to Xiangdong staff officer, then Secretariat Ritual Protocol gentleman.',
  ],
  s0323: [
    'Soon he was removed as Magistrate of Moling, promoted Erudite of the National University; at the academy he lectured and pupils often numbered several hundred.',
    'Soon Moling magistrate, then National University erudite lecturing to hundreds.',
  ],
  s0324: [
    'He went out as Adviser to the Western Center Army\'s Prince of Xiangdong, concurrently Magistrate of Jiangling.',
    'He became Western Center Army adviser to the Prince of Xiangdong, concurrently Jiangling magistrate.',
  ],
  s0325: [
    'When the prince first established a school in the headquarters, Ge was made Libationer of the Confucian Grove, lecturing on the Three Rites; gentry of Jing and Chu who listened were very many.',
    'When the prince opened a school, Ge led as Confucian Grove libationer lecturing the Three Rites to many Jing-Chu gentry.',
  ],
  s0326: [
    'Before and after he twice supervised Nanping commandery and was esteemed by people and officials.',
    'Twice he supervised Nanping and won officials\' and people\'s esteem.',
  ],
  s0327: [
    'Soon he was additionally Trustworthy Might General, concurrently Chief Clerk of Pacifying West, and Administrator of Nan commandery.',
    'Soon he added Trustworthy Might General, Pacifying West chief clerk, and Nan commandery administrator.',
  ],
  s0328: [
    'Ge\'s nature was utmost filial; he often regretted that receiving salary in place of plowing left him unable to support his parents.',
    'Utterly filial, he regretted that salary replaced farming and he could not nourish his parents.',
  ],
  s0329: [
    'In Jingzhou he successively served as commandery and county official; the salary he received did not reach wife and children—he planned only to return home to build a temple to express grateful remembrance.',
    'In Jingzhou his salary never reached his family; he meant to return home and build a temple in gratitude.',
  ],
  s0330: [
    'In the sixth year of Datong he died in office, aged sixty-two.',
    'In Datong year six he died in office at sixty-two.',
  ],
  s0331: [
    'His younger brother Ji was also expert in the Three Rites; he passed through Gentleman of the Imperial Ancestral Temples in the Secretariat and concurrent Secretariat Attendant for General Affairs.',
    'His brother Ji also mastered the Three Rites and served as Temples gentleman and Secretariat attendant for general affairs.',
  ],
  s0332: [
    'He was promoted in succession Commandant of Footsoldiers, Secretariat Yellow Gate Gentleman, and concurrently Compiler.',
    'He rose to Commandant of Footsoldiers, Yellow Gate gentleman, and compiler.',
  ],
  s0333: [
    'Sima Jun',
    'Sima Jun',
  ],
  s0334: [
    'Sima Jun, styled Zhensu, was a man of Wen in Henei, seventh-generation descendant of Jin General of Agile Cavalry and Prince of Qiao Lie Wang Cheng.',
    'Sima Jun, styled Zhensu, of Wen in Henei, was seventh generation from Jin General of Agile Cavalry Prince of Qiao Lie Wang Cheng.',
  ],
  s0335: [
    'His grandfather Liang was Song Vice Director of the Department of State Affairs staff officer.',
    'His grandfather Liang was Song vice director staff officer.',
  ],
  s0336: [
    'His father Duan was Qi Regular Attendant.',
    'His father Duan was Qi Regular Attendant.',
  ],
  s0337: [
    'Jun, orphaned and poor, loved learning; he took Liu Huan of Pei as teacher, strove with force and concentrated with refinement, and was deeply valued and regarded as extraordinary by Huan.',
    'Orphaned and poor, he studied under Pei\'s Liu Huan, worked hard, and won Huan\'s deep regard.',
  ],
  s0338: [
    'When grown he broadly mastered the classics, especially the Three Rites.',
    'Grown, he mastered the classics, especially the Three Rites.',
  ],
  s0339: [
    'In Qi\'s Jianwu era he first took office as Regular Attendant and was promoted Staff Officer in a princely kingdom.',
    'In Qi Jianwu he began as Regular Attendant, then princely staff officer.',
  ],
  s0340: [
    'At the beginning of Tianjian he was made Chief Clerk of his native province, then removed as Magistrate of Jiyang with pure achievements.',
    'Early Tianjian he was native-province chief clerk, then Jiyang magistrate with a clean record.',
  ],
  s0341: [
    'He entered court as Gentleman of the Imperial Ancestral Temples in the Secretariat.',
    'He entered court as Secretariat Temples gentleman.',
  ],
  s0342: [
    'In the seventh year the Honored Consort Chen of Prince of Ancheng died; the Inspector of Jiangzhou, the Prince of Ancheng Xiu, and the Inspector of Jingzhou, the Prince of Shixing Dan, both submitted a Memorial on the Foster Mother to resign office; the edict did not permit it and they resumed their original posts;',
    'In year seven Prince of Ancheng\'s Honored Consort Chen died; Princes Xiu of Jiangzhou and Dan of Jingzhou petitioned to resign on foster-mother grounds; the throne refused and they kept office;',
  ],
  s0343: [
    'yet the Honored Consort died in the capital and mourning sacrifices had no chief.',
    'but the consort died in the capital with no one to lead the rites.',
  ],
  s0344: [
    'Attendant She Zhou She proposed: "He Yanxian said, \'A foster mother\'s son does not wear mourning for the foster mother\'s kin; a wife likewise does not follow her husband in wearing mourning for a foster mother-in-law—the lesser mourning has no following, hence.\'',
    'Attendant Zhou She argued: "He Yanxian held that a foster mother\'s son does not mourn her kin, nor a wife her foster mother-in-law—lesser mourning has no following."',
  ],
  s0345: [
    'Yu Weizhi said: \'It is not only that the son does not follow the mother in wearing mourning for her kin—the grandson likewise does not follow the father in wearing mourning for his foster grandmother.\'',
    'Yu Weizhi said the grandson does not follow the father in mourning the foster grandmother."',
  ],
  s0346: [
    'From this speaking, for a foster grandmother there is clearly no mourning."',
    'Hence no mourning for a foster grandmother is clear."',
  ],
  s0347: [
    'Seeking grief within the gate, one cannot treat it the same as the ordinary;',
    'Inner-house grief cannot be treated like ordinary mourning;',
  ],
  s0348: [
    'according to the father\'s auspicious and end-of-mourning rites, sons all receive condolences.',
    'when a father ends mourning, sons all receive condolences.',
  ],
  s0349: [
    'Now the two princes\' sons should on the day of completing mourning wear unlined garments for one day, take position, and receive condolences."',
    'The two princes\' sons should on completing mourning wear plain clothes one day and receive condolences."',
  ],
  s0350: [
    'The regulation said: "The two princes are far away; the sons should oversee sacrificial affairs."',
    'The regulation said the distant princes\' sons should oversee the sacrifices."',
  ],
  s0351: [
    'She again said: "The Rites say, \'White cap with dark border—the cap of sons of the lineage.\'',
    'She added: "The Rites call the white cap with dark border the cap of lineage sons."',
  ],
  s0352: [
    'Then the heir\'s clothing should differ from the ordinary.',
    'The heir\'s dress should differ from ordinary dress.',
  ],
  s0353: [
    'He may wear fine cloth garments with silk collar and belt; for three years he does not listen to music.',
    'He may wear fine cloth with silk collar and belt and hear no music for three years.',
  ],
  s0354: [
    'Again the Rites and Spring and Autumn: a concubine mother is not sacrificed to generation after generation—this refers to those without a king\'s command.',
    'Rites and Spring and Autumn say a concubine mother is not perpetually sacrificed—meaning without royal command.',
  ],
  s0355: [
    'The Wu Honored Consort, since court command was added, could use Prince of Ancheng\'s ritual rank—then she should be enshrined in the temple; when kin of five generations is exhausted the shrine is destroyed.',
    'Wu Honored Consort, having court rank, should be enshrined and destroyed after five generations.',
  ],
  s0356: [
    'Chen Honored Consort\'s weight of command, though not different, since the foster grandson does not follow in mourning, temple offerings by reason have no transmitted sacrifice—son sacrifices, grandson stops: this meets the classic text."',
    'Chen Honored Consort\'s rank was equal, but the foster grandson does not mourn—no temple sacrifice; son sacrifices, grandson stops: so the classics say."',
  ],
  s0357: [
    'Gaozu therefore edicted ritual officials to deliberate mourning for a prince\'s foster mother.',
    'Gaozu ordered ritual officials to debate princes\' mourning for foster mothers.',
  ],
  s0358: [
    'Jun proposed: "Song\'s five-ranks mourning system: a prince wears mourning for a foster mother who reared and taught him; according to the Rites, a concubine mother who was kind to him should follow the lesser mourning regulation.',
    'Jun argued: "Song\'s system had princes mourn foster mothers; by the Rites a kind concubine mother warrants lesser mourning."',
  ],
  s0359: [
    'According to the Zengzi Asked: Ziyou said, \'Mourning a foster mother like a mother—is it ritual?\'',
    'In Zengzi Asked, Ziyou asked whether mourning a foster mother like a mother was ritual."',
  ],
  s0360: [
    'Confucius said: \'It is not ritual.',
    'Confucius said it was not ritual."',
  ],
  s0361: [
    'In antiquity a man outwardly had a tutor, inwardly a foster mother—the ruler\'s command sent her to teach the son; what mourning is there?\'',
    'Antiquity gave a man tutors outside and foster mothers inside by the ruler\'s command—what mourning is due?"',
  ],
  s0362: [
    'Zheng Xuan\'s note says: \'This refers to a feudal lord\'s son.\'',
    'Zheng Xuan noted this means a feudal lord\'s son."',
  ],
  s0363: [
    'If a feudal lord\'s son does not wear mourning, then a king\'s son\'s not wearing mourning can be known.',
    'If a lord\'s son does not mourn, a king\'s son likewise does not."',
  ],
  s0364: [
    'Again the Mourning Dress classic says \'the gentleman\'s son for a concubine mother who was kind to him.\'',
    'The Mourning Dress classic says "the gentleman\'s son for a concubine mother kind to him."',
  ],
  s0365: [
    'The Tradition says: \'Gentleman\'s son means a nobleman\'s son.\'',
    'The Tradition says "gentleman\'s son means a noble\'s son."',
  ],
  s0366: [
    'Zheng Xuan cites the Inner Canon: the three mothers apply only as far as grand masters.',
    'Zheng Xuan cites the Inner Canon: the three mothers apply only to grand masters.',
  ],
  s0367: [
    'Pushing from this, then mourning for a foster mother above does not reach heirs of the five ranks, below does not reach sons of the three ranks of knights.',
    'Hence foster-mother mourning reaches neither top heirs nor lowest knights.',
  ],
  s0368: [
    'If those who wear it stop at grand masters, tracing further—even a feudal lord\'s son has no such mourning, how much less applying it to a prince.',
    'If only grand masters mourn, even lords\' sons do not—how apply it to princes?',
  ],
  s0369: [
    'I say it should be cut according to the Rites to return to the confusion of former ages."',
    'It should be struck from the rites to undo former confusion."',
  ],
  s0370: [
    'Gaozu thought otherwise and said: "The Rites speak of foster mother in three cases altogether: first, a son of a concubine without a mother—let a concubine without a son rear him, appoint them mother and son, mourning for three years—the \'foster mother\' of the Mourning Dress equal mourning chapter is this;',
    'Gaozu disagreed: "The Rites name three foster mothers: first, a concubine\'s son without a mother reared by a childless concubine—three years\' mourning per the equal mourning chapter;"',
  ],
  s0371: [
    'second, a son of the principal wife without a mother—let a concubine rear him; kind care reaches the utmost; though equal in loving kindness, for a son of the principal wife a concubine has no standing as mother, yet favor is deep and the matter weighty—hence lesser mourning; the Mourning Dress lesser mourning chapter therefore does not speak plainly of foster mother but says \'concubine mother kind to him\'—making clear the difference from the three-year foster mother;',
    'second, a principal wife\'s son without a mother reared by a concubine—lesser mourning, called "concubine mother kind to him," not the three-year case;',
  ],
  s0372: [
    'third, the son is not without a mother but precisely one of low rank is chosen to watch him—meaning like tutor and guardian, yet not without loving kindness—hence there is also the name foster mother.',
    'third, a mother exists but a low-ranking nurse is chosen—like tutor and guardian, yet with kindness—also called foster mother.',
  ],
  s0373: [
    'Tutor and guardian have no mourning—then this kindness also has no mourning.',
    'Tutors and guardians have no mourning—so this kindness has none either.',
  ],
  s0374: [
    'The Inner Canon says \'Choose among the various mothers and the suitable, make her the son\'s tutor;',
    'The Inner Canon says, "Choose among the mothers and the fit to be the son\'s tutor;"',
  ],
  s0375: [
    'next make her foster mother;',
    'next foster mother;"',
  ],
  s0376: [
    'next make her nurse mother\'—this is the plain text.',
    'next nurse mother"—that is the plain text.',
  ],
  s0377: [
    'This speaking of choosing among mothers is choosing persons to be these three mothers—not choosing a brother\'s mother.',
    'Choosing among mothers means choosing persons for the three roles—not a brother\'s mother.',
  ],
  s0378: [
    'How do I know?',
    'How do we know?',
  ],
  s0379: [
    'If it were a brother\'s mother who already had a son, she would be the chief concubine; the chief concubine\'s rites truly have special additions—how could a lesser concubine bear a son and she be demoted to nurse mother? This is impossible.',
    'A brother\'s mother with a son is chief concubine—how could a lesser concubine\'s son demote her to nurse? Impossible.',
  ],
  s0380: [
    'Again, for one with many brothers it might be possible in principle;',
    'For many brothers it might be possible;',
  ],
  s0381: [
    'but for a first-born son, should all three mothers be lacking?',
    'but for a first son, should all three mothers be absent?',
  ],
  s0382: [
    'From this pushing, the Inner Canon\'s \'various mothers\' means the three mothers—not brothers\' mothers; it is clear."',
    'Hence "various mothers" means the three mothers, not brothers\' mothers."',
  ],
  s0383: [
    'What Ziyou asked was precisely tutor-and-guardian kindness, not three-year or lesser mourning kindness—hence the Master could give this answer.',
    'Ziyou asked about tutor-and-guardian kindness, not three-year or lesser mourning—hence the Master\'s answer.',
  ],
  s0384: [
    'Is this not proof that tutor-and-guardian foster mother has no mourning?',
    'Is that not proof tutor-and-guardian foster mothers have no mourning?',
  ],
  s0385: [
    'Zheng Xuan did not distinguish the three kindnesses but mixed them in exegesis, citing the no-mourning case to gloss \'kind to him\'—later men\'s errors truly stem from this.',
    'Zheng Xuan confused the three kindnesses and cited no-mourning to gloss "kind to him"—later errors stem from this.',
  ],
  s0386: [
    'The classic\'s \'gentleman\'s son\'—though this begins with grand masters, it shows that even grand masters are so; from that upward there should be no difference—hence the Tradition says \'gentleman\'s son means a nobleman\'s son.\'',
    'Though "gentleman\'s son" begins with grand masters, if they are included, higher ranks are too—the Tradition says "noble\'s son."',
  ],
  s0387: [
    'Speaking in summary of nobility, nothing is excluded.',
    'Speaking of nobility in summary, nothing is excluded.',
  ],
  s0388: [
    'Classic and Tradition mutually gloss and illuminate each other—then one knows the meaning of added kindness extends through grand masters and above.',
    'Classic and Tradition together show kindness extends through grand masters and above.',
  ],
  s0389: [
    'Song\'s category on this does not violate ritual intent; to add cutting and removal is truly doubtful."',
    'Song\'s rule fits the rites; to cut it is doubtful."',
  ],
  s0390: [
    'Thereupon Jun and others asked to fix by regulation: a son of the principal wife, his mother dead and reared by his father\'s concubine—mourning for five months, noble and common alike the same, as permanent statute."',
    'Jun and others then fixed: a principal wife\'s son reared by a concubine after his mother\'s death mourns five months, noble and common alike, as permanent law."',
  ],
  s0391: [
    'He was promoted in succession Adviser in a princely kingdom, acting Director of the Left Secretariat, and soon removed as Director of the Left Secretariat.',
    'He rose to princely adviser, acting Left Director, then Left Director.',
  ],
  s0392: [
    'He went out as Administrator of Shixing and died in office.',
    'He served as Administrator of Shixing and died in office.',
  ],
  s0393: [
    'His son Shou inherited his father\'s profession and was expert in the Three Rites.',
    'His son Shou inherited his learning and mastered the Three Rites.',
  ],
  s0394: [
    'In the Datong era he passed through Gentleman of the Imperial Ancestral Temples in the Secretariat and went out as Magistrate of Qu\'e.',
    'In Datong he was Temples gentleman, then Qu\'e magistrate.',
  ],
  s0395: [
    'Bian Hua, styled Zhaoqiu, was a man of Yuanju in Jiyin.',
    'Bian Hua, styled Zhaoqiu, was from Yuanju in Jiyin.',
  ],
  s0396: [
    'Sixth-generation descendant of Jin General of Agile Cavalry and Loyal and Pure Duke Bian.',
    'He was sixth generation from Jin General of Agile Cavalry Loyal and Pure Duke Bian.',
  ],
  s0397: [
    'His father Lunzhi was Attendant at the Palace Gate.',
    'His father Lunzhi was Palace Gate Attendant.',
  ],
  s0398: [
    'Hua in youth was orphaned and poor yet loved learning.',
    'Orphaned and poor in youth, he loved learning.',
  ],
  s0399: [
    'At fourteen he was summoned to fill a place as National University student and mastered the Book of Changes.',
    'At fourteen he entered the National University and mastered the Changes.',
  ],
  s0400: [
    'When grown he thoroughly studied the Five Classics and with Ming Shanbin of Pingyuan and He Yang of Kuaiji studied together in friendship.',
    'Grown, he mastered the Five Classics and studied in friendship with Pingyuan\'s Ming Shanbin and Kuaiji\'s He Yang.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_048_b4.mjs <translation.json>'
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
