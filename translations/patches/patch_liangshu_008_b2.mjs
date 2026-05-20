#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Your servant\'s views are shallow and dull, ignorant of what the times require; if there is any foolish thought, I wish to present it above.',
    'My views are shallow and I scarcely grasp affairs of state; yet if I may offer whatever poor counsel I have, I beg leave to submit it.',
  ],
  s0102: [
    '" Gaozu issued a gracious edict to explain his intent.',
    '" Gaozu replied with a gracious edict explaining his intent.',
  ],
  s0103: [
    'The crown prince was filial, careful, and heaven-endowed in nature; each time he entered court, before the fifth watch he was already waiting at the city gate for it to open.',
    'The crown prince was naturally filial and dutiful; before the fifth watch each morning he was already waiting at the city gate for it to open.',
  ],
  s0104: [
    'Though residing at leisure in the inner halls of the Eastern Palace, with every sitting and rising he always faced southwest toward the terrace.',
    'Even in the Eastern Palace\'s inner halls at ease, he always faced southwest toward the terrace whenever he sat or rose.',
  ],
  s0105: [
    'If summoned to enter on the eve before, he sat upright through until dawn.',
    'When summoned the night before an audience, he sat upright until dawn.',
  ],
  s0106: [
    'In the third year, third month, he took to his bed with illness.',
    'In the third year, third month, he fell ill and took to his bed.',
  ],
  s0107: [
    'Fearing to burden Gaozu with worry, he ordered his attendants questioned and always personally wrote memorials by hand.',
    'Lest he burden Gaozu with worry, he had his attendants questioned but always wrote memorials by hand himself.',
  ],
  s0108: [
    'When his illness grew somewhat severe, those beside him wished to report it, but he still would not allow it, saying "How could I let the Supreme Sovereign know I am so gravely ill," and thereupon sobbed.',
    'As the illness worsened, his attendants wished to report it, but he forbade them, saying, "How can I let His Majesty know I am so gravely ill?" and wept.',
  ],
  s0109: [
    'On yisi of the fourth month he passed away, age thirty-one.',
    'On yisi of the fourth month he died, aged thirty-one.',
  ],
  s0110: [
    'Gaozu visited the Eastern Palace and mourned there with full grief.',
    'Gaozu came to the Eastern Palace and wept there with full grief.',
  ],
  s0111: [
    'Edict: bury him in full imperial mourning dress.',
    'By edict he was to be enshrouded in full imperial mourning dress.',
  ],
  s0112: [
    'Posthumous name Zhaoming.',
    'His posthumous name was Zhaoming, "Luminous."',
  ],
  s0113: [
    'On gengyin of the fifth month he was buried at Anning Mausoleum.',
    'On gengyin of the fifth month he was buried at Anning Mausoleum.',
  ],
  s0114: [
    'Edict ordered Left Chief Clerk of the Minister of Education Wang Yun to compose the lamentation text, saying:',
    'An edict charged Wang Yun, Left Chief Clerk of the Minister of Education, to compose the funeral elegy. It read:',
  ],
  s0115: [
    'The clam-shell carriage swiftly lifts; dragon-trained steeds step in constrained pace;',
    'The shell-bedecked carriage rises; dragon-harnessed steeds pace in solemn tread;',
  ],
  s0116: [
    'feather fans proceed before; cloud banners drive northward.',
    'feathered fans lead the way; cloud banners bear him north.',
  ],
  s0117: [
    'The emperor mourns the waning radiance of the heir apparent, grieves the withering fragrance of the successor\'s virtue;',
    'The emperor mourns his heir\'s fading radiance and the withering of a successor\'s virtue;',
  ],
  s0118: [
    'before the martial canopy he is desolate in grief; before the armored watchtower his sorrow deepens.',
    'he stands desolate beneath the martial canopy; sorrow deepens before the armored watchtower.',
  ],
  s0119: [
    'Consulting the established canon, he raises the great merit;',
    'He consults the established canon and raises his great merit;',
  ],
  s0120: [
    'edict commands virtue to be written on the pennants, that his emblem may forever be transmitted in the dance tassels.',
    'an edict commands his virtue inscribed on the pennants, his emblem forever borne in the dance tassels.',
  ],
  s0121: [
    'The text says:',
    'The text reads:',
  ],
  s0122: [
    'He bore the twin luminaries of sun and moon—truly the lesser yang;',
    'He bore the twin luminaries—truly the lesser yang;',
  ],
  s0123: [
    'already called the chief heir, and also named the primary worthy.',
    'already hailed as chief heir, and named the primary worthy.',
  ],
  s0124: [
    'His bearing matched heaven\'s height, his splendor rivaled the sun\'s;',
    'His bearing matched heaven\'s height; his splendor rivaled the sun\'s light;',
  ],
  s0125: [
    'he presented sacrifices to extend blessing, guarded the vessel to transmit fragrance.',
    'he offered sacrifice to extend blessing and guarded the vessel to transmit his line.',
  ],
  s0126: [
    'Sagely wisdom received its season; dawn and dusk alike he stood ready;',
    'Sagely wisdom received its season; at dawn and dusk alike he stood ready;',
  ],
  s0127: [
    'outwardly he displayed solemn dignity, inwardly he held harmony and ease.',
    'outwardly solemn, inwardly harmonious and at ease.',
  ],
  s0128: [
    'His insight pierced the subtle workings of fate; his measure embraced the seas within their shores;',
    'His insight pierced fate\'s subtle workings; his measure embraced the seas within their shores;',
  ],
  s0129: [
    'establishing virtue beyond mere vessel, supreme achievement beyond mere stewardship.',
    'he established virtue beyond mere vessel, achievement beyond mere stewardship.',
  ],
  s0130: [
    'Broad-mindedness dwelt in his heart, warmth and reverence formed his nature; following the seasons he showed filial piety and brotherhood, guided by strict respect.',
    'Broad-mindedness dwelt in his heart; warmth and reverence formed his nature; in season he showed filial piety and brotherhood, guided by strict respect.',
  ],
  s0131: [
    'All had planted virtue; kindness and harmony joined in sagely union;',
    'All had planted virtue; kindness and harmony joined in sagely union;',
  ],
  s0132: [
    'the three excellences passed in succession, ten thousand states shared in celebration.',
    'the three excellences passed in succession, and ten thousand states rejoiced together.',
  ],
  s0133: [
    'The carriage constellations veiled their essence; yin and sacrifice slackened to the limit;',
    'The carriage constellations veiled their essence; yin and sacrifice slackened to the limit;',
  ],
  s0134: [
    'grief wound about in affliction, deep sorrow held mourning in its breast.',
    'grief wound about in affliction; deep sorrow held mourning in its breast.',
  ],
  s0135: [
    'Childlike weeping without cease, plain gruel not overflowing;',
    'Childlike weeping without cease; plain gruel scarcely touched his lips;',
  ],
  s0136: [
    'the end of mourning followed beyond a month, yet cries of grief had not ceased.',
    'mourning rites passed beyond a month, yet cries of grief had not ceased.',
  ],
  s0137: [
    'Truly he oversaw instruction, and also succeeded in suburban sacrifice;',
    'Truly he oversaw instruction and also succeeded in suburban sacrifice;',
  ],
  s0138: [
    'inquiring after well-being with solemn care, attending meals with earnest diligence.',
    'he inquired after well-being with solemn care and attended meals with earnest diligence.',
  ],
  s0139: [
    'Golden flowers and jade insignia, dark steeds in ordered wheels;',
    'Golden flowers and jade insignia; dark steeds in ordered wheels;',
  ],
  s0140: [
    'upholding the house and sustaining the state, presiding over sacrifice and securing the people.',
    'upholding house and state, presiding over sacrifice and securing the people.',
  ],
  s0141: [
    'Brilliantly he undertook established tasks; ten thousand affairs were governed by reason;',
    'Brilliantly he undertook established tasks; ten thousand affairs he governed with reason;',
  ],
  s0142: [
    'showing compassion in criminal cases, diligently caring for the frontier markets.',
    'he showed compassion in criminal cases and diligently cared for the frontier markets.',
  ],
  s0143: [
    'Sincerity dwelt in hidden sympathy; his bearing held no anger or delight;',
    'Sincerity dwelt in hidden sympathy; his bearing held no anger or delight;',
  ],
  s0144: [
    'diligent and generous in bestowing favor, closely woven in bonds of grace.',
    'diligent and generous in bestowing favor, closely woven in bonds of grace.',
  ],
  s0145: [
    'From the first he revered his studies, departing from the classics to parse the sentences;',
    'From the first he revered his studies, parsing the classics line by line;',
  ],
  s0146: [
    'setting out the wine cup to honor his teacher, bowing low to await his tutor.',
    'he set out the wine cup to honor his teacher and bowed low to await his tutor.',
  ],
  s0147: [
    'He relied on guidance and practice, not on laborious repeated instruction;',
    'He relied on guidance and practice, not on laborious repeated instruction;',
  ],
  s0148: [
    'breadth and restraint were his charge; timely diligence his task.',
    'breadth and restraint were his charge; timely diligence his task.',
  ],
  s0149: [
    'Discriminating inquiry into emptiness and the subtle, thought probing the hidden and recondite;',
    'He discriminated emptiness and the subtle and probed the hidden and recondite;',
  ],
  s0150: [
    'his spirit ranged through charts and weft-lines, refining the hexagrams\' tracings.',
    'his spirit ranged through charts and weft-lines, refining the hexagrams\' tracings.',
  ],
  s0151: [
    'He pondered the classics of ritual, wandered at ease through the square tablets of texts;',
    'He pondered the classics of ritual and wandered at ease through the square tablets of texts;',
  ],
  s0152: [
    'sated with rich marrow, tasting and chewing the kernels of learning.',
    'sated with rich marrow, tasting and chewing the kernels of learning.',
  ],
  s0153: [
    'He bound the flowing outlines in a pouch, embraced and raised up literary arts;',
    'He bound flowing outlines in a pouch and embraced literary arts;',
  ],
  s0154: [
    'comprehensively covering silk and plain, exhausting the mounds and tombs of antiquity.',
    'comprehensively covering silk and plain, exhausting the mounds and tombs of antiquity.',
  ],
  s0155: [
    'Victorious volumes piled high; Confucian and Mohist schools distinguished;',
    'Victorious volumes piled high; Confucian and Mohist schools distinguished;',
  ],
  s0156: [
    'gazing upon the River to unfold the teaching, looking to Lu to raise its fragrance.',
    'gazing upon the River to unfold the teaching, looking to Lu to raise its fragrance.',
  ],
  s0157: [
    'Chanting and singing the nature of the spirit—was it only a slight skill?',
    'Chanting and singing the nature of the spirit—was it only a slight skill?',
  ],
  s0158: [
    'His compositions were graceful and restrained, following feeling into exquisite beauty.',
    'His compositions were graceful and restrained, following feeling into exquisite beauty.',
  ],
  s0159: [
    'Not a dot to alter in his characters, his brush never paused on the paper;',
    'Not a dot to alter in his characters; his brush never paused on the paper;',
  ],
  s0160: [
    'bold thought flowed like a spring, clear chapters piled like clouds.',
    'bold thought flowed like a spring; clear chapters piled like clouds.',
  ],
  s0161: [
    'He surveyed the talents of the age and netted the flourishing elite;',
    'He surveyed the talents of the age and netted the flourishing elite;',
  ],
  s0162: [
    'learning exhausted thorough mastery, words returned to rich abundance.',
    'his learning exhausted thorough mastery; his words returned to rich abundance.',
  ],
  s0163: [
    'Some excelled in the thickets of discourse, some were praised in the gardens of letters;',
    'Some excelled in discourse; some were praised in the gardens of letters;',
  ],
  s0164: [
    'the four friends promoted virtue, the seven masters blushed at his excellence.',
    'the four friends promoted virtue; the seven masters blushed at his excellence.',
  ],
  s0165: [
    'The imperial park recruited worthies, the flowery pool cherished guests;',
    'The imperial park recruited worthies; the flowery pool cherished guests;',
  ],
  s0166: [
    'riding together in the same carriage, linked chariots with adjoining seats.',
    'riding together in the same carriage, linked chariots with adjoining seats.',
  ],
  s0167: [
    'Unfolding words and displaying ornament, flying goblets and floating brew;',
    'Unfolding words and displaying ornament, flying goblets and floating brew;',
  ],
  s0168: [
    'favor grand as setting out the wine, reward surpassing the gift of jade disks.',
    'favor grand as setting out the wine; reward surpassing the gift of jade disks.',
  ],
  s0169: [
    'His emblematic wind reached far; his flourishing work renewed day by day;',
    'His emblematic wind reached far; his flourishing work renewed day by day;',
  ],
  s0170: [
    'the vessel of benevolence was not heavy, the carriage of virtue easy to follow.',
    'the vessel of benevolence was not heavy; the carriage of virtue easy to follow.',
  ],
  s0171: [
    'His favor flowed to the myriad people; blessing descended on the hundred spirits;',
    'His favor flowed to the myriad people; blessing descended on the hundred spirits;',
  ],
  s0172: [
    'the four quarters admired righteousness, all under heaven returned to benevolence.',
    'the four quarters admired righteousness; all under heaven returned to benevolence.',
  ],
  s0173: [
    'Clouds and creatures proclaimed omens; baleful vapors lifted their images;',
    'Clouds and creatures proclaimed omens; baleful vapors lifted their images;',
  ],
  s0174: [
    'stars dimmed the constant radiance, mountains collapsed into rotting earth.',
    'stars dimmed the constant radiance; mountains collapsed into rotting earth.',
  ],
  s0175: [
    'His numinous bearing ascended as guest on high; his virtuous voice departed far;',
    'His numinous bearing ascended on high; his virtuous voice departed far;',
  ],
  s0176: [
    'the assembled officials have no shade; whom may they consult and on whom rely?',
    'the assembled officials have no shade; whom may they consult and on whom rely?',
  ],
  s0177: [
    'Alas, how mournful!',
    'Alas, how mournful!',
  ],
  s0178: [
    'The emperor\'s heart is stricken with grief, his heart wound about in pain;',
    'The emperor\'s heart is stricken with grief, wound about in pain;',
  ],
  s0179: [
    'the heir\'s descendants wail long, the calyx and petals add to the grief.',
    'the heir\'s descendants wail long; calyx and petals add to the grief.',
  ],
  s0180: [
    'Longing binds close companions, grief moves the common people;',
    'Longing binds close companions; grief moves the common people;',
  ],
  s0181: [
    'sorrow as if the state were perishing, fear as if the ridgepole were breaking.',
    'sorrow as if the state were perishing; fear as if the ridgepole were breaking.',
  ],
  s0182: [
    'Alas, how mournful!',
    'Alas, how mournful!',
  ],
  s0183: [
    'At the head of summer the season opens; the wheat harvest marks its node;',
    'At the head of summer the season opens; the wheat harvest marks its node;',
  ],
  s0184: [
    'the guard of his countenance is suddenly alert, the flowering splendor cast away and ended.',
    'the guard of his countenance is suddenly alert; the flowering splendor cast away and ended.',
  ],
  s0185: [
    'The book curtains hang empty, the discourse mats are dismantled;',
    'The book curtains hang empty; the discourse mats are dismantled;',
  ],
  s0186: [
    'empty offerings of steaming grain, a lone lamp dim and faint.',
    'empty offerings of steaming grain; a lone lamp dim and faint.',
  ],
  s0187: [
    'Alas, how mournful!',
    'Alas, how mournful!',
  ],
  s0188: [
    'The day was chosen by calendrical reckoning, the divination of tortoise and milfoil agreed in auspice;',
    'The day was chosen by calendrical reckoning; tortoise and milfoil divination agreed in auspice;',
  ],
  s0189: [
    'the dark precinct long since opened, the hidden palace presented complete.',
    'the dark precinct long since opened; the hidden palace presented complete.',
  ],
  s0190: [
    'Martial guards aligned in ranks, civil regalia increased in splendor.',
    'Martial guards aligned in ranks; civil regalia increased in splendor.',
  ],
  s0191: [
    'Once he roamed the Zhang and Fu rivers, guests and followers without sound;',
    'Once he roamed the Zhang and Fu rivers, guests and followers without sound;',
  ],
  s0192: [
    'now returning to the outer suburbs, attendants and chariots startle one another.',
    'now returning to the outer suburbs, attendants and chariots startle one another.',
  ],
  s0193: [
    'Alas, how mournful!',
    'Alas, how mournful!',
  ],
  s0194: [
    'Turning his back on the crimson gate-tower he departs far; rolling past the Green Gate he turns slowly;',
    'Turning his back on the crimson gate-tower he departs far; rolling past the Green Gate he turns slowly;',
  ],
  s0195: [
    'pointing along the imperial road yet stopping short before it, gazing toward the capital yet not treading it.',
    'pointing along the imperial road yet stopping short before it, gazing toward the capital yet not treading it.',
  ],
  s0196: [
    'The mound ascends the steep slope in awesome dignity, the plain stretches back in distant expanse;',
    'The mound ascends the steep slope in awesome dignity; the plain stretches back in distant expanse;',
  ],
  s0197: [
    'the thoroughbred\'s hooves enough to make one ache with its bitter whinny, the mourners\' plaintive clank as tears stream down.',
    'the thoroughbred\'s hooves enough to wring the heart with bitter whinny; mourners\' plaintive clank as tears stream down.',
  ],
  s0198: [
    'Alas, how mournful!',
    'Alas, how mournful!',
  ],
  s0199: [
    'Mingling mournful sound with reed-pipes and flutes, changing grief\'s countenance upon heaven and sun;',
    'Mournful pipes and flutes mingle; grief reshapes the face of heaven and sun;',
  ],
  s0200: [
    'though summer trees stand in dense shade, they return to the bleak cold of winter groves.',
    'though summer trees still stand in dense shade, all returns to the bleak cold of winter groves.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_008_b2.mjs <translation.json>'
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
