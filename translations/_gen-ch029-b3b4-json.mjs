#!/usr/bin/env node
/** Generate translations/_ch029-batch3.json and batch4.json (s0201–s0400) */
import { readFileSync, writeFileSync } from 'fs';

const T3 = {
  s0201: {
    literal: '"',
    idiomatic: 'Closing quotation mark.',
  },
  s0202: {
    literal: '"Xiaohu": probably pitch-pot music.',
    idiomatic: '"Xiaohu": probably music for the pitch-pot game.',
  },
  s0203: {
    literal: 'In pitch-pot play, arrows leaping in the pot are called xiaohu; what is now called xiaohu is this.',
    idiomatic: 'In pitch-pot, arrows that leap in the pot are called xiaohu—the name still used today.',
  },
  s0204: {
    literal: '"Changlin Huan": probably a song of the Song and Liang periods.',
    idiomatic: '"Changlin Huan": probably a Liu-Song and Liang-period song.',
  },
  s0205: {
    literal: 'In the Song and Liang eras Jing and Yong were great southern bastions, all governed by imperial princes; left-bank verse never failed to praise them as a land of joy—hence Prince Sui made the song "Xiangyang," and Emperor Wu of Qi recalled Fan and Deng.',
    idiomatic: 'Under the Liu-Song and Liang, Jing and Yong were major southern posts held by imperial princes; Jiangzuo poets praised them as a happy land—hence Prince Sui\'s "Xiangyang" and Qi Wudi\'s memories of Fan and Deng.',
  },
  s0206: {
    literal: 'A yuefu song of Emperor Jianwen of Liang says: "Parting at Peach Grove bank, farewell on Xian Mountain\'s crest.',
    idiomatic: 'Emperor Jianwen of Liang wrote in a yuefu song: "We part at Peach Grove bank and bid farewell on Xian Mountain\'s crest.',
  },
  s0207: {
    literal: 'If you wish to send a message, the Han River flows east."',
    idiomatic: 'To send word, let the Han River flow east."',
  },
  s0208: {
    literal: '" It also says: "At Yicheng they cast the sounding beans—the wine is ripe; halting the saddle and tethering the horse, we lodge awhile."',
    idiomatic: '" It also runs: "At Yicheng the bean-cast sounds—the new wine is ready; we rein in and tether the horses to rest awhile."',
  },
  s0209: {
    literal: '" Peach Grove lies on the Han River; Yicheng is north of Jing province.',
    idiomatic: '" Peach Grove stands on the Han; Yicheng lies north of Jingzhou.',
  },
  s0210: {
    literal: 'Jing province has Changlin county.',
    idiomatic: 'Jingzhou has Changlin county.',
  },
  s0211: {
    literal: 'South of the Yangtze calls a lover huan.',
    idiomatic: 'In Jiangnan a lover is called huan.',
  },
  s0212: {
    literal: 'The sounds of chang and chang are close; probably musicians mistook chang for chang.',
    idiomatic: '"Chang" and "chang" sound alike—musicians likely confused Changlin\'s chang with chang.',
  },
  s0213: {
    literal: '"Sanzhou": a merchants\' song.',
    idiomatic: '"Sanzhou": a song of traveling merchants.',
  },
  s0214: {
    literal: 'Merchants often traveled among the three rivers around Baling and made this song.',
    idiomatic: 'Merchants who plied the three rivers near Baling composed it.',
  },
  s0215: {
    literal: '"Picking Mulberry": this tune arose from the "Sanzhou" melody.',
    idiomatic: '"Picking Mulberry" grew out of the "Sanzhou" tune.',
  },
  s0216: {
    literal: '"Spring River Flower Moon Night," "Jade Tree Courtyard Flower," and "Tangtang" were all composed by Chen Last Ruler.',
    idiomatic: '"Spring River Flower Moon Night," "Courtyard Flower of the Jade Tree," and "Tangtang" were all works of Chen Shubao.',
  },
  s0217: {
    literal: 'Shubao often composed poems in reply with palace lady scholars and courtiers; Director of Imperial Music He Xu was also skilled at literary song—he selected the most gorgeous lines for these tunes.',
    idiomatic: 'Shubao often exchanged poems with palace scholars and officials; the Director of Imperial Music He Xu, also a fine lyricist, chose the most ornate lines for these pieces.',
  },
  s0218: {
    literal: '"Floating Dragon Boat": made at Emperor Yang\'s Jiangdu palace.',
    idiomatic: '"Floating Dragon Boat": composed at Sui Yangdi\'s Jiangdu palace.',
  },
  s0219: {
    literal: 'The remaining five tunes—who composed them is unknown.',
    idiomatic: 'Who wrote the other five pieces is unknown.',
  },
  s0220: {
    literal: 'Their lyrics are mostly shallow and vulgar, yet passed down age after age unchanged.',
    idiomatic: 'The words are mostly coarse and plain, yet the tunes endured unchanged for generations.',
  },
  s0221: {
    literal: 'Regretting the loss of their ancient melodies, they are therefore discussed in full here.',
    idiomatic: 'Because the old melodies matter, they are recorded here in detail.',
  },
  s0222: {
    literal: 'Others not seen in collected records are also omitted and not entered.',
    idiomatic: 'Pieces absent from collected sources are likewise left out.',
  },
  s0223: {
    literal: 'In Jiangnan times the "Scarf Dance," "White Ramie," "Bayu," and the like each had different costumes.',
    idiomatic: 'In the Jiangnan period the Scarf Dance, White Ramie, Bayu, and similar pieces each had distinct costumes.',
  },
  s0224: {
    literal: 'Before Liang, dancers were all sixteen; Liang dances reduced them—all used eight persons only.',
    idiomatic: 'Before the Liang, dancers numbered sixteen; Liang performances cut the troupe to eight.',
  },
  s0225: {
    literal: 'Workers were ordered to wear level cloth caps and scarlet trousers and jackets.',
    idiomatic: 'Performers wore plain cloth caps with scarlet trousers and short jackets.',
  },
  s0226: {
    literal: 'Four dancers wore green gauze robes, skirts and jackets with large sleeves painted with cloud-phoenix designs.',
    idiomatic: 'Four dancers wore green gauze, full skirts and jackets with cloud-and-phoenix motifs on wide sleeves.',
  },
  s0227: {
    literal: 'Lacquered topknots, adorned with gold, bronze, and mixed flowers like sparrow hairpins;',
    idiomatic: 'Lacquered chignons decked with gold, bronze, and floral ornaments like sparrow pins;',
  },
  s0228: {
    literal: 'brocade shoes.',
    idiomatic: 'with brocade shoes.',
  },
  s0229: {
    literal: 'The dance bearing was leisurely and graceful; the tune had postures.',
    idiomatic: 'The movement was easy and graceful, with set poses in the melody.',
  },
  s0230: {
    literal: 'Shen Yue\'s Monograph in the History of Song records that left-bank tunes were decadent and licentious; to this day their modes remain so.',
    idiomatic: 'Shen Yue\'s Song History notes that Jiangzuo songs were wanton and sensual—and their modes still sound that way.',
  },
  s0231: {
    literal: 'View their government already in disorder, their customs already dissolute—both resentful and longing.',
    idiomatic: 'One sees government in disorder and morals dissolute—music at once resentful and yearning.',
  },
  s0232: {
    literal: 'Yet easy and stately, slow and gentle, they still preserve the surviving air of ancient gentlemen.',
    idiomatic: 'Yet the unhurried, elegant pacing still carries something of old scholar-gentlemen.',
  },
  s0233: {
    literal: 'Other music cannot compare with them.',
    idiomatic: 'No other music matches them in this respect.',
  },
  s0234: {
    literal: 'The ensemble used one set of bells, one set of chime-stones, one zither, one three-string zither, one struck zither, one se, one Qin pipa, one horizontal konghou, one zhu, one zheng, one beat-drum, two sheng, two flutes, two xiao, two chi, two ye, and two singers.',
    idiomatic: 'Instrumentation: one bell frame, one stone chimes, zither, three-string zither, struck zither, se, Qin pipa, horizontal konghou, zhu, zheng, beat-drum, two sheng, two di flutes, two xiao, two chi, two ye pipes, and two vocalists.',
  },
  s0235: {
    literal: 'After Chang\'an, the court no longer valued ancient tunes; craftsmen grew scarce; pieces that could join orchestra and pipe were only "Mingjun," "Yang Companion," "Xiaohu," "Spring Song," "Autumn Song," "White Snow," "Tangtang," and "Spring River Flower Moon"—eight tunes in all.',
    idiomatic: 'After the capital moved to Chang\'an the court neglected old melodies and skilled players dwindled; only eight pieces still fit full orchestration—"Mingjun," "Yang Companion," "Xiaohu," "Spring Song," "Autumn Song," "White Snow," "Tangtang," and "Spring River Flower Moon."',
  },
  s0236: {
    literal: 'Old score texts often ran to several hundred words.',
    idiomatic: 'Old librettos often ran to hundreds of characters.',
  },
  s0237: {
    literal: 'In Empress Wu\'s time "Mingjun" could still be forty words; what is transmitted now is twenty-six words—approaching corruption and loss, ever farther from Wu-region pronunciation.',
    idiomatic: 'Under Empress Wu "Mingjun" still had forty lines; today only twenty-six survive—corrupted and drifting from the Wu accent.',
  },
  s0238: {
    literal: 'Liu Ban held that Wu people should be taken to transmit and practice it.',
    idiomatic: 'Liu Ban argued that Wu natives should be enlisted to preserve it.',
  },
  s0239: {
    literal: 'On inquiry of song-master Li Langzi—Li Langzi was a northerner, the mode already lost—he said he learned from Yu Caisheng.',
    idiomatic: 'Asked about it, the vocalist Li Langzi—a northerner whose tuning was already wrong—said he had learned from Yu Caisheng.',
  },
  s0240: {
    literal: 'Caisheng was a man of Jiangdu.',
    idiomatic: 'Caisheng came from Jiangdu.',
  },
  s0241: {
    literal: 'Now Langzi has fled; songs of "Pure Music" are wanting.',
    idiomatic: 'Langzi has since fled, and Qing Music songs are lost.',
  },
  s0242: {
    literal: 'It is also heard that among "Pure Music" only the tune "Elegant Song" remains—its words canonical and its sound refined; reviewing old records, the text is indeed canonical.',
    idiomatic: 'Of Qing Music only "Elegant Song" is said to remain—canonical words and refined sound; old records confirm the text.',
  },
  s0243: {
    literal: 'Han had the "Plate Dance"; now it is classified in the Miscellaneous Music section.',
    idiomatic: 'The Han "Plate Dance" now falls under Miscellaneous Music.',
  },
  s0244: {
    literal: 'There were also "Banner Dance" and "Fan Dance"—both extinct.',
    idiomatic: '"Banner Dance" and "Fan Dance" also existed—both extinct.',
  },
  s0245: {
    literal: 'From Zhou and Sui onward, string-and-wind miscellaneous pieces number nearly a hundred; most use Western Liang music; drum-and-dance pieces mostly use Kucha music—their modes are all what the age knows.',
    idiomatic: 'Since Zhou and Sui, hundreds of orchestral pieces chiefly draw on Western Liang music, while drum-dances mostly use Kucha tunes—modes familiar to the public.',
  },
  s0246: {
    literal: 'Only zither masters still transmit old Chu and Han sounds.',
    idiomatic: 'Only qin players still hand down old Chu and Han pieces.',
  },
  s0247: {
    literal: 'As for "Pure Mode" and "Se Mode," Cai Yong\'s miscellaneous pieces—not used by the court in suburban and temple rites—are therefore not recorded.',
    idiomatic: '"Pure Mode," "Se Mode," and Cai Yong\'s miscellany—unused at court sacrifices—are omitted.',
  },
  s0248: {
    literal: '"Western Liang Music" was what Later Wei obtained when it pacified the Juqu clan.',
    idiomatic: 'Western Liang Music came to Later Wei when it conquered the Juqu regime.',
  },
  s0249: {
    literal: 'At the end of Jin and Song the central plains fell into chaos; Zhang Gui held Hexi; Fu Qin reached Liangzhou, then was cut off again.',
    idiomatic: 'When Jin and Song collapsed, Zhang Gui held Hexi; Former Qin briefly reached Liangzhou, then contact broke off again.',
  },
  s0250: {
    literal: 'Its music had bells and chime-stones—probably Chinese old music transmitted by Liang people, mixed with Qiang and Hu sounds.',
    idiomatic: 'Its ensemble included bells and stones—Chinese old music kept in the northwest, blended with Qiang and Hu sounds.',
  },
  s0251: {
    literal: 'Wei and Sui alike prized it.',
    idiomatic: 'Both Wei and Sui held it in esteem.',
  },
  s0252: {
    literal: 'Workers wore level cloth caps and scarlet jackets.',
    idiomatic: 'Performers wore plain caps and scarlet jackets.',
  },
  s0253: {
    literal: 'White dance: one person; square dance: four persons.',
    idiomatic: 'One dancer in the white dance; four in the square dance.',
  },
  s0254: {
    literal: 'The white dance is now missing.',
    idiomatic: 'The white dance is lost today.',
  },
  s0255: {
    literal: 'The four square dancers wore false topknots, jade branch hairpins, purple silk jackets, white bag trousers, five-colored joined sleeves, and black leather boots.',
    idiomatic: 'Square dancers wore false chignons, jade hairpins, purple silk jackets, white wide trousers, five-color joined sleeves, and black boots.',
  },
  s0256: {
    literal: 'The ensemble used one bell frame, one stone chimes, one strummed zheng, one plucked zheng, one horizontal konghou, one vertical konghou, one pipa, one five-string pipa, one sheng, one xiao, one bili, one small bili, one flute, one transverse flute, one waist-drum, one Qi drum, one eaves-drum, one bronze cymbals, and one conch.',
    idiomatic: 'Instruments: bell frame, stone chimes, strummed and plucked zheng, horizontal and vertical konghou, pipa, five-string pipa, sheng, xiao, large and small bili, vertical and transverse flutes, waist-, Qi-, and eaves-drums, bronze cymbals, and conch.',
  },
  s0257: {
    literal: 'The set of pitched bells is now extinct.',
    idiomatic: 'The pitched bell set is now lost.',
  },
  s0258: {
    literal: 'The Offices of Zhou: "The mie master teaches mie music; at sacrifices he leads his subordinates in dancing it; at great feasts it is likewise."',
    idiomatic: 'The Zhou Offices state: "The mie master teaches mie music; at sacrifices he leads his subordinates in the dance, and the same at great feasts."',
  },
  s0259: {
    literal: '" Mie is the name of Eastern Yi music.',
    idiomatic: '" Mie names the music of the Eastern Yi.',
  },
  s0260: {
    literal: 'Citing the east, the other three directions can be known.',
    idiomatic: 'Name the east and the other quarters follow.',
  },
  s0261: {
    literal: 'There is also "The Di-diel clan manages music of the four barbarians, with their songs; at sacrifices they inhale and sing it; at feasts it is likewise."',
    idiomatic: 'It also says: "The Di-diel clan oversees the four barbarians\' music and songs; at sacrifices they draw breath and sing; at feasts likewise."',
  },
  s0262: {
    literal: '" Those who make the former kings\' music valued being able to embrace and use it.',
    idiomatic: '" Makers of the ancient royal music prized encompassing and employing all of it.',
  },
  s0263: {
    literal: 'Those who admitted music of the four barbarians—virtue was what broad reach extended to.',
    idiomatic: 'Admitting the four quarters\' music showed virtue\'s wide reach.',
  },
  s0264: {
    literal: 'Eastern Yi music was called "Mie-li"; Southern Man music "Ren"; Western Rong music "Jin"; Northern Di music "Mei."',
    idiomatic: 'Eastern Yi: "Mie-li"; Southern Man: "Ren"; Western Rong: "Jin"; Northern Di: "Mei."',
  },
  s0265: {
    literal: '"Li" means yang qi first penetrates and the ten thousand things leave the earth to live.',
    idiomatic: '"Li" signifies yang force first opening as things rise from the soil.',
  },
  s0266: {
    literal: '"Ren" means yang qi holds sway and the ten thousand things bear and carry.',
    idiomatic: '"Ren" means yang in command, all things entrusted and borne.',
  },
  s0267: {
    literal: '"Jin" means yin qi first penetrates, forbidding the growth of the ten thousand things.',
    idiomatic: '"Jin" means yin first opening, restraining growth.',
  },
  s0268: {
    literal: '"Mei" means yin qi holds sway; the myriad forms are dim and obscure.',
    idiomatic: '"Mei" means yin in command, forms hidden in gloom.',
  },
  s0269: {
    literal: 'Their sounds are not orthodox; performed outside the four gates, each holding the weapons of his quarter, presenting sound only.',
    idiomatic: 'Their pitches were not court orthodoxy; each quarter performed beyond its gate with regional arms, offering sound alone.',
  },
  s0270: {
    literal: 'From Zhou\'s decline this rite was soon abandoned.',
    idiomatic: 'After Zhou\'s fall the rite was abandoned.',
  },
  s0271: {
    literal: 'Later Wei had the Brahmin Cao, who received Kucha pipa from a merchant and transmitted the craft through generations.',
    idiomatic: 'In Later Wei the Brahmin Cao learned Kucha pipa from a trader and passed the art down his line.',
  },
  s0272: {
    literal: 'At his grandson Miaoda it was especially prized by Gao Yang of Northern Qi, who often beat the Hu drum himself to harmonize.',
    idiomatic: 'His grandson Miaoda won favor from Northern Qi\'s Gao Yang, who often beat the Hu drum to accompany him.',
  },
  s0273: {
    literal: 'Emperor Wu of Zhou took a captive woman as empress; states of the Western Regions came as marriage escort—thereupon music of Kucha, Shule, An, and Kang gathered greatly in Chang\'an.',
    idiomatic: 'Zhou Wudi married a captive princess; Western Region states sent wedding musicians—Kucha, Shule, An, and Kang music flooded Chang\'an.',
  },
  s0274: {
    literal: 'The Hu youth ordered the Khotanese Bai Zhitong to teach practice, mixing in many new sounds.',
    idiomatic: 'Hu performers had the Khotanese Bai Zhitong train them, blending many new tunes.',
  },
  s0275: {
    literal: 'In Zhang Zhonghua\'s time Tianzhu sent musicians through double translation; later a prince of that country came as a monk to travel and again transmitted its regional sounds.',
    idiomatic: 'Under Zhang Zhonghua India sent musicians via relay interpreters; later an Indian prince visited as a monk and spread those sounds again.',
  },
  s0276: {
    literal: 'The Song age had Koguryo and Paekche performance music.',
    idiomatic: 'The Liu-Song court knew Koguryo and Paekche dance music.',
  },
  s0277: {
    literal: 'When Wei pacified Tuoba it also obtained them but not completely.',
    idiomatic: 'Wei gained them when it subdued the Tuoba but not in full.',
  },
  s0278: {
    literal: 'When Zhou troops destroyed Qi, the two states presented their music.',
    idiomatic: 'Zhou\'s conquest of Qi brought both states\' repertoires as tribute.',
  },
  s0279: {
    literal: 'Emperor Wen of Sui pacified Chen, obtaining "Pure Music" and the "Wenkang Rite-Complete" tune, listing the nine department performances—Paekche performance was not included.',
    idiomatic: 'Sui Wendi\'s conquest of Chen yielded Qing Music and the "Wenkang Rite Complete" piece for the nine departments—Paekche was excluded.',
  },
  s0280: {
    literal: 'Emperor Yang pacified Linyi, obtaining Funan craftsmen and their gourd zithers—crude and unusable; only the sounds were transcribed through "Tianzhu Music," not ranked among music departments.',
    idiomatic: 'Sui Yangdi\'s conquest of Linyi brought Funan artisans and gourd zithers—too crude for use; only their tones were copied into Tianzhu music, not enrolled in the music bureau.',
  },
  s0281: {
    literal: 'Western Wei communicated with Gaochang and then had Gaochang performance.',
    idiomatic: 'Western Wei\'s ties with Gaochang introduced Gaochang performance music.',
  },
  s0282: {
    literal: 'Our Taizong pacified Gaochang and collected all its music, also creating "Banquet Music" and removing the "Rite-Complete" tune.',
    idiomatic: 'Taizong conquered Gaochang, took its entire repertoire, composed Banquet Music, and dropped the Rite-Complete piece.',
  },
  s0283: {
    literal: 'What is now entered in statutes is only these ten departments.',
    idiomatic: 'Only these ten departments are codified in present regulations.',
  },
  s0284: {
    literal: 'Though not entered in statutes, where modes survive the Music Bureau still registers them.',
    idiomatic: 'Pieces not codified but whose modes survive remain on the Music Bureau rolls.',
  },
  s0285: {
    literal: 'In Emperor Dezong\'s reign Pyu also sent envoys presenting music.',
    idiomatic: 'Under Dezong Pyu too sent envoys with its music.',
  },
  s0286: {
    literal: '"Koguryo Music": workers wore purple gauze caps adorned with bird feathers, yellow large sleeves, purple gauze belts, bag trousers, red leather boots, and five-colored cord bindings.',
    idiomatic: 'Koguryo Music: performers in purple gauze caps with feather trim, yellow full sleeves, purple belts, bag trousers, red leather boots, and five-color cords.',
  },
  s0287: {
    literal: 'Four dancers wore topknots thrust back, red forehead bands, ornaments of gold dangling.',
    idiomatic: 'Four dancers with rear topknots, red forehead bands, and gold pendants.',
  },
  s0288: {
    literal: 'Two wore yellow skirt-jackets and red-yellow trousers, sleeves extremely long, black leather boots, dancing paired upright together.',
    idiomatic: 'Two in yellow jackets and reddish trousers with very long sleeves and black boots danced in paired upright rows.',
  },
  s0289: {
    literal: 'The ensemble used one strummed zheng, one plucked zheng, one horizontal konghou, one vertical konghou, one pipa, one yizi flute, one sheng, one xiao, one small bili, one large bili, one peach-bark bili, one waist-drum, one Qi drum, one eaves-drum, and one conch.',
    idiomatic: 'Instruments: strummed and plucked zheng, horizontal and vertical konghou, pipa, yizi flute, sheng, xiao, large and small bili, peach-bark bili, waist-, Qi-, and eaves-drums, and conch.',
  },
  s0290: {
    literal: 'In Empress Wu\'s time twenty-five tunes were still honored; now only one tune is practiced; costumes too have gradually decayed, losing the original style.',
    idiomatic: 'Under Empress Wu twenty-five pieces were still performed; today only one survives, costumes faded from the original style.',
  },
  s0291: {
    literal: '"Paekche Music": in Zhongzong\'s era the workers died and scattered.',
    idiomatic: 'Paekche Music: in Zhongzong\'s reign the performers died or dispersed.',
  },
  s0292: {
    literal: 'Prince of Qi Fan as Director of the Court of Imperial Sacrifices memorialized to restore and install it—hence many musical skills are wanting.',
    idiomatic: 'Prince of Qi Fan, as Director of Imperial Sacrifices, petitioned to restore it—yet much of the repertoire is missing.',
  },
  s0293: {
    literal: 'Two dancers wore purple large-sleeved skirt-jackets, zhangfu caps, and leather shoes.',
    idiomatic: 'Two dancers in purple full-sleeved jackets, zhangfu caps, and leather shoes.',
  },
  s0294: {
    literal: 'What survives of the music: zheng, flute, peach-bark bili, konghou, and song.',
    idiomatic: 'Surviving instruments: zheng, flute, peach-bark bili, konghou, and voice.',
  },
  s0295: {
    literal: 'These two states are music of the Eastern Yi.',
    idiomatic: 'Both belong to Eastern Yi music.',
  },
  s0296: {
    literal: '"Funan Music": two dancers wore dawn-glow leg-wrappings and red leather boots.',
    idiomatic: 'Funan Music: two dancers in dawn-colored leg bindings and red boots.',
  },
  s0297: {
    literal: 'The Sui age wholly used "Tianzhu Music"; what survives now includes jie-drum, dutan drum, Maoyuan drum, xiao, flute, bili, bronze cymbals, and conch.',
    idiomatic: 'Sui relied entirely on Tianzhu music; what remains includes jie-, dutan, and Maoyuan drums, xiao, flute, bili, cymbals, and conch.',
  },
  s0298: {
    literal: '"Tianzhu Music": workers wore black silk-cloth headwraps, white silk jackets, purple damask trousers, and scarlet stoles.',
    idiomatic: 'Tianzhu Music: black silk headwraps, white silk jackets, purple damask trousers, scarlet stoles.',
  },
  s0299: {
    literal: 'Two dancers wore braided hair, dawn-glow kasaya, leg-bindings, and green hemp shoes.',
    idiomatic: 'Two dancers with braided hair, dawn-colored kasaya, leg bindings, and green hemp shoes.',
  },
  s0300: {
    literal: 'Kasaya is what monks wear today.',
    idiomatic: 'Kasaya is the robe monks wear today.',
  },
};

