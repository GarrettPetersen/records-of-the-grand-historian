import fs from 'node:fs';

const data = JSON.parse(
  fs.readFileSync('translations/current_translation_songshu.json', 'utf8')
);

const T = {
  s0402: [
    'On the day gengzi in the twelfth month he set out from Chang\u2019an; he made the Duke of Guiyang Yizhen Pacifying-west General and Governor of Yong, leaving trusted generals and staff to assist him.',
    'On gengzi day in the twelfth month the Duke left Chang\u2019an, appointed the Duke of Guiyang Yizhen Pacifying-west General and Governor of Yong, and left trusted officers to support him.',
  ],
  s0403: [
    'In the intercalary month the Duke entered the river from Luoyang and opened the Bian Canal to return.',
    'In the intercalary month the Duke sailed from Luoyang into the river, opened the Bian Canal, and returned east.',
  ],
  s0404: [
    'On the day renxu in the first month of the fourteenth year the Duke reached Pengcheng, lifted martial law, and rested the armor.',
    'On renxu day in the first month of year fourteen the Duke reached Pengcheng and stood the army down.',
  ],
  s0405: [
    'Supporting-state General Liu Zunkao was made Governor of Bing, concurrently Administrator of Hedong, and stationed at Puban.',
    'Liu Zunkao, Supporting-state General, was made Governor of Bing and Administrator of Hedong, with his seat at Puban.',
  ],
  s0406: [
    'The Duke relinquished Si province and took charge as Governor of Xu and Ji; he firmly declined advancement in rank.',
    'The Duke gave up Si province and held Xu and Ji instead, again declining promotion in rank.',
  ],
  s0407: [
    'In the sixth month he received the command of the Nine Bestowals as Chancellor of State and Duke of Song.',
    'In the sixth month he accepted the Nine Bestowals as Chancellor of State and Duke of Song.',
  ],
  s0408: [
    'The order said: "I, solitary and slight, bear a weight beyond compare; I hold my post and serve the fief, and overflowing peril is what I fear.',
    'His order read: "I am slight and alone, yet bear a burden beyond measure; I guard my post and serve the fief, and live in fear of overflowing peril.',
  ],
  s0409: [
    'The court\u2019s grace is lofty and ample; it entrusts beauty and pushes merit upon me, so that I square my track with Qi and Jin and deliberate the state canon.',
    'The court has heaped grace upon me, entrusted me with honor, and pressed merit upon me until I stand level with Qi and Jin and the state canon itself is debated.',
  ],
  s0410: [
    'Though I have shown bright sincerity and kept my place, ten years to this day, the completed command will not turn back; the hundred officers all assemble, inner and outer common ranks, urging me with thorough diligence.',
    'Though I have kept bright sincerity and held my place these ten years, the final command will not be withdrawn; officers within and without urge me on from every side.',
  ],
  s0411: [
    'To ride upon the merit of the age, to share in the traces of its splendor, to take up slight resources and join in a great virtue\u2019s affair\u2014watching and waking I speak forever, not knowing where to lodge my trust.',
    'To share the age\u2019s merit, to join its splendor, to take up slight means and stand in a great virtue\u2019s work\u2014I wake and watch, not knowing where to rest my trust.',
  ],
  s0412: [
    'At the beginning of the lofty succession, I think to extend this blessing.',
    'At the beginning of this lofty reign I wish to spread this blessing abroad.',
  ],
  s0413: [
    'Let there be amnesty within the state for all below extraordinary death; before dawn on the twenty-third of this month let all alike be pardoned.',
    'Let all within the state sentenced below extraordinary death be pardoned before dawn on the twenty-third of this month.',
  ],
  s0414: [
    'Widowers, widows, orphans, and the solitary who cannot support themselves\u2014to each person give five hu of grain.',
    'To widowers, widows, orphans, and the destitute who cannot support themselves, give five hu of grain each.',
  ],
  s0415: [
    'Criminal cases in prefectures and provinces are likewise to be cleared away.',
    'Criminal cases in prefectures and provinces are likewise to be pardoned.',
  ],
  s0416: [
    'The rest follow the old standards in detail.',
    'All other matters follow the former regulations in detail.',
  ],
  s0417: [
    '"] An edict honored the Dowager of the Duke of Yuzhang as Grand Consort of the Duke of Song; the heir was made General of the Central Army and deputy of the Chancellor of State\u2019s headquarters.',
    'An edict honored the Dowager of the Duke of Yuzhang as Grand Consort of Song; the heir was made General of the Central Army and deputy at the Chancellor of State\u2019s headquarters.',
  ],
  s0418: [
    'Grand Commandant\u2019s Army Staff Adviser Kong Jigong was made Director of the Masters of Writing of the state of Song; Inspector of Qingzhou Tan Zhi was made General of the Palace Guard; the Chancellor of State\u2019s Left Chief Clerk Wang Hong was made Vice Director of the Masters of Writing.',
    'Kong Jigong, Grand Commandant\u2019s Army Staff Adviser, was made Director of the Masters of Writing of Song; Tan Zhi, Inspector of Qingzhou, was made General of the Palace Guard; Wang Hong, the Chancellor of State\u2019s Left Chief Clerk, was made Vice Director of the Masters of Writing.',
  ],
  s0419: [
    'The remaining hundred offices all followed the Heavenly Court\u2019s system.',
    'All other offices followed the imperial court\u2019s system.',
  ],
  s0420: [
    'Another edict said that beyond the ten commanderies enfeoffed to the state of Song, appointments might be made at will.',
    'Another edict allowed appointments throughout the realm, not only within Song\u2019s ten commanderies.',
  ],
  s0421: [
    'Earlier Pacifying-west Central Army Staff Officer Shen Tianzi had killed Pacifying-west Army Marshal Wang Zhen\u2019e, and the generals in turn killed Pacifying-west Chief Clerk Wang Xiu.',
    'Earlier Shen Tianzi, Pacifying-west Central Army Staff Officer, had killed Pacifying-west Army Marshal Wang Zhen\u2019e, and the generals then killed Pacifying-west Chief Clerk Wang Xiu.',
  ],
  s0422: [
    'Guanzhong fell into turmoil.',
    'Guanzhong was thrown into chaos.',
  ],
  s0423: [
    'In the tenth month the Duke sent Right General Zhu Lingshi to replace Pacifying-west General the Duke of Guiyang Yizhen as Governor of Yong.',
    'In the tenth month the Duke sent Right General Zhu Lingshi to replace the Duke of Guiyang Yizhen as Pacifying-west General and Governor of Yong.',
  ],
  s0424: [
    'When Yizhen had returned, the Fofo barbarians pursued him; he was greatly defeated and barely escaped with his life.',
    'On his return Yizhen was pursued by the Fofo barbarians, suffered a crushing defeat, and barely escaped alive.',
  ],
  s0425: [
    'The generals and commanders together with Lingshi all perished.',
    'The generals and Zhu Lingshi were all lost.',
  ],
  s0426: [
    'General of the Palace Guard Tan Zhi died; Central Army Marshal Tan Daoji was made Central General of the Palace Guard.',
    'Tan Zhi, General of the Palace Guard, died; Tan Daoji, Central Army Marshal, was made Central General of the Palace Guard.',
  ],
  s0427: [
    'In the twelfth month the Son of Heaven died; the Grand Marshal, Prince of Langye, ascended the throne.',
    'In the twelfth month Emperor An died; the Grand Marshal, Prince of Langye, took the throne.',
  ],
  s0428: [
    'In the twelfth month the Son of Heaven commanded the King to wear a cap with twelve tassels, to raise the Son of Heaven\u2019s banner, to go out and in with imperial escort, to ride the golden-root carriage drawn by six horses, to have the five-season secondary carriages prepared, to set the yak-tail banner and cloud canopy, the eight-row music and dance, and the suspended bells of the palace temple.',
    'In the twelfth month the Son of Heaven granted the King a twelve-tassel cap, the imperial banner, imperial escort on going out and in, the golden-root carriage with six horses, five-season secondary carriages, yak-tail and cloud banners, eight-row dancers, and palace bells.',
  ],
  s0429: [
    'The King\u2019s Grand Consort was advanced to Empress Dowager, the King\u2019s consort to Queen, the heir to Crown Prince; titles for the King\u2019s sons and grandsons followed the old ritual.',
    'The King\u2019s mother was made Empress Dowager, his consort Queen, his heir Crown Prince; titles for princes and grandsons followed former usage.',
  ],
  s0430: [
    'In the fourth month of the second year the King was summoned to assist at court.',
    'In the fourth month of year two the King was summoned to the capital to assist the throne.',
  ],
  s0431: [
    'In the sixth month he reached the capital.',
    'In the sixth month he reached the capital.',
  ],
  s0432: [
    'The Jin emperor abdicated the throne to the King. The edict said:',
    'The Jin emperor abdicated in favor of the King. The edict read:',
  ],
  s0433: [
    'Heaven in its making left the world in obscurity and set up rulers to tend it, thereby to mold the three poles, align Heaven, and spread transformation.',
    'When Heaven first made the world it was wild and dark; it appointed rulers to tend the people, mold the three realms, align with Heaven, and spread transformation.',
  ],
  s0434: [
    'Thus when the Great Way prevailed, worthies were chosen and the able employed; rise and fall have no fixed term, and abdication passed not to one clan alone\u2014threaded through the hundred kings, honored from of old.',
    'When the Great Way prevailed, the worthy were chosen and the able employed; dynasties rise and fall without fixed term, and the throne has passed beyond one clan since antiquity.',
  ],
  s0435: [
    'The Way of Jin declined; generation after generation met many troubles; down to the Yuanxing era calamity piled up; the three luminaries changed place and cap and shoes exchanged stations; Emperor An was driven abroad and the ancestral sacrifices toppled\u2014then the fortunes of Xuan and Yuan forever fell to earth; looking across the realm, it was already cut down.',
    'The Jin dynasty declined through reign after reign of trouble; from the Yuanxing era calamities mounted until sun, moon, and stars shifted and throne and subject changed places; Emperor An was driven into exile and the sacrifices fell\u2014the lines of Xuan and Yuan collapsed, and the realm itself seemed cut away.',
  ],
  s0436: [
    'Chancellor of State and King of Song: Heaven overspreads him with sagely virtue; martial spirit and splendor excel his age; he has once righted a tottering fortune and twice remade the central realm\u2014thus he restores what perished and continues what was broken, a boat and bridge for the drowned.',
    'The Chancellor of State and King of Song: Heaven endowed him with sagely virtue and martial splendor; he righted a falling age and remade the central realm, restoring the fallen and continuing the broken like a boat for the drowning.',
  ],
  s0437: [
    'As for looking up to the celestial pearl and harmonizing the seven regulators, lightly punishing the rebellious and reopening the frontiers.',
    'He looks up to the celestial pearl, harmonizes the seven regulators, punishes rebels, and reopens the borders.',
  ],
  s0438: [
    'Thus he thrice captured false rulers, cleansed the five capitals, and in lands of tattooed faces and barbarian dress, in the dragon-wild north desert\u2014none failed to turn their faces to the morning sun and bathe in the dark blessing.',
    'He thrice captured false rulers and cleansed the five capitals; from tattooed south to the northern desert, all turned toward the morning sun and bathed in imperial grace.',
  ],
  s0439: [
    'Therefore the four numina showed auspicious omens, rivers and mountains revealed their charts, lucky signs crowded in, good responses blazed forth; the dark signs showed the term of revolution, and Chinese and barbarian alike voiced the wish to push him forward.',
    'The four numina sent omens, rivers and mountains revealed charts, auspices crowded in and blessings blazed; heaven showed the term of revolution, and Chinese and barbarian alike voiced their wish to enthrone him.',
  ],
  s0440: [
    'The talisman of a changing virtue appeared in the hidden and manifest; the raven looked and rested\u2014truly the wise gathered. How could this be only the return of Yankang or the farewell of Xianxi!',
    'The mandate of a new virtue showed in heaven and earth; the wise gathered as the raven looked and rested. This was more than the return of Yankang or the farewell of Xianxi.',
  ],
  s0441: [
    'Formerly when the Fire virtue waned, the Wei ancestor laid the foundation; when the Yellow fortune did not contend, the three queens labored in turn.',
    'When the Fire virtue waned, the Wei founder laid the foundation; when the Yellow fortune faltered, the three queens labored in turn.',
  ],
  s0442: [
    'Thus Heaven\u2019s allotted span truly has its place.',
    'Heaven\u2019s mandate truly has its appointed place.',
  ],
  s0443: [
    'We, though dull and dim, are blind to the Great Way, yet have long mirrored rise and fall.',
    'We are dull and blind to the Great Way, yet have long watched rise and fall.',
  ],
  s0444: [
    'Thinking on the high righteousness of the four ages and examining Heaven and man\u2019s utmost hope, We shall yield the throne to a separate palace and abdicate to Song, all according to the precedents of Tang-Yao, Yu-Shun, Han, and Wei.',
    'Honoring the righteousness of the four ages and Heaven and man\u2019s utmost hope, We yield the separate palace and abdicate to Song, following the precedents of Tang-Yao, Yu-Shun, Han, and Wei.',
  ],
  s0445: [
    'When the draft edict was complete it was sent for the Son of Heaven to write it; the Son of Heaven at once took up the brush and said to those at his side: "In Huan Xuan\u2019s time the mandate had already changed; I was again extended by Duke Liu for nearly twenty years.',
    'When the draft was finished it was sent for the Son of Heaven to copy; he took up the brush at once and said to those beside him: "In Huan Xuan\u2019s day the mandate had already changed; Duke Liu restored me for nearly twenty years.',
  ],
  s0446: [
    'Today\u2019s affair is what I willingly accept at heart."',
    'Today\u2019s affair is what I accept willingly at heart."',
  ],
  s0447: [
    'On the day jiazi the written mandate said:',
    'On jiazi day the written mandate said:',
  ],
  s0448: [
    'We address you, King of Song: In the dark antiquity the beginning was raised\u2014how far and long ago! Its details cannot be heard.',
    'We address you, King of Song: In deepest antiquity the world began\u2014how far away! Its details cannot be known.',
  ],
  s0449: [
    'From written tally down to the Three Sovereigns and Five Emperors, none failed to use the highest sage to rule the four seas and halt arms to settle the great enterprise.',
    'From written records down to the Three Sovereigns and Five Emperors, none failed to place the highest sage over the four seas and halt arms to settle the great enterprise.',
  ],
  s0450: [
    'Thus the emperor is the common vessel for ruling things;',
    'Thus the emperor is the common vessel for ruling all things;',
  ],
  s0451: [
    'the way of the ruler is the utmost public of the world.',
    'and the way of the ruler is the utmost public good under Heaven.',
  ],
  s0452: [
    'In former high antiquity they deeply mirrored this Way; thus when Heaven\u2019s blessing ended, Tang and Yu could not pass their heirs;',
    'In high antiquity they deeply mirrored this Way; when Heaven\u2019s blessing ended, Tang and Yu could not pass the throne to their heirs;',
  ],
  s0453: [
    'when the mandate came, Shun and Yu could not keep their modesty whole.',
    'when the mandate arrived, Shun and Yu could not keep their full modesty.',
  ],
  s0454: [
    'Therefore to weave the three powers, clarify and order constant transformation, make a model to shake antiquity, and hang the wind for ten thousand generations\u2014nothing surpasses this.',
    'Therefore to order heaven, earth, and man, clarify transformation, make a model for all ages, and hang virtue for ten thousand generations\u2014nothing surpasses this.',
  ],
  s0455: [
    'From then onward each generation grew stricter; Han continued the virtue of Fangxun, and Wei likewise squared its track with Chonghua.',
    'From then on each age grew stricter; Han continued the virtue of Yao, and Wei squared its track with Shun.',
  ],
  s0456: [
    'Truly they harmonized the plans of ghosts and men and took the hundred surnames as their heart.',
    'Truly they harmonized the plans of ghosts and men and took the people as their heart.',
  ],
  s0457: [
    'Formerly Our ancestors were reverent and bright; they dwelt at the pole, yet brightness and darkness alternated in sequence, fullness and deficit had their terms.',
    'Formerly Our ancestors were reverent and bright and dwelt at the pole, yet brightness and darkness alternated and fullness and deficit had their terms.',
  ],
  s0458: [
    'The omen of cutting Shang brought calamity not for one reign alone; they could not overcome it then\u2014how much less today? What Heaven discards has long had its cause.',
    'The omen of cutting Shang brought calamity for more than one reign; they could not overcome it then\u2014how much less today? What Heaven discards has long had its cause.',
  ],
  s0459: [
    'Only the King embodies the posture of the highest sage, embraces the virtue of the two principles, is bright as sun and moon, and his Way matches the four seasons.',
    'The King embodies the highest sage, embraces the virtue of yin and yang, shines like sun and moon, and his Way matches the four seasons.',
  ],
  s0460: [
    'Recently when the altars toppled, the King rescued and preserved them; when the central plain lay waste and choked, he crossed and restored it.',
    'When the altars toppled, the King rescued them; when the central plain lay waste, he crossed and restored it.',
  ],
  s0461: [
    'From those who relied on their strength and would not submit, who violated the statutes and defied command, who ran riot against Heaven and secretly held ten thousand li.',
    'From rebels who relied on strength, violated statutes, defied command, ran riot against Heaven, and held vast lands in secret.',
  ],
  s0462: [
    'None failed to be moistened with wind and rain, shaken with thunder.',
    'None failed to be moistened with wind and rain and shaken with thunder.',
  ],
  s0463: [
    'The nine punitive campaigns were spread abroad; the eight methods of transformation were ordered of themselves.',
    'The nine punitive campaigns were spread abroad; the eight methods of rule ordered themselves.',
  ],
  s0464: [
    'How could it be only that he broadly bestowed upon the people and aided these black-haired folk;',
    'How could it be only that he broadly bestowed on the people and aided the common folk;',
  ],
  s0465: [
    'truly righteousness harmonized the four seas and the Way awed the eight regions.',
    'truly his righteousness harmonized the four seas and his Way awed the eight regions.',
  ],
  s0466: [
    'As for Heaven hanging signs, the four numina showing omens, the charts and prophecies already clear, and the hope of men and spirits already changed.',
    'Heaven hung signs, the four numina showed omens, charts and prophecies were clear, and the hope of men and spirits had changed.',
  ],
  s0467: [
    'The hundred craftsmen sang in court, the common people praised in the fields; the hundred millions leaped for joy, all leaning and waiting for the new.',
    'Craftsmen sang in court, common people praised in the fields; the millions leaped for joy and waited for the new.',
  ],
  s0468: [
    'If not that the people gladly pushed him forward and Heaven\u2019s mandate gathered upon him, how could We alone monopolize it?',
    'If the people had not gladly pushed him forward and Heaven\u2019s mandate gathered upon him, how could We alone hold it?',
  ],
  s0469: [
    'Therefore We respectfully receive the imperial numen, bow to the multitude\u2019s counsel, reverently yield the sacred vessel, and confer the imperial seat upon your person.',
    'Therefore We respectfully receive the imperial numen, bow to the multitude\u2019s counsel, reverently yield the sacred vessel, and confer the throne upon you.',
  ],
  s0470: [
    'The great succession is announced exhausted; Heaven\u2019s blessing ends forever.',
    'The great succession is exhausted; Heaven\u2019s blessing ends forever.',
  ],
  s0471: [
    'Alas!',
    'Alas!',
  ],
  s0472: [
    'King, hold fast the center, reverently follow the canon and instruction, answer the realm\u2019s glad wish, and expand the great enterprise without end; always receive fine blessing to answer the three spirits\u2019 trusting gaze.',
    'King, hold fast the center, reverently follow the canon, answer the realm\u2019s glad wish, expand the great enterprise without end, and always receive fine blessing to answer the three spirits\u2019 gaze.',
  ],
  s0473: [
    'Again the imperial letter said:',
    'Again the imperial letter said:',
  ],
  s0474: [
    'We have heard that Heaven born the teeming people and set up a ruler for them; emperors and kings entrusted their generations and truly held the four seas; rise and fall depended on merit and virtue, advancement and decline rested on the man.',
    'We have heard that Heaven born the teeming people and set up rulers for them; emperors held the four seas; rise and fall depended on merit and virtue, advancement and decline on the man.',
  ],
  s0475: [
    'Therefore states must perish; divination fixes their years; succession is without constancy, and the sage grasps the talisman.',
    'Therefore states must perish; divination fixes their years; succession is without constancy, and the sage grasps the mandate.',
  ],
  s0476: [
    'In high antiquity the three sages followed in track; they consulted the four peaks to enlarge abdication.',
    'In high antiquity the three sages followed in track and consulted the four peaks to enlarge abdication.',
  ],
  s0477: [
    'Only when the former kings made their mark did they hang a model without end.',
    'Only when the former kings acted did they hang a model without end.',
  ],
  s0478: [
    'When the Liu house abdicated, it truly took Yao as its model; when Wei announced its end, it likewise followed this canon.',
    'When the Liu house abdicated, it took Yao as its model; when Wei ended, it followed the same canon.',
  ],
  s0479: [
    'Our founding emperor therefore soothed the returning fortune and complied with human affairs, riding the favorable sign to fix Heaven\u2019s protection.',
    'Our founding emperor soothed the returning fortune, complied with human affairs, and rode the favorable sign to fix Heaven\u2019s protection.',
  ],
  s0480: [
    'Yet the Way was not always at peace; barbarians disturbed China; We lost the Luoyang sacrifice and the state was cramped south of the river; again We met ill fortune, and ruin followed ruin.',
    'Yet the Way was not always at peace; barbarians disturbed China; We lost Luoyang and the state was cramped south of the river; ill fortune followed ruin upon ruin.',
  ],
  s0481: [
    'Down to the Yuanxing era the ancestral sacrifices toppled.',
    'By the Yuanxing era the ancestral sacrifices had toppled.',
  ],
  s0482: [
    'Fortunately relying on divine martial brilliance that overspread Heaven, the great constancy broadly rose, We restored Our altars and remade Our state.',
    'Fortunately, relying on divine martial brilliance that overspread Heaven, the great constancy rose, We restored Our altars and remade Our state.',
  ],
  s0483: [
    'Only the King\u2019s sagely virtue is reverent and bright; he mirrors Heaven and his radiance is great; he answered the term and was born to carry it; he clearly protected the royal house.',
    'Only the King\u2019s sagely virtue is reverent and bright; he mirrors Heaven with great radiance; born to the term, he clearly protected the royal house.',
  ],
  s0484: [
    'Within he eased the state\u2019s hardship, without he spread the grand design; he executed the great villain at Hanyang, drove off the usurping robber at Yizhu, cleared the mists west of Min, swept the south of Yue, again quieted the Yangtze and Xiang, and opened and settled Fan and Mian.',
    'Within he eased the state\u2019s hardship, without he spread the grand design; he executed the great villain at Hanyang, drove off usurpers at Yizhu, cleared the west, swept the south, again quieted the Yangtze and Xiang, and settled Fan and Mian.',
  ],
  s0485: [
    'As for forever embracing the realm and desiring one sound of teaching\u2014when the royal army took the road, then Yi and Luo ran clear; when majesty reached Xia and Tong, then Mount Hua lifted its mist; false chiefs offered their jade, and Xianyang at once took order.',
    'Forever embracing the realm and desiring one teaching\u2014when the royal army marched, Yi and Luo ran clear; when majesty reached the passes, Mount Hua lifted its mist; false rulers offered jade, and Xianyang submitted at once.',
  ],
  s0486: [
    'Though what ritual vessels record and what Odes and Documents praise\u2014the crowning of merit\u2014none stands second to this.',
    'Though ritual vessels record it and Odes and Documents praise it, no crowning of merit stands second to this.',
  ],
  s0487: [
    'Thus he halted arms and cultivated letters, broadly spread virtuous government, used the eight threads to govern the ten thousand people and the nine duties to judge the state, thinking to embrace the three kings and apply the four affairs.',
    'Thus he halted arms and cultivated letters, spread virtuous government, governed the people with the eight threads and judged the state with the nine duties, thinking to embrace the three kings and apply the four affairs.',
  ],
  s0488: [
    'Therefore trust showed in the hidden and manifest, and righteousness moved the distant regions.',
    'Therefore trust showed in the hidden and manifest, and righteousness moved distant lands.',
  ],
  s0489: [
    'From ages that honored him, from places boats and chariots reached\u2014none failed to sing of benevolent virtue and leap in dance to come to court.',
    'From ages that honored him to lands boats and chariots reached, none failed to sing of benevolent virtue and dance their way to court.',
  ],
  s0490: [
    'We each time reverently consider the Way\u2019s merit and forever examine the talisman of fortune; Heaven\u2019s allotted span truly rests upon your person.',
    'We each time reverently consider the Way\u2019s merit and examine the talisman of fortune; Heaven\u2019s allotted span truly rests upon you.',
  ],
  s0491: [
    'Therefore the five cords rose in degree and repeatedly showed traces of removing the old;',
    'Therefore the five planets rose in degree and repeatedly showed signs of removing the old;',
  ],
  s0492: [
    'the three luminaries harmonized in number and surely displayed omens of spreading the new.',
    'the three luminaries harmonized in number and surely displayed omens of spreading the new.',
  ],
  s0493: [
    'Charts, prophecies, and auspicious omens plainly stood forth.',
    'Charts, prophecies, and auspicious omens stood forth plainly.',
  ],
  s0494: [
    'Added to this, the dragon countenance is heroic and outstanding, Heaven bestowed a special posture; the mark of a ruler shines like sun and moon.',
    'Added to this, his dragon countenance is heroic, Heaven bestowed a special posture, and the mark of a ruler shines like sun and moon.',
  ],
  s0495: [
    'The tradition says, "Only Heaven is great; only Yao modeled himself on it."',
    'The tradition says, "Only Heaven is great; only Yao modeled himself on it."',
  ],
  s0496: [
    'The Odes say: "There is a mandate from Heaven; Heaven commanded this King Wen."',
    'The Odes say: "There is a mandate from Heaven; Heaven commanded this King Wen."',
  ],
  s0497: [
    '"] He who "perhaps leaps in the abyss" in the end enjoys the position of the fifth nine;',
    'He who "perhaps leaps in the abyss" in the end enjoys the position of the fifth nine;',
  ],
  s0498: [
    'he whose "merit grids heaven and earth" must receive the great treasure\u2019s enterprise.',
    'he whose "merit grids heaven and earth" must receive the great treasure\u2019s enterprise.',
  ],
  s0499: [
    'Formerly when the Earth virtue announced its calamity, the succession passed to Our Jin;',
    'Formerly when the Earth virtue announced its calamity, the succession passed to Our Jin;',
  ],
  s0500: [
    'now the calendar and fortune change divination and end forever here\u2014likewise the Metal virtue passes to Song.',
    'now the calendar and fortune change and end here\u2014likewise the Metal virtue passes to Song.',
  ],
  s0501: [
    'Looking up to the fine righteousness of the four ages and mirroring the fixed term of brightness and darkness, We inquired of the high lords and reached to the common directors; all said, "Excellent!" None went against Our intent.',
    'Looking up to the fine righteousness of the four ages and mirroring the fixed term of rise and fall, We inquired of the high lords and common directors; all said, "Excellent!" None went against Our intent.',
  ],
};

let empty = 0;
for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) {
    console.error('missing', s.id);
    process.exit(1);
  }
  s.literal = t[0];
  s.idiomatic = t[1];
  if (!s.literal.trim() || !s.idiomatic.trim()) empty++;
  if (s.literal === s.chinese || s.idiomatic === s.chinese) {
    console.error('identical to chinese', s.id);
    process.exit(1);
  }
}

fs.writeFileSync(
  'translations/current_translation_songshu.json',
  JSON.stringify(data, null, 2) + '\n'
);
console.log('done', Object.keys(T).length, 'empty', empty);
