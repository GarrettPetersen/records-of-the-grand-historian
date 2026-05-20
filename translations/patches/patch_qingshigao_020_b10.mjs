#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0901: [
    'On day gengzi, Russians brought troops to Hailanpao, built camps, emplaced artillery, and demanded trade.',
    'On gengzi day, Russian troops reached Hailanpao, encamped with guns, and asked to trade.',
  ],
  s0902: [
    'Yishan was ordered to refuse them.',
    'The court ordered Yishan to turn them away.',
  ],
  s0903: [
    'On day xinchou, He Guiqing memorialized requesting restoration of Prefect Wen Shaoyuan to office to manage the Liuhe local militia.',
    'On xinchou day, He Guiqing asked that Prefect Wen Shaoyuan be restored to run Liuhe militia.',
  ],
  s0904: [
    'An edict said troops of Jilin and Heilongjiang had long labored abroad and were to be withdrawn as appropriate.',
    'The court ordered a measured withdrawal of Jilin and Heilongjiang troops long stationed away.',
  ],
  s0905: [
    'On day renyin, Qing Ying memorialized that Kokand had joined with Hui rebels, seized Yingjisha city, and he was gathering troops to suppress them.',
    'On renyin day, Qing Ying reported Kokand and Muslim rebels holding Yingjisha and mobilized to crush them.',
  ],
  s0906: [
    'Zhang Guoliang was made Hunan provincial military commander.',
    'Zhang Guoliang became Hunan provincial commander.',
  ],
  s0907: [
    'On day guimao, Fujian government troops recovered Guangze and Tingzhou; entrenched rebels fled toward Liancheng and were defeated.',
    'On guimao day, Fujian troops retook Guangze and Tingzhou and beat rebels fleeing to Liancheng.',
  ],
  s0908: [
    'Sixth month, day renzi: Shu Xing\'a was summoned to the capital; Sang Chunrong was made Yunnan governor.',
    'In the sixth month, on renzi day, Shu Xing\'a was called to Beijing and Sang Chunrong made Yunnan governor.',
  ],
  s0909: [
    'On day guichou, Fujian government troops recovered Shaowu.',
    'On guichou day, Fujian troops retook Shaowu.',
  ],
  s0910: [
    'On day yimao, Jiangnan government troops recovered Jurong; He Chun was promoted to Junior Guardian of the Heir Apparent, and Zhang Guoliang was given a yellow riding jacket.',
    'On yimao day, Jiangnan troops took Jurong; He Chun became Junior Guardian and Zhang Guoliang received a yellow jacket.',
  ],
  s0911: [
    'On day xinyou, Wang Zhen reinforced Ji\'an in Jiangxi, won successive battles, and was given a Baturu valor title.',
    'On xinyou day, Wang Zhen relieved Ji\'an, won repeatedly, and received a Baturu title.',
  ],
  s0912: [
    'On day dingmao, bandits in Nanyang, Henan, were pacified.',
    'On dingmao day, Nanyang bandits in Henan were pacified.',
  ],
  s0913: [
    'On day guiyou, Fujian government troops recovered Taining and Jianning.',
    'On guiyou day, Fujian troops retook Taining and Jianning.',
  ],
  s0914: [
    'Russian envoys reached Tianjin with a state letter; Wen Qian was ordered to reject them.',
    'Russian envoys brought credentials to Tianjin and Wen Qian was told to refuse them.',
  ],
  s0915: [
    'The Yongding River burst its banks.',
    'The Yongding River broke through.',
  ],
  s0916: [
    'On day yihai, Yunnan Hui rebels attacked the provincial city and Hengchun killed himself.',
    'On yihai day, Yunnan Muslim rebels struck the capital and Hengchun committed suicide.',
  ],
  s0917: [
    'When word came, Wu Zhenzhang was transferred as Yun-Gui governor-general, Wang Qingyun as Sichuan governor-general, and Hengfu as Shanxi governor.',
    'On report, Wu Zhenzhang took Yun-Gui, Wang Qingyun Sichuan, and Hengfu Shanxi.',
  ],
  s0918: [
    'On day bingzi, Jiangxi government troops recovered Longquan.',
    'On bingzi day, Jiangxi troops retook Longquan.',
  ],
  s0919: [
    'On day wuyin, Xu Naizhao was ordered to assist Jiangnan military affairs; Zhang Liangji was given fifth-rank status to assist Yunnan bandit suppression.',
    'On wuyin day, Xu Naizhao joined Jiangnan command and Zhang Liangji received fifth rank for Yunnan suppression.',
  ],
  s0920: [
    'Autumn, seventh month, day yiyou: Li Mengqun memorialized recovery of Huoshan.',
    'In autumn, month 7, on yiyou day, Li Mengqun reported Huoshan recovered.',
  ],
  s0921: [
    'On day jichou, Henan government troops recovered Dengzhou.',
    'On jichou day, Henan troops retook Dengzhou.',
  ],
  s0922: [
    'On day guisi, Yishan was ordered to assemble the Russian envoy to survey and fix the boundaries on both banks of the Amur.',
    'On guisi day, Yishan was told to meet Russian envoys to demarcate both banks of the Amur.',
  ],
  s0923: [
    'On day jiawu, Guizhou government troops recovered Jinping.',
    'On jiawu day, Guizhou troops retook Jinping.',
  ],
  s0924: [
    'Hubei government troops attacked Huangmei with a great victory; overall commander Wang Guocai fought fiercely and died in battle, was posthumously made provincial commander, and granted condolence payments and an official temple.',
    'At Huangmei Hubei troops won heavily; Wang Guocai died fighting and was posthumously promoted with rites and a temple.',
  ],
  s0925: [
    'On day jiachen, Duxing\'a was ordered to assist Guanwen in military affairs.',
    'On jiachen day, Duxing\'a was assigned to help Guanwen.',
  ],
  s0926: [
    'Eighth month, day jiyou, first day of the month: there was a solar eclipse.',
    'In the eighth month, on the jiyou new moon, there was a solar eclipse.',
  ],
  s0927: [
    'On day renzi, Fujian government troops recovered Ninghua.',
    'On renzi day, Fujian troops retook Ninghua.',
  ],
  s0928: [
    'On day guichou, Jiangxi government troops recovered Ruizhou.',
    'On guichou day, Jiangxi troops retook Ruizhou.',
  ],
  s0929: [
    'On day dingchou, Fafuli memorialized recovery of the Muslim city of Yingjisha and relief of the siege of Hancheng.',
    'On dingchou day, Fafuli reported Yingjisha Muslim city recovered and Hancheng relieved.',
  ],
  s0930: [
    'On day wuyin, Guanwen and Hu Linyi memorialized that all Hubei was pacified.',
    'On wuyin day, Guanwen and Hu Linyi reported all Hubei cleared.',
  ],
  s0931: [
    'An edict said: "Hu Linyi personally commanded his forces in capturing the rebel city of Xiaochikou; riding this prestige he should plan recovery of Jiujiang to revive the overall situation.',
    'The throne said Hu Linyi\'s capture of Xiaochikou should be used to recover Jiujiang and revive the whole front.',
  ],
  s0932: [
    '"Previously Hu Linyi had memorialized confidentially that to secure Hubei and recover Jinling one must first take Jiujiang, then recover Anqing—that is grasping the essentials; hence the explicit edict followed his view."',
    'Earlier Hu Linyi had urged Jiujiang then Anqing to save Hubei and Nanjing, and the edict followed him.',
  ],
  s0933: [
    'Ninth month, day gengchen: Hunan relief circuit intendant for Ganzhou, Wang Zhen, died in camp and was posthumously made provincial administration commissioner.',
    'In the ninth month, on gengchen day, relief commander Wang Zhen died in Jiangxi service and was posthumously made administration commissioner.',
  ],
  s0934: [
    'On day renwu, Sheng Bao memorialized recovery of Zhengyang Pass and also that Fengtai licentiate Miao Peilin was gathering crowds under militia pretense.',
    'On renwu day, Sheng Bao reported Zhengyang Pass taken and warned Miao Peilin was rallying men as militia.',
  ],
  s0935: [
    'An edict said: "One should show no suspicion and use him to calm restiveness."',
    'The court said to trust him and calm unrest.',
  ],
  s0936: [
    'On day bingxu, Fafuli memorialized recovery of the Kashgar Muslim city.',
    'On bingxu day, Fafuli reported Kashgar Muslim city recovered.',
  ],
  s0937: [
    'On day gengyin, Hubei rebels took Shucheng.',
    'On gengyin day, rebels took Shucheng in Hubei.',
  ],
  s0938: [
    'Henan Nian rebels took Nanyang.',
    'Nian bandits took Nanyang in Henan.',
  ],
  s0939: [
    'On day bingshen, Jiangxi government troops recovered Dongxiang.',
    'On bingshen day, Jiangxi troops retook Dongxiang.',
  ],
  s0940: [
    'On day dingwei, Hunan relief troops for Guizhou recovered Liping.',
    'On dingwei day, Hunan relief troops retook Liping in Guizhou.',
  ],
  s0941: [
    'Winter, tenth month, day wushen, first day of the month: Guanwen and Hu Linyi memorialized that Li Xubin and others advanced by land and water and captured Hukou county in Jiangxi.',
    'In winter, month 10, on the wushen new moon, Guanwen and Hu Linyi reported Li Xubin took Jiangxi Hukou by land and water.',
  ],
  s0942: [
    'Sheng Bao and Yuan Jiasan memorialized that overall commanders Zhu Liantai, Shi Rongchun, and others attacked Nian bandits and leveled the Hanwei rebel nest.',
    'Sheng Bao and Yuan Jiasan reported Zhu Liantai and Shi Rongchun destroyed Nian nests at Hanwei.',
  ],
  s0943: [
    'Jiang Yunzhi and Tong Panmei memorialized that in suppressing Miao and religious rebels many were beheaded or captured and Duyun rebels withdrew.',
    'Jiang Yunzhi and Tong Panmei reported Miao and sect rebels cut down and Duyun rebels driven back.',
  ],
  s0944: [
    'Henan government troops defeated rebels at Nanzhao and advanced to mop up remnants at Yuzhou and Biyang.',
    'Henan troops beat rebels at Nanzhao and pursued remnants at Yuzhou and Biyang.',
  ],
  s0945: [
    'On day jiwei, Li Mengqun suppressed Nian bandits at Dushan unsuccessfully; his troops collapsed.',
    'On jiwei day, Li Mengqun failed against Nian at Dushan and his force broke.',
  ],
  s0946: [
    'On day yichou, Hubei relief forces under Li Xubin and others captured Pengze.',
    'On yichou day, Li Xubin\'s Hubei relief force took Pengze.',
  ],
  s0947: [
    'Guangxi government troops recovered Nanning.',
    'Guangxi government troops retook Nanning.',
  ],
  s0948: [
    'On day wuchen, Hu Linyi memorialized accumulated abuses in grain transport tax and requested reform of collection to fund military needs; assented.',
    'On wuchen day, Hu Linyi won assent to reform transport grain levies for the army.',
  ],
  s0949: [
    'On day gengwu, Henan rebels entered Wusheng Pass and rushed toward Shangnan; Shaanxi government troops drove them off.',
    'On gengwu day, Henan rebels broke through Wusheng Pass toward Shangnan and Shaanxi troops repulsed them.',
  ],
  s0950: [
    'On day jiaxu, Yang Zaifu was made Fujian land forces provincial commander.',
    'On jiaxu day, Yang Zaifu became Fujian land commander.',
  ],
  s0951: [
    'Li Xubin was made Zhejiang administration commissioner.',
    'Li Xubin became Zhejiang administration commissioner.',
  ],
  s0952: [
    'Eleventh month, day wuyin, first day of the month: Yinggui memorialized Deling defeated rebels at Lushi and Qiu Lian\'en defeated rebels at Xichuan.',
    'In the eleventh month, on the wuyin new moon, Yinggui reported victories at Lushi and Xichuan.',
  ],
  s0953: [
    'Anhui rebels took Hezhou and Huoshan.',
    'Anhui rebels took Hezhou and Huoshan.',
  ],
  s0954: [
    'Yang Zaifu recovered Wangjiang, Dongliu, and Tongling.',
    'Yang Zaifu retook Wangjiang, Dongliu, and Tongling.',
  ],
  s0955: [
    'On day yiyou, Luo Bingzhang memorialized Jiang Yizao and Jiang Zhongjun aided Guangxi suppression with successive victories and were besieging Pingle.',
    'On yiyou day, Luo Bingzhang reported Jiang Yizao and Jiang Zhongjun winning in Guangxi and besieging Pingle.',
  ],
  s0956: [
    'On day wuzi, Hu Linyi memorialized recommending commoners Wan Huquan, Song Ding, Zou Jinshu, and others.',
    'On wuzi day, Hu Linyi recommended commoners Wan Huquan, Song Ding, and Zou Jinshu.',
  ],
  s0957: [
    'On day jiawu, Gurkha presented tribute in sincere submission and was bestowed precious gifts.',
    'On jiawu day, Nepal sent loyal tribute and received imperial gifts.',
  ],
  s0958: [
    'On day bingshen, Dexing\'a and others memorialized recovery of Guazhou.',
    'On bingshen day, Dexing\'a reported Guazhou recovered.',
  ],
  s0959: [
    'An edict praised and rewarded them; double-eyed peacock feather and hereditary Chariot Commandant rank were granted.',
    'The throne praised them with double peacock feathers and hereditary Chariot Commandant rank.',
  ],
  s0960: [
    'Weng Tonghe was employed as vice minister; Ju Dianhua was given provincial commander status.',
    'Weng Tonghe joined as vice minister and Ju Dianhua received commander status.',
  ],
  s0961: [
    'On day wuxu, He Chun memorialized that with Zhang Guoliang he recovered Zhenjiang; He Chun received double peacock feather and hereditary Light Chariot Commandant, Zhang Guoliang hereditary Chariot Commandant, and He Guiqing Grand Guardian of the Heir Apparent.',
    'On wuxu day, He Chun and Zhang Guoliang retook Zhenjiang; He Chun received double peacock feathers and Light Chariot Commandant succession, Zhang Guoliang Chariot Commandant succession, He Guiqing Grand Guardian.',
  ],
  s0962: [
    'On day gengzi, Yinggui memorialized defeat of rebels at Ruzhou and pacification of western Henan.',
    'On gengzi day, Yinggui reported victory at Ruzhou and western Henan cleared.',
  ],
  s0963: [
    'On day xinchou, the Yongding River was closed.',
    'On xinchou day, the Yongding River breach was closed.',
  ],
  s0964: [
    'Twelfth month, day xinhai: Qiling memorialized Zeng Guoquan captured Jishui.',
    'In the twelfth month, on xinhai day, Qiling reported Zeng Guoquan took Jishui.',
  ],
  s0965: [
    'Luo Bingzhang and Lao Chongguang jointly memorialized government troops captured Pingle.',
    'Luo Bingzhang and Lao Chongguang jointly reported Pingle taken.',
  ],
  s0966: [
    'Guangxi rebels took Qingyuan.',
    'Guangxi rebels took Qingyuan.',
  ],
  s0967: [
    'On day bingchen, Associate Grand Councilor in charge of suppressing bandits in three provinces, Sheng Bao, memorialized requesting all Anhui troops be placed under his command.',
    'On bingchen day, Sheng Bao asked that all Anhui troops answer to him.',
  ],
  s0968: [
    'An edict said: "Sheng Bao is still brave; if he calms his rashness and checks his arrogance he can be useful—why need he himself presumptuously petition?"',
    'The throne said Sheng Bao could serve if he curbed rash pride and need not petition for command.',
  ],
  s0969: [
    'On day gengshen, English entered the Guangdong provincial city and seized Governor Ye Mingchen and took him away.',
    'On gengshen day, the British entered Guangzhou and abducted Governor Ye Mingchen.',
  ],
  s0970: [
    'An edict stripped Ye Mingchen of office; Huang Zonghan was made Liang-Guang governor-general and Bo Gui acted in his stead.',
    'Ye Mingchen was dismissed; Huang Zonghan became Liang-Guang governor-general with Bo Gui acting.',
  ],
  s0971: [
    'On day yihai, Li Mengqun memorialized Guangdong and Nian bandits joined in an eastern thrust pressing Shang and Gu.',
    'On yihai day, Li Mengqun warned Cantonese and Nian rebels were thrusting east toward Shang and Gu.',
  ],
  s0972: [
    'Sheng Bao was ordered to guard strictly.',
    'Sheng Bao was ordered to block them firmly.',
  ],
  s0973: [
    'On day bingzi, the combined seasonal worship was performed at the Imperial Ancestral Temple.',
    'On bingzi day, the court held seasonal temple rites.',
  ],
  s0974: [
    'That year, land tax was remitted in varying degrees for 235 departments, districts, counties, and garrisons in Zhili, Jiangsu, Shandong, Shanxi, Henan, Shaanxi, Hunan, Guangxi, and other provinces, and for four indigenous districts of Guangxi stricken by disaster or rebels.',
    'That year tax was forgiven in 235 units across several provinces and four Guangxi indigenous districts hit by disaster or rebels.',
  ],
  s0975: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s0976: [
    'Eighth year, day wuwu, spring, first month, day jimao: Tong Panmei was dismissed; Jiang Yulong was made Guizhou provincial commander.',
    'Xianfeng 8, spring, month 1, jimao: Tong Panmei left office and Jiang Yulong became Guizhou commander.',
  ],
  s0977: [
    'On day bingxu, Wang Yide was ordered to prepare coastal defense.',
    'On bingxu day, Wang Yide was told to ready coastal defense.',
  ],
  s0978: [
    'On day gengyin, Jiangxi government troops recovered Linjiang.',
    'On gengyin day, Jiangxi troops retook Linjiang.',
  ],
  s0979: [
    'Second month, day gengwu: government troops recovered Moling Pass and advanced to besiege Jinling; He Chun was promoted to Grand Guardian of the Heir Apparent, Zhang Guoliang given double peacock feather, and fallen overall commander Hu Kunyuan generously granted hereditary rank.',
    'In month 2, on gengwu day, troops took Moling Pass and besieged Nanjing; He Chun became Grand Guardian, Zhang Guoliang received double peacock feathers, and Hu Kunyuan\'s heirs were honored.',
  ],
  s0980: [
    'Third month, day dingchou, first day of the month: Sheng Bao memorialized victories in bandit suppression and relief of Gushi siege.',
    'In month 3, on the dingchou new moon, Sheng Bao reported wins and Gushi relieved.',
  ],
  s0981: [
    'An edict praised and rewarded.',
    'The court praised and rewarded him.',
  ],
  s0982: [
    'On day wuyin, Russian ships reached Tianjin.',
    'On wuyin day, Russian ships reached Tianjin.',
  ],
  s0983: [
    'Tan Tingxiang was ordered to block them.',
    'Tan Tingxiang was ordered to stop them.',
  ],
  s0984: [
    'On day guiwei, northern Jiang government troops recovered Jiangpu and Circuit Intendant Wen Shaoyuan was restored to office.',
    'On guiwei day, northern Jiang troops retook Jiangpu and Wen Shaoyuan was restored.',
  ],
  s0985: [
    'On day gengyin, Fu Ji memorialized recovery of Hezhou.',
    'On gengyin day, Fu Ji reported Hezhou recovered.',
  ],
  s0986: [
    'Guizhou rebels took Duyun and former provincial commander Tong Panmei died.',
    'Guizhou rebels took Duyun and ex-commander Tong Panmei was killed.',
  ],
  s0987: [
    'Summer, fourth month, day bingwu, first day of the month: Tan Tingxiang memorialized Russians were not observing the old Xing\'an treaty and requested the Ussuri and Suifen rivers as boundary while envoys still asked to enter the capital.',
    'In summer, month 4, on the bingwu new moon, Tan Tingxiang said Russia ignored Xing\'an, sought Ussuri and Suifen boundaries, and envoys still wanted Beijing.',
  ],
  s0988: [
    'An edict said: "Boundary demarcation has already been assigned to high officials for joint survey; envoys may not enter the capital out of season—reject them."',
    'The throne said demarcation was under appointed commissioners and off-season envoys must be refused.',
  ],
  s0989: [
    'On day dingwei, Jiangxi rebels entered Fujian and took Zhenghe and Songxi.',
    'On dingwei day, Jiangxi rebels entered Fujian and took Zhenghe and Songxi.',
  ],
  s0990: [
    'On day wushen, Russians requested overland travel; English and French requested entry to the capital once every several years; edict did not permit.',
    'On wushen day, Russia asked inland passage and Britain and France periodic Beijing entry; all were denied.',
  ],
  s0991: [
    'Sheng Bao memorialized Nian leader Li Zhaoshou begged surrender; permitted.',
    'Sheng Bao reported Li Zhaoshou\'s surrender and it was accepted.',
  ],
  s0992: [
    'On day jiyou, Anhui rebels took Macheng while another band took Meng, Bo, Huai, and Su; Yuan Jiasan was ordered to suppress them.',
    'On jiyou day, Anhui rebels took Macheng and other points; Yuan Jiasan was sent against them.',
  ],
  s0993: [
    'An edict permitted Russian trade but not entry to the capital.',
    'Trade with Russia was allowed but not embassy entry to Beijing.',
  ],
  s0994: [
    'On day gengxu, rebels took Hezhou.',
    'On gengxu day, rebels retook Hezhou.',
  ],
  s0995: [
    'Dali Muslim rebels in Yunnan took Shunning.',
    'Yunnan Dali Muslims took Shunning.',
  ],
  s0996: [
    'On day wushen, an edict ordered Tan Tingxiang to inform English and French that taxes would be reduced and markets expanded, to wait until Cantonese affairs were settled before discussing coming to the capital.',
    'On wushen day, Tan Tingxiang was told to offer Britain and France lower duties and more ports after Guangdong affairs ended.',
  ],
  s0997: [
    'On day gengxu, Jiangxi rebels took Changshan and Kaihua; overall commander Zhou Tianshou was given provincial commander status dedicated to Zhejiang defense, and circuit intendant Rao Tingxuan was to defend Quzhou.',
    'On gengxu day, Jiangxi rebels took Changshan and Kaihua; Zhou Tianshou received commander status for Zhejiang and Rao Tingxuan held Quzhou.',
  ],
  s0998: [
    'On day xinhai, Tan Tingxiang presented the American state letter; edict permitted reduced tax rates and additional treaty ports but still did not permit entry to the capital.',
    'On xinhai day, Tan Tingxiang presented US credentials; reduced duties and more ports were allowed but not Beijing entry.',
  ],
  s0999: [
    'On day yimao, British and French warships entered Dagukou; government troops withdrew to defend.',
    'On yimao day, Anglo-French warships entered the Dagu forts and Qing forces fell back.',
  ],
  s1000: [
    'Sengge Rinchen was ordered to prepare troops at Tongzhou.',
    'Sengge Rinchen was told to ready forces at Tongzhou.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b10.mjs <translation.json>'
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
