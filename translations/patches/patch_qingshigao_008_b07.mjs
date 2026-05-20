#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'At Zhenbian, Miao people continued to submit inward—eighty-three stockades in all.',
    'Eighty-three more Miao stockades at Zhenbian submitted.',
  ],
  s0602: [
    'Ninth month, day gengxu: the Emperor accompanied the Empress Dowager back to the palace.',
    'On gengxu day in the ninth month, the Emperor returned with the Empress Dowager to the palace.',
  ],
  s0603: [
    'Crown Prince Yinreng was again deposed for crimes and confined in Xian\'an Palace.',
    'Crown Prince Yinreng was deposed again and imprisoned in Xian\'an Palace.',
  ],
  s0604: [
    'Winter, tenth month, day renxu: Mu Helun and others reported on their reinvestigation of the Jiangnan case; the Emperor ordered Gali stripped of office and Zhang Boxing restored to his post.',
    'In the tenth month, Mu Helun\'s team reported on the Jiangnan case; Gali was dismissed and Zhang Boxing restored.',
  ],
  s0605: [
    'Kuai Xu was made Censor-in-chief of the Left, and He Shou governor-general of Jiangnan and Jiangxi.',
    'Kuai Xu became Left Censor-in-chief; He Shou became governor-general of Jiangnan and Jiangxi.',
  ],
  s0606: [
    'Eleventh month, day yiyou: the case of former Fujian provincial commander Lan Li was reported upward; death was the sentence.',
    'In the eleventh month, former Fujian commander Lan Li\'s case called for execution.',
  ],
  s0607: [
    'The Emperor, mindful of his merit in the Taiwan campaign, specially pardoned him.',
    'The Emperor pardoned Lan Li for his Taiwan campaign merit.',
  ],
  s0608: [
    'On day jihai, because of the sixtieth birthday, court ministers asked that an honorific title be conferred; this was not permitted.',
    'On jihai day, ministers sought an honorific title for the sixtieth birthday; the Emperor refused.',
  ],
  s0609: [
    'On day dingwei, the re-deposition of Crown Prince Yinreng was announced at the imperial shrines and proclaimed throughout the realm.',
    'On dingwei day, Yinreng\'s second deposition was announced at the shrines and empire-wide.',
  ],
  s0610: [
    'On day jiyou, the Emperor paid respects at the imperial tombs and granted silver to the tomb-guard ministers.',
    'On jiyou day, the Emperor visited the tombs and granted silver to tomb guardians.',
  ],
  s0611: [
    'Twelfth month, day jiaxu: the Emperor returned to the capital.',
    'In the twelfth month, the Emperor returned to Beijing.',
  ],
  s0612: [
    'This year, disaster land tax for twenty-three prefectures and counties in Zhili, Jiangnan, Shandong, Zhejiang, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in twenty-three districts across several provinces.',
  ],
  s0613: [
    'Korea sent tribute.',
    'Korea paid tribute.',
  ],
  s0614: [
    'Fifty-second year, spring, first month, day wushen: an edict enfeoffed the post-Tibet Panchen Hutuktu Lama as Panchen Erdeni.',
    'In the fifty-second year, the Panchen Hutuktu Lama was enfeoffed as Panchen Erdeni.',
  ],
  s0615: [
    'Second month, day gengxu: Zhao Shenqiao memorialized that the heir apparent was the foundation of the state and investiture should proceed.',
    'Zhao Shenqiao urged that the crown prince be formally invested.',
  ],
  s0616: [
    'The Emperor, because establishing an heir is a grave matter not to be decided lightly, instructed the court and returned the memorial.',
    'The Emperor said investiture was too grave to decide hastily and returned Zhao\'s memorial.',
  ],
  s0617: [
    'On day yimao, the Emperor toured the capital region.',
    'On yimao day, the Emperor toured the capital districts.',
  ],
  s0618: [
    'Compiling-editor Dai Mingshi was executed by slicing for seditious writings.',
    'Dai Mingshi was executed for seditious writings.',
  ],
  s0619: [
    'Jinshi Fang Bao, implicated for writing a preface, was spared death but entered the banner rolls; he was soon pardoned and released.',
    'Fang Bao, implicated by a preface, was spared death, entered the banners, then was pardoned.',
  ],
  s0620: [
    'On day yihai, the Emperor returned and halted at Changchun Garden.',
    'On yihai day, the Emperor returned to Changchun Garden.',
  ],
  s0621: [
    'Third month, first day wuyin: the Emperor instructed princes and ministers: "Since We returned to the capital yesterday, We have seen countless people everywhere praying for Our health and longevity, and We truly feel ashamed.',
    'In the third month, the Emperor told princes and ministers he was ashamed of the countless prayers for his health since returning to Beijing.',
  ],
  s0622: [
    'When the myriad states are at peace, that is Our peace; when the realm is blessed, that is Our blessing—those who pray for long life should keep this foremost.',
    'He said the realm\'s peace and blessing were his own, and prayers should seek that first.',
  ],
  s0623: [
    'We are old; the thought of standing at the brink grows daily—how dare We be complacent?"',
    'He said he grew more cautious daily and dared not be complacent."',
  ],
  s0624: [
    '" He also instructed: "There are very many birthday celebrants in the provinces; if one or two are unwell, the Imperial Physicians may treat them.',
    'He also ordered Imperial Physicians to treat any aged celebrants who fell ill.',
  ],
  s0625: [
    'On the seventeenth We shall enter the palace scripture pavilion; the elders have already been able to pay respects at leisure.',
    'On the seventeenth he would receive elders at the palace scripture pavilion, where they could pay respects at leisure.',
  ],
  s0626: [
    'On the eighteenth the ceremony is at Zhengyang Gate—they need not come again to the dragon pavilion.',
    'On the eighteenth, rites at Zhengyang Gate would suffice.',
  ],
  s0627: [
    'Han officials in each province are to transmit this so all know."',
    'Han officials in each province were to pass the notice along."',
  ],
  s0628: [
    'On day jiawu, the Emperor returned to the palace; subjects from every province lined the road prostrate in welcome, and the Emperor halted the carriage to comfort them.',
    'On jiawu day, the Emperor returned to the palace and halted his carriage to comfort welcoming subjects from every province.',
  ],
  s0629: [
    'On day yiwei, the Longevity Festival: the Emperor attended the Empress Dowager at Cining Palace, received congratulations in the Hall of Supreme Harmony, issued a grace edict granting favors to the aged, recommending recluses, honoring filial piety and righteousness, remitting arrears, providing state care for widows, orphans, and the destitute without support, and pardoning all crimes not punishable by death.',
    'On yiwei day, the Longevity Festival brought a grace edict: honors for the aged and virtuous, tax relief, state care for the destitute, and a broad pardon.',
  ],
  s0630: [
    'On day renyin, officials and commoners aged sixty-five and above from all provinces were summoned to a feast at Changchun Garden; princes served food and clansmen presented cups.',
    'On renyin day, elders sixty-five and above from every province were feasted at Changchun Garden, with princes and clansmen serving.',
  ],
  s0631: [
    'Elders over eighty were helped forward, and the Emperor personally watched them drink.',
    'He helped elders over eighty forward and watched them drink.',
  ],
  s0632: [
    'He instructed them: "Since antiquity nourishing the aged and honoring the worthy comes first; if all know filial piety and brotherly duty, custom will be sound.',
    'He told them that honoring the aged and the worthy would thicken custom through filial piety and brotherly duty.',
  ],
  s0633: [
    'You elders should convey this to your villages."',
    'He asked the elders to spread this in their villages."',
  ],
  s0634: [
    'Yesterday\'s great rain has thoroughly moistened the fields.',
    'He noted that yesterday\'s rain had soaked the fields.',
  ],
  s0635: [
    'Return quickly and do not miss the farming season."',
    'He urged them to return quickly and not miss the farming season."',
  ],
  s0636: [
    '" That day, thirty-three persons aged ninety or above and five hundred thirty-eight aged eighty or above were each granted silver.',
    'Thirty-three men over ninety and 538 over eighty received silver that day.',
  ],
  s0637: [
    'Song Luo, elder wishing longevity, was made Junior Tutor of the Heir Apparent; Tian Zhongyu Junior Preceptor.',
    'Song Luo and Tian Zhongyu received honorary tutor ranks.',
  ],
  s0638: [
    'On day jiachen, Banner officials, soldiers, and idlers were feasted at Changchun Garden, with food service, cup presentation, and silver gifts as before.',
    'On jiachen day, Banner officers and soldiers were feasted at Changchun Garden with the same honors as before.',
  ],
  s0639: [
    'That day, seven persons aged ninety or above and one hundred ninety-two aged eighty or above.',
    'Seven men over ninety and 192 over eighty attended that day.',
  ],
  s0640: [
    'Summer, fourth month, day jiayin: Ehai was made governor-general of Shaanxi and Sichuan, Elunte governor-general of Huguang, and Gao Qiwei Huguang provincial commander.',
    'In the fourth month, Ehai, Elunte, and Gao Qiwei received new posts in the northwest and Huguang.',
  ],
  s0641: [
    'Sichuan provincial commander Yue Shenglong asked to register his household in Sichuan; this was permitted.',
    'Yue Shenglong was permitted to register in Sichuan.',
  ],
  s0642: [
    'On day dingmao, officers were sent to offer sacrifice at the mountains and rivers, ancient imperial tombs, and the temple of Confucius at Qufu.',
    'On dingmao day, sacrifices were ordered at sacred sites and Qufu.',
  ],
  s0643: [
    'Fifth month, day bingxu: the Emperor accompanied the Empress Dowager to Rehe for the summer.',
    'In the fifth month, the Emperor escorted the Empress Dowager to Rehe.',
  ],
  s0644: [
    'Zhang Tinglu was transferred to Minister of Punishments and Wang Zhuiling to Minister of Works.',
    'Zhang Tinglu and Wang Zhuiling received new ministerial posts.',
  ],
  s0645: [
    'Mongol elders were granted silver.',
    'Silver was granted to Mongol elders.',
  ],
  s0646: [
    'On day xinchou, an edict halted autumn executions for this year.',
    'On xinchou day, autumn executions were suspended for the year.',
  ],
  s0647: [
    'Intercalary fifth month, day yimao: Rehe elders were granted silver.',
    'In the intercalary fifth month, Rehe elders received silver.',
  ],
  s0648: [
    'Censor Chen Ruqian induced the sea bandit Chen Shangyi to come for audience, inquired into coastal conditions and the form of foreign ships, and was ordered to settle him at Jinzhou and establish a naval camp.',
    'Chen Ruqian brought pirate Chen Shangyi to audience, questioned him on the seas, and settled him at Jinzhou with a naval camp.',
  ],
  s0649: [
    'Sixth month, day dingchou: the calendrical and mathematical treatises were revised.',
    'In the sixth month, calendrical and mathematical works were revised.',
  ],
  s0650: [
    'Autumn, seventh month, day renzi: an edict ordered that descendants of imperial clansmen struck from the genealogy should respectively wear red or purple girdles and be recorded in the jade genealogy.',
    'In the seventh month, descendants of clansmen removed from the rolls were ordered to wear red or purple girdles and be listed in the jade genealogy.',
  ],
  s0651: [
    'On day bingyin, the Emperor went on the hunting encirclement.',
    'On bingyin day, the Emperor went hunting.',
  ],
  s0652: [
    'Eighth month, day dingchou: the Ordos Mongol prince Song Alabu asked to pasture at Chahan Tuohui; this was not permitted, and grazing was ordered to take the Yellow River as boundary, following the request of garrison commander Fan Shijie.',
    'In the eighth month, Ordos Prince Song Alabu was denied grazing beyond the Yellow River, per General Fan Shijie\'s request.',
  ],
  s0653: [
    'Ninth month, day jiazi: the Emperor accompanied the Empress Dowager back to the palace.',
    'On jiazi day in the ninth month, the Emperor returned with the Empress Dowager to the palace.',
  ],
  s0654: [
    'On day xinwei, one hundred thousand shi of Jiangnan transport grain were sent in portions to Guangdong and Fujian for price stabilization.',
    'On xinwei day, 100,000 shi of Jiangnan grain were sent south to stabilize prices.',
  ],
  s0655: [
    'Winter, tenth month, day bingzi: Zhang Penghe was made Minister of Personnel.',
    'In the tenth month, Zhang Penghe became Minister of Personnel.',
  ],
  s0656: [
    'On day yiyou, Wang Jingming and one hundred forty-three others were granted jinshi and other ranks with distinctions.',
    'On yiyou day, Wang Jingming and 143 others received jinshi degrees.',
  ],
  s0657: [
    'Eleventh month, day jiyou: an edict remitted next year\'s tax grain for twenty-one prefectures, counties, and garrisons in Guangdong, Fujian, and Gansu.',
    'In the eleventh month, tax grain was remitted for twenty-one districts in the south and Gansu.',
  ],
  s0658: [
    'On day guihai, the Emperor paid respects at the imperial tombs.',
    'On guihai day, the Emperor visited the imperial tombs.',
  ],
  s0659: [
    'Twelfth month, day jimao: He Yi was made Minister of Works.',
    'In the twelfth month, He Yi became Minister of Works.',
  ],
  s0660: [
    'On day xinmao, those who had originally taken both civil and military examinations were permitted to change and sit for one stream only.',
    'On xinmao day, candidates who had taken both civil and military exams could choose one stream.',
  ],
  s0661: [
    'On day renchen, the Emperor returned to the capital.',
    'On renchen day, the Emperor returned to Beijing.',
  ],
  s0662: [
    'On day jiawu, Wuge was made Mongol commander-in-chief.',
    'On jiawu day, Wuge became Mongol commander-in-chief.',
  ],
  s0663: [
    'On day xinchou, the seasonal collective sacrifice was performed at the imperial ancestral temple.',
    'On xinchou day, the imperial ancestral temple received the seasonal collective rites.',
  ],
  s0664: [
    'This year, disaster land tax for ten prefectures and counties in Zhejiang was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in ten Zhejiang districts.',
  ],
  s0665: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s0666: [
    'Fifty-third year, spring, first month, day jiwei: repair of ritual instruments at altars, temples, halls, and courts was ordered.',
    'In the fifty-third year, altar and temple ritual instruments were ordered repaired.',
  ],
  s0667: [
    'On day guihai, the Ministry of Revenue asked to ban small coins.',
    'On guihai day, the Ministry of Revenue sought a ban on small coin.',
  ],
  s0668: [
    'The Emperor said: "In all things one must aim to benefit the people; if it does not benefit the people and one only insists on enforcing the law, what good is a harsh ban?"',
    'The Emperor said laws must benefit the people, or harsh bans were useless.',
  ],
  s0669: [
    'On day wuchen, the Emperor toured the capital region.',
    'On wuchen day, the Emperor toured the capital districts.',
  ],
  s0670: [
    'On day dingmao, He Tianpei was made general at Jingkou.',
    'On dingmao day, He Tianpei became Jingkou general.',
  ],
  s0671: [
    'Second month, day jiaxu: an edict halted this year\'s autumn review; doubtful convicts were to be tried and reported, and those sentenced to exile or below were to be reduced one grade in punishment.',
    'In the second month, the autumn review was halted and doubtful and minor offenders received reduced sentences.',
  ],
  s0672: [
    'On day yiyou, the Emperor returned to the capital.',
    'On yiyou day, the Emperor returned to Beijing.',
  ],
  s0673: [
    'On day guichou, Vice Minister Chang Tai and Vice Director Chen Ruqian were ordered to Gansu to relieve and comfort disaster victims.',
    'On guichou day, Chang Tai and Chen Ruqian were sent to relieve Gansu famine victims.',
  ],
  s0674: [
    'On day dingsi, former Minister Wang Hongxu presented two hundred eighty juan of Ming History biographies; they were ordered delivered to the historiography office.',
    'On dingsi day, Wang Hongxu submitted 280 juan of Ming History biographies to the historiography office.',
  ],
  s0675: [
    'Summer, fourth month, day wuzi: Shi Yide was transferred to Gansu provincial commander.',
    'In the fourth month, Shi Yide became Gansu provincial commander.',
  ],
  s0676: [
    'On day xinmao, the Emperor accompanied the Empress Dowager to Rehe for the summer.',
    'On xinmao day, the Emperor escorted the Empress Dowager to Rehe.',
  ],
  s0677: [
    'Sixth month, day yihai, an edict said: "Lhabzang Khan is nearly sixty; his two sons are abroad—he should guard against outside trouble and look well to his own plans.',
    'In the sixth month, an edict warned Lhabzang Khan, nearly sixty with sons abroad, to guard against outside threats.',
  ],
  s0678: [
    '" On day guiwei, because of the heat, late court for attending ministers was waived.',
    'On guiwei day, late court was waived for ministers because of the heat.',
  ],
  s0679: [
    'Autumn, seventh month, day xinmao: an edict, because Jiangnan was again in drought, Zhejiang rice was dear, and Henan had poor harvests, ordered three hundred thousand shi of transport grain diverted and sent in portions to the three provinces for price stabilization.',
    'In the seventh month, 300,000 shi of grain were diverted to Jiangnan, Zhejiang, and Henan to ease drought and dearth.',
  ],
  s0680: [
    'Eighth month, day yihai: the Emperor went on the hunting encirclement.',
    'In the eighth month, the Emperor went hunting.',
  ],
  s0681: [
    'Ninth month, day bingyin: the Emperor accompanied the Empress Dowager back to the palace.',
    'On bingyin day in the ninth month, the Emperor returned with the Empress Dowager to the palace.',
  ],
  s0682: [
    'Winter, tenth month, first day jisi: Zhang Penghe and Ashitai were ordered to reinvestigate the Mou Qinyuan case in Jiangnan.',
    'On the first of the tenth month, Zhang Penghe and Ashitai were sent to reinvestigate the Mou Qinyuan case in Jiangnan.',
  ],
  s0683: [
    'On day jichou, grand secretaries and Hanlin of the Southern Study were ordered to fix the ritual hymns.',
    'On jichou day, grand secretaries and Southern Study Hanlin were ordered to fix ritual music.',
  ],
  s0684: [
    'Eleventh month: the Ministry of Revenue was ordered to divert more than three hundred thousand shi of transport grain from Jiangnan and Zhejiang for relief stores.',
    'In the eleventh month, over 300,000 shi of Jiangnan grain were set aside for relief.',
  ],
  s0685: [
    'On day wushen, next year\'s quota land tax for twenty-eight prefectures, counties, and garrisons in Jingbian, Gansu, was remitted.',
    'On wushen day, Jingbian districts in Gansu received tax relief for the coming year.',
  ],
  s0686: [
    'Prince Yin Zhi and others presented the imperially composed Correct Meaning of Pitch-pipes and received the rescript: "The three books on pitch-pipes, calendrical methods, and calculation are to form one work, titled Sources of Pitch-pipes, Calendar, and Calculation.',
    'Prince Yin Zhi presented the imperial Music Treatise; the Emperor ordered it combined with calendar and math works as Sources of Pitch-pipes, Calendar, and Calculation.',
  ],
  s0687: [
    '" On day jiayin, the winter solstice, Heaven was sacrificed to at the Round Mound Altar, and the new music was performed.',
    'On jiayin day, winter solstice sacrifice at the Round Mound used the new music.',
  ],
  s0688: [
    'On day bingchen, the Emperor toured beyond the passes.',
    'On bingchen day, the Emperor toured the frontier.',
  ],
  s0689: [
    'Under Beile Yin Si, the bondservant Yaqibu was guilty and executed.',
    'Yaqibu, a bondservant of Beile Yin Si, was executed for his crime.',
  ],
  s0690: [
    'He Guodong was sent to measure polar altitude and the sun\'s shadow in Guangdong, Yunnan, and other provinces.',
    'He Guodong was sent to measure polar altitude and solar altitude in the southern provinces.',
  ],
  s0691: [
    'Twelfth month, day guiyou: the Emperor halted at Tebuke and granted silver and coins to Mongol soldiers on the hunt.',
    'In the twelfth month, at Tebuke the Emperor granted silver to Mongol soldiers on the hunt.',
  ],
  s0692: [
    'On day jichou, the Emperor returned to the capital.',
    'On jichou day, the Emperor returned to Beijing.',
  ],
  s0693: [
    'On day xinmao, nineteen raw-tribe Lamaist groups beyond the Tao-Min border submitted.',
    'On xinmao day, nineteen raw tribes beyond the Tao-Min frontier submitted.',
  ],
  s0694: [
    'This year, disaster land tax for one hundred twenty-two prefectures and counties in Jiangnan, Henan, Gansu, Zhejiang, Huguang, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in 122 districts across several provinces.',
  ],
  s0695: [
    'Korea sent tribute.',
    'Korea paid tribute.',
  ],
  s0696: [
    'Fifty-fourth year, spring, first month, day jiazi: the quota rule for passing by the Five Classics examination was suspended.',
    'In the fifty-fourth year, the Five Classics pass quota was suspended.',
  ],
  s0697: [
    'Abaghai taiji Demuchuke was enfeoffed as Assistant State Duke.',
    'Demuchuke of Abaghai was enfeoffed as Assistant State Duke.',
  ],
  s0698: [
    'An edict said Beile Yin Si and Yanshou had neglected duty and their salaries were suspended.',
    'Beile Yin Si and Yanshou were suspended from salary for negligence.',
  ],
  s0699: [
    'Second month, first day wuchen: Zhang Boxing was removed from office over a matter and the case was referred to Zhang Penghe for trial.',
    'On the first of the second month, Zhang Boxing was removed pending trial by Zhang Penghe.',
  ],
  s0700: [
    'On day jisi, Shi Shilun was made director-general of grain transport.',
    'On jisi day, Shi Shilun became grain transport director-general.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_008_b07.mjs <translation.json>'
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
