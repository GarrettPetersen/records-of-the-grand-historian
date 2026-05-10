import fs from 'node:fs';

const batch = new Map();

batch.set('s0902', { literal: `The various monks for the most part imitated him.`, idiomatic: `Lesser monks copied his householding.` });
batch.set('s0903', { literal: `Kumarajiva thereupon gathered needles filling a bowl, led the various monks, and told them, "If you can imitate me and eat this, then you may keep wives."`, idiomatic: `He filled a bowl with needles and dared the clergy to mimic his feat before taking wives.` });
batch.set('s0904', { literal: `" Thereupon he raised a spoon and advanced the needles; they were no different from ordinary food; the various monks were ashamed and submitted and desisted.`, idiomatic: `He ate them like rice until the monks, shamed, dropped the fad.` });
batch.set('s0905', { literal: `The monk Beidu in Pengcheng, hearing Kumarajiva was in Chang'an, thereupon sighed, saying, "I sported with this child; we parted more than three hundred years; meeting again is dimly without date—only in a later birth shall we encounter each other."`, idiomatic: `The wandering monk Beidu in Pengcheng sighed that he and Kumarajiva had parted three centuries and might reunite only in another life.` });
batch.set('s0906', { literal: `" Within a few days before Kumarajiva's end he felt the four great elements would not heal; thereupon he uttered three rounds of divine spells by mouth, ordering foreign disciples to chant them to save himself; before he could apply effort, he turned to feel peril; therefore, straining through illness, he took leave of the host of monks, saying, "Through the Law we met—yet we did not exhaust the heart; we shall resume in a later generation—grief may be spoken."`, idiomatic: `Days before death he felt his body failing, tried spirit spells through foreign pupils, then rallied to bid the sangha farewell, mourning unfinished dharma work.` });
batch.set('s0907', { literal: `" He died in Chang'an.`, idiomatic: `His life ended in the Jin capital.` });
batch.set('s0908', { literal: `Yao Xing at the Free Roaming Garden followed foreign custom and burned the corpse with fire; when the fuel was spent the form broke apart—only the tongue did not rot.`, idiomatic: `Yao Xing cremated him Indian-style at Free Roaming Garden; bones shattered but the tongue survived the pyre.` });
batch.set('s0909', { literal: `Monk Tanhuo`, idiomatic: `The monk Tanhuo` });
batch.set('s0910', { literal: `The monk Tanhuo—none knew what place he was from.`, idiomatic: `Tanhuo's origins were unknown.` });
batch.set('s0911', { literal: `In Tufa Nutan's time he came from Henan, holding one khakkhara, ordering men to kneel, saying, "This is the eye of prajna; reverencing it, you may obtain the Way."`, idiomatic: `Under Tufa Nutan he arrived from Henan with a staff, forcing folk to kneel and calling it the eye of wisdom.` });
batch.set('s0912', { literal: `" People of the time all deemed him strange.`, idiomatic: `Onlookers took him for a wonder.` });
batch.set('s0913', { literal: `Some gave him clothing; he accepted and cast it into the river; later on the appointed day it returned to the original owner, the clothes without stain.`, idiomatic: `Gifts of clothing he flung in the river; the garments returned spotless to the donors on the promised day.` });
batch.set('s0914', { literal: `His steps were like wind and cloud; speaking of men's death and life, noble and base, there was not a hair's breadth of error.`, idiomatic: `He strode like storm wind and never missed a fate he foretold.` });
batch.set('s0915', { literal: `If someone hid his khakkhara, Tanhuo wailed several sounds, closed his eyes a moment, rose and took it; all marveled at his spirit strangeness—none could fathom him.`, idiomatic: `Hidden staves drew wails until he recovered them by trance, baffling witnesses.` });
batch.set('s0916', { literal: `He often told Nutan, "If you can sit still in non-action, then All-under-Heaven may be settled, the throne and heirs able to flourish; if like that you exhaust armies and love killing, calamity will reach yourself."`, idiomatic: `He urged Nutan that quiet rule would secure the throne while endless war would rebound on him.` });
batch.set('s0917', { literal: `" Nutan could not follow.`, idiomatic: `Nutan refused the counsel.` });
batch.set('s0918', { literal: `Nutan's daughter was gravely ill; she begged rescue and healing; Tanhuo said, "Men's death and life each have a fixed term; even sages cannot turn misfortune into fortune—how can Tanhuo extend life!"`, idiomatic: `When Nutan's daughter lay dying, Tanhuo refused miracles, citing fixed life spans even sages cannot bend.` });
batch.set('s0919', { literal: `One can only know whether early or late.`, idiomatic: `He offered only a timetable, not a cure.` });
batch.set('s0920', { literal: `" Nutan firmly pressed him.`, idiomatic: `Nutan insisted.` });
batch.set('s0921', { literal: `At that time the rear-palace gates were closed; Tanhuo said, "Open the rear gate with haste; if you open the gate in time then she lives; if not in time then she dies."`, idiomatic: `With harem gates locked, Tanhuo demanded the rear portal be opened instantly to spare the princess.` });
batch.set('s0922', { literal: `" Nutan ordered it opened; it was not in time and she died.`, idiomatic: `Nutan complied too late and the girl died.` });
batch.set('s0923', { literal: `Later, amid military chaos, none knew where he went.`, idiomatic: `War swallowed him without trace.` });
batch.set('s0924', { literal: `Tai Chan.`, idiomatic: `Tai Chan` });
batch.set('s0925', { literal: `Tai Chan, style name Guojun, was a man of Shangluo, a descendant of Han Palace Attendant Chong.`, idiomatic: `Tai Chan, courtesy Guojun, of Shangluo, descended from Han courtier Tai Chong.` });
batch.set('s0926', { literal: `In youth he specialized in the Jing family's Changes; he was good at chart prophecy, secret weft texts, astronomy, River Chart writings, wind-angle, star calculation, and the learning of six days and seven parts; he was especially good at observing qi, prognosticating by signs, and push-step arts.`, idiomatic: `He mastered Jing Fang's Zhouyi, apocrypha, stars, wind divination, and calendrical computation, excelling at qi-watching and omen math.` });
batch.set('s0927', { literal: `He hid in South Mountain of Shangluo; concurrently he was good in classical learning; broadly he taught with feeling and did not mingle with the age.`, idiomatic: `He taught classics from a hermitage on Shangluo's southern peak, shunning office.` });
batch.set('s0928', { literal: `In Liu Yao's time calamities and prodigies were especially severe; he ordered dukes and ministers each to recommend one broadly learned man who spoke straight.`, idiomatic: `Liu Yao, beset by omens, ordered each minister to nominate a candid scholar.` });
batch.set('s0929', { literal: `His Grand Minister of Works Liu Jun recommended Chan.`, idiomatic: `Grand Minister Liu Jun nominated Tai Chan.` });
batch.set('s0930', { literal: `Yao personally came to the east hall, sent a palace attendant to examine him by question, and Chan spoke to the utmost the reasons.`, idiomatic: `Liu Yao convened him at the east hall for a palace examination, and Tai Chan laid out every cause.` });
batch.set('s0931', { literal: `Yao read and praised him, summoned him to audience, and consulted him on government affairs.`, idiomatic: `The emperor praised his memorials, received him, and sought policy advice.` });
batch.set('s0932', { literal: `Chan wept and sobbed, stating in full the disasters of prodigies and the gaps in governance and transformation; his words were extremely earnest.`, idiomatic: `He wept through a thorough brief on portents and policy failures.` });
batch.set('s0933', { literal: `Yao changed countenance and treated him with rites, appointing him libationer of erudites, grandee of remonstrance, and concurrent Grand Astrologer.`, idiomatic: `Liu Yao honored him with erudite libationer, remonstrance grandee, and astrologer-in-chief posts.` });
batch.set('s0934', { literal: `By the next year his words all verified; Yao all the more esteemed him, transferred him to Grand Palace Grandee, and within the year thrice promoted him.`, idiomatic: `When every warning proved true within a year, Liu Yao thrice promoted him to grand palace grandee.` });
batch.set('s0935', { literal: `He successively held Minister, Palace Grandee, Junior Tutor to the heir, rank specially advanced, gold seal and purple ribbon, and noble title Marquis Within-the-Pass.`, idiomatic: `He rose through minister, palace grandee, heir tutor, special advancement, gold seal purple ribbon, and marquis of Guannei.` });
batch.set('s0936', { literal: `Historian's appraisal.`, idiomatic: `Closing shǐ píng verdict section.` });
batch.set('s0937', { literal: `The court historian states: Chen Xun, Dai Yang, and the various gentlemen together mastered the tomb classics, refined number arts, plumbed the subtlety of push-step reckoning, and exhausted the secret profundity of yin-yang—even the Jing and Guan of former ages, how could one add more!`, idiomatic: `The annalist praises Chen Xun, Dai Yang, and their peers as rivaling Han augurs Jing Fang and Guan Lu.` });
batch.set('s0938', { literal: `Guo Wu knew Jin would destroy Yao; leaving Yao to return to Jin, pursuing troops suddenly overtook him and caused him to die midway—this then is seeing the autumn hair from afar yet failing to know what lies on one's own eyelashes.`, idiomatic: `Guo Wu foresaw Jin ending Yao yet died fleeing to Jin—sharp on distant detail, blind to the immediate.` });
batch.set('s0939', { literal: `Cheng and Kumarajiva came from distant margins and roamed the Hua xia.`, idiomatic: `Fotucheng and Kumarajiva crossed from the frontiers into China.` });
batch.set('s0940', { literal: `As Kumarajiva already showed signs in the stars, Cheng then drove ghosts and spirits; both penetrated the hidden and bored through the dark, let fall writings and clarified teaching—truly they were treasured for the Way and arts, not prized as borrowings from other mountains; Yao and Shi revered them like spirits—indeed there was reason.`, idiomatic: `One read the stars, the other bound ghosts; both illumined the dark and spread doctrine, earning Yao and Shi's awe on merit, not novelty.` });
batch.set('s0941', { literal: `Bao, Wu, Wang, Xing, and the rest either borrowed numinous Dao formulas or received instruction in divine recipes; thereby they could suppress ill omens and avert calamity, hiding texts yet manifesting meaning—though they incurred ridicule as uncanny falsehoods, they were still rather beneficial to worldly use.`, idiomatic: `Lesser wonder-workers mixed fraud with practical charms that sometimes helped the folk.` });
batch.set('s0942', { literal: `Yet great learning and penetrating men ought not bend the carriage shaft to them.`, idiomatic: `True scholars need not hitch their wagons to such arts.` });
batch.set('s0943', { literal: `The encomium states: The Traditions narrate calamity and auspice; the Documents praise tortoise and milfoil.`, idiomatic: `The verse cites the Zuozhuan and Shangshu on omens and divination.` });
batch.set('s0944', { literal: `They respond like shadow and echo; they fit like tally halves.`, idiomatic: `Omens answer like echoes and fit like split tallies.` });
batch.set('s0945', { literal: `Strange force and disorderly spirits deceive the age and delude the world.`, idiomatic: `Uncanny powers and rogue spirits bewitch their times.` });
batch.set('s0946', { literal: `To honor and elevate them without cease is sure to bring flowing abuse.`, idiomatic: `Endless court patronage of such ways invites lasting harm.` });

const path = 'translations/current_translation_jinshu.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));
for (const s of j.sentences) {
  const t = batch.get(s.id);
  if (t) {
    s.literal = t.literal;
    s.idiomatic = t.idiomatic;
  }
}
fs.writeFileSync(path, JSON.stringify(j, null, 2) + '\n');
console.log('batch10 applied', batch.size);