const T4 = {
  s0301: {
    literal: 'The ensemble used bronze drum, jie-drum, Maoyuan drum, dutan drum, bili, transverse flute, phoenix-head konghou, pipa, bronze cymbals, and conch.',
    idiomatic: 'Instruments: bronze drum, jie-, Maoyuan, and dutan drums, bili, transverse flute, phoenix-head konghou, pipa, cymbals, and conch.',
  },
  s0302: {
    literal: 'Maoyuan drum and dutan drum are now extinct.',
    idiomatic: 'Maoyuan and dutan drums are lost.',
  },
  s0303: {
    literal: '"Pyu Music": in the Zhenyuan era its king came presenting native music—twelve tunes in all—with thirty-five music workers attending court.',
    idiomatic: 'Pyu Music: in Zhenyuan its king sent twelve native pieces and thirty-five musicians to court.',
  },
  s0304: {
    literal: 'The tune texts all expound Buddhist sutra treatises.',
    idiomatic: 'The lyrics all paraphrase Buddhist scriptures.',
  },
  s0305: {
    literal: 'These three states are music of the Southern Man.',
    idiomatic: 'All three belong to the music of the Southern Man.',
  },
  s0306: {
    literal: '"Gaochang Music": two dancers wore white jackets with brocade sleeves, red leather boots, red leather belts, and red forehead bands.',
    idiomatic: 'Gaochang Music: two dancers in white jackets with brocade sleeves, red boots, red belts, and red forehead bands.',
  },
  s0307: {
    literal: 'The ensemble used one dalai drum, one waist-drum, one jilou drum, one jie-drum, two xiao, two transverse flutes, two bili, two pipa, two five-string pipa, one bronze horn, and one konghou.',
    idiomatic: 'Instruments: dalai and waist-drums, jilou and jie-drums, two xiao, two transverse flutes, two bili, two pipa, two five-string pipa, bronze horn, and konghou.',
  },
  s0308: {
    literal: 'Konghou is now extinct.',
    idiomatic: 'The konghou is lost.',
  },
  s0309: {
    literal: '"Kucha Music": workers wore black silk-cloth headwraps, scarlet silk robes, brocade sleeves, and scarlet cloth trousers.',
    idiomatic: 'Kucha Music: black silk headwraps, scarlet silk robes with brocade sleeves and scarlet trousers.',
  },
  s0310: {
    literal: 'Four dancers wore red forehead bands, scarlet jackets, white trouser leggings, and black leather boots.',
    idiomatic: 'Four dancers with red forehead bands, scarlet jackets, white leggings, and black boots.',
  },
  s0311: {
    literal: 'The ensemble used one vertical konghou, one pipa, one five-string pipa, one sheng, one transverse flute, one xiao, one bili, one Maoyuan drum, one dutan drum, one dalai drum, one waist-drum, one jie-drum, one jilou drum, one bronze cymbals, and one conch.',
    idiomatic: 'Instruments: vertical konghou, pipa, five-string pipa, sheng, transverse flute, xiao, bili, Maoyuan and dutan drums, dalai and waist-drums, jie- and jilou-drums, cymbals, and conch.',
  },
  s0312: {
    literal: 'Maoyuan drum is now extinct.',
    idiomatic: 'The Maoyuan drum is lost.',
  },
  s0313: {
    literal: '"Shule Music": workers wore black silk headwraps, white silk trousers, brocade collar bands; two dancers wore white jackets, brocade sleeves, red leather boots, and red leather belts.',
    idiomatic: 'Shule Music: black headwraps, white silk trousers, brocade collars; dancers in white jackets with brocade sleeves, red boots and belts.',
  },
  s0314: {
    literal: 'The ensemble used vertical konghou, pipa, five-string pipa, transverse flute, xiao, bili, dalai drum, waist-drum, jie-drum, and jilou drum.',
    idiomatic: 'Instruments: vertical konghou, pipa, five-string pipa, transverse flute, xiao, bili, dalai, waist-, jie-, and jilou-drums.',
  },
  s0315: {
    literal: '"Kang Music": workers wore black silk headwraps and scarlet silk robes with brocade collars.',
    idiomatic: 'Kang (Sogdian) Music: black headwraps and scarlet robes with brocade collars.',
  },
  s0316: {
    literal: 'Two dancers wore scarlet jackets, brocade collar and sleeves, green damask full-seat trousers, red leather boots, and white trouser leggings.',
    idiomatic: 'Two dancers in scarlet jackets with brocade collar and sleeves, green damask trousers, red boots, and white leggings.',
  },
  s0317: {
    literal: 'The dance whirls fast as wind; common speech calls it Hu Spin.',
    idiomatic: 'The dance spins like wind—popularly called the Sogdian whirl.',
  },
  s0318: {
    literal: 'The ensemble used two flutes, one main drum, one answering drum, and one bronze cymbals.',
    idiomatic: 'Instruments: two flutes, main and answering drums, and cymbals.',
  },
  s0319: {
    literal: '"An Music": workers wore black silk headwraps, brocade collar bands, and purple sleeve-trousers.',
    idiomatic: 'An Music: black headwraps, brocade collars, purple sleeve-trousers.',
  },
  s0320: {
    literal: 'Two dancers wore purple jackets, white trouser leggings, and red leather boots.',
    idiomatic: 'Two dancers in purple jackets, white leggings, and red boots.',
  },
  s0321: {
    literal: 'The ensemble used pipa, five-string pipa, vertical konghou, xiao, transverse flute, bili, main drum, answering drum, bronze cymbals, and konghou.',
    idiomatic: 'Instruments: pipa, five-string pipa, vertical konghou, xiao, transverse flute, bili, main and answering drums, cymbals, and konghou.',
  },
  s0322: {
    literal: 'Five-string pipa is now extinct.',
    idiomatic: 'The five-string pipa is lost.',
  },
  s0323: {
    literal: 'These five states are music of the Western Rong.',
    idiomatic: 'These five belong to Western Rong music.',
  },
  s0324: {
    literal: 'Southern Man and Northern Di custom all cut the hair along the hairline; today dancers all use cord around the head, turning the hair ends back and binding them within the cord below.',
    idiomatic: 'Southern and northern barbarians traditionally cropped the hairline; dancers now wrap the head in cord and tuck the ends beneath it.',
  },
  s0325: {
    literal: 'There is also new sound from Hexi called Hu yinsheng; with "Kucha Music" and "Miscellaneous Music" it is all prized in the age—other music all yields somewhat before it.',
    idiomatic: 'A new Hexi style called Hu yinsheng ranks with Kucha and Miscellaneous Music as the fashion, eclipsing older repertoires.',
  },
  s0326: {
    literal: '"Northern Di Music": what can be known is the three states Xianbei, Tuyuhun, and Buluoqi—all mounted music.',
    idiomatic: 'Northern Di music known today comes from Xianbei, Tuyuhun, and Buluoqi—all cavalry pieces.',
  },
  s0327: {
    literal: 'Drum-and-blow originally is military sound, performed on horseback; hence from Han onward "Northern Di Music" altogether belongs to the Drum-and-Blow Office.',
    idiomatic: 'Drum-and-blow began as army music played on horseback; since Han, Northern Di music has belonged to the Drum-and-Blow Office.',
  },
  s0328: {
    literal: 'Later Wei\'s Music Bureau first had northern songs—that is what the History of Wei calls "True Man Replacement Songs."',
    idiomatic: 'Later Wei\'s bureau first kept northern songs—the Wei History\'s "True Man Replacement Songs."',
  },
  s0329: {
    literal: 'At the capital of Dai, palace women of the inner quarters were ordered morning and evening to sing them.',
    idiomatic: 'At the Dai capital, inner-palace women sang them morning and night.',
  },
  s0330: {
    literal: 'In Zhou and Sui times they were mixed in performance with "Western Liang Music."',
    idiomatic: 'Under Zhou and Sui they were performed together with Western Liang music.',
  },
  s0331: {
    literal: 'What survives now is fifty-three chapters; titles that can be understood are six pieces;',
    idiomatic: 'Fifty-three pieces survive; six titles are intelligible:',
  },
  s0332: {
    literal: '"Murong Khan," "Tuyuhun," "Buluoqi," "Julu Princess," "White Pure King," and "Crown Prince Qiyu."',
    idiomatic: 'namely "Murong Khan," "Tuyuhun," "Buluoqi," "Julu Princess," "White Pure King," and "Crown Prince Qiyu."',
  },
  s0333: {
    literal: 'Those not understood mostly contain the word khan.',
    idiomatic: 'Obscure titles mostly contain khan.',
  },
  s0334: {
    literal: 'According to present great horn, this is what Later Wei called "Boluo hui"; its tune also has many khan words.',
    idiomatic: 'Today\'s great horn is Later Wei\'s "Boluo hui," likewise full of khan phrases.',
  },
  s0335: {
    literal: 'Northern barbarian custom calls the lord khan.',
    idiomatic: 'Northern peoples call their ruler khan.',
  },
  s0336: {
    literal: 'Tuyuhun is again a separate branch of Murong—knowing this song is Xianbei song of the Yan–Wei period.',
    idiomatic: 'Tuyuhun was a Murong offshoot—so these are Yan–Wei Xianbei songs.',
  },
  s0337: {
    literal: 'Song words are barbarian sound—ultimately unintelligible.',
    idiomatic: 'The lyrics are in barbarian speech and cannot be parsed.',
  },
  s0338: {
    literal: 'Liang had the "Julu Princess" lyric—seemingly a song of Yao Chang\'s time; its words are Chinese sound, unlike northern songs.',
    idiomatic: 'Liang preserved a Chinese-language "Julu Princess" lyric—likely from Yao Chang\'s day, unlike the northern pieces.',
  },
  s0339: {
    literal: 'Liang Music Bureau drum-and-blow also had "Great White Pure Crown Prince," "Little White Pure Crown Prince," "Qiyu," and other tunes.',
    idiomatic: 'Liang\'s bureau also listed "Great White Pure Crown Prince," "Little White Pure Crown Prince," "Qiyu," and similar drum pieces.',
  },
  s0340: {
    literal: 'Sui drum-and-blow had the "White Pure Crown Prince" tune; compared with northern songs, the sounds are all different.',
    idiomatic: 'Sui had its own "White Pure Crown Prince"; the melody differs from the northern version.',
  },
  s0341: {
    literal: 'At the beginning of Kaiyuan, on inquiry of song-master Zhangsun Yuanzhong, he said from Gaozu onward the craft was transmitted in the family.',
    idiomatic: 'Early Kaiyuan: vocalist Zhangsun Yuanzhong said his family had transmitted the art since Gaozu.',
  },
  s0342: {
    literal: 'Yuanzhong\'s grandfather received the craft from General Hou, named Guichang, a man of Bingzhou, who also practiced northern songs through generations.',
    idiomatic: 'His grandfather learned from General Hou Guichang of Bingzhou, another hereditary northern singer.',
  },
  s0343: {
    literal: 'In Zhenguan there was an edict ordering Guichang to teach the Music Bureau his sounds.',
    idiomatic: 'Zhenguan edicts had Guichang teach the bureau his repertoire.',
  },
  s0344: {
    literal: 'Yuanzhong\'s household transmitted thus through generations.',
    idiomatic: 'Yuanzhong\'s line handed it down the same way.',
  },
  s0345: {
    literal: 'Even translators cannot fully know the words—probably years distant, the true form lost.',
    idiomatic: 'Even interpreters cannot make out the words—the original has long been lost.',
  },
  s0346: {
    literal: 'Silk and tong wood: only qin pieces have Hu-jia sound and great horn, managed by the Golden Crow guard.',
    idiomatic: 'Among strings, only qin pieces include Hu-jia and great-horn tunes under the Golden Crow guard.',
  },
  s0347: {
    literal: '"Miscellaneous Music" exists in every age; it is not the sound of the department troupes—jesters, song, dance, and mixed performance.',
    idiomatic: '"Miscellaneous Music" spans every dynasty—non-bureau entertainment of actors, song, dance, and mixed acts.',
  },
  s0348: {
    literal: 'When Han Son of Heaven faced the hall and set music, a sheli beast came from the west, playing before the hall; spurting water it formed paired fish, leaping and sucking water, making mist that veiled the sun, transforming into a yellow dragon eight zhang long, emerging from the water to sport, dazzling in sunlight.',
    idiomatic: 'At Han court audiences a sheli beast from the west played before the throne, spouting water into twin fish that leapt and sprayed mist across the sun, then became an eight-zhang yellow dragon sporting in the light.',
  },
  s0349: {
    literal: 'Ropes tied two pillars several zhang apart; two singing girls danced opposite on the rope, shoulders touching yet not leaning.',
    idiomatic: 'Ropes spanned pillars yards apart; two women danced the rope face to face, shoulder to shoulder without falling.',
  },
  s0350: {
    literal: 'Such miscellaneous transformations are altogether called hundred entertainments.',
    idiomatic: 'Such variety acts were called the hundred entertainments.',
  },
  s0351: {
    literal: 'Left-bank still had "Gaoqi Purple Deer," "Walking Crab Eating," "Qi King Rolling Garments," "Rope Mouse," "Xia Yu Shouldering Tripod," "Minister Xiang Nursing," "Spirit Turtle Clapping Play Bearing Spirit Peak," "Osmanthus Tree White Snow," and "Drawing Earth into River" skills.',
    idiomatic: 'Jiangzuo still knew acts like Purple Deer of Gaoqi, Walking Crab, Qi King Rolling Cloth, Rope Mouse, Xia Yu with the tripod, Minister Xiang nursing, the turtle act bearing Spirit Peak, Osmanthus White Snow, and Drawing a River on the Ground.',
  },
  s0352: {
    literal: 'Emperor Cheng of Jin, Attendant Gentleman Gu Zhen memorialized: "Music of a decadent age sets exotic displays, running backward and linked inversion."',
    idiomatic: 'Jin Emperor Cheng\'s attendant Gu Zhen wrote: "Decadent shows invert nature with exotic stunts and upside-down tricks."',
  },
  s0353: {
    literal: '"The four seas attend the imperial court, yet enough to tread heaven and head to tread earth—reversing heaven-and-earth\'s order, injuring the great human relations."',
    idiomatic: '"All under heaven attends court, yet performers tread the sky with their feet and the earth with their heads—reversing cosmic order and violating human relations."',
  },
  s0354: {
    literal: '" He thereupon ordered the Court of Imperial Sacrifices to abolish them all.',
    idiomatic: '" He ordered the Court of Imperial Sacrifices to abolish them all.',
  },
  s0355: {
    literal: 'Afterward "Gaoqi Purple Deer" was restored.',
    idiomatic: 'Later "Gaoqi Purple Deer" was revived.',
  },
  s0356: {
    literal: 'Later Wei and Northern Qi also had "Fish Dragon Warding Evil," "Deer Horse Immortal Carriage," "Swallowing Blade Spitting Fire," "Stripping Cart Stripping Donkey," and "Planting Melon Pulling Well" plays.',
    idiomatic: 'Later Wei and Northern Qi also staged Fish-Dragon Warding Evil, Deer-Horse Immortal Carriage, blade swallowing, cart and donkey stripping, and melon-planting well-drawing acts.',
  },
  s0357: {
    literal: 'Emperor Xuan of Zhou summoned Qi music and gathered it in Guanzhong.',
    idiomatic: 'Northern Zhou Xuan Di brought Qi performers into Guanzhong.',
  },
  s0358: {
    literal: 'At the beginning of Kaihuang they were dispersed and dismissed.',
    idiomatic: 'Early Kaihuang dispersed them.',
  },
  s0359: {
    literal: 'When the Tujue qaghan came to audience at Luoyang palace, Emperor Yang held a great union of music, fully mastering Han, Jin, Zhou, and Qi techniques.',
    idiomatic: 'When a Türk qaghan visited Luoyang, Yangdi staged a grand music festival mastering Han through Qi repertoires.',
  },
  s0360: {
    literal: 'The Hu people were greatly startled.',
    idiomatic: 'The Hu guests were astonished.',
  },
  s0361: {
    literal: 'The emperor ordered the Music Office to practice them, often at the new year letting the masses view within Duan Gate.',
    idiomatic: 'He had the Music Office drill the acts and each New Year opened Duan Gate for public viewing.',
  },
  s0362: {
    literal: 'Generally "Miscellaneous Music" mixed plays are mostly illusion arts; illusion arts all come from the Western Regions—Tianzhu especially.',
    idiomatic: 'Miscellaneous acts are largely illusion tricks from the Western Regions, especially India.',
  },
  s0363: {
    literal: 'Emperor Wu of Han opened the Western Regions and first had skilled illusionists come to China.',
    idiomatic: 'Han Wudi\'s western campaigns first brought master illusionists to China.',
  },
  s0364: {
    literal: 'In Emperor An\'s time Tianzhu presented skills—able to sever hands and feet themselves and cut open the belly; from then every age had them.',
    idiomatic: 'Under Emperor An India sent performers who cut off limbs and opened their bellies—such acts recurred thereafter.',
  },
  s0365: {
    literal: 'Our Gaozong hated that they startled custom and ordered western border passes not to let them enter China.',
    idiomatic: 'Gaozong disliked their shock to morals and barred western passes to them.',
  },
  s0366: {
    literal: 'Fu Jian once obtained western-region inverted-dance performers.',
    idiomatic: 'Fu Jian once acquired western upside-down dancers.',
  },
  s0367: {
    literal: 'In Ruizong\'s time a Brahmin presented music; dancers walked inverted, yet danced with feet on extremely sharp knife points, planted upside down on the ground, lowering the eyes to the blades and passing them across the face, again planted under the back while a bili player stood on the belly—at the tune\'s end still unharmed.',
    idiomatic: 'Under Ruizong a Brahmin troupe danced upside-down on razor knife points, blades along the face and back, a bili player standing on the belly—finishing unhurt.',
  },
  s0368: {
    literal: 'Again prostrate they extended the hands; two men trod them, wrapping the body around the hands, turning a hundred times without end.',
    idiomatic: 'They also lay flat with arms outstretched while two men stepped on their hands and spun around them endlessly.',
  },
  s0369: {
    literal: 'Han times had pole-climbing skill and also plate dance.',
    idiomatic: 'Han had pole-climbing and plate dancing.',
  },
  s0370: {
    literal: 'Jin age added cups to it, calling it "Cup-Plate Dance."',
    idiomatic: 'Jin added cups, naming it the Cup-Plate Dance.',
  },
  s0371: {
    literal: 'A Music Bureau poem says, "Lovely sleeves surmount seven plates"—meaning the dance used seven plates.',
    idiomatic: 'A yuefu line runs, "Fair sleeves span seven plates"—seven plates in the dance.',
  },
  s0372: {
    literal: 'Liang called it "Plate-Dance Skill."',
    idiomatic: 'Liang called it the Plate-Dance act.',
  },
  s0373: {
    literal: 'Liang had "Long-Stilt Skill," "Throwing-Inversion Skill," "Sword-Leap Skill," and "Sword-Swallowing Skill"—all exist today.',
    idiomatic: 'Liang knew stilt walking, tumbling, sword leaping, and sword swallowing—all still performed.',
  },
  s0374: {
    literal: 'There was also "Wheel-Dance Skill"—probably today\'s wheel acts.',
    idiomatic: 'There was also wheel dancing—today\'s cart-wheel acts.',
  },
  s0375: {
    literal: '"Passing Three Gorges Skill"—probably today\'s kind of "Passing Flying Ladder."',
    idiomatic: '"Passing Three Gorges" resembles today\'s flying-ladder stunt.',
  },
  s0376: {
    literal: '"Gaoqi Skill"—probably today\'s rope play.',
    idiomatic: '"Gaoqi" is today\'s rope dancing.',
  },
  s0377: {
    literal: 'Liang had "Monkey Banner Skill"; today there is "Pole-Climbing" and also "Monkey Pole-Climbing"—which is correct is unclear.',
    idiomatic: 'Liang had Monkey-on-Banner acts; today\'s pole-climbing and monkey pole acts may stem from either—uncertain which.',
  },
  s0378: {
    literal: 'There were also "Playing Bowl Pearl Skill" and "Cinnabar Pearl Skill."',
    idiomatic: 'Also bowl-pearl juggling and cinnabar-pearl acts.',
  },
  s0379: {
    literal: 'Song-and-dance plays include "Great Mask," "Botou," "Taoyao Niang," and "Kuileizi" and other plays.',
    idiomatic: 'Dramatic pieces include Great Mask, Botou, Taoyao Niang, and puppet Kuileizi plays.',
  },
  s0380: {
    literal: 'Xuanzong, because they were not orthodox sound, placed the Instruction Workshop within the forbidden quarter to house them.',
    idiomatic: 'Xuanzong, deeming them non-court music, housed them in the inner-city Instruction Workshop.',
  },
  s0381: {
    literal: '"Brahmin Music" is listed with the four barbarians alike.',
    idiomatic: 'Brahmin Music ranks with the four foreign repertoires.',
  },
  s0382: {
    literal: '"Brahmin Music" uses two lacquered bili and one Qi drum.',
    idiomatic: 'Brahmin Music uses two lacquered bili and one Qi drum.',
  },
  s0383: {
    literal: '"Miscellaneous Music" uses one transverse flute, one clapper, and three waist-drums.',
    idiomatic: 'Miscellaneous Music uses one transverse flute, one clapper, and three waist-drums.',
  },
  s0384: {
    literal: 'Other mixed plays change form in many ways—all not worth naming.',
    idiomatic: 'Other variety acts shift form endlessly and need not be catalogued.',
  },
  s0385: {
    literal: '"Great Mask" comes from Northern Qi.',
    idiomatic: 'Great Mask originated in Northern Qi.',
  },
  s0386: {
    literal: 'Northern Qi\'s Prince Lanling, Chang Gong, was talented in war yet beautiful of face and often wore a false mask to face the enemy.',
    idiomatic: 'Northern Qi\'s Prince Lanling Chang Gong was valiant but handsome and often wore a mask in battle.',
  },
  s0387: {
    literal: 'Once striking Zhou troops below Jinyong city, his courage topped the three armies; Qi people admired it and made this dance to imitate his directing and thrusting bearing, calling it "Prince Lanling Enters the Array."',
    idiomatic: 'After routing Zhou forces at Jinyong, Qi created a dance mimicking his command and spear work—"Prince Lanling Enters the Array."',
  },
  s0388: {
    literal: '"Botou" comes from the Western Regions.',
    idiomatic: 'Botou came from the Western Regions.',
  },
  s0389: {
    literal: 'A Hu man was bitten by a fierce beast; his son sought the beast and killed it, making this dance to image it.',
    idiomatic: 'A Hu man was killed by a beast; his son slew the beast and staged this dance in reenactment.',
  },
  s0390: {
    literal: '"Taoyao Niang" arose at the end of Sui.',
    idiomatic: 'Taoyao Niang arose in late Sui.',
  },
  s0391: {
    literal: 'At the end of Sui in Henei there was a man ugly of face and fond of wine who often styled himself Attendant; drunk returning he always beat his wife.',
    idiomatic: 'Late Sui Henei had an ugly, drunken man who called himself Attendant and beat his wife when he came home drunk.',
  },
  s0392: {
    literal: 'His wife was beautiful and skilled at song, making plaintive bitter words.',
    idiomatic: 'His wife was beautiful and sang bitter laments.',
  },
  s0393: {
    literal: 'North of the Yellow River performed his tune and clothed it in strings and pipes, thereby depicting his wife\'s appearance.',
    idiomatic: 'Hebei set the tune to strings and pipes and painted her likeness in the performance.',
  },
  s0394: {
    literal: 'The wife grieved and pleaded; each time she swayed her body—hence the name "Taoyao Niang."',
    idiomatic: 'She pleaded in song, swaying as she danced—hence Taoyao ("Swaying") Niang.',
  },
  s0395: {
    literal: 'Recent actors have considerably altered its form—not the old intent.',
    idiomatic: 'Modern actors have changed the form far from the original.',
  },
  s0396: {
    literal: '"Kuileizi," also called "Kui leizi," makes puppets to play, skilled at song and dance.',
    idiomatic: 'Kuileizi (puppet) plays, also called Kui leizi, use figures adept at song and dance.',
  },
  s0397: {
    literal: 'Originally funeral-house music.',
    idiomatic: 'They began as funeral entertainment.',
  },
  s0398: {
    literal: 'At the end of Han it was first used at festive gatherings.',
    idiomatic: 'Late Han first used them at banquets.',
  },
  s0399: {
    literal: 'Later Ruler Gao Wei of Qi especially loved it.',
    idiomatic: 'Northern Qi\'s Gao Wei adored them.',
  },
  s0400: {
    literal: 'Koguryo also has them.',
    idiomatic: 'Koguryo has them as well.',
  },
};

function emit(batchNum, zhFile, T, outFile) {
  const zh = JSON.parse(readFileSync(zhFile, 'utf8'));
  const out = {};
  for (const row of zh) {
    const e = T[row.id];
    if (!e?.literal?.trim() || !e?.idiomatic?.trim()) {
      throw new Error(`Missing translation for ${row.id}`);
    }
    if (e.literal === e.idiomatic) {
      throw new Error(`${row.id}: literal === idiomatic`);
    }
    out[row.id] = { literal: e.literal, idiomatic: e.idiomatic };
  }
  if (Object.keys(out).length !== zh.length) {
    throw new Error(`${outFile}: count ${Object.keys(out).length} vs zh ${zh.length}`);
  }
  writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
  console.log('Wrote', outFile, Object.keys(out).length, 'entries');
}

emit(3, 'translations/_ch029-zh-batch3.json', T3, 'translations/_ch029-batch3.json');
emit(4, 'translations/_ch029-zh-batch4.json', T4, 'translations/_ch029-batch4.json');
