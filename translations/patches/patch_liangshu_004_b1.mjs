#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 4, Basic Annals 4',
    'Book of Liang, Volume 4, Annals 4',
  ],
  s0002: [
    'Emperor Jianwen',
    'Emperor Jianwen',
  ],
  s0003: [
    'The Taizong Emperor Jianwen was tabooed Gang, style name Shizuan, childhood name Liutong; he was the third son of the Gaozu and a uterine younger brother of Crown Prince Zhaoming.',
    'Taizong Emperor Jianwen, personal name Gang, courtesy name Shizuan, childhood name Liutong, was Gaozu\'s third son and Zhaoming Crown Prince\'s younger brother by the same mother.',
  ],
  s0004: [
    'In the tenth month, day dingwei, year 2 of Tianjian, he was born in Xianyang Hall.',
    'On dingwei in the tenth month of Tianjian 2 he was born in Xianyang Hall.',
  ],
  s0005: [
    'In year 5 he was enfeoffed as Prince of Jin\'an with a fief of eight thousand households.',
    'In year 5 he was made Prince of Jin\'an with a fief of eight thousand households.',
  ],
  s0006: [
    'In year 8 he was made General of the Cloud Banner, supervising military affairs at the Shitou garrison, with assistant officials appointed as needed.',
    'In year 8 he became General of the Cloud Banner, took charge of Shitou garrison affairs, and had aides appointed as required.',
  ],
  s0007: [
    'In year 9 he was transferred to Bearer of the Staff, Commander over military affairs in the five provinces North and South Yan, Qing, Xu, and Ji, made General Who Proclaims Resolution and South Yanzhou Inspector.',
    'In year 9 he was made Bearer of the Staff and commander of the five Yan, Qing, Xu, and Ji provinces, General Who Proclaims Resolution, and South Yanzhou inspector.',
  ],
  s0008: [
    'In year 12 he entered the capital as General Who Proclaims Grace and Intendant of Danyang.',
    'In year 12 he entered court as General Who Proclaims Grace and intendant of Danyang.',
  ],
  s0009: [
    'In year 13 he went out as Bearer of the Staff, Commander over military affairs in the seven provinces Jing, Yong, Liang, North and South Qin, Yi, and Ning, made Colonel of the Southern Barbarians and Jingzhou Inspector, his generalship unchanged.',
    'In year 13 he went out as Bearer of the Staff, commander of Jing, Yong, Liang, the two Qin, Yi, and Ning, Colonel of the Southern Barbarians, and Jingzhou inspector, retaining his generalship.',
  ],
  s0010: [
    'In year 14 he was reassigned as Commander over military affairs in Jiangzhou, General of the Cloud Banner and Jiangzhou Inspector, Bearer of the Staff unchanged.',
    'In year 14 he was reassigned commander of Jiangzhou, General of the Cloud Banner, and Jiangzhou inspector, still Bearer of the Staff.',
  ],
  s0011: [
    'In year 17 he was summoned as Leader of the Palace Gentlemen of the West, supervising the Shitou garrison; soon restored as General Who Proclaims Grace and Intendant of Danyang, additionally made Palace Attendant.',
    'In year 17 he was recalled as Leader of the Palace Gentlemen of the West with Shitou garrison duties, then again General Who Proclaims Grace and Danyang intendant, with Palace Attendant added.',
  ],
  s0012: [
    'In year 1 of Putong he went out as Bearer of the Staff, Commander over military affairs in the seven provinces Yi, Ning, Yong, Liang, North and South Qin, and Sha, and made Yi Province Inspector;',
    'In Putong 1 he went out as Bearer of the Staff, commander of Yi, Ning, Yong, Liang, the two Qin, and Sha, and Yi province inspector;',
  ],
  s0013: [
    'before assuming the post, he was reassigned as General of the Cloud Banner and South Xuzhou Inspector.',
    'before taking office he was reassigned General of the Cloud Banner and South Xuzhou inspector.',
  ],
  s0014: [
    'In year 4 he was reassigned as Bearer of the Staff, Commander over military affairs in Yong and Liang, North and South Qin, the four provinces, Jingzhou\'s Jingling, and Sizhou\'s Su commandery, made General Who Pacifies the West, Colonel of Pacified Barbarians, and Yongzhou Inspector.',
    'In year 4 he was reassigned Bearer of the Staff, commander of Yong, Liang, the two Qin, and related districts, General Who Pacifies the West, Colonel of Pacified Barbarians, and Yongzhou inspector.',
  ],
  s0015: [
    'In year 5 he was advanced to General Who Pacifies the North.',
    'In year 5 he was promoted to General Who Pacifies the North.',
  ],
  s0016: [
    'In year 7 he was provisionally advanced as Commander over military affairs in Jing, Yi, and South Liang.',
    'In year 7 he was provisionally made commander of Jing, Yi, and South Liang.',
  ],
  s0017: [
    'That year, on mourning for his birth mother Honored Consort Mu, he submitted a memorial requesting release; an edict ordered him to resume his original duties.',
    'That year, when his birth mother Honored Consort Mu died, he asked to resign but was ordered back to his post.',
  ],
  s0018: [
    'In year 1 of Zhongdatong an edict granted him one suite of drums and pipes as before.',
    'In Zhongdatong 1 an edict granted him the usual suite of drums and pipes.',
  ],
  s0019: [
    'In year 2 he was summoned as Commander over military affairs in South Yang and Xu, made General of Agile Cavalry and Yangzhou Inspector.',
    'In year 2 he was recalled as commander of South Yang and Xu, General of Agile Cavalry, and Yangzhou inspector.',
  ],
  s0020: [
    'In the fourth month, day yisi, year 3, Crown Prince Zhaoming died.',
    'On yisi in the fourth month of year 3 Crown Prince Zhaoming died.',
  ],
  s0021: [
    'In the fifth month, day bingshen, an edict said: "Without utmost fairness one cannot rule all under Heaven; without universal love one cannot oversee the four seas.',
    'On bingshen in the fifth month an edict said, "Without utmost fairness one cannot hold the realm; without universal love one cannot govern the four seas.',
  ],
  s0022: [
    'Therefore Yao and Shun could yield, bestowing office only on virtue;',
    'Therefore Yao and Shun yielded the throne, giving it only to the virtuous;',
  ],
  s0023: [
    'King Wen set aside Bo Yi Kao and established King Wu, reaching above and below, shining to the four quarters.',
    'King Wen passed over Bo Yi Kao and installed King Wu, harmonizing above and below and shining across the four quarters.',
  ],
  s0024: [
    'Now Mount Tai stands desolate and the heavenly course is hard; pure custom still is troubled and the people are not settled—unless one is bright and wise, truly martial and cultured, how could one bear the weight of the sacred vessel and inherit the dragon throne?',
    'Now the sacred mountain is empty and the heavenly steps are hard; pure custom is still troubled and the people unrested—without brightness, wisdom, martial merit, and culture, who could bear the sacred regalia and succeed to the dragon throne?',
  ],
  s0025: [
    'Prince of Jin\'an Gang, gifted in letters and right by nature, filial and respectful by instinct, his authority and kindness proclaimed abroad and virtue and conduct keen within, the feudal lords admired him and all the land took him to heart.',
    'Prince Gang of Jin\'an was gifted in letters and principles, naturally filial and respectful, his authority and kindness known abroad and his virtue keen within; the lords praised him and the realm took him to heart.',
  ],
  s0026: [
    'He may be established as crown prince.',
    'He is to be established as crown prince.',
  ],
  s0027: [
    'On yihai in the seventh month, the enthronement ceremony was held at the imperial hall; because the Eastern Palace was under repair, he temporarily resided at the Eastern Mansion.',
    'On yihai in the seventh month he was invested at the throne hall; while the Eastern Palace was repaired he lodged temporarily at the Eastern Mansion.',
  ],
  s0028: [
    'In the ninth month of year 4 he moved back to the Eastern Palace.',
    'In the ninth month of year 4 he returned to the Eastern Palace.',
  ],
  s0029: [
    'In the fifth month, day bingchen, year 3 of Taiqing, the Gaozu died.',
    'On bingchen in the fifth month of Taiqing 3 Gaozu died.',
  ],
  s0030: [
    'On xinsi he ascended the imperial throne.',
    'On xinsi he took the throne.',
  ],
  s0031: [
    'An edict said: "Our lack of fortune afflicts us; from early we suffered this calamity.',
    'An edict said, "Ill-fated as I am, I have long borne this grief.',
  ],
  s0032: [
    'The late emperor suddenly abandoned the myriad realms; we cling and wail and have nowhere to place ourselves.',
    'The late emperor has suddenly left the myriad realms; in longing and wailing I have nowhere to set myself.',
  ],
  s0033: [
    'Unworthily with slight virtue we have crossed above the people; alone in anguish we know not where to lean, yet rely on the feudal helpers that the altars may be secure.',
    'With slight virtue I have undeservedly risen above the people; alone in grief I know not whom to trust, and must rely on the feudatories to keep the altars secure.',
  ],
  s0034: [
    'Respectfully following the prior will and the bequeathed grace of the final charge, benefit should be added for the hundred millions.',
    'Respectfully following the prior command and the grace of the deathbed charge, the hundred millions should receive added benefit.',
  ],
  s0035: [
    'A general amnesty may be proclaimed for the empire.',
    'A general amnesty is proclaimed for the empire.',
  ],
  s0036: [
    'On renwu an edict said: "In nourishing creatures be only broad; in governing the people be only kind—the Way that marks a founding king was never bondage in origin.',
    'On renwu an edict said, "In nurturing things be broad; in governing the people be kind—the Way of founding kings was never meant for servitude.',
  ],
  s0037: [
    'Some opened their gates to serve the state and at once were taken captive; some on the frontiers were wantonly plundered in raids.',
    'Some who opened their gates in loyalty were seized at once; some on the borders were wantonly raided.',
  ],
  s0038: [
    'Two realms contend—what crime have the common people!',
    'Two states contend—what crime have the common people!',
  ],
  s0039: [
    'We, slight and dull, newly inherit the great enterprise; having come to rule all within the four seas and spread transformation through the cosmos, how could we wish them alone to be outlaws?',
    'I, slight and dull, have newly received the great enterprise; now that I rule all within the seas and my transforming influence fills the cosmos, how could I wish them alone to be outcasts?',
  ],
  s0040: [
    'Northerners now held as slaves and maidservants in the various provinces, together with wives and children, may all be released and forgiven.',
    'Northerners now held as slaves and maidservants in the provinces, with wives and children, may all be released.',
  ],
  s0041: [
    'On guiwei posthumous title was given to Consort Wang as Empress Jian.',
    'On guiwei Consort Wang was posthumously titled Empress Jian.',
  ],
  s0042: [
    'In the sixth month, day bingxu, the Heir of Nankang Prince Huili was made Minister of Works.',
    'On bingxu in the sixth month the heir of Nankang Prince Huili was made Minister of Works.',
  ],
  s0043: [
    'On dinghai Prince of Xuancheng Daqi was established as crown prince.',
    'On dinghai Prince Daqi of Xuancheng was established as crown prince.',
  ],
  s0044: [
    'On renchen Duke of Dangyang Daxin was enfeoffed as Prince of Xunyang commandery, Duke of Shicheng Dakuan as Prince of Jiangxia, Duke of Ningguo Dalin as Prince of Nanhai, Duke of Lincheng Dalian as Prince of Nan commandery, Duke of Xifeng Dachun as Prince of Anlu, Duke of Xintu Dacheng as Prince of Shanyang, Duke of Linxiang Dafeng as Prince of Yidu.',
    'On renchen Duke Daxin of Dangyang became Prince of Xunyang, Duke Dakuan of Shicheng Prince of Jiangxia, Duke Dalin of Ningguo Prince of Nanhai, Duke Dalian of Lincheng Prince of Nan commandery, Duke Dachun of Xifeng Prince of Anlu, Duke Dacheng of Xintu Prince of Shanyang, and Duke Dafeng of Linxiang Prince of Yidu.',
  ],
  s0045: [
    'In autumn, the seventh month, day jiayin, Guangzhou Inspector Yuan Jingzhong plotted to join Hou Jing; West River Protector Chen Baxian raised troops and attacked him; Jingzhong killed himself and Baxian welcomed Dingzhou Inspector Xiao Bo as inspector.',
    'On jiayin in the seventh month of autumn Guangzhou inspector Yuan Jingzhong plotted to join Hou Jing; West River Protector Chen Baxian rose against him; Jingzhong killed himself and Baxian installed Dingzhou inspector Xiao Bo as inspector.',
  ],
  s0046: [
    'On wuchen Wu commandery was made into Wu province, with Prince of Anlu Dachun as inspector.',
    'On wuchen Wu commandery was made Wu province, with Prince Dachun of Anlu as inspector.',
  ],
  s0047: [
    'On gengwu the Heir of Nankang Prince Huili, Minister of Works, additionally became Director of the Masters of Writing; Prince of Nanhai Dalin was made Yangzhou Inspector; Prince of Xinxing Dazhuang was made South Xuzhou Inspector.',
    'On gengwu the heir of Nankang Prince Huili, Minister of Works, also became Director of the Masters of Writing; Prince Dalin of Nanhai became Yangzhou inspector; Prince Dazhuang of Xinxing became South Xuzhou inspector.',
  ],
  s0048: [
    'That month in Jiujiang there was great famine; one person in fourteen or fifteen ate another.',
    'That month Jiujiang suffered great famine; one in fourteen or fifteen people ate human flesh.',
  ],
  s0049: [
    'In the eighth month, day guimao, Grand General Who Conquers the East, Bearer of the Full Staff with honors equal to the Three Lords, and South Xuzhou Inspector Xiao Yuanzao died.',
    'On guimao in the eighth month Grand General Who Conquers the East Xiao Yuanzao, Bearer of the Full Staff, and South Xuzhou inspector, died.',
  ],
  s0050: [
    'In winter, the tenth month, day dingwei, there was an earthquake.',
    'On dingwei in the tenth month of winter there was an earthquake.',
  ],
  s0051: [
    'In the twelfth month, Baekje sent envoys presenting tribute goods.',
    'In the twelfth month Baekje sent envoys with tribute.',
  ],
  s0052: [
    'On xinhai, the first day of the first month of spring in year 1 of Dabao, because of national mourning there was no court assembly.',
    'On xinhai, the new-year\'s day of Dabao 1, national mourning prevented the court assembly.',
  ],
  s0053: [
    'An edict said: "All under Heaven is the sacred vessel of utmost fairness; in ages past the Three Sovereigns and Five Emperors took the throne only because they had no choice.',
    'An edict said, "All under Heaven is the sacred vessel of utmost fairness; in antiquity the Three Sovereigns and Five Emperors took the throne only when they could not refuse.',
  ],
  s0054: [
    'Thus the achievement of emperors and kings is what sages leave over.',
    'Thus the work of emperors and kings is what sages leave as surplus.',
  ],
  s0055: [
    'The glory of chariot and cap is something that came by chance.',
    'Chariot and cap are adornments that come by chance alone.',
  ],
  s0056: [
    'Grand Ancestor the Literary Emperor embraced a great measure of hidden light and opened the foundation of the Western Earl.',
    'Grand Ancestor the Literary Emperor held vast hidden brilliance and laid the foundation of the Western Earl.',
  ],
  s0057: [
    'The Martial Emperor, the Gaozu, made the Way pervade the two principles and wisdom compass the myriad things.',
    'Gaozu the Martial Emperor made the Way fill the two principles and his wisdom encompass the myriad things.',
  ],
  s0058: [
    'When the late Qi era brought repeated pestilence and constant norms were stripped away, flesh-and-blood kin suffered the calamity of entering the park, and the ruler harbored insatiable desire—then we met the fortune of the people\'s willing elevation, drew on the hearts of the hundred millions, received their allied support, and avenged this shame.',
    'When Qi neared its end pestilence returned and moral order collapsed, kin suffered the calamity of the park, and the ruler nursed insatiable desires—then came the fortune of willing elevation, the hearts of the hundred millions were followed, their allied strength was taken up, and this shame was avenged.',
  ],
  s0059: [
    'The affair was not for oneself; in righteousness one truly followed the people.',
    'The deed was not for oneself; in righteousness one truly followed the people.',
  ],
  s0060: [
    'Therefore when achievement was done he did not dwell on it, lived in low halls and plain food, the great compassionate enterprise broadly perfumed, and edicts like those of Fenyang were repeatedly issued.',
    'Therefore when the work was done he did not keep it, dwelt in low halls and ate plain food, great compassion spread widely, and edicts like those of Fenyang were issued again and again.',
  ],
  s0061: [
    'For four reign cycles now, none can fully praise it.',
    'For four reign cycles there has been no fully fitting praise.',
  ],
  s0062: [
    'We, slight and dull, in deepest grief and distress—the living souls are spent and our will does not plan for wholeness; we bend low and look to shade, hoping to inherit the great thread.',
    'I, slight and dull, am in deepest grief and distress; the living are exhausted and my will does not aim at wholeness; bowing low I await shade and hope to inherit the great succession.',
  ],
  s0063: [
    'Suspended banners over thin ice—words barely suffice.',
    'Banners hang over thin ice—words can scarcely tell it.',
  ],
  s0064: [
    'Pain grows deeper as healing delays; the period of hidden mourning is all the keener.',
    'Pain deepens as recovery is slow; mourning seclusion grows keener still.',
  ],
  s0065: [
    'We should keep dark silence within and lodge the mind in matters beyond.',
    'I should keep dark silence within and lodge my mind outside affairs.',
  ],
  s0066: [
    'Yet the kingly Way is not yet straight and the heavenly course still hard—we must rely on chief ministers to expand the myriad administrations.',
    'Yet the kingly Way is not yet straight and the heavenly steps still hard; I must rely on chief ministers to broaden the myriad affairs of state.',
  ],
  s0067: [
    'Observing the year\'s beginning, we establish the era name, looking up to the old statutes.',
    'At the year\'s beginning I establish the era name, looking up to the old statutes.',
  ],
  s0068: [
    'A general amnesty may be proclaimed; Taiqing year 4 is changed to Dabao year 1.',
    'A general amnesty is proclaimed and Taiqing 4 is changed to Dabao 1.',
  ],
  s0069: [
    'On dingsi yellow sand rained from the sky.',
    'On dingsi yellow sand fell from the sky.',
  ],
  s0070: [
    'On jiwei Venus crossed the sky; on xinyou it ceased.',
    'On jiwei Venus crossed the heavens; on xinyou it stopped.',
  ],
  s0071: [
    'Western Wei raided Anlu, seized Sizhou Inspector Liu Zhongli, and wholly lost the lands east of the Han.',
    'Western Wei raided Anlu, seized Sizhou inspector Liu Zhongli, and took all the lands east of the Han.',
  ],
  s0072: [
    'On bingyin the moon was seen in daytime.',
    'On bingyin the moon was visible by day.',
  ],
  s0073: [
    'On guiyou former Jiangdu magistrate Zu Hao rose in revolt, struck Guangling, and beheaded the rebel South Yanzhou Inspector Dong Shaoxian.',
    'On guiyou former Jiangdu magistrate Zu Hao rose, attacked Guangling, and beheaded the rebel South Yanzhou inspector Dong Shaoxian.',
  ],
  s0074: [
    'Hou Jing personally led infantry and naval forces to attack Hao.',
    'Hou Jing personally led land and river forces against Hao.',
  ],
  s0075: [
    'In the second month, day guiwei, Jing captured Guangling; Hao and others were all killed.',
    'On guiwei in the second month Hou Jing took Guangling; Hao and the others were all killed.',
  ],
  s0076: [
    'On bingxu Prince of Anlu Dachun was made East Yangzhou Inspector.',
    'On bingxu Prince Dachun of Anlu was made East Yangzhou inspector.',
  ],
  s0077: [
    'Wu province was abolished and restored as a commandery as before.',
    'Wu province was abolished and Wu was again a commandery as before.',
  ],
  s0078: [
    'An edict said: "Recently the eastern marches were disturbed and Jiangyang ran loose.',
    'An edict said, "Recently the eastern marches were disturbed and Jiangyang ran wild.',
  ],
  s0079: [
    'Chief ministers deployed strategy, bold warriors fought fiercely; Wu and Kuaiji were cleared, Ji and Yan were calm, and within the capital region there was no need for martial dress.',
    'Chief ministers deployed strategy and bold warriors fought fiercely; Wu and Kuaiji were cleared, Ji and Yan were calm, and within the capital precincts there was no need for armor.',
  ],
  s0080: [
    'Court palaces of rank and those left and right within the fasting quarters may all stand down from alert.',
    'Court palaces of rank and the attendants left and right within the fasting quarters may all stand down from alert.',
  ],
  s0081: [
    'On yisi Vice Director of the Masters of Writing Wang Ke was made Left Vice Director.',
    'On yisi Wang Ke, Vice Director of the Masters of Writing, became Left Vice Director.',
  ],
  s0082: [
    'That month Prince of Shaoling Lun came from Xunyang to Xiakou; Jingzhou Inspector Prince of Nanping Ke yielded the province to Lun.',
    'That month Prince Lun of Shaoling came from Xunyang to Xiakou; Jingzhou inspector Prince Ke of Nanping yielded the province to him.',
  ],
  s0083: [
    'On bingwu Hou Jing compelled the Taizong to visit Xizhou.',
    'On bingwu Hou Jing forced Taizong to go to Xizhou.',
  ],
  s0084: [
    'In summer, the fifth month, day gengwu, General Who Conquers the North, Bearer of the Full Staff, and Heir of Poyang Prince Fan died.',
    'On gengwu in the fifth month of summer General Who Conquers the North and heir of Poyang Prince Fan, Bearer of the Full Staff, died.',
  ],
  s0085: [
    'From spring through summer there was great famine; people ate one another, especially in the capital.',
    'From spring through summer famine was severe; people ate one another, especially in the capital.',
  ],
  s0086: [
    'In the sixth month, day xinsi, Prince of Nan commandery Dalian was assigned to handle Yangzhou affairs.',
    'On xinsi in the sixth month Prince Dalian of Nan commandery was put in charge of Yangzhou affairs.',
  ],
  s0087: [
    'On gengzi former Sizhou Inspector Yang Yaren fled from the Masters of Writing office to Xizhou.',
    'On gengzi former Sizhou inspector Yang Yaren fled from the Masters of Writing to Xizhou.',
  ],
  s0088: [
    'In autumn, the seventh month, day wuchen, the rebel Mobile Headquarters Ren Yue raided Jiangzhou; Inspector Prince of Xunyang Daxin surrendered the province to Yue.',
    'On wuchen in the seventh month of autumn the rebel Mobile Headquarters Ren Yue raided Jiangzhou; inspector Prince Daxin of Xunyang surrendered the province to him.',
  ],
  s0089: [
    'That month Prince of Nan commandery Dalian was made Jiangzhou Inspector.',
    'That month Prince Dalian of Nan commandery was made Jiangzhou inspector.',
  ],
  s0090: [
    'In the eighth month, day jiawu, Prince of Xiangdong Yi sent Army Inspector General Wang Sengbian leading the host to press Yingzhou.',
    'On jiawu in the eighth month Prince Yi of Xiangdong sent Army Inspector General Wang Senbian with troops to press Yingzhou.',
  ],
  s0091: [
    'On yihai Hou Jing advanced himself to Chancellor of State and enfeoffed over twenty commanderies as King of Han.',
    'On yihai Hou Jing made himself Chancellor of State and enfeoffed twenty commanderies as King of Han.',
  ],
  s0092: [
    'Prince of Shaoling Lun abandoned Yingzhou and fled.',
    'Prince Lun of Shaoling abandoned Yingzhou and fled.',
  ],
  s0093: [
    'In winter, the tenth month, day yiwei, Hou Jing again compelled the Taizong to attend a banquet at Xizhou, and himself added Grand General of the Cosmos and Commander over military affairs in the Six Harmonized Directions.',
    'On yiwei in the tenth month of winter Hou Jing again forced Taizong to a banquet at Xizhou and made himself Grand General of the Cosmos and commander of the Six Harmonized Directions.',
  ],
  s0094: [
    'Imperial sons Dagun, Dawei, Daqiu, Daxin, Dazhi, and Dayuan were enfeoffed as princes of Xiyang, Wuning, Jian\'an, Yi\'an, Suijian, and Yuele commanderies.',
    'The princes Dagun, Dawei, Daqiu, Daxin, Dazhi, and Dayuan were enfeoffed as princes of Xiyang, Wuning, Jian\'an, Yi\'an, Suijian, and Yuele commanderies.',
  ],
  s0095: [
    'On renyin Jing killed the Heir of Nankang Prince Huili.',
    'On renyin Hou Jing killed the heir of Nankang Prince Huili.',
  ],
  s0096: [
    'In the eleventh month Ren Yue advanced and held Xiyang, sent detached troops to raid Qichang, seized Prince of Hengyang Xian and sent him to the capital, then killed him.',
    'In the eleventh month Ren Yue advanced and held Xiyang, detached troops to raid Qichang, seized Prince Xian of Hengyang and sent him to the capital, then killed him.',
  ],
  s0097: [
    'Prince of Xiangdong Yi sent former Ningzhou Inspector Xu Wensheng to command the armies against Yue.',
    'Prince Yi of Xiangdong sent former Ningzhou inspector Xu Wensheng to command the armies against Yue.',
  ],
  s0098: [
    'Former Central Army officer of the Prince of Nan commandery Zhang Biao rose at Ruoye Mountain in Kuaiji and broke through the counties of eastern Zhejiang.',
    'Zhang Biao, former central army officer of the Prince of Nan commandery, rose on Ruoye Mountain in Kuaiji and overran the counties of eastern Zhejiang.',
  ],
  s0099: [
    'In the second month of spring, year 2, Prince of Shaoling Lun fled to Dongcheng in Anlu, was attacked by Western Wei, his army was defeated, and he died.',
    'In the second month of spring, year 2, Prince Lun of Shaoling fled to Dongcheng in Anlu, was attacked by Western Wei, was defeated, and died.',
  ],
  s0100: [
    'In the third month Hou Jing personally led his host westward on campaign.',
    'In the third month Hou Jing personally led his army west on campaign.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_004_b1.mjs <translation.json>'
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
