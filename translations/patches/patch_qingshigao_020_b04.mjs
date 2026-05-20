#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    "Lu Yinggu reported that intelligence showed the rebels planned at the new year to drive east toward Anqing and Jiangning.",
    "Lu Yinggu reported rebel plans to strike east at Anqing and Jiangning in the new year.",
  ],
  s0302: [
    "An edict ordered Xiang Rong to spy on many fronts, meet attacks, and round up suppression.",
    "Xiang Rong was ordered to scout widely, intercept, and suppress.",
  ],
  s0303: [
    "On day jiayin, the Foot and Vanguard commanders-in-chief were ordered to ready forces and root out traitors.",
    "On jiayin, the Foot and Vanguard commanders were told to ready troops and hunt traitors.",
  ],
  s0304: [
    "On day jiazi, rebels took Jiujiang; Lu Jianying fell back to defend Jiangning.",
    "On jiazi, rebels took Jiujiang and Lu Jianying withdrew to Jiangning.",
  ],
  s0305: [
    "Saishanga was sentenced to decapitation; his son Chongqi and others were stripped of office.",
    "Saishanga was condemned to death and Chongqi and others lost office.",
  ],
  s0306: [
    "On day dingmao, Vice Minister of Works Lü Xianji was sent back to Anhui to organize defense; Zhou Tianjue was given vice-minister rank to assist in defense.",
    "On dingmao, Lü Xianji returned to Anhui for defense and Zhou Tianjue joined with vice-minister rank.",
  ],
  s0307: [
    "On day renshen, Lu Jianying was stripped of office and arrested; Xianghou was made Imperial Commissioner.",
    "On renshen, Lu Jianying was dismissed and arrested and Xianghou became Imperial Commissioner.",
  ],
  s0308: [
    "On day guiyou, because gentry in Shanxi, Shaanxi, and Sichuan donated army funds, added quotas were granted for the provincial examination and student places.",
    "On guiyou, Shanxi, Shaanxi, and Sichuan donors won added exam and student quotas.",
  ],
  s0309: [
    "On day jiaxu, rebels took Anqing; Jiang Wenqing died; Zhou Tianjue was ordered to act as Anhui governor.",
    "On jiaxu, rebels took Anqing, Jiang Wenqing died, and Zhou Tianjue acted as Anhui governor.",
  ],
  s0310: [
    "Hereditary office was granted to Jiangxi fallen Regional Commander Enchang.",
    "Fallen Jiangxi commander Enchang received a hereditary post.",
  ],
  s0311: [
    "Second month, day bingzi (new moon), an edict: \"The capital's Eight Banner garrison exceeds 150,000; supervising ministers must train them diligently.",
    "Month 2, bingzi new moon: \"Over 150,000 capital banner troops must be drilled by their commanders.",
  ],
  s0312: [
    "\" Posthumous honors were granted to Hubei martyrs: Educational Intendant Feng Peiyuan was promoted to vice minister with posthumous name Wenjie; Provincial Administration Commissioner Liang Xingyuan posthumous Minsu; Surveillance Commissioner Ruiyuan posthumous Duanjie; prefects and below received hereditary posts and dedicated shrines; Regional Commander Shuangfu and Commander Wang Jinxiu were enshrined with Chang Dachun.",
    "\" Hubei martyrs were honored: Feng Peiyuan as Wenjie, Liang Xingyuan as Minsu, Ruiyuan as Duanjie; lower officials won hereditary posts and shrines; Shuangfu and Wang Jinxiu joined Chang Dachun's shrine.",
  ],
  s0313: [
    "On day dingchou, the sacrifice was offered to Confucius.",
    "On dingchou, Confucius was honored at the temple sacrifice.",
  ],
  s0314: [
    "Junior Vice President Lei Yiqian and Reader Jin Kang were sent to the Southern River; Junior Mentor Wang Lüqian to the Eastern River, all to assist in defense.",
    "Lei Yiqian and Jin Kang went to the Southern River and Wang Lüqian to the Eastern River to organize defense.",
  ],
  s0315: [
    "On day guiwei, the Emperor lectured at the Imperial Academy and the Duke of Yansheng Kong Fanhao was promoted to Junior Guardian of the Heir Apparent.",
    "On guiwei, the Emperor lectured at the Academy and Kong Fanhao became Junior Guardian.",
  ],
  s0316: [
    "On day dinghai, civil officials of third rank and above were ordered to give forty percent of their integrity stipends and military officials of second rank and above twenty percent for army funds.",
    "On dinghai, civil officials gave forty percent and military officials twenty percent of integrity stipends for the army.",
  ],
  s0317: [
    "The Board of Revenue proposed merchant donations and household levies; the Emperor did not permit them.",
    "The Revenue Board proposed merchant and household levies; the Emperor refused.",
  ],
  s0318: [
    "On day renchen, rebels took Jiangning; General Xianghou, Regional Commander Fuzhu Hong'a, and others died.",
    "On renchen, rebels took Jiangning; Xianghou, Fuzhu Hong'a, and others died.",
  ],
  s0319: [
    "Yiliang was made governor-general of the Two Jiangs; Huicheng was ordered to hurry south to defend and suppress.",
    "Yiliang became Two Jiangs governor-general and Huicheng was sent south to fight.",
  ],
  s0320: [
    "Tuoming'a was transferred to Jiangning general; Wenbin to Suiyuan general; Ruichang to Hangzhou general; Deng Shaoliang to Jiangnan regional commander.",
    "Tuoming'a took Jiangning, Wenbin Suiyuan, Ruichang Hangzhou, and Deng Shaoliang Jiangnan.",
  ],
  s0321: [
    "On day bingshen, Qishan was ordered to join defense on the Huai and Yangzi.",
    "On bingshen, Qishan was sent to defend the Huai-Yangzi line.",
  ],
  s0322: [
    "An edict allowed Hubei temporarily to use two thousand piculs of Sichuan salt.",
    "Hubei was allowed two thousand piculs of Sichuan salt for the time being.",
  ],
  s0323: [
    "An edict ordered Li Yun to hunt down Nian bandits in Shandong's Yan, Yi, and Cao prefectures.",
    "Li Yun was ordered to suppress Nian bandits in Yan, Yi, and Cao.",
  ],
  s0324: [
    "Cabinet Academician Sheng Bao was ordered to assist in northern Jiang defense.",
    "Sheng Bao was ordered to help organize northern Jiang defense.",
  ],
  s0325: [
    "Third month, day yisi, rebels took Zhenjiang and Yangzhou.",
    "In month 3, yisi, rebels took Zhenjiang and Yangzhou.",
  ],
  s0326: [
    "On day bingwu, Empress Xiaohuirui was enshrined in the Imperial Ancestral Temple.",
    "On bingwu, Empress Xiaohuirui entered the ancestral temple.",
  ],
  s0327: [
    "On day xinhai, the Emperor plowed the sacred field.",
    "On xinhai, the Emperor performed the plowing rite.",
  ],
  s0328: [
    "On day renzi, Hubei Surveillance Commissioner Jiang Zhongyuan was ordered to assist in Jiangnan military affairs.",
    "On renzi, Jiang Zhongyuan was ordered to help in Jiangnan operations.",
  ],
  s0329: [
    "On day bingchen, Vice Minister Yijing was ordered to lead Miyun troops to Shandong for joint defense.",
    "On bingchen, Yijing led Miyun troops to Shandong for joint defense.",
  ],
  s0330: [
    "On day dingsi, an edict: in every province militia might kill bandits on the spot without inquiry.",
    "On dingsi, provinces were told militia could kill bandits without trial.",
  ],
  s0331: [
    "Luo Bingzhang was restored as Hunan governor.",
    "Luo Bingzhang returned as Hunan governor.",
  ],
  s0332: [
    "An edict ordered Jiangning Provincial Administration Commissioner Chen Qimai to set up a grain depot at Xuzhou.",
    "Chen Qimai was told to establish a grain depot at Xuzhou.",
  ],
  s0333: [
    "On day gengshen, Xiang Rong attacked rebels at Jiangning and defeated them.",
    "On gengshen, Xiang Rong beat rebels at Jiangning.",
  ],
  s0334: [
    "Shi Degao was made Fujian naval regional commander.",
    "Shi Degao became Fujian naval regional commander.",
  ],
  s0335: [
    "On day renxu, Luzhou was made capital of Anhui Province.",
    "On renxu, Luzhou became the Anhui provincial capital.",
  ],
  s0336: [
    "Zhou Tianjue's suppression was prompt and Qishan's attacks won repeated victories; both were rewarded.",
    "Zhou Tianjue and Qishan were praised for swift suppression and victories.",
  ],
  s0337: [
    "An edict ordered Zhili and Fengtian to prepare defense at sea mouths.",
    "Zhili and Fengtian were ordered to guard the sea approaches.",
  ],
  s0338: [
    "On day bingyin, Xiang Rong reported successive victories over city rebels and advance to Bell Mountain.",
    "On bingyin, Xiang Rong reported victories and occupation of Bell Mountain.",
  ],
  s0339: [
    "The Emperor praised him highly.",
    "The Emperor gave him high praise.",
  ],
  s0340: [
    "Yijing and Tuoming'a were ordered to Qingjiang for defense and suppression.",
    "Yijing and Tuoming'a were sent to Qingjiang to fight.",
  ],
  s0341: [
    "Ruichang was ordered to lead Mukden troops to Huai and Xu for joint defense; Enhua to lead Jilin troops garrisoning Zhili.",
    "Ruichang took Mukden troops to Huai-Xu and Enhua garrisoned Zhili with Jilin troops.",
  ],
  s0342: [
    "On day xinwei, an edict ordered Guangdong to recruit red-banner ships and select officers to take them south against rebels.",
    "On xinwei, Guangdong was told to recruit red-banner ships for Jiangnan.",
  ],
  s0343: [
    "Fu Ji was made grain transport governor-general.",
    "Fu Ji became grain transport governor-general.",
  ],
  s0344: [
    "Summer, fourth month, day gengchen: the sun showed a black halo.",
    "In month 4, gengchen, a black halo appeared around the sun.",
  ],
  s0345: [
    "On day jichou, rebels took Pukou and Chuzhou.",
    "On jichou, rebels took Pukou and Chuzhou.",
  ],
  s0346: [
    "On day jiawu, Qishan was ordered to command all armies north of the Yangzi.",
    "On jiawu, Qishan took overall command north of the Yangzi.",
  ],
  s0347: [
    "Yang Wending was arrested and tried.",
    "Yang Wending was arrested.",
  ],
  s0348: [
    "The Jebtsundamba Lama of Khalkha Mongolia at Urga presented three thousand horses, and a league chief of Xilin presented horses; warm edicts declined both.",
    "Urga's Jebtsundamba and a Xilin chief offered horses; both gifts were declined.",
  ],
  s0349: [
    "On day jihai, Sun Rujin and 221 others were granted jinshi degrees with differentiated ranks.",
    "On jihai, Sun Rujin and 221 others received jinshi ranks.",
  ],
  s0350: [
    "On day guimao, rebels took Fengyang.",
    "On guimao, rebels took Fengyang.",
  ],
  s0351: [
    "Anhui Nian bandits raided Mengcheng.",
    "Nian bandits raided Mengcheng in Anhui.",
  ],
  s0352: [
    "Fifth month, day wushen: silver banknotes were first issued.",
    "In month 5, wushen, silver notes were first issued.",
  ],
  s0353: [
    "On day renzi, Wang Yide reported that Haicheng secret-society rebels had taken Tong'an, Anxi, and Xiamen; they were sternly ordered to suppress them.",
    "On renzi, Wang Yide reported Haicheng rebels had taken Tong'an, Anxi, and Xiamen and was ordered to act.",
  ],
  s0354: [
    "Zhou Tianjue reported recovery of Fengyang.",
    "Zhou Tianjue reported Fengyang recovered.",
  ],
  s0355: [
    "On day guichou, Li Jiaduan reported rebel boats on the Jinling river driving upstream.",
    "On guichou, Li Jiaduan reported Jinling rebel boats moving upstream.",
  ],
  s0356: [
    "Receiving the rescript: this differed from Xiang Rong's memorial; they were ordered to investigate exactly.",
    "The throne noted a conflict with Xiang Rong's report and ordered a thorough inquiry.",
  ],
  s0357: [
    "Luo Bingzhang reported that bandit chief Liu Hongyi of Shangyou County, Jiangxi, had gathered a crowd and was harassing Guizhou, adjoining Guangdong and Hunan.",
    "Luo Bingzhang reported Liu Hongyi of Jiangxi Shangyou raiding toward Guangdong and Hunan.",
  ],
  s0358: [
    "Receiving the rescript: the three provinces were to suppress jointly.",
    "The three provinces were ordered to suppress together.",
  ],
  s0359: [
    "On day bingchen, Lu Yinggu reported Bozhou lost and rebels pressing on Bianliang.",
    "On bingchen, Lu Yinggu reported Bozhou fallen and rebels nearing Kaifeng.",
  ],
  s0360: [
    "An edict ordered Jiang Zhongyuan to hurry to Henan to suppress rebels.",
    "Jiang Zhongyuan was ordered to rush to Henan against the rebels.",
  ],
  s0361: [
    "Wang Yide reported that the Zhenzhou commander and intendant had been killed by rebels and Yong'an and Shaxian had fallen in succession.",
    "Wang Yide reported Zhenzhou officials killed and Yong'an and Shaxian lost.",
  ],
  s0362: [
    "On day dingsi, Sheng Bao was ordered to lead troops urgently to Henan.",
    "On dingsi, Sheng Bao was rushed to Henan with troops.",
  ],
  s0363: [
    "On day wuwu, Saishanga and Xu Guangjin were released from prison to redeem themselves in the army; Yang Dianbang and Dan Minglun remained at Qingjiangpu for defense.",
    "On wuwu, Saishanga and Xu Guangjin were freed to serve; Yang Dianbang and Dan Minglun stayed at Qingjiangpu.",
  ],
  s0364: [
    "Zhou Tianjue reported escaped Fengyang bandits raiding westward and that he set out the same day to relieve them.",
    "Zhou Tianjue reported Fengyang fugitives raiding west and went to relieve at once.",
  ],
  s0365: [
    "Receiving the rescript: \"Zhou Tianjue is known as brave and recommended Zang Shuying's trained militia as fit to hold a front alone—can he alone not fight the rebels to the death?",
    "The throne asked whether the brave Zhou Tianjue, who praised Zang Shuying's militia, would not fight to the death.",
  ],
  s0366: [
    "\" Lu Yinggu and Enhua reported raiding rebels had forced a crossing on the Cao River and invaded Shandong.",
    "Lu Yinggu and Enhua reported rebels had crossed the Cao River into Shandong.",
  ],
  s0367: [
    "Receiving the rescript, Shaanxi troops were shifted to aid while still holding the Tong Pass gateway firm.",
    "Shaanxi troops were sent to help but told to keep Tong Pass secure.",
  ],
  s0368: [
    "Rebels took Guide.",
    "Rebels took Guide.",
  ],
  s0369: [
    "On day jiwei, rebels again took Anqing.",
    "On jiwei, rebels retook Anqing.",
  ],
  s0370: [
    "An edict ordered Jiang Zhongyuan to defend Jiujiang.",
    "Jiang Zhongyuan was ordered to hold Jiujiang.",
  ],
  s0371: [
    "Mongol troops and the five thousand horses they presented were summoned to assemble at Rehe.",
    "Mongol troops and five thousand tribute horses were gathered at Rehe.",
  ],
  s0372: [
    "On day renxu, an edict: as rebels drove north, northern gentry and people were urged to train militia for self-defense; those who killed rebels with merit would be rewarded.",
    "On renxu, northern communities were urged to train militia and win merit for killing rebels.",
  ],
  s0373: [
    "Sengge Rinchen, Huashana, Dahonga, and Muyin were ordered to supervise capital patrol defense.",
    "Sengge Rinchen, Huashana, Dahonga, and Muyin took charge of Beijing patrols.",
  ],
  s0374: [
    "On day guihai, Xu Naipu was made Minister of Punishments and Weng Xincun Minister of Works.",
    "On guihai, Xu Naipu took Punishments and Weng Xincun Works.",
  ],
  s0375: [
    "On day jiazi, because Henan soldiers and people had held the provincial city firm, an edict of warm praise was issued.",
    "On jiazi, Henan's defense of the provincial city was warmly praised.",
  ],
  s0376: [
    "On day dingmao, Ne'erjing'e was ordered to defend north of the river.",
    "On dingmao, Ne'erjing'e was sent to defend the north bank.",
  ],
  s0377: [
    "Gui Liang went to Baoding to organize defense.",
    "Gui Liang went to Baoding for defense.",
  ],
  s0378: [
    "On day jisi, Kaifeng's alarm was lifted; rebels drove south through Zhongmou and Zhuxian Town; Tuoming'a and others were ordered to pursue.",
    "On jisi, Kaifeng was relieved; rebels fled south and Tuoming'a was told to pursue.",
  ],
  s0379: [
    "On day xinwei, ten-cash coins were first cast.",
    "On xinwei, ten-cash coins were first minted.",
  ],
  s0380: [
    "Sixth month, day yihai: Fujian gentry and merchants recovered Zhangzhou; an edict of warm praise ordered investigation and rewards.",
    "In month 6, yihai, Fujian gentry recovered Zhangzhou and were told to be rewarded after inquiry.",
  ],
  s0381: [
    "On day wuyin, Henan rebels attacked Sishui and a detachment crossed the river and took Wen County.",
    "On wuyin, Henan rebels hit Sishui and a column took Wen County.",
  ],
  s0382: [
    "Tuoming'a attacked them and recovered Sishui.",
    "Tuoming'a beat them and retook Sishui.",
  ],
  s0383: [
    "On day jimao, Jinling rebel boats downstream took Nankang and pressed on Nanchang.",
    "On jimao, Jinling rebel boats took Nankang and besieged Nanchang.",
  ],
  s0384: [
    "On day xinsi, Wen County gentry and militia defeated rebels and recovered the city; together with government troops they defeated rebels at Wuzhi.",
    "On xinsi, Wen gentry recovered their city and with the army beat rebels at Wuzhi.",
  ],
  s0385: [
    "Ne'erjing'e was made Imperial Commissioner to supervise military affairs in Henan and Hebei, with Enhua and Tuoming'a as deputies.",
    "Ne'erjing'e became Imperial Commissioner for Henan and Hebei; Enhua and Tuoming'a assisted.",
  ],
  s0386: [
    "The Yellow River burst again north of Feng.",
    "The Yellow River broke again north of Feng.",
  ],
  s0387: [
    "On day jiashen, Hui rebels rose in Dongchuan, Yunnan.",
    "On jiashen, Dongchuan Hui rebels rose in Yunnan.",
  ],
  s0388: [
    "Bandits rose in Taiwan, Fujian.",
    "Fujian Taiwan bandits rose.",
  ],
  s0389: [
    "On day wuzi, an American envoy asked to be received in audience; an edict forbade it.",
    "On wuzi, an American audience was requested and refused.",
  ],
  s0390: [
    "Henan rebels besieged Huaiqing.",
    "Henan rebels besieged Huaiqing.",
  ],
  s0391: [
    "Government troops relieved the siege of Xuzhou; rebels fled to Luoshan.",
    "The army relieved Xuzhou and rebels fled to Luoshan.",
  ],
  s0392: [
    "Fujian government troops recovered Yong'an and Shaxian.",
    "Fujian troops recovered Yong'an and Shaxian.",
  ],
  s0393: [
    "Tuoming'a and others defeated rebels at Huaiqing.",
    "Tuoming'a and others beat rebels at Huaiqing.",
  ],
  s0394: [
    "On day yiwei, government troops were defeated at Zhenjiang; Regional Commander Deng Shaoliang was stripped of office and Hechun acted as Jiangnan regional commander.",
    "On yiwei, Zhenjiang troops were beaten; Deng Shaoliang was dismissed and Hechun acted in Jiangnan.",
  ],
  s0395: [
    "On day wuxu, generous relief was granted in silver and hereditary office to fallen Regional Commander Shuang Lai of the Yangzhou assault.",
    "On wuxu, Shuang Lai of Yangzhou received posthumous silver and a hereditary post.",
  ],
  s0396: [
    "Bandits rose in Quanzhou, Guangxi.",
    "Guangxi Quanzhou bandits rose.",
  ],
  s0397: [
    "Autumn, seventh month, day jiachen (new moon): Guangxi bandits took Xing'an and Lingchuan and divided to strike Guilin; government troops defeated them and recovered Lingchuan and Xing'an.",
    "Month 7, jiachen new moon: Guangxi bandits took Xing'an and Lingchuan; troops beat them back.",
  ],
  s0398: [
    "On day bingwu, Huicheng was ordered back to Qingjiangpu for defense and suppression.",
    "On bingwu, Huicheng returned to Qingjiangpu to fight.",
  ],
  s0399: [
    "On day dingwei, Sheng Bao was ordered to assist in Henan military affairs.",
    "On dingwei, Sheng Bao was ordered to help in Henan.",
  ],
  s0400: [
    "On day bingchen, southeastern river officials were ordered to withdraw ferry boats to prevent rebel crossings.",
    "On bingchen, southeast river officials were told to pull ferries to block rebel crossings.",
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b04.mjs <translation.json>'
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
