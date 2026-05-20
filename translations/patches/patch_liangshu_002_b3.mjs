#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'On day bingwu, the Phoenix Bearing the Book troupe was abolished.',
    'On day bingwu, the court abolished the Phoenix Bearing the Book performance.',
  ],
  s0202: [
    'On day wushen, an edict said: "In sacrificial offerings at the suburban altars and feasts to the Lord on High, the utmost reverence lies therein; with utmost sincerity and diligence one still fears falling short;',
    'On day wushen, an edict said, "To sacrifice at the suburban altars and feast the Lord on High is the highest reverence; even with full sincerity one still fears some lapse;',
  ],
  s0203: [
    'yet past ages often had palace women watch this rite at will; canopy-palaces were widely set up and curtained carriages glittered on the roads—not the way to look up in reverence to azure Heaven and manifest gratitude to the divine.',
    'yet earlier reigns often let palace women come and watch at will, with canopy-pavilions strung along the route and curtained carriages blazing on every road—not how one should bow before azure Heaven and show the upper powers one\'s heart.',
  ],
  s0204: [
    'Among the retinue chariots, past ages were criticized for this—henceforth let it be stopped from today.',
    'The retinue itself was mocked in former times for this; from today it shall cease.',
  ],
  s0205: [
    '" On day xinhai, the imperial carriage personally sacrificed at the Southern Suburban Altar and pardoned the realm.',
    '" On day xinhai, the emperor sacrificed at the Southern Suburban Altar in person and pardoned the realm.',
  ],
  s0206: [
    'In the second month, on day renwu, Commandant of Guards Yang Gongze was sent to lead palace guards to block Luokou.',
    'In the second month, on day renwu, Commandant of Guards Yang Gongze led the palace guard to seal Luokou.',
  ],
  s0207: [
    'On day renchen, Jiaozhou Inspector Li Kai seized the province in rebellion; Chief Clerk Li Di put the revolt down.',
    'On day renchen, Jiaozhou inspector Li Kai rebelled and held the province; chief clerk Li Di crushed him.',
  ],
  s0208: [
    'A partial pardon was granted to Jiaozhou.',
    'Jiaozhou received a special pardon.',
  ],
  s0209: [
    'On day wuxu, former Yingzhou Inspector Cao Jingzong was made Central Protector General.',
    'On day wuxu, former Yingzhou inspector Cao Jingzong was appointed Central Protector General.',
  ],
  s0210: [
    'That month, Jianxing Park was established at Jianxing lane in Moling.',
    'That month the court established Jianxing Park in Jianxing lane, Moling.',
  ],
  s0211: [
    'In summer, the fourth month, on day dingsi, Acting King of Dangchang Liang Mibo was made General Who Pacifies the West, Inspector of He and Liang provinces, and King of Dangchang.',
    'In summer, fourth month, day dingsi, Acting King of Dangchang Liang Mibo was made General Who Pacifies the West, inspector of He and Liang, and King of Dangchang.',
  ],
  s0212: [
    'That month, from day jiayin to day renxu, sweet dew fell continuously in Hualin Garden.',
    'That month, from jiayin through renxu, sweet dew fell again and again in Hualin Garden.',
  ],
  s0213: [
    'In the fifth month, on day xinmao, auspicious grain grew in Shuoyin lane, Jiankang county—one stalk bearing twelve ears.',
    'In the fifth month, on day xinmao, Jiankang county\'s Shuoyin lane produced auspicious grain: one stalk with twelve ears.',
  ],
  s0214: [
    'In the sixth month, on day gengxu, the Temple of Confucius was established.',
    'In the sixth month, on day gengxu, a temple to Confucius was established.',
  ],
  s0215: [
    'On day renxu, Jupiter was visible in daytime.',
    'On day renxu, Jupiter appeared in daylight.',
  ],
  s0216: [
    'In autumn, the seventh month, on day xinmao, Right Grandee for Splendid Merit Zhang Gui died.',
    'In autumn, seventh month, day xinmao, Right Grandee for Splendid Merit Zhang Gui died.',
  ],
  s0217: [
    'In the eighth month, on day gengzi, the Old Man Star appeared.',
    'In the eighth month, on day gengzi, the Old Man Star was seen.',
  ],
  s0218: [
    'In winter, the tenth month, on day bingwu, the Northern Campaign began; Central Army General and Yangzhou Inspector Prince of Linchuan Hong was made overall commander of Northern Expedition forces, with Right Vice Director of the Masters of Writing Liu Yan as deputy.',
    'In winter, tenth month, day bingwu, the Northern Campaign opened; Central Army General and Yangzhou inspector Prince of Linchuan Hong took overall command of the northern expedition, with Right Vice Director Liu Yan as his deputy.',
  ],
  s0219: [
    'That year, because of the cost of raising troops, princes and dukes downward each submitted land rents and field grain to assist military funds.',
    'That year, to meet the cost of war, every prince and duke down the ranks offered land rents and field grain for the army.',
  ],
  s0220: [
    'In the eleventh month, on day xinwei, Director of the Masters of Writing for Capital Crimes Zhang Ji was made Commander-in-Chief.',
    'In the eleventh month, on day xinwei, Capital Crimes Director Zhang Ji was made Commander-in-Chief.',
  ],
  s0221: [
    'On day jiawu, the sky was clear; in the southwest there was lightning, and thunder was heard three times.',
    'On day jiawu the sky was bright and clear, yet lightning flashed in the southwest and thunder rolled three times.',
  ],
  s0222: [
    'In the twelfth month, Chancellor of State and Director of the Masters of Writing Xie Tiao took mourning for his birth mother and left office.',
    'In the twelfth month, Chancellor of State and Director of the Masters of Writing Xie Tiao left office to mourn his birth mother.',
  ],
  s0223: [
    'That year brought a great harvest; rice was thirty cash per hu.',
    'That year the harvest was abundant; rice sold for thirty cash the hu.',
  ],
  s0224: [
    'In the fifth year, spring, first month, on the first day dingmao, an edict said: "In the past Zhou and Han took scholars from the four directions.',
    'In the fifth year, spring, first month, first day dingmao, an edict said, "In olden days Zhou and Han drew their scholars from every quarter of the realm.',
  ],
  s0225: [
    'In recent generations decline and error prevailed; remote and obscure talent was rarely reached; people were isolated and places cut off, blocking imperial hearing; scholarly conduct sank, and thus encouragement failed.',
    'Later ages decayed, and men in hidden corners seldom reached the throne; cut off by distance and desolation, their voices never reached the court, talent withered, and no one was moved to strive.',
  ],
  s0226: [
    'Is it that mountains and rivers release spirit unevenly, favoring some and not others? No—it is truly because of knowing and not knowing, employing and not employing.',
    'Is it that the mountains and rivers breathe out spirit with partial favor? No—the difference lies only in whether talent is seen and used.',
  ],
  s0227: [
    'I with meager virtue rule these myriad people, yet broad enlightenment and wide illumination are confined within hall and door; flying ear and long eye cannot reach the four directions—forever I speak with ashamed heart, forgetting not morning nor evening.',
    'I am of little merit, yet I rule the myriad people; though my light should shine far, it stays trapped within these halls, and my ears and eyes cannot reach the four quarters. I am ashamed morning and night, and cannot put this from my mind.',
  ],
  s0228: [
    'All old families of every commandery and kingdom that have no one in court office—let selection officers search and see that each commandery has one.',
    'Wherever an old clan in a commandery or kingdom has no one in court office, let the selection officers search them out so that every commandery may send at least one man.',
  ],
  s0229: [
    '" On day yihai, former Chancellor Xie Tiao was made Supervisor of the Secretariat, Chancellor of State, and Guard General; Pacification Army General Shen Yue was made Right Grandee for Splendid Merit; Prince of Yuzhang Zong was made South Xuzhou Inspector.',
    '" On day yihai, former chancellor Xie Tiao was made Supervisor of the Secretariat, Chancellor of State, and Guard General; Pacification Army General Shen Yue became Right Grandee for Splendid Merit; and Prince of Yuzhang Zong was made South Xuzhou inspector.',
  ],
  s0230: [
    'On day dingchou, Left Vice Director of the Masters of Writing Wang Ying was made Protector General, retaining his vice director title.',
    'On day dingchou, Left Vice Director Wang Ying was made Protector General while keeping his vice directorship.',
  ],
  s0231: [
    'On day jiashen, the prince Gang was established as Prince of Jin\'an commandery.',
    'On day jiashen, Prince Gang was enfeoffed as Prince of Jin\'an commandery.',
  ],
  s0232: [
    'On day dinghai, Venus was visible in daytime.',
    'On day dinghai, Venus appeared in daylight.',
  ],
  s0233: [
    'In the second month, on day gengxu, Grand Master of Ceremonies Zhang Chong was appointed Director of the Ministry of Personnel.',
    'In the second month, on day gengxu, Grand Master of Ceremonies Zhang Chong was made Director of the Ministry of Personnel.',
  ],
  s0234: [
    'In the third month, on the first day bingyin, there was a solar eclipse.',
    'In the third month, first day bingyin, the sun was eclipsed.',
  ],
  s0235: [
    'On day guiwei, Wei Emperor Xuanwu\'s cousin Yi led his brothers to surrender.',
    'On day guiwei, Yi, cousin to Wei Emperor Xuanwu, came over with his brothers.',
  ],
  s0236: [
    'Auxiliary State General Liu Sixiao defeated Wei Qingzhou Inspector Yuan Xi at the Jiao River.',
    'Auxiliary State General Liu Sixiao routed Wei Qingzhou inspector Yuan Xi on the Jiao River.',
  ],
  s0237: [
    'On day dinghai, Chen Bozhi from Shouyang led his forces to surrender.',
    'On day dinghai, Chen Bozhi marched out of Shouyang with his troops and surrendered.',
  ],
  s0238: [
    'In summer, the fourth month, on day bingshen, two bronze swords were obtained at Renshan in Gaochang, Luling; one eight-eyed turtle was obtained at Shifeng county.',
    'In summer, fourth month, day bingshen, two bronze swords were found at Renshan in Luling\'s Gaochang, and an eight-eyed turtle at Shifeng county.',
  ],
  s0239: [
    'On day jiayin, an edict said: "I rise at dawn and dwell in abstinence; punishment alone is my concern—three verdicts and five hearings, whether waking or sleeping always on my mind.',
    'On day jiayin, an edict said, "I rise before dawn and keep myself in restraint; the law alone weighs on me—three reviews, five hearings, whether I sleep or wake I cannot put it aside.',
  ],
  s0240: [
    'Therefore the lung-stone was set up in the capital streets and offices were added at the imperial prison; with earnest diligence I personally review—small and great according to circumstance.',
    'For this I set the grievance stone in the capital streets and added officers at the imperial prison, reviewing cases myself with care, weighing small and great alike.',
  ],
  s0241: [
    'Yet clarity and caution have not fully reached; prisons still clog—I ever speak of falling into the moat, and for this I feel shame.',
    'Yet judgment is not yet clear enough, and the jails remain choked. I speak of drowning in the ditch, and the shame is mine.',
  ],
  s0242: [
    'All jail-houses may send judicial officers and close attendants in rotation to record prisoners; if there is wrongful detention, report it in timely fashion."',
    'Let every prison send judicial officers and close attendants in turn to record the prisoners; where anyone is held unjustly, report it at once."',
  ],
  s0243: [
    'In the fifth month, on day xinwei, Left Guard of the Crown Prince Zhang Huishao captured Wei Suzhou city.',
    'In the fifth month, on day xinwei, Left Guard of the Crown Prince Zhang Huishao took Wei Suzhou city.',
  ],
  s0244: [
    'On day yihai, Prince of Linchuan Hong\'s vanguard captured Liang city.',
    'On day yihai, Prince of Linchuan Hong\'s vanguard took Liang city.',
  ],
  s0245: [
    'On day xinsi, Yuzhou Inspector Wei Rui captured Hefei city.',
    'On day xinsi, Yuzhou inspector Wei Rui took Hefei.',
  ],
  s0246: [
    'On day dinghai, Lujiang Administrator Pei Sui captured Yangshi city;',
    'On day dinghai, Lujiang administrator Pei Sui took Yangshi city;',
  ],
  s0247: [
    'on day gengyin, he also captured Huoqiu city.',
    'on day gengyin, he took Huoqiu as well.',
  ],
  s0248: [
    'On day xinmao, Venus was visible in daytime.',
    'On day xinmao, Venus appeared in daylight.',
  ],
  s0249: [
    'In the sixth month, on day gengzi, Qing and Ji Inspectors Huan He\'s vanguard captured Qushan city.',
    'In the sixth month, on day gengzi, the vanguard of Qing and Ji inspector Huan He took Qushan city.',
  ],
  s0250: [
    'In autumn, the seventh month, on day yichou, the kingdom of Dengzhi sent envoys offering local products.',
    'In autumn, seventh month, day yichou, Dengzhi sent envoys with tribute.',
  ],
  s0251: [
    'In the eighth month, on day wuxu, the Old Man Star appeared.',
    'In the eighth month, on day wuxu, the Old Man Star was seen.',
  ],
  s0252: [
    'On day xinyou, the Crown Prince\'s palace was built.',
    'On day xinyou, work on the Crown Prince\'s palace was completed.',
  ],
  s0253: [
    'In winter, the eleventh month, on day jiazi, the capital shook with earthquake.',
    'In winter, eleventh month, day jiazi, the capital was shaken by earthquake.',
  ],
  s0254: [
    'On day yichou, because the campaign had dragged on, a great pardon was granted the realm.',
    'On day yichou, because the armies had been in the field so long, the realm received a great pardon.',
  ],
  s0255: [
    'Wei raided Zhongli; Right Guard General Cao Jingzong was sent to lead troops to relieve it.',
    'When Wei struck Zhongli, Right Guard General Cao Jingzong was sent with troops to relieve the city.',
  ],
  s0256: [
    'In the twelfth month, on day guimao, Chancellor of State Xie Tiao died.',
    'In the twelfth month, on day guimao, Chancellor of State Xie Tiao died.',
  ],
  s0257: [
    'In the sixth year, spring, first month, on the first day xinyou, an edict said: "A gem an inch across may lie hidden in sand and mud;',
    'In the sixth year, spring, first month, first day xinyou, an edict said, "A gem no larger than an inch may lie buried in sand and mud;',
  ],
  s0258: [
    'to dismiss words because of the speaker—the gentleman takes this as a warning.',
    'and to reject a man\'s words because of the man himself is what the gentleman warns against.',
  ],
  s0259: [
    'I listen to court until evening dismissal, thinking to clarify governance; though the hundred ministers and grandees—all who have thoughts I hear—yet voices stored in border and remote lands have not reached the Wei gate.',
    'I hold court until evening, seeking to sharpen my rule; though the hundred ministers and grandees may speak their minds to me, voices held back in distant borders still never reach the palace gate.',
  ],
  s0260: [
    'Some are constrained by poverty and low standing, some separated by mountains and rivers; they stamp their feet and stretch their necks but have no means to present and reach.',
    'Some are held down by poverty and low birth, others cut off by mountains and rivers; they stamp their feet and crane their necks, yet have no way to bring their words before me.',
  ],
  s0261: [
    'How is this the way to float and sink without leakage, near and far both obtained?',
    'How can the realm be governed so that nothing is lost between near and far, high and low?',
  ],
  s0262: [
    'Scholars and commoners of the four directions—if any wish to speak on punishment and government, benefit the state and benefit the people, submerged and blocked in remote depths and cannot reach on their own—may each set forth their proposals and lay their hearts before the inspectors and the two-thousand-bushel officials.',
    'Scholars and commoners everywhere who wish to speak on law and government, on what would benefit the state and the people, yet are buried in remote places and cannot reach me themselves, may lay out their proposals before the inspectors and the two-thousand-bushel officials.',
  ],
  s0263: [
    'What can be reported for selection—small and great let it be heard."',
    'Whatever deserves attention, great or small, let it be brought to my hearing."',
  ],
  s0264: [
    'On day jimao, an edict said: "He who possesses the realm—righteousness is not for himself.',
    'On day jimao, an edict said, "Whoever holds the realm does not hold it for himself alone.',
  ],
  s0265: [
    'Famine, pestilence, weapons, fire and water—if one of these exists, blame returns to the sovereign.',
    'Famine, plague, war, fire, or flood—where one of these strikes, the fault lies with the ruler.',
  ],
  s0266: [
    'Now the prayer masters request supplication, transferring all ill fortune—let my person bear it.',
    'Now the prayer masters ask to offer sacrifice and shift every ill upon another; let it fall on me instead.',
  ],
  s0267: [
    'Ever may calamity not reach the myriad people; may these lower people gradually receive peace and rest.',
    'May disaster never touch the myriad people; may those below me little by little know peace.',
  ],
  s0268: [
    'Do not pray blessings for me, thereby adding to my fault.',
    'Do not pray for my sake and thereby deepen my guilt.',
  ],
  s0269: [
    'Specially promulgated near and far—all are ordered to obey."',
    'Let this be proclaimed everywhere, near and far, and obeyed as law."',
  ],
  s0270: [
    'In the second month, on day jiachen, the Old Man Star appeared.',
    'In the second month, on day jiachen, the Old Man Star was seen.',
  ],
  s0271: [
    'In the third month, on the first day gengshen, falling frost killed the grass.',
    'In the third month, first day gengshen, frost fell and killed the grass.',
  ],
  s0272: [
    'That month, three elephants entered the capital.',
    'That month three elephants entered the capital.',
  ],
  s0273: [
    'In summer, the fourth month, on day renchen, the posts of Left and Right Valiant Cavalry General and Left and Right Mobile Strike General were established.',
    'In summer, fourth month, day renchen, the court established the posts of Left and Right Valiant Cavalry General and Left and Right Mobile Strike General.',
  ],
  s0274: [
    'On day guisi, Cao Jingzong, Wei Rui, and others defeated the Wei army at Shaoyang Isle; those slain and captured numbered ten thousand and more.',
    'On day guisi, Cao Jingzong, Wei Rui, and the rest routed the Wei army at Shaoyang Isle, killing and capturing more than ten thousand men.',
  ],
  s0275: [
    'On day guimao, Right Guard General Cao Jingzong was made Commander-in-Chief and Xuzhou Inspector.',
    'On day guimao, Right Guard General Cao Jingzong was made Commander-in-Chief and Xuzhou inspector.',
  ],
  s0276: [
    'On day jiyou, Jiangzhou Inspector Wang Mao was made Right Vice Director of the Masters of Writing; Supervisor of the Secretariat Prince of Ancheng Xiu was made General Who Pacifies the South and Jiangzhou Inspector.',
    'On day jiyou, Jiangzhou inspector Wang Mao was made Right Vice Director of the Masters of Writing, and Supervisor of the Secretariat Prince of Ancheng Xiu was made General Who Pacifies the South and Jiangzhou inspector.',
  ],
  s0277: [
    'Heng province was established by dividing Xiang and Guang provinces.',
    'Heng province was created from parts of Xiang and Guang.',
  ],
  s0278: [
    'On day dingsi, Central Army General and Yangzhou Inspector Prince of Linchuan Hong was made Rapid Cavalry General with open office equal-to-three-division protocol; Pacification Army General Prince of Jian\'an Wei was made Yangzhou Inspector; Right Grandee for Splendid Merit Shen Yue was made Left Vice Director of the Masters of Writing; Left Vice Director Wang Ying was made Central Army General.',
    'On day dingsi, Central Army General and Yangzhou inspector Prince of Linchuan Hong was made Rapid Cavalry General with open office equal-to-three-division protocol; Pacification Army General Prince of Jian\'an Wei became Yangzhou inspector; Right Grandee for Splendid Merit Shen Yue became Left Vice Director; and Left Vice Director Wang Ying was made Central Army General.',
  ],
  s0279: [
    'In the fifth month, on day jiwei, newly appointed Left Valiant Cavalry General Prince of Changsha Shenye was made Central Protector General.',
    'In the fifth month, on day jiwei, newly appointed Left Valiant Cavalry General Prince of Changsha Shenye was made Central Protector General.',
  ],
  s0280: [
    'On day guihai, Palace Attendant Yuan Ang was made Director of the Ministry of Personnel.',
    'On day guihai, Palace Attendant Yuan Ang was appointed Director of the Ministry of Personnel.',
  ],
  s0281: [
    'On day jisi, Central Guard and Central Power generals were established; Valiant Cavalry was changed to Cloud Cavalry, Mobile Strike to Mobile Cavalry.',
    'On day jisi, the posts of Central Guard General and Central Power General were created; Valiant Cavalry was renamed Cloud Cavalry, and Mobile Strike was renamed Mobile Cavalry.',
  ],
  s0282: [
    'On day xinwei, Right General and Yangzhou Inspector Prince of Jian\'an Wei was promoted to Central Power General.',
    'On day xinwei, Right General and Yangzhou inspector Prince of Jian\'an Wei was advanced to Central Power General.',
  ],
  s0283: [
    'In the sixth month, on day gengxu, General of Chariots and Cavalry and Xiangzhou Inspector Xiahou Xiang was made Right Grandee for Splendid Merit; newly appointed Grandee for Splendid Merit with the Golden Seal and Purple Tassel Liu Yan was made General Who Pacifies the South and Xiangzhou Inspector.',
    'In the sixth month, on day gengxu, General of Chariots and Cavalry and Xiangzhou inspector Xiahou Xiang was made Right Grandee for Splendid Merit, and newly appointed Grandee for Splendid Merit with the Golden Seal and Purple Tassel Liu Yan was made General Who Pacifies the South and Xiangzhou inspector.',
  ],
  s0284: [
    'One four-eyed turtle was obtained in Xinwu county.',
    'A four-eyed turtle was found in Xinwu county.',
  ],
  s0285: [
    'In autumn, the seventh month, on day jiazi, Venus was visible in daytime.',
    'In autumn, seventh month, day jiazi, Venus appeared in daylight.',
  ],
  s0286: [
    'On day bingyin, Gui province was established by dividing Guang province.',
    'On day bingyin, Gui province was carved out of Guang.',
  ],
  s0287: [
    'On day dinghai, newly appointed Right Vice Director Wang Mao was made Central Guard General.',
    'On day dinghai, newly appointed Right Vice Director Wang Mao was made Central Guard General.',
  ],
  s0288: [
    'In the eighth month, on day wuzi, the realm was pardoned.',
    'In the eighth month, on day wuzi, the realm was pardoned.',
  ],
  s0289: [
    'On day wuxu, a great wind snapped trees.',
    'On day wuxu, a fierce wind broke trees.',
  ],
  s0290: [
    'The capital suffered great flood; water came in with the tidal bore, raising the imperial road by seven chi.',
    'The capital was flooded; the tide drove water inland and lifted the imperial road seven chi.',
  ],
  s0291: [
    'In the ninth month, auspicious grain with one stalk and nine ears grew in Jiangling county.',
    'In the ninth month, Jiangling county produced auspicious grain: one stalk with nine ears.',
  ],
  s0292: [
    'On day yihai, the Review-of-Troops Hall was renamed Virtue-and-Yang Hall, and the Court-for-Hearing-Litigation Hall was renamed Hall of Esteeming Worthies.',
    'On day yihai, the Review-of-Troops Hall became Virtue-and-Yang Hall, and the Court-for-Hearing-Litigation Hall became the Hall of Esteeming Worthies.',
  ],
  s0293: [
    'On day bingxu, Left Guard General Lü Sengzhen was made General Who Pacifies the North and South Yanzhou Inspector; Interior Secretary of Yuzhang Xiao Chang was made Guangzhou Inspector.',
    'On day bingxu, Left Guard General Lü Sengzhen was made General Who Pacifies the North and South Yanzhou inspector, and Interior Secretary of Yuzhang Xiao Chang was made Guangzhou inspector.',
  ],
  s0294: [
    'In winter, the tenth month, on day renyin, Director of the Five Weapons Xu Mian was made Director of the Ministry of Personnel.',
    'In winter, tenth month, day renyin, Director of the Five Weapons Xu Mian was appointed Director of the Ministry of Personnel.',
  ],
  s0295: [
    'In the intercalary month, on day yichou, Rapid Cavalry General with open office equal-to-three-division protocol Prince of Linchuan Hong was made Chancellor of State and Acting Grand Tutor of the Crown Prince; Left Vice Director Shen Yue was made Director of the Masters of Writing and Acting Junior Tutor of the Crown Prince; Director of the Ministry of Personnel Yuan Ang was made Right Vice Director.',
    'In the intercalary month, on day yichou, Rapid Cavalry General with open office equal-to-three-division protocol Prince of Linchuan Hong was made Chancellor of State and Acting Grand Tutor of the Crown Prince; Left Vice Director Shen Yue became Director of the Masters of Writing and Acting Junior Tutor of the Crown Prince; and Director of the Ministry of Personnel Yuan Ang became Right Vice Director.',
  ],
  s0296: [
    'On day wuyin, General Who Quells the West and Jingzhou Inspector Prince of Shixing Dan was promoted to General Who Pacifies the West.',
    'On day wuyin, General Who Quells the West and Jingzhou inspector Prince of Shixing Dan was advanced to General Who Pacifies the West.',
  ],
  s0297: [
    'On day jiashen, Right Grandee for Splendid Merit Xiahou Xiang was made Left Vice Director of the Masters of Writing.',
    'On day jiashen, Right Grandee for Splendid Merit Xiahou Xiang was made Left Vice Director of the Masters of Writing.',
  ],
  s0298: [
    'In the twelfth month, on day bingchen, Left Vice Director Xiahou Xiang died.',
    'In the twelfth month, on day bingchen, Left Vice Director Xiahou Xiang died.',
  ],
  s0299: [
    'On day yichou, Wei Huaiyang Garrison Commander-in-Chief Chang Yinhe surrendered the city to us.',
    'On day yichou, Wei Huaiyang garrison commander Chang Yinhe surrendered the city.',
  ],
  s0300: [
    'Huo province was established by dividing Yuzhou.',
    'Huo province was created from parts of Yuzhou.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_002_b3.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);

if (patched !== Object.keys(T).length) {
  process.exitCode = 1;
}
