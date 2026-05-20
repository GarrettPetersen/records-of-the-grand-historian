#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.010, Suzong — Hebei campaign, Xiangzhou defeat, Shi Siming's resurgence, Qianyuan 2–3) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0301: {
    literal: 'On jiachen, the Retired Emperor\'s birthday, the Retired Emperor feasted the hundred officials at the Jinming Gate tower.',
    idiomatic: 'On jiachen, the Retired Emperor\'s birthday, he feasted the hundred officials atop the Jinming Gate tower.',
  },
  s0302: {
    literal: 'Shuofang military commissioner Guo Ziyi, Hedong military commissioner Li Guangbi, and Guannei military commissioner Wang Sili came to court; Guo Ziyi was made director of the Secretariat, Li Guangbi chief minister, Wang Sili minister of war—the rest unchanged.',
    idiomatic: 'Guo Ziyi of Shuofang, Li Guangbi of Hedong, and Wang Sili of Guannei came to court; Ziyi became director of the Secretariat, Guangbi chief minister, Sili minister of war—other posts unchanged.',
  },
  s0303: {
    literal: 'On the gengwu new moon of the ninth month Right Feathered Forest Grand General Zhao Kui was made prefect of Pu and military commissioner of Pu, Tong, and Guo; Bei prefect Neng Yuanhao was made prefect of Qi and defender of Qi, Yan, and Yun.',
    idiomatic: 'On the gengwu new moon Zhao Kui, right feathered forest grand general, took Pu and command of Pu, Tong, and Guo; Neng Yuanhao, prefect of Bei, took Qi and defense of Qi, Yan, and Yun.',
  },
  s0304: {
    literal: 'On gengyin a great campaign was launched against An Qingxu at Xiangzhou.',
    idiomatic: 'On gengyin the court opened a major campaign against An Qingxu at Xiangzhou.',
  },
  s0305: {
    literal: 'Nine military commissioners were ordered—Guo Ziyi of Shuofang, Li Guangbi of Hedong, Wang Sili of Guannei and Luzhou, Lu Qiong of Huaixi and Xiangyang, Li Huan of Xingping, Xu Shuji of Hua and Pu, Dong Qin of Pinglu, Li Siye of the Northern Court field headquarters, and Ji Guangchen of Zheng and Cai—with two hundred thousand foot and horse, and Kai fu Yu Chao\'en as army-inspecting commissioner.',
    idiomatic: 'Nine commissioners—Guo Ziyi, Li Guangbi, Wang Sili, Lu Qiong, Li Huan, Xu Shuji, Dong Qin, Li Siye, and Ji Guangchen—led two hundred thousand men, with Yu Chao\'en as army-inspecting commissioner.',
  },
  s0306: {
    literal: 'On guisi Guangzhou reported that the armies of the Arabs and Persia were besieging the city; prefect Wei Lijian abandoned the city and fled.',
    idiomatic: 'On guisi Guangzhou reported Arab and Persian forces besieging the city; Prefect Wei Lijian fled.',
  },
  s0307: {
    literal: 'On yiwei of the tenth month Fengxiang intendant Li Qiwu was made minister of justice; Pu prefect Zhang Fangxu was made grand protector of Guangzhou and commissioner of the five protectorates.',
    idiomatic: 'On yiwei Li Qiwu, Fengxiang intendant, became minister of justice; Zhang Fangxu, Pu prefect, grand protector of Guangzhou and commissioner of the five protectorates.',
  },
  s0308: {
    literal: 'Guo Ziyi memorialized that one hundred thousand rebels had been broken at Weizhou; An Qingxu\'s brother Qinghe was captured, and Weizhou was taken.',
    idiomatic: 'Guo Ziyi reported crushing one hundred thousand rebels at Weizhou, capturing Qingxu\'s brother Qinghe and recovering the city.',
  },
  s0309: {
    literal: 'On jiayin the Retired Emperor visited Huaqing Palace; the emperor escorted him to Ba River.',
    idiomatic: 'On jiayin the Retired Emperor went to Huaqing Palace; the emperor saw him off at Ba River.',
  },
  s0310: {
    literal: 'Xu Shuji memorialized: "The women Hou Siniang of Weizhou, Tang Siniang of Huazhou, and Wang Erniang of a certain prefecture together swore blood-oath and asked to join the field headquarters to attack the rebels."',
    idiomatic: 'Xu Shuji reported: "Hou Siniang of Weizhou, Tang Siniang of Huazhou, and Wang Erniang of another prefecture swore a blood oath and begged to join the campaign against the rebels."',
  },
  s0311: {
    literal: '」All were appointed as guoyi officers.',
    idiomatic: '[Close of memorial.] All three were commissioned as guoyi officers.',
  },
  s0312: {
    literal: 'On renshen Wang Sili broke twenty thousand rebels at Xiangzhou.',
    idiomatic: 'On renshen Wang Sili routed twenty thousand rebels at Xiangzhou.',
  },
  s0313: {
    literal: 'On dingchou of the eleventh month Guo Ziyi recovered Weizhou and found the false-appointed prefect Xiao Hua in the prison; an edict restored Hua as prefect.',
    idiomatic: 'On dingchou Guo Ziyi retook Weizhou and found Xiao Hua, the rebel-appointed prefect, in the jail; the court reappointed him.',
  },
  s0314: {
    literal: 'That day the Retired Emperor returned from Huaqing Palace; the emperor welcomed him at Ba River.',
    idiomatic: 'That day the Retired Emperor returned from Huaqing Palace; the emperor met him at Ba River.',
  },
  s0315: {
    literal: 'The emperor himself held the Retired Emperor\'s reins for more than a hundred paces; only after repeated admonition did he stop.',
    idiomatic: 'The emperor walked his father\'s horse by the reins for more than a hundred paces before repeated pleas made him stop.',
  },
  s0316: {
    literal: 'On guimao of the twelfth month Cui Guangyuan, Henan military commissioner, was made prefect of Wei; Xiao Hua was sent to the Xiangzhou field headquarters.',
    idiomatic: 'On guimao Cui Guangyuan, Henan commissioner, became prefect of Wei; Xiao Hua was sent to the Xiangzhou headquarters.',
  },
  s0317: {
    literal: 'On jiachen Sheng prefect Wei Huangshang was made prefect of Su and military commissioner of western Zhejiang.',
    idiomatic: 'On jiachen Wei Huangshang, Sheng prefect, became Su prefect and western Zhejiang commissioner.',
  },
  s0318: {
    literal: 'On gengxu Minister of Revenue Li Kun was made Huainan and western Zhejiang surveillance commissioner and disposition commissioner.',
    idiomatic: 'On gengxu Li Kun, minister of revenue, was made surveillance and disposition commissioner for Huainan and western Zhejiang.',
  },
  s0319: {
    literal: 'On bingyin, at the Beginning of Spring, the emperor took Xuanzheng Hall, read the season\'s ordinances, and regular officials of fifth rank and above ascended the hall in order and listened.',
    idiomatic: 'On bingyin, Beginning of Spring, the emperor read the seasonal ordinances at Xuanzheng Hall while officials of fifth rank and above took their seats to listen.',
  },
  s0320: {
    literal: 'At that time the imperial army besieged Xiangzhou; Qingxu\'s provisions were exhausted and he begged Shi Siming, who led his host to the rescue.',
    idiomatic: 'While the imperial army besieged Xiangzhou, Qingxu\'s stores ran out; he called on Shi Siming, who marched to relieve him.',
  },
  s0321: {
    literal: 'On dingmao Siming again took Weizhou; prefect Cui Guangyuan fled.',
    idiomatic: 'On dingmao Siming retook Weizhou and Prefect Cui Guangyuan fled.',
  },
  s0322: {
    literal: 'In the second year of Qianyuan, spring, first month, on the jisi new moon the emperor took Hanyuan Hall and received the honorific Qianyuan Great Sage, Luminous Heaven, Cultured in War, Filially Attentive Emperor.',
    idiomatic: 'On the jisi new moon of spring in Qianyuan 2 the emperor took Hanyuan Hall and received the honorific Qianyuan Great Sage, Luminous Heaven, Cultured in War, Filially Attentive Emperor.',
  },
  s0323: {
    literal: 'That day Shi Siming declared himself King of Yan at Weizhou and presumptuously established an era name.',
    idiomatic: 'That day Shi Siming proclaimed himself King of Yan at Weizhou and usurped an era name.',
  },
  s0324: {
    literal: 'On dingchou the emperor personally sacrificed to the Nine Palaces Noble Spirits and fasted at the altar site.',
    idiomatic: 'On dingchou the emperor sacrificed in person to the Nine Palaces spirits and kept vigil at the altar.',
  },
  s0325: {
    literal: 'On wuyin he performed the plowing rites at the sacred field; the emperor performed nine furrows; the ritual officials reported it excessive, and the emperor said: "I lead the realm in urging agriculture—my only regret is that I did not finish a thousand mu."',
    idiomatic: 'On wuyin he plowed the sacred field, opening nine furrows; ritual officers said it was too much, but the emperor replied, "I urge the farmers on—my only regret is not finishing a thousand mu."',
  },
  s0326: {
    literal: 'On the night of guiwei the moon occulted the Year Star.',
    idiomatic: 'On the night of guiwei the moon passed before the Year Star.',
  },
  s0327: {
    literal: 'On yichou Vice Censor-in-Chief Cui Yu was made overall commander of Zhejiang and Huainan military disposition.',
    idiomatic: 'On yichou Cui Yu, vice censor-in-chief, was made overall commander for Zhejiang and Huainan disposition.',
  },
  s0328: {
    literal: 'On bingshen Kai fu, Minister of the Court of the Imperial Stud, and Northern Court field headquarters commissioner Li Siye, Duke of Guo, died at the Xiangzhou field headquarters.',
    idiomatic: 'On bingshen Li Siye, kai fu, minister of the imperial stud, Northern Court commissioner, and Duke of Guo, died at the Xiangzhou headquarters.',
  },
  s0329: {
    literal: 'On gengzi junior preceptor of the heir apparent Cui Yuan was made Eastern Capital regent and acting director of the Department of State Affairs.',
    idiomatic: 'On gengzi Cui Yuan, junior preceptor of the heir apparent, became Eastern Capital regent and acting head of the Department of State Affairs.',
  },
  s0330: {
    literal: 'On the full moon of the second month, renzi, there was a total lunar eclipse.',
    idiomatic: 'On the renzi full moon of the second month the moon was totally eclipsed.',
  },
  s0331: {
    literal: 'The hundred officials asked to add to Empress Zhang the honorific "Assisting Sage"; because of the lunar eclipse the emperor stopped it, saying yin virtue was not cultivated.',
    idiomatic: 'Officials petitioned to add Assisting Sage to Empress Zhang\'s title; the emperor refused, citing the eclipse as a sign that yin virtue had not been perfected.',
  },
  s0332: {
    literal: 'Eastern Capital regent and heir to Prince of Guo Li Ju was demoted to prefect of Suizhou for harsh government.',
    idiomatic: 'Li Ju, Eastern Capital regent and heir to Prince of Guo, was demoted to Suizhou prefect for harsh rule.',
  },
  s0333: {
    literal: 'On bingchen the moon violated the great star of the Heart.',
    idiomatic: 'On bingchen the moon transgressed the Heart\'s great star.',
  },
  s0334: {
    literal: 'On renxu Chief Minister Miao Jinqing and Wang Yu were sent separately to record prisoners.',
    idiomatic: 'On renxu Miao Jinqing and Wang Yu were dispatched separately to review prisoners.',
  },
  s0335: {
    literal: 'Third month, dingmao new moon.',
    idiomatic: 'On the dingmao new moon of the third month.',
  },
  s0336: {
    literal: 'On jisi the empress sacrificed to the Silkworm Ancestor in the park.',
    idiomatic: 'On jisi the empress offered to the Silkworm Ancestor in the imperial park.',
  },
  s0337: {
    literal: 'On renshen at the Xiangzhou field headquarters Guo Ziyi and others fought the rebel Shi Siming; the imperial army was unfavorable, the nine commissioners\' troops routed; Ziyi cut the Heyang Bridge and with the remnant guarded the Eastern Capital.',
    idiomatic: 'On renshen at Xiangzhou Guo Ziyi and the nine commissioners met Shi Siming and were defeated; Ziyi burned the Heyang Bridge and withdrew the survivors to guard Luoyang.',
  },
  s0338: {
    literal: 'On xinmao Minister of the Court of the Imperial Stud Li Feiyuanli was made prefect of Huai and acting commissioner of the Western and Northern Court field headquarters;',
    idiomatic: 'On xinmao Li Feiyuanli, minister of the imperial stud, became Huai prefect and acting commissioner of the Western and Northern Court headquarters;',
  },
  s0339: {
    literal: 'Hua prefect Xu Shuji was made military commissioner of Hua, Bian, Cao, and Song;',
    idiomatic: 'Xu Shuji, Hua prefect, took command of Hua, Bian, Cao, and Song;',
  },
  s0340: {
    literal: 'Yan prefect Shang Heng was made prefect of Xu and military commissioner of Bo and Ying.',
    idiomatic: 'Shang Heng, Yan prefect, became Xu prefect and commissioner of Bo and Ying.',
  },
  s0341: {
    literal: 'On jiawu Vice Minister of War Lü Yin was made associate director of the Chancellery; heir-apparent guest Xue Jingxian was made Fengxiang intendant and defender of that prefecture.',
    idiomatic: 'On jiawu Lü Yin, vice minister of war, joined the council; Xue Jingxian, heir-apparent guest, became Fengxiang intendant and defender.',
  },
  s0342: {
    literal: 'On yiwei Chief Minister Miao Jinqing was made grand tutor of the heir apparent; associate director Wang Yu minister of justice—both were removed from active governance.',
    idiomatic: 'On yiwei Miao Jinqing became grand tutor of the heir apparent; Wang Yu, associate director, minister of justice—both left the council.',
  },
  s0343: {
    literal: 'Capital intendant Li Xian was made minister of personnel; Vice Minister of Rites Li Kui vice director of the Secretariat—together with Vice Minister of Revenue Diwu Qi they all became associate directors of the Chancellery.',
    idiomatic: 'Li Xian, capital intendant, became minister of personnel; Li Kui, vice minister of rites, vice director of the Secretariat; Diwu Qi, vice minister of revenue—all joined the council.',
  },
  s0344: {
    literal: 'On bingshen Guo Ziyi was made military commissioner and commander of the armies of the Eastern Capital circuit, Shannan East, Henan, and the rest, with acting Eastern Capital regency and direction of the Department of State Affairs.',
    idiomatic: 'On bingshen Guo Ziyi was made commander of the Eastern Capital, Shannan East, and Henan armies, acting Eastern Capital regent, and head of the Department of State Affairs.',
  },
  s0345: {
    literal: 'Hedong deputy commissioner Lai Tian was made prefect of Shaan and military commissioner of Guo and Hua, with defense and training of Tong Pass.',
    idiomatic: 'Lai Tian, Hedong deputy commissioner, became Shaan prefect, commissioner of Guo and Hua, and defender of Tong Pass.',
  },
  s0346: {
    literal: 'On the dingyou new moon of the fourth month Wang Sili memorialized that at Zhigan Ridge east of Lucheng county he had broken ten thousand rebels.',
    idiomatic: 'On the dingyou new moon Wang Sili reported breaking ten thousand rebels at Zhigan Ridge east of Lucheng.',
  },
  s0347: {
    literal: 'On renyin an edict said that because the rebel scourge was not yet pacified, one must cherish restraint: "From now on, my daily meals and robes and furnishings shall all be reduced; every workshop and manufacturing office is halted."',
    idiomatic: 'On renyin an edict declared that with the rebels still abroad the court must practice restraint: "Henceforth my table and wardrobe shall be cut back, and every imperial workshop shall cease."',
  },
  s0348: {
    literal: '"Recently, because military and state affairs were pressing, oral commands were sometimes issued for disposition.',
    idiomatic: '"Lately military urgency has led to oral commands bypassing regular channels.',
  },
  s0349: {
    literal: 'Henceforth what is not a formal proclamation may not be carried out; inside and outside, every affair returns to its proper office."',
    idiomatic: 'Henceforth nothing but formal edicts may govern; every affair, within and without, belongs to its proper office."',
  },
  s0350: {
    literal: 'The Heroic Martial Army and the Six Armies and their commissioners—because of disputes they have often carried out arrests on their own authority.',
    idiomatic: 'The Heroic Martial Army and the Six Armies have often arrested men on their own authority after quarrels.',
  },
  s0351: {
    literal: 'Henceforth they must go through the censorate; if judgment is unfair, memorialize with the facts."',
    idiomatic: 'Henceforth they must act through the censorate; if punishment seems unjust, report the facts to the throne."',
  },
  s0352: {
    literal: 'Every incumbent civil and military official of fifth rank and above in regular post may each recommend one man of worth, integrity, and forthright remonstrance, who may present himself with a sealed memorial."',
    idiomatic: 'Every regular official of fifth rank and above may recommend one candidate of worth, integrity, and bold counsel, who may submit a sealed memorial in his own name.',
  },
  s0353: {
    literal: 'Officials of the two secretariats shall every ten days submit a sealed memorial.',
    idiomatic: 'Secretariat officials shall submit sealed memorials every ten days.',
  },
  s0354: {
    literal: 'When the Censorate wishes to impeach, it need not submit a preliminary memorial and shall again wear the xie crown."',
    idiomatic: 'When censors impeach, they need not file a preliminary petition and shall again wear the xie crown.',
  },
  s0355: {
    literal: 'The remnant rebels are not yet destroyed and the realm\'s step is still hard—let all embody utmost fairness to bring peace to government.',
    idiomatic: 'The rebels are not yet destroyed and the realm still staggers—let all embrace utmost fairness to heal governance.',
  },
  s0356: {
    literal: 'I rule with open heart and share with the multitude; I desire with the living people to reach the utmost Way.',
    idiomatic: 'I rule with an open heart and share power with all; I desire with the people to reach the utmost Way.',
  },
  s0357: {
    literal: '」Let this be proclaimed inside and outside, that all may know my intent."',
    idiomatic: '[Close of edict.] Let this be proclaimed within and without, that all may know my mind."',
  },
  s0358: {
    literal: 'On jiachen Deng prefect Lu Qiong was made Zheng prefect and military commissioner of Chen, Zheng, Ying, and Bo;',
    idiomatic: 'On jiachen Lu Qiong, Deng prefect, became Zheng prefect and commissioner of Chen, Zheng, Ying, and Bo;',
  },
  s0359: {
    literal: 'Xu prefect Shang Heng was made Qing prefect and military commissioner of Qing, Zi, Mi, Deng, Lai, Yi, and Hai;',
    idiomatic: 'Shang Heng, Xu prefect, became Qing prefect and commissioner of Qing, Zi, Mi, Deng, Lai, Yi, and Hai;',
  },
  s0360: {
    literal: 'Shang prefect and Xingping military commissioner Li Huan was made concurrent military commissioner of Yu, Xu, and Ru.',
    idiomatic: 'Li Huan, Shang prefect and Xingping commissioner, also took Yu, Xu, and Ru.',
  },
  s0361: {
    literal: 'On yisi Diwu Qi resumed his former posts as commissioner of the treasury and tax and corvée bureaus.',
    idiomatic: 'On yisi Diwu Qi resumed charge of the treasury and tax and corvée bureaus.',
  },
  s0362: {
    literal: 'Shi Siming usurped an era title at Weizhou.',
    idiomatic: 'Shi Siming proclaimed a reign title at Weizhou.',
  },
  s0363: {
    literal: 'Ji Guangchen was demoted to prefect of Xuan.',
    idiomatic: 'Ji Guangchen was demoted to Xuan prefect.',
  },
  s0364: {
    literal: 'Cui Guangyuan was made junior grand protector of the heir apparent.',
    idiomatic: 'Cui Guangyuan became junior grand protector of the heir apparent.',
  },
  s0365: {
    literal: 'On guihai, because of long drought, the market was moved and rain was sought by the yu rite.',
    idiomatic: 'On guihai prolonged drought led to moving the market and performing rain prayers.',
  },
  s0366: {
    literal: 'On xinsi Chancellor Li Xian was demoted to prefect of Shu.',
    idiomatic: 'On xinsi Li Xian, chancellor, was demoted to Shu prefect.',
  },
  s0367: {
    literal: 'On dinghai the emperor took Xuanzheng Hall and tested candidates in the four categories of literary classics and statecraft.',
    idiomatic: 'On dinghai the emperor tested candidates in the four literary and statecraft categories at Xuanzheng Hall.',
  },
  s0368: {
    literal: 'Ru prefect Liu Zhan was made Hua prefect; Dong Qin, Pinglu army commissioner knowing military affairs, was made Pu prefect.',
    idiomatic: 'Liu Zhan, Ru prefect, became Hua prefect; Dong Qin, Pinglu army commissioner, Pu prefect.',
  },
  s0369: {
    literal: 'On the yiwei new moon of the sixth month Right Vice Director Pei Mian was made censor-in-chief, Chengdu intendant, and deputy military commissioner of Jiannan with surveillance of that circuit;',
    idiomatic: 'On the yiwei new moon Pei Mian, right vice director, became censor-in-chief, Chengdu intendant, and Jiannan deputy commissioner;',
  },
  s0370: {
    literal: 'Bin prefect Fang Guan was made heir-apparent guest;',
    idiomatic: 'Fang Guan, Bin prefect, became heir-apparent guest;',
  },
  s0371: {
    literal: 'Raozhou prefect Yan Zhenqing was made Sheng prefect and military commissioner of western Zhejiang.',
    idiomatic: 'Yan Zhenqing, Raozhou prefect, became Sheng prefect and western Zhejiang commissioner.',
  },
  s0372: {
    literal: 'On jisi Ming prefect Lü Yanzhi was made Yue prefect and military commissioner of eastern Zhejiang;',
    idiomatic: 'On jisi Lü Yanzhi, Ming prefect, became Yue prefect and eastern Zhejiang commissioner;',
  },
  s0373: {
    literal: 'Right Feathered Forest Grand General Peng Yuanyao was made Zheng prefect and military commissioner of Chen, Zheng, Shen, Guang, and Shou.',
    idiomatic: 'Peng Yuanyao, right feathered forest grand general, became Zheng prefect and commissioner of Chen, Zheng, Shen, Guang, and Shou.',
  },
  s0374: {
    literal: 'On the yichou new moon of the seventh autumn month Minister of Rites Wei Zhi was made Eastern Capital regent.',
    idiomatic: 'On the yichou new moon Wei Zhi, minister of rites, became Eastern Capital regent.',
  },
  s0375: {
    literal: 'Junior grand tutor of the heir apparent and Duke of Yan Li Lin died.',
    idiomatic: 'Li Lin, junior grand tutor of the heir apparent and Duke of Yan, died.',
  },
  s0376: {
    literal: 'On xinsi an edict made Prince of Zhao Li Xi commander-in-chief of the realm\'s armies, with Grand Steward and Chief Minister Li Guangbi as deputy.',
    idiomatic: 'On xinsi Li Xi, Prince of Zhao, was named commander-in-chief of all armies, with Li Guangbi, grand steward and chief minister, as deputy.',
  },
  s0377: {
    literal: 'On dinghai Minister of War, grand protector of Luzhou, Luzhou and Qin military commissioner, and Duke of Huo Wang Sili was made concurrent Taiyuan intendant, Northern Capital regent, and deputy military commissioner of Hedong.',
    idiomatic: 'On dinghai Wang Sili, minister of war, Luzhou grand protector, and Duke of Huo, also became Taiyuan intendant, Northern Capital regent, and Hedong deputy commissioner.',
  },
  s0378: {
    literal: 'Minister of Justice Wang Yu was made prefect of Pu and military commissioner of Pu, Tong, and Jiang.',
    idiomatic: 'Wang Yu, minister of justice, became Pu prefect and commissioner of Pu, Tong, and Jiang.',
  },
  s0379: {
    literal: 'On yihai of the eighth month Xiangzhou deputy general Kang Chuyuan expelled prefect Wang Zheng and held the city in self-defense.',
    idiomatic: 'On yihai Kang Chuyuan, Xiangzhou deputy general, drove out Prefect Wang Zheng and held the city.',
  },
  s0380: {
    literal: 'On bingchen Princess Ningguo returned from the Uyghurs to the palace.',
    idiomatic: 'On bingchen Princess Ningguo returned from the Uyghurs to court.',
  },
  s0381: {
    literal: 'Deputy commander-in-chief Li Guangbi was made concurrent grand protector of Youzhou and military commissioner of Hebei.',
    idiomatic: 'Li Guangbi, deputy commander-in-chief, also became grand protector of Youzhou and Hebei commissioner.',
  },
  s0382: {
    literal: 'On jiawu of the ninth month the Xiangzhou rebel Zhang Jiayan stormed and took Jingzhou; officials of Li, Lang, Fu, E, Xia, and Gui all abandoned their cities and fled.',
    idiomatic: 'On jiawu Zhang Jiayan of Xiangzhou seized Jingzhou; officials across Li, Lang, Fu, E, Xia, and Gui abandoned their posts and fled.',
  },
  s0383: {
    literal: 'On wuchen new heavy coin was cast, bearing the inscription like Qianyuan Heavy Treasure but with a heavier rim, valued at fifty; twenty-two jin made one string.',
    idiomatic: 'On wuchen new heavy coin was cast—like Qianyuan Heavy Treasure but with a thicker rim, fifty to one; twenty-two pounds per string.',
  },
  s0384: {
    literal: 'On dinghai junior grand protector Cui Guangyuan was made pacification commissioner of Jing, Xiang, and other circuits; Right Feathered Forest Grand General Wang Zhongsheng military commissioner of Shen, An, and Mian; Right Feathered Forest General Li Baoyu prefect of Zheng and commissioner of Zheng, Chen, Ying, and Bo.',
    idiomatic: 'On dinghai Cui Guangyuan was made pacification commissioner of Jing and Xiang; Wang Zhongsheng, right feathered forest grand general, commissioner of Shen, An, and Mian; Li Baoyu, right feathered forest general, Zheng prefect and commissioner of Zheng, Chen, Ying, and Bo.',
  },
  s0385: {
    literal: 'On gengyin the rebel barbarian Shi Siming took Luoyang; deputy commander-in-chief Li Guangbi held Heyang; Ru, Zheng, and Hua fell to the rebels.',
    idiomatic: 'On gengyin Shi Siming seized Luoyang; Li Guangbi held Heyang; Ru, Zheng, and Hua fell.',
  },
  s0386: {
    literal: 'On dingyou of the tenth winter month an edict ordered the emperor to campaign in person against Shi Siming; in the end it was not carried out.',
    idiomatic: 'On dingyou an edict announced a personal campaign against Shi Siming; it was never launched.',
  },
  s0387: {
    literal: 'On yisi Li Guangbi memorialized that rebels had been broken below the city walls.',
    idiomatic: 'On yisi Li Guangbi reported breaking rebels beneath the walls.',
  },
  s0388: {
    literal: 'On renxu Chancellor Lü Yin was recalled to service and again associate director.',
    idiomatic: 'On renxu Lü Yin was recalled to the council.',
  },
  s0389: {
    literal: 'On the jiazi new moon of the eleventh month Shang prefect Wei Lun broke Kang Chuyuan; Jing and Xiang were pacified.',
    idiomatic: 'On the jiazi new moon Wei Lun, Shang prefect, defeated Kang Chuyuan and pacified Jing and Xiang.',
  },
  s0390: {
    literal: 'On gengwu Vice Minister of Revenue and associate director Diwu Qi was demoted to chief administrator of Zhong; Censor-in-Chief Helan Jinming demoted to army adjutant of Qin.',
    idiomatic: 'On gengwu Diwu Qi, vice minister of revenue and associate director, was demoted to Zhong chief administrator; Helan Jinming, censor-in-chief, to Qin army adjutant.',
  },
  s0391: {
    literal: 'On the guisi new moon of the twelfth month Shence General Wei Boyu broke rebels at Qiangzi Slope east of Shaan.',
    idiomatic: 'On the guisi new moon Wei Boyu, Shence general, routed rebels at Qiangzi Slope east of Shaan.',
  },
  s0392: {
    literal: 'On jiayin Censor-in-Chief Shi Hong was made prefect of Xiang and military commissioner of Shannan East with surveillance and disposition.',
    idiomatic: 'On jiayin Shi Hong, censor-in-chief, became Xiang prefect and Shannan East commissioner with full surveillance powers.',
  },
  s0393: {
    literal: 'On the guihai new moon of spring in the third year of Shangyuan.',
    idiomatic: 'On the guihai new moon of spring in Shangyuan 1.',
  },
  s0394: {
    literal: 'On xinsi Li Guangbi was advanced to grand marshal and concurrent director of the Secretariat—the rest unchanged.',
    idiomatic: 'On xinsi Li Guangbi was promoted to grand marshal and director of the Secretariat; other posts unchanged.',
  },
  s0395: {
    literal: 'Hangzhou prefect Hou Lingyi was made Sheng prefect and military commissioner of western Zhejiang with command of the Jiangning army.',
    idiomatic: 'Hou Lingyi, Hangzhou prefect, became Sheng prefect, western Zhejiang commissioner, and commander of the Jiangning army.',
  },
  s0396: {
    literal: 'On wuzi Shuofang military commissioner Guo Ziyi was made concurrent military commissioner of Binning and Zhenwu.',
    idiomatic: 'On wuzi Guo Ziyi, Shuofang commissioner, also took Binning and Zhenwu.',
  },
  s0397: {
    literal: 'On the guisi new moon of the second month Right Vice Director Cui Yu was made prefect of Pu and military commissioner of Pu, Tong, Jin, and Jiang.',
    idiomatic: 'On the guisi new moon Cui Yu, right vice director, became Pu prefect and commissioner of Pu, Tong, Jin, and Jiang.',
  },
  s0398: {
    literal: 'On gengxu Diwu Qi was stripped of name and long exiled to Yi.',
    idiomatic: 'On gengxu Diwu Qi was disgraced and exiled to Yi.',
  },
  s0399: {
    literal: 'On guichou junior grand protector Cui Guangyuan was made Fengxiang intendant and Qin-Long military commissioner.',
    idiomatic: 'On guichou Cui Guangyuan, junior grand protector, became Fengxiang intendant and Qin-Long commissioner.',
  },
  s0400: {
    literal: 'On renshen of the third month capital intendant Li Ruoyou was made Chengdu intendant and Jiannan military commissioner.',
    idiomatic: 'On renshen Li Ruoyou, capital intendant, became Chengdu intendant and Jiannan commissioner.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/010.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 400;

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
if (trans.metadata.chapter !== '010') {
  throw new Error(`Expected chapter 010, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);
const hasAll =
  trans.sentences.length >= END - START + 1 &&
  [...expectedIds].every((id) => trans.sentences.some((s) => (s.originalId || s.id) === id));

if (!hasAll) {
  const extracted = extractRange(chapterPath, START, END);
  const map = new Map(trans.sentences.map((s) => [s.originalId || s.id, s]));
  for (const s of extracted) {
    map.set(s.originalId, s);
  }
  trans.sentences = [...map.values()].sort(
    (a, b) => parseInt((a.originalId || a.id).slice(1), 10) - parseInt((b.originalId || b.id).slice(1), 10)
  );
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
console.log('Applied', applied, 'translations (s' + String(START).padStart(4, '0') + '–s' + String(END).padStart(4, '0') + ')');
