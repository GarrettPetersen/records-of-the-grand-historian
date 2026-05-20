/** Fix scorer flags: remove Chinese characters from idiomatic in s0010, s0015, s0017 */
export default {
  s0010: {
    literal: 'Wood within the Dipper is the character "Zhu."',
    idiomatic: '"Wood inside the Dipper forms the character Zhu."',
  },
  s0015: {
    literal:
      'At the time enthusiasts interpreted: "Two-horned calf—that is niu (ox); surely one surnamed Niu will undermine Tang\'s mandate."',
    idiomatic:
      'Contemporaries read it thus: "A two-horned calf is an ox—surely someone surnamed Niu will overturn Tang\'s mandate."',
  },
  s0017: {
    literal:
      'But the character Zhu has "ba" (eight) beneath "niu"—eight is the image of horn—so Zhu Tao and Zhu Ci brought calamity of disorder hoping for undeserved fortune, little knowing it foretold the Emperor.',
    idiomatic:
      'Yet in the character Zhu the element for "ox" stands above "eight"—eight being the sign of horns—so Zhu Tao and Zhu Ci stirred rebellion hoping for a throne that was not theirs, never guessing the omen pointed to the Emperor himself.',
  },
};
