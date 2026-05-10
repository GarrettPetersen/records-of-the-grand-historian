import fs from 'node:fs';

const sourcePath = '/workspace/data/jinshu/095.json';
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const zhById = new Map();
for (const block of source.content) {
  if (!Array.isArray(block.sentences)) continue;
  for (const sentence of block.sentences) {
    const n = Number(sentence.id.slice(1), 10);
    if (n >= 2 && n <= 101) zhById.set(sentence.id, sentence.zh);
  }
}

const batch = new Map();

batch.set('s0002', { literal: `Chen Xun.`, idiomatic: `Chen Xun` });
batch.set('s0003', { literal: `Chen Xun, style name Daoyuan, was a man of Liyang.`, idiomatic: `Chen Xun, courtesy name Daoyuan, came from Liyang.` });
batch.set('s0004', { literal: `In youth he loved occult learning; in astronomy, calendrical calculation, yin-yang, and prognostication by signs there was none he did not master comprehensively, and he was especially skilled in fengjiao.`, idiomatic: `As a youth he devoured esoteric studies—astronomy, calendar math, yin-yang, and omen-reading—and excelled above all at wind-angle divination.` });
batch.set('s0005', { literal: `Sun Hao appointed him Attendant Commandant of the Forbidden Palaces and had him perform prognostications.`, idiomatic: `The last Wu emperor Sun Hao named him palace attendant for forbidden precincts and set him to read the omens.` });
batch.set('s0006', { literal: `Hao's government was harsh and cruel; Xun knew he was bound to fail yet dared not speak.`, idiomatic: `Sun Hao ruled with terror; Chen Xun saw the dynasty was doomed but kept silent.` });
batch.set('s0007', { literal: `At that time the Qiantang Lake opened; some said the realm would soon be at peace and the "green canopy" would enter Luoyang.`, idiomatic: `When Qiantang Lake burst its banks, court gossip took it for an omen of universal peace and the Wu ruler's green-canopy carriage arriving in Luoyang.` });
batch.set('s0008', { literal: `Hao asked Xun about it; Xun said, "Your servant can only observe qi; I cannot fathom whether the lake opens or closes.`, idiomatic: `Sun Hao pressed him; Chen Xun answered carefully that he could read vapors, not hydraulics.` });
batch.set('s0009', { literal: `" Withdrawing, he told his friend, "When the green canopy enters Luo, there will be affairs of a bier borne forth and jade held in the mouth—it is not auspicious.`, idiomatic: `Privately he warned a friend that "green canopy to Luoyang" foretold a funeral surrender, not fortune.` });
batch.set('s0010', { literal: `" Soon thereafter Wu perished.`, idiomatic: `Wu fell almost immediately afterward.` });
batch.set('s0011', { literal: `Xun moved inward with the general migration and was appointed Grandee of Remonstrance.`, idiomatic: `He relocated with the other southern households and received the remonstrance grandee's title.` });
batch.set('s0012', { literal: `Before long he left office and returned to his home district.`, idiomatic: `He soon resigned and went home to Liyang.` });
batch.set('s0013', { literal: `When Chen Min rebelled, sending his younger brother Hong as governor of Liyang, Xun told the townspeople, "The Chen clan lacks kingly qi; before long they will be destroyed.`, idiomatic: `When Chen Min rose and installed his brother Chen Hong at Liyang, Chen Xun told neighbors the Chen house carried no imperial aura and would collapse soon.` });
batch.set('s0014', { literal: `" Hong heard of it and was about to execute him.`, idiomatic: `Chen Hong planned to kill him for the remark.` });
batch.set('s0015', { literal: `Xun's fellow townsman Qin Ju served Hong as army aide and therefore urged Xun, saying, "Xun is skilled in fengjiao—put him to the test.`, idiomatic: `Army adviser Qin Ju, a townsman, begged Chen Hong to try Chen Xun's wind-angle art before shedding blood.` });
batch.set('s0016', { literal: `If he misses, you may behead him slowly—it will not be late."`, idiomatic: `If his reading failed, they could execute him at leisure.` });
batch.set('s0017', { literal: `" Thereupon he was spared.`, idiomatic: `Chen Hong stayed the blade.` });
batch.set('s0018', { literal: `At that time Hong was attacking Eastern Campaign Army aide Heng Yan at Liyang; he therefore asked Xun, "How many men are in the city?`, idiomatic: `While Chen Hong besieged Eastern Campaign aide Heng Yan in Liyang, he demanded to know the garrison's strength.` });
batch.set('s0019', { literal: `Can it be taken by assault?"`, idiomatic: `He asked whether the walls could be stormed.` });
batch.set('s0020', { literal: `" Xun climbed Mount Niuzhu to observe qi and said, "Not more than five hundred.`, idiomatic: `Chen Xun climbed Mount Niuzhu, read the vapors, and put the defenders under five hundred.` });
batch.set('s0021', { literal: `Yet you must not attack; if you attack, you will surely be defeated."`, idiomatic: `He forbade an assault anyway, warning that any attack would fail.` });
batch.set('s0022', { literal: `" Hong raged again, saying, "How can five thousand men attack five hundred and lack reason to prevail?"`, idiomatic: `Chen Hong fumed that five thousand ought to overrun five hundred.` });
batch.set('s0023', { literal: `" He ordered his generals and soldiers to attack; they were indeed defeated by Yan; only then did he believe Xun possessed the way of techniques and treated him generously.`, idiomatic: `The storming host was routed by Heng Yan; chastened, Chen Hong honored Chen Xun as a true adept.` });
batch.set('s0024', { literal: `Army Waterways aide Zhou Kang of Huainan once asked Xun about office rank; Xun said, "By the mao year you ought to split tallies for a nearby commandery; by the you year you ought to receive a bent canopy."`, idiomatic: `Zhou Kang of Huainan, an aide on waterworks, asked his career; Chen Xun promised a nearby governorship in a mao year and a bent-canopy general's train in a you year.` });
batch.set('s0025', { literal: `" Kang said, "If it comes as you say, I shall recommend and promote you."`, idiomatic: `Zhou Kang vowed to pull strings if the prophecy held.` });
batch.set('s0026', { literal: `" Xun said, "By nature I dislike office—I only wish to obtain rice."`, idiomatic: `Chen Xun said he wanted grain, not promotion.` });
batch.set('s0027', { literal: `" Later Kang indeed became governor of Yixing and general with gold ribbon and purple sash.`, idiomatic: `Zhou Kang later became Yixing governor and a gold-and-purple general, just as foretold.` });
batch.set('s0028', { literal: `At that time Liu Cong and Wang Mi raided Luoyang; Wuxia, governor of Liyang, asked Xun, "How stand the court and the realm?"`, idiomatic: `When Liu Cong and Wang Mi threatened Luoyang, Liyang governor Wu Xia asked Chen Xun for the fate of the Jin house.` });
batch.set('s0029', { literal: `" Xun said, "Hu bandits press thrice; the state will be defeated and the Son of Heaven will die in the open wilds.`, idiomatic: `Chen Xun said Xiongnu armies would thrice corner the throne, the dynasty would fall, and the emperor would perish in the field.` });
batch.set('s0030', { literal: `Not yet now."`, idiomatic: `The worst had not arrived yet.` });
batch.set('s0031', { literal: `" Thereafter the two emperors Huai and Min indeed suffered the cruelty at Pingyang.`, idiomatic: `Emperors Huai and Min later endured captivity and murder at Pingyang, as he had warned.` });
batch.set('s0032', { literal: `Someone asked him about the next year's good or ill; Xun said, "The Yangzhou governor will die; there will be a great fire in Wuchang; a general of the upper ranks will also die."`, idiomatic: `Asked about the coming year, he predicted the Yangzhou governor's death, a conflagration at Wuchang, and the passing of a senior commander.` });
batch.set('s0033', { literal: `" When the time came, Liu Tao and Zhou Fang both died; there was a great fire in Wuchang that burned several thousand households.`, idiomatic: `Liu Tao and Zhou Fang died on schedule, and Wuchang blazed through thousands of homes.` });
batch.set('s0034', { literal: `At that time Gan Zhuo was governor of Liyang; Xun privately told those close to him, "Lord Gan's head hangs low while his gaze looks upward—in physiognomy this is called 'knife-squint'; moreover there are red threads in the eyes coming from without; within ten years he is sure to die by arms—if he does not command troops he may escape."`, idiomatic: `Watching Gan Zhuo at Liyang, Chen Xun whispered that his low head and upturned eyes formed the lethal "knife-squint" look, laced with red veins—within a decade steel would find him unless he shed command.` });
batch.set('s0035', { literal: `" Zhuo was indeed killed by Wang Dun.`, idiomatic: `Gan Zhuo fell to Wang Dun's coup, sword in hand.` });
batch.set('s0036', { literal: `Chancellor Wang Dao was often ill and each time worried himself; he asked Xun about it.`, idiomatic: `Chancellor Wang Dao, chronically unwell, consulted Chen Xun in his anxiety.` });
batch.set('s0037', { literal: `Xun said, "Your ears hang straight to the shoulders—you must enjoy long life, and you are also greatly noble; descendants will rise east of the Yangzi."`, idiomatic: `Chen Xun read his pendulous ears as signs of long life, high rank, and a flourishing lineage in Jiangdong.` });
batch.set('s0038', { literal: `" In every case it happened as he said.`, idiomatic: `Each prediction proved true.` });
batch.set('s0039', { literal: `Xun died in his eighties.`, idiomatic: `He died past eighty.` });
batch.set('s0040', { literal: `Dai Yang.`, idiomatic: `Dai Yang` });
batch.set('s0041', { literal: `Dai Yang, style name Guoliu, was a man of Changcheng in Wuxing.`, idiomatic: `Dai Yang, courtesy name Guoliu, was a native of Changcheng in Wuxing commandery.` });
batch.set('s0042', { literal: `At age twelve he fell ill and died, and after five days revived.`, idiomatic: `At twelve he sickened, "died," and woke again after five days.` });
batch.set('s0043', { literal: `He said that when dead Heaven had made him a clerk of the wine vaults, handed him tallies and registers, given him clerks with banners and standards, and was about to take him up Mount Penglai, Kunlun, Jishi, Taishi, Heng, Lu, Heng, and the other various mountains.`, idiomatic: `He described a posthumous posting as celestial cellar-keeper with registers, escorts, and a tour of the sacred peaks from Penglai to the great Heng ranges.` });
batch.set('s0044', { literal: `Then he was sent back; meeting an old man, the man told him, "Later you will obtain the Way and be recognized by noble men."`, idiomatic: `Sent back to life, an elder promised he would win the Dao and earn patronage from the mighty.` });
batch.set('s0045', { literal: `" When he grew up, he was skilled at fengjiao.`, idiomatic: `As an adult he mastered wind-angle divination.` });
batch.set('s0046', { literal: `As a man he was short and plain in appearance, lacking an imposing air, yet he loved techniques of the Way and marvelously understood prognostication, divination, and numerology.`, idiomatic: `He was homely and slight, yet obsessed with occult arts and uncannily sharp at omens, oracles, and fate reckoning.` });
batch.set('s0047', { literal: `At the end of Wu he was a Secretariat clerk; knowing Wu would perish, he pleaded illness and did not take office.`, idiomatic: `Late in Wu he held a clerkship at headquarters, saw the kingdom's end coming, and feigned illness to stay out of service.` });
batch.set('s0048', { literal: `When Wu was pacified, he returned to his home village.`, idiomatic: `After the conquest of Wu he went home.` });
batch.set('s0049', { literal: `Later, traveling, he came to Lai township and passed the shrine to Laozi—all were places Dai Yang had been made to serve when dead, yet he no longer saw the former things.`, idiomatic: `Passing Laozi's shrine at Lai township, he recognized every corner from his otherworldly errand, though the spirit furnishings had vanished.` });
batch.set('s0050', { literal: `Therefore he asked the vault-keeper Ying Feng, "More than twenty years ago, was there one who rode a horse east, passed Lord Lao without dismounting, and before reaching the bridge fell from his horse and died?"`, idiomatic: `He asked keeper Ying Feng whether a rider had once insulted the god by staying mounted and died before the bridge—twenty years past.` });
batch.set('s0051', { literal: `" Feng said there was.`, idiomatic: `Ying Feng confirmed the tale.` });
batch.set('s0052', { literal: `The matters he asked about mostly matched what Yang had seen.`, idiomatic: `Every detail matched Dai Yang's infernal itinerary.` });
batch.set('s0053', { literal: `The Yangzhou governor once asked Dai Yang about good or ill; he answered, "Mars has entered the Southern Dipper—in the eighth month there will be violent flooding; in the ninth month there ought to be a guest army from the southwest."`, idiomatic: `Consulted by the Yangzhou governor, he warned of Mars in the Dipper—cloudbursts in the eighth month and an alien column from the southwest in the ninth.` });
batch.set('s0054', { literal: `" On schedule there was indeed great flooding, and Shi Bing rose in rebellion.`, idiomatic: `The floods came on time, and Shi Bing's revolt followed.` });
batch.set('s0055', { literal: `After Bing had seized Yangzhou, Dai Yang told people, "Observing the bandits' cloud-qi, in the fourth month they will be broken."`, idiomatic: `Once Shi Bing held Yangzhou, Dai Yang read his banners and gave him until the fourth month to collapse.` });
batch.set('s0056', { literal: `" It happened as he said.`, idiomatic: `The rebellion fell in that month.` });
batch.set('s0057', { literal: `At that time Chen Min was General of the Right; Sun Hun, magistrate of Tangyi, saw him and envied him.`, idiomatic: `Chen Min, General of the Right, drew envious stares from Sun Hun, magistrate of Tangyi.` });
batch.set('s0058', { literal: `Dai Yang said, "Min will rebel and his clan be exterminated—what is there to envy!"`, idiomatic: `Dai Yang snapped that Chen Min would turn traitor and wipe his own line—hardly a model to covet.` });
batch.set('s0059', { literal: `" Before long Min indeed rebelled and was executed.`, idiomatic: `Chen Min revolted and died under the blade almost at once.` });
batch.set('s0060', { literal: `At first Hun wished to bring his family dependents; Dai Yang said, "This place is about to fall—you may reach the year-end sacrifice month but not the first month—how can you move a household into the midst of bandits!"`, idiomatic: `Sun Hun meant to fetch his kin; Dai Yang swore the town would fall after la but before the new year and forbade dragging families into a war zone.` });
batch.set('s0061', { literal: `" Hun then desisted.`, idiomatic: `Sun Hun stayed put.` });
batch.set('s0062', { literal: `At year's end Min's younger brother Chang attacked Tangyi, and Hun therefore fled alone and escaped.`, idiomatic: `When Chen Min's brother Chen Chang stormed Tangyi at year's end, Sun Hun slipped away alone.` });
batch.set('s0063', { literal: `Thereafter Director of Waters Ma Wu recommended Dai Yang as clerk to the Director of Waters; Dai Yang requested emergency leave to return home.`, idiomatic: `Ma Wu of the waterways directorate named him a waterways clerk; Dai Yang begged leave and hurried home.` });
batch.set('s0064', { literal: `About to go to Luoyang, he dreamed a spirit told him, "Luoyang is about to collapse; the people will all cross south; after five years Yangzhou is sure to have a Son of Heaven."`, idiomatic: `Bound for Luoyang, he dreamed a god warning of the capital's fall, a great southern flight, and an emperor in Yangzhou within five years.` });
batch.set('s0065', { literal: `" Dai Yang believed it and therefore did not go.`, idiomatic: `He canceled the journey and believed the vision.` });
batch.set('s0066', { literal: `Thereafter everything matched his dream.`, idiomatic: `Events unfolded exactly as the dream had said.` });
batch.set('s0067', { literal: `Lujiang governor Hua Tan asked Dai Yang, "Who under Heaven is next likely to turn bandit?`, idiomatic: `Lujiang governor Hua Tan asked who in the realm would next rise in rebellion.` });
batch.set('s0068', { literal: `" Dai Yang said, "Wang Ji."`, idiomatic: `Dai Yang answered, "Wang Ji."` });
batch.set('s0069', { literal: `" Soon thereafter Wang Ji indeed rebelled.`, idiomatic: `Wang Ji revolted almost at once.` });
batch.set('s0070', { literal: `Chen Zhen asked Dai Yang, "People say south of the Yangzi there will be an eminent man—might it be Gu Yanxian and Zhou Xuanpei?"`, idiomatic: `Chen Zhen asked whether Gu Rong and Zhou Pei were the great men fate had marked for the south.` });
batch.set('s0071', { literal: `" Dai Yang said, "Gu will not reach the la month; Zhou will not see the eighth month of next year."`, idiomatic: `Dai Yang said Gu Rong would not live to la and Zhou Pei would die before the eighth month of the coming year.` });
batch.set('s0072', { literal: `" Rong indeed died on the seventeenth day of the twelfth month; the la sacrifice fell on the nineteenth; Pei died on the last day of the seventh month the next year.`, idiomatic: `Gu Rong died on the seventeenth of the twelfth month, la came two days later, and Zhou Pei perished on the final day of the seventh month next year—each on schedule.` });
batch.set('s0073', { literal: `Wang Dao fell ill and summoned Dai Yang.`, idiomatic: `Wang Dao took sick and called Dai Yang to his bedside.` });
batch.set('s0074', { literal: `Dai Yang said, "Your lordship's natal stem sits in shen; metal is earth's controlling agent, yet on shen above Stone Citadel they have set a smeltery—firelight shines to heaven; this is metal and fire scorching each other, water and fire seething each other—therefore you suffer harm."`, idiomatic: `He traced Wang Dao's fate to the shen stem, where a royal foundry atop Stone Citadel set metal and fire at war and poisoned the patron of earth.` });
batch.set('s0075', { literal: `" Dao immediately moved residence to the Eastern Bureau, and the illness then improved.`, idiomatic: `Wang Dao relocated to the Eastern Secretariat compound and recovered.` });
batch.set('s0076', { literal: `Army aide to the General Who Guards the East Zhang Kai recommended Dai Yang as clerical secretary to the Chancellor.`, idiomatic: `Zhang Kai, staff officer to the general who guards the east, recommended him as a chancellery clerk.` });
batch.set('s0077', { literal: `At that time Sima Yang was magistrate of Wucheng and was about to take up the post; Dai Yang said, "You ought deeply to beware your subordinate clerks."`, idiomatic: `When Sima Yang left for his Wucheng magistracy, Dai Yang warned him to watch his underlings.` });
batch.set('s0078', { literal: `" Yang later indeed lost office because of a clerk's crime.`, idiomatic: `Sima Yang was cashiered when a clerk's guilt touched him.` });
batch.set('s0079', { literal: `Dai Yang also told him, "Though you lose office, in the eleventh month you will become a governor and receive the title of general."`, idiomatic: `Dai Yang added that in the eleventh month he would govern a commandery with a general's commission.` });
batch.set('s0080', { literal: `" When the term arrived, he became governor of Taishan and General Who Guards Martial Might.`, idiomatic: `On the date he was named Taishan governor and general who guards martial might.` });
batch.set('s0081', { literal: `Sima Yang sold his house and was about to depart; Dai Yang stopped him, saying, "You will not reach your post—you will return; you cannot be without a house."`, idiomatic: `As Sima Yang sold his house to leave, Dai Yang told him he would never reach Taishan and must keep a roof in the capital.` });
batch.set('s0082', { literal: `" Yang was indeed harried by Xu Kan and could not reach the commandery.`, idiomatic: `Xu Kan's revolt blocked his march and sent him home.` });
batch.set('s0083', { literal: `Emperor Yuan added two thousand men to Yang's forces to assist Zu Ti.`, idiomatic: `Emperor Yuan bolstered Sima Yang with two thousand troops for Zu Ti's campaign.` });
batch.set('s0084', { literal: `Dai Yang urged Yang not to go; Yang then pleaded illness.`, idiomatic: `Dai Yang begged him not to march; Sima Yang pleaded sickness instead.` });
batch.set('s0085', { literal: `He was seized and delivered to the minister of justice; before long, thanks to an amnesty, he was released.`, idiomatic: `The court jailed him briefly until an amnesty freed him.` });
batch.set('s0086', { literal: `When Emperor Yuan was about to ascend the throne, he had Dai Yang choose the day; Dai Yang held that the third month, twenty-fourth day, bingwu, ought to be used.`, idiomatic: `For Yuan-di's enthronement Dai Yang picked the bingwu day of the third month's twenty-fourth.` });
batch.set('s0087', { literal: `Grand Astrologer Chen Zhuo memorialized to use the twenty-second day, saying, "In olden days the king of Yue used jiachen in the third month to return to his state; Fan Li said that while yang had not yet fully emerged, the host qi was utterly out and the upper and lower utterly empty, virtue was about to go forth on tour, and punishment entered the central palace—today matches that."`, idiomatic: `Chen Zhuo countered with the twenty-second, citing Yue's jiachen return and Fan Li's doctrine of empty hosts and wandering virtue.` });
batch.set('s0088', { literal: `" Dai Yang said, "The king of Yue was imprisoned by Wu; though at the time he was submissive and ingratiating, in truth he harbored resentment and rage; Fan Li therefore used jiachen, riding virtue home while leaving punishment in Wu's palace.`, idiomatic: `Dai Yang replied that Goujian's calendar trick had humiliated a captor-king, not crowned a legitimate heir.` });
batch.set('s0089', { literal: `" Now the great king harbors no hidden fault within and bears no resentment without—he ought to receive Heaven's great mandate and take the blessing without end—why chase the precedent of the Yue king's leaving his state and leaving calamity behind!"`, idiomatic: `Yuan-di, he argued, was blameless and free of grudge—he should accept an auspicious enthronement date, not Yue's vengeful omen.` });
batch.set('s0090', { literal: `" Thereupon the court followed him.`, idiomatic: `The throne accepted Dai Yang's day.` });
batch.set('s0091', { literal: `When Zu Yue replaced his elder brother in garrisoning Qiao, he invited Dai Yang as Central Army aide and promoted him to superintendent.`, idiomatic: `When Zu Yue succeeded his brother on the Qiao front, he took Dai Yang as central-army adviser and raised him to superintendent.` });
batch.set('s0092', { literal: `On gengchen in the fourth month, at the yuzhong double-hour, there was a great wind rising from the southeast that broke trees.`, idiomatic: `On a fourth-month gengchen day, midmorning brought a southeast gale that snapped trees.` });
batch.set('s0093', { literal: `Dai Yang said to Yue, "In the tenth month bandits are sure to reach east of Qiao city as far as Liyang; south of that there will be rebels."`, idiomatic: `Dai Yang told Zu Yue that raiders would strike east of Qiao toward Liyang in the tenth month while the south also rose in revolt.` });
batch.set('s0094', { literal: `" Registrar Wang Zhen, deeming Dai Yang a sorcerer, reported to Yue to seize Dai Yang; he was handed to the censorial jail and denied food for fifty days, yet his speech was as before.`, idiomatic: `Registrar Wang Zhen called it witchcraft and had him starved fifty days in the interrogation cells without breaking him.` });
batch.set('s0095', { literal: `Yue knew he possessed spirit-like techniques; thereupon he pardoned him and rebuked Zhen.`, idiomatic: `Zu Yue saw his power was real, freed him, and scolded Wang Zhen.` });
batch.set('s0096', { literal: `Later Zhen had a crime and was arrested; Dai Yang saved him.`, idiomatic: `When Wang Zhen later faced charges, Dai Yang interceded.` });
batch.set('s0097', { literal: `Yue said, "Zhen in former days bound you—why now save him?"`, idiomatic: `Zu Yue asked why he would rescue a man who had chained him.` });
batch.set('s0098', { literal: `" Dai Yang said, "Zhen did not understand fengjiao; there was no old grudge."`, idiomatic: `Dai Yang said Wang Zhen had acted from ignorance, not malice.` });
batch.set('s0099', { literal: `" At the time Zhen was on the verge of starving to death; Dai Yang fed and kept him alive, yet Zhen still afterward forgot.`, idiomatic: `He reminded Zu Yue that he had once fed Wang Zhen when the clerk was starving—a debt Wang Zhen forgot.` });
batch.set('s0100', { literal: `" To dwell in wealth and honor yet not cast aside the poor and lowly is very difficult."`, idiomatic: `Few who sit in silk remember friends in rags.` });
batch.set('s0101', { literal: `" Yue deemed this righteous; he immediately pardoned Zhen and granted Dai Yang thirty shi of rice.`, idiomatic: `Moved, Zu Yue spared Wang Zhen and paid Dai Yang thirty shi of grain.` });

