#!/usr/bin/env node
import fs from 'node:fs';
const T = {
  "s0601": [
    "Calculating Yangcheng to Jiao Province, the road should be ten thousand li, yet shadow actually differed one chi eight cun two fen.",
    "Yangcheng to Jiao Province should be ten thousand li by road, yet shadows differed by one chi eight cun two fen."
  ],
  "s0602": [
    "Thus six hundred li per cun difference.",
    "That is one cun difference per six hundred li."
  ],
  "s0603": [
    "Also in Liang Datong, solstice measurements with eight-chi gnomon standard gave summer solstice about one chi one cun seven fen strong.",
    "Liang Datong solstice measures with an eight-chi gnomon gave summer solstice about one chi one cun seven fen strong."
  ],
  "s0604": [
    "Northern Wei Xin Du Fang's commentary on Zhou Bi Four Methods says Yongping 1 wuzi, corresponding to Liang Tianjian 7, saw Luoyang shadow measurement; also saw Gongsun Chong gather court gentlemen viewing Secretariat shadows.",
    "Xin Du Fang noted that in Yongping 1 (Liang Tianjian 7) Luoyang shadows were measured and Gongsun Chong gathered officials to view Secretariat shadows."
  ],
  "s0605": [
    "Same summer solstice day—all midday shadows one chi five cun eight fen long.",
    "On the same summer solstice all midday shadows measured one chi five cun eight fen."
  ],
  "s0606": [
    "From this inferring, Jinling to Luoyang north-south roughly one thousand li, yet shadow differed four cun.",
    "Jinling to Luoyang is roughly one thousand li north-south, yet shadows differed four cun."
  ],
  "s0607": [
    "Then two hundred fifty li per cun difference.",
    "That yields one cun per two hundred fifty li."
  ],
  "s0608": [
    "Moreover human roads wind, mountains rise and fall—compared with bird flight, correction is greater; thus the thousand-li saying cannot be relied on.",
    "Human roads wind and terrain varies—unlike bird flight—so the thousand-li rule cannot be relied on."
  ],
  "s0609": [
    "Measurement discrepancies are thus—therefore fully discussed.",
    "Measurements diverge thus—hence this full discussion."
  ],
  "s0610": [
    "Clepsydra Marks",
    "Clepsydra Marks"
  ],
  "s0611": [
    "Formerly the Yellow Emperor first observed dripping water, made instruments taking norms, to divide day and night.",
    "The Yellow Emperor first observed dripping water and made instruments to divide day and night."
  ],
  "s0612": [
    "Afterward offices were named accordingly—Rites of Zhou's Pitcher Bearer is that duty.",
    "Offices were named accordingly—the Rites of Zhou Pitcher Bearer held this duty."
  ],
  "s0613": [
    "Its method totals one hundred marks divided between day and night.",
    "The method totals one hundred marks between day and night."
  ],
  "s0614": [
    "Winter solstice day clepsydra forty marks, night sixty marks.",
    "Winter solstice: forty day marks, sixty night marks."
  ],
  "s0615": [
    "Summer solstice day clepsydra sixty marks, night forty marks.",
    "Summer solstice: sixty day marks, forty night marks."
  ],
  "s0616": [
    "Spring and autumn equinox—day and night each fifty marks.",
    "Equinoxes: fifty marks each for day and night."
  ],
  "s0617": [
    "Two and a half marks before sun not yet risen it is light; two and a half marks after setting then dusk.",
    "Light begins two and a half marks before sunrise; dusk two and a half marks after sunset."
  ],
  "s0618": [
    "Subtract five night marks to add to day clepsydra—called dusk and dawn.",
    "Five night marks transfer to day clepsydra—dusk and dawn allowance."
  ],
  "s0619": [
    "Clepsydra marks all increase and decrease with qi.",
    "Clepsydra marks adjust with seasonal qi."
  ],
  "s0620": [
    "Between winter and summer solstices, day-night length differs twenty marks total.",
    "Between solstices day and night length differs twenty marks."
  ],
  "s0621": [
    "Each one-mark difference is one arrow.",
    "Each one-mark change equals one arrow."
  ],
  "s0622": [
    "Winter solstice alternately starting the head—in all forty-one arrows.",
    "From winter solstice forty-one arrows alternate."
  ],
  "s0623": [
    "Day has court, yu, center, bu, evening.",
    "Day periods: court, yu, center, bu, evening."
  ],
  "s0624": [
    "Night has jia, yi, bing, ding, wu.",
    "Night watches: jia, yi, bing, ding, wu."
  ],
  "s0625": [
    "Dusk and dawn have centered stars.",
    "Dusk and dawn have centered stars."
  ],
  "s0626": [
    "Each arrow has its number—all to divide eras, guard time, and change labor.",
    "Each arrow has its count to divide eras, guard time, and schedule labor."
  ],
  "s0627": [
    "Han risen, Zhang Cang followed ancient system—still much loose and wide.",
    "Han's Zhang Cang followed ancient practice but left much loose."
  ],
  "s0628": [
    "When Emperor Wu examined stars and calendar, lowered clepsydra to chase heavenly degrees—also could not exhaust principle.",
    "Emperor Wu lowered clepsydra to match heavenly degrees—yet principle was not fully grasped."
  ],
  "s0629": [
    "Liu Xiang's Hong Fan Commentary records Wu's method: \"Between winter and summer solstices, one hundred eighty-odd days, day-night differs twenty marks.\"",
    "Liu Xiang records Wu's method: between solstices one hundred eighty-odd days differ twenty marks in day-night length."
  ],
  "s0630": [
    "\" Generally after solstices, every nine days increase or decrease one mark.",
    "Generally one mark changes every nine days after a solstice."
  ],
  "s0631": [
    "By Emperor Ai's time, again changed to day-night one hundred twenty marks—soon also abandoned.",
    "Emperor Ai tried one hundred twenty marks—soon abandoned."
  ],
  "s0632": [
    "When Wang Mang usurped, again followed it.",
    "Wang Mang followed it again."
  ],
  "s0633": [
    "Early Guangwu also used hundred-mark nine-day adjustment, compiled in Edict A as Constant Talisman Clepsydra Categories.",
    "Early Guangwu used hundred marks with nine-day adjustment in Edict A."
  ],
  "s0634": [
    "By Emperor He Yongyuan 14, Huo Rong submitted: \"Official calendar uniformly nine days per mark change—not corresponding with Heaven.\"",
    "Huo Rong in Yongyuan 14: official calendar's nine-day mark change does not match Heaven."
  ],
  "s0635": [
    "Sometimes difference reaches two and a half marks—inferior to Xia calendar clepsydra following sun north-south for length.",
    "Error reached two and a half marks—inferior to Xia calendar clepsydra following solar latitude."
  ],
  "s0636": [
    "\" Then edict used Xia calendar clepsydra.",
    "An edict adopted Xia calendar clepsydra."
  ],
  "s0637": [
    "Following sun's Yellow Path distance from pole, every two degrees four fen difference is one mark increase or decrease.",
    "Each two degrees four fen of solar polar distance changes clepsydra one mark."
  ],
  "s0638": [
    "In all forty-eight arrows used—through Wei and Jin transmitted unchanged.",
    "Forty-eight arrows were used through Wei and Jin unchanged."
  ],
  "s0639": [
    "Song He Chengtian from lunar eclipse location at day's balance, verifying sun's lodge, knew old shift of six degrees.",
    "He Chengtian found the sun's lodge shifted six degrees from eclipse data."
  ],
  "s0640": [
    "Winter solstice day its shadow extremely long—measuring gnomon degrees, knew winter solstice shifted old four days.",
    "Winter solstice shadow measurement showed a four-day shift."
  ],
  "s0641": [
    "Prior generations' clepsydra—spring equinox day long, autumn equinox day short, difference over half a mark.",
    "Older clepsydra made spring days too long and autumn days too short by over half a mark."
  ],
  "s0642": [
    "All because qi days not correct—whence this.",
    "All because seasonal days were incorrect."
  ],
  "s0643": [
    "Then proposed making clepsydra method.",
    "He then proposed a new clepsydra method."
  ],
  "s0644": [
    "Spring and autumn equinox dusk-dawn day-night clepsydra each fifty-five marks.",
    "Equinox dusk-dawn clepsydra: fifty-five marks each for day and night."
  ],
  "s0645": [
    "Qi and early Liang followed unchanged.",
    "Qi and early Liang followed unchanged."
  ],
  "s0646": [
    "By Tianjian 6, Emperor Wu because day-night hundred marks divided among twelve chronograms, each chronogram eight marks with remainder.",
    "Tianjian 6: hundred marks divided among twelve chronograms left remainders."
  ],
  "s0647": [
    "Then made day-night ninety-six marks—one chronogram exactly eight full marks.",
    "Day-night became ninety-six marks—eight full marks per chronogram."
  ],
  "s0648": [
    "By Datong 10, again changed to one hundred eight marks.",
    "Datong 10 changed to one hundred eight marks."
  ],
  "s0649": [
    "Following Documents Kao Ling Yao day-night thirty-six qing count, then trebled.",
    "Following Kao Ling Yao's thirty-six qing count, trebled."
  ],
  "s0650": [
    "Winter solstice day clepsydra forty-eight marks, night sixty marks.",
    "Winter solstice: forty-eight day, sixty night marks."
  ],
  "s0651": [
    "Summer solstice day clepsydra seventy marks, night thirty-eight marks.",
    "Summer solstice: seventy day, thirty-eight night marks."
  ],
  "s0652": [
    "Spring and autumn equinox day clepsydra sixty marks, night forty-eight marks.",
    "Equinox: sixty day, forty-eight night marks."
  ],
  "s0653": [
    "Dusk and dawn each three marks.",
    "Dusk and dawn: three marks each."
  ],
  "s0654": [
    "First ordered Zu Geng's Clepsydra Classic—all following spherical Heaven Yellow Path sun daily polar distance for arrow-day rates.",
    "Zu Geng's Clepsydra Classic used solar polar distance for arrow rates."
  ],
  "s0655": [
    "Chen Emperor Wen Tianjia ordered Gentleman Zhu Shi to make clepsydra, following ancient hundred-mark method.",
    "Chen Wendi ordered Zhu Shi to make clepsydra by the ancient hundred-mark method."
  ],
  "s0656": [
    "Zhou and Qi followed Wei clepsydra.",
    "Zhou and Qi followed Wei clepsydra."
  ],
  "s0657": [
    "Jin, Song, Liang Datong all divided hundred marks between day and night.",
    "Jin, Song, and Liang Datong used hundred marks between day and night."
  ],
  "s0658": [
    "Early Sui used Zhou Yin Gongzheng and Ma Xian's Clepsydra Classic.",
    "Early Sui used Yin Gongzheng and Ma Xian's Clepsydra Classic."
  ],
  "s0659": [
    "By Kaihuang 14, Fuzhou Marshal Yuan Chong submitted gnomon shadow clepsydra.",
    "Kaihuang 14: Yuan Chong submitted gnomon and clepsydra reforms."
  ],
  "s0660": [
    "Chong used short-shadow level instrument, evenly distributing twelve chronograms, erecting gnomon—following day shadow's indicated chronogram mark to verify clepsydra nodes.",
    "Chong used a level instrument and gnomon shadows to verify clepsydra nodes by chronogram."
  ],
  "s0661": [
    "Twelve chronogram marks mutually more or less; time before and after center, marks also differ.",
    "Twelve chronogram marks varied; marks differed before and after true center."
  ],
  "s0662": [
    "The solstice and equinox arrow-chronogram mark method—now listed:",
    "Solstice and equinox arrow-chronogram methods are listed below:"
  ],
  "s0663": [
    "Winter solstice: sun rises chen centered, sets shen centered; day forty marks, night sixty marks.",
    "Winter solstice: sunrise at chen center, sunset at shen center; forty day, sixty night marks."
  ],
  "s0664": [
    "Zi, chou, hai each two marks; yin, xu each six; mao, you each thirteen; chen, shen each fourteen; si, wei each ten; wu eight marks.",
    "Zi, chou, hai two marks each; yin, xu six; mao, you thirteen; chen, shen fourteen; si, wei ten; wu eight."
  ],
  "s0665": [
    "Right—fourteen days change arrow.",
    "Arrow changes every fourteen days."
  ],
  "s0666": [
    "Spring and autumn equinox: sun rises mao centered, sets you centered; day fifty marks, night fifty marks.",
    "Equinox: sunrise mao center, sunset you center; fifty day, fifty night marks."
  ],
  "s0667": [
    "Zi four marks; chou, hai seven; yin, xu nine; mao, you fourteen; chen, shen nine; si, wei seven; wu four marks.",
    "Zi four; chou, hai seven; yin, xu nine; mao, you fourteen; chen, shen nine; si, wei seven; wu four."
  ],
  "s0668": [
    "Right—five days change arrow.",
    "Arrow changes every five days."
  ],
  "s0669": [
    "Summer solstice: sun rises yin centered, sets xu centered; day sixty marks, night forty marks.",
    "Summer solstice: sunrise yin center, sunset xu center; sixty day, forty night marks."
  ],
  "s0670": [
    "Zi eight marks; chou, hai ten; yin, xu fourteen; mao, you thirteen; chen, shen six; si, wei two; wu two marks.",
    "Zi eight; chou, hai ten; yin, xu fourteen; mao, you thirteen; chen, shen six; si, wei two; wu two."
  ],
  "s0671": [
    "Right—nineteen days, add or subtract one mark, change arrow.",
    "Every nineteen days adjust one mark and change arrow."
  ],
  "s0672": [
    "Yuan Chong never understood spherical Heaven Yellow Path polar distance numbers—forcing private wit, altering old statutes—in application not precise.",
    "Yuan Chong did not understand polar distance; his private alterations were imprecise."
  ],
  "s0673": [
    "Kaihuang 17, Zhang Zhouxuan used Northern Wei iron armillary sphere, measured knowing spring and autumn equinox sun rises north of mao-you—not directly centered.",
    "Kaihuang 17: Zhang Zhouxuan found equinox sunrise north of mao-you, not centered."
  ],
  "s0674": [
    "Matching He Chengtian's measurement—both sun rise mao three marks fifty-five fen, set you four marks twenty-five fen.",
    "Matching He Chengtian: sunrise mao 3 marks 55 fen, sunset you 4 marks 25 fen."
  ],
  "s0675": [
    "Day clepsydra fifty marks eleven fen, night forty-nine marks forty fen—day-night difference sixty forty-hundredths marks.",
    "Day fifty marks eleven fen, night forty-nine forty—difference sixty forty-hundredths marks."
  ],
  "s0676": [
    "Renshou 4, Liu Zhuo submitted Huangji Calendar with sun's slow and fast motion, deriving twenty-four qi—all with surplus and deficit fixed days.",
    "Renshou 4: Liu Zhuo's Huangji Calendar derived twenty-four qi with surplus and deficit days."
  ],
  "s0677": [
    "Spring and autumn equinox fixed days—eighty-eight days odd from winter solstice, ninety-three days odd from summer solstice.",
    "Equinox fixed days: eighty-eight odd from winter solstice, ninety-three odd from summer solstice."
  ],
  "s0678": [
    "Equinox fixed days—day and night each fifty marks.",
    "Equinox fixed days: fifty marks day and night."
  ],
  "s0679": [
    "Also verifying by spherical Heaven Yellow Path—knowing winter solstice night clepsydra fifty-nine marks eighty-six hundredths, day forty marks fourteen fen; summer solstice day fifty-nine eighty-six, night forty fourteen.",
    "By Yellow Path: winter solstice night fifty-nine marks 86 hundredths, day forty fourteen; summer reversed."
  ],
  "s0680": [
    "Between winter and summer solstices, day-night difference nineteen marks seventy-two hundredths.",
    "Between solstices day-night differs nineteen marks seventy-two hundredths."
  ],
  "s0681": [
    "Zhouxuan and Zhuo clepsydra—neither applied.",
    "Neither Zhouxuan nor Zhuo's clepsydra was adopted."
  ],
  "s0682": [
    "Yet their methods and systems are recorded in calendar arts—verifying and adding time, most detailed and examined.",
    "Their methods remain in calendar texts—the most detailed for time verification."
  ],
  "s0683": [
    "Daye start, Geng Xun made ancient tilt vessel, water-filled, presented to Emperor Yang.",
    "At Daye's start Geng Xun made an ancient tilt vessel for Emperor Yang."
  ],
  "s0684": [
    "Emperor approved—ordered with Yuwen Kai following Northern Wei Daoist Li Lan's Daoist upper-method scale clepsydra, making scale water clepsydra for travel retinue.",
    "Emperor Yang ordered Yuwen Kai to make traveling scale clepsydra after Li Lan's method."
  ],
  "s0685": [
    "Also made shadow-dividing arrow upper-water square vessel, placed at Eastern Capital Qianyang Hall before drums for timekeeping.",
    "Also a shadow-dividing water vessel at Qianyang Hall for timekeeping."
  ],
  "s0686": [
    "Also made horse-mounted clepsydra for travel time distinction.",
    "Also a horse-mounted clepsydra for travel."
  ],
  "s0687": [
    "Measuring sun gnomon, lowering clepsydra marks—these two are measuring Heaven and Earth's correct instruments and models' root.",
    "Gnomon and clepsydra are the roots of correct celestial measurement."
  ],
  "s0688": [
    "Gnomon clepsydra evolution ancient and modern greatly differs—thus listing differences to supplement prior gaps.",
    "Gnomon and clepsydra evolved greatly—differences are listed to fill prior gaps."
  ],
  "s0689": [
    "Fixed Stars: Inner Palace",
    "Fixed Stars: Inner Palace"
  ],
  "s0690": [
    "The five stars of the North Pole and the six stars of Goutchen are all within the Purple Palace.",
    "The five North Pole stars and six Goutchen stars all lie within the Purple Palace."
  ],
  "s0691": [
    "The North Pole is the celestial pivot (chen).",
    "The North Pole is the celestial pivot."
  ],
  "s0692": [
    "Its pivot star is the pivot of Heaven.",
    "Its pivot star is Heaven's pivot."
  ],
  "s0693": [
    "Heaven's motion is endless; sun, moon, and stars shine in succession, yet the pole star does not move.",
    "Heaven turns without end as the three luminaries pass in turn, yet the pole star holds its place."
  ],
  "s0694": [
    "Hence it is said: \"Remaining in its place, all stars revolve around it.\"",
    "Hence the saying: \"It dwells in its place while all stars attend it.\""
  ],
  "s0695": [
    "\" Jia Kui, Zhang Heng, Cai Yong, Wang Fan, and Lu Ji all took the North Pole pivot star as the pivot—the unmoving point.",
    "Jia Kui, Zhang Heng, Cai Yong, Wang Fan, and Lu Ji all held the North Pole pivot star to be the fixed pivot."
  ],
  "s0696": [
    "Zu Geng, using instruments to observe the unmoving point, found it at the end of the pivot star, still more than one degree off.",
    "Zu Geng measured the unmoving point with instruments and placed it beyond the pivot star by more than one degree."
  ],
  "s0697": [
    "The great star of the North Pole is the seat of the Supreme One.",
    "The North Pole's great star is the throne of the Supreme One."
  ],
  "s0698": [
    "The first star governs the moon and represents the Heir Apparent.",
    "The first star governs the moon; it is the Heir Apparent."
  ],
  "s0699": [
    "The second star governs the sun and represents the emperor.",
    "The second star governs the sun; it is the emperor."
  ],
  "s0700": [
    "The third star governs the five planets and represents the secondary son.",
    "The third star governs the five planets; it is the secondary son."
  ]
};
const p=process.argv[2]; if(!p)process.exit(1);
const d=JSON.parse(fs.readFileSync(p,'utf8')); let n=0;
for(const s of d.sentences){const x=T[s.id];if(x){s.literal=x[0];s.idiomatic=x[1];n++;}}
fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n'); console.log('Patch',n);
