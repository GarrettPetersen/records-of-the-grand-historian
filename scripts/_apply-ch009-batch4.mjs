#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.009, Xuanzong 2 — An Lushan rises, Li Linfu falls) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0301: {
    literal: 'On renwu of the fifth month, the emperor went to Xingqing Palace, received the seal of the honorific title, granted a great amnesty throughout the empire, and exempted the people from the coming year\'s corvée and land tax.',
    idiomatic: 'On renwu of the fifth month he went to Xingqing Palace to receive the honorific seal, proclaimed a great amnesty, and remitted the people\'s corvée and land tax for the coming year.',
  },
  s0302: {
    literal: 'For emperors before the Three Sovereigns, temples were established in the capital and sacrifices offered seasonally.',
    idiomatic: 'For pre-Three Sovereigns emperors, temples were built in the capital and honored on the seasonal schedule.',
  },
  s0303: {
    literal: 'Where former emperors had first risen but no shrine kept watch, each place was to establish one temple.',
    idiomatic: 'Wherever an ancient emperor had first risen and no shrine yet stood, a temple was to be built on the spot.',
  },
  s0304: {
    literal: 'Loyal ministers, righteous warriors, filial daughters, and chaste women of the highest virtue were also granted shrines and sacrifices.',
    idiomatic: 'Shrines were likewise ordained for loyal ministers, righteous warriors, filial daughters, and women of blazing chastity.',
  },
  s0305: {
    literal: 'A feast of three days was granted.',
    idiomatic: 'The court granted a three-day feast.',
  },
  s0306: {
    literal: 'In the sixth month, Fanyang military commissioner An Lushan was granted a substantive fief and an iron certificate.',
    idiomatic: 'In the sixth month An Lushan, commissioner of Fanyang, received a substantive fief and an iron certificate of grace.',
  },
  s0307: {
    literal: 'On the new moon of jihai of the eighth autumn month, the Thousand Autumns Festival was renamed the Eternal Heaven Festival.',
    idiomatic: 'On the jihai new moon of the eighth autumn month the Thousand Autumns Festival was renamed Eternal Heaven Festival.',
  },
  s0308: {
    literal: 'On renzi, Wannian county was renamed Xianning county.',
    idiomatic: 'On renzi Wannian county was renamed Xianning.',
  },
  s0309: {
    literal: 'On gengwu of the tenth winter month, he went to Huaqing Palace and enfeoffed the imperial consort\'s two elder sisters as Ladies of Han and Guo states.',
    idiomatic: 'On gengwu of the tenth winter month he went to Huaqing Palace and created the consort\'s two elder sisters Ladies of Han and Guo.',
  },
  s0310: {
    literal: 'On wuxu of the twelfth month, the Mysterious Origin Emperor was said to have appeared in the Chaoyuan Pavilion at Huaqing Palace; the pavilion was therefore renamed the Descent of the Sage Pavilion.',
    idiomatic: 'On wuxu of the twelfth month the Mysterious Origin Emperor was said to have appeared in Huaqing Palace\'s Chaoyuan Pavilion, which was renamed Descent of the Sage Pavilion.',
  },
  s0311: {
    literal: 'Huichang county was renamed Zhaoying county, and Huichang Mountain Zhaoying Mountain;',
    idiomatic: 'Huichang county became Zhaoying, and Huichang Mountain Zhaoying Mountain;',
  },
  s0312: {
    literal: 'the mountain spirit was enfeoffed as Duke of Mysterious Virtue, and a shrine was established.',
    idiomatic: 'its spirit was enfeoffed Duke of Mysterious Virtue, and a shrine was built.',
  },
  s0313: {
    literal: 'On xinyou, he returned to the capital.',
    idiomatic: 'On xinyou he returned to the capital.',
  },
  s0314: {
    literal: 'On jiashen of the first spring month of Tianbao 8, silk was granted to capital officials for spring outings.',
    idiomatic: 'On jiashen of the first spring month of Tianbao 8 capital officials received silk for spring outings.',
  },
  s0315: {
    literal: 'On wushen of the second month, the hundred officials were led to view the coin storehouse of the left treasury and were given silk on returning.',
    idiomatic: 'On wushen of the second month officials were led through the left treasury to gaze on its coin hoard and sent home with gifts of silk.',
  },
  s0316: {
    literal: 'In the third month, Shuofang military commissioner Zhang Qiqiu built Hengsai Fort north of the central surrender city.',
    idiomatic: 'In the third month Zhang Qiqiu, commissioner of Shuofang, built Hengsai Fort north of the central surrender city.',
  },
  s0317: {
    literal: 'In the fourth summer month, Xianning protector Zhao Fengzhang was beaten to death with the staff, and Director of Composition Wei Zichun was demoted to magistrate of Duanxi—Li Linfu had framed them.',
    idiomatic: 'In the fourth summer month Zhao Fengzhang, protector of Xianning, was beaten to death and Wei Zichun, director of composition, demoted to Duanxi magistrate—Li Linfu had engineered it.',
  },
  s0318: {
    literal: 'He went to Huaqing Palace to view the Wind Tower.',
    idiomatic: 'He went to Huaqing Palace to visit the Wind Tower.',
  },
  s0319: {
    literal: 'On xinsi of the fifth month, the Pacifying Army Pavilion was built outside Kaiyuan Gate.',
    idiomatic: 'On xinsi of the fifth month the Pacifying Army Pavilion was erected outside Kaiyuan Gate.',
  },
  s0320: {
    literal: 'On wuzi, Nanhai protector Liu Juxi was convicted of corruption and ordered executed.',
    idiomatic: 'On wuzi Liu Juxi, protector of Nanhai, was convicted of corruption and executed.',
  },
  s0321: {
    literal: 'In the sixth month, another stalk of jade fungus grew in the Datong Hall.',
    idiomatic: 'In the sixth month another jade fungus sprouted in the Datong Hall.',
  },
  s0322: {
    literal: 'Longyou military commissioner Geshu Han attacked the Tibetan Stone Fortress City and took it.',
    idiomatic: 'Geshu Han, commissioner of Longyou, stormed the Tibetan Stone Fortress and took it.',
  },
  s0323: {
    literal: 'On the intercalary jichou, Stone Fortress City was renamed Divine Martial Army.',
    idiomatic: 'On intercalary jichou Stone Fortress was renamed Divine Martial Army.',
  },
  s0324: {
    literal: 'At Suomo River in Jiannan a new protectorate was established; it should take the name Baoning.',
    idiomatic: 'A new protectorate on the Suomo in Jiannan was to be called Baoning.',
  },
  s0325: {
    literal: 'On bingyin, the emperor personally visited the Grand Pure Palace and enfeoffed the sage ancestor the Mysterious Origin Emperor with the honorific Sage Ancestor Great Way Mysterious Origin Emperor.',
    idiomatic: 'On bingyin he visited the Grand Pure Palace in person and enfeoffed the sage ancestor as Sage Ancestor Great Way Mysterious Origin Emperor.',
  },
  s0326: {
    literal: 'Gaozu, Taizong, Gaozong, Zhongzong, and Ruizong, the five emperors, all had the words "Great Sage Emperor" added;',
    idiomatic: 'To Gaozu, Taizong, Gaozong, Zhongzong, and Ruizong was added the epithet Great Sage Emperor;',
  },
  s0327: {
    literal: 'Empresses Taimu, Wende, Zetian, Heside, and Zhao all had the words "Obedient Sage Empress" added.',
    idiomatic: 'to Empresses Taimu, Wende, Zetian, Heside, and Zhao, Obedient Sage Empress.',
  },
  s0328: {
    literal: 'The host of officials submitted the emperor\'s honorific as Emperor Kaiyuan Heaven-and-Earth Great Treasure Sacred-Cultured Divinely Martial Responsive-to-the-Way.',
    idiomatic: 'Officials offered the emperor the title Kaiyuan Heaven-and-Earth Great Treasure Sacred-Cultured Divinely Martial Responsive-to-the-Way.',
  },
  s0329: {
    literal: 'On dingmao, the emperor went to the Hall of Encompassing Primacy to receive the seal and granted a great amnesty throughout the empire.',
    idiomatic: 'On dingmao he received the seal in the Hall of Encompassing Primacy and proclaimed a great amnesty.',
  },
  s0330: {
    literal: 'Henceforth at each di and xia sacrifice the sequence of zhao and mu was to begin before the sage ancestor at the Grand Pure Palace.',
    idiomatic: 'Henceforth at every di and xia rite the zhao-mu order was to begin before the sage ancestor in the Grand Pure Palace.',
  },
  s0331: {
    literal: 'Earlier, the Taibai Mountain man Li Hun said that in the Golden Star Grotto of Taibai Mountain there was a jade plaque stone record of the emperor\'s fortune and longevity; when it was obtained, Taibai Mountain was enfeoffed as Duke of Divine Response, the Golden Star Grotto as Duke of Auspicious Blessing, and the Huayang county under its jurisdiction as Zhenfu county.',
    idiomatic: 'Earlier Li Hun of Taibai Mountain had claimed a jade plaque in the Golden Star Grotto foretelling imperial fortune and long life; when it was found, Taibai was enfeoffed Duke of Divine Response, the grotto Duke of Auspicious Blessing, and Huayang county renamed Zhenfu.',
  },
  s0332: {
    literal: 'On wuchen, heir apparent grand tutor and Duke of Xu Xiao Song died.',
    idiomatic: 'On wuchen Xiao Song, heir apparent grand tutor and Duke of Xu, died.',
  },
  s0333: {
    literal: 'On dinghai, the southern yamen standing horses should cease; the office supplying horses was reduced.',
    idiomatic: 'On dinghai the southern yamen\'s parade horses were abolished and the horse-supply office cut back.',
  },
  s0334: {
    literal: 'On wuzi of the eighth autumn month, commandery vice-prefects should cease; in lower commanderies a chief administrator was to be set.',
    idiomatic: 'On wuzi of the eighth autumn month commandery vice-prefects were abolished; lower commanderies were given chief administrators instead.',
  },
  s0335: {
    literal: 'On bingyin of the tenth winter month, he went to Huaqing Palace.',
    idiomatic: 'On bingyin of the tenth winter month he went to Huaqing Palace.',
  },
  s0336: {
    literal: 'On dingsi of the eleventh month, he visited the estate of censor-in-chief Yang Zhao.',
    idiomatic: 'On dingsi of the eleventh month he visited the manor of Yang Zhao, censor-in-chief.',
  },
  s0337: {
    literal: 'On the new moon of gengyin, first month of Tianbao 9, the new moon coincided with the year\'s beginning; he received court at Huaqing Palace.',
    idiomatic: 'On the gengyin new moon of the first month of Tianbao 9 the year began with the new moon; he held court at Huaqing Palace.',
  },
  s0338: {
    literal: 'On jihai, he returned to the capital.',
    idiomatic: 'On jihai he returned to the capital.',
  },
  s0339: {
    literal: 'On gengxu, the host of officials requested enfeoffing the western sacred mountain; permission was granted.',
    idiomatic: 'On gengxu officials petitioned to enfeoff the western sacred mountain; he assented.',
  },
  s0340: {
    literal: 'On renwu of the second month, censor-in-chief Song Hun was convicted of corruption and debauchery and exiled far to Gaoyao commandery.',
    idiomatic: 'On renwu of the second month Song Hun, censor-in-chief, was convicted of corruption and debauchery and exiled to Gaoyao.',
  },
  s0341: {
    literal: 'On gengxu of the third month, the Petition Box commissioner was renamed Petition Presenter.',
    idiomatic: 'On gengxu of the third month the Petition Box commissioner was retitled Petition Presenter.',
  },
  s0342: {
    literal: 'On xinhai, the western sacred mountain temple burned.',
    idiomatic: 'On xinhai the western sacred mountain temple burned.',
  },
  s0343: {
    literal: 'Because drought had long continued, an edict halted enfeoffing the western sacred mountain.',
    idiomatic: 'With drought unbroken, an edict suspended the western mountain enfeoffment.',
  },
  s0344: {
    literal: 'On gengyin of the fifth summer month, because of drought, prisoners were recorded.',
    idiomatic: 'On gengyin of the fifth summer month prisoners were reviewed because of drought.',
  },
  s0345: {
    literal: 'On yimao, An Lushan was advanced to Prince of Dongping commandery.',
    idiomatic: 'On yimao An Lushan was created Prince of Dongping commandery.',
  },
  s0346: {
    literal: 'Enfeoffing a military commissioner as prince began from this.',
    idiomatic: 'The enfeoffment of a frontier commissioner as prince began here.',
  },
  s0347: {
    literal: 'On jihai of the seventh autumn month, the Directorate of Education established the Broad Culture Hall for students pursuing the jinshi degree.',
    idiomatic: 'On jihai of the seventh autumn month the Directorate of Education opened the Broad Culture Hall for jinshi candidates.',
  },
  s0348: {
    literal: 'On yimao of the ninth month, the recluse Cui Chang submitted the Cyclical Record of the Five Phases in Accord with Fortune, arguing that the state should inherit Zhou and Han and requesting abolition of Zhou and Sui as unfit to remain among the two former dynasties honored after abdication.',
    idiomatic: 'On yimao of the ninth month the recluse Cui Chang submitted his Cyclical Record of the Five Phases, urging that Tang inherit Zhou and Han and that Zhou and Sui be struck from the two honored former dynasties.',
  },
  s0349: {
    literal: 'On gengyin of the eleventh winter month, he went to Huaqing Palace.',
    idiomatic: 'On gengyin of the eleventh winter month he went to Huaqing Palace.',
  },
  s0350: {
    literal: 'On jichou, an edict ordered that henceforth presentation to the Grand Pure Palace and the Imperial Ancestral Temple be changed to court presentation, tomb visitation to court visitation, notification to the ancestral temple to memorial, and the texts of heaven-and-earth sacrifices changed from "proclamation" to "recommendation"—because "proclamation" implies looking down on those below.',
    idiomatic: 'On jichou an edict renamed ritual language: offerings at the Grand Pure Palace and Imperial Temple became "court presentation," tomb rites "court visitation," temple notices "memorial," and heaven-and-earth texts "recommendation" instead of "proclamation," since proclamation smacked of condescension.',
  },
  s0351: {
    literal: 'On xinmao, he visited Yang Guozhong\'s pavilion.',
    idiomatic: 'On xinmao he visited Yang Guozhong\'s pavilion.',
  },
  s0352: {
    literal: 'On xinchou, temples to King Wu of Zhou and Emperor Gaozu of Han were established in the capital, with officials appointed to tend them.',
    idiomatic: 'On xinchou temples to King Wu of Zhou and Han Gaozu were built in the capital, each with its own staff.',
  },
  s0353: {
    literal: 'On yihai of the twelfth month, he returned to the capital.',
    idiomatic: 'On yihai of the twelfth month he returned to the capital.',
  },
  s0354: {
    literal: 'On yiyou, new moon of the first spring month of Tianbao 10.',
    idiomatic: 'On the yiyou new moon of the first spring month of Tianbao 10.',
  },
  s0355: {
    literal: 'On renchen, court presentation was made at the Grand Pure Palace.',
    idiomatic: 'On renchen he made court presentation at the Grand Pure Palace.',
  },
  s0356: {
    literal: 'On guisi, court offering was made at the Imperial Ancestral Temple.',
    idiomatic: 'On guisi he made court offering at the Imperial Ancestral Temple.',
  },
  s0357: {
    literal: 'On jiawu, the southern suburban rite was performed, with heaven and earth sacrificed together; when the rites were finished, a great amnesty was granted throughout the empire.',
    idiomatic: 'On jiawu he sacrificed to heaven and earth together at the southern suburb; when the rites ended he proclaimed a great amnesty.',
  },
  s0358: {
    literal: 'Inner palace attendants were placed at the Imperial Temple to sweep the various mausoleums.',
    idiomatic: 'Palace women were assigned to the Imperial Temple to tend sweeping at the imperial tombs.',
  },
  s0359: {
    literal: 'On jihai, the transmission seal of state was renamed the Seal of Receiving Heaven\'s Great Treasure.',
    idiomatic: 'On jihai the dynastic transmission seal was renamed Seal of Receiving Heaven\'s Great Treasure.',
  },
  s0360: {
    literal: 'On dingwei, Li Linfu took the concurrent posts of vice grand protector of Anbei and Shuofang military commissioner.',
    idiomatic: 'On dingwei Li Linfu added the posts of Anbei vice grand protector and Shuofang military commissioner.',
  },
  s0361: {
    literal: 'On gengxu, great winds; transport boats at Shan commandery caught fire, burning more than two hundred grain ships, and about five hundred people died.',
    idiomatic: 'On gengxu gales set fire to grain transports at Shan commandery, destroying more than two hundred ships and killing some five hundred people.',
  },
  s0362: {
    literal: 'On guichou, thirteen men including successor Prince of Wu Zhi were separately dispatched to sacrifice at the mountains, rivers, seas, and guardian shrines.',
    idiomatic: 'On guichou thirteen princes, including successor Prince of Wu Zhi, were sent out to sacrifice at the sacred mountains, rivers, seas, and guardian deities.',
  },
  s0363: {
    literal: 'On dingsi of the second month, An Lushan also became Yunzhong protector and Hedong military commissioner.',
    idiomatic: 'On dingsi of the second month An Lushan added Yunzhong protector and Hedong military commissioner.',
  },
  s0364: {
    literal: 'In the fourth summer month, Jiannan military commissioner Xianyu Zhongtong led sixty thousand troops to attack Yunnan and fought King Piluoge of Yunnan at Luzhou; the government army was greatly defeated, and those drowned in the Lu River were beyond counting.',
    idiomatic: 'In the fourth summer month Xianyu Zhongtong of Jiannan marched sixty thousand men against Yunnan and met King Piluoge at Luzhou; the army was shattered and countless men drowned in the Lu.',
  },
  s0365: {
    literal: 'On dinghai of the fifth month, banners of the guard units that were crimson were changed to red-yellow to accord with the earth phase.',
    idiomatic: 'On dinghai of the fifth month guard banners that had been crimson were changed to red-yellow for the earth phase.',
  },
  s0366: {
    literal: 'On yimao of the eighth autumn month, great winds at Guangling commandery; tidal waves overturned several thousand ships.',
    idiomatic: 'On yimao of the eighth autumn month gales at Guangling overturned several thousand ships in the tide.',
  },
  s0367: {
    literal: 'On bingchen, the capital armory burned; forty-seven myriad pieces of equipment were destroyed.',
    idiomatic: 'On bingchen the capital armory burned, destroying forty-seven myriads of weapons and gear.',
  },
  s0368: {
    literal: 'That autumn, rain fell for successive ten-day periods; many walls and houses collapsed, especially in the western capital.',
    idiomatic: 'That autumn rain fell for weeks on end; walls and houses collapsed everywhere, worst in the western capital.',
  },
  s0369: {
    literal: 'On xinhai of the tenth winter month, he went to Huaqing Palace.',
    idiomatic: 'On xinhai of the tenth winter month he went to Huaqing Palace.',
  },
  s0370: {
    literal: 'On yiwei of the eleventh month, he visited Yang Guozhong\'s residence.',
    idiomatic: 'On yiwei of the eleventh month he visited Yang Guozhong\'s home.',
  },
  s0371: {
    literal: 'On bingwu, vice minister of war and concurrent censor-in-chief Yang Guozhong also became Jiannan military commissioner.',
    idiomatic: 'On bingwu Yang Guozhong, vice minister of war and censor-in-chief, added Jiannan military commissioner.',
  },
  s0372: {
    literal: 'On xinhai of the first spring month of Tianbao 11, he returned to the capital.',
    idiomatic: 'On xinhai of the first spring month of Tianbao 11 he returned to the capital.',
  },
  s0373: {
    literal: 'On guiyou of the second month, debased coin was forbidden; the government issued good coin to exchange for it.',
    idiomatic: 'On guiyou of the second month debased coin was banned and the treasury issued good cash in exchange.',
  },
  s0374: {
    literal: 'Soon merchants found it inconvenient and appealed to Guozhong; the measure was then stopped.',
    idiomatic: 'Merchants soon complained to Guozhong of hardship, and the exchange was halted.',
  },
  s0375: {
    literal: 'In the third month, Shuofang deputy military commissioner and Prince of Fengxin Abu Si joined An Lushan in campaigning against the Khitan; Si and Lushan did not agree, and he led his followers in rebellion back to the northern desert.',
    idiomatic: 'In the third month Abu Si, Shuofang deputy commissioner and Prince of Fengxin, marched with An Lushan against the Khitan; when the two quarreled Si led his men in revolt back to the northern steppe.',
  },
  s0376: {
    literal: 'On bingwu, an edict ordered that henceforth on each new and full moon offerings should be set out in the Imperial Temple, one tray per chamber, and every five days the chamber doors should open for sweeping.',
    idiomatic: 'On bingwu an edict required offerings at the Imperial Temple on every new and full moon, one tray per chamber, with doors opened every five days for sweeping.',
  },
  s0377: {
    literal: 'The Ministry of Personnel was renamed Ministry of Letters; Ministry of War, Ministry of Martial Affairs; Ministry of Punishments, Ministry of Law; bureaus within whose names bore the character for "ministry" were likewise changed; Director and Vice Director of Palace Construction were renamed Grand and Vice Supervisor.',
    idiomatic: 'Personnel became the Ministry of Letters, War the Ministry of Martial Affairs, Punishments the Ministry of Law; every bureau bearing bu in its title was renamed; the palace construction directors became grand and vice supervisors.',
  },
  s0378: {
    literal: 'In the fourth summer month, censor-in-chief and concurrent Jingzhao intendant Wang Hong was granted death, because his younger brother Chuan and the felon Xing Zan plotted rebellion.',
    idiomatic: 'In the fourth summer month Wang Hong, censor-in-chief and Jingzhao intendant, was granted death after his brother Chuan and the outlaw Xing Zan were found plotting rebellion.',
  },
  s0379: {
    literal: 'Yang Guozhong also became Jingzhao intendant.',
    idiomatic: 'Yang Guozhong also took Jingzhao intendant.',
  },
  s0380: {
    literal: 'On wushen of the fifth month, Prince of Qing Zong died and was posthumously created Jingde Crown Prince.',
    idiomatic: 'On wushen of the fifth month Prince of Qing Zong died and was posthumously created Jingde Crown Prince.',
  },
  s0381: {
    literal: 'On wuzi of the sixth month, great winds in the eastern capital uprooted trees and tore off roofs.',
    idiomatic: 'On wuzi of the sixth month gales at Luoyang uprooted trees and stripped roofs.',
  },
  s0382: {
    literal: 'On jichou of the eighth month, he visited the left treasury and granted silk to the host of officials in varying degrees.',
    idiomatic: 'On jichou of the eighth month he visited the left treasury and gave officials graded gifts of silk.',
  },
  s0383: {
    literal: 'On jiayin of the ninth month, the guard soldiers were renamed warriors.',
    idiomatic: 'On jiayin of the ninth month the guard regiments were renamed warriors.',
  },
  s0384: {
    literal: 'On wuyin of the tenth winter month, he went to Huaqing Palace.',
    idiomatic: 'On wuyin of the tenth winter month he went to Huaqing Palace.',
  },
  s0385: {
    literal: 'On yimao of the eleventh month, left vice director of the Department of State Affairs and concurrent right chancellor, Duke of Jin Li Linfu, died at the traveling palace.',
    idiomatic: 'On yimao of the eleventh month Li Linfu, left vice director and right chancellor, Duke of Jin, died at the traveling palace.',
  },
  s0386: {
    literal: 'On gengshen, censor-in-chief and concurrent prefect of Shujun Yang Guozhong became right chancellor and concurrent minister of letters.',
    idiomatic: 'On gengshen Yang Guozhong, censor-in-chief and prefect of Shujun, became right chancellor and minister of letters.',
  },
  s0387: {
    literal: 'On jiaxu of the twelfth month, Yang Guozhong memorialized that selections in the two capitals should fix retention and release on the day of evaluation, without the long roster.',
    idiomatic: 'On jiaxu of the twelfth month Yang Guozhong proposed that capital selections fix appointments the day candidates were evaluated, abolishing the long waiting list.',
  },
  s0388: {
    literal: 'On jihai, he returned to the capital.',
    idiomatic: 'On jihai he returned to the capital.',
  },
  s0389: {
    literal: 'On renzi of the first spring month of Tianbao 12, Yang Guozhong registered appointments at the Ministry of Personnel; when registration was finished, in the main hall he called the roll with the left chancellor and bureau heads.',
    idiomatic: 'On renzi of the first spring month of Tianbao 12 Yang Guozhong registered appointments at Personnel; when the list was done he called names in the main hall with the left chancellor and bureau chiefs.',
  },
  s0390: {
    literal: 'On gengchen of the second month, more than twenty selected men including Zheng Shen and others, because Guozhong\'s appointments had no backlog, set out a feast below the Qinzheng Hall and erected a stele at the Ministry of Personnel gate.',
    idiomatic: 'On gengchen more than twenty appointees led by Zheng Shen, finding Guozhong\'s registry left no one waiting, feasted below the Qinzheng Hall and raised a stele at the Personnel gate.',
  },
  s0391: {
    literal: 'On guimao, the posthumous stripping of the late right chancellor Li Linfu\'s offices held in life; his son, director of palace construction Xiu, and clansman Fudao and fifty others were all exiled and demoted—Guozhong had falsely memorialized that Linfu had secretly joined the rebel Hu Abu Si.',
    idiomatic: 'On guimao the court posthumously stripped Li Linfu of every rank he had held; his son Xiu, director of palace construction, kinsman Fudao, and fifty others were exiled—Guozhong had lied that Linfu had colluded with the rebel Abu Si.',
  },
  s0392: {
    literal: 'On yiyou of the fifth summer month, Wei, Zhou, and Sui were restored as the three honored former dynasties and two kings after abdication, and the marquises of Han, Jie, and Xi were re-enfeoffed.',
    idiomatic: 'On yiyou of the fifth summer month Wei, Zhou, and Sui were restored among the three honored former dynasties and two kings after abdication, and the marquises of Han, Jie, and Xi were re-created.',
  },
  s0393: {
    literal: 'On xinhai, the offices of the various mausoleums under the Imperial Temple were restored to the Grand Temple\'s jurisdiction.',
    idiomatic: 'On xinhai the mausoleum offices under the Imperial Temple were returned to the Grand Temple\'s control.',
  },
  s0394: {
    literal: 'On renzi of the seventh month, commoners throughout the empire might not present themselves for provincial recommendation; they had first to enter the Directorate of Education as students before qualifying for the examinations.',
    idiomatic: 'On renzi of the seventh month commoners nationwide were barred from direct provincial nomination; they had to enter the Directorate of Education before sitting for the examinations.',
  },
  s0395: {
    literal: 'In the eighth month, prolonged rain in the capital made rice dear; an order issued one hundred thousand bushels from the great granary to be sold cheaply to the poor.',
    idiomatic: 'In the eighth month endless rain drove rice prices up; the court released one hundred thousand bushels from the great granary at reduced price for the poor.',
  },
  s0396: {
    literal: 'The Zhongshu Menxia were also ordered to review prisoners at Jingzhao and the Court of Judicial Review.',
    idiomatic: 'Zhongshu Menxia were likewise ordered to review prisoners held by Jingzhao and the Court of Judicial Review.',
  },
  s0397: {
    literal: 'On the new moon of jihai of the ninth month, Longyou military commissioner and Duke of Liang Geshu Han was advanced to Prince of Xiping commandery with a substantive fief of five hundred households.',
    idiomatic: 'On the jihai new moon of the ninth month Geshu Han, commissioner of Longyou and Duke of Liang, was created Prince of Xiping with a fief of five hundred households.',
  },
  s0398: {
    literal: 'On wushen of the tenth winter month, he went to Huaqing Palace.',
    idiomatic: 'On wushen of the tenth winter month he went to Huaqing Palace.',
  },
  s0399: {
    literal: 'Thirteen thousand corvée households of the capital were hired to build the walls of Xingqing Palace and raise towers and pavilions.',
    idiomatic: 'Thirteen thousand capital corvée households were hired to wall Xingqing Palace and raise towers and galleries.',
  },
  s0400: {
    literal: 'By the twelfth month, Hengsai Fort was renamed Heavenly Virtue Army.',
    idiomatic: 'By the twelfth month Hengsai Fort had been renamed Heavenly Virtue Army.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/009.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 400;

function extractRange(chapterPath, startN, endN) {
  const data = JSON.parse(readFileSync(chapterPath, 'utf8'));
  const out = [];
  const seenIds = new Set();

  for (let blockIndex = 0; blockIndex < data.content.length; blockIndex++) {
    const block = data.content[blockIndex];
    let blockSentences = [];

    if (block.type === 'paragraph') {
      blockSentences = block.sentences;
    } else if (block.type === 'table_row') {
      blockSentences = block.cells.filter((cell) => cell.content && cell.content.trim());
    } else if (block.type === 'table_header') {
      blockSentences = block.sentences.filter((s) => s.zh && s.zh.trim());
    }

    for (const sentence of blockSentences) {
      const sentenceId = sentence.id;
      const n = parseInt(sentenceId.slice(1), 10);
      if (n < startN || n > endN) continue;

      let chineseText = '';
      if (block.type === 'paragraph' || block.type === 'table_header') {
        chineseText = sentence.zh;
      } else if (block.type === 'table_row') {
        chineseText = sentence.content;
      }

      let displayId = sentenceId;
      if (seenIds.has(displayId)) {
        displayId = `${sentenceId}@${blockIndex}`;
      }
      seenIds.add(displayId);

      out.push({
        id: displayId,
        originalId: sentenceId,
        blockIndex,
        chinese: chineseText,
        literal: '',
        idiomatic: '',
      });
    }
  }

  out.sort((a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10));
  return out;
}

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '009') {
  throw new Error(`Expected chapter 009, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);
const hasAll =
  trans.sentences.length >= END - START + 1 &&
  [...expectedIds].every((id) => trans.sentences.some((s) => (s.originalId || s.id) === id));

if (!hasAll) {
  const extracted = extractRange(chapterPath, START, END);
  const map = new Map(trans.sentences.map((s) => [s.originalId || s.id, s]));
  for (const s of extracted) {
    map.set(s.originalId, s);
  }
  trans.sentences = [...map.values()].sort(
    (a, b) => parseInt((a.originalId || a.id).slice(1), 10) - parseInt((b.originalId || b.id).slice(1), 10)
  );
}

let applied = 0;
for (const s of trans.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${key}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

const missing = [...expectedIds].filter(
  (id) => !trans.sentences.some((s) => (s.originalId || s.id) === id && s.idiomatic)
);
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log('Applied', applied, 'translations (s' + String(START).padStart(4, '0') + '–s' + String(END).padStart(4, '0') + ')');

