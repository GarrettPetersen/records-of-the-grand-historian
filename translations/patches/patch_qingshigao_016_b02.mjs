#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'An imperial rescript stated: capture the Miao chiefs including Xianggu at once.',
    'The court ordered Xianggu and other Miao leaders seized immediately.',
  ],
  s0102: [
    'Intercalary sixth month, day gengzi: Ji Qing memorialized the capture of the Yagao Miao stockade in Xilong prefecture.',
    'On intercalary month 6, gengzi, Ji Qing took the Yagao Miao stockade at Xilong.',
  ],
  s0103: [
    'On day bingwu, Le Bao memorialized the advance capture of Puping, the killing of rebel chiefs in the assault, and the relief of the Nanlong siege.',
    'On bingwu, Le Bao took Puping, killed rebel chiefs, and lifted the Nanlong siege.',
  ],
  s0104: [
    'An edict praised the gentry and people for holding the endangered city and understanding righteousness, and changed Nanlong prefecture to Xingyi prefecture.',
    'The court praised Nanlong\'s defenders and renamed the prefecture Xingyi.',
  ],
  s0105: [
    'Le Bao further reported the relief of the Huangcaoba siege and the opening of the Yunnan-Guizhou routes.',
    'Le Bao also reported Huangcaoba relieved and Yunnan-Guizhou routes open.',
  ],
  s0106: [
    'On day renxu, Grand Council clerks Wu Xiongguang and Dai Quheng were both given third-rank noble titles and, like Vice Minister Fu Sen, were ordered to study and serve under the Grand Council ministers.',
    'On renxu, Wu Xiongguang and Dai Quheng gained third-rank titles and joined Fu Sen studying under the Grand Council.',
  ],
  s0107: [
    'Autumn, seventh month, day jisi: the Yongding River breached.',
    'In month 7, jisi, the Yongding River broke its banks.',
  ],
  s0108: [
    'On day jimao, Kashgar and Yengisar were ordered to store grain against famine.',
    'On jimao, Kashgar and Yengisar were told to stock grain for famine.',
  ],
  s0109: [
    'On day guiwei, Commander Baketanbu died in camp.',
    'On guiwei, Commander Baketanbu died on campaign.',
  ],
  s0110: [
    'On day yiyou, next year\'s quota taxes were remitted for six Sichuan prefectures and counties including Fengjie that transported army grain.',
    'On yiyou, six Sichuan grain-transport counties including Fengjie were forgiven next year\'s taxes.',
  ],
  s0111: [
    'Eighth month, day jiachen: the Yongding River was closed again.',
    'In month 8, jiachen, the Yongding breach was sealed.',
  ],
  s0112: [
    'On day bingchen, Fan Yiheng died; Shen Chu was made Minister of Revenue and Ji Yun Minister of Rites.',
    'On bingchen, Fan Yiheng died; Shen Chu took revenue and Ji Yun took rites.',
  ],
  s0113: [
    'On day jiwei, Grand Secretary Duke of Chengmou Yong Agui died.',
    'On jiwei, Grand Secretary Agui died.',
  ],
  s0114: [
    'On day bingyin, the Emperor escorted the Retired Emperor back to the capital.',
    'On bingyin, the Emperor brought the Retired Emperor back to Beijing.',
  ],
  s0115: [
    'Ninth month, day wuchen: Le Bao memorialized the capture of the Zhong Miao rebel lair and the seizure of rebel chiefs including Wang Nangxian, who were sent to the capital for execution.',
    'In month 9, wuchen, Le Bao took the Zhong Miao lair and sent Wang Nangxian and other chiefs to the capital for execution.',
  ],
  s0116: [
    'Le Bao was enfeoffed as third-rank marquis.',
    'Le Bao was made a third-rank marquis.',
  ],
  s0117: [
    'On day dingchou, the Emperor attended mourning for the late Grand Secretary Agui.',
    'On dingchou, the Emperor mourned the late Grand Secretary Agui.',
  ],
  s0118: [
    'On day jiashen, Su Linga was made Grand Secretary and Li Fenghan Jiangnan-Jiangxi governor-general.',
    'On jiashen, Su Linga joined the Grand Secretariat and Li Fenghan took the two Jiangs.',
  ],
  s0119: [
    'On day gengyin, an edict ordered Yimian, Le Bao, Feng Shen\'en, Jing An, and others to recruit braves separately for enlistment against the rebels.',
    'On gengyin, Yimian, Le Bao, Feng Shen\'en, and Jing An were told to recruit braves against the rebels.',
  ],
  s0120: [
    'On day guisi, an edict stated: "We hear that rebels constantly force common people to join bands and face the imperial army."',
    'On guisi, an edict said rebels forced civilians into bands to fight the army.',
  ],
  s0121: [
    '"When the army reports victory, those called killed rebels are mostly civilians, not real rebels."',
    'Victory reports mostly counted civilians as rebels, not real bandits.',
  ],
  s0122: [
    '"Hence for long there has been no real success."',
    'So the campaign had long made little real progress.',
  ],
  s0123: [
    '"Commanders in the field should devise means to disperse them and not burn jade with common stone."',
    'Field commanders were told to disperse bands and avoid killing innocents with rebels.',
  ],
  s0124: [
    'On day jiawu, because the gentry and people of Enshi and Lichuan in Hubei and Fengjie in Sichuan fought rebels bravely, one more year of taxes was remitted.',
    'On jiawu, Enshi, Lichuan, and Fengjie were forgiven another year of taxes for killing rebels.',
  ],
  s0125: [
    'Winter, tenth month, day wuxu: Mingliang and Delengtai requested widespread repair of civilian forts to weaken the rebels.',
    'In month 10, wuxu, Mingliang and Delengtai asked to build more civilian forts against the rebels.',
  ],
  s0126: [
    'An edict rebuked them as dilatory.',
    'The court rebuked the plan as too slow.',
  ],
  s0127: [
    'On day bingchen, the Jiaotai Hall in the Palace of Heavenly Purity burned.',
    'On bingchen, the Jiaotai Hall in the Palace of Heavenly Purity burned.',
  ],
  s0128: [
    'On day xinyou, Le Bao was ordered to take overall command of Sichuan military affairs.',
    'On xinyou, Le Bao was made overall commander in Sichuan.',
  ],
  s0129: [
    'Eleventh month, new moon on day bingyin: hereditary offices were granted to the fallen scattered-rank minister Fozhu and guard commander A\'ersalang.',
    'At the eleventh-month new moon, Fozhu and A\'ersalang received hereditary offices.',
  ],
  s0130: [
    'Twelfth month, day wushen: Kang Jitian was made Jiangnan Canal governor-general and Sima Tao eastern-route canal governor-general.',
    'In month 12, wushen, Kang Jitian took the Jiangnan canals and Sima Tao the eastern route.',
  ],
  s0131: [
    'Hereditary offices were granted to the fallen commander-in-chief Ming\'antu and vice commanders Zeng Pangui and Yisana.',
    'Ming\'antu, Zeng Pangui, and Yisana received hereditary offices for dying in battle.',
  ],
  s0132: [
    'On day jiazi, the combined autumnal sacrifice was performed at the Imperial Ancestral Temple.',
    'On jiazi, the autumnal temple sacrifice was held.',
  ],
  s0133: [
    'That year disaster taxes were remitted in varying degrees for fifty-seven prefectures and counties in Zhili, Huguang, Shaanxi, Yunnan, Gansu, and other provinces.',
    'That year fifty-seven disaster districts in several provinces received partial tax relief.',
  ],
  s0134: [
    'Korea, Ryukyu, and Siam sent tribute.',
    'Korea, Ryukyu, and Siam paid tribute.',
  ],
  s0135: [
    'Third year, spring, first month, day gengwu: Liang Kentang was made Minister of War and Hu Jitang Zhili governor-general.',
    'In year 3, month 1, gengwu, Liang Kentang took war and Hu Jitang took Zhili.',
  ],
  s0136: [
    'On day jiashen, Le Bao was transferred to be Sichuan governor-general.',
    'On jiashen, Le Bao became Sichuan governor-general.',
  ],
  s0137: [
    'On day yichou, Eledengbao memorialized the capture of rebel chief Tan Jiayao.',
    'On yichou, Eledengbao reported capturing rebel chief Tan Jiayao.',
  ],
  s0138: [
    'The Emperor rebuked his delay and stripped Eledengbao of rank and office.',
    'The Emperor blamed the delay and stripped Eledengbao of rank and office.',
  ],
  s0139: [
    'For lax defense Mingliang and Delengtai were also stripped of rank and office; Shuliang, Mukedeng\'a, and others were dismissed and their property confiscated, all to redeem themselves on campaign.',
    'Mingliang and Delengtai lost rank for lax defense; Shuliang and Mukedeng\'a were dismissed, their property seized, and all sent to redeem themselves in the field.',
  ],
  s0140: [
    'Second month, day dingwei: the Emperor performed the Confucian sacrifice and lectured at the Imperial Academy.',
    'In month 2, dingwei, the Emperor sacrificed at the Confucian temple and lectured at the Academy.',
  ],
  s0141: [
    'E Qitai was made Heilongjiang general and Qinglin Jiangning general.',
    'E Qitai took Heilongjiang and Qinglin took Jiangning.',
  ],
  s0142: [
    'On day xinhai, Ke Fan and W\'ertunaxun were stripped of office for letting Shaanxi Han rebels enter Hubei.',
    'On xinhai, Ke Fan and W\'ertunaxun lost office for letting Shaanxi rebels into Hubei.',
  ],
  s0143: [
    'On day renzi, Wu Shengqin was made Left Censor-in-Chief.',
    'On renzi, Wu Shengqin became left censor-in-chief.',
  ],
  s0144: [
    'On day maomao, Grand Secretariat academician Nayancheng was ordered to study and serve at the Grand Council.',
    'On maomao, Nayancheng was told to study at the Grand Council.',
  ],
  s0145: [
    'Third month, day dingchou: Delengtai memorialized that in pursuit he drove rebel chiefs Qi Wangshi and Yao Zhifu over a cliff to their deaths.',
    'In month 3, dingchou, Delengtai reported Qi Wangshi and Yao Zhifu driven off a cliff to their deaths.',
  ],
  s0146: [
    'Mingliang was given the vice censor-in-chief title.',
    'Mingliang received the vice censor-in-chief title.',
  ],
  s0147: [
    'On day jichou, Guan Cheng and Liu Junfu were stripped of office for delay in suppressing rebels.',
    'On jichou, Guan Cheng and Liu Junfu lost office for slow suppression.',
  ],
  s0148: [
    'Fucheng was made Chengdu general.',
    'Fucheng became Chengdu general.',
  ],
  s0149: [
    'Summer, fifth month, day bingyin: long-overdue taxes were remitted for all Fujian.',
    'In month 5, bingyin, Fujian\'s long-overdue taxes were forgiven.',
  ],
  s0150: [
    'On day jisi, Jiangxi tribute grain was held back to relieve flood victims in thirteen Shandong prefectures and counties including Caoxian.',
    'On jisi, Jiangxi tribute grain was diverted to thirteen flooded Shandong districts including Caoxian.',
  ],
  s0151: [
    'On day jiaxu, the Emperor escorted the Retired Emperor to summer at Mulan.',
    'On jiaxu, the Emperor took the Retired Emperor to summer at Mulan.',
  ],
  s0152: [
    'Sixth month, day jiyou: for delay in suppressing rebels Delengtai was wholly stripped of rank and office and given the vice censor-in-chief title to redeem himself on campaign.',
    'In month 6, jiyou, Delengtai lost all rank for delay but kept a vice censor title to fight on.',
  ],
  s0153: [
    'On day jiayin, Yunnan-Guizhou governor-general third-rank baron E Hui died.',
    'On jiayin, Yunnan-Guizhou governor-general E Hui died.',
  ],
  s0154: [
    'Autumn, seventh month, day gengwu: Fulengtai died.',
    'In month 7, gengwu, Fulengtai died.',
  ],
  s0155: [
    'Dele\'gelenggui was made Ningxia general.',
    'Dele\'gelenggui became Ningxia general.',
  ],
  s0156: [
    'Because of rain the autumn enclosure hunt was stopped.',
    'Rain canceled the autumn enclosure hunt.',
  ],
  s0157: [
    'Eighth month: for capturing the sect rebel Wang Sanhuai, Le Bao and Heshen were advanced to duke and Fu Chang\'an to marquis.',
    'In month 8, capturing Wang Sanhuai raised Le Bao and Heshen to duke and Fu Chang\'an to marquis.',
  ],
  s0158: [
    'On day jiyou, Zhang Chengji memorialized that sect rebels rose at Xining prefecture in Jiangxi and were suppressed.',
    'On jiyou, Zhang Chengji reported and suppressed sect rebels at Jiangxi Xining.',
  ],
  s0159: [
    'Ninth month, day guihai: the Emperor escorted the Retired Emperor back to the capital.',
    'In month 9, guihai, the Emperor brought the Retired Emperor back to Beijing.',
  ],
  s0160: [
    'On day jimao, Ming general Yuan Chonghuan was enshrined at the Shrine of Eminent Statesmen.',
    'On jimao, Yuan Chonghuan was enshrined at the Shrine of Eminent Statesmen.',
  ],
  s0161: [
    'Winter, tenth month, day gengzi: the rebuilt Jiaotai Hall in the Palace of Heavenly Purity was completed.',
    'In month 10, gengzi, the rebuilt Jiaotai Hall was finished.',
  ],
  s0162: [
    'Eleventh month, day dinghai: Left Censor-in-Chief Shu Chang died.',
    'In month 11, dinghai, Left Censor-in-Chief Shu Chang died.',
  ],
  s0163: [
    'Twelfth month, day yimao: Huiling memorialized the capture of rebel chiefs Luo Qiqing and Luo Qishu.',
    'In month 12, yimao, Huiling captured rebel chiefs Luo Qiqing and Luo Qishu.',
  ],
  s0164: [
    'On day wuwu, the combined autumnal sacrifice was performed at the Imperial Ancestral Temple.',
    'On wuwu, the autumnal temple sacrifice was held.',
  ],
  s0165: [
    'That year disaster taxes were remitted in varying degrees for forty-eight departments and counties in Shaanxi, Guizhou, and other provinces.',
    'That year forty-eight disaster districts in Shaanxi, Guizhou, and elsewhere received partial tax relief.',
  ],
  s0166: [
    'Korea, Ryukyu, and Siam sent tribute.',
    'Korea, Ryukyu, and Siam paid tribute.',
  ],
  s0167: [
    'Fourth year, spring, first month, day renxu: the Retired Emperor died and the Emperor began to rule in person.',
    'In year 4, month 1, renxu, the Retired Emperor died and the Emperor took personal rule.',
  ],
  s0168: [
    'On day dingmao, Grand Secretary Heshen was found guilty and, with Minister Fu Chang\'an, was imprisoned for interrogation.',
    'On dingmao, Heshen was convicted and imprisoned with Fu Chang\'an for trial.',
  ],
  s0169: [
    'Prince of Yi Yongxuan was advanced to prince of the first rank, Prince Qing Yonglin to Prince Qing of the second rank, Mianyi to Prince of Lu, Yilun and Yishen to study in the Upper Study, and Mianzhi and others were enfeoffed with varying rewards.',
    'Yongxuan, Yonglin, Mianyi, Yilun, Yishen, and Mianzhi received promotions and enfeoffments.',
  ],
  s0170: [
    'An edict stated: "Memorials from within and without shall reach Us directly; sealed copies may not be routed through the Grand Council."',
    'An edict required memorials to reach the throne directly, not through the Grand Council.',
  ],
  s0171: [
    'Prince Cheng Yongxing, Grand Secretary Dong Gao, and Minister Qinggui were ordered to serve at the Grand Council.',
    'Yongxing, Dong Gao, and Qinggui joined the Grand Council.',
  ],
  s0172: [
    'Shen Chu was removed from regular attendance.',
    'Shen Chu left regular Grand Council attendance.',
  ],
  s0173: [
    'Prince Cheng Yongxing was put in charge of the Ministry of Revenue.',
    'Prince Cheng Yongxing took charge of revenue.',
  ],
  s0174: [
    'On day dingchou, Heshen was ordered to die in prison and Fu Chang\'an was sentenced to execution.',
    'On dingchou, Heshen was ordered to die in prison and Fu Chang\'an sentenced to death.',
  ],
  s0175: [
    'On day jimao, a special edict reaffirmed military discipline.',
    'On jimao, a special edict reaffirmed military discipline.',
  ],
  s0176: [
    'Le Bao was made supreme commander, Mingliang and Eledengbao made deputies, and Liu Qing\'s official conduct was to be investigated and truthfully recommended.',
    'Le Bao became supreme commander with Mingliang and Eledengbao as deputies; Liu Qing was to be investigated and recommended.',
  ],
  s0177: [
    'Wu Shengqin was dismissed and Liu Quanzhi made Left Censor-in-Chief.',
    'Wu Shengqin left office and Liu Quanzhi became left censor-in-chief.',
  ],
  s0178: [
    'Baoning was made Grand Secretary while still managing the Ili generalship; Qinggui was made assisting Grand Secretary; Shulin Minister of Personnel; Songyun Minister of Revenue.',
    'Baoning joined the Grand Secretariat while keeping Ili; Qinggui assisted; Shulin took personnel and Songyun revenue.',
  ],
  s0179: [
    'Merit was recorded for the slaying of rebel chief Ran Wen\'ou and rewards were granted to Huiling and Delengtai.',
    'Slaying Ran Wen\'ou brought merit registers and rewards for Huiling and Delengtai.',
  ],
  s0180: [
    'On day bingxu, Yimian was relieved and Hengrui made Shaanxi-Gansu governor-general.',
    'On bingxu, Yimian left office and Hengrui took Shaanxi-Gansu.',
  ],
  s0181: [
    'On day dinghai, the former censor Cao Xibao was posthumously given the vice censor-in-chief title and one son was granted office by inheritance.',
    'On dinghai, the late censor Cao Xibao was posthumously honored and one son ennobled.',
  ],
  s0182: [
    'The former Grand Secretariat academician Yin Zhuangtu was summoned to the capital.',
    'Former academician Yin Zhuangtu was summoned to Beijing.',
  ],
  s0183: [
    'Second month, day jichou: Songyun was made Shaanxi-Gansu governor-general and Buyandabai Minister of Revenue.',
    'In month 2, jichou, Songyun took Shaanxi-Gansu and Buyandabai took revenue.',
  ],
  s0184: [
    'On day xinmao, an edict stated: "Since the sect rebels rose, they have forced good people, burned farmsteads,"',
    'On xinmao, an edict said sect rebels had forced the people and burned farms.',
  ],
  s0185: [
    '"The people did not willingly join the rebels; if they fled they had nowhere to go, and if they returned they had nothing to eat."',
    'People did not join willingly; flight brought no refuge and return brought no food.',
  ],
  s0186: [
    '"They should quickly be summoned and dispersed—empty words cannot achieve this."',
    'They must be summoned and dispersed quickly; words alone would not suffice.',
  ],
  s0187: [
    '"How to pacify and settle them should be asked of Le Bao through Liu Qing and other good officials; sound methods should be devised so they can be carried out, and a speedy report made."',
    'Le Bao was to ask Liu Qing and other good officials how to pacify and settle them and report workable methods at once.',
  ],
  s0188: [
    'On day jiawu, the ban on private sale of Khotan jade was relaxed.',
    'On jiawu, the ban on private Khotan jade sales was relaxed.',
  ],
  s0189: [
    'On day xinchou, Qin Cheng\'en was stripped of office and arrested for dereliction in military affairs.',
    'On xinchou, Qin Cheng\'en lost office and was arrested for military dereliction.',
  ],
  s0190: [
    'Li Fenghan died and Fei Chun was made Jiangnan-Jiangxi governor-general.',
    'Li Fenghan died; Fei Chun took the two Jiangs.',
  ],
  s0191: [
    'On day yisi, the provincial examination quota for imperial clansmen was restored and additional quota posts for clansmen in ministries were increased.',
    'On yisi, the clan provincial exam and ministry quota posts for clansmen were restored.',
  ],
  s0192: [
    'On day renzi, descendants implicated in the cases of Xu Shukui and Wang Xihou who had been banished were released.',
    'On renzi, banished kin of Xu Shukui and Wang Xihou were released.',
  ],
  s0193: [
    'On day dingsi, descendants of the late Grand Secretaries Zhu Shi and Sun Jiagan were employed.',
    'On dingsi, descendants of Zhu Shi and Sun Jiagan were given office.',
  ],
  s0194: [
    'Third month, new moon on day jiwei: Su Linga was dismissed; Qinggui was made Grand Secretary, Chengde Minister of Punishments, and Fu Sen Left Censor-in-Chief.',
    'At the third-month new moon, Su Linga left office; Qinggui joined the Grand Secretariat, Chengde took punishments, and Fu Sen the left censorate.',
  ],
  s0195: [
    'On day gengshen, Minister of Revenue Shen Chu died and Fan Jianzhong was made Minister of Revenue.',
    'On gengshen, Shen Chu died; Fan Jianzhong took revenue.',
  ],
  s0196: [
    'On day guihai, Shulin was made Fujian-Zhejiang governor-general and assisting Grand Secretary.',
    'On guihai, Shulin became Fujian-Zhejiang governor-general and assisting grand secretary.',
  ],
  s0197: [
    'On day jiazi, Qinglin was transferred to Fuzhou general and Fuchang Jiangning general.',
    'On jiazi, Qinglin took Fuzhou and Fuchang took Jiangning.',
  ],
  s0198: [
    'On day wuchen, circuit intendants in Zhili were permitted to submit secret memorials.',
    'On wuchen, Zhili circuit intendants were allowed secret memorials.',
  ],
  s0199: [
    'On day gengwu, Jing An was relieved and Wushibu made Huguang governor-general and Wu Xiongguang Henan governor.',
    'On gengwu, Jing An left office; Wushibu took Huguang and Wu Xiongguang Henan.',
  ],
  s0200: [
    'On day bingzi, Eledengbao memorialized the extermination of sect rebels Xiao Zhanguo and Zhang Changgeng; the Emperor praised this and granted him second-rank baron.',
    'On bingzi, Eledengbao reported destroying Xiao Zhanguo and Zhang Changgeng and was made a second-rank baron.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_016_b02.mjs <translation.json>'
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
