#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 41, Biography 35',
    'Book of Liang, Volume 41, Biography 35',
  ],
  s0002: [
    'Wang Gui; Liu Jue; Zong Lin; Wang Cheng; Chu Xiang; Xiao Jie; elder cousin by the father\'s line Qia; Chu Qiu; Liu Ru; younger brothers Lan and Zun; Liu Qian; younger brothers Xiaosheng, Xiaowei, and Xiaoxian; Yin Yun; Xiao Ji',
    'Wang Gui; Liu Jue; Zong Lin; Wang Cheng; Chu Xiang; Xiao Jie; his father\'s cousin Qia; Chu Qiu; Liu Ru; his brothers Lan and Zun; Liu Qian; his brothers Xiaosheng, Xiaowei, and Xiaoxian; Yin Yun; Xiao Ji',
  ],
  s0003: [
    'Wang Gui, courtesy name Weiming, was a native of Linyi in Langye.',
    'Wang Gui, styled Weiming, came from Linyi in Langye.',
  ],
  s0004: [
    'His grandfather Jian was Qi Grand Commandant, Duke Wenxian of Nanchang.',
    'His grandfather Jian had been Grand Commandant of Qi and Duke Wenxian of Nanchang.',
  ],
  s0005: [
    'His father Qian was Grand Master of Splendid Happiness with the Golden Seal, Marquis An of Nanchang.',
    'His father Qian held the post of Grand Master of Splendid Happiness with the Golden Seal and the title Marquis An of Nanchang.',
  ],
  s0006: [
    'At eight, Gui entered mourning for his birth mother; in the mourning quarters he showed utmost filial devotion.',
    'When Gui was eight he mourned his birth mother, and throughout the mourning period his devotion was profound.',
  ],
  s0007: [
    'Grand Commandant Xu Xiaosi wept whenever he saw him and called him "the Filial Lad."',
    'Each time Grand Commandant Xu Xiaosi met him he wept and hailed him as a child of true filial piety.',
  ],
  s0008: [
    'His uncle Yang also prized him deeply and often said: "This boy is our family\'s thousand-li colt."',
    'His uncle Yang held him in the highest regard and would say, "This child is the swift steed of our house."',
  ],
  s0009: [
    '”At twelve, he could grasp in outline the essential meaning of the Five Classics.',
    'By twelve he had a working command of the main themes of the Five Classics.',
  ],
  s0010: [
    'When grown, he loved learning and was skilled in debate.',
    'As an adult he pursued learning eagerly and spoke with uncommon force.',
  ],
  s0011: [
    'The province nominated him as Presented Scholar; the commandery welcomed him as chief clerk.',
    'The province put him forward as a Presented Scholar, and the commandery received him as chief clerk.',
  ],
  s0012: [
    'He began office as Secretary Gentleman and rose through Crown Prince Attendant, chief clerk to the Prince of Kang of Anyou, and crown prince groom.',
    'He entered service as a secretary gentleman, then advanced through posts as crown prince attendant, chief clerk to the Prince of Kang of Anyou, and crown prince groom.',
  ],
  s0013: [
    'In year 12 of Tianjian the Great Ultimate Hall was rebuilt; when the work was finished, Gui presented "Rhapsody on the New Hall," and the diction was exceptionally fine.',
    'In the twelfth year of Tianjian the court rebuilt the Hall of Great Ultimate; when construction was done, Gui offered his "Rhapsody on the New Hall," a piece of rare craft.',
  ],
  s0014: [
    'He was appointed Secretary Aide.',
    'He was made secretary aide.',
  ],
  s0015: [
    'He served in succession as Crown Prince Central Attendant, Western Attendant under the Minister of Works, and Administrative Aide.',
    'He held, in turn, the posts of crown prince central attendant, western attendant under the minister of works, and administrative aide.',
  ],
  s0016: [
    'When Prince Jin\'an, Gang, went out to South Xuzhou, he chose his staff with care and made Gui Cloud-Cavalry Adviser and Staff Officer.',
    'As Prince Jin\'an, Gang, took up South Xuzhou, he selected his aides with unusual rigor and appointed Gui cloud-cavalry adviser on his staff.',
  ],
  s0017: [
    'After some time he went out as Administrator of Xin\'an and left office on his father\'s death.',
    'Before long he was sent out as administrator of Xin\'an, then resigned when his father died.',
  ],
  s0018: [
    'When mourning ended he inherited the county marquisate of Nanchang and was appointed Palace Attendant of the Secretariat and Yellow Gates.',
    'After the mourning period he succeeded to the county marquisate of Nanchang and became palace attendant of the secretariat and yellow gates.',
  ],
  s0019: [
    'By edict he served the Eastern Palace together with Yin Jun of Chen commandery, Wang Xi of Langye, and Zhang Mian of Fanyang, and all were honored by Heir Apparent Zhaoming.',
    'An edict set him to attend the eastern palace with Yin Jun of Chen, Wang Xi of Langye, and Zhang Mian of Fanyang; each was treated with distinction by Heir Apparent Zhaoming.',
  ],
  s0020: [
    'Prince Xiangdong, then serving as capital intendant, held a banquet with court officials and assigned Gui as wine-master.',
    'Prince Xiangdong, who was then metropolitan intendant, feasted with court gentlemen and charged Gui with keeping the drinking rules.',
  ],
  s0021: [
    'Gui answered calmly: "Since the move south of the Yangtze there has never been such a thing."',
    'Gui replied with composure: "Since the court crossed the Yangtze, nothing of the kind has been seen."',
  ],
  s0022: [
    'Privileged Attendant Xiao Chen and Grand Master with Golden Seal Fu Zhao were present; both called it perceptive.',
    'Xiao Chen, privileged attendant, and Fu Zhao, grand master with the golden seal, were among those seated; both pronounced his words wise.',
  ],
  s0023: [
    'Early in Putong, Chen Qingzhi\'s northern campaign recovered Luoyang; when the officials congratulated, Gui withdrew and said: "The Daoists say: it is not achievement that is hard, but success that is hard."',
    'At the opening of the Putong era Chen Qingzhi marched north and retook Luoyang; as the bureaucracy rejoiced, Gui stepped aside and said, "The Daoists tell us that winning the fight is not the hard part—holding the victory is."',
  ],
  s0024: [
    'The Jie bandits have been wandering spirits a long time; Huan Wen took Luoyang and lost it again, and Emperor Wu of Song in the end had no lasting success.',
    'The Jie foe has haunted the north for generations; Huan Wen seized the city only to lose it, and even Emperor Wu of Song could not make the gain endure.',
  ],
  s0025: [
    'Our lone army has no reinforcements, penetrates deep into hostile territory, our power does not connect forward, supplies are hard to sustain—this campaign will become the steps to disaster.',
    'We march without support into enemy country, our reach cannot be joined to the rear, and provisions will not keep pace—this expedition is laying the stairs to ruin.',
  ],
  s0026: [
    'Soon the imperial army was destroyed; his foresight in affairs was often of this sort.',
    'Before long the imperial forces were wiped out; his grasp of unfolding events was frequently of this kind.',
  ],
  s0027: [
    'In year 6 the Founding Emperor feasted Yuan Jinglong, Inspector of Guangzhou, at the Wende Hall, ordered all officials to compose verse on the same fifty rhymes; Gui took brush and presented at once, and the piece was again beautiful.',
    'In the sixth year the founding emperor gave a farewell feast for Yuan Jinglong, inspector of Guangzhou, in the Hall of Civil Virtue and commanded the court to write poems sharing fifty rhyme categories; Gui wrote on the spot and submitted immediately, and the work was again superb.',
  ],
  s0028: [
    'The Founding Emperor praised it and that same day named him Palace Attendant.',
    'The founding emperor was delighted and that very day appointed him palace attendant.',
  ],
  s0029: [
    'In year 3 of Datong he was moved to Minister of the Five Armies and soon also held the post of Commandant of Footsoldiers.',
    'In the third year of Datong he became minister of the five armies and shortly afterward took command of the footsoldiers as well.',
  ],
  s0030: [
    'In year 2 of Zhongdatong he went out as Chief Clerk to the Rapid Cavalry Prince Jin\'an, General of Loyal Prestige.',
    'In the second year of Zhongdatong he left the capital as chief clerk to Prince Jin\'an of Rapid Cavalry, bearing the rank of general of loyal prestige.',
  ],
  s0031: [
    'That year the prince was established as crown prince; Gui remained Administrator of Wu commandery.',
    'In that same year the prince was made heir apparent, and Gui continued as administrator of Wu commandery.',
  ],
  s0032: [
    'Palace Scribe Rui Zhenzong\'s family was in Wu; previous administrators all leaned to please him.',
    'The palace scribe Rui Zhenzong had kin in Wu, and every former magistrate had courted him.',
  ],
  s0033: [
    'Just then Zhenzong was on leave back home; Gui treated him coldly. Zhenzong returned to the capital and secretly memorialized that Gui "did not attend to commandery affairs."',
    'At the time Zhenzong was home on leave; Gui received him with marked coolness. Zhenzong went back to the capital and privately reported that Gui "neglected the duties of the commandery."',
  ],
  s0034: [
    'Soon Gui was summoned as Minister of the Left for the People; over a thousand officials and people of the commandery went to the palace to ask that he remain; three memorials were submitted, and the throne did not consent.',
    'He was soon recalled to be minister of the left for the people, but more than a thousand clerks and commoners of the commandery went to the gate to beg he stay; though they petitioned three times, the throne refused.',
  ],
  s0035: [
    'Soon on his present post he was also to hold General of the Right Army, but before accepting he was again made Regular Attendant of Scattered Cavalry, Crown Prince Vice-Director, and Commandant of Footsoldiers.',
    'Shortly afterward he was to add the post of general of the right army to his title, yet before he could take it up he was named regular attendant of scattered cavalry, crown prince vice-director, and again commandant of footsoldiers.',
  ],
  s0036: [
    'Gui declined on grounds of illness and did not accept; he built a dwelling at Zongxi Temple on Bell Mountain and lived there.',
    'Gui pleaded illness and refused the appointments, then built a house at Zongxi Temple on Bell Mountain and dwelt there in seclusion.',
  ],
  s0037: [
    'In year 2 of Datong he died, aged forty-five.',
    'In the second year of Datong he died at the age of forty-five.',
  ],
  s0038: [
    'By edict he was posthumously given Regular Attendant of Scattered Cavalry and Grand Master for Splendid Happiness, with two hundred thousand cash and a hundred bolts of cloth as funeral gifts.',
    'The throne ordered him honored after death as regular attendant of scattered cavalry and grand master for splendid happiness, with a funeral grant of two hundred thousand cash and a hundred bolts of cloth.',
  ],
  s0039: [
    'His posthumous title was Zhang.',
    'He was given the posthumous name Zhang.',
  ],
  s0040: [
    'The crown prince came out to mourn in person and sent a letter to Prince Xiangdong Yi: "Last night Weiming suddenly turned to dust again—deeply painful."',
    'The crown prince went out himself to weep at the bier and wrote to Prince Xiangdong, Yi: "Weiming was taken from us last night in an instant— the grief is unbearable."',
  ],
  s0041: [
    'His bearing was vigorous and upright, his spirit brilliant and marked; for a thousand li no peer, among hundred-foot trees no stray branch.',
    'His manner was forceful and correct, his presence luminous; for a thousand leagues none could match his track, and among towering trees he stood without a crooked limb.',
  ],
  s0042: [
    'His eloquence ranged freely, his talent and learning bountiful; the spirit of release grew greater, the breath of Zhuangzi\'s riverside uniquely rich—truly a brilliant man.',
    'He wielded argument with ease and his erudition was ample; his unconstrained spirit reached ever farther, and he breathed the air of Zhuangzi at the Hao bridge—he was, in truth, a man of rare excellence.',
  ],
  s0043: [
    'In a flash like sunlight through a crack, forever returned to the long night; the golden blade hides its edge, the long Huai runs dry.',
    'Like light slipping through a crevice he passed in a moment into endless night; the golden blade is dulled, and the long Huai has ceased to flow.',
  ],
  s0044: [
    'Last midwinter I already mourned Master Liu;',
    'Only last winter I was grieving for Master Liu;',
  ],
  s0045: [
    'This cold early spring I grieve again for Master Wang.',
    'and now, in the first chill of spring, I mourn Master Wang once more.',
  ],
  s0046: [
    'The pain of losing them together is no empty phrase.',
    'The sorrow of losing them both at once is no figure of speech.',
  ],
  s0047: [
    'Gui collected variant traditions on the Later Han and annotated the Continued Book of Han in two hundred scrolls; his collected writings ran twenty scrolls.',
    'Gui gathered the disagreements among Later Han historians and produced a two-hundred-scroll commentary on the Continued Book of Han, along with twenty scrolls of his own writings.',
  ],
  s0048: [
    'His son Bao, courtesy name Zihan, could compose prose at seven.',
    'His son Bao, styled Zihan, was already writing polished prose at seven.',
  ],
  s0049: [
    'His maternal grandfather, Minister of Works Yuan Ang, loved him and told guests: "This boy will become the good fortune of my house."',
    'His maternal grandfather Yuan Ang, minister of works, doted on him and said to his guests, "This child will be the blessing that shapes our clan."',
  ],
  s0050: [
    'At twenty he was nominated Presented Scholar, appointed Secretary Gentleman and Crown Prince Attendant, and left office on his father\'s death.',
    'When he came of age he was chosen as a presented scholar, made secretary gentleman and crown prince attendant, then resigned to observe mourning for his father.',
  ],
  s0051: [
    'When mourning ended he inherited Marquis of Nanchang, was made Literary Adjutant to the Prince of Wuchang and crown prince groom, concurrently Eastern Palace Recorder, moved to Attendant under the Minister of Works and Secretary Aide, and went out as Interior Governor of Ancheng.',
    'After mourning he succeeded to the marquisate of Nanchang, served as literary adjutant to the Prince of Wuchang and crown prince groom while also keeping the eastern palace record, rose to an attendant post under the minister of works and to secretary aide, and finally went out as interior governor of Ancheng.',
  ],
  s0052: [
    'In the Taqing era Hou Jing took the capital; Duke Daxin of Dangyang, Inspector of Jiangzhou, surrendered the province to the rebels; as the rebels turned to raid the south, Bao still held the commandery and resisted.',
    'During the Taqing period Hou Jing seized the capital; the inspector of Jiangzhou, Duke Daxin of Dangyang, yielded the whole province to the rebels, yet when the band turned southward Bao still held his commandery and fought them off.',
  ],
  s0053: [
    'In year 2 of Dabao the Ancestral Sovereign summoned Bao to Jiangling; on arrival he was made General of Loyal Martiality and Interior Governor of Nanping, soon Minister of Personnel and Palace Attendant.',
    'In the second year of Dabao the ancestral sovereign called Bao to Jiangling; once he arrived he was named general of loyal martiality and interior governor of Nanping, and before long became minister of personnel and palace attendant.',
  ],
  s0054: [
    'In year 2 of Chengsheng he was moved to Right Vice Director of the Imperial Secretariat, still managing personnel selection, and again made Palace Attendant.',
    'In the second year of Chengsheng he was promoted to right vice director of the imperial secretariat while continuing to oversee appointments, and was again made palace attendant.',
  ],
  s0055: [
    'That year he was moved to Left Vice Director, with the same duties in selection.',
    'In that year he was transferred to left vice director, still sharing charge of personnel as before.',
  ],
  s0056: [
    'In year 3 Jiangling fell and he passed into Zhou.',
    'In the third year Jiangling was lost, and he was carried off into the lands of Zhou.',
  ],
  s0057: [
    'Bao wrote "Instructions for Youth" to admonish his sons.',
    'Bao composed the "Instructions for Youth" to warn his sons.',
  ],
  s0058: [
    'One chapter reads:',
    'One section runs thus:',
  ],
  s0059: [
    'Tao Kan said: "Of old Yu the Great would not begrudge a foot-length disk of jade yet treasured every inch of shadow."',
    'Tao Kan wrote: "In antiquity Yu the Great did not spare a foot-wide jade disk, yet he weighed every inch of passing light."',
  ],
  s0060: [
    '" Why should literary men not recite books, and martial men not shoot from horseback?',
    'Why, then, do men of letters fail to read, and men of war fail to practice mounted archery?',
  ],
  s0061: [
    'In deep winter\'s long nights or bright summer\'s endless days, keep your dwelling orderly, raise your walls high, let no disorder crowd the gate, and let no clamor fill your seat.',
    'Whether in the black depths of winter or the blazing length of summer, keep your household grave, make your walls as high as a city rampart, admit no riffraff at the door, and let no shouting disturb your seat.',
  ],
  s0062: [
    'Study thus and you become a disciple at Confucius\'s gate;',
    'Learn in that way and you may stand among the followers of Confucius;',
  ],
  s0063: [
    'write thus and you rise to the hall as Jia Yi did.',
    'write in that way and you may enter the hall as Jia Yi did.',
  ],
  s0064: [
    'In antiquity trays and basins bore inscriptions, tables and staffs carried warnings—in advancing and retreating one followed them, in bowing and looking up one read them.',
    'The ancients inscribed their platters and bowls and carved admonitions on tables and staves; in every motion forward or back they obeyed them, and in every glance up or down they took their lesson.',
  ],
  s0065: [
    'The Odes of King Wen say: "Few lack a beginning; few keep an end."',
    'King Wen\'s ode says, "Everything has a beginning; few see it through to the end."',
  ],
  s0066: [
    'Establish the person and walk the Way from first to last as one.',
    'To stand in the world and follow the Way, let beginning and end be one.',
  ],
  s0067: [
    '"In haste one must be thus"—is this not the speech of a gentleman?',
    '"Even in sudden distress one must hold to this"—are these not a gentleman\'s words?',
  ],
  s0068: [
    'Confucian teaching sets rank between high and low and lightens ceremony for good and ill fortune.',
    'In the Confucian school, honor and baseness are ordered in ranks, and rites for fortune and misfortune are graded in severity.',
  ],
  s0069: [
    'The ruler faces south and ministers north—the meaning of Heaven and Earth;',
    'the lord turns to the south and his ministers to the north: that is the pattern of Heaven and Earth;',
  ],
  s0070: [
    'tripod stands odd, baskets and dishes even—the meaning of yin and yang.',
    'the great stands are set in odd numbers and the platters in even numbers: that is the pattern of yin and yang.',
  ],
  s0071: [
    'Daoism casts off the limbs, dulls wisdom, abandons righteousness and cuts off benevolence, leaves form and strips knowing.',
    'The Daoist way discards the body, silences cleverness, casts away righteousness and severs humaneness, and departs from shape and intellect alike.',
  ],
  s0072: [
    'Buddhist meaning sees suffering, severs habit, attains extinction by following the Way, clarifies cause and distinguishes fruit, pairs the common with sainthood—though the teachings differ in grade, the meaning draws all upward.',
    'The Buddhist teaching perceives suffering and breaks habit, attains quiescence by treading the path, distinguishes cause from fruit, and lifts the ordinary toward sanctity; though the schools stand at different levels, their aim is to draw all beings upward.',
  ],
  s0073: [
    'From youth\'s learning to the years of knowing fate, I have honored Zhou and Confucius while also following Laozi and the Buddha; since the southward move this craft has not fallen—if you can cultivate it, my wish is fulfilled.',
    'From boyhood through the age of fifty I have revered the teaching of Zhou and Confucius while also walking the paths of Laozi and the Buddha; since the court crossed to the south this learning has not perished, and if you can keep it alive, my heart\'s desire is met.',
  ],
  s0074: [
    'Earlier, Liu Jue of Pei and Zong Lin of Nanyang were with Bao among those who aided the restoration, sharing council in the command tent.',
    'At the outset Liu Jue of Pei and Zong Lin of Nanyang, together with Bao, had helped raise the dynasty from ruin and sat with him in the war council.',
  ],
  s0075: [
    'Liu Jue, courtesy name Zhongbao, was seventh-generation descendant of Jin\'s Administrator of Danyang, Zhenchang.',
    'Liu Jue, styled Zhongbao, was the seventh-generation descendant of Liu Zhenchang, Jin\'s governor of Danyang.',
  ],
  s0076: [
    'In youth he was upright and possessed breadth of character.',
    'As a young man he was square in conduct and broad in capacity.',
  ],
  s0077: [
    'Starting as a National University ritual student he took top rank in the archery-and-policy examination, became magistrate of Ninghai, gradually rose to Staff Recorder for the Prince of Xiangdong, then Central Recorder.',
    'He began as a ritual student in the national university, took first place in the policy examination, served as magistrate of Ninghai, and in time became recorder on the staff of the Prince of Xiangdong and then central recorder.',
  ],
  s0078: [
    'In Taqing Hou Jing rebelled; the Ancestral Sovereign took provisional authority upstream—dispatches were largely entrusted to Jue, who also exerted himself in loyal service and was richly rewarded.',
    'During the Taqing troubles Hou Jing rose in revolt; as the ancestral sovereign assumed provisional rule on the upper Yangtze, most proclamations and letters were placed in Jue\'s hands, and his tireless loyalty won him high favor.',
  ],
  s0079: [
    'He served as Left Assistant Director of the Secretariat and Censor-in-Chief.',
    'He held the posts of left assistant director of the secretariat and censor-in-chief.',
  ],
  s0080: [
    'In Chengsheng year 2 he was moved to Minister of Personnel and Libationer of the National University, other duties unchanged.',
    'In the second year of Chengsheng he became minister of personnel and libationer of the national university, retaining his other offices.',
  ],
  s0081: [
    'Zong Lin, courtesy name Yuanlin.',
    'Zong Lin, styled Yuanlin.',
  ],
  s0082: [
    'His eighth-generation ancestor Cheng was Jin Administrator of Yidu; when Yongjia forced the eastward migration, descendants settled in Jiangling.',
    'Eight generations back his forebear Cheng had been Jin\'s administrator of Yidu; when the Yongjia upheaval drove the court east, the family took up residence in Jiangling.',
  ],
  s0083: [
    'Lin in youth was clever and loved learning, never weary day or night; his district called him "the boy scholar."',
    'As a boy Lin was quick and studious, laboring day and night without rest, and his neighbors nicknamed him "the child academician."',
  ],
  s0084: [
    'In Putong he was Concurrent Recorder in the Prince of Xiangdong\'s household, moved to prison affairs and still held charge of correspondence.',
    'Under the Putong reign he served as concurrent recorder in the household of the Prince of Xiangdong, then took charge of criminal cases while continuing to manage written records.',
  ],
  s0085: [
    'He served as magistrate of Linru, Jiancheng, Guangjin, and elsewhere, later Vice-Governor of Jingzhou under the Ancestral Sovereign.',
    'He governed as magistrate of Linru, Jiancheng, Guangjin, and other districts, and later became vice-governor of Jingzhou under the ancestral sovereign.',
  ],
  s0086: [
    'When the Ancestral Sovereign took the throne, Lin was made Secretariat Gentleman, enfeoffed as Marquis of Xin\'an county with a fief of one thousand households.',
    'At the ancestral sovereign\'s accession he was appointed secretariat gentleman and enfeoffed as marquis of Xin\'an county with a fief of one thousand households.',
  ],
  s0087: [
    'He rose through Section Chief of Personnel, Minister of the Five Armies, and Minister of Personnel.',
    'He advanced through section chief in the ministry of personnel, minister of the five armies, and finally minister of personnel.',
  ],
  s0088: [
    'In Chengsheng year 3 Jiangling fell; with Jue he passed into Zhou.',
    'In the third year of Chengsheng Jiangling was overrun, and he was taken into Zhou together with Liu Jue.',
  ],
  s0089: [
    'Wang Cheng, courtesy name Anqi, was son of Vice Director Yang.',
    'Wang Cheng, styled Anqi, was the son of Vice Director Wang Yang.',
  ],
  s0090: [
    'At seven he mastered the Book of Changes and was selected as a National University student.',
    'At seven he had mastered the Book of Changes and was chosen for the national university.',
  ],
  s0091: [
    'At fifteen he took top rank in the archery-and-policy examination and was appointed Secretary Gentleman.',
    'At fifteen he placed first in the policy examination and was made secretary gentleman.',
  ],
  s0092: [
    'He served as Crown Prince Attendant, Literary Adjutant to the Prince of Kang of Nankang, Companion to the Prince of Shaoling, and Crown Prince Central Attendant.',
    'He held posts as crown prince attendant, literary adjutant to the Prince of Kang of Nankang, companion to the Prince of Shaoling, and crown prince central attendant.',
  ],
  s0093: [
    'He left office on his father\'s death.',
    'He resigned when his father died.',
  ],
  s0094: [
    'When mourning ended he returned as Central Attendant, rose to Palace Attendant of the Secretariat and Yellow Gates, and concurrently Erudite of the National University.',
    'After mourning he resumed service as central attendant, advanced to palace attendant of the secretariat and yellow gates, and also served as erudite of the national university.',
  ],
  s0095: [
    'Then the pampered scions of great houses all prized literary accomplishments and rarely took classical learning as their craft; only Cheng loved it—in speech and discourse he matched the ru even in haste.',
    'In those days the wealthy and fashionable set one another literary feats and seldom devoted themselves to the classics; Cheng alone delighted in the canon, and even in offhand talk he spoke like a true Confucian scholar.',
  ],
  s0096: [
    'In the Academy he instructed students, expounding the meanings of the Rituals and the Changes.',
    'At the university he taught the students, lecturing on the meaning of the Rituals and the Book of Changes.',
  ],
  s0097: [
    'In year 5 of Zhongdatong he was promoted to Chief Director concurrent Palace Attendant, soon Libationer of the National University.',
    'In the fifth year of Zhongdatong he was made chief director with concurrent appointment as palace attendant, and soon afterward became libationer of the national university.',
  ],
  s0098: [
    'Cheng\'s grandfather Jian and father Yang had both held this post—three generations as National Teachers, unmatched in earlier ages; contemporaries took it as glory.',
    'His grandfather Jian and his father Yang had each held the same office, so that three generations in succession served as national teacher—a thing unheard of in earlier times and regarded in his day as supreme honor.',
  ],
  s0099: [
    'After some time he went out as General of Martial Manifestation and Administrator of Dongyang.',
    'Before long he was sent out as general of martial manifestation and administrator of Dongyang.',
  ],
  s0100: [
    'His governance was lenient and kind; officials and people were pleased with him.',
    'He ruled with generosity and grace, and both clerks and commoners rejoiced in him.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_041_b1.mjs <translation.json>'
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
