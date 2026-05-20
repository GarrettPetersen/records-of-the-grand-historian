#!/usr/bin/env node
import fs from 'node:fs';
const T = {
  "s1101": [
    "The first is Imperial Teacher; second Imperial Friend; third Three Dukes; fourth Erudite; fifth Grand Historian.",
    "First Imperial Teacher, second Friend, third Three Dukes, fourth Erudite, fifth Historian."
  ],
  "s1102": [
    "These five constantly settle the emperor's doubtful deliberations.",
    "These five settle the emperor's doubts."
  ],
  "s1103": [
    "When stars are bright, large, and lustrous, the realm is greatly governed; if horned, calamity is within.",
    "Bright large stars mean great order; horns mean inner calamity."
  ],
  "s1104": [
    "Three stars south of Five Feudal Lords are called Celestial Goblet—it stores gruel to supply proper food and drink.",
    "Three Celestial Goblet stars south supply proper food and drink."
  ],
  "s1105": [
    "Accumulated Firewood is one star east of Accumulated Water—it supplies the kitchen's proper provision.",
    "Accumulated Firewood east of Accumulated Water feeds the kitchen."
  ],
  "s1106": [
    "Water Level is four stars east of Eastern Well—it governs water balance.",
    "Four Water Level stars east of Well govern water balance."
  ],
  "s1107": [
    "If a guest star or water or fire lodges or invades, hundred streams overflow.",
    "Guest star or water-fire strike makes streams overflow."
  ],
  "s1108": [
    "Xuanyuan is seventeen stars north of Seven Stars.",
    "Seventeen Xuanyuan stars north of Seven Stars."
  ],
  "s1109": [
    "Xuanyuan is the god of the Yellow Emperor, the body of the yellow dragon.",
    "Xuanyuan is Yellow Emperor's god, the yellow dragon's body."
  ],
  "s1110": [
    "Mistress of empresses and consorts—the office of scholars.",
    "Mistress of empresses; scholars' office."
  ],
  "s1111": [
    "Also called Eastern Mound; also Power Star—it governs the god of thunder and rain.",
    "Also Eastern Mound and Power Star, thunder-rain god."
  ],
  "s1112": [
    "The great southern star is the empress.",
    "The great southern star is empress."
  ],
  "s1113": [
    "The next northern star is consort.",
    "Next north is consort."
  ],
  "s1114": [
    "Next—general.",
    "Next is general."
  ],
  "s1115": [
    "The stars below are all subordinate consorts.",
    "Lower stars are subordinate consorts."
  ],
  "s1116": [
    "A small star south of the empress is Female Attendant.",
    "Empress's southern small star is Female Attendant."
  ],
  "s1117": [
    "One star left is Lesser People—lesser empress clan.",
    "Left Lesser People star is lesser empress clan."
  ],
  "s1118": [
    "One star right is Greater People—empress dowager clan.",
    "Right Greater People star is dowager clan."
  ],
  "s1119": [
    "They should be yellow, small, and bright.",
    "They should appear yellow, small, and bright."
  ],
  "s1120": [
    "Three stars south of Xuanyuan's right horn are called Wine Banner—the banner of wine officials, governing feasts and banquets.",
    "Three Wine Banner stars south govern feasts."
  ],
  "s1121": [
    "If five planets guard Wine Banner, great feasting across the realm, wine, meat, goods, bestowals like ennobling the imperial clan.",
    "Five planets at Wine Banner bring realm-wide feasts and imperial gifts."
  ],
  "s1122": [
    "Two stars south of Wine Banner are called Celestial Minister—the image of the Chancellor.",
    "Two Celestial Minister stars south image the Chancellor."
  ],
  "s1123": [
    "Four stars west of Xuanyuan are called Signal Fire—signal fires are beacon fires, frontier post warnings.",
    "Four Signal Fire stars west are frontier beacon warnings."
  ],
  "s1124": [
    "Four stars north of Signal Fire are called Inner Peace.",
    "Four Inner Peace stars north judge crimes."
  ],
  "s1125": [
    "Lesser Supreme is four stars west of Supreme Palace—the position of scholar-officials.",
    "Four Lesser Supreme stars west are scholar-officials' seats."
  ],
  "s1126": [
    "Also called Recluse Scholar; also the Son of Heaven's deputy ruler; or said to be erudite officials.",
    "Also Recluse Scholar, deputy ruler, or erudites."
  ],
  "s1127": [
    "Also said to govern guarding the side gates.",
    "Also guards side gates."
  ],
  "s1128": [
    "Southern first star Recluse; second Counselor; third Erudite; fourth Grand Master.",
    "South: Recluse, Counselor, Erudite, Grand Master."
  ],
  "s1129": [
    "Bright, large, and yellow—worthy men are raised.",
    "Bright yellow stars raise worthy men."
  ],
  "s1130": [
    "If the moon or five planets invade or lodge there, recluses and the empress are troubled, the Chancellor changes.",
    "Moon or five planets there trouble recluses and empress and change the Chancellor."
  ],
  "s1131": [
    "Four southern stars are called Long Wall—they govern boundaries and Hu and barbarians.",
    "Four Long Wall stars south govern borders and barbarians."
  ],
  "s1132": [
    "If Mars enters, Hu enter China.",
    "Mars entering brings Hu into China."
  ],
  "s1133": [
    "If Venus enters, the Nine Ministers plot.",
    "Venus entering makes Nine Ministers plot."
  ]
};
const p=process.argv[2]; if(!p)process.exit(1);
const d=JSON.parse(fs.readFileSync(p,'utf8')); let c=0;
for(const s of d.sentences){const x=T[s.id];if(x){s.literal=x[0];s.idiomatic=x[1];c++;}}
fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n'); console.log('Patch',c);