if (zhById.size !== 100) {
  throw new Error(`expected 100 source sentences s0002–s0101, got ${zhById.size}`);
}
if (batch.size !== 100) {
  throw new Error(`expected 100 batch entries, got ${batch.size}`);
}
for (const id of zhById.keys()) {
  if (!batch.has(id)) throw new Error(`missing translation for ${id}`);
}

const metaById = new Map();
let blockIndex = 0;
for (const block of source.content) {
  for (const sentence of block.sentences ?? []) {
    metaById.set(sentence.id, { blockIndex, chinese: sentence.zh });
  }
  blockIndex += 1;
}

const path = 'translations/current_translation_jinshu.json';
if (fs.existsSync(path)) {
  const j = JSON.parse(fs.readFileSync(path, 'utf8'));
  const byId = new Map(j.sentences.map((s) => [s.id, s]));
  for (const id of zhById.keys()) {
    const t = batch.get(id);
    const meta = metaById.get(id);
    if (!meta) throw new Error(`missing source meta for ${id}`);
    let s = byId.get(id);
    if (!s) {
      s = {
        id,
        originalId: id,
        blockIndex: meta.blockIndex,
        chinese: meta.chinese,
        literal: '',
        idiomatic: '',
      };
      byId.set(id, s);
    }
    s.literal = t.literal;
    s.idiomatic = t.idiomatic;
  }
  const ordered = [...byId.keys()].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
  j.sentences = ordered.map((id) => byId.get(id));
  fs.writeFileSync(path, JSON.stringify(j, null, 2) + '\n');
  console.log('batch1 applied', batch.size);
} else {
  console.log('skip merge: missing', path);
}
