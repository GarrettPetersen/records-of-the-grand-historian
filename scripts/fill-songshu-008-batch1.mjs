#!/usr/bin/env node
import fs from 'node:fs';

const path = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const T = {
  s0001: {
    literal: 'Emperor Ming, posthumous title Taizong, taboo name Yu, courtesy name Xiubing, childhood name Rongqi, was the eleventh son of Emperor Wen.',
    idiomatic: 'Emperor Ming, posthumous title Taizong, whose personal name was Yu, courtesy name Xiubing, and childhood name Rongqi, was the eleventh son of Emperor Wen.',
  },
  s0002: {
    literal: 'He was born on wuyin day in the tenth month of the sixteenth year of Yuanjia.',
    idiomatic: 'He was born on the wuyin day of the tenth month in the sixteenth year of Yuanjia.',
  },
  s0003: {
    literal: 'In the twenty-fifth year he was enfeoffed as Prince of Huaiyang with a fief of two thousand households.',
    idiomatic: 'In the twenty-fifth year he was enfeoffed as Prince of Huaiyang with a fief of two thousand households.',
  },
  s0004: {
    literal: 'In the twenty-ninth year his enfeoffment was changed to Prince of Xiangdong.',
    idiomatic: 'In the twenty-ninth year his title was changed to Prince of Xiangdong.',
  },
  s0005: {
    literal: 'When the Assassin Prince seized the throne by murder, [the Prince] was made General of Galloping Cavalry and given the additional post of Supervisor of Attendants.',
    idiomatic: 'When the Assassin Prince murdered his way to the throne, the Prince was appointed General of Galloping Cavalry and given the additional post of Supervisor of Attendants.',
  },
  s0006: {
    literal: 'When Emperor Xiaowu ascended the throne, [the Prince] was made Supervisor of the Palace Library, then promoted to General Who Conquers and Administrator of Nanlanling and Xiapi commanderies, concurrently holding the garrison command at Shitou.',
    idiomatic: 'When Emperor Xiaowu took the throne, the Prince was made Supervisor of the Palace Library, then promoted to General Who Conquers and Administrator of Nanlanling and Xiapi, with concurrent command of the Shitou garrison.',
  },
  s0007: {
    literal: 'In the first year of Xiaojian he was transferred as Administrator of Nan Pengcheng and Donghai commanderies; his rank as general was unchanged, and he was stationed at Jingkou.',
    idiomatic: 'In the first year of Xiaojian he was reassigned as Administrator of Nan Pengcheng and Donghai while keeping his general\'s rank, and he was posted at Jingkou.',
  },
  s0008: {
    literal: 'That same year he was summoned to serve as Colonel of the Garrison.',
    idiomatic: 'That same year he was recalled to serve as Colonel of the Garrison.',
  },
  s0009: {
    literal: 'In the second year he was promoted to Attendant-in-Ordinary, concurrently holding the post of General Who Attacks in Mobile Warfare.',
    idiomatic: 'In the second year he was promoted to Attendant-in-Ordinary and made General Who Attacks in Mobile Warfare.',
  },
  s0010: {
    literal: 'In the third year he was transferred to Minister of the Guard; Attendant-in-Ordinary remained unchanged.',
    idiomatic: 'In the third year he was transferred to Minister of the Guard while retaining his post as Attendant-in-Ordinary.',
  },
  s0011: {
    literal: 'He was also made General of the Left Guard; Minister of the Guard remained unchanged.',
    idiomatic: 'He was also appointed General of the Left Guard while continuing as Minister of the Guard.',
  },
  s0012: {
    literal: 'In the first year of Daming he was transferred to Colonel of the Garrison; Minister of the Guard remained unchanged.',
    idiomatic: 'In the first year of Daming he was made Colonel of the Garrison while remaining Minister of the Guard.',
  },
  s0013: {
    literal: 'In the third year he was made Minister of Justice, concurrently General Who Attacks in Mobile Warfare; Minister of the Guard remained unchanged.',
    idiomatic: 'In the third year he was appointed Minister of Justice and General Who Attacks in Mobile Warfare while still serving as Minister of the Guard.',
  },
  s0014: {
    literal: 'In the seventh year he was promoted to General of the Palace Guard.',
    idiomatic: 'In the seventh year he was promoted to General of the Palace Guard.',
  },
  s0015: {
    literal: 'In the eighth year he was sent out with Bearer of the Staff with Full Powers, as Commander-in-Chief of military affairs for Xu and Yan provinces and Liang commandery in Yuzhou, General Who Pacifies the North and Inspector of Xuzhou, and granted one set of drums and pipes.',
    idiomatic: 'In the eighth year he was sent out bearing the staff with full powers as Commander-in-Chief of military affairs for Xu and Yan provinces and Liang commandery in Yuzhou, appointed General Who Pacifies the North and Inspector of Xuzhou, and granted one set of drums and pipes.',
  },
  s0016: {
    literal: 'That year he was summoned as Attendant-in-Ordinary and General Who Protects the Army.',
    idiomatic: 'That year he was recalled as Attendant-in-Ordinary and General Who Protects the Army.',
  },
  s0017: {
    literal: 'Before accepting the appointment, he was again made General of the Palace Guard; Attendant-in-Ordinary remained unchanged.',
    idiomatic: 'Before he could take up the new post, he was again made General of the Palace Guard while remaining Attendant-in-Ordinary.',
  },
  s0018: {
    literal: 'At the end of Jinghe in the Deposed Emperor\'s reign, the Prince entered the capital for audience and was detained in the capital.',
    idiomatic: 'At the end of the Jinghe era under the Deposed Emperor, the Prince came to court for an audience and was kept in the capital.',
  },
  s0019: {
    literal: 'The Deposed Emperor executed chief ministers and slaughtered great officials, constantly fearing plotters; suspicious and afraid of his uncles, he confined them all within the palace halls. Toward the Prince he was rude; the details are in the princes\' biographies.',
    idiomatic: 'The Deposed Emperor killed chief ministers and slaughtered senior officials, always fearing conspirators. Suspicious of his uncles, he confined them within the palace halls and treated the Prince with gross disrespect; the full account appears in the biographies of the princes.',
  },
  s0020: {
    literal: 'Then the Prince was handed over to the Court of Justice; within one night he was pardoned.',
    idiomatic: 'The Prince was then handed over to the Court of Justice, but within a single night he was pardoned.',
  },
  s0021: {
    literal: 'Instances when harm was about to be inflicted upon him were not few, before and after.',
    idiomatic: 'More than once, before and after, he narrowly escaped plans to destroy him.',
  },
  s0022: {
    literal: 'When it was finally decided to harm the Prince, the next morning he should have met disaster.',
    idiomatic: 'Once the Deposed Emperor had settled on killing the Prince, he was to have been destroyed the very next morning.',
  },
  s0023: {
    literal: 'The Prince had already secretly plotted together with his trusted men Ruan Tianfu, Li Dao\'er, and others.',
    idiomatic: 'The Prince had already entered into a secret plot with his trusted followers Ruan Tianfu, Li Dao\'er, and others.',
  },
  s0024: {
    literal: 'At that time those around the Deposed Emperor constantly feared calamity would reach them; everyone had divergent intentions.',
    idiomatic: 'By then those close to the Deposed Emperor lived in constant fear for their lives, and each man nursed his own separate design.',
  },
  s0025: {
    literal: 'Only Direct Attendant-General Zong Yue, Tan Jin, Tong Taiyi, and several others were his trusted men—all fierce tigers with capacity, long in palace service, all feared and submitted to—so none dared act.',
    idiomatic: 'Only Direct Attendant-General Zong Yue, Tan Jin, Tong Taiyi, and a few others remained his trusted inner circle—men as fierce as tigers, strong in action, and long established in palace service, whom everyone feared and obeyed—so no one dared move against them.',
  },
  s0026: {
    literal: 'That evening Yue and the others all lodged outside.',
    idiomatic: 'That night Yue and the others were all billeted outside the palace.',
  },
  s0027: {
    literal: 'Tianfu and Dao\'er then joined with Shou Jizhi and others to kill the Deposed Emperor in the rear hall.',
    idiomatic: 'Tianfu and Dao\'er then joined Shou Jizhi and others in killing the Deposed Emperor in the rear hall.',
  },
  s0028: {
    literal: 'It was the night of the twenty-ninth day of the eleventh month.',
    idiomatic: 'This took place on the night of the twenty-ninth day of the eleventh month.',
  },
  s0029: {
    literal: 'When the affair was settled, the Prince did not yet know what to do.',
    idiomatic: 'Once the deed was done, the Prince still did not know what he should do next.',
  },
  s0030: {
    literal: 'Prince Xiuren of Jian\'an immediately declared himself subject and led him up to the Western Hall, mounted the imperial seat, and summoned the various great ministers.',
    idiomatic: 'Prince Xiuren of Jian\'an at once declared himself his subject, led him up to the Western Hall, seated him on the imperial throne, and summoned the senior ministers.',
  },
  s0031: {
    literal: 'At that time the affair arose in sudden haste; the Prince lost his shoes and went barefoot to the Western Hall, still wearing a black cap.',
    idiomatic: 'The coup had erupted in sudden confusion: the Prince lost his shoes and ran barefoot to the Western Hall, still wearing a black cap.',
  },
  s0032: {
    literal: 'When seated, Xiuren called the Master of Imperial Wardrobes to replace it with a white cap and ordered the imperial guard of honor prepared.',
    idiomatic: 'Once he was seated, Xiuren summoned the Master of Imperial Wardrobes to bring a white cap in its place and ordered the imperial guard of honor made ready.',
  },
  s0033: {
    literal: 'Although he had not yet ascended the throne, all matters were executed in the name of directoral orders.',
    idiomatic: 'Although he had not yet formally ascended the throne, every affair was carried out under directoral orders in his name.',
  },
  s0034: {
    literal: 'On jiwei day Minister and Inspector of Yangzhou Prince Zishang of Yuzhang and the Princess of Shanyin were both granted death.',
    idiomatic: 'On the jiwei day Minister and Inspector of Yangzhou Prince Zishang of Yuzhang and the Princess of Shanyin were both ordered to take their own lives.',
  },
  s0035: {
    literal: 'Zong Yue, Tan Jin, and Tong Taiyi plotted rebellion and were executed.',
    idiomatic: 'Zong Yue, Tan Jin, and Tong Taiyi plotted rebellion and were put to death.',
  },
  s0036: {
    literal: 'On gengshen, first day of the twelfth month, a directoral order made Grand Minister of Works Prince Kui of Donghai Supervisor of the Secretariat and Grand Marshal; General Who Pacifies the Army and Inspector of Jiangzhou Prince Zixun of Jin\'an was promoted to General of Chariots and Cavalry with Staff equal to Three Divisions.',
    idiomatic: 'On the gengshen day, the first of the twelfth month, a directoral order appointed Grand Minister of Works Prince Kui of Donghai Supervisor of the Secretariat and Grand Marshal, and promoted General Who Pacifies the Army and Inspector of Jiangzhou Prince Zixun of Jin\'an to General of Chariots and Cavalry with protocol equal to a three-division office.',
  },
  s0037: {
    literal: 'On guihai, newly appointed General-in-Chief Who Runs Fast Prince Xiuren of Jian\'an was made Minister, Director of the Masters of Writing, and Inspector of Yangzhou; General Who Pacifies the Army with Staff equal to Three Divisions Prince Xiuyou of Shanyang was promoted to General-in-Chief Who Runs Fast and Inspector of Jingzhou.',
    idiomatic: 'On the guihai day newly appointed General-in-Chief Who Runs Fast Prince Xiuren of Jian\'an was made Minister, Director of the Masters of Writing, and Inspector of Yangzhou, while General Who Pacifies the Army with protocol equal to a three-division office Prince Xiuyou of Shanyang was promoted to General-in-Chief Who Runs Fast and Inspector of Jingzhou.',
  },
  s0038: {
    literal: 'Minister of the Guard for Chongxian Prince Xiufan of Guiyang was made General Who Pacifies the North and Inspector of Southern Xuzhou.',
    idiomatic: 'Minister of the Guard for Chongxian Prince Xiufan of Guiyang was appointed General Who Pacifies the North and Inspector of Southern Xuzhou.',
  },
  s0039: {
    literal: 'On yichou the enfeoffment of Prince Zisui of Anlu was changed to Prince of Jiangxia.',
    idiomatic: 'On the yichou day Prince Zisui of Anlu was re-enfeoffed as Prince of Jiangxia.',
  },
  s0040: {
    literal: 'On bingyin in the twelfth month of winter, first year of Taishi, the Prince ascended the imperial throne.',
    idiomatic: 'On the bingyin day of the twelfth month in the first year of Taishi, the Prince ascended the imperial throne.',
  },
  s0041: {
    literal: 'An edict said:',
    idiomatic: 'An edict said:',
  },
  s0042: {
    literal: 'The High Ancestor Martial Emperor\'s virtue filled the four seas; his transforming influence extended to the nine domains.',
    idiomatic: 'The High Ancestor Martial Emperor\'s virtue reached through the four seas, and his transforming influence spread across the nine domains.',
  },
  s0043: {
    literal: 'The Great Ancestor Civil Emperor secured the foundation with Daming;',
    idiomatic: 'The Great Ancestor Civil Emperor established the dynasty\'s foundation in the Daming era;',
  },
  s0044: {
    literal: 'Emperor Xiaowu with martial power quelled disorder.',
    idiomatic: 'Emperor Xiaowu with martial power quelled the realm\'s disorder.',
  },
  s0045: {
    literal: 'Where sun and moon shine, they climbed mountains and sailed seas;',
    idiomatic: 'Wherever sun and moon shone, men climbed mountains and crossed seas to submit;',
  },
  s0046: {
    literal: 'Where wind and rain reach, they cut their lapels and adjusted their sashes.',
    idiomatic: 'wherever wind and rain fell, they cut their lapels and bound up their sashes in obedience.',
  },
  s0047: {
    literal: 'Thus their enterprise surpassed flourishing Han; their renown overflowed august Zhou.',
    idiomatic: 'Thus their achievement outshone the height of Han, and their fame surpassed the glory of Zhou.',
  },
  s0048: {
    literal: 'Ziye was vicious and stupid by nature from Heaven; cruelty and rebellion formed his character. A human face with a beast\'s heart appeared from childhood; perverse of the Way and ruined in virtue, this was evident these recent years.',
    idiomatic: 'Ziye was savage and stupid from birth, cruelty and rebellion bred into his nature. Even as a child he showed a human face hiding a beast\'s heart; in recent years his perversity and moral ruin have become plain to all.',
  },
  s0049: {
    literal: 'He trampled the five constants, abandoned the three orthodoxies, deceived Heaven on high, and poison flowed through the realm—truly never since the opening of the world, never heard of in written records.',
    idiomatic: 'He trampled the five constants, cast aside the three orthodoxies, deceived Heaven itself, and let poison seep through the realm—deeds unheard of since the world began and unrecorded in any chronicle.',
  },
  s0050: {
    literal: 'Twice he suffered the curtained seclusion, yet without a day\'s grief;',
    idiomatic: 'Twice he entered the curtained mourning seclusion, yet never mourned for a single day;',
  },
  s0051: {
    literal: 'While hempen mourning garments were on his person, he deeply indulged in pleasures of the northern quarters.',
    idiomatic: 'even while the hempen garments of deepest mourning were upon him, he abandoned himself to the pleasures of the pleasure quarters.',
  },
  s0052: {
    literal: 'Tigers and rhinos could not be caged; relying on the river he must reveal himself—thus he executed and exterminated chief ministers, exhausting the cruelty of rebellion; abused and harmed state ministers, carrying out punishment to the extermination of families.',
    idiomatic: 'Like a tiger or rhinoceros that no cage could hold, his cruelty could not be concealed—so he slaughtered chief ministers in the full extremity of treason, abused the pillars of state, and carried punishments to the annihilation of whole clans.',
  },
  s0053: {
    literal: 'Ziluan was born of the same womb; because of a past grudge he was destroyed and killed.',
    idiomatic: 'Ziluan was his own brother by the same mother, yet an old grievance moved him to destroy and kill him.',
  },
  s0054: {
    literal: 'The brothers Jingyou were annihilated over a grudge in the eye.',
    idiomatic: 'The brothers Jingyou were wiped out over the smallest slight.',
  },
  s0055: {
    literal: 'He summoned and pressured Yiyang, intending to add slaughter and mincing.',
    idiomatic: 'He summoned and pressed the Prince of Yiyang, intending to butcher and mince him.',
  },
  s0056: {
    literal: 'He insulted and humiliated imperial princes by marriage, flogging princesses and consorts.',
    idiomatic: 'He humiliated imperial princes related by marriage and flogged princesses and imperial consorts.',
  },
  s0057: {
    literal: 'He seized appointment of those around him, installed a bastard as heir, indulged in drunkenness at court, and spread lewdness through the realm.',
    idiomatic: 'He placed his favorites in office, installed a bastard as heir apparent, drank to excess at court, and spread debauchery throughout the realm.',
  },
  s0058: {
    literal: 'His conduct defiled Dongling; his deeds polluted flying and running creatures.',
    idiomatic: 'His conduct shamed even the licentious tales of Dongling; his deeds befouled bird and beast alike.',
  },
  s0059: {
    literal: 'Accumulated guilt without limit; day by day it deepened.',
    idiomatic: 'His accumulated crimes knew no limit and deepened with every passing day.',
  },
  s0060: {
    literal: 'Recently he then plotted to violate the spirit palace, his ambition spied at the imperial tally; he would unleash the punishments of dismemberment and boiling, and give free rein to the hearts of Shang and Dun.',
    idiomatic: 'Recently he plotted to violate the imperial tombs and cast his eyes upon the throne itself; he would have unleashed punishments of dismemberment and boiling and indulged the cruelty of kings Shang and Li.',
  },
  s0061: {
    literal: 'He also wished to poison with zhen Prince Chongxian, extending cruelty to his uncles; the affair matched palace gates, and the rumor filled the capital.',
    idiomatic: 'He also planned to poison Prince Chongxian and extend his cruelty to his uncles; the plot touched the inner palace gates, and word of it filled the capital.',
  },
  s0062: {
    literal: 'Owls, owlets, and petty lads—all were favored and intimate; loyal officials of the court were invariably slaughtered and thwarted.',
    idiomatic: 'Owls, fledglings, and petty lads were all favored intimates, while loyal court officials were slaughtered without exception.',
  },
  s0063: {
    literal: 'Orders for arrest and seizure—ferocious tigers linked wheel tracks;',
    idiomatic: 'Orders for arrest and seizure went out in unbroken streams, like wheel tracks left by ravening tigers;',
  },
  s0064: {
    literal: 'Envoys of plunder—naked blades faced one another.',
    idiomatic: 'and plundering envoys went forth until naked blades confronted one another on every road.',
  },
  s0065: {
    literal: 'All officials lived in peril; none had ground to keep head intact;',
    idiomatic: 'Every official lived in terror, with no safe ground on which to keep his head;',
  },
  s0066: {
    literal: 'The myriad people were heartsick; wives and children could no longer protect one another.',
    idiomatic: 'and the common people were heartsick, unable even to protect their wives and children.',
  },
  s0067: {
    literal: 'Therefore ghosts wailed and mountains shrieked, stars hooked and blood fell; the sacred vessel nearly fell from the chariot reins, and the luminous fortune perilously hung from the tassels.',
    idiomatic: 'Ghosts wailed and mountains screamed, stars bent and blood rained down; the sacred vessel nearly slipped from the charioteer\'s grasp, and the dynasty\'s fortune hung by a thread from the imperial tassels.',
  },
  s0068: {
    literal: 'On jisi, General Who Pacifies the West and Inspector of Southern Yuzhou Liu Zunkao was made Special Grand Master and Right Grand Master of the Palace; General Who Assists the State and Administrator of Liyang and Nan Qiao commanderies Prince Jingsu of Jianping was made Inspector of Southern Yuzhou.',
    idiomatic: 'On the jisi day General Who Pacifies the West and Inspector of Southern Yuzhou Liu Zunkao was appointed Special Grand Master and Right Grand Master of the Palace, and General Who Assists the State and Administrator of Liyang and Nan Qiao commanderies Prince Jingsu of Jianping was made Inspector of Southern Yuzhou.',
  },
  s0069: {
    literal: 'On gengwu, Inspector of Jingzhou Prince Zixu of Linhai was made General Who Pacifies the Army; Inspector of Southern Xuzhou Prince Ziren of Yongjia was made General of the Center Army, [1] General of the Left Guard Liu Daolong was made Colonel of the Garrison.',
    idiomatic: 'On the gengwu day Inspector of Jingzhou Prince Zixu of Linhai was appointed General Who Pacifies the Army; Inspector of Southern Xuzhou Prince Ziren of Yongjia was made General of the Center Army; [1] and General of the Left Guard Liu Daolong was appointed Colonel of the Garrison.',
  },
  s0070: {
    literal: 'On xinwei the enfeoffment of Prince Zichan of Linhe was changed to Prince of Nanping; Prince Ziyu of Jinxi was changed to Prince of Luling.',
    idiomatic: 'On the xinwei day Prince Zichan of Linhe was re-enfeoffed as Prince of Nanping, and Prince Ziyu of Jinxi as Prince of Luling.',
  },
  s0071: {
    literal: 'On renshen, Left Vice Director of the Masters of Writing Wang Jingwen was made Director of the Masters of Writing.',
    idiomatic: 'On the renshen day Left Vice Director of the Masters of Writing Wang Jingwen was promoted to Director of the Masters of Writing.',
  },
  s0072: {
    literal: 'Newly appointed Colonel of the Garrison Liu Daolong died.',
    idiomatic: 'Liu Daolong, newly appointed Colonel of the Garrison, died.',
  },
  s0073: {
    literal: 'On guiyou, [2] an edict said: "I have quelled disorder and settled the people, and have received the luminous fortune.',
    idiomatic: 'On the guiyou day, [2] an edict said: "I have quelled disorder and brought peace to the people, and have received Heaven\'s luminous mandate.',
  },
  s0074: {
    literal: 'The great design is first made; the Way is reformed with renewal alone.',
    idiomatic: 'A new order is being forged, and the Way itself is being remade.',
  },
  s0075: {
    literal: 'Yet the state suffered frequent calamities; benevolent grace was unevenly blocked.',
    idiomatic: 'Yet the state has suffered repeated calamities, and benevolent grace has not reached everywhere equally.',
  },
  s0076: {
    literal: 'Each reflection keeps me sleepless with guilt; I know not how to cross over.',
    idiomatic: 'Each time I reflect on this I lie awake in guilt, not knowing how to set things right.',
  },
  s0077: {
    literal: 'Touring the regions and inquiring into customs is the first priority in extending governance; imperial envoys may be dispatched separately on a wide scale to seek the people\'s afflictions, examine the goodness of governors and prefects, and collect the excellence of village lanes.',
    idiomatic: 'Touring the realm and learning its customs must come first in good government. Let imperial envoys be sent out broadly to seek out the people\'s hardships, assess the merit of governors and magistrates, and gather reports of virtue from village lanes.',
  },
  s0078: {
    literal: 'If prison cases long detain the wrongly accused, injuring people and harming teaching—they should report the matter in full.',
    idiomatic: 'Where prison cases long detain the innocent and harm both the people and public morals, let the facts be reported in full.',
  },
  s0079: {
    literal: 'Widowers, widows, orphans, solitaries, the disabled and six kinds of affliction—those unable to support themselves—let commanderies and counties generously measure out relief.',
    idiomatic: 'Widowers, widows, orphans, the solitary, the disabled, and those suffering the six afflictions who cannot support themselves should receive generous measured relief from their commanderies and counties.',
  },
  s0080: {
    literal: 'Chaste wives, filial sons, high conduct and hardworking farming—report in detail item by item.',
    idiomatic: 'Chaste wives, filial sons, persons of outstanding conduct, and diligent farmers should be reported in full, item by item.',
  },
  s0081: {
    literal: '[3] Strive to inquire into songs from the lanes, widely receive excellent counsel; fully exhaust the intent of the imperial envoys, as though I personally examined them.',
    idiomatic: '[3] Hear the songs of the common people, welcome good counsel from every quarter, and let the envoys carry out their mission fully, as though I myself were reviewing each report.',
  },
  s0082: {
    literal: '" On yihai, the birth mother Lady Shen was posthumously honored as Empress Xuan.',
    idiomatic: '" On the yihai day the Emperor\'s birth mother, Lady Shen, was posthumously honored as Empress Xuan.',
  },
  s0083: {
    literal: 'General of the Rear Guard Yuan Hong was made Inspector of Si; former Chief Clerk of the General of the Right Yin Yan was made Inspector of Yu.',
    idiomatic: 'General of the Rear Guard Yuan Hong was appointed Inspector of Si, and former Chief Clerk of the General of the Right Yin Yan was appointed Inspector of Yu.',
  },
  s0084: {
    literal: 'On bingzi, an edict said: "The imperial house has many troubles; waste and expense grow ever broader; moreover harvests have failed for years; public and private are impoverished.',
    idiomatic: 'On the bingzi day an edict said: "The imperial house has endured many troubles; waste and expense grow ever greater; harvests have failed for years, and both public and private coffers are exhausted.',
  },
  s0085: {
    literal: 'Now we deliberately practice austerity to broadly relieve the times\' hardship; government Way is not yet trusted—in sighs and shame this accumulates.',
    idiomatic: 'We must now deliberately practice austerity to relieve the hardship of the age, yet government has not yet won the people\'s trust—a burden of sighs and shame weighs upon us.',
  },
  s0086: {
    literal: 'The Chief Steward\'s provision of meals should be examined for detail on reductions; the Imperial Workshop and Palace Storehouse\'s carved inscriptions and seal engravings and useless items—all exempted and reduced; strive to preserve simplicity, to match my heart.',
    idiomatic: 'Let the Chief Steward\'s provision of meals be reviewed in detail for cuts; let carved ornament, seal engraving, and every useless item in the Imperial Workshop and Palace Storehouse be abolished or reduced. Preserve simplicity in all things, as my heart desires.',
  },
  s0087: {
    literal: '" On wuyin, Empress Dowager Chong was elevated to Grand Empress Dowager Chongxian.',
    idiomatic: '" On the wuyin day Empress Dowager Chong was elevated to Grand Empress Dowager Chongxian.',
  },
  s0088: {
    literal: 'Empress Wang was installed.',
    idiomatic: 'Empress Wang was installed.',
  },
  s0089: {
    literal: 'Prince Zixun of Jin\'an, General Who Pacifies the Army and Inspector of Jiangzhou, raised troops in rebellion; Chief Clerk of the Pacifying Army Deng Wan was his chief plotter; Inspector of Yong Yuan Yi led troops to join him.',
    idiomatic: 'Prince Zixun of Jin\'an, General Who Pacifies the Army and Inspector of Jiangzhou, rose in rebellion; Chief Clerk of the Pacifying Army Deng Wan was his chief strategist, and Inspector of Yong Yuan Yi marched to join him.',
  },
  s0090: {
    literal: 'On xinsi, Prince Xiuyou of Shanyang, General-in-Chief Who Runs Fast and former Inspector of Jingzhou, was changed to Inspector of Jiangzhou; Inspector of Jingzhou Prince Zixu of Linhai remained in his original post.',
    idiomatic: 'On the xinsi day Prince Xiuyou of Shanyang, General-in-Chief Who Runs Fast and former Inspector of Jingzhou, was reassigned as Inspector of Jiangzhou, while Inspector of Jingzhou Prince Zixu of Linhai remained in his original post.',
  },
  s0091: {
    literal: 'General of the Palace Guard Wang Xuamo was given the additional title General Who Pacifies the Army.',
    idiomatic: 'General of the Palace Guard Wang Xuamo was given the additional title General Who Pacifies the Army.',
  },
  s0092: {
    literal: 'On renwu, the imperial carriage visited the Imperial Ancestral Temple.',
    idiomatic: 'On the renwu day the Emperor visited the Imperial Ancestral Temple.',
  },
  s0093: {
    literal: 'On jiashen, Rear General and Inspector of Ying Prince Zisui of Anlu was promoted to General Who Punishes the South; General of the Right and Administrator of Kuaiji Prince Zifang of Xunyang was promoted to General Who Pacifies the East; General of the Van and Inspector of Jing Prince Zixu of Linhai was promoted to General Who Pacifies the West.',
    idiomatic: 'On the jiashen day Rear General and Inspector of Ying Prince Zisui of Anlu was promoted to General Who Punishes the South; General of the Right and Administrator of Kuaiji Prince Zifang of Xunyang was promoted to General Who Pacifies the East; and General of the Van and Inspector of Jing Prince Zixu of Linhai was promoted to General Who Pacifies the West.',
  },
  s0094: {
    literal: 'Zisui, Zifang, and Zixu all refused the orders and raised troops in joint rebellion.',
    idiomatic: 'Zisui, Zifang, and Zixu all refused their appointments and rose in joint rebellion.',
  },
  s0095: {
    literal: 'On wuzi, newly appointed General of the Center Army Prince Ziren of Yongjia was made General Who Protects the Army.',
    idiomatic: 'On the wuzi day newly appointed General of the Center Army Prince Ziren of Yongjia was made General Who Protects the Army.',
  },
  s0096: {
    literal: 'Second year, spring, first month, jichou first day of new moon—because of military affairs the court audience was not held.',
    idiomatic: 'In the second year, on the jichou day, the first of the first month of spring, the regular court audience was not held because of military affairs.',
  },
  s0097: {
    literal: 'On gengyin, Grand Master of the Golden Seal and Purple Ribbon Wang Senglang was made Left Grand Master of the Palace with Staff equal to Three Divisions.',
    idiomatic: 'On the gengyin day Grand Master of the Golden Seal and Purple Ribbon Wang Senglang was appointed Left Grand Master of the Palace with protocol equal to a three-division office.',
  },
  s0098: {
    literal: 'On renchen, Prince Xiuyou of Shanyang, General-in-Chief Who Runs Fast and Inspector of Jiangzhou, was changed to Inspector of Southern Yuzhou, stationed at Liyang.',
    idiomatic: 'On the renchen day Prince Xiuyou of Shanyang, General-in-Chief Who Runs Fast and Inspector of Jiangzhou, was reassigned as Inspector of Southern Yuzhou and posted at Liyang.',
  },
  s0099: {
    literal: 'General Who Pacifies the Army and General of the Palace Guard Wang Xuamo was made General of Chariots and Cavalry and Inspector of Jiangzhou; General Who Levels the North and Inspector of Xuzhou Xue Andu was promoted to General Who Pacifies the North.',
    idiomatic: 'General Who Pacifies the Army and General of the Palace Guard Wang Xuamo was appointed General of Chariots and Cavalry and Inspector of Jiangzhou, and General Who Levels the North and Inspector of Xuzhou Xue Andu was promoted to General Who Pacifies the North.',
  },
  s0100: {
    literal: 'Andu also refused the order.',
    idiomatic: 'Andu also refused the appointment.',
  },
};

for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) throw new Error(`Missing translation for ${s.id}`);
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Filled', Object.keys(T).length, 'sentences');
