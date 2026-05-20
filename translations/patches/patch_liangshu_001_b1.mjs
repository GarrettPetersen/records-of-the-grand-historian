#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 1, Basic Annals 1',
    'Book of Liang, Volume 1, Annals 1',
  ],
  s0002: [
    'Emperor Wu, Part 1',
    'Emperor Wu, Part One',
  ],
  s0003: [
    'Gaozu, the Martial Emperor, taboo name Yan, styled Shuda, childhood name Lian\'er, a native of Zhongdu village in Nan Luling, was a descendant of Han Chancellor of State He.',
    'Gaozu, the Martial Emperor, taboo name Yan, styled Shuda, childhood name Lian\'er, came from Zhongdu village in Nan Luling and traced his line to Han Chancellor of State He.',
  ],
  s0004: [
    'He sired Ding Marquis Yan; Yan sired Attendant-in-Ordinary Biao; Biao sired Grandee\'s Assistant Zhang; Zhang sired Hao; Hao sired Yang; Yang sired Grand Tutor of the Heir Wang Zhi; Wang Zhi sired Minister of the Household Yu; Yu sired Imperial Censor Zhongcheng Shao; Shao sired Superintendent of the Bright Halls Hong; Hong sired Administrator of Jiyin Chan; Chan sired Administrator of Wu commandery Bing; Bing sired Chancellor of Zhongshan Bao; Bao sired Erudite Zhou; Zhou sired Chief of Sheqi district Jiao; Jiao sired Secretariat Aide Kui; Kui sired Filial and Incorrupt Xiuxiu; Xiuxiu sired Assistant Commandery Administrator of Guangling Bao; Bao sired Grand Master for All Purposes Yi; Yi sired Magistrate of Huaiyin Zheng; Zheng sired Administrator of Jiyin Zheng; Zheng sired Commandery Administration Vice-director Fuzi; Fuzi sired Southern Tribunal Clerk Daoci; Daoci sired the Late Emperor\'s father, taboo name Shunzhi, a clansman of Qi Gaodi.',
    'He begat Ding Marquis Yan, who begat Attendant-in-Ordinary Biao, and so down the line through Grand Tutor Wang Zhi, Ministers of the Household, censors, administrators, and clerks to the Late Emperor\'s father Shunzhi, a kinsman of Qi Gaodi.',
  ],
  s0005: [
    'He participated in assisting the founding mandate and was enfeoffed as Marquis of Linxiang county.',
    'He took part in founding the dynasty and was enfeoffed as Marquis of Linxiang county.',
  ],
  s0006: [
    'His offices included Attendant-in-Ordinary, Minister of Guards, Grand Tutor of the Heir Apparent, Defender-in-Chief, and Governor of Danyang; posthumously he was conferred Pacification North General.',
    'He served as Attendant-in-Ordinary, Minister of Guards, Grand Tutor of the Heir Apparent, Defender-in-Chief, and governor of Danyang, and after death was made Pacification North General.',
  ],
  s0007: [
    'Gaozu was born in year jiachen of the eighth year of Emperor Xiaowu of Song\'s Daming era at the Three Bridge residence in Tongxia village, Moling county.',
    'Gaozu was born in the jiachen year of Daming 8 (464 CE), at the Three Bridge house in Tongxia village, Moling county.',
  ],
  s0008: [
    'At birth there were marvels: his hip bones were joined, the crown of his head was raised, and on his right hand was writing that read "Martial."',
    'At birth he showed omens: fused hip bones, a raised crown, and the character for "Martial" written on his right hand.',
  ],
  s0009: [
    'When the Emperor grew up, he was broadly learned and mastered many subjects, fond of strategy, and possessed civil and military talent and ability; the celebrated figures of the time all acclaimed him.',
    'As he matured he became deeply learned, loved strategy, and showed both literary and martial gifts; the leading men of the age all praised him.',
  ],
  s0010: [
    'The residence where he lived often seemed shrouded in cloud-mist; those who passed by involuntarily grew solemn.',
    'Clouds often seemed to hang over his dwelling, and passersby felt themselves grow solemn without knowing why.',
  ],
  s0011: [
    'He began his career as Acting Aide in the Law Section on the staff of the Prince of Baling\'s Southern General of the Center, then transferred to East Pavilion Libationer under General of Guards Wang Jian.',
    'He entered service as a law aide on Prince of Baling\'s staff, then became East Pavilion Libationer under General of Guards Wang Jian.',
  ],
  s0012: [
    'Jian, on first meeting, deeply admired him and said to He Xian of Lujiang: "Within thirty years this young Xiao will become Attendant-in-Ordinary; beyond that his nobility is beyond words.',
    'At their first meeting Jian marked him as extraordinary and told He Xian of Lujiang, "This young Xiao will reach Attendant-in-Ordinary within thirty years; after that his rise will be beyond telling.',
  ],
  s0013: [
    '" Prince Ziliang of Jingling opened the Western Pavilion to recruit men of letters; Gaozu together with Shen Yue, Xie Tiao, Wang Rong, Xiao Chen, Fan Yun, Ren Fang, Lu Chui, and others all frequented it, and they were called the Eight Friends.',
    '" Prince Ziliang of Jingling opened the Western Pavilion for literary men; Gaozu joined Shen Yue, Xie Tiao, Wang Rong, Xiao Chen, Fan Yun, Ren Fang, Lu Chui, and others there, and they were known as the Eight Friends.',
  ],
  s0014: [
    'Rong was brilliant and forthright, his discernment surpassing others; he especially honored and admired Gaozu, often telling those close to him: "To command the realm must be this man.',
    'Rong was sharp and perceptive beyond his peers and held Gaozu in special esteem, often telling intimates, "The man who will rule the realm is this one.',
  ],
  s0015: [
    '" He was promoted in succession to Advisory Aide on the Prince of Sui\'s Western Pacification staff; soon, on his late father\'s mourning, he left office.',
    '" He rose to advisory aide on the Prince of Sui\'s western staff, then left office to mourn his father.',
  ],
  s0016: [
    'At the beginning of Longchang, when Emperor Ming held regency, Gaozu was recalled as General Who Pacifies the North and garrisoned Shouchun.',
    'At the start of Longchang, with Emperor Ming acting as regent, Gaozu was recalled as General Who Pacifies the North and posted at Shouchun.',
  ],
  s0017: [
    'When mourning ended, he was appointed Heir Apparent\'s Household Attendant and Bearer of the Yellow Gate, entering straight duty in the Palace Directorate.',
    'After mourning he became Heir Apparent\'s Household Attendant and Bearer of the Yellow Gate, serving on palace duty.',
  ],
  s0018: [
    'For his merit in fixing policy with Xiao Chen and others, he was enfeoffed as Baron of Jianyang county, fief of three hundred households.',
    'For helping Xiao Chen and others settle the succession, he was enfeoffed Baron of Jianyang, fief of three hundred households.',
  ],
  s0019: [
    'In the second year of Jianwu, Wei sent generals Liu Chang and Wang Su at the head of troops to raid Si province; Gaozu was made General Who Conquers All and army commander, subordinate to Jiangzhou Inspector Wang Guangzhi as relief.',
    'In Jianwu 2, Wei generals Liu Chang and Wang Su invaded Si province; Gaozu was made General Who Conquers All and army commander under Jiangzhou inspector Wang Guangzhi.',
  ],
  s0020: [
    'Over a hundred li from Yiyang, the masses, because Wei troops were strong, hesitated and none dared advance.',
    'A hundred li short of Yiyang, the army hung back before Wei\'s strength and no one dared move forward.',
  ],
  s0021: [
    'Gaozu requested to open the attack first; Guang immediately assigned elite troops from his command to Gaozu.',
    'Gaozu asked to lead the first strike; Guang at once gave him picked troops from his own command.',
  ],
  s0022: [
    'That same night he advanced; several li from the Wei army, he went straight up Xianshou Mountain.',
    'That night he marched on, climbed Xianshou Mountain, and halted only a few li from the Wei camp.',
  ],
  s0023: [
    'The Wei army could not gauge their numbers and did not dare press close.',
    'The Wei force could not tell how many they were and did not dare close in.',
  ],
  s0024: [
    'At dawn, those inside the city saw relief arrive and thus sent troops out to attack the Wei palisade.',
    'At daybreak the city garrison saw help had come and sallied out against the Wei stockade.',
  ],
  s0025: [
    'Gaozu led his command in attack from outside.',
    'Gaozu led his men in from outside.',
  ],
  s0026: [
    'The Wei army was attacked from within and without, then abandoned heavy encirclement and retreated.',
    'Caught between the sortie and Gaozu\'s assault, the Wei army broke siege and fled.',
  ],
  s0027: [
    'When the campaign ended, Gaozu was made Right Army Prince of Jin\'an\'s Staff Officer and Administrator of Huailing.',
    'After the campaign Gaozu became staff officer to Prince of Jin\'an\'s Right Army and administrator of Huailing.',
  ],
  s0028: [
    'He returned as Heir Apparent\'s Household Attendant and commanded the Feathered Forest Guard.',
    'He returned to court as Heir Apparent\'s Household Attendant and took command of the Feathered Forest Guard.',
  ],
  s0029: [
    'Before long, he went out to garrison Stone Fort.',
    'Soon afterward he went out to garrison Stone Fort.',
  ],
  s0030: [
    'In the fourth year, the Wei Emperor personally led a great host to raid Yong province; Emperor Ming ordered Gaozu to go to relief.',
    'In the fourth year the Wei emperor invaded Yong province in person; Emperor Ming ordered Gaozu to relieve it.',
  ],
  s0031: [
    'In the tenth month he reached Xiangyang.',
    'He reached Xiangyang in the tenth month.',
  ],
  s0032: [
    'An edict also sent Minister of the Left Cui Huijing as overall commander of all armies; Gaozu and Yong province Inspector Cao Hu and others all received his direction.',
    'An edict also made Minister of the Left Cui Huijing overall commander; Gaozu, Yong province inspector Cao Hu, and the rest came under his orders.',
  ],
  s0033: [
    'In the third month of the next year, Huijing and Gaozu advanced toward Deng city; the Wei ruler led more than a hundred thousand horsemen and suddenly arrived.',
    'The next year, in the third month, Huijing and Gaozu marched on Deng city as the Wei ruler swept in with more than a hundred thousand cavalry.',
  ],
  s0034: [
    'Huijing turned pale and wished to withdraw; Gaozu firmly stopped him but he would not heed, then in disarray pulled out himself.',
    'Huijing lost color and wanted to retreat; Gaozu tried hard to hold him, but he would not listen and broke away in disorder.',
  ],
  s0035: [
    'Wei horsemen pursued; thus there was great defeat.',
    'Wei cavalry chased them down and routed the army.',
  ],
  s0036: [
    'Gaozu alone led the troops to hold off battle, killing several tens or hundreds of men; Wei horsemen slightly withdrew, and he was thus able to form ranks and cover the rear; by evening he could board ship.',
    'Gaozu alone held the rear, killing dozens or hundreds until the Wei riders fell back; he then formed up, covered the retreat, and reached the boats by nightfall.',
  ],
  s0037: [
    'Huijing\'s army was dead and wounded almost completely; only Gaozu returned with his army intact.',
    'Huijing\'s force was nearly wiped out; only Gaozu brought his troops back whole.',
  ],
  s0038: [
    'Soon Gaozu was made acting Yong province headquarters affairs.',
    'Soon Gaozu was put in charge of Yong province headquarters affairs.',
  ],
  s0039: [
    'In the seventh month, he was still granted Bearer of the Staff, Commander of all military affairs of Yong, Liang, North Qin, and South Qin four provinces and Ying province\'s Jingling and Si province\'s Sui commandery, Assistant State General, and Yong province Inspector.',
    'In the seventh month he received bearer of the staff, command over Yong, Liang, North Qin, South Qin, Jingling, and Sui, Assistant State General, and the Yongzhou inspectorship.',
  ],
  s0040: [
    'That month, Emperor Ming died and Dong Hun succeeded; Yangzhou Inspector Prince Yao Guang of Shi\'an, Director of the Masters of Writing Xu Xiaosi, Right Vice Director of the Masters of Writing Jiang Shi, Right General Xiao Tanzhi, Attendant-in-Ordinary Jiang Si, and Minister of Guards Liu Xuan all took turns on duty inside the palace, dividing days for posting edicts.',
    'That month Emperor Ming died and Dong Hun succeeded; Prince Yao Guang of Shi\'an, Xu Xiaosi, Jiang Shi, Xiao Tanzhi, Jiang Si, and Liu Xuan rotated palace duty and took turns issuing edicts.',
  ],
  s0041: [
    'Gaozu heard this and said to his maternal uncle Zhang Hongce: "Government issuing from many gates—its steps to disorder are set.',
    'When Gaozu heard this he told his maternal uncle Zhang Hongce, "When power comes from too many hands, disorder follows close behind.',
  ],
  s0042: [
    'The Odes says: \'One state, three dukes—whom shall I follow?',
    'The Odes says, \'One realm, three lords—whom should I obey?',
  ],
  s0043: [
    '\' And now there are six—how can it be done!',
    '\' And now there are six—how is that supposed to work!',
  ],
  s0044: [
    'If suspicion and rifts form, they will slaughter each other; to avoid calamity today, only this place will serve.',
    'Once suspicion sets in they will destroy one another; to escape disaster now, only this post can save us.',
  ],
  s0045: [
    'Diligently practice benevolence and righteousness, and one may sit and become Lord of the West.',
    'If we act with benevolence and righteousness, we can secure the west and wait our turn.',
  ],
  s0046: [
    'But the younger brothers are in the capital, fearing they will suffer worldly harm—we must also plot with Yizhou about this."',
    'But our brothers remain in the capital and may come to harm; we must also plan with Yizhou."',
  ],
  s0047: [
    'At the time Gaozu\'s eldest brother Yi had finished Yizhou and returned, still handling Ying province affairs; he therefore sent Hongce to Ying to lay the plan before Yi: "Formerly Jin Emperor Hui was a mediocre ruler; the princes contended for power, thus nine internal disasters arose and three external invasions occurred.',
    'Gaozu\'s eldest brother Yi had just left Yizhou and was acting in Ying province, so Gaozu sent Hongce to lay out the plan: "Under the feckless Emperor Hui of Jin the princes fought for power, bringing nine internal crises and three foreign invasions.',
  ],
  s0048: [
    'Now the six exalted ones contend for power; each holds the king\'s command, controls the ruler and drafts edicts, each wishing exclusive authority; grievances over trifles become hatred—in principle they will slaughter each other.',
    'Now six men grasp the imperial seal, draft edicts for the throne, and each seek sole power; the smallest slights become deadly grudges, and slaughter is inevitable.',
  ],
  s0049: [
    'Moreover the heir on the eastern palace originally had no fine reputation; he draws close to petty companions, bee-eyed and cruel to men; holding all affairs of state, indulging every desire—how would he willingly sit empty as nominal sovereign and delegate government to court ministers?',
    'The heir has never had a good name; he keeps vicious company, governs by caprice, and will never sit idle while ministers run the realm.',
  ],
  s0050: [
    'Accumulated mutual suspicion and division will certainly mean great executions and slaughter.',
    'Mutual distrust will only deepen until blood fills the palace.',
  ],
  s0051: [
    'Shi\'an wishes to become another Zhao Lun—his tracks are already visible; a lame man climbing to Heaven—truly there is no such principle.',
    'Prince Yao Guang of Shi\'an already shows the makings of another Zhao Lun; a cripple climbing to Heaven is not in the order of things.',
  ],
  s0052: [
    'Moreover his nature is very suspicious and narrow; he will only seize opportunities for chaos.',
    'He is suspicious and petty by nature and will seize any chance to make trouble.',
  ],
  s0053: [
    'Those who can hold the axle are only Jiang and Liu.',
    'Only Jiang and Liu are left who might hold the center.',
  ],
  s0054: [
    'Shi is timid and indecisive; Xuan is weak and without talent—overturning the cauldron and spilling the broth can be awaited with foot raised.',
    'Jiang Shi is timid and cannot decide; Liu Xuan is weak and incompetent—the cauldron is ready to tip.',
  ],
  s0055: [
    'Xiao Tanzhi\'s breast harbors suspicion; at every word he speaks of mutual harm. Xu Xiaosi\'s talent is not pillar-stone stuff—he lets others lead him by the nose; if rifts open and trouble rises, inside and outside will surely collapse like earth.',
    'Xiao Tanzhi is jealous and quick to wound; Xu Xiaosi lacks the strength to bear weight and lets others lead him. Once the breach opens, court and country will crumble together.',
  ],
  s0056: [
    'Now obtaining guardianship of an outer fief, fortunate to plot for one\'s body—the wise see opportunity and do not wait a full day.',
    'We hold an outer province and can still save ourselves; the wise act at once and do not wait for tomorrow.',
  ],
  s0057: [
    'Before suspicion and guard have yet arisen, the younger brothers should be summoned to gather in good time.',
    'Before suspicion hardens, we should call our brothers together while we still can.',
  ],
  s0058: [
    'Afterward, when mutual guarding and suspicion arise, there will be no road to pull up one\'s feet.',
    'After that, once they watch one another, we will have no way out.',
  ],
  s0059: [
    'Ying province controls and links Jing and Xiang, pours west into the Han and Mian;',
    'Ying province commands Jing and Xiang and opens west onto the Han and Mian;',
  ],
  s0060: [
    'Yong province\'s soldiers and horses, breathing in and out several ten thousands, tiger-stare from among them to observe the realm.',
    'Yong province fields tens of thousands of troops and can watch the realm like a crouching tiger.',
  ],
  s0061: [
    'When the age is ordered then exhaust loyalty to the court; when the times are chaotic then for the state cut down violence—one can advance and retreat with the times; this is roughly a plan of ten thousand certainties.',
    'In peace we serve the dynasty faithfully; in chaos we strike down the violent and move with the times. That is the safest course.',
  ],
  s0062: [
    'If one does not plot early, regret will have no reaching.',
    'If we do not act now, regret will come too late.',
  ],
  s0063: [
    '" Yi heard it and changed color, his heart not assenting.',
    '" Yi heard this, turned pale, and would not agree.',
  ],
  s0064: [
    'Hongce returned; Gaozu then memorialized to welcome his younger brothers Wei and Dan.',
    'Hongce returned, and Gaozu memorialized to bring his brothers Wei and Dan to him.',
  ],
  s0065: [
    'That year they arrived at Xiangyang.',
    'They reached Xiangyang that year.',
  ],
  s0066: [
    'Thereupon he secretly made weapons, felled much bamboo and wood, sunk them in Tanxi, secretly preparing boat equipment.',
    'He then secretly built weapons, cut bamboo and timber, sank the logs in Tanxi, and quietly prepared boats.',
  ],
  s0067: [
    'At the time the residence where he stayed often had five-colored revolutions, shaped like coiled dragons; above them purple qi rose up, shaped like parasol-canopies—all who looked were without exception astonished.',
    'Over his quarters five-colored vapors often swirled like coiled dragons, and purple clouds rose in the shape of canopy umbrellas; all who saw them were astonished.',
  ],
  s0068: [
    'In winter of the second year of Yongyuan, news that Yi was killed arrived; Gaozu secretly summoned Chief Clerk Wang Mao, Central Command Troops Master Lu Sengzhen, Vice Prefect Liu Qingyuan, Merit Officer Shi Qishi Zhan, and others to plot.',
    'In the winter of Yongyuan 2, word came that Yi had been killed; Gaozu secretly called in Wang Mao, Lu Sengzhen, Liu Qingyuan, Shi Qishi Zhan, and others to plan.',
  ],
  s0069: [
    'When settled, on day yisi of the eleventh month he summoned staff officers to gather in the main hall and said: "Formerly King Wu at Meng Ford—all said \'Zhou can be attacked.\'',
    'When the plan was set, on yisi day in the eleventh month he assembled his staff and said, "At Meng Ford King Wu\'s allies agreed that Zhou could be overthrown.',
  ],
  s0070: [
    'Today the benighted lord\'s evil is full, extreme cruelty at the limit, executing and slaughtering court worthies, rarely leaving survivors; the people smeared in charcoal; Heaven\'s mandate strikes him down.',
    'Today the tyrant\'s crimes are complete, his cruelty absolute, the court slaughtered, the people in ashes, and Heaven itself condemns him.',
  ],
  s0071: [
    'You are of one heart in hating evil, together raising righteous action; dukes, marquises, generals, and chancellors—surely on this day; each exhaust your merit and effort—I do not eat my words."',
    'Join me in righteous revolt; titles and rewards belong to this day if you give your all. I will not break my word."',
  ],
  s0072: [
    'That day they raised the standard.',
    'That day he raised the banner of revolt.',
  ],
  s0073: [
    'Thereupon gathering yielded more than ten thousand armored warriors, over a thousand horses, and three thousand boats; they brought out the Tanxi bamboo and wood to equip the warships.',
    'He mustered more than ten thousand armored men, over a thousand horses, and three thousand boats, hauling up the Tanxi timber to fit out the fleet.',
  ],
  s0074: [
    'Earlier, Dong Hun had made Liu Shanyang Administrator of Baxi, assigned three thousand elite troops, to pass through Jing province and meet Acting Headquarters Officer Xiao Yingchou to strike Xiangyang.',
    'Earlier Dong Hun had made Liu Shanyang administrator of Baxi, given him three thousand picked troops, and sent him through Jing province to join Xiao Yingchou in attacking Xiangyang.',
  ],
  s0075: [
    'Gaozu knew their plot and sent Aides Wang Tianhu and Pang Qingguo to Jiangling, writing universally to the province and prefecture.',
    'Gaozu learned of the plot and sent Wang Tianhu and Pang Qingguo to Jiangling with letters to every office in the province.',
  ],
  s0076: [
    'When Shanyang advanced west, Gaozu said to the generals: "Jing province originally fears Xiangyang men; add lips perishing teeth cold—their own urgency of a wounded bowstring—would they not tacitly join?',
    'As Shanyang marched west Gaozu told his generals, "Jing province has always feared Xiangyang men, and with us they share the fate of lips and teeth; wounded as they are, would they not secretly side with us?',
  ],
  s0077: [
    'If I gather Jing and Yong troops, sweep and settle the eastern Xia—even if Han Xin and Bai Qi returned, they could not devise a plan.',
    'If I unite Jing and Yong, I can sweep the east; not even Han Xin and Bai Qi reborn could stop us.',
  ],
  s0078: [
    'How much more against a benighted lord beyond calculation, and disciples who wield kitchen knives answering edicts!',
    'How much less against a witless tyrant and the kitchen boys who obey his orders!',
  ],
  s0079: [
    'I can make Shanyang reach Jing and immediately lose his head—try and see how it goes."',
    'I can have Shanyang lose his head the moment he reaches Jing—watch and see."',
  ],
  s0080: [
    'When Shanyang reached Baling, Gaozu again ordered Tianhu to carry letters to the Yingchou brothers.',
    'When Shanyang reached Baling, Gaozu again sent Tianhu with letters to the Yingchou brothers.',
  ],
  s0081: [
    'After Tianhu left, Gaozu said to Zhang Hongce: "The way of using troops—attacking hearts is supreme, attacking cities next; heart-battle is supreme, arms-battle next—today is such a day.',
    'After Tianhu left, Gaozu told Zhang Hongce, "In war the first victory is over the mind, the second over walls; battle of wills comes before battle of arms—and today is such a day.',
  ],
  s0082: [
    'Recently sending Tianhu to the province and prefecture—everyone had letters.',
    'When I sent Tianhu through the province, every office received a letter.',
  ],
  s0083: [
    'This stretch by post was very urgent, only two letters to the acting headquarters brothers, saying \'Tianhu will explain in person\';',
    'This courier run was rushed, and only two letters went to the acting headquarters brothers, saying \'Tianhu will explain in person\';',
  ],
  s0084: [
    'when asked, Tianhu had nothing to say in person—the acting headquarters could not mutually hear, could not recklessly say anything.',
    'yet when questioned Tianhu had nothing to say, so the brothers could not compare notes or speak freely.',
  ],
  s0085: [
    'Tianhu is the acting headquarters\' trusted core; when they hear it they will surely say the acting headquarters and Tianhu together concealed the matter—then every person will harbor doubt.',
    'Tianhu is their trusted man; hearing this they will think the brothers hid the truth with him, and everyone will grow suspicious.',
  ],
  s0086: [
    'Shanyang confused by the crowd\'s mouths will judge mutual suspicion and division; then the acting headquarters in advance and retreat cannot clarify themselves, must leak our plot within.',
    'Shanyang, swayed by rumor, will suspect them; unable to clear themselves, the brothers will betray our plan from within.',
  ],
  s0087: [
    'Thus with two empty letters one fixes a whole province.',
    'With two empty letters we can settle a whole province.',
  ],
  s0088: [
    'Shanyang reached Jiang\'an, heard it, and indeed doubted and did not ascend.',
    'At Jiang\'an Shanyang heard the tale, grew suspicious, and would not go on.',
  ],
  s0089: [
    'Yingchou greatly feared; he then beheaded Tianhu and sent the head to Shanyang.',
    'Terrified, Yingchou beheaded Tianhu and sent his head to Shanyang.',
  ],
  s0090: [
    'Shanyang believed it; with several tens of men he galloped in—Yingchou hid armed men and beheaded him, sending the head to Gaozu.',
    'Shanyang believed him, rode in with a few dozen men, and Yingchou\'s hidden troops cut him down and sent his head to Gaozu.',
  ],
  s0091: [
    'He then came to report the proposal to honor Prince of Nankang, and said: "The time and month are not favorable; one must wait until the second month of next year;',
    'He then proposed enthroning Prince of Nankang and said, "The season is wrong; we should wait until the second month of next year;',
  ],
  s0092: [
    'hastily advancing troops—fear it is not temple calculation."',
    'to march now would be to ignore the planners\' counsel."',
  ],
  s0093: [
    'Gaozu replied: "Now sitting with armor of a hundred thousand, provisions naturally exhausted—moreover relying on righteous hearts, for the moment fierce and sharp, matters connecting one after another—still fearing doubt and slackness;',
    'Gaozu answered, "We sit here with a hundred thousand armored men while supplies drain away; our soldiers are bold for the cause and events press on us one after another—I already fear hesitation;',
  ],
  s0094: [
    'if the army halts ten ten-day periods, regret and grudging must arise.',
    'halt ten days and regret will set in.',
  ],
  s0095: [
    'If a child stands apart, at once the great affair will not succeed.',
    'Let one man waver and the whole enterprise fails.',
  ],
  s0096: [
    'Now Venus appears in the west; acting righteously in movement—Heaven\'s time and human counsel, what is not favorable?',
    'Venus now stands in the west; we move in righteousness—what omen or counsel could be better?',
  ],
  s0097: [
    'Disposition is already settled—how can one halt midway?',
    'The decision is made; how can we stop halfway?',
  ],
  s0098: [
    'Formerly King Wu attacked Zhou, marching against Grand Year—must one again wait for year and month?"',
    'King Wu marched against Zhou though the stars were against him—must we wait for a better month?"',
  ],
  s0099: [
    'Jingling Administrator Cao Jingzong sent Du Sichong to urge Gaozu to welcome Prince of Nankang to establish court at Xiangyang, wait for the correct honorific title, then advance the army.',
    'Jingling administrator Cao Jingzong sent Du Sichong to urge Gaozu to bring Prince of Nankang to Xiangyang, proclaim him properly, and only then march east.',
  ],
  s0100: [
    'Gaozu would not heed.',
    'Gaozu refused.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_001_b1.mjs <translation.json>'
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
