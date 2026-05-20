#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0201: {
    literal:
      'Heida fled north to the Turks with more than two hundred horsemen; all his followers were taken captive; Hebei was pacified.',
    idiomatic:
      'Liu Heida fled north to the Turks with some two hundred riders; his remaining forces were captured, and Hebei was pacified.',
  },
  s0202: {
    literal:
      'At that time Xu Yuanlang held out with arms in Xu and Yan, and the Prince of Qin turned his army back to attack and pacify him; thereafter all prefectures and counties along the Yellow, Ji, Yangzi, and Huai were pacified.',
    idiomatic:
      'Xu Yuanlang still held Xu and Yan with armed force; Taizong swung his army south, subdued him, and brought the Yellow, Ji, Yangzi, and Huai regions under control.',
  },
  s0203: {
    literal:
      'In the tenth month he was additionally made Grand General of the Left and Right Twelve Guards.',
    idiomatic:
      'In the tenth month he was made Grand General of the Left and Right Twelve Guards.',
  },
  s0204: {
    literal:
      'In the autumn of the seventh year, the Turk qaghans Jieli and Tuli entered from Yuanzhou to raid and harass Guanzhong.',
    idiomatic:
      'That autumn the Turk qaghans Jieli and Tuli invaded from Yuanzhou and raided Guanzhong.',
  },
  s0205: {
    literal:
      'Someone told Gaozu: "It is only because the treasury and women and children are in the capital that the Turks come. If Chang\'an were burned and the capital abandoned, the barbarian raiders would stop of themselves.',
    idiomatic:
      'An adviser told Gaozu: "The Turks come only because the treasury and the court\'s families are in Chang\'an. Burn the city, move the capital, and the raids will end on their own.',
  },
  s0206: {
    literal:
      '" Gaozu thereupon sent Vice Director of the Secretariat Yuwen Shiji to survey habitable lands south of the mountains, intending at once to move the capital.',
    idiomatic:
      '" Gaozu sent Secretariat Vice Director Yuwen Shiji to scout habitable country south of the Qinling range and prepared to move the capital at once.',
  },
  s0207: {
    literal:
      'Xiao Yu and others all considered it wrong, but in the end none dared remonstrate to his face.',
    idiomatic:
      'Xiao Yu and the others all opposed the plan, yet none dared speak bluntly to the Emperor\'s face.',
  },
  s0208: {
    literal:
      'The Prince of Qin alone said: "Huo Qubing was only a commander of the Han court, yet he aspired to destroy the Xiongnu.',
    idiomatic:
      'Taizong alone replied: "Huo Qubing was merely a Han general, yet he set his heart on destroying the Xiongnu.',
  },
  s0209: {
    literal:
      'I, unworthy though I am placed in the ranks of the princes, have still allowed the dust of the barbarians to rise unceasingly, until Your Majesty debates moving the capital — this is my fault.',
    idiomatic:
      'I hold a prince\'s commission, yet barbarian dust still clouds the frontier and Your Majesty must even consider abandoning Chang\'an — the fault is mine.',
  },
  s0210: {
    literal:
      'I beg you to allow me to exert what little strength I have once more and take that Jieli.',
    idiomatic:
      'Grant me one more chance to prove myself and I will bring you Jieli\'s head.',
  },
  s0211: {
    literal:
      'If within a year or two I do not have him by the neck, then by slow steps consider a plan to move the capital — I shall not dare speak again."',
    idiomatic:
      'If I fail to collar him within a year or two, then discuss relocation at leisure — and I will never raise the matter again."',
  },
  s0212: {
    literal:
      'Gaozu was angry, but still sent the Prince of Qin with thirty-odd riders on a reconnaissance raid.',
    idiomatic:
      'Gaozu was furious, yet still sent Taizong with a few dozen horsemen on a probing strike.',
  },
  s0213: {
    literal:
      'On the day he returned, he firmly memorialized that the capital must under no circumstances be moved, and Gaozu thereupon stopped.',
    idiomatic:
      'When he returned he memorialized again that the capital must not be moved, and Gaozu abandoned the plan.',
  },
  s0214: {
    literal: 'In the eighth year he was additionally made Director of the Secretariat.',
    idiomatic: 'In the eighth year he was appointed Director of the Secretariat.',
  },
  s0215: {
    literal:
      'In the ninth year of Wude, Crown Prince Jiancheng and Prince of Qi Yuanji plotted to harm the Prince of Qin.',
    idiomatic:
      'In the ninth year of Wude, Crown Prince Li Jiancheng and Prince of Qi Li Yuanji plotted to kill Taizong.',
  },
  s0216: {
    literal:
      'On the fourth day of the sixth month the Prince of Qin led Zhangsun Wuji, Yuchi Jingde, Fang Xuanling, Du Ruhui, Yuwen Shiji, Gao Shilian, Hou Junji, Cheng Zhijie, Qin Shubao, Duan Zhixuan, Qu Tu Tong, Zhang Shigui, and others at the Xuanwu Gate to execute them.',
    idiomatic:
      'On the fourth day of the sixth month Taizong led Zhangsun Wuji, Yuchi Jingde, Fang Xuanling, Du Ruhui, Yuwen Shiji, Gao Shilian, Hou Junji, Cheng Zhijie, Qin Shubao, Duan Zhixuan, Qu Tu Tong, Zhang Shigui, and others to ambush and kill them at the Xuanwu Gate.',
  },
  s0217: {
    literal:
      'On jiazi he was installed as crown prince, and all routine government was decided by him.',
    idiomatic:
      'On jiazi he was named crown prince and took charge of daily administration.',
  },
  s0218: {
    literal:
      'The Prince of Qin then released the hawks and hounds raised in the forbidden park, halted all rare curios submitted from the regions, inclined government toward simplicity and severity, and all under Heaven rejoiced greatly.',
    idiomatic:
      'He freed the hunting birds and dogs kept in the imperial park, stopped exotic tribute from the provinces, governed with austere simplicity, and the realm rejoiced.',
  },
  s0219: {
    literal:
      'He also ordered the hundred officials each to submit sealed memorials setting forth fully the essentials of settling the people and governing the state.',
    idiomatic:
      'He also ordered every official to submit sealed memorials on how to settle the people and govern the realm.',
  },
  s0220: {
    literal:
      'On jisi an edict said: "According to ritual, taboo on double personal names is not applied to a single character.',
    idiomatic:
      'On jisi an edict declared: "By classical rite, a two-character personal name is not tabooed when only one character appears.',
  },
  s0221: {
    literal:
      'In recent times both characters have been avoided together, and many words have been abandoned — acting as inclination leads violates the classics.',
    idiomatic:
      'Lately both characters have been avoided everywhere, countless words have been lost, and custom has departed from the canon.',
  },
  s0222: {
    literal:
      'In official titles, personal names, and public and private documents, wherever the two characters Shimin are not consecutive, avoidance is not required.',
    idiomatic:
      'In titles, names, and public or private writing, wherever the characters for Shimin do not stand together, no avoidance is required.',
  },
  s0223: {
    literal: '" The Youzhou Metropolitan Protectorate was abolished.',
    idiomatic: 'The Youzhou metropolitan protectorate was abolished.',
  },
  s0224: {
    literal:
      'On xinwei the Shaanxi East Circuit Grand Secretariat was abolished and a Luozhou Protectorate established; the Yizhou Circuit mobile secretariat was abolished and a Yizhou Metropolitan Protectorate established.',
    idiomatic:
      'On xinwei the Shaanxi east circuit headquarters was dissolved and a Luozhou protectorate set up; the Yizhou circuit headquarters was dissolved and a Yizhou metropolitan protectorate set up.',
  },
  s0225: {
    literal:
      'On renwu Prince Yuan of Lujiang, Metropolitan Protector of Youzhou, plotted rebellion and was degraded to commoner status.',
    idiomatic:
      'On renwu Li Yuan of Lujiang, metropolitan protector of Youzhou, plotted rebellion and was reduced to commoner rank.',
  },
  s0226: {
    literal: 'On yiyou the Celestial-Strategy Office was abolished.',
    idiomatic: 'On yiyou the Celestial-Strategy headquarters was abolished.',
  },
  s0227: {
    literal:
      'On renchen of the seventh month Senior Advisor to the Crown Prince Gao Shilian became Palace Attendant; Junior Advisor Fang Xuanling became Director of the Secretariat; Right Vice Director of the Masters of Writing Xiao Yu became Left Vice Director; Minister of Personnel Yang Gongren became Prefect of Yongzhou; Senior Advisor Zhangsun Wuji became Minister of Personnel; Junior Advisor Du Ruhui became Minister of War; Grand Steward of the Heir Apparent Yuwen Shiji became Director of the Secretariat; Feng Deyi became Right Vice Director of the Masters of Writing.',
    idiomatic:
      'On renchen of the seventh month Gao Shilian moved from senior adviser to the heir to Palace Attendant; Fang Xuanling from junior adviser to Secretariat Director; Xiao Yu from right to left vice director of the Masters of Writing; Yang Gongren from Minister of Personnel to Yongzhou prefect; Zhangsun Wuji to Minister of Personnel; Du Ruhui to Minister of War; Yuwen Shiji to Secretariat Director; and Feng Deyi to right vice director.',
  },
  s0228: {
    literal:
      'On guihai of the eighth month Gaozu transmitted the throne to the crown prince; the Prince of Qin took the throne at the Xiande Hall of the Eastern Palace.',
    idiomatic:
      'On guihai of the eighth month Gaozu abdicated in favor of the crown prince; Taizong ascended the throne in the Xiande Hall of the Eastern Palace.',
  },
  s0229: {
    literal:
      'He sent Minister of Works, Duke of Wei Pei Ji with a firewood offering to report at the southern suburb.',
    idiomatic:
      'He dispatched Pei Ji, Duke of Wei and Minister of Works, to offer firewood at the southern altar and announce the succession to Heaven.',
  },
  s0230: {
    literal: 'A general amnesty was proclaimed throughout the realm.',
    idiomatic: 'The court proclaimed a general amnesty.',
  },
  s0231: {
    literal:
      'All persons exiled by sentence according to aggravated circumstances since the first year of Wude were released and sent home.',
    idiomatic:
      'Everyone exiled on aggravated charges since the first year of Wude was pardoned and sent home.',
  },
  s0232: {
    literal:
      'Civil and military officials of the fifth rank and above who previously had no noble rank were granted one step of rank; those of the sixth rank and below received one grade of merit.',
    idiomatic:
      'Officials of fifth rank and above without titles received a noble rank; those of sixth rank and below received an extra grade of merit.',
  },
  s0233: {
    literal: 'Throughout the realm taxes were remitted for one year.',
    idiomatic: 'Taxes were waived empire-wide for one year.',
  },
  s0234: {
    literal: 'On guiyou more than three thousand palace women of the Inner Quarters were released.',
    idiomatic: 'On guiyou more than three thousand women of the inner palace were freed.',
  },
  s0235: {
    literal: 'On jiaxu the Turk qaghans Jieli and Tuli raided Jing Prefecture.',
    idiomatic: 'On jiaxu the Turk qaghans Jieli and Tuli attacked Jingzhou.',
  },
  s0236: {
    literal:
      'On yihai the Turks pressed on to raid Wugong; the capital was placed under alert.',
    idiomatic:
      'On yihai the Turks advanced on Wugong and Chang\'an was placed under martial alert.',
  },
  s0237: {
    literal: 'On bingzi Consort Changsun was installed as empress.',
    idiomatic: 'On bingzi Lady Changsun was enthroned as empress.',
  },
  s0238: {
    literal: 'On jimao the Turks raided Gaoling Prefecture.',
    idiomatic: 'On jimao the Turks struck Gaoling.',
  },
  s0239: {
    literal:
      'On xinsi Campaign Commander Yuchi Jingde fought the Turks at Jingyang, routed them greatly, and beheaded more than a thousand.',
    idiomatic:
      'On xinsi Yuchi Jingde, campaign commander, met the Turks at Jingyang, crushed them, and took more than a thousand heads.',
  },
  s0240: {
    literal:
      'On guiwei Jieli reached the north bank of the Bian Bridge on the Wei River, sent his chieftain Zhishi Sili to court on reconnaissance and displayed his forces openly; the Emperor ordered him imprisoned.',
    idiomatic:
      'On guiwei Jieli camped north of the Bian Bridge on the Wei; he sent the chieftain Zhishi Sili to court as a spy and paraded his strength — the Emperor had him seized.',
  },
  s0241: {
    literal:
      'In person he went out the Xuanwu Gate, galloped with six riders to the Wei River, spoke with Jieli across the ford, and reproached him for breaking faith.',
    idiomatic:
      'He rode out the Xuanwu Gate himself with six horsemen to the Wei, hailed Jieli across the water, and rebuked him for breaking treaty.',
  },
  s0242: {
    literal:
      'Before long the main armies arrived; Jieli saw the troops already strong and knew Zhishi Sili had been detained; he was greatly afraid and sued for peace; an edict permitted it.',
    idiomatic:
      'Soon the main forces came up; seeing their array and learning his envoy was held, Jieli was terrified and sued for peace, which the Emperor granted.',
  },
  s0243: {
    literal: 'That same day he returned to the palace.',
    idiomatic: 'That day he returned to the palace.',
  },
  s0244: {
    literal:
      'On yiyou he again visited Bian Bridge; with Jieli he cut a white horse and established alliance; the Turks withdrew.',
    idiomatic:
      'On yiyou he returned to the Bian Bridge, slew a white horse with Jieli to seal a pact, and the Turks withdrew.',
  },
  s0245: {
    literal:
      'On bingxu Jieli presented three thousand horses and ten thousand sheep; the Emperor did not accept them and ordered Jieli to return the Chinese households he had seized.',
    idiomatic:
      'On bingxu Jieli offered three thousand horses and ten thousand sheep; the Emperor refused the gift and demanded the return of captured Chinese subjects.',
  },
  s0246: {
    literal:
      'On dingwei he summoned the cavalry commanders of the guards to practice archery in the courtyard of the Xiande Hall and said to the generals and below: "From antiquity the Turks and China have each known rise and decline.',
    idiomatic:
      'On dingwei he gathered the guard cavalry officers for archery drill in the Xiande Hall courtyard and told the commanders: "Turks and China have waxed and waned since antiquity.',
  },
  s0247: {
    literal:
      'When the Yellow Emperor well employed the five weapons, he was able to drive the Xianyun north;',
    idiomatic:
      'When the Yellow Emperor mastered the five arms, he drove the Xianyun north;',
  },
  s0248: {
    literal:
      'when King Xuan of Zhou deployed the Fang and Shao, he too could prevail over Taiyuan.',
    idiomatic:
      'when King Xuan of Zhou sent Fang and Shao, he too mastered the north.',
  },
  s0249: {
    literal:
      'Down through the Han and Jin rulers to the Sui, they did not keep soldiers trained in arms; when the Turks came they could not resist, and the living people of China were smeared by the raiders\' hands.',
    idiomatic:
      'From Han and Jin through Sui, rulers let arms training lapse; when Turks struck, China could not defend herself, and her people paid in blood.',
  },
  s0250: {
    literal:
      'I now will not have you dig pools and build parks or make all manner of wasteful expense; farmers I leave to their ease, and soldiers I have practice only bow and horse — I intend that you fight in battle, and I hope that before you no enemy stands athwart your path.',
    idiomatic:
      'I will not have you dig parks or squander treasure; farmers may rest while soldiers train only with bow and horse — I mean you to fight, and I expect no foe to stand before you.',
  },
  s0251: {
    literal:
      '" Thereafter each day he led several hundred men before the hall to teach archery; the Emperor personally tested them, and those who hit the mark were rewarded with bows, blades, cloth, and silk.',
    idiomatic:
      '" Each day thereafter he drilled several hundred men in archery before the hall, tested them himself, and rewarded hits with bows, blades, cloth, and silk.',
  },
  s0252: {
    literal:
      'Many court ministers remonstrated, saying: "The former kings made law: whoever brought weapons to the imperial precinct was punished — thus to nip evil in the bud and guard against the unforeseen.',
    idiomatic:
      'Courtiers objected: "Ancient law punished anyone who brought arms to the throne room — a guard against sudden harm.',
  },
  s0253: {
    literal:
      'Now you lead common soldiers to draw bows beside the palace steps while Your Majesty stands among them — we fear harm may come from an unexpected quarter; this is not planning for the altars of soil and grain."',
    idiomatic:
      'Now common soldiers bend bows on the palace steps while Your Majesty stands among them — disaster may come from nowhere; this does not secure the dynasty."',
  },
  s0254: {
    literal: '" The Emperor did not accept it.',
    idiomatic: 'The Emperor would not listen.',
  },
  s0255: {
    literal: 'From this time forward the soldiers all became elite troops.',
    idiomatic: 'From then on the army became a corps of veterans.',
  },
  s0256: {
    literal:
      'On renzi an edict said: "Private persons must not presumptuously set up demonic spirits or establish improper sacrifices; all prayers outside ritual are utterly forbidden.',
    idiomatic:
      'On renzi an edict forbade private cults to rogue spirits, illicit shrines, and all prayer outside orthodox rite.',
  },
  s0257: {
    literal:
      'Beyond the tortoise and the Changes and the Five Omens, all miscellaneous divination was also stopped.',
    idiomatic:
      'Divination beyond the tortoise, the Changes, and the Five Omens was likewise banned.',
  },
  s0258: {
    literal:
      'Zhangsun Wuji was enfeoffed Duke of Qi, Fang Xuanling Duke of Xing, Yuchi Jingde Duke of Wu, Du Ruhui Duke of Cai, and Hou Junji Duke of Lu.',
    idiomatic:
      'Zhangsun Wuji was created Duke of Qi, Fang Xuanling Duke of Xing, Yuchi Jingde Duke of Wu, Du Ruhui Duke of Cai, and Hou Junji Duke of Lu.',
  },
  s0259: {
    literal:
      'In the tenth winter month, on bingchen the first day of the month, there was a solar eclipse.',
    idiomatic:
      'On bingchen, the first day of the tenth winter month, the sun was eclipsed.',
  },
  s0260: {
    literal:
      'On guihai Prince Chengqian of Zhongshan was installed as crown prince.',
    idiomatic:
      'On guihai Li Chengqian, Prince of Zhongshan, was named crown prince.',
  },
  s0261: {
    literal:
      'On guiyou Pei Ji received a permanent fief of one thousand five hundred households; Zhangsun Wuji, Wang Junguo, Yuchi Jingde, Fang Xuanling, and Du Ruhui one thousand three hundred each; Zhangsun Shunde, Chai Shao, Luo Yi, and Prince of Zhao Commandery Xiaogong one thousand two hundred each; Hou Junji, Zhang Gongjin, and Liu Shili one thousand each; Li Shiji and Liu Hongji nine hundred each; Gao Shilian, Yuwen Shiji, Qin Shubao, and Cheng Zhijie seven hundred each; An Xinggui, An Xiuren, Tang Jian, Dou Gui, Qu Tu Tong, Xiao Yu, Feng Deyi, and Liu Yijie six hundred each; Qian Jiulong, Fan Shixing, Gongsun Wuda, Li Mengchang, Duan Zhixuan, Pang Qingyun, Zhang Liang, Li Yaoshi, Du Yan, and Yuan Zhongwen four hundred each; Zhang Changsun, Zhang Pinggao, Li Anyuan, Li Zihe, Qin Xingshi, and Ma Sanbao three hundred each.',
    idiomatic:
      'On guiyou permanent fiefs were granted: Pei Ji fifteen hundred households; Zhangsun Wuji, Wang Junguo, Yuchi Jingde, Fang Xuanling, and Du Ruhui thirteen hundred each; Zhangsun Shunde, Chai Shao, Luo Yi, and Prince Xiaogong of Zhao twelve hundred each; Hou Junji, Zhang Gongjin, and Liu Shili one thousand each; Li Shiji and Liu Hongji nine hundred each; Gao Shilian, Yuwen Shiji, Qin Shubao, and Cheng Zhijie seven hundred each; An Xinggui, An Xiuren, Tang Jian, Dou Gui, Qu Tu Tong, Xiao Yu, Feng Deyi, and Liu Yijie six hundred each; Qian Jiulong, Fan Shixing, Gongsun Wuda, Li Mengchang, Duan Zhixuan, Pang Qingyun, Zhang Liang, Li Yaoshi, Du Yan, and Yuan Zhongwen four hundred each; and Zhang Changsun, Zhang Pinggao, Li Anyuan, Li Zihe, Qin Xingshi, and Ma Sanbao three hundred each.',
  },
  s0262: {
    literal:
      'On gengyin of the eleventh month princes of the imperial clan enfeoffed as commandery kings were all reduced to county marquises.',
    idiomatic:
      'On gengyin of the eleventh month imperial princes holding commandery-king titles were demoted to county marquises.',
  },
  s0263: {
    literal: 'On guiyou of the twelfth month he personally reviewed prisoners.',
    idiomatic: 'On guiyou of the twelfth month he reviewed prisoners in person.',
  },
  s0264: {
    literal:
      'That year Silla, Kucha, the Turks, Goguryeo, Baekje, and the Tangut all sent envoys with tribute.',
    idiomatic:
      'That year Silla, Kucha, the Turks, Goguryeo, Baekje, and the Tangut presented tribute missions.',
  },
  s0265: {
    literal:
      'In the first year of Zhenguan, in the spring of the first month, on yiyou, the era name was changed.',
    idiomatic:
      'In the first year of Zhenguan, on yiyou of the first spring month, the reign title was changed.',
  },
  s0266: {
    literal:
      'On xinchou Prince Yi of Yan Commandery seized Jing Prefecture in rebellion; before long he was beheaded by his own attendants and his head sent to the capital.',
    idiomatic:
      'On xinchou Li Yi, Prince of Yan Commandery, rebelled at Jingzhou; his own guards soon killed him and sent his head to Chang\'an.',
  },
  s0267: {
    literal:
      'On gengwu the Vice Director Pei Gui was made Metropolitan Protector of Yizhou.',
    idiomatic:
      'On gengwu Pei Gui, Vice Director of the Masters of Writing, was appointed metropolitan protector of Yizhou.',
  },
  s0268: {
    literal: 'On guisi of the third month the empress personally performed the sericulture rite.',
    idiomatic: 'On guisi of the third month the empress led the spring silkworm ceremony.',
  },
  s0269: {
    literal:
      'Left Vice Director of the Masters of Writing, Duke of Song Xiao Yu became Junior Tutor to the crown prince.',
    idiomatic:
      'Xiao Yu, Duke of Song and left vice director of the Masters of Writing, became junior tutor to the crown prince.',
  },
  s0270: {
    literal:
      'On bingwu an edict said: "Cui Jishu, former Vice Director of the Masters of Writing of Qi; Guo Zun, Gentleman Attendant of the Yellow Gate; and Feng Xiaoyan, Right Assistant Director of the Masters of Writing — in former days they served Ye, held eminent name and office, cherished loyal remonstrance in their hearts, and submitted forthright memorials; they could not save their state from ruin and met the cruel fate of Long Feng.',
    idiomatic:
      'On bingwu an edict recalled Cui Jishu, Guo Zun, and Feng Xiaoyan of Northern Qi — men of high office who spoke truth to power at Ye, could not save their state, and died like Long Feng.',
  },
  s0271: {
    literal:
      'Their sons Gang, Yun, and Junzun, because their houses suffered the calamity of the times, were struck by excessive punishment.',
    idiomatic:
      'Their sons Cui Gang, Guo Yun, and Feng Junzun had suffered exile and harsh punishment with their families.',
  },
  s0272: {
    literal:
      'They should receive special reward beyond the usual rule; they may be released from palace service and appointed according to their talents.',
    idiomatic:
      'They were to be honored beyond ordinary measure, released from menial palace service, and given posts suited to their ability.',
  },
  s0273: {
    literal: '"',
    idiomatic: 'Thus ran the edict.',
  },
  s0274: {
    literal:
      'In the fourth summer month, on guisi, Liang Prefecture Protector, Prince of Changle Youliang was guilty and executed.',
    idiomatic:
      'In the fourth summer month, on guisi, Li Youliang, Prince of Changle and protector of Liangzhou, was executed for his crimes.',
  },
  s0275: {
    literal:
      'On xinsi Right Vice Director of the Masters of Writing, Duke of Mi Feng Deyi died.',
    idiomatic:
      'On xinsi Feng Deyi, Duke of Mi and right vice director of the Masters of Writing, died.',
  },
  s0276: {
    literal:
      'On renchen Junior Tutor to the crown prince, Duke of Song Xiao Yu became Left Vice Director of the Masters of Writing.',
    idiomatic:
      'On renchen Xiao Yu, Duke of Song and junior tutor to the crown prince, became left vice director of the Masters of Writing.',
  },
  s0277: {
    literal:
      'That summer great drought struck the Shandong prefectures; an order was issued to relieve distress wherever it occurred and not to collect that year\'s land tax.',
    idiomatic:
      'That summer Shandong suffered severe drought; the court ordered local relief and waived the year\'s land tax.',
  },
  s0278: {
    literal:
      'In the seventh month of autumn, on renzi, Minister of Personnel, Duke of Qi Zhangsun Wuji became Right Vice Director of the Masters of Writing.',
    idiomatic:
      'In the seventh month, on renzi, Zhangsun Wuji, Duke of Qi and Minister of Personnel, became right vice director of the Masters of Writing.',
  },
  s0279: {
    literal:
      'On wuxu Palace Attendant, Duke of Yixing Gao Shilian was demoted to Metropolitan Protector of Anzhou.',
    idiomatic:
      'On wuxu Gao Shilian, Duke of Yixing and Palace Attendant, was demoted to metropolitan protector of Anzhou.',
  },
  s0280: {
    literal: 'Minister of Revenue Pei Ju died.',
    idiomatic: 'Pei Ju, Minister of Revenue, died.',
  },
  s0281: {
    literal:
      'That month frost damaged the autumn crops in the eastern passes and along Henan and the Longyou frontier prefectures.',
    idiomatic:
      'That month frost ruined the autumn harvest in the east, Henan, and the Longyou frontier.',
  },
  s0282: {
    literal:
      'On xinyou he ordered Secretariat Vice Director Wen Yanbo, Right Assistant Director of the Masters of Writing Wei Zheng, and others to go to the various prefectures to relieve distress.',
    idiomatic:
      'On xinyou he sent Secretariat Vice Director Wen Yanbo, Right Assistant Director Wei Zheng, and others to the provinces on famine relief.',
  },
  s0283: {
    literal:
      'Director of the Secretariat, Duke of Ying Yuwen Shiji became Director of the Palace Bureau.',
    idiomatic:
      'Yuwen Shiji, Duke of Ying and Secretariat Director, became director of the palace bureau.',
  },
  s0284: {
    literal:
      'Censor-in-Chief, Acting Minister of Personnel, Participant in Government Affairs, Duke of Anji Du Yan left his post.',
    idiomatic:
      'Du Yan, Duke of Anji, censor-in-chief and acting Minister of Personnel, left office.',
  },
  s0285: {
    literal:
      'On renwu the Emperor said to his attending ministers: "The matter of immortals is fundamentally empty and false — it has only a name.',
    idiomatic:
      'On renwu the Emperor told his ministers: "Immortality is a lie — nothing but a name.',
  },
  s0286: {
    literal:
      'The First Emperor of Qin had an improper fondness for it and was deceived by masters of the methods; he sent several thousand boys and girls to follow Xu Fu across the sea in search of the elixir of immortality; the masters, fleeing Qin\'s harsh cruelty, remained abroad and did not return.',
    idiomatic:
      'Qin Shihuang\'s obsession led fangshi to trick him; he sent thousands of youths with Xu Fu to seek elixirs across the sea, and the adepts, fleeing Qin\'s cruelty, never came back.',
  },
  s0287: {
    literal:
      'The First Emperor still lingered on the seashore waiting for them and died at Shaqiu on his return.',
    idiomatic:
      'The First Emperor waited on the shore until he died at Shaqiu on the homeward march.',
  },
  s0288: {
    literal:
      'Emperor Wu of Han sought immortality and even gave his daughter in marriage to a man of the Way; when nothing came of it, he had the man executed.',
    idiomatic:
      'Han Wudi sought immortality, married a princess to a Daoist adept, and when the rites failed, executed him.',
  },
  s0289: {
    literal:
      'Judging from these two affairs, immortals need not be sought in vain."',
    idiomatic:
      'These two tales should warn anyone against chasing immortals."',
  },
  s0290: {
    literal:
      '" Left Vice Director of the Masters of Writing, Duke of Song Xiao Yu was dismissed for an offense.',
    idiomatic:
      'Xiao Yu, Duke of Song and left vice director of the Masters of Writing, was dismissed for misconduct.',
  },
  s0291: {
    literal:
      'On wushen Liang Prefecture Protector Prince Xiaochang of Yi\'an, Right Martial Guard General Liu Deyu, and others plotted rebellion and were executed.',
    idiomatic:
      'On wushen Li Xiaochang, Prince of Yi\'an and protector of Lizhou, Right Martial Guard General Liu Deyu, and others plotted rebellion and were executed.',
  },
  s0292: {
    literal:
      'That year famine struck Guanzhong, until there were those who sold sons and daughters.',
    idiomatic:
      'That year Guanzhong starved so badly that parents sold their children.',
  },
  s0293: {
    literal:
      'In the second year of Zhenguan, in the spring of the first month, on xinchou, Right Vice Director of the Masters of Writing, Duke of Qi Zhangsun Wuji became Grand Master with the Golden Seal and Purple Ribbon of the same precedence as the Three Excellencies.',
    idiomatic:
      'In the second year of Zhenguan, on xinchou of the first spring month, Zhangsun Wuji, Duke of Qi and right vice director, was made Grand Master of Honor with golden seal and purple ribbon.',
  },
  s0294: {
    literal:
      'Prince of Han Shu was moved to Prince of Ke; Prince of Wei Tai to Prince of Yue; Prince of Chu You to Prince of Yan.',
    idiomatic:
      'Prince Shu of Han was retitled Prince of Ke; Prince Tai of Wei became Prince of Yue; Prince You of Chu became Prince of Yan.',
  },
  s0295: {
    literal:
      'The six vice directors were restored to assist the six ministers, and one Left and one Right Bureau Director were also established.',
    idiomatic:
      'Six vice directors were restored under the six ministries, each ministry gaining left and right bureau directors.',
  },
  s0296: {
    literal:
      'Former Metropolitan Protector of Anzhou, Prince Yuanjing of Zhao became Prefect of Yongzhou; Prince Ke of Shu became Metropolitan Protector of Yizhou; Prince Tai of Yue became Metropolitan Protector of Yangzhou.',
    idiomatic:
      'Li Yuanjing, former metropolitan protector of Anzhou and Prince of Zhao, became Yongzhou prefect; Li Ke, Prince of Shu, metropolitan protector of Yizhou; and Li Tai, Prince of Yue, metropolitan protector of Yangzhou.',
  },
  s0297: {
    literal: 'On bingxu the Mohe submitted and came within the realm.',
    idiomatic: 'On bingxu the Mohe tribes submitted to Tang rule.',
  },
  s0298: {
    literal:
      'On wushen, the first day of the third month, there was a solar eclipse.',
    idiomatic:
      'On wushen, the first day of the third month, the sun was eclipsed.',
  },
  s0299: {
    literal:
      'On dingmao he sent Censor-in-Chief Du Yan to tour the Guanzhong prefectures.',
    idiomatic:
      'On dingmao he dispatched Censor-in-Chief Du Yan to inspect the Guanzhong prefectures.',
  },
  s0300: {
    literal:
      'He released imperial gold and treasure to redeem boys and girls who had sold themselves and return them to their parents.',
    idiomatic:
      'He drew on the imperial treasury to buy back children sold into bondage and restore them to their parents.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/002.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 201;
const END = 300;

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
if (trans.metadata.chapter !== '002') {
  throw new Error(`Expected chapter 002, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);
const hasAll =
  trans.sentences.length === END - START + 1 &&
  trans.sentences.every((s) => expectedIds.has(s.originalId || s.id));

if (!hasAll) {
  trans = {
    metadata: {
      book: 'jiutangshu',
      chapter: '002',
      file: chapterPath,
    },
    sentences: extractRange(chapterPath, START, END),
  };
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
console.log('Applied', applied, 'translations (s0201–s0300)');
