#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-qingshigao.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-qingshigao-447-wikisource-51670f83c175': [
    {
      zh: '同治二年，擢山東按察使。',
      literal: 'In the second year of Tongzhi he was promoted to judicial commissioner of Shandong.',
      idiomatic: 'In the second year of Tongzhi (1863) he was promoted to judicial commissioner of Shandong.',
    },
    {
      zh: '會僧格林沁治兵魯、豫間，令擊河北宋景詩。',
      literal: 'When Sengge Rinchen was organizing troops between Shandong and Henan, he ordered him to strike Song Jingshi in northern Hebei.',
      idiomatic: 'When Sengge Rinchen was organizing troops between Shandong and Henan, he ordered Baozhen to attack Song Jingshi in northern Hebei.',
    },
    {
      zh: '旋劾其擅議招撫，部議降三級。',
      literal: 'He was soon impeached for having unauthorized talks about surrender and pacification; the ministry recommended demotion by three ranks.',
      idiomatic: 'He was soon impeached for unauthorized talks about surrender and pacification, and the ministry recommended demotion by three ranks.',
    },
    {
      zh: '又明年，遷布政使。',
      literal: 'The next year he was transferred to provincial treasurer.',
      idiomatic: 'The following year he was transferred to provincial treasurer.',
    },
    {
      zh: '僧格林沁戰歿曹州，坐法再乾議，皆得恩旨留任，於是言者復摭他款彈之，事下曾國籓，國籓白其無罪。',
      literal: 'Sengge Rinchen died in battle at Caozhou; legal proceedings were opened twice, each time an imperial edict kept him in office; critics then dredged up other charges, and the case was sent to Zeng Guofan, who declared him innocent.',
      idiomatic: 'After Sengge Rinchen fell at Caozhou, legal proceedings were opened twice, each time an imperial edict kept Baozhen in office. Critics then dredged up other charges, and the case was sent to Zeng Guofan, who declared him innocent.',
    },
    {
      zh: '巡撫閻敬銘夙高其能，至是乞休，舉以自代，遂拜巡撫之命。',
      literal: 'Governor Yan Jingming had long valued his ability; now he asked to retire and recommended him as his successor, and he received appointment as governor.',
      idiomatic: 'Governor Yan Jingming had long valued his ability. He now asked to retire and recommended Baozhen as his successor, and Baozhen received appointment as governor.',
    },
    {
      zh: '時捻趨海澨，李鴻章建議築牆膠萊河，寶楨會軍蹙之。',
      literal: 'The Nian were then pressing toward the coast; Li Hongzhang proposed building walls along the Jiao-Lai River, and Baozhen joined forces to hem them in.',
      idiomatic: 'The Nian were then pressing toward the coast. Li Hongzhang proposed building walls along the Jiao-Lai River, and Baozhen joined forces to hem them in.',
    },
    {
      zh: '六年，東捻走濰河，東軍王心安築壘方成，而堤牆未竣，捻長驅渡河，寶楨以聞。',
      literal: 'In the sixth year the eastern Nian fled to the Wei River; Wang Xin\'an of the eastern army had just finished building stockades, but the embankment wall was not complete; the Nian rode straight across the river, and Baozhen reported it.',
      idiomatic: 'In the sixth year the eastern Nian fled to the Wei River. Wang Xin\'an of the eastern army had just finished building stockades, but the embankment wall was not complete, and the Nian rode straight across the river. Baozhen reported the breach.',
    },
    {
      zh: '上怒，鴻章交部議，寶楨亦褫職留任。',
      literal: 'The emperor was furious; Li Hongzhang was referred to the ministry for investigation, and Baozhen was also stripped of office yet retained on duty.',
      idiomatic: 'The emperor was furious. Li Hongzhang was referred to the ministry for investigation, and Baozhen was also stripped of office yet retained on duty.',
    },
    {
      zh: '先是東軍守濰河，本皖將潘鼎新汛地。',
      literal: 'Earlier, when the eastern army held the Wei River, the sector had been the post of Anhui general Pan Dingxin.',
      idiomatic: 'Earlier, when the eastern army held the Wei River, the sector had been the post of Anhui general Pan Dingxin.',
    },
    {
      zh: '皖軍甫南移，而北路遽失。',
      literal: 'The Anhui army had only just shifted south when the northern route was suddenly lost.',
      idiomatic: 'The Anhui army had only just shifted south when the northern route was suddenly lost.',
    },
    {
      zh: '詔斬心安，寶楨抗辯，乃宥心安而責鴻章；',
      literal: 'An edict ordered Wang Xin\'an beheaded; Baozhen argued against it, and Xin\'an was pardoned while Li Hongzhang was blamed;',
      idiomatic: 'An edict ordered Wang Xin\'an beheaded. Baozhen argued against it, and Xin\'an was pardoned while Li Hongzhang was blamed;',
    },
    {
      zh: '寶楨复屢疏相詆，於是上益責鴻章忌刻縱寇矣。',
      literal: 'Baozhen again sent repeated memorials attacking Li Hongzhang, and the court increasingly blamed Li for narrow jealousy that allowed the bandits to roam free.',
      idiomatic: 'Baozhen again sent repeated memorials attacking Li Hongzhang, and the court increasingly blamed Li for narrow jealousy that allowed the bandits to roam free.',
    },
    {
      zh: '明年，西捻趨定州，近畿震動。',
      literal: 'The next year the western Nian pushed toward Dingzhou, shaking the capital region.',
      idiomatic: 'The next year the western Nian pushed toward Dingzhou and shook the capital region.',
    },
    {
      zh: '寶楨聞警，即馳至東昌，率騎旅千、精卒三千，齎五日糧，倍道北援，捻遂南潰。',
      literal: 'Hearing the alarm, Baozhen raced to Dongchang, led a thousand cavalry and three thousand elite troops with five days\' rations, and rushed north by forced marches; the Nian then broke south in rout.',
      idiomatic: 'Hearing the alarm, Baozhen raced to Dongchang, led a thousand cavalry and three thousand elite troops with five days\' rations, and rushed north by forced marches. The Nian then broke south in rout.',
    },
    {
      zh: '是役也，朝廷遣宿衛之旅出國門備寇，統兵諸將帥皆獲譴讓，而上獨以寶楨一軍猝出寇前，轉戰雄、任、深、祁、高、肅間，复饒陽，功最盛，數降敕褒嘉，加太子少保。',
      literal: 'In this campaign the court sent palace guard regiments beyond the capital to meet the threat, and every commanding general was censured; only Baozhen\'s army, suddenly appearing ahead of the bandits, fought through Xiong, Ren, Shen, Qi, Gao, and Su, recovered Raoyang, and won the greatest honors; he received repeated imperial commendations by decree and was made Junior Guardian of the Heir Apparent.',
      idiomatic: 'In this campaign the court sent palace guard regiments beyond the capital to meet the threat, and every commanding general was censured. Only Baozhen\'s army, suddenly appearing ahead of the bandits, fought through Xiong, Ren, Shen, Qi, Gao, and Su, recovered Raoyang, and won the greatest honors. He received repeated imperial commendations by decree and was made Junior Guardian of the Heir Apparent.',
    },
    {
      zh: '寶楨治軍善乘勢，不主畫疆自守，以故諸軍會集，東西二渠率皆就殲山東。',
      literal: 'Baozhen commanded troops by seizing momentum rather than guarding fixed boundaries, and so when forces gathered, the eastern and western Nian bands were both largely destroyed in Shandong.',
      idiomatic: 'Baozhen commanded troops by seizing momentum rather than guarding fixed boundaries, and so when forces gathered, the eastern and western Nian bands were both largely destroyed in Shandong.',
    },
  ],
  'source-qingshigao-447-wikisource-3990ca3462d8': [
    {
      zh: '光緒十七年，授甘肅新疆巡撫。',
      literal: 'In the seventeenth year of Guangxu he was appointed governor of Gansu and Xinjiang.',
      idiomatic: 'In the seventeenth year of Guangxu (1891) he was appointed governor of Gansu and Xinjiang.',
    },
    {
      zh: '當蔥嶺西，有地曰帕米爾，乾隆間為我軍鋒所及，高宗嘗勒銘焉。',
      literal: 'West of the Congling Mountains lies a region called the Pamirs; in the Qianlong period it was reached by our army\'s vanguard, and the Gaozong emperor once had an inscription carved there.',
      idiomatic: 'West of the Congling Mountains lies a region called the Pamirs. In the Qianlong period it was reached by our army\'s vanguard, and the Gaozong emperor once had an inscription carved there.',
    },
    {
      zh: '蔥嶺東南有小部落曰坎巨提，歲納貢於我。',
      literal: 'Southeast of the Congling Mountains is a small tribe called Kanjut, which paid annual tribute to us.',
      idiomatic: 'Southeast of the Congling Mountains is a small tribe called Kanjut, which paid annual tribute to China.',
    },
    {
      zh: '模未至新疆，俄侵帕米爾，謀通印度，英攻破坎巨提。',
      literal: 'Before Mo reached Xinjiang, Russia invaded the Pamirs, seeking a route to India, and Britain captured Kanjut.',
      idiomatic: 'Before Mo reached Xinjiang, Russia invaded the Pamirs, seeking a route to India, and Britain captured Kanjut.',
    },
    {
      zh: '中外方議戰，模謂：「將士能戡土匪，未能禦強敵。',
      literal: 'China and foreign powers were debating war; Mo said: "Our officers and men can subdue bandits but cannot withstand powerful enemies.',
      idiomatic: 'As China and foreign powers debated war, Mo said, "Our officers and men can subdue bandits but cannot withstand powerful enemies.',
    },
    {
      zh: '軍資百物，運自內地，數月乃達。',
      literal: 'Military supplies of every kind must be transported from the interior and take months to arrive.',
      idiomatic: 'Military supplies of every kind must be transported from the interior and take months to arrive.',
    },
    {
      zh: '俄、英鐵軌，瞬息可至。',
      literal: 'Russia and Britain have rail lines; they can reach us in an instant.',
      idiomatic: 'Russia and Britain have rail lines and can reach us in an instant.',
    },
    {
      zh: '新疆與俄相接幾五千里，增兵十倍未足固。',
      literal: 'Xinjiang borders Russia for nearly five thousand li; even ten times the present garrison would not secure it.',
      idiomatic: 'Xinjiang borders Russia for nearly five thousand li; even ten times the present garrison would not secure it.',
    },
    {
      zh: '當民窮財匱之時，不可輕言戰。',
      literal: 'When the people are poor and the treasury is exhausted, one must not lightly speak of war.',
      idiomatic: 'When the people are poor and the treasury is exhausted, one must not lightly speak of war.',
    },
    {
      zh: '惟當購機砲，擴電線，飭邊將嚴為備。',
      literal: 'We should only purchase machine-guns and artillery, expand telegraph lines, and order frontier generals to prepare defenses strictly.',
      idiomatic: 'We should only purchase machine-guns and artillery, expand telegraph lines, and order frontier generals to prepare defenses strictly.',
    },
    {
      zh: '羈坎巨提故酋無令北走，而撫其流民，與駐俄、英使臣合爭。」',
      literal: 'Detain Kanjut\'s former chief so he cannot flee north, comfort the displaced people, and join the ministers stationed in Russia and Britain in pressing our claims."',
      idiomatic: 'Detain Kanjut\'s former chief so he cannot flee north, comfort the displaced people, and join the ministers stationed in Russia and Britain in pressing our claims."',
    },
    {
      zh: '議未定，俄曰防英，英曰防俄，莫可究詰。',
      literal: 'No decision was reached; Russia said it was guarding against Britain, Britain said it was guarding against Russia, and no one could get to the bottom of it.',
      idiomatic: 'No decision was reached. Russia said it was guarding against Britain, Britain said it was guarding against Russia, and no one could get to the bottom of it.',
    },
    {
      zh: '明年，二國兵益進，將吏咸憤激請戰，終不許。',
      literal: 'The next year both countries advanced troops further; local officials were all stirred to demand war, but permission was never granted.',
      idiomatic: 'The next year both countries advanced troops further. Local officials were all stirred to demand war, but permission was never granted.',
    },
    {
      zh: '於是奏請廢黜坎巨提故酋。',
      literal: 'Thereupon he memorialized asking that Kanjut\'s former chief be deposed.',
      idiomatic: 'Thereupon he memorialized asking that Kanjut\'s former chief be deposed.',
    },
    {
      zh: '會英人亦立其弟買賣提艾孜木，令鎮撫部民，歲納貢如故事，坎巨提事乃定。',
      literal: 'Britain also installed his younger brother Maimaidi Aizimu to pacify the tribesmen and pay annual tribute as before, and the Kanjut affair was settled.',
      idiomatic: 'Britain also installed his younger brother Maimaidi Aizimu to pacify the tribesmen and pay annual tribute as before, and the Kanjut affair was settled.',
    },
  ],
  'source-qingshigao-447-wikisource-1eec73b51e08': [
    {
      zh: '同治六年，移師鳳陽。',
      literal: 'In the sixth year of Tongzhi he moved his army to Fengyang.',
      idiomatic: 'In the sixth year of Tongzhi (1867) he moved his army to Fengyang.',
    },
    {
      zh: '時捻酋李允謀窺廬、鳳，詣五河就李世忠。',
      literal: 'At the time the Nian chief Li Yun plotted to probe Luzhou and Fengyang and went to Wuhe to join Li Shizhong.',
      idiomatic: 'At the time the Nian chief Li Yun plotted to probe Luzhou and Fengyang and went to Wuhe to join Li Shizhong.',
    },
    {
      zh: '念祖诇知之，計說世忠縛以獻，鏁送壽州寘之法，晉按察使。',
      literal: 'Nianzu learned of this through espionage and persuaded Shizhong to bind him and present him as a captive; he was chained and sent to Shouzhou for execution according to law, and Nianzu was promoted to judicial commissioner.',
      idiomatic: 'Nianzu learned of this through espionage and persuaded Shizhong to bind Li Yun and present him as a captive. Li Yun was chained and sent to Shouzhou for execution according to law, and Nianzu was promoted to judicial commissioner.',
    },
    {
      zh: '援滕縣，既捷，師還，寇逾萬躡其後，乃掘深溝，布機械，陰徙去，追騎多墜死，人服其智略。',
      literal: 'Reinforcing Tengxian, he won a victory; as the army withdrew more than ten thousand bandits followed behind; he dug deep trenches, deployed mechanical obstacles, and secretly moved away; many pursuing cavalry fell to their deaths, and people admired his resourcefulness.',
      idiomatic: 'Reinforcing Tengxian, he won a victory. As the army withdrew, more than ten thousand bandits followed behind. He dug deep trenches, deployed mechanical obstacles, and secretly moved away. Many pursuing cavalry fell to their deaths, and people admired his resourcefulness.',
    },
    {
      zh: '直東平，賜號捷勇巴圖魯。',
      literal: 'At Dongping he was granted the title Jieyong Batulu.',
      idiomatic: 'At Dongping he was granted the title Jieyong Batulu.',
    },
    {
      zh: '八年，除山西按察使，年未及三十也。',
      literal: 'In the eighth year he was appointed judicial commissioner of Shanxi, yet he was not yet thirty.',
      idiomatic: 'In the eighth year he was appointed judicial commissioner of Shanxi, though he was not yet thirty.',
    },
    {
      zh: '上慮其資名輕，與直隸按察使張樹聲易官，令曾國籓察覆，稱念祖明爽，磨厲當成大器，宜稍緩任事，遂解職，留直差序。',
      literal: 'The emperor worried that his youth and reputation were slight; he was exchanged with Zhang Shusheng, judicial commissioner of Zhili, and Zeng Guofan was ordered to investigate; Guofan praised Nianzu as clear-minded and said that with further tempering he would become a great figure but that he should be eased into responsibility more slowly; he was therefore removed from office and kept in the Zhili reserve roster.',
      idiomatic: 'The emperor worried that his youth and reputation were slight. He was exchanged with Zhang Shusheng, judicial commissioner of Zhili, and Zeng Guofan was ordered to investigate. Guofan praised Nianzu as clear-minded and said that with further tempering he would become a great figure but that he should be eased into responsibility more slowly. He was therefore removed from office and kept on the Zhili reserve roster.',
    },
    {
      zh: '十年，左遷甘肅安肅道，主關內外糧運，給食不乏，征西軍倚以集事，頗見賞於左宗棠。',
      literal: 'In the tenth year he was demoted to intendant of Ansuhu in Gansu, in charge of grain transport inside and outside the passes; provisions never ran short, and the western expeditionary army relied on him to gather strength; he won considerable praise from Zuo Zongtang.',
      idiomatic: 'In the tenth year he was demoted to intendant of Ansuhu in Gansu, in charge of grain transport inside and outside the passes. Provisions never ran short, and the western expeditionary army relied on him to gather strength. He won considerable praise from Zuo Zongtang.',
    },
    {
      zh: '光緒四年，晉按察使。',
      literal: 'In the fourth year of Guangxu he was promoted again to judicial commissioner.',
      idiomatic: 'In the fourth year of Guangxu (1878) he was promoted again to judicial commissioner.',
    },
    {
      zh: '多所平反，理俞應鈞等殺降回讞忤宗棠意，再被劾去。',
      literal: 'He reversed many wrongful verdicts; in handling the case of Yu Yingjun and others for killing surrendered Muslims he offended Zongtang\'s wishes and was impeached and removed again.',
      idiomatic: 'He reversed many wrongful verdicts. In handling the case of Yu Yingjun and others for killing surrendered Muslims he offended Zuo Zongtang\'s wishes and was impeached and removed again.',
    },
    {
      zh: '十年，起雲南按察使。',
      literal: 'In the tenth year he was recalled as judicial commissioner of Yunnan.',
      idiomatic: 'In the tenth year he was recalled as judicial commissioner of Yunnan.',
    },
    {
      zh: '歷貴州，調補雲南布政使。',
      literal: 'He served in Guizhou and was transferred to provincial treasurer of Yunnan.',
      idiomatic: 'He served in Guizhou and was transferred to provincial treasurer of Yunnan.',
    },
    {
      zh: '時總督岑毓英督師出關，需餉亟，而巡撫張凱嵩與有郄。',
      literal: 'At the time Governor-General Cen Yuying was leading troops beyond the border and needed funds urgently, while Governor Zhang Kaixuan bore a grudge against him.',
      idiomatic: 'At the time Governor-General Cen Yuying was leading troops beyond the border and needed funds urgently, while Governor Zhang Kaixuan bore a grudge against him.',
    },
    {
      zh: '念祖為陳公私利害，請以地丁錢漕受巡撫指麾，釐金雜稅供總督兵餉，復為貸商款備糧械，毓英德之，密薦其賢。',
      literal: 'Nianzu explained the public and private stakes, asking that land-tax and grain-transport funds be directed by the governor while miscellaneous levies supplied the governor-general\'s military pay; he also secured merchant loans for grain and arms; Yuying was grateful and secretly recommended his worth.',
      idiomatic: 'Nianzu explained the public and private stakes, asking that land-tax and grain-transport funds be directed by the governor while miscellaneous levies supplied the governor-general\'s military pay. He also secured merchant loans for grain and arms. Yuying was grateful and secretly recommended his worth.',
    },
    {
      zh: '二十一年，授廣西巡撫。',
      literal: 'In the twenty-first year he was appointed governor of Guangxi.',
      idiomatic: 'In the twenty-first year he was appointed governor of Guangxi.',
    },
    {
      zh: '桂故多匪，至則選卒逐捕，痛繩以法，匪皆斂跡。',
      literal: 'Guangxi had long been full of bandits; on arrival he chose soldiers to hunt them down and punished them severely by law, and the bandits all shrank back.',
      idiomatic: 'Guangxi had long been full of bandits. On arrival he chose soldiers to hunt them down and punished them severely by law, and the bandits all shrank back.',
    },
    {
      zh: '坐失察贓罪，罷免。',
      literal: 'He was dismissed for failure to detect corruption.',
      idiomatic: 'He was dismissed for failure to detect corruption.',
    },
    {
      zh: '三十一年，賞加副都統銜，命赴奉天隨將軍趙爾巽治賑。',
      literal: 'In the thirty-first year he was granted the rank of vice commandant and ordered to Fengtian to assist General Zhao Erxun in famine relief.',
      idiomatic: 'In the thirty-first year he was granted the rank of vice commandant and ordered to Fengtian to assist General Zhao Erxun in famine relief.',
    },
    {
      zh: '尋督三省鹽務及財政局。',
      literal: 'Soon he supervised salt administration and financial affairs in three provinces.',
      idiomatic: 'Soon he supervised salt administration and financial affairs in three provinces.',
    },
    {
      zh: '奉省吏治不飭，冒憲黷貨，弊風相踵，念祖佐爾巽力抉其弊，蠲苛息煩，歲入倍蓰。',
      literal: 'Fengtian\'s official governance was lax; false credentials and bribery ran in succession; Nianzu helped Erxun forcefully root out abuses, cut harsh levies and eased burdens, and annual revenue doubled.',
      idiomatic: 'Fengtian\'s official governance was lax, and false credentials and bribery ran in succession. Nianzu helped Erxun forcefully root out abuses, cut harsh levies and eased burdens, and annual revenue doubled.',
    },
    {
      zh: '期年奏績，上嘉之，晉記名副都統。',
      literal: 'Within a year he reported results and the emperor commended him, promoting him to brevet vice commandant.',
      idiomatic: 'Within a year he reported results and the emperor commended him, promoting him to brevet vice commandant.',
    },
    {
      zh: '爾巽移蜀，徐世昌代之，又劾罷。',
      literal: 'When Erxun was transferred to Sichuan and Xu Shichang replaced him, Nianzu was impeached and dismissed again.',
      idiomatic: 'When Erxun was transferred to Sichuan and Xu Shichang replaced him, Nianzu was impeached and dismissed again.',
    },
    {
      zh: '宣統二年，卒。',
      literal: 'In the second year of Xuantong he died.',
      idiomatic: 'In the second year of Xuantong (1910) he died.',
    },
    {
      zh: '爾巽先後上其功，复巡撫原官，卹如製。',
      literal: 'Erxun repeatedly memorialized his achievements; his former governorship was restored posthumously and condolences were granted according to regulation.',
      idiomatic: 'Erxun repeatedly memorialized his achievements. His former governorship was restored posthumously and condolences were granted according to regulation.',
    },
  ],
};

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
for (const [id, rows] of Object.entries(packets)) {
  const item = queue.items.find((x) => x.id === id);
  if (!item) throw new Error(`Missing ${id}`);
  item.manualTranslations = rows.map((row) => ({
    ...row,
    translator: T,
    model: M,
  }));
  item.acceptedSourceText = rows.map((r) => r.zh).join('');
  item.status = 'approved';
  item.decision = 'approved';
  item.notes = 'Restored missing upstream biography text with manual translations.';
  item.reviewedAt = new Date().toISOString();
  item.reviewer = 'sdk-repair-chapter';
}
fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

for (const id of Object.keys(packets)) {
  execSync(
    `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${id} --item ${id} --reviewer sdk-repair-chapter`,
    { stdio: 'inherit' },
  );
}

console.log('Applied qingshigao/447 source correspondence omissions.');
