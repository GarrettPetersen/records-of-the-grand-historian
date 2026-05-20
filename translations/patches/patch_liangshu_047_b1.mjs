#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Teng Yan\'gong',
    'Teng Yan\'gong',
  ],
  s0002: [
    'Xu Puji',
    'Xu Puji',
  ],
  s0003: [
    'At that time there was Xu Puji, a man of Linxiang in Changsha.',
    'There was Xu Puji of Linxiang, Changsha.',
  ],
  s0004: [
    'While in mourning before the burial, a neighbor\'s house caught fire and the blaze spread to his dwelling; Puji wailed and threw himself on the coffin, shielding it with his body.',
    'Before the funeral a neighbor\'s fire reached his house; Puji cried out and lay on the coffin, covering it with his body.',
  ],
  s0005: [
    'Neighbors came to rescue him; he had already been scorched and suffocated, and only after several days did he revive.',
    'Neighbors pulled him away; the burns had already stunned him breathless, and only after days did he wake.',
  ],
  s0006: [
    'The woman of Wanling',
    'The woman of Wanling',
  ],
  s0007: [
    'In Xuancheng\'s Wanling a woman slept in the same bed with her mother; a fierce tiger seized the mother, and the daughter screamed and grappled with the tiger until its fur fell out; after more than ten li the tiger at last abandoned her.',
    'At Wanling in Xuancheng a woman shared a bed with her mother; a tiger seized the mother and the daughter shrieked, seized the beast, and tore its fur away; after ten-odd li the tiger dropped her.',
  ],
  s0008: [
    'The daughter carried her mother back; she still had breath, but after a time she died.',
    'She carried her mother home; breath remained awhile, then ceased.',
  ],
  s0009: [
    'The prefect Xiao Chen gave funeral gifts and memorialized the affair.',
    'Prefect Xiao Chen sent gifts and memorialized what had happened.',
  ],
  s0010: [
    'An edict honored her gate and lane.',
    'The throne honored her household.',
  ],
  s0011: [
    'Shen Chongsu',
    'Shen Chongsu',
  ],
  s0012: [
    'Shen Chongsu, courtesy name Si Zheng, was a man of Wukang in Wuxing.',
    'Shen Chongsu, styled Si Zheng, was from Wukang in Wuxing.',
  ],
  s0013: [
    'His father Huaiming had been Inspector of Yanzhou under Song.',
    'His father Huaiming had been Song Inspector of Yanzhou.',
  ],
  s0014: [
    'At six Chongsu suffered his father\'s death and wept and stamped beyond the rites.',
    'At six he lost his father and mourned beyond propriety.',
  ],
  s0015: [
    'When grown he copied books to support his mother.',
    'Grown, he copied books to feed his mother.',
  ],
  s0016: [
    'At the beginning of the Jianwu era he first took office as Attendant at Court.',
    'In early Jianwu he entered service as Attendant at Court.',
  ],
  s0017: [
    'At the end of the Yongyuan era he was promoted to staff aide in the Secretariat.',
    'At Yongyuan\'s end he became Secretariat staff aide.',
  ],
  s0018: [
    'At the beginning of the Tianjian era he served as staff officer to the Prince of Poyang in the Forward Army.',
    'Early in Tianjian he was staff officer to the Forward Army\'s Prince of Poyang.',
  ],
  s0019: [
    'In the third year the prefect Liu Yun engaged him as chief clerk.',
    'In year three Prefect Liu Yun made him chief clerk.',
  ],
  s0020: [
    'Chongsu followed Yun to the commandery, then returned to fetch his mother; his mother died.',
    'Chongsu went with Yun to the prefecture, then went back for his mother; she died on the way.',
  ],
  s0021: [
    'Chongsu, because he had not been able to tend her in her illness, was about to die himself: he would not take water or food and wept day and night; in ten days he was nearly dead.',
    'Having missed her sickbed, he meant to die: no food or drink, weeping day and night until in ten days he was all but gone.',
  ],
  s0022: [
    'His brothers said to him: "The burial is not yet arranged—if you destroy yourself in haste, that is not the full way of filial piety.',
    'His brothers said, "The funeral is not settled—if you kill yourself now, that is not complete filial duty.',
  ],
  s0023: [
    '" At the burial ground Chongsu did not avoid rain or snow but leaned on the mound in grief.',
    '" He would not leave the grave in rain or snow and leaned on the mound wailing.',
  ],
  s0024: [
    'Each night fierce beasts would come to look upon him, with sounds like sighing.',
    'Nightly wild beasts came to watch him, sighing as they came.',
  ],
  s0025: [
    'The family was poor and could not move the grave; he begged for a year before he could bury her.',
    'Too poor to rebury her, he begged a full year before he could lay her to rest.',
  ],
  s0026: [
    'Thereafter he built a hut beside the tomb; because he felt his first mourning had been incomplete, after the burial he observed mourning dress again for three years.',
    'Then he hutched beside the tomb; thinking the first mourning rites incomplete, he wore mourning again for three years after burial.',
  ],
  s0027: [
    'For long he ate only wheat bran and would not touch salt or vinegar; he sat and lay on a single mat until, from emaciation, he could not rise.',
    'He lived on bran without salt or vinegar, sat and slept on one thin mat, and swelled so weak he could not stand.',
  ],
  s0028: [
    'The commandery and county reported his utmost filial piety.',
    'Commandery and county commended his extreme filiality.',
  ],
  s0029: [
    'When Gaozu heard, he at once sent a Secretariat Attendant to comfort and encourage him, and issued an edict saying: "Shen Chongsu of the Forward Army, in youth had resolve and conduct; in mourning he exceeded the rites.',
    'Gao Di heard and sent a Secretariat Attendant to comfort him, then edicted: "Forward Army Shen Chongsu showed resolve young and mourning beyond measure.',
  ],
  s0030: [
    'His fast was not finished and the great burial had not been performed; he himself felt that a year of begging had left the funeral rites much wanting, and he meant to begin a second mourning term from the morning of everlasting longing.',
    'His fast was unfinished and the great burial undone; after a year of begging the rites still lacked, and he would begin another mourning cycle from that dawn of grief.',
  ],
  s0031: [
    'Though feeling may be pitiable, the rites have clear limits.',
    'Pity his heart, but rites have limits.',
  ],
  s0032: [
    'Let him at once be released from mourning dress and promoted to fill the post of Crown Prince\'s Household Steward.',
    'Release him from mourning and appoint Crown Prince\'s Household Steward.',
  ],
  s0033: [
    'Honor his gate and lane and thicken this teaching of custom."',
    'Honor his household and strengthen this custom."',
  ],
  s0034: [
    'Chongsu received the edict and put off mourning dress, yet wept as if still in mourning; he firmly refused the office, pleaded bitterly, and only after a year did he become magistrate of Yongning.',
    'He obeyed and doffed mourning but wept as in bereavement, refused the post, pleaded hard, and only after a year took Yongning magistracy.',
  ],
  s0035: [
    'He felt that his salary could no longer nourish his mother; regret and grief grew worse, his sorrow unbearable, and at the county he died, aged thirty-nine.',
    'His stipend could no longer feed his mother; grief overwhelmed him and he died in office at thirty-nine.',
  ],
  s0036: [
    'Xun Jiang, courtesy name Wen Shi, was a man of Yingyin, ninth-generation descendant of Jin Grand Tutor Xun Xu.',
    'Xun Jiang, styled Wen Shi, of Yingyin, was ninth generation from Jin Grand Tutor Xun Xu.',
  ],
  s0037: [
    'His grandfather Qiong, at fifteen, avenged his father\'s death in Chengdu market and was known for filial piety.',
    'His grandfather Qiong at fifteen avenged his father in Chengdu market and won fame for filial piety.',
  ],
  s0038: [
    'At the end of the Yuanjia era of Song he crossed the Huai to join Prince of Wuling Yi and was killed by the crown prince\'s pursuing troops; posthumously he was given the title Supernumerary Cavalier Attendant-in-Ordinary.',
    'Late in Song Yuanjia he crossed the Huai for Prince of Wuling Yi, was killed by the crown prince\'s pursuers, and was posthumously made Supernumerary Cavalier Attendant-in-Ordinary.',
  ],
  s0039: [
    'His father Fachao, at the end of the Zhongxing era of Qi, was magistrate of Anfu and died in office.',
    'His father Fachao, late in Qi Zhongxing, was Anfu magistrate and died in office.',
  ],
  s0040: [
    'When the dire news arrived Jiang wailed until his breath stopped and his whole body was cold; only at night did he revive.',
    'When word came he wailed himself breathless and cold; only at night did he wake.',
  ],
  s0041: [
    'Then he hurried to the mourning; each night he lodged on the river islets, and travelers could not bear to hear his weeping.',
    'Rushing to the funeral he lodged nightly on the river sandbars; travelers could not bear his crying.',
  ],
  s0042: [
    'Before mourning was finished his elder brother Fei first took office as governor of Yulin, campaigned against the Liao bandits, was struck by a stray arrow, and died in battle.',
    'Mourning unfinished, his brother Fei became Yulin governor, fought the Liao raiders, took a stray arrow, and died on the field.',
  ],
  s0043: [
    'When the coffin returned Jiang met it at Yuzhang, saw the boat, and threw himself into the water; those beside him rescued him and he barely survived.',
    'The bier returning, he met it at Yuzhang, saw the boat, and leapt into the river; bystanders barely saved him.',
  ],
  s0044: [
    'When he arrived, the family was poor and could not bury in season.',
    'Home again, they were too poor to bury on time.',
  ],
  s0045: [
    'He observed mourning for his father together with mourning for his brother—four years without leaving the hut door.',
    'He mourned father and brother together—four years without leaving the mourning hut.',
  ],
  s0046: [
    'After he bound up his hair he never combed or washed again, and his hair all fell out.',
    'From binding his hair he never combed or bathed, and his hair fell out.',
  ],
  s0047: [
    'He wept without fixed times; when his voice was gone he tied on sobbing, his eyelids all ulcerated, his form withered and gaunt, skin and bone barely joined—even his family no longer knew him.',
    'He wept without cease; when voice failed he sobbed on; his eyelids rotted, his body skeletal; kin scarcely knew him.',
  ],
  s0048: [
    'The commandery and county reported the facts; Gaozu edicted that a Secretariat Attendant should release him from mourning and promote him to Left Regular Attendant in the Kingdom of the Prince of Yuzhang.',
    'Commandery and county reported; Gao Di sent a Secretariat Attendant to release mourning and make him Left Regular Attendant in Prince of Yuzhang\'s kingdom.',
  ],
  s0049: [
    'Though Jiang had returned to the ordinary calendar, his devastation grew worse.',
    'Though he left mourning, his wasting grew worse.',
  ],
  s0050: [
    'His maternal grandfather Sun Qian admonished him, saying: "The sovereign rules the realm by filial piety; your conduct surpasses the ancients, and therefore the bright edict was issued and you were raised to this post.',
    'His maternal grandfather Sun Qian warned him: "The throne rules by filial piety; your conduct exceeds the ancients, hence the edict and this appointment.',
  ],
  s0051: [
    'It is not only that a lord and father\'s command is hard to refuse—you will also make a name for later ages; the glory shown is not yours alone!',
    'You cannot only refuse a lord-father\'s command—you will win fame for ages; the glory is not yours alone!',
  ],
  s0052: [
    '" Thereupon Jiang bowed in acceptance.',
    '" Then Jiang accepted the post.',
  ],
  s0053: [
    'In the end, from devastation he died at home, aged twenty-one.',
    'He died at home of grief at twenty-one.',
  ],
  s0054: [
    'Yu Qianlou',
    'Yu Qianlou',
  ],
  s0055: [
    'Yu Qianlou, courtesy name Zi Zhen, was a man of Xinye.',
    'Yu Qianlou, styled Zi Zhen, was from Xinye.',
  ],
  s0056: [
    'His father Yi had been chief clerk in the Secretariat; summoned but he did not come, and he enjoyed a high reputation.',
    'His father Yi had been Secretariat chief clerk, was summoned but would not serve, and had great repute.',
  ],
  s0057: [
    'Qianlou from youth loved learning and often lectured on the Classic of Filial Piety; he never changed countenance before others; the eminent men of Nanyang, Liu Qiu and Zong Ce, both marveled at him.',
    'From youth he loved learning, often expounded the Classic of Filial Piety, never lost composure before others; Nanyang worthies Liu Qiu and Zong Ce both admired him.',
  ],
  s0058: [
    'His first office was chief clerk in his native province; he was transferred to staff aide in the Pacifying West headquarters.',
    'He began as native-province chief clerk, then became Pacifying West staff aide.',
  ],
  s0059: [
    'He went out as magistrate of Bian and in governing achieved outstanding results.',
    'As Bian magistrate his rule won unusual praise.',
  ],
  s0060: [
    'Before this, within the county boundaries tigers were fierce and violent.',
    'Before, tigers ravaged the county.',
  ],
  s0061: [
    'When Qianlou arrived the tigers all crossed to the border of Linju; at the time people took it as the effect of humane transformation.',
    'When Qianlou came the tigers all crossed into Linju; men said humane rule had moved them.',
  ],
  s0062: [
    'At the beginning of the Yongyuan era of Qi he was appointed magistrate of Chanling; he had been at the county less than ten days when Yi fell ill at home; Qianlou suddenly felt alarm in his heart, sweat poured over his whole body, and that same day he abandoned office and returned home; the family was all startled at his sudden arrival.',
    'Early in Qi Yongyuan he became Chanling magistrate; within ten days Yi fell ill at home; Qianlou felt a sudden dread, broke into sweat, and that day quit office and ran home—kin were stunned.',
  ],
  s0063: [
    'At that time Yi\'s illness had only begun two days before; the physician said: "To know whether he will improve or worsen, only taste whether the feces are sweet or bitter.',
    'Yi had been ill only two days; the doctor said, "To know if he will live or die, taste whether the stool is sweet or bitter.',
  ],
  s0064: [
    '" Yi had dysentery; Qianlou at once took some and tasted it—the flavor turned sweet and smooth, and his heart grew more bitter with worry.',
    '" Yi had dysentery; Qianlou tasted it—the flavor grew sweet and smooth, and his grief deepened.',
  ],
  s0065: [
    'Each evening he knocked his forehead to the North Star, begging to take his father\'s place.',
    'Each night he bowed to the Pole Star, begging to die in his father\'s stead.',
  ],
  s0066: [
    'Soon a voice was heard in the air saying: "The Recluse\'s allotted life is finished and cannot be extended; your prayer has indeed reached us—you may only extend him to the end of the month.',
    'Soon a voice in the air said, "The Recluse\'s span is done and cannot be added; your prayer reached heaven—you may only extend him to month\'s end.',
  ],
  s0067: [
    '" On the last day of the month Yi died; Qianlou observed mourning beyond the rites and hutted beside the mound.',
    '" On the last day Yi died; Qianlou mourned beyond measure and hutched beside the tomb.',
  ],
  s0068: [
    'When Emperor He took the throne they were about to summon him; the Pacifying Army Xiao Yingzhou wrote in his own hand urging and instructing him, but Qianlou firmly refused.',
    'When Emperor He acceded they meant to call him; Pacifying Army Xiao Yingzhou wrote urging him, but Qianlou refused firmly.',
  ],
  s0069: [
    'When mourning was finished he was appointed Gentleman of Ceremonies in the Western Terrace.',
    'After mourning he became Western Terrace Gentleman of Ceremonies.',
  ],
  s0070: [
    'When the Liang regime was being established Deng Yuanqi became Inspector of Yizhou and memorialized Qianlou as chief clerk of the headquarters and governor of the two commanderies of Baxi and Zitong.',
    'As Liang was forming Deng Yuanqi became Yizhou inspector and named Qianlou headquarters chief clerk and governor of Baxi and Zitong.',
  ],
  s0071: [
    'When Chengdu was pacified treasures in the city piled like mountains; Yuanqi divided them all among his staff, but Qianlou took not a single thing.',
    'When Chengdu fell treasures heaped in the city; Yuanqi shared them among his staff, but Qianlou took nothing.',
  ],
  s0072: [
    'Yuanqi resented his standing apart from the crowd and said in a harsh voice: "Chief Clerk—why alone act thus!',
    'Yuanqi hated his singularity and snapped, "Chief Clerk—why alone act so!',
  ],
  s0073: [
    '" Qianlou showed that he did not disobey but asked only for several baskets of books.',
    '" Qianlou seemed to comply but asked only for a few baskets of books.',
  ],
  s0074: [
    'Soon after he was appointed governor of Shu commandery; in office he was pure and plain, and the common people found him easy to live under.',
    'Soon he was Shu governor, pure and spare in office, and the people were at ease.',
  ],
  s0075: [
    'Yuanqi died in Shu; his troops all scattered; Qianlou himself arranged the burial and coffining and carried the bier back to his home district.',
    'Yuanqi died in Shu and his troops dispersed; Qianlou himself arranged the funeral and bore the coffin home.',
  ],
  s0076: [
    'On return he became Gentleman of the Golden Department in the Secretariat and was transferred to staff recorder in the Central Army headquarters.',
    'Back he became Secretariat Gentleman of the Golden Department, then Central Army staff recorder.',
  ],
  s0077: [
    'When the Eastern Palace was established he served in his former office attending the Crown Prince in study, was greatly known and esteemed, and by edict he, together with the Crown Prince\'s Household Mentor Yin Jun, Household Attendant Dao Qia, and National University Erudite Ming Shanbin and others, took turns daily lecturing the Crown Prince on the meaning of the Five Classics.',
    'When the Eastern Palace rose he attended the crown prince in study, won high favor, and by edict he, with Household Mentor Yin Jun, Attendant Dao Qia, Erudite Ming Shanbin, and others, lectured the crown prince daily on the Five Classics.',
  ],
  s0078: [
    'He was transferred to Cavalier Attendant-in-Ordinary and Grand Rectifier of Jingzhou.',
    'He became Cavalier Attendant-in-Ordinary and Jingzhou Grand Rectifier.',
  ],
  s0079: [
    'He died, aged forty-six.',
    'He died at forty-six.',
  ],
  s0080: [
    'Ji Bin, courtesy name Yan Xiao, was a man of Lianzhao in Fengyi.',
    'Ji Bin, styled Yan Xiao, was from Lianzhao in Fengyi.',
  ],
  s0081: [
    'For generations the family dwelt in Xiangyang.',
    'The clan had long lived in Xiangyang.',
  ],
  s0082: [
    'Bin from childhood had a filial nature.',
    'From childhood Bin was filial.',
  ],
  s0083: [
    'At eleven he suffered mourning for his birth mother; he would not take water or broth and was nearly destroyed in nature; kin and neighbors marveled at him.',
    'At eleven he mourned his birth mother, took no food or drink, nearly died of grief, and kin marveled.',
  ],
  s0084: [
    'At the beginning of the Tianjian era his father was magistrate of Yuan township in Wuxing and was slandered by a corrupt clerk and seized and sent to the Court of Justice.',
    'Early in Tianjian his father was Yuan township magistrate in Wuxing, was framed by a corrupt clerk, and was sent to the Court of Justice.',
  ],
  s0085: [
    'Bin, aged fifteen, wept and wailed in the public streets, begging the high ministers; passersby who saw him all shed tears.',
    'Bin at fifteen wailed in the streets, pleading with high officials; every passerby wept.',
  ],
  s0086: [
    'Though his father\'s case was in truth innocent, he was ashamed to be questioned as a criminal and therefore falsely confessed guilt himself; the crime called for the great execution.',
    'Though his father was innocent, he was shamed to be examined as a criminal and falsely confessed; the penalty was death.',
  ],
  s0087: [
    'Bin then beat the petition drum at the palace gate and begged to die in his father\'s place.',
    'Bin then struck the petition drum and begged to die for his father.',
  ],
  s0088: [
    'Gaozu marveled at it and ordered the Minister of Justice Cai Fadu, saying: "Ji Bin asks to die to redeem his father—the righteousness and sincerity are truly admirable;',
    'Gao Di was moved and ordered Minister of Justice Cai Fadu: "Ji Bin asks to die for his father—his loyalty is admirable;',
  ],
  s0089: [
    'but he is still a young child and may not himself have formed the intent.',
    'but he is a child and may not have thought of this himself.',
  ],
  s0090: [
    'You may strictly coerce and entice him and obtain his full confession.',
    'Coerce and entice him strictly and get the full truth.',
  ],
  s0091: [
    '" Fadu received the order and returned to his office; he displayed fetters and chains in profusion, arrayed the officials in full, and with stern countenance questioned Bin, saying: "You ask to die in your father\'s place—the edict has already granted it, and you ought to submit to the law.',
    '" Fadu took the order, returned to court, spread out chains and fetters, lined up the officials, and sternly asked Bin: "You ask to die for your father—the edict already grants it; you should submit to execution.',
  ],
  s0092: [
    'Yet knife and saw are most severe—can you in truth face death?',
    'But blade and saw are cruel—can you truly die?',
  ],
  s0093: [
    'Moreover you are a mere child; your will does not reach to this—you must have been taught by someone.',
    'You are only a boy; your heart cannot reach here—you were taught by someone.',
  ],
  s0094: [
    'What is his name—give a full list in answer.',
    'Name him—answer fully.',
  ],
  s0095: [
    'If you repent and change your mind, that too will be allowed.',
    'If you repent, we will hear it.',
  ],
  s0096: [
    '" Bin answered: "Though the prisoner is feeble and weak, does he not know that death is to be feared?',
    '" Bin answered: "Though I am weak, do I not know death is fearful?',
  ],
  s0097: [
    'But my younger brothers are young and small; only the prisoner is the eldest—I cannot bear to see my father suffer the extreme penalty and myself prolong my breath.',
    'My brothers are small; I alone am eldest—I cannot watch my father die while I live on.',
  ],
  s0098: [
    'Therefore I cut off my heart within and troubled the Son of Heaven above.',
    'So I broke my heart within and troubled the throne above.',
  ],
  s0099: [
    'Now I wish to cast away my body into the unknown and leave my bones in the springs and mounds—this is no small matter; how could I accept another\'s teaching!',
    'Now I would throw my body into the unknown and leave my bones underground—this is no small thing; how could another teach me!',
  ],
  s0100: [
    'The bright edict permits substitution—no different from ascending as an immortal; how could there be second thoughts!',
    'The clear edict lets me substitute—it is like ascending to immortality; how could I waver!',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_047_b1.mjs <translation.json>'
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
