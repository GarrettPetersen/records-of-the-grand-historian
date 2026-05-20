#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 19, Biographies 13',
    'Book of Liang, Volume 19, Biographies 13',
  ],
  s0002: [
    'Zong Guai; Liu Tan; Yue Ai',
    'Zong Guai; Liu Tan; Yue Ai',
  ],
  s0003: [
    'Zong Guai, styled Mingyang, was a native of Nieyang in Nanyang; his family had long dwelt in Jiangling.',
    'Zong Guai, styled Mingyang, came from Nieyang in Nanyang; his line had long lived in Jiangling.',
  ],
  s0004: [
    'His grandfather Bing, in Song times summoned as crown prince attendant but did not accept, had a lofty name.',
    'His grandfather Bing, summoned in Song as crown prince attendant but never took the post, was widely esteemed.',
  ],
  s0005: [
    'His father Fan was a staff adviser to the western army commander.',
    'His father Fan served as staff adviser to the western army commander.',
  ],
  s0006: [
    'Guai from youth studied hard and had breadth and backbone.',
    'From youth Guai studied hard and showed both breadth and backbone.',
  ],
  s0007: [
    'At his capping he was recommended as Yingzhou\'s outstanding talent and served as attendant to the Prince of Linchuan, then as staff officer on the chief of staff\'s staff.',
    'At his capping he was named Yingzhou\'s outstanding talent, then served the Prince of Linchuan and the chief of staff\'s staff.',
  ],
  s0008: [
    'In Yongming, the Prince of Jingling of Qi gathered scholars at the Western Lodge and had them painted; Guai was among them.',
    'In Yongming the Prince of Jingling gathered scholars at the Western Lodge and had them painted; Guai was there.',
  ],
  s0009: [
    'In Yongming, when peace was made with Wei, an edict had Guai and Palace Director Ren Fang receive the Wei envoys together—both were men of the moment.',
    'When Qi made peace with Wei in Yongming, Guai and Palace Director Ren Fang were chosen to receive the Wei envoys—both were men of the hour.',
  ],
  s0010: [
    'The Emperor\'s eldest grandson, Prince of Nan commandery, dwelt at the Western Lodge; Guai was put in charge of his secretariat.',
    'The Emperor\'s eldest grandson, Prince of Nan commandery, held the Western Lodge; Guai ran his secretariat.',
  ],
  s0011: [
    'Because his brushwork won notice and his uprightness won trust, he was entrusted with the post.',
    'His writing won notice and his rectitude trust, so he kept the post.',
  ],
  s0012: [
    'Before long Crown Prince Wenhuai died; the prince became heir apparent; Guai still managed the secretariat.',
    'Soon Crown Prince Wenhuai died and the prince became heir apparent; Guai still kept the secretariat.',
  ],
  s0013: [
    'When the heir took the throne he lost his way in many things; Guai drew somewhat apart, was made Moling magistrate, and was promoted to Director of Punishments in the Masters of Writing.',
    'When the heir took the throne his conduct slipped; Guai kept his distance, became Moling magistrate, then Director of Punishments.',
  ],
  s0014: [
    'Guai\'s cousin Yue had a famed conduct; the district praised him and ranked him above Guai.',
    'His cousin Yue was famed for conduct; the district praised him above Guai.',
  ],
  s0015: [
    'In office he rose through Director of the Arsenal in the Masters of Writing, Yingzhou chief clerk, and recorder on the northern army commander\'s staff.',
    'He rose through Director of the Arsenal, Yingzhou chief clerk, and recorder on the northern army staff.',
  ],
  s0016: [
    'Liu Tan, styled Dedu, was a native of Anzhong in Nanyang, seventh-generation descendant of Jin\'s general who guarded the east, Liu Qiao.',
    'Liu Tan, styled Dedu, came from Anzhong in Nanyang, seventh in descent from Jin\'s eastern guardian Liu Qiao.',
  ],
  s0017: [
    'From youth Tan was known to his elder cousin Jiao.',
    'From youth his elder cousin Jiao knew him.',
  ],
  s0018: [
    'At the start of Jianyuan in Qi he was attendant to the Prince of Nan commandery; soon he supplemented as magistrate of Chanling, was promoted to recorder on the southern army staff, and where he served was praised for capable administration.',
    'At Qi\'s Jianyuan opening he attended the Prince of Nan commandery, soon became Chanling magistrate, then southern army recorder, famed everywhere for capable rule.',
  ],
  s0019: [
    'When the Prince of Nankang was inspector of Jingzhou, Tan was middle army staff officer on the western staff, leading the long current.',
    'When the Prince of Nankang held Jingzhou, Tan was western staff middle army officer, leading the long current.',
  ],
  s0020: [
    'When the Righteous Army rose, he was promoted staff adviser.',
    'When the Righteous Army rose, he became staff adviser.',
  ],
  s0021: [
    'At the time supporting-the-state general Yang Gongze was inspector of Xiangzhou and led troops to Xia mouth; the western court debated who should act as inspector; Tan told the assembly: "The temper of Xiang country is easy to stir and hard to trust.',
    'Supporting-the-state general Yang Gongze was Xiangzhou inspector, marching to Xia mouth; the western court debated who should run the province; Tan said, "Xiang country is quick to stir and slow to trust.',
  ],
  s0022: [
    'If you rely on warriors alone, the people will fear plunder;',
    'Send only warriors and the people fear plunder;',
  ],
  s0023: [
    'if you send men of letters alone, authority and strategy will not hold.',
    'send only men of letters and authority will not hold.',
  ],
  s0024: [
    'If you truly wish to quiet a whole province, feed army and people alike, none surpasses this old servant.',
    'To quiet the province and feed army and people, none surpasses this old servant.',
  ],
  s0025: [
    'In the campaign against the Xianlian—I dare claim that for myself."',
    'In the Xianlian campaign—I dare answer for that."',
  ],
  s0026: [
    'They followed his counsel.',
    'They took his counsel.',
  ],
  s0027: [
    'He was made chief of staff to the supporting-the-state army, grand administrator of Changsha, and acting inspector of Xiangzhou.',
    'He was made supporting-the-state chief of staff, Changsha grand administrator, and acting Xiangzhou inspector.',
  ],
  s0028: [
    'Tan had once served in Xiangzhou and had many old ties; a great crowd came to meet him on the road.',
    'He had served in Xiang before and held many ties; crowds met him on the road.',
  ],
  s0029: [
    'On taking office he chose able clerks and sent them to the ten commanderies, mustered laborers everywhere, and moved more than three hundred thousand hu of tax grain to the Righteous Army so supplies held.',
    'He chose able clerks for ten commanderies, mustered labor, and forwarded three hundred thousand hu of tax grain to the Righteous Army.',
  ],
  s0030: [
    'At the time Donghun sent Ancheng grand administrator Liu Xizu to defeat the western court\'s chosen grand administrator Fan Senjian at Pingdu; Xizu issued a proclamation across Xiang, and then Shixing interior governor Wang Sengru answered him.',
    'Donghun\'s Liu Xizu defeated the western court\'s Fan Senjian at Pingdu and issued a call across Xiang; Shixing interior governor Wang Sengru answered.',
  ],
  s0031: [
    'Shaoling men drove out their interior governor Chu Zhan; Yongyang men Zhou Hui raised troops and attacked Shian commandery—all answered Sengru.',
    'Shaoling drove out Chu Zhan; Yongyang\'s Zhou Hui attacked Shian—all joined Sengru.',
  ],
  s0032: [
    'Guiyang men Shao Tanlong and Deng Daojie, settling private scores, also joined the league.',
    'Guiyang\'s Shao Tanlong and Deng Daojie, settling private scores, joined as well.',
  ],
  s0033: [
    'Sengru styled himself pacifying-the-west general and inspector of Xiangzhou, made Yongyang man Zhou Shu his strategist, and camped at Jianning.',
    'Sengru called himself pacifying-the-west general and Xiangzhou inspector, set Zhou Shu of Yongyang as strategist, and camped at Jianning.',
  ],
  s0034: [
    'From then on commanderies across Xiang rose like hornets;',
    'Then every Xiang commandery rose;',
  ],
  s0035: [
    'only Linxiang, Xiangyin, Liuyang, and Luo four counties still held whole.',
    'only Linxiang, Xiangyin, Liuyang, and Luo still stood intact.',
  ],
  s0036: [
    'The people of the province all wished to flee by boat; Tan gathered every vessel and burned them, sent the general Yin Falüe to hold off Sengru, and the two sides locked in stalemate.',
    'The province meant to flee by boat; Tan burned the fleet, sent Yin Falüe against Sengru, and stalemate followed.',
  ],
  s0037: [
    'Former Xiangzhou garrison commander Zhong Xuanshao secretly plotted to join Sengru, mustering several hundred gentry and commoners by linked names to a fixed day for a rising in the provincial city.',
    'Former garrison commander Zhong Xuanshao plotted for Sengru, binding hundreds of gentry to rise on a set day.',
  ],
  s0038: [
    'Tan heard the plot but feigned ignorance, heard lawsuits into the night, and left the gates unclosed to sow doubt.',
    'Tan heard but played ignorant, heard suits till night, and left the gates open to breed doubt.',
  ],
  s0039: [
    'Xuanshao had not yet moved; at dawn he came to Tan to ask why.',
    'Before Xuanshao moved, at dawn he came to ask why.',
  ],
  s0040: [
    'Tan kept him long in talk and secretly sent trusted soldiers to seize his household papers.',
    'Tan detained him in talk and sent soldiers to seize his papers.',
  ],
  s0041: [
    'Xuanshao had not yet risen from his seat when the soldiers reported they had the documents entire; Xuanshao confessed at once and was beheaded where he sat.',
    'Still seated, Xuanshao learned the papers were taken; he confessed and was beheaded on the spot.',
  ],
  s0042: [
    'The papers were burned; the rest of the party were not questioned; the crowd felt shame and yielded, and the province was quiet.',
    'The papers burned; the rest went untouched; shame and submission followed, and the province calmed.',
  ],
  s0043: [
    'Falüe and Sengru locked horns for months; when Jiankang fell, Gongze returned to the province and the rebels at last scattered.',
    'Falüe and Sengru fought for months; Jiankang fell, Gongze returned, and the rebels scattered.',
  ],
  s0044: [
    'At the start of Tianjian, for merit he was enfeoffed Baron of Lipu with three hundred households.',
    'At Tianjian\'s opening he was baron of Lipu with three hundred households.',
  ],
  s0045: [
    'He was promoted to western army marshal and grand administrator of Xinxing.',
    'He became western army marshal and Xinxing grand administrator.',
  ],
  s0046: [
    'In Tianjian year three he was promoted western army chief of staff and died, aged sixty-two.',
    'In Tianjian year three he was western army chief of staff and died at sixty-two.',
  ],
  s0047: [
    'His son Quan succeeded.',
    'His son Quan succeeded.',
  ],
  s0048: [
    'Yue Ai, styled Weiyuan, was a native of Yuyang in Nanyang, sixth-generation descendant of Jin\'s Director of the Masters of Writing Guang, his family long in Jiangling.',
    'Yue Ai, styled Weiyuan, came from Yuyang in Nanyang, sixth from Jin\'s Director Guang; his line lived in Jiangling.',
  ],
  s0049: [
    'His uncle, Jingzhou inspector Zong Que, once set out vessels and tested his nephews.',
    'His uncle Zong Que, Jingzhou inspector, once set out vessels to test his nephews.',
  ],
  s0050: [
    'Ai was still young but took only books; Que marveled at that.',
    'Ai was young but chose only books; Que marveled.',
  ],
  s0051: [
    'He also gave each a scroll of histories and had them read and recite what they remembered.',
    'He gave each a history scroll, had them read, then recite from memory.',
  ],
  s0052: [
    'Ai skimmed and named every point; Que prized him still more.',
    'Ai skimmed and named every point; Que prized him more.',
  ],
  s0053: [
    'Song\'s Prince of Pingyang Jingsu was inspector of Jingzhou and summoned him as chief clerk.',
    'Song\'s Prince of Pingyang, inspector of Jingzhou, made him chief clerk.',
  ],
  s0054: [
    'When Jingsu held southern Xuzhou, Ai again served as staff officer on the northern punitive staff, then was promoted magistrate of Longyang.',
    'When Jingsu held southern Xuzhou, Ai served on the northern punitive staff, then became Longyang magistrate.',
  ],
  s0055: [
    'He left office for his father\'s mourning; officials and people went to the province to ask him back, and after the burial he took up the post again.',
    'His father\'s mourning took him away; officials and people begged the province to recall him, and after burial he returned.',
  ],
  s0056: [
    'At the time Qi\'s Prince of Yuzhang Diao was grand administrator of Wuling and greatly prized Ai\'s governance; when Diao became Jingzhou inspector, he made Ai staff officer on the chief of staff\'s staff and head clerk of the province, sharing in provincial affairs.',
    'Qi\'s Prince of Yuzhang Diao, Wuling grand administrator, prized his rule; as Jingzhou inspector Diao made Ai chief-of-staff staff officer and head clerk, sharing provincial affairs.',
  ],
  s0057: [
    'Diao once asked him about local custom, old ways, city walls and foundations, temples, and mountain passes—Ai answered each question on the spot as if reading from a gazetteer, and Diao esteemed him the more.',
    'Diao asked about custom, walls, temples, and passes; Ai answered as from a map, and Diao esteemed him more.',
  ],
  s0058: [
    'Provincial men envied him; some slandered him, saying his office gate was like a market; Diao sent men to watch and found Ai behind closed doors reading.',
    'Envious men said his gate was a market; Diao watched and found him reading behind closed doors.',
  ],
  s0059: [
    'When Diao returned to the capital, Ai was made staff officer on the Grand Marshal\'s punitive staff, in charge of the secretariat, then magistrate of Zhijiang.',
    'Diao returned to court; Ai became Grand Marshal punitive staff officer, ran the secretariat, then Zhijiang magistrate.',
  ],
  s0060: [
    'On return he was middle army staff officer to the Grand Marshal, then acting recorder.',
    'He returned as Grand Marshal middle army officer, then acting recorder.',
  ],
  s0061: [
    'In Yongming year eight the Prince of Badong Zixiang raised troops in rebellion; when he was defeated he burned the government offices and every document in the bureaus was lost at once.',
    'In Yongming year eight Prince Zixiang of Badong rebelled; defeated, he burned the offices and every record was lost.',
  ],
  s0062: [
    'The Emperor summoned Ai and asked about western affairs; Ai answered in full detail and the Emperor was pleased.',
    'The Emperor summoned him, asked about the west; his answers pleased the throne.',
  ],
  s0063: [
    'He was made Jingzhou chief clerk with orders to restore the provincial seat.',
    'He was made Jingzhou chief clerk and ordered to rebuild the seat.',
  ],
  s0064: [
    'Ai returned to the province, repaired several hundred office compounds, and soon all were done while the labor did not burden the people.',
    'Back in the province he rebuilt hundreds of offices at once without burdening the people.',
  ],
  s0065: [
    'Jing region said that since Jin\'s Wang Yue moved his seat, no government house had matched it.',
    'Jing said that since Jin\'s Wang Yue moved the seat, no seat had matched it.',
  ],
  s0066: [
    'In year nine the Prince of Yuzhang Diao died; Ai left office to mourn, led former clerks of Jing and Xiang, and set a stele at the tomb.',
    'In year nine Prince Diao died; Ai mourned, led old Jing and Xiang clerks, and raised a tomb stele.',
  ],
  s0067: [
    'Through offices he rose to recorder on the chariot-and-cavalry pacifying-the-west staff and infantry commandant, and begged leave to guard the west on his return.',
    'He rose to chariot-and-cavalry western recorder and infantry commandant, then begged leave to guard the west.',
  ],
  s0068: [
    'When the Prince of Nankang was western army commander, Ai was his staff adviser.',
    'When the Prince of Nankang commanded the western army, Ai was staff adviser.',
  ],
  s0069: [
    'When the Righteous Army rose, Xiao Yingzhou brought in Ai with Zong Guai and Liu Tan and entrusted them with strategy.',
    'When the Righteous Army rose, Xiao Yingzhou brought in Ai, Zong Guai, and Liu Tan for strategy.',
  ],
  s0070: [
    'When the Liang headquarters was founded, he was promoted to marshal of the army that guards the state, palace gentleman of the Secretariat, and Left Director of the Masters of Writing.',
    'When the Liang headquarters was founded, he became guarding-the-state marshal, Secretariat gentleman, and Left Director.',
  ],
  s0071: [
    'At the time forging arms and armor, warships and army grain, and court ritual all drew on Ai.',
    'Forging arms, building ships, army grain, and court ritual all ran through Ai.',
  ],
  s0072: [
    'Soon he was promoted to Gentleman of the Yellow Gate who attends to matters, Left Director as before.',
    'Soon he was Gentleman of the Yellow Gate, Left Director unchanged.',
  ],
  s0073: [
    'When Emperor He went east, Ai held the post of Commandant of the Guard on the road.',
    'When Emperor He went east, Ai served as Commandant of the Guard on the road.',
  ],
  s0074: [
    'At the start of Tianjian he was promoted to Raiding Cavalry General and Director of the Palace Workshop;',
    'At Tianjian\'s opening he was Raiding Cavalry General and palace workshop director;',
  ],
  s0075: [
    'soon he was Censor-in-Chief and head of the great rectifiers of his native province.',
    'soon Censor-in-Chief and head of his province\'s great rectifiers.',
  ],
  s0076: [
    'When Ai had set out from Jiangling he found for no reason on the boat eight carriage hubs, like a censor\'s brisk step giving way on the road—and now the omen came true.',
    'Leaving Jiangling he had found eight carriage hubs on the boat, like a censor stepping aside—and now the omen held.',
  ],
  s0077: [
    'Ai\'s nature was fair and forceful; at the censorate he filled the post admirably.',
    'Fair and forceful, he shone at the censorate.',
  ],
  s0078: [
    'At the time the Prince of Changsha, King Xuan of Wu, was to be buried, and the carriage office suddenly found lamp oil ablaze in the storehouse; they wished to impeach the keeper.',
    'Prince Xuan of Changsha was to be buried when the carriage office found lamp oil burning in the storehouse and sought a culprit.',
  ],
  s0079: [
    'Ai said: "In Jin, when the arsenal caught fire, Zhang Hua held that ten thousand stone of oil piled up made it inevitable.',
    'Ai said, "When Jin\'s arsenal burned, Zhang Hua said ten thousand stone of piled oil made fire inevitable.',
  ],
  s0080: [
    'If the storehouse now holds ash, it is no clerk\'s crime."',
    'If ash lies in the storehouse, no clerk is to blame."',
  ],
  s0081: [
    'On inspection there was indeed piled ash.',
    'Inspection found piled ash.',
  ],
  s0082: [
    'The age praised his broad learning and large forgiveness.',
    'The age praised his learning and his large forgiveness.',
  ],
  s0083: [
    'In year two he went out bearer of staff, commander of military affairs in Guang, Jiao, and Yue, Champion General, pacifying-the-Yue middle army commander, and inspector of Guangzhou.',
    'In year two he went out with staff, commanding Guang, Jiao, and Yue, champion general, pacifying-the-Yue commander, and Guangzhou inspector.',
  ],
  s0084: [
    'The former inspector Xu Yuanyu left his post and on the road met Shixing men in revolt; they drove out interior governor Cui Mushu and plundered Yuanyu\'s goods.',
    'Former inspector Xu Yuanyu met Shixing rebels on the road; they drove out Cui Mushu and looted his goods.',
  ],
  s0085: [
    'Yuanyu fled back to Guangzhou, borrowed troops from Ai on the pretext of punishing bandits, but in truth meant to strike Ai.',
    'Yuanyu fled to Guangzhou, borrowed troops to hunt bandits, but meant to strike Ai.',
  ],
  s0086: [
    'Ai saw through it and executed Yuanyu.',
    'Ai saw through it and killed Yuanyu.',
  ],
  s0087: [
    'Soon his title advanced to general who campaigns against barbarians; he died in office.',
    'Soon he was general who campaigns against barbarians and died in office.',
  ],
  s0088: [
    'Ai\'s elder sister married the reclusive Liu Jiao of the same commandery, also famed for discernment and ritual teaching.',
    'His elder sister married the recluse Liu Jiao of his commandery, famed for discernment and ritual.',
  ],
  s0089: [
    'When Ai was in the province he welcomed his sister to the official residence and shared his salary; the west praised it.',
    'As inspector he brought his sister to the yamen and shared salary; the west praised it.',
  ],
  s0090: [
    'His son Facai, styled Yuanbei, in youth with his younger brother Fazang both had a fine name.',
    'His son Facai, styled Yuanbei, and his brother Fazang were both famed in youth.',
  ],
  s0091: [
    'Young, he traveled to the capital and visited Shen Yue; Yue saw him and praised him.',
    'In youth he visited Shen Yue at the capital; Yue praised him.',
  ],
  s0092: [
    'When Qi\'s Emperor He was prime minister, Facai was summoned as staff officer to the prime minister\'s office; the army that guards the state, Xiao Yingzhou, made him chief clerk.',
    'When Emperor He of Qi was prime minister, Facai joined his staff; Xiao Yingzhou made him chief clerk.',
  ],
  s0093: [
    'When the Liang headquarters was founded, he was made Gentleman who initiates affairs.',
    'When the Liang headquarters was founded, he was Gentleman who initiates affairs.',
  ],
  s0094: [
    'In Tianjian year two, when Ai went out to command the southern frontier, Facai stayed in the capital, was promoted to Director of the Treasury, and left office for his father\'s mourning.',
    'In Tianjian year two Ai went south; Facai stayed at court as Director of the Treasury, then mourned his father.',
  ],
  s0095: [
    'When mourning ended he was made Secretariat attendant who handles affairs and went out as chief clerk of his native province.',
    'After mourning he handled Secretariat affairs and went out as native province chief clerk.',
  ],
  s0096: [
    'He entered as Regular Attendant of Scattered Cavalry, again handled affairs, and was promoted Right Director of the Masters of Writing.',
    'He entered as Regular Attendant, again handled affairs, then became Right Director.',
  ],
  s0097: [
    'When the Prince of Jin\'an held Jingzhou, he was again made chief clerk and staff officer.',
    'When the Prince of Jin\'an held Jingzhou, he was again chief clerk and staff officer.',
  ],
  s0098: [
    'He was summoned again as Right Director, went out as general who invites from afar and magistrate of Jiankang.',
    'Recalled as Right Director, he went out as general who invites from afar and Jiankang magistrate.',
  ],
  s0099: [
    'He would not take salary; by the time he left office he had nearly a hundred jin of gold, and the county clerks reported it to the central treasury.',
    'He took no salary; near a hundred jin of gold had gathered when he left, and the county reported it to the central treasury.',
  ],
  s0100: [
    'Gaozu prized his integrity and said: "To hold office like this is to stand as a model for a hundred cities.',
    'Gaozu prized his integrity and said, "To hold office like this is to be a model for a hundred cities.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_019_b1.mjs <translation.json>'
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
