import fs from 'fs';
const p = 'translations/current_translation_jinshu.json';
const d = JSON.parse(fs.readFileSync(p, 'utf8'));
const P = {
  s0901: [
    'Lun was truly base and foolish; he dared steal the dragon chart, violate constant norms, and usurp the throne—swiftly he met stern execution.',
    'Lun was a dull criminal who seized the dragon throne and paid at once with execution.'
  ],
  s0902: [
    'How grand—Wu Min!',
    'The Grand Prince Wu Min!'
  ],
  s0903: [
    'He first devised the grand plan.',
    'He struck first for the righteous cause.'
  ],
  s0904: [
    'Yet virtue was not established—how truly lamentable!',
    'Virtue never matched ambition—a bitter pity.'
  ],
  s0905: [
    'Changsha served the state; from first to last he harbored no hidden evil.',
    'The Prince of Changsha served loyally without secret treachery.'
  ],
  s0906: [
    'Merit lacked one basket-load—suddenly he fell to brutal bandits.',
    'Victory was one basket short—then rebels cut him down.'
  ],
  s0907: [
    'Zhangdu (Ying) rallied to aid the king—deeds were achieved and fame raised.',
    'Zhangdu\'s Ying mobilized for the sovereign and won renown.'
  ],
  s0908: [
    'He allied west of the passes, defied obedience and strove for supremacy—affairs exhausted, straits pressed—both ended in rebellion and ruin.',
    'West-of-the-pass alliance turned into defiance—both camps collapsed together.'
  ],
  s0909: [
    'Yuanchao served as regent—campaigning abroad and comforting within—ruining the state and losing armies—lordless toward his prince, alarming his sovereign.',
    'Yuanchao\'s Yue steered court and campaign yet ruined armies, snubbed his emperor, and terrified the throne.'
  ],
  s0910: [
    'The transformation of burning annihilation—perhaps nothing but what he invited himself.',
    'That fiery ending—nothing but self-invited ruin.'
  ]
};
for (const [id, v] of Object.entries(P)) {
  const s = d.sentences.find((x) => x.id === id);
  if (!s) {
    console.error('missing', id);
    process.exit(1);
  }
  s.literal = v[0];
  s.idiomatic = v[1];
}
fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
console.log('patched', Object.keys(P).length);
