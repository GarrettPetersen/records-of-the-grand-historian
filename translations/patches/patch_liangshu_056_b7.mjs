#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'Sengbian advanced his army and encamped at Zhang Gong Isle.',
    'Sengbian marched his army to Zhang Gong Isle.',
  ],
  s0602: [
    'Jing had Lu Huilue hold Stone Fort and Hexijin hold Defend-the-State city, and drove all commoners and soldiers\' families into Terrace City.',
    'Jing put Lu Huilue in Stone Fort and Hexijin in Defend-the-State city, and forced every civilian and soldier\'s kin into Terrace City.',
  ],
  s0603: [
    'Sengbian burned Jing\'s river palisades, entered the Huai, and reached Xiangling Temple shoal.',
    'Sengbian burned Jing\'s river barriers, crossed into the Huai, and reached Xiangling Temple shoal.',
  ],
  s0604: [
    'Jing was greatly alarmed and built palisades along the Huai from Stone Fort to Vermilion Bird Ford.',
    'Jing was terrified and ran palisades along the Huai from Stone Fort to Vermilion Bird Ford.',
  ],
  s0605: [
    'Sengbian and the other generals then on foot west of Stone Fort city linked camps and raised palisades as far as Falling Star Mound.',
    'Sengbian and his generals then linked camps on foot west of Stone Fort and raised palisades to Falling Star Mound.',
  ],
  s0606: [
    'Jing was greatly afraid; he personally led Hou Zijian, Yu Qing, Shi Anhe, Wang Senggui, and others to build palisades northeast of Stone Fort and hold them.',
    'Jing was badly shaken. He himself led Hou Zijian, Yu Qing, Shi Anhe, Wang Senggui, and others to raise palisades northeast of Stone Fort and stand firm.',
  ],
  s0607: [
    'He sent Wang Wei, Suo Chaoshi, and Lü Jilue to hold Terrace City, and Song Changgui to hold Yanzuo Temple.',
    'He sent Wang Wei, Suo Chaoshi, and Lü Jilue to hold Terrace City and Song Changgui to hold Yanzuo Temple.',
  ],
  s0608: [
    'He sent men to dig up Wang Sengbian\'s father\'s tomb, open the coffin, and burn the corpse.',
    'He had Wang Sengbian\'s father\'s tomb opened, the coffin broken, and the body burned.',
  ],
  s0609: [
    'Wang Sengbian and the others advanced their camps north of Stone Fort city; Jing drew up battle lines and offered challenge.',
    'Wang Sengbian and the others moved camp north of Stone Fort; Jing formed ranks and challenged them.',
  ],
  s0610: [
    'Sengbian led the mass of troops in a fierce assault and routed them utterly. Hou Zijian, Shi Anhe, and Wang Senggui each abandoned their palisades and fled; Lu Huilue and Hexijin both surrendered their cities.',
    'Sengbian led the whole army in a furious charge and broke them completely. Hou Zijian, Shi Anhe, and Wang Senggui fled their palisades; Lu Huilue and Hexijin surrendered both cities.',
  ],
  s0611: [
    'Jing, already beaten in retreat, did not enter the palace; he gathered his scattered troops, encamped below the gate-towers, and was about to flee.',
    'Beaten back, Jing would not enter the palace. He gathered scattered troops below the gate-towers and prepared to run.',
  ],
  s0612: [
    'Wang Wei took the reins and remonstrated: "Since antiquity, has there ever been one who betrayed the Son of Heaven!',
    'Wang Wei seized the bridle and pleaded, "Since antiquity, who has ever betrayed the Son of Heaven!',
  ],
  s0613: [
    'The palace guards alone are still enough for one battle—how can you flee at once? If you abandon this place, where can you go?',
    'The guards in the palace could still fight one battle. How can you flee now? If you leave this, where will you go?',
  ],
  s0614: [
    '" Jing said: "In the north I fought He Ba Sheng, broke Ge Rong, and made my name on the Yellow River and north of the Great Wall—I am that sort of man, like Gao Wang.',
    '" Jing said, "In the north I fought He Ba Sheng, broke Ge Rong, and made my name on the Yellow River and beyond the frontier. I am a man of Gao Wang\'s kind.',
  ],
  s0615: [
    'Now coming south across the great river, I took Terrace City as easily as turning my hand; at North Hill I struck Prince Shao of Shaoling; on the south bank I broke Liu Zhongli—all with my own eyes.',
    'Coming south across the great river I took Terrace City as easily as turning my hand. At North Hill I struck Prince Shao of Shaoling; on the south bank I broke Liu Zhongli. I saw it all myself.',
  ],
  s0616: [
    'Today\'s affair, I fear, is Heaven\'s decree of ruin.',
    'What has happened today, I fear, is Heaven decreeing my end.',
  ],
  s0617: [
    'So guard the city well—I shall make one more try."',
    'Hold the city well. I will make one more stand."',
  ],
  s0618: [
    '" He looked up at the stone gate-towers, hesitated, and sighed.',
    'He looked up at the stone gate-towers, hesitated, and sighed.',
  ],
  s0619: [
    'After a long while he put his two sons in leather sacks hung from the saddle and, with his Yitong Tian Qian, Fan Xirong, and more than a hundred horsemen, fled east.',
    'After a long while he hung his two sons in leather sacks from his saddle and fled east with his Yitong Tian Qian, Fan Xirong, and more than a hundred riders.',
  ],
  s0620: [
    'Wang Wei abandoned Terrace City and fled; Hou Zijian and the others fled to Guangling.',
    'Wang Wei deserted Terrace City and fled; Hou Zijian and the others ran to Guangling.',
  ],
  s0621: [
    'Wang Sengbian sent Hou Tian to lead troops in pursuit of Jing.',
    'Wang Sengbian sent Hou Tian after Jing with an army.',
  ],
  s0622: [
    'Jing reached Jinling commandery, seized Prefect Xu Yong, and fled east to Wu commandery; advancing he halted at Jiaxing, where Zhao Bochao held Qiantang and resisted him.',
    'Jing reached Jinling, seized Prefect Xu Yong, and fled east to Wu commandery. He halted at Jiaxing, where Zhao Bochao held Qiantang against him.',
  ],
  s0623: [
    'Jing fell back to Wu commandery and reached Song River, but Hou Tian\'s army came upon him by surprise; Jing\'s troops had not yet formed ranks and all raised banners begging to surrender.',
    'Jing retreated to Wu commandery and reached Song River, but Hou Tian\'s army fell on him before his men could form ranks. They all raised banners and begged to surrender.',
  ],
  s0624: [
    'Jing could not control them; with several dozen trusted men in a single boat he fled alone, pushed his two sons into the water, and from Hudu outlet entered the sea.',
    'Jing could not hold them. With a few dozen trusted men in one boat he fled alone, threw his two sons into the water, and put to sea from Hudu outlet.',
  ],
  s0625: [
    'Reaching Hudou Isle, former Crown Prince Household Attendant Yang Kun killed him, sent the corpse to Wang Sengbian, forwarded the head to the Western Terrace, and exposed the body in Jiankang market.',
    'At Hudou Isle, former crown prince household attendant Yang Kun killed him, sent the body to Wang Sengbian, forwarded the head to the Western Terrace, and exposed the corpse in Jiankang market.',
  ],
  s0626: [
    'Commoners vied to butcher and slice it for food, burned the bones, and scattered the ash.',
    'The people fought to carve and eat his flesh, burned his bones, and scattered the ash.',
  ],
  s0627: [
    'Those who had once suffered his harm mixed the ash with wine and drank it.',
    'Those he had once harmed mixed the ash with wine and drank it down.',
  ],
  s0628: [
    'When Jing\'s head reached Jiangling, Shizu ordered it displayed in the market, then boiled, lacquered, and sent to the armory.',
    'When Jing\'s head reached Jiangling, Shizu had it displayed in the market, then boiled, lacquered, and stored in the armory.',
  ],
  s0629: [
    'Jing was less than seven feet tall, yet his brows and eyes were fine and handsome.',
    'Jing stood under seven feet, yet his brows and eyes were fine and handsome.',
  ],
  s0630: [
    'By nature he was suspicious and cruel, fond of killing.',
    'He was suspicious and cruel by nature and loved killing.',
  ],
  s0631: [
    'When punishing men he would first cut off hands and feet, slice out the tongue, and cut off the nose; only after a full day would they die.',
    'When he punished men he first cut off hands and feet, sliced out the tongue, and cut off the nose. They would not die until a full day had passed.',
  ],
  s0632: [
    'Once at Stone Fort he set up a great pounding mortar; whoever broke the law was pounded to death—his cruelty and savagery were like this.',
    'Once at Stone Fort he erected a great pounding mortar. Every lawbreaker was pounded to death. His cruelty was like that.',
  ],
  s0633: [
    'After usurping the throne he often wore a white gauze cap yet still draped a green robe, or stuck an ivory comb in his topknot.',
    'After seizing the throne he often wore a white gauze cap over a green robe, or stuck an ivory comb in his hair.',
  ],
  s0634: [
    'On his bed he always kept a camp stool and a folding seat; wearing boots he sat with his legs hanging down.',
    'His bed always held a camp stool and a folding seat. Booted, he sat with his legs dangling.',
  ],
  s0635: [
    'Sometimes he rode alone sporting inside the palace, and at Hualin Garden shot at birds.',
    'Sometimes he sported alone on horseback inside the palace, or shot birds in Hualin Garden.',
  ],
  s0636: [
    'His counselor Wang Wei would not allow him to go out lightly; he grew sullen and lost heart altogether.',
    'Counselor Wang Wei would not let him go out lightly. He grew sullen and lost heart.',
  ],
  s0637: [
    'Owls often cried in the hall where he lived; Jing hated it and constantly sent men to scour mountain and wild to hunt them down.',
    'Owls often cried in the hall where he lived. Jing hated it and constantly sent men to scour hills and wilds to catch them.',
  ],
  s0638: [
    'During the Putong era, a children\'s rhyme ran: "Green silk, white horse—Shouyang comes.',
    'In the Putong era a children\'s rhyme ran, "Green silk, white horse—Shouyang comes.',
  ],
  s0639: [
    '" Later Jing indeed rode a white horse, and his soldiers all wore green.',
    '" Later Jing did ride a white horse, and his soldiers all wore green.',
  ],
  s0640: [
    'The horse he rode, whenever battle was about to go his way, would paw and neigh, spirited and swift; when he fled, it always hung its head and would not advance.',
    'His horse, whenever victory was near, would paw and neigh, fierce and swift. When he fled, it always hung its head and refused to go on.',
  ],
  s0641: [
    'At first, in the Zhongdatong era, Gaozu once dreamed by night that governors of the central plains all came offering their lands in surrender; the whole court called it auspicious, and waking he was very pleased.',
    'Earlier, in the Zhongdatong era, Gaozu dreamed one night that every governor of the central plains came offering land in surrender. The whole court called it auspicious, and he woke very pleased.',
  ],
  s0642: [
    'At dawn he told Palace Secretariat Attendant Zhu Yi of the dream. Yi said: "Can this not mean the realm is becoming one under Heaven—that Heaven foreshows its sign?',
    'At dawn he told palace secretariat attendant Zhu Yi of the dream. Yi said, "Does this not mean the realm is becoming one—that Heaven shows its sign in advance?',
  ],
  s0643: [
    '" Gaozu said: "I rarely dream. Last night I felt this—it truly comforts the heart.',
    '" Gaozu said, "I rarely dream. Last night this came to me, and it truly comforts the heart.',
  ],
  s0644: [
    '" In the second year of Taiqing, Jing indeed came to submit. Gaozu was glad of himself, thought it supernatural, debated receiving him, yet his mind was still unsettled.',
    '" In Taiqing year two Jing did come to submit. Gaozu was delighted, took it for a sign, and debated taking him in, but his mind was still unsettled.',
  ],
  s0645: [
    'Once he went out at night to conduct affairs, reaching Wude Pavilion, and spoke alone: "My state is still like a golden bowl without a single chip—if we now accept territory, how can that be right? If disorder follows, there will be no undoing it.',
    'Once at night he went out to conduct affairs, reached Wude Pavilion, and said alone, "My realm is still a golden bowl without a chip. To accept territory now—how can that be right? If trouble follows, it cannot be undone.',
  ],
  s0646: [
    '" Zhu Yi answered in immediate reply: "The sage illumines the realm, above matching the azure dark; the remnant folk of the north—who does not look up in longing?',
    '" Zhu Yi answered at once, "The sage rules the realm, matching Heaven above. Who among the remnant folk of the north does not look up in longing?',
  ],
  s0647: [
    'Without opportunity, their hearts could not be known.',
    'Without opportunity, their hearts could not be known.',
  ],
  s0648: [
    'Now Hou Jing holds more than ten provinces south of the Yellow River, half of Wei territory, renders sincerity and sends pledges, and comes from afar to the holy court—is this not Heaven guiding his inmost heart, men applauding his plan?',
    'Now Hou Jing holds more than ten provinces south of the Yellow River, half of Wei\'s land, renders loyalty and sends pledges, and comes from afar to the holy court. Is this not Heaven guiding his heart and men applauding his plan?',
  ],
  s0649: [
    'Reading his intent and weighing the matter, there is much to praise.',
    'Reading his intent and weighing the matter, there is much to praise.',
  ],
  s0650: [
    'If you now refuse and do not accept him, I fear later arrivals will lose hope. This is easy to see—your Majesty need not doubt.',
    'If you refuse him now, I fear later comers will lose hope. That is easy to see. Your Majesty need not doubt.',
  ],
  s0651: [
    '" Gaozu deeply took up Yi\'s words, trusted the earlier dream as well, and decided to receive Jing.',
    '" Gaozu took Yi\'s words to heart, trusted the earlier dream as well, and decided to receive Jing.',
  ],
  s0652: [
    'When Zhenyang was overthrown in defeat and border garrisons panicked, Gaozu was already worried, saying: "I am now like this—are we not doing Jin\'s business?"',
    'When Zhenyang fell and the border garrisons panicked, Gaozu was already worried. He said, "I am like this now—are we not repeating Jin\'s fate?"',
  ],
  s0653: [
    'Earlier, Tao Hongjing of Danyang, living in seclusion on Mount Hua, learned and widely knowing, once composed a poem: "Yi Fu lived in idle dissipation; Ping Shu sat discoursing on emptiness.',
    'Earlier Tao Hongjing of Danyang, living in seclusion on Mount Hua, learned and widely read, once wrote a poem: "Yi Fu lived in idle dissipation; Ping Shu sat discoursing on emptiness.',
  ],
  s0654: [
    'Who would have thought Zhaoyang Hall would become a Xiongnu palace.',
    'Who would have thought Zhaoyang Hall would become a Xiongnu palace.',
  ],
  s0655: [
    '" At the end of Datong, gentlemen rivaled one another in discussing arcane principle and did not practice military affairs;',
    '" At the end of Datong, gentlemen rivaled one another in discussing arcane principle and did not practice military affairs;',
  ],
  s0656: [
    'now Jing indeed occupied Zhaoyang Hall.',
    'Now Jing did occupy Zhaoyang Hall.',
  ],
  s0657: [
    'During the Tianjian era, the monk Baozhi said: "The tail-digging dog goes mad by itself; when due to die yet not dead it bites and wounds men; in a moment it perishes of itself—rising from Ruyin it dies in the Three Xiang.',
    'In the Tianjian era the monk Baozhi said, "The tail-digging dog goes mad by itself. When it should die but does not, it bites and wounds men. In a moment it perishes—rising from Ruyin, dying in the Three Xiang.',
  ],
  s0658: [
    '" He also said: "The mountain man\'s child indeed flings up his sleeves, at the front of Taiji Hall making a tiger\'s stare.',
    '" He also said, "The mountain man\'s child flings up his sleeves and at the front of Taiji Hall stares like a tiger.',
  ],
  s0659: [
    '" "Tail-digging dog" and "mountain man\'s child" both suggest a monkey\'s form.',
    '" "Tail-digging dog" and "mountain man\'s child" both suggest a monkey\'s shape.',
  ],
  s0660: [
    'Jing then overthrew and seized the capital, poisoning the imperial house.',
    'Jing then overthrew the capital and poisoned the imperial house.',
  ],
  s0661: [
    'During Datong, Court Physician Zhu Zhan once attended the forbidden precinct. Before long, by night he dreamed a dog and a sheep each on the imperial seat; waking, he hated it and told others: "Dog and sheep—neither is an auspicious thing.',
    'During Datong, court physician Zhu Zhan attended the forbidden precinct. One night he dreamed a dog and a sheep each on the imperial seat. Waking, he hated it and told others, "Dog and sheep are no good omen.',
  ],
  s0662: [
    'Now occupying the imperial seat—will there be upheaval?',
    'Now on the imperial seat—will there be upheaval?',
  ],
  s0663: [
    '" Before long the Son of Heaven suffered exile in the dust, and Jing ascended the main hall.',
    '" Before long the Son of Heaven suffered exile in the dust, and Jing ascended the main hall.',
  ],
  s0664: [
    'When Jing was about to fall, there was a monk called Tong whose mind seemed half mad; he drank wine and ate meat no differently from ordinary men. He had wandered the world for several decades—name, home, and village, none could know.',
    'When Jing was about to fall, there was a monk called Tong whose mind seemed half mad. He drank wine and ate meat like any ordinary man. He had wandered the world for decades, and no one knew his name or home.',
  ],
  s0665: [
    'At first his words were hidden; only after long delay were they verified. All called him acarya, and Jing trusted and honored him deeply.',
    'At first his words were obscure; only long afterward were they verified. All called him acarya, and Jing trusted and honored him deeply.',
  ],
  s0666: [
    'Jing once in the rear hall shot with his followers; Monk Tong was present, seized Jing\'s bow, and shot at Jingyang Hill, shouting, "Got the slave!"',
    'Jing once shot with his followers in the rear hall. Monk Tong was there, seized Jing\'s bow, and shot at Jingyang Hill, shouting, "Got the slave!"',
  ],
  s0667: [
    'Later Jing again feasted his faction and summoned Monk Tong once more.',
    'Later Jing feasted his faction again and summoned Monk Tong once more.',
  ],
  s0668: [
    'Monk Tong took meat dipped in salt and presented it to Jing, asking: "Good?',
    'Monk Tong took meat dipped in salt and offered it to Jing, asking, "Good?',
  ],
  s0669: [
    '" Jing answered: "My only regret is it is too salty.',
    '" Jing answered, "My only regret is it is too salty.',
  ],
  s0670: [
    '" Monk Tong said: "Without salt it rots and stinks.',
    '" Monk Tong said, "Without salt it rots and stinks.',
  ],
  s0671: [
    '" Indeed his corpse was sealed with salt.',
    '" Indeed his corpse was sealed with salt.',
  ],
  s0672: [
    'Wang Wei was a man of Chenliu.',
    'Wang Wei came from Chenliu.',
  ],
  s0673: [
    'In youth he had talent in letters; Jing\'s memorials, reports, letters, and proclamations were all composed by him.',
    'In youth he had literary talent. Jing\'s memorials, reports, letters, and proclamations were all his work.',
  ],
  s0674: [
    'Once Jing had achieved his ambition, the planning and pattern of usurpation were all Wei\'s counsel.',
    'Once Jing had his way, every plan for usurpation was Wei\'s counsel.',
  ],
  s0675: [
    'When he was bound and sent to Jiangling, he was boiled in the market; commoners who had suffered his poison all sliced and roasted his flesh to eat.',
    'When he was bound and sent to Jiangling, he was boiled in the market. Commoners who had suffered his poison sliced and roasted his flesh to eat.',
  ],
  s0676: [
    'Commentary section marker in the source text.',
    'Marker denoting the historian\'s commentary section in the source text.',
  ],
  s0677: [
    'The historian says: The Way is not always level; fortune is not always secure—thus success and failure have measure, prosperity and decline succeed one another; the age stalls in yang\'s ninth calamity—this lies here.',
    'The historian writes: The Way is not always smooth; fortune is not always secure. Rise and fall have their measure, prosperity and decline follow in turn. The age stalls in yang\'s ninth calamity—and that is here.',
  ],
  s0678: [
    'As for the petty wretch Hou Jing—rebellious and disloyal to his own state, insight not reaching his person, courage not exceeding the norm—yet Wang Wei was his chief strategist and accomplished this wicked treachery.',
    'As for the petty wretch Hou Jing—rebellious to his own state, insight not reaching his person, courage nothing out of the ordinary—Wang Wei was his chief strategist and made this wicked treachery possible.',
  ],
  s0679: [
    'Driving ugly followers, crossing the river directly eastward, long halberds and strong crossbows, overthrowing palace and tower, disaster entwining the supreme throne, poison spread through the common folk, indulging his arbitrary heart, completing his usurping treachery.',
    'He drove ugly followers straight across the river, long halberds and strong crossbows overturning palace and tower, disaster coiling around the throne, poison spreading through the people, indulging his will to the full, completing his usurping crime.',
  ],
  s0680: [
    'Alas!',
    'Alas!',
  ],
  s0681: [
    'When a state is about to perish, monsters and freaks descend.',
    'When a state is about to perish, monsters and freaks descend.',
  ],
  s0682: [
    'Though called human affairs, yet it is Heaven\'s timing.',
    'Though men call it human affairs, it is Heaven\'s timing.',
  ],
  s0683: [
    'In old times Yi of Xia brought chaos to Xia, the Quan Rong threatened Zhou; under Han, Wang Mang and Dong Zhuo spread disaster; under Jin, Wang Dun and Huan Xuan engineered calamity—compared with the Jie bandit, this exceeded their cruelty. Alas!',
    'In old times Yi of Xia brought chaos to Xia and the Quan Rong threatened Zhou. Under Han, Wang Mang and Dong Zhuo spread disaster; under Jin, Wang Dun and Huan Xuan engineered calamity. Compared with the Jie bandit, this was crueller still. Alas!',
  ],
  s0684: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0685: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_056_b7.mjs <translation.json>'
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
