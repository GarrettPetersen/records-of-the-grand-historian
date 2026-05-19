import fs from 'node:fs';

const data = JSON.parse(
  fs.readFileSync('translations/current_translation_songshu.json', 'utf8')
);

const T = {
  s0402: [
    'In the twelfth month, on the day gengzi, he set out from Chang\u2019an, appointing Prince of Guiyang Yizhen as General Who Pacifies the West and Inspector of Yongzhou, and leaving trusted generals and aides to assist him.',
    'In the twelfth month, on the day gengzi, he departed Chang\u2019an, made Prince of Guiyang Yizhen General Who Pacifies the West and inspector of Yongzhou, and left trusted officers to assist him.',
  ],
  s0403: [
    'In the intercalary month, the Duke entered the river from Luoyang, opened the Bian Canal, and returned.',
    'In the intercalary month Gaozu entered the river from Luoyang, opened the Bian Canal, and returned.',
  ],
  s0404: [
    'In the first month of the fourteenth year, on the day renxu, the Duke reached Pengcheng, lifted the martial ban, and rested the armor.',
    'In the first month of the fourteenth year, on the day renxu, Gaozu reached Pengcheng, lifted martial law, and stood down the troops.',
  ],
  s0405: [
    'Auxiliary State General Liu Zunkao was made Inspector of Bingzhou, concurrently Administrator of Hedong, and stationed at Puban.',
    'Auxiliary State General Liu Zunkao was made inspector of Bingzhou and Hedong administrator, stationed at Puban.',
  ],
  s0406: [
    'The Duke relinquished Si province, took the two inspectorates of Xu and Ji, and firmly declined advancement in rank.',
    'Gaozu relinquished Si province, took Xu and Ji, and firmly declined further honors.',
  ],
  s0407: [
    'In the sixth month he received the command of the Nine Bestowments as Duke of Song, Chancellor of State.',
    'In the sixth month he received the Nine Bestowments as Duke of Song and Chancellor of State.',
  ],
  s0408: [
    'An order said: "I, alone and slight, bear a weight beyond measure; holding my place and serving as a frontier lord, I fear overflow and peril.',
    'An order said: "I, alone and slight, bear a weight beyond measure; holding my place and serving as a frontier lord, I fear overflow and peril.',
  ],
  s0409: [
    'The court\u2019s grace is lofty and great; beauty is entrusted and merit pushed forward—thus to match Qi and Jin in measure, and to draft the state canon.',
    'The court\u2019s grace is lofty; merit is pushed forward—thus to match Qi and Jin in measure and draft the state canon.',
  ],
  s0410: [
    'Although I have shown bright sincerity and kept my place, ten years have passed until now, yet the completed mandate will not turn back; the hundred ministers all arrive, inner and outer officials alike, urging with utmost earnestness.',
    'Although I have shown bright sincerity and kept my place these ten years, the mandate will not turn back; ministers and officials inner and outer alike urge with utmost earnestness.',
  ],
  s0411: [
    'Relying on the merit that came with the age, sharing in the traces of enlightened rule, riding slight and thin resources, joining in affairs of great virtue—I watch and wake and speak forever, not knowing where to lodge my trust.',
    'Relying on the merit of the age and sharing in enlightened rule, with slight resources joining great affairs—I wake and brood, not knowing where to lodge my trust.',
  ],
  s0412: [
    'At the beginning of the exalted reign, I think to spread this celebration.',
    'At the beginning of the exalted reign, I think to spread this celebration.',
  ],
  s0413: [
    'Let all within the state below the death penalty be pardoned, before dawn on the twenty-third of this month—all alike forgiven.',
    'Let all within the state below the death penalty be pardoned before dawn on the twenty-third of this month—all alike forgiven.',
  ],
  s0414: [
    'Widowers, widows, orphans, and the solitary who cannot support themselves—each is granted five hu of grain.',
    'Widowers, widows, orphans, and the solitary who cannot support themselves shall each receive five hu of grain.',
  ],
  s0415: [
    'Criminal cases in the prefectures and commanderies are likewise swept clean.',
    'Criminal cases in the prefectures and commanderies are likewise swept clean.',
  ],
  s0416: [
    'The rest shall follow the old standards in detail.',
    'The rest shall follow the old standards in detail.',
  ],
  s0417: [
    'An edict honored the Grand Lady of Yuzhang, mother of the Duke of Song, as Grand Consort of the Duke of Song; the heir was made Central Army General and deputy to the Chancellor of State\u2019s office.',
    'An edict honored the Grand Lady of Yuzhang, mother of the Duke of Song, as Grand Consort of the Duke of Song; the heir was made Central Army General and deputy to the Chancellor of State\u2019s office.',
  ],
  s0418: [
    'Grand Commandant Army Consultation Sacrifice-officer Kong Jigong was made Song State Master of Writing Director; Inspector of Qingzhou Tan Zhi was made Commanding General; the Chancellor of State\u2019s Left Chief Clerk Wang Hong was made Vice Director of the Masters of Writing.',
    'Kong Jigong, Grand Commandant army consultation sacrifice-officer, was made Song State Master of Writing Director; Qingzhou inspector Tan Zhi was made Commanding General; Chancellor of State left chief clerk Wang Hong was made Vice Director of the Masters of Writing.',
  ],
  s0419: [
    'The rest of the hundred officials all followed the Heavenly Court\u2019s system.',
    'The rest of the hundred officials all followed the imperial court\u2019s system.',
  ],
  s0420: [
    'An edict further said that beyond the ten commanderies enfeoffed to the Song State, appointments might be made at will.',
    'An edict further said that beyond the ten commanderies enfeoffed to the Song State, appointments might be made at will.',
  ],
  s0421: [
    'Earlier, Pacifying-the-West Central Army Major Shen Tianzi had killed Pacifying-the-West Major Wang Zhen\u2019e; the generals in turn killed Pacifying-the-West Chief Clerk Wang Xiu.',
    'Earlier Pacifying-the-West central army major Shen Tianzi killed Pacifying-the-West major Wang Zhen\u2019e; the generals in turn killed Pacifying-the-West chief clerk Wang Xiu.',
  ],
  s0422: [
    'Guanzhong fell into chaos.',
    'Guanzhong fell into chaos.',
  ],
  s0423: [
    'In the tenth month the Duke sent Right General Zhu Lingshi to replace Pacifying-the-West General Prince of Guiyang Yizhen as Inspector of Yongzhou.',
    'In the tenth month Gaozu sent Right General Zhu Lingshi to replace Pacifying-the-West General Prince of Guiyang Yizhen as inspector of Yongzhou.',
  ],
  s0424: [
    'When Yizhen had returned, the Fofo barbarians pursued him; he was greatly defeated and barely escaped with his life.',
    'When Yizhen had returned, the Fofo barbarians pursued him; he was routed and barely escaped with his life.',
  ],
  s0425: [
    'The generals and Zhu Lingshi were all lost.',
    'The generals and Zhu Lingshi were all lost.',
  ],
  s0426: [
    'Commanding General Tan Zhi died; Central Army Major Tan Daoji was made Central Commanding General.',
    'Commanding General Tan Zhi died; Central Army Major Tan Daoji was made Central Commanding General.',
  ],
  s0427: [
    'In the twelfth month the Son of Heaven died; the Grand Marshal, Prince of Langye, took the throne.',
    'In the twelfth month the emperor died; Grand Marshal Prince of Langye took the throne.',
  ],
  s0428: [
    'In the twelfth month the Son of Heaven ordered the kingly crown of twelve tassels, the establishment of the Son of Heaven\u2019s banners, going out with imperial guard and entering with clearance, riding the golden-root carriage, driving six horses, with five-season secondary carriages prepared, setting maotou and yunhan, music and dance of eight rows, and suspended bells and palace music established.',
    'In the twelfth month the emperor ordered the kingly crown of twelve tassels, imperial banners, imperial guard on going out and clearance on entering, the golden-root carriage with six horses, five-season secondary carriages, maotou and yunhan insignia, eight-row music and dance, and suspended bells and palace music.',
  ],
  s0429: [
    'The kingly grand consort was advanced to Empress Dowager, the kingly consort to Queen, the heir to Crown Prince; princes and royal grandsons\u2014titles and commands all followed the old rites.',
    'The kingly grand consort was advanced to Empress Dowager, the kingly consort to Queen, the heir to Crown Prince; princes and royal grandsons received titles and commands as in the old rites.',
  ],
  s0430: [
    'In the fourth month of the second year, the king was summoned to assist at court.',
    'In the fourth month of the second year the king was summoned to assist at court.',
  ],
  s0431: [
    'In the sixth month he reached the capital.',
    'In the sixth month he reached the capital.',
  ],
  s0432: [
    'The Jin emperor abdicated the throne to the king; an edict said:',
    'The Jin emperor abdicated the throne to the king; an edict said:',
  ],
  s0433: [
    'Heaven in its making left the world in obscurity and set up shepherds of the people, thereby to mold the three poles, unify Heaven, and dispense transformation.',
    'Heaven in its making left the world in obscurity and set up shepherds of the people, thereby to mold the three poles, unify Heaven, and dispense transformation.',
  ],
  s0434: [
    'Therefore when the Great Way prevailed, the worthy and able were chosen; rise and fall had no fixed term, abdication and succession belonged to no single clan—threaded through the hundred kings, honored from of old.',
    'Therefore when the Great Way prevailed, the worthy and able were chosen; rise and fall had no fixed term, abdication and succession belonged to no single clan—threaded through the hundred kings, honored from of old.',
  ],
  s0435: [
    'The Jin Way declined and waned; generation after generation knew many troubles; reaching Yuankang, calamities piled up; the three luminaries changed place, crown and shoes exchanged stations; Emperor An was driven abroad, the ancestral sacrifices fell and perished—then the fortunes of Xuan and Yuan forever fell to earth; looking over the realm, it was already cut down and toppled.',
    'The Jin Way declined; generation after generation knew troubles; reaching Yuankang calamities piled up; the three luminaries changed place; Emperor An was driven abroad and ancestral sacrifices perished—the fortunes of Xuan and Yuan fell forever; looking over the realm, it was cut down and toppled.',
  ],
  s0436: [
    'Chancellor Song King—Heaven-sent in sage virtue, numinous martial excellence towering in the age—once righted the tottering age and twice remade the Central Realm; truly he raised the fallen and continued the cut off, a boat and raft for the drowned.',
    'Chancellor Song King—Heaven-sent in sage virtue, numinous martial excellence towering in the age—once righted the tottering age and twice remade the Central Realm; truly he raised the fallen and continued the cut off, a boat and raft for the drowned.',
  ],
  s0437: [
    'As for looking up to the celestial pearl and harmonizing the seven regulators, punishing the unsubmissive and reopening the frontiers—',
    'As for looking up to the celestial pearl and harmonizing the seven regulators, punishing the unsubmissive and reopening the frontiers—',
  ],
  s0438: [
    'then thrice capturing false rulers, cleansing the five capitals, lands of tattooed faces and flowery dress, the long reaches of the dragon wilderness and northern desert—all alike turned their heads to the rising sun and bathed in the dark beneficence.',
    'then thrice capturing false rulers, cleansing the five capitals; lands of tattooed faces and flowery dress, the long reaches of the dragon wilderness and northern desert—all turned to the rising sun and bathed in dark beneficence.',
  ],
  s0439: [
    'Therefore the four numina sent auspicious signs, rivers and mountains opened their charts, good omens piled in abundance, blessed responses blazed forth; the dark signs showed the term of revolution, Chinese and barbarian recorded the wish for joyful elevation.',
    'Therefore the four numina sent auspicious signs, rivers and mountains opened their charts, good omens piled in abundance, blessed responses blazed forth; the dark signs showed the term of revolution, Chinese and barbarian recorded the wish for joyful elevation.',
  ],
  s0440: [
    'The token of the replacing virtue was manifest in the hidden and manifest; looking to the crow that alights, the wise truly gather—how could it be only that Yancong had its return and Xianxi announced its farewell!',
    'The token of the replacing virtue was manifest in the hidden and manifest; looking to the crow that alights, the wise truly gather—how could it be only that Yancong had its return and Xianxi announced its farewell!',
  ],
  s0441: [
    'Formerly when the Fire Virtue had waned, the Wei ancestor laid the foundation; the Yellow Fortune did not prevail, and the three sovereigns toiled with diligence.',
    'Formerly when the Fire Virtue had waned, the Wei ancestor laid the foundation; the Yellow Fortune did not prevail, and the three sovereigns toiled with diligence.',
  ],
  s0442: [
    'Therefore Heaven\u2019s calendar and number truly had their place.',
    'Therefore Heaven\u2019s calendar and number truly had their place.',
  ],
  s0443: [
    'We, though dull and dark, are obscure to the Great Way; forever mirroring rise and fall has been so for long days.',
    'We, though dull and dark, are obscure to the Great Way; forever mirroring rise and fall has been so for long days.',
  ],
  s0444: [
    'Reflecting on the lofty righteousness of the four generations and examining the utmost hope of Heaven and man, We shall yield the throne to a separate palace and abdicate to Song, all according to the precedents of Tang and Yu, Han and Wei.',
    'Reflecting on the lofty righteousness of the four generations and examining the utmost hope of Heaven and man, We shall yield the throne to a separate palace and abdicate to Song, all according to the precedents of Tang and Yu, Han and Wei.',
  ],
  s0445: [
    'When the edict draft was complete, it was sent and presented to the Son of Heaven for him to write it; the Son of Heaven at once took up the brush and said to those at his side: "In Huan Xuan\u2019s time Heaven\u2019s mandate had already changed; it was again extended by Duke Liu for nearly twenty years.',
    'When the edict draft was complete, it was sent for the emperor to write; the emperor at once took up the brush and said to those at his side: "In Huan Xuan\u2019s time Heaven\u2019s mandate had already changed; it was again extended by Duke Liu for nearly twenty years.',
  ],
  s0446: [
    'Today\u2019s affair is what I gladly accept at heart.',
    'Today\u2019s affair is what I gladly accept at heart.',
  ],
  s0447: [
    'On the day jiazi the written mandate said:',
    'On the day jiazi the written mandate said:',
  ],
  s0448: [
    'Consult you, Song King: In remote antiquity authority first arose—long ago and far away; the details cannot be heard.',
    'Consult you, Song King: In remote antiquity authority first arose—long ago and far away; the details cannot be heard.',
  ],
  s0449: [
    'From when writing and tallies began, down to the Three Sovereigns and Five Emperors, none failed to use the supreme sage to rule the four seas, halt the weapons, and settle the great enterprise.',
    'From when writing and tallies began, down to the Three Sovereigns and Five Emperors, none failed to use the supreme sage to rule the four seas, halt the weapons, and settle the great enterprise.',
  ],
  s0450: [
    'Thus the emperor-king is the common vessel for governing things;',
    'Thus the emperor-king is the common vessel for governing things;',
  ],
  s0451: [
    'the Way of the ruler is the utmost publicness under Heaven.',
    'the Way of the ruler is the utmost publicness under Heaven.',
  ],
  s0452: [
    'Formerly in the upper age, deeply mirroring this Way, therefore when Heaven\u2019s emolument had ended, Tang and Yu could not pass their succession to their heirs;',
    'Formerly in the upper age, deeply mirroring this Way, therefore when Heaven\u2019s emolument had ended, Tang and Yu could not pass their succession to their heirs;',
  ],
  s0453: [
    'when the token-mandate came down, Shun and Yu could not fully keep their modesty.',
    'when the token-mandate came down, Shun and Yu could not fully keep their modesty.',
  ],
  s0454: [
    'Therefore to weave the three talents, clarify and order constant transformation, make a model to shake antiquity, and hang wind for ten thousand generations—nothing is greater than this.',
    'Therefore to weave the three talents, clarify and order constant transformation, make a model to shake antiquity, and hang wind for ten thousand generations—nothing is greater than this.',
  ],
  s0455: [
    'From then onward the generations grew ever stronger; Han succeeded the virtue of Fangxun, and Wei likewise matched Chonghua in measure.',
    'From then onward the generations grew ever stronger; Han succeeded the virtue of Fangxun, and Wei likewise matched Chonghua in measure.',
  ],
  s0456: [
    'Truly they coordinated counsel between men and ghosts, and took the hundred surnames as their heart.',
    'Truly they coordinated counsel between men and ghosts, and took the hundred surnames as their heart.',
  ],
  s0457: [
    'Formerly our ancestors were reverent and bright, the celestial seat at the pole; yet brightness and darkness succeeded in order, waxing and waning had their term.',
    'Formerly our ancestors were reverent and bright, the celestial seat at the pole; yet brightness and darkness succeeded in order, waxing and waning had their term.',
  ],
  s0458: [
    'Cutting Shang foretold calamity—not for one generation alone; once this could not be overcome—how much more today; what Heaven abandons has come from of old.',
    'Cutting Shang foretold calamity—not for one generation alone; once this could not be overcome—how much more today; what Heaven abandons has come from of old.',
  ],
  s0459: [
    'Only the king embodies the posture of the supreme sage, embraces the virtue of the two principles, brightness equal to sun and moon, Way matching the four seasons.',
    'Only the king embodies the posture of the supreme sage, embraces the virtue of the two principles, brightness equal to sun and moon, Way matching the four seasons.',
  ],
  s0460: [
    'Recently when the altars of soil and grain toppled, the king rescued and preserved them; when the Central Plain lay waste and choked with brambles, he again crossed and restored it.',
    'Recently when the altars of soil and grain toppled, the king rescued and preserved them; when the Central Plain lay waste and choked with brambles, he again crossed and restored it.',
  ],
  s0461: [
    'From those who relied on their strongholds and would not submit, who violated the statutes and defied mandate, who rebelled excessively to Heaven and secretly seized ten thousand li—',
    'From those who relied on their strongholds and would not submit, who violated the statutes and defied mandate, who rebelled excessively to Heaven and secretly seized ten thousand li—',
  ],
  s0462: [
    'none failed to be moistened with wind and rain, shaken with thunder and lightning.',
    'none failed to be moistened with wind and rain, shaken with thunder and lightning.',
  ],
  s0463: [
    'The Way of the nine punitive campaigns was already spread; the transformation of the eight laws was naturally ordered.',
    'The Way of the nine punitive campaigns was already spread; the transformation of the eight laws was naturally ordered.',
  ],
  s0464: [
    'How could it be only that he broadly bestowed on the people and aided this black-haired multitude;',
    'How could it be only that he broadly bestowed on the people and aided this black-haired multitude;',
  ],
  s0465: [
    'truly righteousness harmonized the four seas and the Way awed the eight wilds.',
    'truly righteousness harmonized the four seas and the Way awed the eight wilds.',
  ],
  s0466: [
    'As for Heaven above sending down signs, the four numina sending tokens, the texts of charts and prophecies already clear, and the hope of men and spirits already changed—',
    'As for Heaven above sending down signs, the four numina sending tokens, the texts of charts and prophecies already clear, and the hope of men and spirits already changed—',
  ],
  s0467: [
    'the hundred craftsmen sang in court, the common people praised in the wild, the hundred millions clapped and leaped, all inclining and waiting for renewal.',
    'the hundred craftsmen sang in court, the common people praised in the wild, the hundred millions clapped and leaped, all inclining and waiting for renewal.',
  ],
  s0468: [
    'If not that the hundred surnames joyfully elevated him, and Heaven\u2019s mandate gathered there, how could it be in Us alone that it could be exclusively held?',
    'If not that the hundred surnames joyfully elevated him, and Heaven\u2019s mandate gathered there, how could it be in Us alone that it could be exclusively held?',
  ],
  s0469: [
    'For this We look up and revere the imperial numen, look down and follow the multitude\u2019s counsel, reverently abdicate the divine vessel, and confer the imperial position on your person.',
    'For this We look up and revere the imperial numen, look down and follow the multitude\u2019s counsel, reverently abdicate the divine vessel, and confer the imperial position on your person.',
  ],
  s0470: [
    'The great fortune is declared exhausted; Heaven\u2019s emolument forever ended.',
    'The great fortune is declared exhausted; Heaven\u2019s emolument forever ended.',
  ],
  s0471: [
    'Alas!',
    'Alas!',
  ],
  s0472: [
    'King, truly hold the center, reverently follow the canonical instructions, fulfill the good wish of all within the realm, expand the grand enterprise without end, timely receive blessed protection, and answer the loving hope of the three numina.',
    'King, truly hold the center, reverently follow the canonical instructions, fulfill the good wish of all within the realm, expand the grand enterprise without end, timely receive blessed protection, and answer the loving hope of the three numina.',
  ],
  s0473: [
    'An imperial letter further said:',
    'An imperial letter further said:',
  ],
  s0474: [
    'We have heard that Heaven born the teeming people and set up rulers for them; emperors and kings entrusted to the age truly shared the four seas; rise and fall depended on merit and virtue, ascent and descent rested on the man.',
    'We have heard that Heaven born the teeming people and set up rulers for them; emperors and kings entrusted to the age truly shared the four seas; rise and fall depended on merit and virtue, ascent and descent rested on the man.',
  ],
  s0475: [
    'Therefore having a state must perish; the years of divination show its number; succession is without constancy; the sage and wise grasp its token.',
    'Therefore having a state must perish; the years of divination show its number; succession is without constancy; the sage and wise grasp its token.',
  ],
  s0476: [
    'Formerly in the upper age the three sages followed in track, consulted the Four Peaks, and thereby enlarged abdication and yielding.',
    'Formerly in the upper age the three sages followed in track, consulted the Four Peaks, and thereby enlarged abdication and yielding.',
  ],
  s0477: [
    'Only what the former kings accomplished hangs as a model forever without end.',
    'Only what the former kings accomplished hangs as a model forever without end.',
  ],
  s0478: [
    'When the Liu house abdicated, it truly took Yao as its model; when Wei announced its end, it likewise took this canon as its law.',
    'When the Liu house abdicated, it truly took Yao as its model; when Wei announced its end, it likewise took this canon as its law.',
  ],
  s0479: [
    'Our founding emperor therefore soothed the returning fortune and followed human affairs, riding the favorable sign to fix Heaven\u2019s protection.',
    'Our founding emperor therefore soothed the returning fortune and followed human affairs, riding the favorable sign to fix Heaven\u2019s protection.',
  ],
  s0480: [
    'Yet the Way was not always at peace; Rong and Yi disturbed Hua; We lost our Luoyang sustenance, the state was cramped south of the river, and still met ill fortune; ruin and submersion followed one upon another.',
    'Yet the Way was not always at peace; Rong and Yi disturbed Hua; We lost our Luoyang sustenance, the state was cramped south of the river, and still met ill fortune; ruin and submersion followed one upon another.',
  ],
  s0481: [
    'Reaching Yuankang, the ancestral sacrifices then toppled.',
    'Reaching Yuankang, the ancestral sacrifices then toppled.',
  ],
  s0482: [
    'Fortunately relying on divine martial brilliance that illumined Heaven, great integrity broadly burst forth, We restored our altars of soil and grain and remade our state and family.',
    'Fortunately relying on divine martial brilliance that illumined Heaven, great integrity broadly burst forth, We restored our altars of soil and grain and remade our state and family.',
  ],
  s0483: [
    'Only the king\u2019s sage virtue is reverent and bright, mirrors Heaven\u2019s great light, responded to the term and was born to bear it, clearly protecting the royal house.',
    'Only the king\u2019s sage virtue is reverent and bright, mirrors Heaven\u2019s great light, responded to the term and was born to bear it, clearly protecting the royal house.',
  ],
  s0484: [
    'Within he eased the state\u2019s peril; without he spread the grand design; at Hanyang he executed the great villain; at Yizhu he drove off the usurping thief; he cleared the miasma at Western Min, solemnly cleansed Southern Yue, twice pacified Jiang and Xiang, and opened and fixed Fan and Mian.',
    'Within he eased the state\u2019s peril; without he spread the grand design; at Hanyang he executed the great villain; at Yizhu he drove off the usurping thief; he cleared the miasma at Western Min, solemnly cleansed Southern Yue, twice pacified Jiang and Xiang, and opened and fixed Fan and Mian.',
  ],
  s0485: [
    'As for forever cherishing the realm, thinking to unify sound teaching—when the royal army took the first road, then Yi and Luo ran clear; when awe reached Xia and Tong, then Mount Hua lifted its mist; false chiefs held jade and bi, and Xianyang was at once ordered.',
    'As for forever cherishing the realm, thinking to unify sound teaching—when the royal army took the first road, then Yi and Luo ran clear; when awe reached Xia and Tong, then Mount Hua lifted its mist; false chiefs held jade and bi, and Xianyang was at once ordered.',
  ],
  s0486: [
    'Although ritual vessels are inscribed and the Odes and Documents are sung, the splendor of ordinary merit—none compares with this.',
    'Although ritual vessels are inscribed and the Odes and Documents are sung, the splendor of ordinary merit—none compares with this.',
  ],
  s0487: [
    'Then he halted weapons and cultivated letters, broadly spread virtuous government, used the eight threads to govern the ten thousand people and the nine offices to rule the state and land, thinking to combine the Three Kings and apply the four affairs.',
    'Then he halted weapons and cultivated letters, broadly spread virtuous government, used the eight threads to govern the ten thousand people and the nine offices to rule the state and land, thinking to combine the Three Kings and apply the four affairs.',
  ],
  s0488: [
    'Therefore trust was manifest in the hidden and manifest, and righteousness moved distant regions.',
    'Therefore trust was manifest in the hidden and manifest, and righteousness moved distant regions.',
  ],
  s0489: [
    'From ages that came as guests to where boats and chariots reached, none failed to sing of benevolent virtue and clap in dance as they came to court.',
    'From ages that came as guests to where boats and chariots reached, none failed to sing of benevolent virtue and clap in dance as they came to court.',
  ],
  s0490: [
    'We each time reverently reflect on the Way\u2019s merit, forever examine the token-fortune; Heaven\u2019s calendar and number truly rest on your person.',
    'We each time reverently reflect on the Way\u2019s merit, forever examine the token-fortune; Heaven\u2019s calendar and number truly rest on your person.',
  ],
  s0491: [
    'For this the five cords rose in degree, repeatedly showing traces of removing the old;',
    'For this the five cords rose in degree, repeatedly showing traces of removing the old;',
  ],
  s0492: [
    'the three luminaries harmonized in number, surely declaring the auspice of spreading the new.',
    'the three luminaries harmonized in number, surely declaring the auspice of spreading the new.',
  ],
  s0493: [
    'Charts, prophecies, and blessed omens—bright and clear, they are here.',
    'Charts, prophecies, and blessed omens—bright and clear, they are here.',
  ],
  s0494: [
    'Added to this, dragon countenance outstanding, Heaven-bestowed special posture—the outward form of one who rules men, blazing like sun and moon.',
    'Added to this, dragon countenance outstanding, Heaven-bestowed special posture—the outward form of one who rules men, blazing like sun and moon.',
  ],
  s0495: [
    'The Documents say, "Only Heaven is great; only Yao matched it."',
    'The Documents say, "Only Heaven is great; only Yao matched it."',
  ],
  s0496: [
    'The Odes say: "There is a mandate from Heaven; it commands this King Wen.',
    'The Odes say: "There is a mandate from Heaven; it commands this King Wen.',
  ],
  s0497: [
    '" For "perhaps leaping in the deep," in the end he enjoys the position of nine and five;',
    'For "perhaps leaping in the deep," in the end he enjoys the position of nine and five;',
  ],
  s0498: [
    '"Merit reaching Heaven and Earth"—such a one must receive the great treasure\u2019s enterprise.',
    '"Merit reaching Heaven and Earth"—such a one must receive the great treasure\u2019s enterprise.',
  ],
  s0499: [
    'Formerly when Earth Virtue announced its baleful sign, the succession passed to Our Jin;',
    'Formerly when Earth Virtue announced its baleful sign, the succession passed to Our Jin;',
  ],
  s0500: [
    'Now the calendar-fortune has changed its divination and forever ends here; likewise by Metal Virtue it passes to Song.',
    'Now the calendar-fortune has changed its divination and forever ends here; likewise by Metal Virtue it passes to Song.',
  ],
  s0501: [
    'Looking up to the blessed righteousness of the four generations, mirroring the fixed term of brightness and darkness, consulting the multitude of dukes, reaching even to the many directors—all said, "Excellent!" None went against Our intent.',
    'Looking up to the blessed righteousness of the four generations, mirroring the fixed term of brightness and darkness, consulting the multitude of dukes, reaching even to the many directors—all said, "Excellent!" None went against Our intent.',
  ],
};

for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) {
    console.error('Missing translation for', s.id);
    process.exit(1);
  }
  s.literal = pair[0];
  s.idiomatic = pair[1];
}

fs.writeFileSync(
  'translations/current_translation_songshu.json',
  JSON.stringify(data, null, 2) + '\n'
);
console.log('Patched', Object.keys(T).length, 'sentences');
