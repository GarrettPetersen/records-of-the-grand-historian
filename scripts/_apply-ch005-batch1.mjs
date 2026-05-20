#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.005, Gaozong 2 — Qianfeng fengshan through Xianheng 1) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0001: {
    literal:
      'In the third year of Linde, spring, first month, on wuchen, the new moon, the imperial carriage halted at Mount Tai.',
    idiomatic:
      'In Linde 3, on the wuchen new moon of the first spring month, the emperor halted at Mount Tai.',
  },
  s0002: {
    literal:
      'That day he personally sacrificed to the Supreme Lord of the Vast Heaven at the feng altar, with Gaozu and Taizong joining in the offering.',
    idiomatic:
      'That day he sacrificed in person to the Lord on High at the feng altar, with Gaozu and Taizong as associates in the rite.',
  },
  s0003: {
    literal: 'On jisi the emperor ascended the mountain to perform the feng and shan rites.',
    idiomatic: 'On jisi the emperor climbed the mountain for the fengshan ceremony.',
  },
  s0004: {
    literal:
      'On gengwu he performed the shan at Sheshou, sacrificing to Imperial Earth, with the Grand Imperial Dowager Tai Mu and the Grand Imperial Dowager Wende joining in the offering;',
    idiomatic:
      'On gengwu he performed the shan rite at Sheshou, sacrificing to Earth, with Empresses Tai Mu and Wende as associates;',
  },
  s0005: {
    literal: 'the empress served as secondary offerer, and Grand Consort Yan of Yue as final offerer.',
    idiomatic: 'the empress made the secondary offering and Grand Consort Yan of Yue the final offering.',
  },
  s0006: {
    literal: 'On xinwei he proceeded to the descent-from-shan altar.',
    idiomatic: 'On xinwei he descended to the shan altar.',
  },
  s0007: {
    literal: 'On renshen he proceeded to the Court-Audience Altar to receive congratulations.',
    idiomatic: 'On renshen he took his place at the Court-Audience Altar to receive homage.',
  },
  s0008: {
    literal:
      'Linde 3 was changed to Qianfeng 1; all civil and military officials in the procession and all Chinese and barbarian frontier lords and retired elders attending the new- and full-moon audiences—those of third rank and above were granted two grades of nobility; those of fourth rank and below of seventh rank and above received rank increments; those of eighth rank and below received one increment; merit registers advanced one turn.',
    idiomatic:
      'The era was renamed Qianfeng 1; every official in the cortège and every lord and retired elder gathered for homage—those of third rank or higher received two degrees of nobility; fourth through seventh received rank increases; eighth rank and below gained one step; all merit rolls advanced one turn.',
  },
  s0009: {
    literal:
      'All elders one hundred years and above were granted by patent the nominal rank of prefect of a lower prefecture, and women that of district lady;',
    idiomatic:
      'Elders aged one hundred or more were patent-appointed nominal prefects of lower prefectures, and women district ladies;',
  },
  s0010: {
    literal: 'those of ninety and eighty received graded ranks by tier.',
    idiomatic: 'ninety- and eighty-year-olds received tiered honors.',
  },
  s0011: {
    literal: 'Qizhou was granted tax remission for a year and a half, and the counties governing the sacred peaks for two years.',
    idiomatic: 'Qizhou was exempted from levies for eighteen months and the counties under the sacred peaks for two years.',
  },
  s0012: {
    literal: 'Every place traversed was excused from paying this year\'s land tax and levies.',
    idiomatic: 'Every region on the route was relieved of this year\'s taxes and corvée.',
  },
  s0013: {
    literal: 'Before the fifth day of the first month of Qianfeng 1, a general amnesty was granted throughout the realm and feasting for seven days.',
    idiomatic: 'Through the fifth day of Qianfeng 1\'s first month the court proclaimed a general amnesty and seven days of public feasting.',
  },
  s0014: {
    literal:
      'On guiyou he feasted the assembled ministers, staged the Nine Departments of Music, and bestowed gifts in varying measure; the banquet ended at the sun\'s declination.',
    idiomatic:
      'On guiyou he banqueted the ministers, presented the Nine Sets of Music, and gave graded gifts; the feast ended at midday.',
  },
  s0015: {
    literal: 'On bingzi Crown Prince Hong held a feast.',
    idiomatic: 'On bingzi Crown Prince Hong hosted a feast.',
  },
  s0016: {
    literal:
      'On dingchou, because the earlier grace had been slight, ranks of nobility, rank increments, and merit registers were universally advanced.',
    idiomatic:
      'On dingchou, judging the prior rewards too modest, the court advanced noble ranks, steps, and merit rolls for all.',
  },
  s0017: {
    literal: 'Men were granted ancient-style noble titles.',
    idiomatic: 'Every man received an antique-style noble title.',
  },
  s0018: {
    literal: 'Within Yanzhou\'s jurisdiction were established the Purple Cloud',
    idiomatic: 'In Yanzhou territory were founded the Purple Cloud',
  },
  s0019: {
    literal: 'Immortal Crane, and Longevity observatories, and Feng Luan, Feiyan, and Chonglun monasteries.',
    idiomatic: 'Immortal Crane, and Longevity observatories, and the Feng Luan, Feiyan, and Chonglun monasteries.',
  },
  s0020: {
    literal: 'Every prefecture in the realm was to have one Daoist observatory and one Buddhist monastery established.',
    idiomatic: 'Each prefecture in the empire was ordered to establish one Daoist abbey and one Buddhist monastery.',
  },
  s0021: {
    literal: 'On bingxu he departed from Mount Tai.',
    idiomatic: 'On bingxu he left Mount Tai.',
  },
  s0022: {
    literal: 'On jiawu he halted at Qufu County and visited the temple of Confucius.',
    idiomatic: 'On jiawu he stopped at Qufu and visited Confucius\'s temple.',
  },
  s0023: {
    literal:
      'He was posthumously enfeoffed as Grand Tutor, the shrine buildings were enlarged, and sacrifice was offered with the lesser livestock.',
    idiomatic:
      'Confucius was posthumously named Grand Tutor, the shrine was enlarged, and the court offered the lesser tai sacrifice.',
  },
  s0024: {
    literal: 'The descendants of Marquis Baosheng Delun were all excused from tax and corvée.',
    idiomatic: 'All descendants of Marquis Baosheng Delun were exempted from taxes and labor service.',
  },
  s0025: {
    literal: 'In the second month, on jiwei, he halted at Bozhou.',
    idiomatic: 'On jiwei of the second month he stopped at Bozhou.',
  },
  s0026: {
    literal:
      'He visited the temple of Lord Lao, posthumously styled him Supreme Mysterious Primordial Emperor, and built a memorial hall.',
    idiomatic:
      'He visited Lord Lao\'s temple, posthumously styled him Supreme Mysterious Primordial Emperor, and erected a memorial hall.',
  },
  s0027: {
    literal: 'That temple was given one magistrate and one assistant apiece.',
    idiomatic: 'The temple received one magistrate and one assistant each.',
  },
  s0028: {
    literal:
      'Guyang County was renamed Zhenyuan County, and households of the imperial surname within the county received a special tax remission of one year.',
    idiomatic:
      'Guyang was renamed Zhenyuan, and clansmen in the county received an extra year of tax exemption.',
  },
  s0029: {
    literal:
      'In the fourth month of summer, on jiachen, the imperial carriage returned from Mount Tai; he first visited the Imperial Ancestral Temple, then entered the palace.',
    idiomatic:
      'On jiachen of the fourth summer month the emperor returned from Mount Tai, visited the Imperial Ancestral Temple, and only then entered the palace.',
  },
  s0030: {
    literal: 'In the fifth month, on gengyin, Qianfeng Treasure cash was newly cast.',
    idiomatic: 'On gengyin of the fifth month the court minted Qianfeng Treasure coins.',
  },
  s0031: {
    literal: 'In the sixth month, on renyin, Goguryeo\'s Mo-li-zhī Gaisuwen died.',
    idiomatic: 'On renyin of the sixth month Gaisuwen, Mo-li-zhī of Goguryeo, died.',
  },
  s0032: {
    literal:
      'His son Namsaeng succeeded to his father\'s position, was driven out by his brother Namgeon, and sent his son Heumseong to the court to request surrender; an edict ordered Qibi Heli, General-in-Chief of the Left Martial Tigers Guard, to lead troops to receive him.',
    idiomatic:
      'His son Namsaeng took his place but was expelled by his brother Namgeon; Namsaeng sent his son Heumseong to court to surrender, and the emperor ordered Qibi Heli, general-in-chief of the Left Martial Tigers Guard, to march and meet him.',
  },
  s0033: {
    literal: 'In the seventh month of autumn, on yichou, Prince Yin Xu Lun was transferred and enfeoffed as Prince of Yu.',
    idiomatic: 'On yichou of the seventh autumn month Prince Yin Xu Lun was re-enfeoffed as Prince of Yu.',
  },
  s0034: {
    literal:
      'On gengwu Lu Dunxin, Left Attendant-at-the-Pivot and concurrent Right Chancellor, Baron of Jiaxing, citing age and illness begged to resign from the secretariat; he was appointed Grand Master of Accomplishment and retained concurrent charge of the Left Attendant-at-the-Pivot.',
    idiomatic:
      'On gengwu Lu Dunxin, left chancellor and Baron of Jiaxing, pleaded age and illness to leave the secretariat; he was made grand master of accomplishment while keeping charge of the left attendant-at-the-pivot.',
  },
  s0035: {
    literal:
      'Liu Rengui, Grand Master of Censors and concurrent Inspector of the Right Palace Guard, was made concurrent Right Chancellor and retained concurrent Inspector of the Right Palace Guard.',
    idiomatic:
      'Liu Rengui, grand master of censors and inspector of the right palace guard, became right chancellor and kept his guard post.',
  },
  s0036: {
    literal:
      'In the eighth month, on xinchou, Dou Dexuan, concurrent Chief of Ceremonial Affairs for the Directorate of Ritual and concurrent Left Chancellor, Baron of Julu, died.',
    idiomatic:
      'On xinchou of the eighth month Dou Dexuan, left chancellor and Baron of Julu, died.',
  },
  s0037: {
    literal:
      'On dingwei Wu Weiliang, Vice Director of the Palace Guards, and Wu Huaiyun, prefect of Zi, were executed, and their surname was changed to Fu.',
    idiomatic:
      'On dingwei Wu Weiliang, vice director of the palace guards, and Wu Huaiyun, prefect of Zi, were put to death and their clan name changed to Fu.',
  },
  s0038: {
    literal:
      'In the tenth month of winter, on jiyou, Li Ji, Minister of Works and Duke of Ying, was ordered as Grand Commander of the Liaodong Field Army to attack Goguryeo.',
    idiomatic:
      'On jiyou of the tenth winter month Li Ji, Duke of Ying and minister of works, was named grand commander of the Liaodong field army to attack Goguryeo.',
  },
  s0039: {
    literal:
      'In the first month of spring of the second year of Qianfeng, on dingchou, because from last winter solstice until this month there had been no rain or snow, he avoided the main hall, reduced his meals, and personally reviewed prisoners.',
    idiomatic:
      'On dingchou of the first spring month in Qianfeng 2, with no rain or snow since the previous winter solstice, the emperor left the main hall, ate sparingly, and reviewed prisoners in person.',
  },
  s0040: {
    literal: 'Qianfeng cash was abolished and Kaiyuan Tongbao cash was restored.',
    idiomatic: 'Qianfeng coins were withdrawn and Kaiyuan Tongbao coinage restored.',
  },
  s0041: {
    literal: 'In the second month, on wuxu, Prince of Fuling Li Yin died.',
    idiomatic: 'On wuxu of the second month Prince of Fuling Li Yin died.',
  },
  s0042: {
    literal: 'On xinchou Wannian Palace was restored to its former name Jiucheng Palace.',
    idiomatic: 'On xinchou Wannian Palace reverted to its old name, Jiucheng Palace.',
  },
  s0043: {
    literal:
      'In the sixth month of summer, on yimao, Yang Wu, Vice Director of the Western Terrace; Dai Zhide, Vice Director of the Western Terrace, Duke of Daiguo, and concurrent Inspector of the Heir\'s Left Palace Guard; Li Anqi, Rectifier of Remonstrance and concurrent Vice Director of the Eastern Terrace, Duke of Anping; and Zhang Wenguan, Vice Director of the Eastern Terrace, were all made of equal rank to the Three Offices of the Eastern and Western Terraces.',
    idiomatic:
      'On yimao of the sixth summer month Yang Wu; Dai Zhide, Duke of Daiguo and inspector of the heir\'s left guard; Li Anqi, Duke of Anping; and Zhang Wenguan—all vice directors of the eastern or western terrace—were made equal in rank to the three offices of both terraces.',
  },
  s0044: {
    literal: 'In the eighth month of autumn, on the jichou new moon, there was an eclipse of the sun.',
    idiomatic: 'On the jichou new moon of the eighth autumn month the sun was eclipsed.',
  },
  s0045: {
    literal: 'On bingchen Li Anqi, Vice Director of the Eastern Terrace, was sent out as chief administrator of the Jingzhou metropolitan area.',
    idiomatic: 'On bingchen Li Anqi, eastern-terrace vice director, was posted as chief administrator of Jingzhou.',
  },
  s0046: {
    literal:
      'In the first year of Zongzhang, in the first month of spring, on gengyin, an edict appointed Liu Shenli, Grand Supervisor of Repairs and concurrent Protector-General of Hanhai, Pacification Commissioner on the Western Regions route.',
    idiomatic:
      'On gengyin of the first spring month in Zongzhang 1 an edict named Liu Shenli, grand supervisor of repairs and protector-general of Hanhai, pacification commissioner for the western regions.',
  },
  s0047: {
    literal: 'On renzi Liu Rengui, Right Chancellor, was made Deputy Grand Commander on the Liaodong route.',
    idiomatic: 'On renzi Liu Rengui, right chancellor, became deputy grand commander on the Liaodong front.',
  },
  s0048: {
    literal:
      'On wuwu of the second month the Liaodong army routed fifty thousand men at Xuehe-shui, beheaded more than five thousand in the battle line, took more than thirty thousand captives, and seized weapons, cattle, and horses beyond counting.',
    idiomatic:
      'On wuwu of the second month the Liaodong army shattered fifty thousand men at Xuehe-shui, took five thousand heads in the field, more than thirty thousand prisoners, and countless arms, cattle, and horses.',
  },
  s0049: {
    literal:
      'On bingyin, because the Bright Hall system differed through the ages and since Han and Wei had grown ever more erroneous, additions and subtractions were made from antiquity and the present and a new design was drawn.',
    idiomatic:
      'On bingyin, finding Bright Hall regulations inconsistent across dynasties and ever more corrupt since Han and Wei, the court revised ancient and modern models and drew a new plan.',
  },
  s0050: {
    literal: 'An edict proclaimed a general amnesty and changed the era name to Zongzhang 1.',
    idiomatic: 'The court proclaimed a general amnesty and renamed the era Zongzhang 1.',
  },
  s0051: {
    literal: 'On wuyin of the second month he visited Jiucheng Palace.',
    idiomatic: 'On wuyin of the second month he went to Jiucheng Palace.',
  },
  s0052: {
    literal:
      'On jimao Chang\'an and Wannian were each divided to establish Qianfeng and Mingtang counties, administering separately within the capital.',
    idiomatic:
      'On jimao Chang\'an and Wannian were split to form Qianfeng and Mingtang counties, each governing a portion of the capital.',
  },
  s0053: {
    literal: 'On guiwei Crown Prince Hong performed the libation sacrifice at the Directorate of Education.',
    idiomatic: 'On guiwei Crown Prince Hong offered the libation at the imperial academy.',
  },
  s0054: {
    literal:
      'Yan Hui was posthumously enfeoffed as Junior Tutor to the Heir Apparent and Zeng Shen as Junior Mentor to the Heir Apparent.',
    idiomatic: 'Yan Hui was posthumously named junior tutor to the heir and Zeng Shen junior mentor to the heir.',
  },
  s0055: {
    literal: 'In the fourth month of summer, on bingchen, a comet appeared between the constellations Bi and Mao.',
    idiomatic: 'On bingchen of the fourth summer month a comet appeared between Bi and Mao.',
  },
  s0056: {
    literal:
      'On yichou the emperor avoided the main hall and reduced his meals, ordering civil and military officials inside and outside to submit sealed memorials speaking fully of faults.',
    idiomatic:
      'On yichou he left the main hall, ate sparingly, and ordered officials throughout the court and provinces to submit sealed memorials detailing his faults.',
  },
  s0057: {
    literal:
      'Thereupon the ministers said, "Though the star is a broom-star its light is slight; this is no national calamity and need not trouble Your Sagely Thought—we beg you to resume the main hall and restore your regular meals."',
    idiomatic:
      'The ministers urged, "The comet is faint; this is no national disaster and should not weigh on Your Majesty—please return to the main hall and your usual fare."',
  },
  s0058: {
    literal:
      'The emperor said, "Having received charge of the ancestral temples and governing the hundred millions, a reproof appears in heaven—a warning of my want of virtue; I should blame myself and cultivate virtue to expiate it."',
    idiomatic:
      'The emperor replied, "I hold the ancestral temples and govern the millions; heaven\'s warning shows my lack of virtue—I must examine myself and mend my conduct to avert it."',
  },
  s0059: {
    literal: 'The ministers advanced again, saying, "The broom-star in the northeast is a sign that Goguryeo will perish."',
    idiomatic: 'They pressed again: "The comet in the northeast foretells Goguryeo\'s fall."',
  },
  s0060: {
    literal: 'The emperor said, "The people of Goguryeo are my people.',
    idiomatic: 'He answered, "The people of Goguryeo are my own people.',
  },
  s0061: {
    literal: 'Having become lord of the myriad states, how can I shift blame onto a small border state!"',
    idiomatic: 'As lord of all states, how can I lay heaven\'s blame on a petty frontier kingdom!"',
  },
  s0062: {
    literal: 'He would not accede to their request.',
    idiomatic: 'He refused their plea.',
  },
  s0063: {
    literal: 'On yihai the comet vanished.',
    idiomatic: 'On yihai the comet disappeared.',
  },
  s0064: {
    literal: 'On xinsi Yang Wu, Vice Director of the Western Terrace, died.',
    idiomatic: 'On xinsi Yang Wu, western-terrace vice director, died.',
  },
  s0065: {
    literal: 'In the eighth month of autumn, on guiyou, he returned from Jiucheng Palace.',
    idiomatic: 'On guiyou of the eighth autumn month he returned from Jiucheng Palace.',
  },
  s0066: {
    literal:
      'In the ninth month, on guisi, Li Ji, Duke of Ying, crushed Goguryeo, took Pyongyang, and brought back captive its king Go Jang and the minister Namgeon and others.',
    idiomatic:
      'On guisi of the ninth month Li Ji, Duke of Ying, broke Goguryeo, seized Pyongyang, and brought home King Go Jang, Namgeon, and other captives.',
  },
  s0067: {
    literal:
      'The whole territory submitted; one hundred seventy walled places, 697,000 households; the land was made the Protectorate-General to Pacify the East, divided into forty-two prefectures.',
    idiomatic:
      'The whole country submitted—one hundred seventy walled towns and 697,000 households; the court made it the Protectorate-General to Pacify the East and divided it into forty-two prefectures.',
  },
  s0068: {
    literal: 'In the second year of Zongzhang, in the first month of spring, all legitimate sons of princes were enfeoffed as kings of commanderies.',
    idiomatic: 'In the first spring month of Zongzhang 2 every prince\'s eldest son by his principal wife was enfeoffed as a commandery king.',
  },
  s0069: {
    literal:
      'In the second month Zhang Wenguan, Vice Director of the Eastern Terrace, equal in rank to the Three Offices of the Eastern and Western Terraces and in charge of the Left Historiographer\'s office, took up his office and first entered the roster.',
    idiomatic:
      'In the second month Zhang Wenguan, eastern-terrace vice director of third rank and acting left historiographer, assumed his post and first took his seat in council.',
  },
  s0070: {
    literal: 'In the third month Hao Chujun, Vice Director of the Eastern Terrace, was made equal in rank to the Three Offices.',
    idiomatic: 'In the third month Hao Chujun, eastern-terrace vice director, was made equal in rank to the three offices.',
  },
  s0071: {
    literal: 'On guiyou the empress sacrificed in person to the Silkworm Ancestor.',
    idiomatic: 'On guiyou the empress personally offered to the Silkworm Ancestor.',
  },
  s0072: {
    literal: 'In the fourth month of summer, on yiyou, he visited Jiucheng Palace.',
    idiomatic: 'On yiyou of the fourth summer month he went to Jiucheng Palace.',
  },
  s0073: {
    literal: 'Two associate chief directors of guests and two associate chief directors of military affairs were established.',
    idiomatic: 'The court added two associate directors of guests and two associate directors of military affairs.',
  },
  s0074: {
    literal:
      'On gengzi 28,200 Goguryeo households, 1,080 carts, 3,300 oxen, 2,900 horses, and 60 camels were moved into the interior; Lai and Ying prefectures shipped them in relays and allotted them to vacant lands in provinces south of the Yangzi and Huai, in Shannan, and west of Bing and Liang.',
    idiomatic:
      'On gengzi 28,200 Goguryeo households with 1,080 carts, 3,300 oxen, 2,900 horses, and 60 camels were resettled inland; Lai and Ying sent them in relays to empty lands south of the Yangzi and Huai, in Shannan, and west of Bing and Liang.',
  },
  s0075: {
    literal: 'On the wushen new moon of the sixth month there was a solar eclipse.',
    idiomatic: 'On the wushen new moon of the sixth month the sun was eclipsed.',
  },
  s0076: {
    literal:
      'Kuo Prefecture had great wind and rain; seawater flooded the city walls of Yongjia and Angu counties, swept away 6,843 dwellings, drowned 9,070 people and 500 oxen, and damaged 4,150 qing of crops.',
    idiomatic:
      'A great storm struck Kuo Prefecture; the sea flooded Yongjia and Angu, destroying 6,843 homes, drowning 9,070 people and 500 oxen, and ruining 4,150 qing of fields.',
  },
  s0077: {
    literal: 'Ji Prefecture had great floods that washed away thousands of dwellings.',
    idiomatic: 'Ji Prefecture suffered heavy floods that swept away thousands of homes.',
  },
  s0078: {
    literal: 'Envoys were sent to relieve both.',
    idiomatic: 'The court sent envoys to aid both regions.',
  },
  s0079: {
    literal:
      'In the seventh month of autumn, nineteen prefectures in Jiannan—Yi, Lu, Xi, Mao, Ling, Qiong, Ya, Mian, Yi, Wei, Shi, Jian, Zi, Rong, Long, Guo, Zi, Pu, Sui, and others—suffered drought; the people were destitute, totaling 367,690 households; Commissioner of Court Delicacies Lu Li was sent to inquire and relieve with loans; on guisi the Jizhou metropolitan command reported that from the night of the thirteenth day of the sixth month rain fell until the twentieth, the water five chi deep, that night a sudden flood more than one zhang deep, destroying 14,390 dwellings and damaging 4,496 qing of fields.',
    idiomatic:
      'In the seventh autumn month drought struck nineteen Jiannan prefectures—Yi, Lu, Xi, Mao, Ling, Qiong, Ya, Mian, Yi, Wei, Shi, Jian, Zi, Rong, Long, Guo, Zi, Pu, Sui, and others—leaving 367,690 households in want; Lu Li, commissioner of court delicacies, was sent to inquire and lend relief; on guisi Jizhou reported rain from the night of the sixth month\'s thirteenth through the twentieth, waters five chi deep, then a flash flood over one zhang that wrecked 14,390 houses and spoiled 4,496 qing of cropland.',
  },
  s0080: {
    literal:
      'Qibi Heli, General-in-Chief of the Right Palace Guard and Duke of Liang, was sent as Grand Commander of the Sea-Route Field Army.',
    idiomatic:
      'Qibi Heli, general-in-chief of the right palace guard and Duke of Liang, was named grand commander of the sea-route field army.',
  },
  s0081: {
    literal: 'In the eighth month of autumn, on jiaxu, the Hanhai Protectorate was changed to the Protectorate-General to Pacify the North.',
    idiomatic: 'On jiaxu of the eighth autumn month Hanhai protectorate became the Protectorate-General to Pacify the North.',
  },
  s0082: {
    literal: 'In the ninth month, on jihai, he departed Jiucheng Palace.',
    idiomatic: 'On jihai of the ninth month he left Jiucheng Palace.',
  },
  s0083: {
    literal: 'On renyin he halted at Hualin and held a great hunt in Qi.',
    idiomatic: 'On renyin he paused at Hualin and held a great hunt in Qi.',
  },
  s0084: {
    literal: 'On yisi he reached Qi Prefecture.',
    idiomatic: 'On yisi he arrived at Qi Prefecture.',
  },
  s0085: {
    literal: 'Because Gaozu first served the Sui as prefect of Fufeng, a special amnesty was granted within Qi Prefecture.',
    idiomatic: 'Because Gaozu had first served the Sui as prefect of Fufeng, Qi Prefecture received a special amnesty.',
  },
  s0086: {
    literal:
      'Corvée laborers from Gaozu\'s time were promoted according to talent, and the aged were given cloth, grain, and silk in varying measure.',
    idiomatic:
      'Corvée workers from Gaozu\'s day were promoted for ability, and the elderly received graded gifts of cloth, grain, and silk.',
  },
  s0087: {
    literal: 'In the tenth month of winter, on dingsi, he returned from Jiucheng Palace.',
    idiomatic: 'On dingsi of the tenth winter month he returned from Jiucheng Palace.',
  },
  s0088: {
    literal:
      'On gengchen of the eleventh month corvée men from the nine circuits were mobilized to transport grain from Taiyuan warehouses to the capital.',
    idiomatic:
      'On gengchen of the eleventh month laborers from the nine circuits were levied to haul grain from Taiyuan granaries to the capital.',
  },
  s0089: {
    literal: 'On dinghai Prince of Yu Xu Lun was transferred and enfeoffed as Prince of Ji and ordered to bear the single name Lun.',
    idiomatic: 'On dinghai Prince of Yu Xu Lun was re-enfeoffed as Prince of Ji and ordered to use the single name Lun.',
  },
  s0090: {
    literal:
      'In the twelfth month, on wushen, Li Ji, Duke of Ying, Minister of Works and Grand Preceptor to the Heir Apparent, died.',
    idiomatic:
      'On wushen of the twelfth month Li Ji, Duke of Ying, minister of works and grand preceptor to the heir, died.',
  },
  s0091: {
    literal: 'That winter there was no snow.',
    idiomatic: 'That winter no snow fell.',
  },
  s0092: {
    literal:
      'In the first year of Xianheng, in the first month of spring, on dingchou, Liu Rengui, Right Chancellor, Baron of Lecheng, retired.',
    idiomatic:
      'On dingchou of the first spring month in Xianheng 1 Liu Rengui, right chancellor and Baron of Lecheng, retired from office.',
  },
  s0093: {
    literal: 'On xinmao the Liaodong territory was organized into provinces and counties.',
    idiomatic: 'On xinmao the Liaodong lands were mapped into prefectures and counties.',
  },
  s0094: {
    literal: 'In the second month, on wushen, because of drought he personally reviewed prisoners and prayed at famous mountains and rivers.',
    idiomatic: 'On wushen of the second month, with drought prevailing, he reviewed prisoners in person and prayed at famous mountains and rivers.',
  },
  s0095: {
    literal: 'On guichou the sun at its rising was the color of ochre.',
    idiomatic: 'On guichou the sun rose the color of red ochre.',
  },
  s0096: {
    literal: 'On the jiaxu new moon of the third month a general amnesty was proclaimed and the era name changed to Xianheng 1.',
    idiomatic: 'On the jiaxu new moon of the third month the court proclaimed a general amnesty and renamed the era Xianheng 1.',
  },
  s0097: {
    literal: 'On dingchou of the third month Penglai Palace was renamed Hanyuan Hall.',
    idiomatic: 'On dingchou of the third month the court renamed Penglai Palace as Hanyuan Hall.',
  },
  s0098: {
    literal:
      'On renchen Xu Jingzong, Junior Tutor to the Heir Apparent and equal in rank to the Three Offices, retired.',
    idiomatic:
      'On renchen Xu Jingzong, junior tutor to the heir and of third rank at both terraces, retired.',
  },
  s0099: {
    literal:
      'In the fourth month of summer Tibet raided and seized eighteen prefectures including Baizhou, and together with Khotan attacked and took the Boluo fortress of Kucha.',
    idiomatic:
      'In the fourth summer month Tibet raided and captured eighteen prefectures including Baizhou, and with Khotan stormed and took Kucha\'s Boluo fortress.',
  },
  s0100: {
    literal: 'The Four Garrisons of Anxi were abolished.',
    idiomatic: 'The Four Garrisons of Anxi were disbanded.',
  },
};

const path = 'translations/current_translation_jiutangshu.json';
const data = JSON.parse(readFileSync(path, 'utf8'));
if (data.metadata.chapter !== '005') {
  throw new Error(`Expected chapter 005, got ${data.metadata.chapter}`);
}
let applied = 0;
for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${s.id}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations (expected', Object.keys(T).length, ')');
