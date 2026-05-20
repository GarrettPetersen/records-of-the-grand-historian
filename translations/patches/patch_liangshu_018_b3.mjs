#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Heads cut and captives taken alive beyond counting.',
    'He beheaded the enemy and took captives beyond count.',
  ],
  s0202: [
    'For merit he was advanced to Army Adviser General, his fief increased by two hundred households, and he was transferred to Bearer of Credentials, Area Commander of all Qing and Ji military affairs, Expeditionary General, and Inspector of Qing and Ji.',
    'For merit he gained Army Adviser General, two hundred more households, and moved to bearer of credentials, area commander of Qing and Ji, expeditionary general, and inspector of both provinces.',
  ],
  s0203: [
    'Before he took the appointment he was changed to Area Commander of all military affairs in South Yan, Yan, Xu, Qing, and Ji, Assists-the-State General, and South Yan Inspector.',
    'Before taking post he was reassigned to command five provinces\' military affairs—South Yan, Yan, Xu, Qing, and Ji—as assists-the-state general and South Yan inspector.',
  ],
  s0204: [
    'He was impeached and dismissed by the relevant offices for sending forbidden goods out of his fief.',
    'For exporting prohibited goods from his fief, the censors impeached him and he was dismissed.',
  ],
  s0205: [
    'That year he was made up as Vermilion-Robe Direct Attendant, appointed Left Raiding Cavalry General, Direct Attendant as before.',
    'That year he was added as vermilion-robe direct attendant, made left raiding cavalry general, and kept his direct-attendant post.',
  ],
  s0206: [
    'He was transferred to Right Commandant of the Crown Prince\'s Guard, concurrently Colonel of the Upright Cavalry, with acting credentials.',
    'He became right commandant of the crown prince\'s guard, also colonel of the upright cavalry, with acting credentials.',
  ],
  s0207: [
    'In the eighth year he went out as Bearer of Credentials, Area Commander of all Xiangzhou military affairs, Far-Campaign General, and Xiang Inspector.',
    'In year eight he went out with credentials, as area commander of Xiang, far-campaign general, and Xiang inspector.',
  ],
  s0208: [
    'In the ninth year he returned to court with his former title; soon he was made Staff Officer to the Minister of Works, Prince of Linchuan, general as before.',
    'In year nine he returned to court under his old title; soon he was staff officer to the prince of Linchuan, minister of works, general as before.',
  ],
  s0209: [
    'In the tenth year he was transferred to Right Palace Guard General.',
    'In year ten he became right palace guard general.',
  ],
  s0210: [
    'In the thirteenth year he was moved to Left Palace Guard General.',
    'In year thirteen he was made left palace guard general.',
  ],
  s0211: [
    'That winter Gaozu sent the Crown Prince\'s Right Commandant Kang Xuan to supervise all armies in building the Jingshan Dam.',
    'That winter Gaozu sent Kang Xuan, right commandant of the crown prince\'s guard, to oversee all forces building the Jingshan dam.',
  ],
  s0212: [
    'The next year Wei sent the general Li Tanding with a great host to press Jingshan, proclaiming they would breach the dam; an edict lent Yizhi credentials; he led Grand Master of the Imperial Stud Yu Hongwen, Direct-Attendant General Cao Shizong, Xu Yuanhe, and others to rescue Xuan—the army had not arrived when Xuan and his men had already broken the Wei forces.',
    'Next year Wei sent Li Tanding with a large force against Jingshan, claiming they would burst the dam; Yizhi was given acting credentials and led Yu Hongwen, grand master of the imperial stud, direct-attendant Cao Shizong, Xu Yuanhe, and others to aid Xuan—the relief force had not arrived when Xuan had already routed Wei.',
  ],
  s0213: [
    'Wei again sent the great general Li Ping to attack Xiashi, besieging Direct-Attendant General Zhao Zuyue; Yizhi again led Vermilion-Robe Direct Attendant Wang Shennian and others to rescue him.',
    'Wei again sent Li Ping against Xiashi and besieged Zhao Zuyue; Yizhi again led vermilion-robe direct attendant Wang Shennian and others to the relief.',
  ],
  s0214: [
    'At the time Wei troops were strong; Shennian attacked the Xiashi pontoon bridge but could not take it, so the relief army could not advance in time, and Xiashi fell.',
    'Wei was strong; Shennian failed to take Xiashi\'s pontoon bridge, the relief could not come up in time, and the place fell.',
  ],
  s0215: [
    'Yizhi withdrew the army and was impeached by the relevant offices; Gaozu, because he was a meritorious minister, did not pursue it.',
    'Yizhi withdrew and was impeached; Gaozu, treating him as a meritorious minister, let the matter drop.',
  ],
  s0216: [
    'In the fifteenth year he was again made Bearer of Full Credentials, Commander of all Xiangzhou military affairs, Trustworthy Martial General, and Xiang Inspector.',
    'In year fifteen he was again made full-credentials bearer, commander of Xiang military affairs, trustworthy martial general, and Xiang inspector.',
  ],
  s0217: [
    'That year he was reassigned Commander of all North Xuzhou military affairs along the Huai, Pacification North General, and North Xuzhou Inspector.',
    'That year he was reassigned to command North Xuzhou forces along the Huai as pacification north general and North Xuzhou inspector.',
  ],
  s0218: [
    'Yizhi was by nature generous and mild; as a general he could comfort and control men and win their utmost loyalty; when he held a fief post, officials and people were at peace.',
    'Generous by nature, Yizhi as a general won men to die for him; in a provincial post officials and commoners were secure.',
  ],
  s0219: [
    'Soon he was granted one set of martial pipes and drums; his enfeoffment was changed to Marquis of Yingdao county, the fief households as before.',
    'Soon he received martial pipes and drums and was re-enfeoffed as Marquis of Yingdao with the same household quota.',
  ],
  s0220: [
    'In the third year of Putong he was summoned to be Protector of the Army General, martial pipes and drums as before.',
    'In Putong year three he was summoned as protector of the army general, pipes and drums unchanged.',
  ],
  s0221: [
    'In the tenth month of the fourth year he died.',
    'In the tenth month of year four he died.',
  ],
  s0222: [
    'Gaozu grieved deeply and issued an edict: "Protector of the Army General, Marquis of Yingdao, founder of the fief-state Chang Yizhi—capable and steady in counsel, generous and reserved in intent, loyalty manifest from the founding of our fortune, achievements clear on the frontier.',
    'Gaozu mourned him deeply and decreed: "Protector of the Army General, founding Marquis of Yingdao, Chang Yizhi—deeply capable in counsel, mild of heart, loyal from the dynasty\'s rise, his merit plain on the border.',
  ],
  s0223: [
    'Just as he was to show his talons and fangs, we entrusted him with the palace guard;',
    'He was just to prove his worth when we entrusted him with the palace guard;',
  ],
  s0224: [
    'suddenly he has fallen dead, and my heart is pierced with sorrow.',
    'suddenly he died—and grief pierces my breast.',
  ],
  s0225: [
    'He may be posthumously made Regular Attendant Cavalier Attendant-in-Ordinary and General of Chariots and Cavalry, with one set of martial pipes and drums as well.',
    'Posthumously he shall be made regular attendant cavalier attendant-in-ordinary and chariot-and-cavalry general, with pipes and drums as well.',
  ],
  s0226: [
    'Funerary goods from the Eastern Garden store, one set of court dress.',
    'Eastern Garden funeral gear and one court robe.',
  ],
  s0227: [
    'Funeral bounty: twenty thousand cash, two hundred bolts of cloth, two hundred jin of wax.',
    'Funeral bounty: twenty thousand cash, two hundred bolts of cloth, two hundred jin of wax.',
  ],
  s0228: [
    'Posthumous title: Lie (Stalwart)."',
    'Posthumous title: Lie (Stalwart)."',
  ],
  s0229: [
    'His son Baoye succeeded; he reached Direct-Attendant General and Qiao Inspector.',
    'His son Baoye succeeded and rose to direct-attendant general and Qiao inspector.',
  ],
  s0230: [
    'Chen Minister of Personnel Yao Cha said: Zhang Huishao, Feng Daogen, Kang Xuan, and Chang Yizhi—at first following the ascent, their achievements were light.',
    'Chen minister of personnel Yao Cha said: Zhang Huishao, Feng Daogen, Kang Xuan, and Chang Yizhi—when they first followed the founding, their merit was slight.',
  ],
  s0231: [
    'When bandits burned the palace gates, Huishao showed himself in fierce battle;',
    'When rioters torched the gates, Huishao distinguished himself in battle;',
  ],
  s0232: [
    'At the pressures of Hefei and Shaoyang, Daogen and Yizhi had the greater merit;',
    'At Hefei and Shaoyang, Daogen and Yizhi did the heavier work;',
  ],
  s0233: [
    'When the Fushan campaign arose, Kang Xuan directed it—they each had their share of labor; advancement in favor was fitting.',
    'When the Fushan affair began, Kang Xuan ran it: each earned his place—favor was rightly granted.',
  ],
  s0234: [
    'Earlier, when the Planet of Settlement held the Heavenly River the dam arose; when it withdrew the dam burst—not merely human affairs; Heaven had a hand.',
    'When Saturn held the Heavenly River the dam rose; when it moved off the dam broke—not human effort alone—Heaven was involved.',
  ],
  s0235: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0236: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_018_b3.mjs <translation.json>'
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
