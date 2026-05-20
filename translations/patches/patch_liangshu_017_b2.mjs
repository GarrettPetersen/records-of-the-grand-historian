#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'His family had long dwelt at Hengsang; some say he was a man of Hengsang.',
    'His family had long lived at Hengsang; some say he was native there.',
  ],
  s0102: [
    'From youth he had daring and spirit.',
    'From youth he had courage and spirit.',
  ],
  s0103: [
    'At first he served Jing prefecture Chief of Staff Yuan Lisheng.',
    'He first served Jing prefecture chief of staff Yuan Lisheng.',
  ],
  s0104: [
    'Lisheng was given to drink; he was harsh toward subordinates and did not treat Qi with much courtesy.',
    'Lisheng drank heavily and was harsh to subordinates; he showed Qi little courtesy.',
  ],
  s0105: [
    'When Lisheng left office and returned home, Zhang Ji of Wu commandery became Jing prefecture Chief of Staff; Qi again followed him. Ji knew and valued him deeply, taking him as a trusted confidant—even household trifles were all entrusted to him.',
    'When Lisheng left office, Zhang Ji of Wu became Jing chief of staff; Qi followed him again. Ji deeply trusted him as a confidant and even entrusted household matters to him.',
  ],
  s0106: [
    'Qi served Ji with his whole heart and shirked nothing.',
    'Qi served Ji wholeheartedly and shrank from nothing.',
  ],
  s0107: [
    'He followed Ji back to the capital.',
    'He followed Ji back to the capital.',
  ],
  s0108: [
    'When Ji was made South Yanzhou inspector, Qi was also promoted to Military Participation Officer on the prefecture staff and for the first time was entrusted with military affairs.',
    'When Ji took South Yanzhou, Qi was promoted to military participation officer on the staff and first put in charge of troops.',
  ],
  s0109: [
    'In the Yongyuan era of Qi, the Righteous Army rose; Donghun summoned Ji back, made him Area Commander of all palace-city military affairs, and had him reside in the Masters of Writing complex.',
    'In Qi Yongyuan, the righteous army rose; Donghun recalled Ji, made him commander of palace-city forces, and lodged him in the Masters of Writing complex.',
  ],
  s0110: [
    'When the righteous army arrived, the siege around them grew pressing; Qi went daily to Wang Zhenguo and secretly settled plans with him.',
    'As the righteous army drew near and the ring tightened, Qi visited Wang Zhenguo daily and secretly fixed their plan.',
  ],
  s0111: [
    'Once the plan was set, at night he led Zhenguo to Ji to join in deliberation knee to knee; Qi himself held the candle to complete the plot.',
    'When the plan was set, at night he brought Zhenguo to Ji for a knee-to-knee counsel; Qi himself held the candle while they plotted.',
  ],
  s0112: [
    'At dawn the next day, together with Ji and Zhenguo, he seized Donghun in the inner hall; Qi himself struck him dead with his blade.',
    'At dawn he, Ji, and Zhenguo seized Donghun in the inner hall; Qi himself killed him with his blade.',
  ],
  s0113: [
    'The next year Gaozu received the abdication; Qi was enfeoffed as Marquis of Anchang county in Qi with a fief of five hundred households, and remained Pacification North General and Administrator of Liyang.',
    'Next year Gaozu took the throne; Qi was made Marquis of Anchang with five hundred households, retaining pacification north general and Liyang administrator.',
  ],
  s0114: [
    'Qi did not know writing by hand and could not read characters by sight, yet in his commandery he had pure governance and handled official business very well.',
    'Qi could neither write nor read, yet in office he ruled cleanly and managed affairs diligently.',
  ],
  s0115: [
    'In the second year of Tianjian he was recalled and made Tiger-Fang Central Corps General.',
    'In Tianjian year two he returned as tiger-fang central corps general.',
  ],
  s0116: [
    'Before he took the appointment he was transferred to Administrator of Tianmen, his Pacification North General title remaining as before.',
    'Before taking post he was made Tianmen administrator, keeping pacification north general.',
  ],
  s0117: [
    'In the fourth year, Wei general Wang Zu invaded Ba and Shu; Gaozu made Qi Assists-the-State General to rescue Shu.',
    'In year four Wei general Wang Zu invaded Ba and Shu; Gaozu made Qi assists-the-state general to relieve Shu.',
  ],
  s0118: [
    'Before he arrived, Zu withdrew; Qi advanced to garrison Nan\'an.',
    'Before he arrived Zu had withdrawn; Qi advanced to hold Nan\'an.',
  ],
  s0119: [
    'In autumn of the seventh year Qi was ordered to set up two garrisons at Dajian and Hanzong; the army returned to Yizhou.',
    'In autumn of year seven he set garrisons at Dajian and Hanzong, then returned the army to Yizhou.',
  ],
  s0120: [
    'That year he was transferred to Martial Array General and Administrator of Baxi, and soon was additionally made Pacifies-the-Distance General.',
    'That year he became martial array general and Baxi administrator, soon with added pacifies-the-distance general.',
  ],
  s0121: [
    'In the tenth year, a man of the commandery, Yao Jinghe, gathered Man tribes of Yan and cut the river road, breaking Jinjing.',
    'In year ten Yao Jinghe of the commandery rallied Man of Yan, cut the river route, and stormed Jinjing.',
  ],
  s0122: [
    'Qi attacked Jinghe at Pingchang and defeated him.',
    'Qi attacked Jinghe at Pingchang and broke him.',
  ],
  s0123: [
    'Earlier Nanzheng had fallen to Wei; then South Liang province was established west of Yizhou.',
    'Earlier Nanzheng had fallen to Wei, so South Liang province was set up west of Yizhou.',
  ],
  s0124: [
    'The provincial seat was newly founded and depended wholly on Yizhou for supplies.',
    'The new provincial seat depended wholly on Yizhou for supplies.',
  ],
  s0125: [
    'Qi reported righteous tribute levies from Yi and Liao, obtaining two hundred thousand hu of rice.',
    'Qi reported righteous tribute from the Yi and Liao, gaining two hundred thousand hu of rice.',
  ],
  s0126: [
    'He also set up relay stations and opened smelting and casting to supply South Liang.',
    'He also set relays and opened foundries to sustain South Liang.',
  ],
  s0127: [
    'In the eleventh year he was advanced to Acting Credentials and Area Commander of all Yizhou outer-water forces.',
    'In year eleven he gained acting credentials and command of Yizhou outer-water forces.',
  ],
  s0128: [
    'In the twelfth year, Wei general Fu Shuyan invaded Nan\'an; Qi led the host to resist him, and Shuyan withdrew.',
    'In year twelve Wei general Fu Shuyan attacked Nan\'an; Qi resisted and Shuyan withdrew.',
  ],
  s0129: [
    'In the fourteenth year he was transferred to Trusted Martial General and Administrator of the two commanderies Baxi and Zitong.',
    'In year fourteen he became trusted martial general and administrator of Baxi and Zitong.',
  ],
  s0130: [
    'That year, Ren Lingzong of Jiameng, because the masses resented Wei, killed the Wei Administrator of Jinshou and offered the city in submission.',
    'That year Ren Lingzong of Jiameng, as the people resented Wei, killed the Wei Jinshou administrator and surrendered the city.',
  ],
  s0131: [
    'Yizhou Inspector the Prince of Poyang sent Qi to command thirty thousand men, supervising South Liang Chief Clerk Xi Zongfan and all armies to welcome Lingzong.',
    'The prince of Poyang as Yizhou inspector sent Qi with thirty thousand men, overseeing chief clerk Xi Zongfan and others to welcome Lingzong.',
  ],
  s0132: [
    'In the fifteenth year, Wei East Yizhou Inspector Yuan Faseng sent his son Jinglong to resist Qi\'s army; Nan\'an Administrator Huangfu Chen and Zongfan counterattacked, smashing the Wei host at Jiameng, slaughtering more than ten cities; Wei generals Qiu Tu, Wang Mu, and others all surrendered.',
    'In year fifteen Wei east Yizhou inspector Yuan Faseng sent his son Jinglong against Qi; Nan\'an administrator Huangfu Chen and Zongfan counterattacked, crushing the Wei army at Jiameng, sacking more than ten cities; Wei generals Qiu Tu and Wang Mu among others surrendered.',
  ],
  s0133: [
    'But Wei increased Fu Shuyan\'s troops and came again to resist; Qi\'s army was few and met with ill fortune, the army drew back, and so Jiameng again fell to Wei.',
    'Wei reinforced Fu Shuyan and fought again; with too few men Qi fared ill and withdrew, and Jiameng fell back to Wei.',
  ],
  s0134: [
    'Qi spent years in the Yi region, attacking and striking Man and Liao; he himself had no peaceful year.',
    'Qi spent years in the Yi lands campaigning against Man and Liao; he had no peaceful year.',
  ],
  s0135: [
    'When he dwelt in the army he could personally share toil and hardship and suffer the same labor and pain as the soldiers.',
    'In camp he shared labor and hardship with the troops.',
  ],
  s0136: [
    'He himself drew the plans for encampments and fortifications, all laid out for convenience in detail; he allocated clothing, grain, and supplies so that no man lacked what he needed.',
    'He sketched encampments and walls to suit every need and rationed clothing and grain so none wanted for anything.',
  ],
  s0137: [
    'Once he had won men\'s hearts, even Man and Liao did not dare offend him; thus his martial renown spread through Yong and Shu.',
    'Men attached to him and even Man and Liao dared not offend him; his fame ran through Yong and Shu.',
  ],
  s0138: [
    'Baxi commandery occupied half of Yizhou and also lay on the vital eastern route; when inspectors passed through, army offices made long forays and many were impoverished.',
    'Baxi held half of Yizhou and lay on the vital eastern route; passing inspectors and distant army offices left many destitute.',
  ],
  s0139: [
    'Along the road Qi gathered food stores and planted vegetables; all travelers could draw their needs there.',
    'Along the route Qi stockpiled grain and planted vegetables so travelers could be supplied.',
  ],
  s0140: [
    'His ability to provide and complete matters was largely of this kind.',
    'His knack for getting things done was mostly of this kind.',
  ],
  s0141: [
    'In the seventeenth year he was transferred to Bearer of Credentials, Area Commander of all South Liangzhou military affairs, Sagacious Martial General, and South Liangzhou Inspector.',
    'In year seventeen he became bearer of credentials, area commander of South Liang, sagacious martial general, and South Liang inspector.',
  ],
  s0142: [
    'In the fourth year of Putong he was transferred to Trusted Martial General, Chief Clerk to the Prince of Poyang in the Western Campaign, and Administrator of the two commanderies Xinxing and Yongning.',
    'In Putong year four he became trusted martial general, western campaign staff officer to the prince of Poyang, and administrator of Xinxing and Yongning.',
  ],
  s0143: [
    'Before he set out he died, aged sixty-seven.',
    'Before departing he died, aged sixty-seven.',
  ],
  s0144: [
    'Posthumously he was made Regular Attendant Cavalier Attendant-in-Ordinary and Right Palace Guard General.',
    'Posthumously he was made regular attendant cavalier attendant-in-ordinary and right palace guard general.',
  ],
  s0145: [
    'Funeral bounty: one hundred thousand cash and one hundred bolts of cloth.',
    'Funeral bounty was one hundred thousand cash and one hundred bolts of cloth.',
  ],
  s0146: [
    'His posthumous title was Zhuang.',
    'He was posthumously titled Zhuang (Stalwart).',
  ],
  s0147: [
    'Chen Minister of Personnel Yao Cha said: Wang Zhenguo, Shen Gou, Xu Yuanyu, and Li Jushi—at the end of Qi all were ranked generals holding strong armies; some bound themselves and begged mercy, some cut the passes and presented victory;',
    'Chen minister of personnel Yao Cha said: Wang Zhenguo, Shen Gou, Xu Yuanyu, and Li Jushi—at the end of Qi all were ranked generals with strong armies; some bound themselves and pleaded guilt, some cut the passes and offered victory;',
  ],
  s0148: [
    'Those who could submit later were only Ma Xianpin.',
    'Only Ma Xianpin could submit afterward.',
  ],
  s0149: [
    'How constant are benevolence and righteousness? Tread them and one becomes a gentleman—truly so!',
    'Benevolence and righteousness are not fixed—tread them and one becomes a gentleman. Truly!',
  ],
  s0150: [
    'As for when they faced the frontier and comforted the masses, even Li Mu could add nothing more.',
    'When they guarded the border and led the troops, even Li Mu could not surpass them.',
  ],
  s0151: [
    'Zhang Qi\'s administrative achievements also had their differences.',
    'Zhang Qi\'s achievements in office were distinctive as well.',
  ],
  s0152: [
    'Gou, Yuanyu, and Jushi had few deeds recorded after entering Liang, so biographies were not written for them.',
    'Gou, Yuanyu, and Jushi left little record after entering Liang, so no biographies were written for them.',
  ],
  s0153: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0154: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_017_b2.mjs <translation.json>'
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
