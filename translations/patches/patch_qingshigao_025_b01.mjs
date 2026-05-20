#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'The Xuantong Emperor was named Puyi, a great-grandson of the Xuanzong Emperor, a grandson of the Pure and Worthy Prince Yixuan, and a son of the Regent Prince Zaifeng; to the Dezong Emperor he was a nephew from his own line.',
    'Emperor Xuantong, named Puyi, was Xuanzong\'s great-grandson, Prince Yixuan\'s grandson, Regent Zaifeng\'s son, and Dezong\'s biological nephew.',
  ],
  s0002: [
    'His mother was the Regent Prince\'s principal consort of the Suwan Guwalgiya clan.',
    'His mother was Regent Zaifeng\'s principal consort, a Suwan Guwalgiya woman.',
  ],
  s0003: [
    'On the fourteenth day of the first month of spring in Guangxu year 32 he was born at the Pure Prince\'s residence.',
    'He was born at the Pure Prince\'s house on day 14 of spring, month 1, Guangxu year 32.',
  ],
  s0004: [
    'Guangxu year 34 — On day renshen in the tenth month of winter in year 34, the Dezong Emperor\'s illness grew grave; the Grand Empress Dowager ordered him reared within the palace.',
    'Guangxu year 34, winter, month 10, renshen day: Dezong fell critically ill and the Grand Empress Dowager had Puyi brought up inside the palace.',
  ],
  s0005: [
    'On day guiyou the Dezong Emperor died; following the Grand Empress Dowager\'s edict he entered to receive the Great Succession as successor emperor, succeeding the Muzong Emperor and also carrying on the late emperor\'s ancestral line; he was three years old.',
    'On guiyou day Dezong died; by the Grand Empress Dowager\'s order Puyi took the throne as successor for Muzong and the late emperor\'s line, aged three.',
  ],
  s0006: [
    'The Regent Prince Zaifeng, by the Grand Empress Dowager\'s edict, supervised the realm as regent.',
    'Regent Zaifeng governed the realm by the Grand Empress Dowager\'s order.',
  ],
  s0007: [
    'Military and state affairs and all domestic and foreign memorials were entirely disposed of by the Regent Prince, issued as edicts, and great affairs also required the Empress Dowager\'s rescript.',
    'War, government, and all memorials went to the Regent Prince as edicts; major matters also needed the Empress Dowager\'s approval.',
  ],
  s0008: [
    'An edict ordered a three-year mourning period.',
    'The court proclaimed three years of mourning.',
  ],
  s0009: [
    'On day jiaxu the Sacred Grandmother, Empress Dowager Cixi of the full honorific title, was honored as Grand Empress Dowager, and the empress who was both line mother and empress was honored as Empress Dowager.',
    'On jiaxu day Cixi became Grand Empress Dowager and the empress who carried both lines became Empress Dowager.',
  ],
  s0010: [
    'Earlier, the Grand Empress Dowager had also fallen ill.',
    'The Grand Empress Dowager had been ill as well.',
  ],
  s0011: [
    'On that day she died.',
    'That same day she died.',
  ],
  s0012: [
    'On day yihai the palace gates were strictly guarded.',
    'On yihai day palace security was tightened.',
  ],
  s0013: [
    'On day dingyou the Wen Zong Emperor\'s Honored Consort was raised to Honored Imperial Noble Consort, the Muzong Emperor\'s Yu Consort to Imperial Noble Consort Yu, the Xun Consort to Imperial Noble Consort Xun, the Jin Consort to Imperial Noble Consort Jin, and the late emperor\'s Jin Consort to Imperial Noble Consort Jin.',
    'On dingyou day several late emperors\' consorts received higher noble consort ranks.',
  ],
  s0014: [
    'On day wuyin the provinces were ordered to stop presenting local products.',
    'On wuyin day tribute goods from the provinces were halted.',
  ],
  s0015: [
    'On day jimao the court admonished the officials; an edict said: 「Military and state affairs shall be adjudicated by the Regent Prince supervising the realm, as the late Grand Empress Dowager\'s edict.',
    'On jimao day officials were warned by edict: military and state affairs belong to the Regent Prince, as the late Grand Empress Dowager ordered.',
  ],
  s0016: [
    'From Us downward, all shall obey as one.',
    'From the throne downward, all must obey.',
  ],
  s0017: [
    'Thereafter princes, dukes, and all officials — if any should watch and play at defiance, overstep ritual and violate rank, alter statutes, or confuse the national policy — shall at once be punished under state law, so as not to fail the late Grand Empress Dowager\'s weighty trust and to satisfy the hopes of the realm\'s officials and people.',
    'Any prince or official who defies orders, breaks ritual, or confuses policy will be punished at once, to honor the late Grand Empress Dowager\'s trust and the people\'s hopes.',
  ],
  s0018: [
    '" (closing quotation mark in the source.) On day gengchen the late emperor\'s testamentary edict was promulgated.',
    'The edict closed. On gengchen day the late emperor\'s final edict was issued.',
  ],
  s0019: [
    'Soldiers mutinied at Anqing and were suppressed.',
    'An Anqing mutiny was put down.',
  ],
  s0020: [
    'Eleventh month, day yiyou: the late Grand Empress Dowager\'s testamentary rescript was promulgated.',
    'In month 11, yiyou day, the late Grand Empress Dowager\'s death rescript was issued.',
  ],
  s0021: [
    'An edict fixed the seasonal sacrifice prayer boards: the Pure and Worthy Prince was styled "biological forefather the Pure and Worthy Prince," and his principal consort "biological foremother the Pure and Worthy Prince\'s principal consort."',
    'Sacrifice boards were ordered to name Prince Yixuan and his principal consort as Puyi\'s biological forebears.',
  ],
  s0022: [
    'Flood victims in Lizhou and other districts of Hunan were relieved.',
    'Hunan\'s Lizhou flood victims were fed.',
  ],
  s0023: [
    'On day wuzi, by Empress Dowager rescript, the emperor\'s birthday celebrations were to wait until mourning ended and thereafter be held every year on the thirteenth day of the first month.',
    'On wuzi day the Empress Dowager moved the emperor\'s birthday rites to the 13th of month 1 after mourning ended.',
  ],
  s0024: [
    'On day gengyin, before the accession period, sacrifices were announced to Heaven, Earth, the ancestral temple, the altar of soil and grain, and the sage Confucius, and to the late Grand Empress Dowager and late emperor at their mourning couches.',
    'On gengyin day the court announced sacrifices to Heaven, Earth, temples, Confucius, and the late rulers\' mourning couches before enthronement.',
  ],
  s0025: [
    'On day xinmao the emperor took the throne in the Hall of Supreme Harmony; the next year was fixed as the first year of Xuantong.',
    'On xinmao day Puyi was enthroned in the Hall of Supreme Harmony and the next year became Xuantong 1.',
  ],
  s0026: [
    'An edict was issued to the realm; crimes not normally pardoned were all remitted.',
    'A realm-wide amnesty forgave all but the gravest crimes.',
  ],
  s0027: [
    'An edict followed the late Grand Empress Dowager\'s edict, still fixing promulgation of a constitution in the ninth year — Xuantong year 8 — and convocation of delegates.',
    'By the late Grand Empress Dowager\'s plan, a constitution would be issued in year 9 (Xuantong 8) and delegates summoned.',
  ],
  s0028: [
    'Xuantong coinage was cast.',
    'Xuantong coins were minted.',
  ],
  s0029: [
    'On day jihai the plaque "Central Harmony and Nurturing Growth" was issued to the Confucian temple.',
    'On jihai day the "Central Harmony and Nurturing Growth" plaque went to the Confucian temple.',
  ],
  s0030: [
    'On day renyin the Grand Council and other offices jointly memorialized the general regulations for the Regent Prince\'s ritual; an edict proclaimed them.',
    'On renyin day the Regent Prince\'s ritual code was submitted and promulgated.',
  ],
  s0031: [
    'Regulations for guarding the gates were fixed, and Princes Zaitao and Yulang and Minister Tie Liang were ordered to oversee inspection in chief.',
    'Gate-guard rules were set and Zaitao, Yulang, and Tie Liang were put in charge of inspection.',
  ],
  s0032: [
    'Vice Commander Kun Yuan was appointed to manage the Chahar herds.',
    'Kun Yuan was made vice commander over Chahar herds.',
  ],
  s0033: [
    'The Grand Council leading clerks were fixed as third-rank officials and assistant leading clerks as fourth-rank officials.',
    'Grand Council lead clerks became third-rank posts and assistants fourth-rank.',
  ],
  s0034: [
    'Floods in Longxi, Nanjing, and other counties of Fujian: forty thousand taels from the treasury were issued for relief.',
    'Forty thousand taels relieved flood victims in Fujian\'s Longxi and Nanjing counties.',
  ],
  s0035: [
    'On day yisi an edict ordered each provincial governor-general and governor to lead circuit intendants in examining subordinate officials and fairly distinguishing merit.',
    'On yisi day governors were told to rate their subordinates fairly.',
  ],
  s0036: [
    'Unworthy magistrates who ignored the people\'s suffering were to be severely punished.',
    'Magistrates who ignored public suffering faced harsh punishment.',
  ],
  s0037: [
    'An office to reform the banner system was established; Princes Pulun and Zaize, Natong, Baoxi, Xiyan, and Dashou were ordered to direct it.',
    'A banner-reform office was set up under Pulun, Zaize, Natong, Baoxi, Xiyan, and Dashou.',
  ],
  s0038: [
    'Officials at court and in the provinces were instructed to value frugality and shun display.',
    'The court urged frugality and warned against extravagance.',
  ],
  s0039: [
    'On day bingwu envoys were dispatched to sacrifice at Confucius\'s home temple, the tombs of successive emperors, the Five Sacred Peaks, and the Four Rivers.',
    'On bingwu day sacrifices were sent to Qufu, imperial tombs, the Five Peaks, and the Four Rivers.',
  ],
  s0040: [
    'On day wushen, by Empress Dowager rescript, visits to the Summer Palace were stopped.',
    'On wushen day the Empress Dowager ended Summer Palace visits.',
  ],
  s0041: [
    'Prince Qing Yikuang was further ennobled with perpetual hereditary prince rank; Princes Zaixun and Zaitao received acting grand-prince titles; the Empress Dowager\'s father Duke Guixiang received double stipend; and from grand secretaries downward rewards were graded.',
    'Yikuang became a perpetual hereditary prince; Zaixun and Zaitao gained acting grand-prince titles; Guixiang got double pay; officials were rewarded by rank.',
  ],
  s0042: [
    'On day xinhai, winter solstice, Heaven was sacrificed to at the Circular Mound; Prince Zhuang Zaigong performed the rites by proxy — thereafter major altar and temple sacrifices were all performed by proxy.',
    'On xinhai, winter solstice, Zaigong sacrificed to Heaven at the Circular Mound; major rites were henceforth performed by proxy.',
  ],
  s0043: [
    'Twelfth month, new moon on day renzi: posthumous honorific titles were added for the Muzong Yi Emperor, Empress Xiaojingcheng, and Empresses Xiaode, Xiaozhen, and Xiaozhe.',
    'Month 12, renzi new moon: posthumous titles were added for Muzong and several empresses.',
  ],
  s0044: [
    'The Xuantong year 1 calendar was promulgated.',
    'The Xuantong 1 calendar was issued.',
  ],
  s0045: [
    'On day jiayin the Forbidden Guards Army was established; Princes Zaitao and Yulang and Minister Tie Liang were ordered to train it exclusively.',
    'On jiayin day the Forbidden Guards were founded under Zaitao, Yulang, and Tie Liang.',
  ],
  s0046: [
    'The Zhenxi battalion brigade commander and Qianzhou garrison deputy commander in Hunan were cut, and Qianzhou garrison troops were reduced.',
    'Hunan military posts at Zhenxi and Qianzhou were cut and garrison troops reduced.',
  ],
  s0047: [
    'The concubine Yu of the late Zhili Governor Ma Yugun, who died for her lord, was honored.',
    'Yu, concubine of the martyred Ma Yugun of Zhili, was honored.',
  ],
  s0048: [
    'Floods in Heilongjiang, Mergen, Buteha, Heishui, Dazhai, and other cities and departments were relieved.',
    'Floods in Heilongjiang, Mergen, Buteha, Heishui, and Dazhai were relieved.',
  ],
  s0049: [
    'Grain land tax in eight disaster counties of Hejian prefecture, Zhili, was remitted.',
    'Grain tax was forgiven in eight flooded Hejian counties, Zhili.',
  ],
  s0050: [
    'On day dingsi prayers were offered for snow.',
    'On dingsi day the court prayed for snow.',
  ],
  s0051: [
    'Zhang Zhidong was ordered additionally to supervise the Sichuan-Hankou Railway.',
    'Zhang Zhidong was also put in charge of the Sichuan-Hankou Railway.',
  ],
  s0052: [
    'On day gengshen the retired Grand Secretary Wang Wenshao died and was posthumously given Grand Guardian rank.',
    'On gengshen day Wang Wenshao died in retirement and was posthumously made Grand Guardian.',
  ],
  s0053: [
    'A posthumous title was granted the late Yunnan-Guizhou Governor Zhang Liangji.',
    'The late Zhang Liangji of Yunnan-Guizhou received a posthumous title.',
  ],
  s0054: [
    'The Civil Affairs Ministry submitted forms for the household census survey regulations.',
    'The Civil Affairs Ministry filed census survey forms.',
  ],
  s0055: [
    'On day renxu Yuan Shikai was dismissed and Grand Secretary Natong was appointed Grand Councilor.',
    'On renxu day Yuan Shikai was removed and Natong joined the Grand Council.',
  ],
  s0056: [
    'On day guihai Liang Dunyan was made Minister of Foreign Affairs and concurrent joint minister.',
    'On guihai day Liang Dunyan became foreign minister and joint minister.',
  ],
  s0057: [
    'Natong was relieved of command of the Metropolitan Garrison and Yulang replaced him.',
    'Natong left the Metropolitan Garrison command and Yulang took over.',
  ],
  s0058: [
    'On day yichou an edict fixed Golden Dragon Valley at the Western Mausoleum as the mountain tomb of the Jing Emperor Dezong, styled Chongling.',
    'On yichou day Dezong\'s tomb was fixed at Golden Dragon Valley, Western Mausoleum, as Chongling.',
  ],
  s0059: [
    'On day dingmao prayers for snow were offered again.',
    'On dingmao day the court again prayed for snow.',
  ],
  s0060: [
    'On day jisi the Revenue Ministry submitted regulations for cleaning up finances.',
    'On jisi day the Revenue Ministry filed finance cleanup rules.',
  ],
  s0061: [
    'On day renshen Zhang Xun\'s Huai Army was ordered to remain in the three eastern provinces handling suppression and pacification.',
    'On renshen day Zhang Xun\'s Huai Army stayed in Manchuria for pacification duty.',
  ],
  s0062: [
    'On day guiyou Italy suffered earthquake disaster; fifty thousand taels were issued from the treasury for relief.',
    'On guiyou day fifty thousand taels aided Italy\'s earthquake victims.',
  ],
  s0063: [
    'The Constitutional Compilation and Review Office memorialized that initial and repeat elections for the capital banners should be handled by Shuntian Prefecture.',
    'The constitutional office said capital-banner elections should go to Shuntian Prefecture.',
  ],
  s0064: [
    'On day yihai the provinces were instructed to clean up abuses in clearing arrears and deferring taxes.',
    'On yihai day provinces were told to end tax-clearance abuses.',
  ],
  s0065: [
    'On day dingchou prayers for snow were offered again.',
    'On dingchou day the court prayed for snow again.',
  ],
  s0066: [
    'That day it snowed.',
    'Snow fell that day.',
  ],
  s0067: [
    'Arrears from Guangxu year 32 in Shaanxi prefectures and counties were remitted.',
    'Shaanxi\'s Guangxu 32 tax arrears were forgiven.',
  ],
  s0068: [
    'On day wuyin it snowed again.',
    'On wuyin day it snowed again.',
  ],
  s0069: [
    'The Constitutional Compilation and Review Office submitted reviewed local self-government for town and countryside and separate draft election regulations; an edict promulgated them.',
    'Local self-government and election drafts were reviewed and promulgated.',
  ],
  s0070: [
    'Orders of merit stars were first instituted and conferred on the foreign minister, joint ministers, and envoys abroad.',
    'Merit stars were first created for the foreign minister, joint ministers, and envoys.',
  ],
  s0071: [
    'On day gengchen trial courts and procuratorates at each level were established in Fengtian.',
    'On gengchen day Fengtian got graded trial courts and procuratorates.',
  ],
  s0072: [
    'On day xinsi the Jiangxi grain transport circuit was cut and patrol and encouragement-of-industry circuits were added.',
    'On xinsi day Jiangxi cut its grain circuit and added patrol and industry circuits.',
  ],
  s0073: [
    'Xuantong year 1 — First year of Xuantong, spring, first month, new moon on day renwu: because the late ruler lay in coffin mourning, court congratulations were not received.',
    'Xuantong 1, spring, month 1, renwu new moon: with the late emperor in mourning, New Year levees were canceled.',
  ],
  s0074: [
    'On day guiwei wasteland in twenty-eight prefectures and counties of Jiangsu, including Changzhou, was remitted, as were transport grain and rice for seven counties.',
    'On guiwei day Jiangsu wasteland and transport dues in twenty-eight districts were forgiven.',
  ],
  s0075: [
    'On day wuzi guard posts were placed along the Hulunbuir frontier.',
    'On wuzi day frontier guard posts were set on the Hulunbuir border.',
  ],
  s0076: [
    'On day gengyin the special commissioner and Three Eastern Provinces Governor Xu Shichang asked leave for illness and was not permitted.',
    'On gengyin day Xu Shichang\'s sick leave as Manchuria governor was denied.',
  ],
  s0077: [
    'On day xinmao, the Empress Dowager\'s birthday, banquets were stopped and congratulations were not received.',
    'On xinmao, the Empress Dowager\'s birthday, feasts and congratulations were canceled.',
  ],
  s0078: [
    'On day jiawu arrears were remitted for disaster victims in Ami prefecture, Yunnan.',
    'On jiawu day Yunnan\'s Ami disaster arrears were forgiven.',
  ],
  s0079: [
    'On day yiwei the Revenue Ministry memorialized on revising the currency system and asked that deliberation continue.',
    'On yiwei day the Revenue Ministry asked further debate on currency reform.',
  ],
  s0080: [
    'The matter was sent to the Government Affairs Office for reconsideration.',
    'The Government Affairs Office was told to review it.',
  ],
  s0081: [
    'Tin mines in Fuchuan county, Guangxi, were opened.',
    'Guangxi\'s Fuchuan tin mines were opened.',
  ],
  s0082: [
    'On day dingyou the purchase and sale of male and female slaves was forbidden.',
    'On dingyou day buying and selling slaves was banned.',
  ],
  s0083: [
    'On day wuxu, because in recent years new offices and new provinces had drawn personnel and sought added funds without being able to verify names against facts, the court and provinces were ordered to examine and cut in earnest and not expand without limit.',
    'On wuxu day new offices were told to cut staff and funds after real audits, not open-ended growth.',
  ],
  s0084: [
    'The United States opened an international opium prohibition conference at Shanghai, Jiangsu; Duan Fang attended.',
    'The U.S. opened an international opium conference at Shanghai; Duan Fang attended.',
  ],
  s0085: [
    'On day yihai Chen Bi was impeached and dismissed; Xu Shichang was made Minister of Posts and Communications.',
    'On yihai day Chen Bi was impeached out and Xu Shichang became post minister.',
  ],
  s0086: [
    'Xi Liang was transferred as special commissioner and Three Eastern Provinces Governor, also managing the three provinces\' generals\' affairs.',
    'Xi Liang became Manchuria governor-special commissioner and oversaw the three generals.',
  ],
  s0087: [
    'Li Jingxi was made Yunnan-Guizhou Governor.',
    'Li Jingxi became Yunnan-Guizhou governor.',
  ],
  s0088: [
    'On day renyin Yunnan Negotiation Commissioner Gao Erqian was ordered to Macao to survey the boundary.',
    'On renyin day Gao Erqian of Yunnan went to Macao to survey the border.',
  ],
  s0089: [
    'The Civil Affairs Ministry submitted revised metropolitan police district regulations.',
    'The Civil Affairs Ministry filed revised Beijing police districts.',
  ],
  s0090: [
    'On day guimao the late Grand Empress Dowager\'s posthumous title was conferred; the next day an edict was issued to the realm.',
    'On guimao day the late Grand Empress Dowager\'s posthumous title was set and promulgated next day.',
  ],
  s0091: [
    'On day wushen an edict ordered constitutional preparation; each province\'s scheduled steps for this year were to be completed on time without delay.',
    'On wushen day provinces were ordered to meet every constitutional deadline this year.',
  ],
  s0092: [
    'The new penal code was to be fixed and promulgated next year.',
    'The new criminal code would be issued next year.',
  ],
  s0093: [
    'The former dismissed Guangxi Provincial Commander Su Yuanchun was restored to his original post.',
    'Su Yuanchun regained his old Guangxi command post.',
  ],
  s0094: [
    'Tribute swifts from Xiamen, Fujian, were abolished.',
    'Fujian\'s Xiamen swift tribute ended.',
  ],
  s0095: [
    'On day jiyou the late emperor\'s posthumous title and temple name were conferred; the next day an edict was issued to the realm.',
    'On jiyou day Dezong\'s posthumous title and temple name were set and announced next day.',
  ],
  s0096: [
    'On day gengxu the navy was reorganized; Prince Su Shanqi, Prince Guo Zaize, Minister Tie Liang, and Admiral Sa Zhenbing were ordered to plan it, with Prince Qing Yikuang in overall inspection.',
    'On gengxu day the navy was reorganized under Shanqi, Zaize, Tie Liang, and Sa Zhenbing, with Yikuang inspecting.',
  ],
  s0097: [
    'Tie Liang was removed from exclusive duty training the Forbidden Guards minister.',
    'Tie Liang left exclusive command of Forbidden Guards training.',
  ],
  s0098: [
    'Second month, day renzi: the Veritable Records of Dezong were revised.',
    'Month 2, renzi day: Dezong\'s Veritable Records were revised.',
  ],
  s0099: [
    'On day guichou capital and provincial judicial offices were instructed to clear lawsuits and cut abuses.',
    'On guichou day courts were told to clear cases and end abuses.',
  ],
  s0100: [
    'On day wuwu the Agriculture, Industry, and Commerce Ministry memorialized that the Netherlands would enact new laws and enroll overseas Chinese; a nationality law was requested.',
    'On wuwu day the ministry asked for a nationality law as the Netherlands planned new laws for overseas Chinese.',
  ]
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_025_b01.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  s.literal = pair[0];
  s.idiomatic = pair[1];
  patched++;
}

const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) {
  console.error(`Missing: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
