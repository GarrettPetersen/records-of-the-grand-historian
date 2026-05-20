#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: ['Impromptu music plays.', 'Impromptu music plays.'],
  s0702: ['When the emperor rises, play Huang Ya—Huangzhong playing, Linzhong, Yize, Nanlü, Wushe all participating in response.', 'When the emperor rises, play Huang Ya—Huangzhong playing, Linzhong, Yize, Nanlü, Wushe all participating in response.'],
  s0703: ['Impromptu music plays.', 'Impromptu music plays.'],
  s0704: ['For sacrifice use Song tunes; for feasts follow Liang music—generally taking human and spirit not mixed.', 'For sacrifice use Song tunes; for feasts follow Liang music—generally taking human and spirit not mixed.'],
  s0705: ['Imperial decree: "Approved."', 'Imperial decree: "Approved."'],
  s0706: ['In year 5, ordered Left Assistant Director of the Masters of Writing Liu Ping and Gentleman of Ritual Affairs Zhang Ya to fix southern and northern suburb and Bright Hall ritual regulations.', 'In year 5, ordered Left Assistant Director Liu Ping and Gentleman of Ritual Affairs Zhang Ya to fix southern and northern suburb and Bright Hall ritual regulations.'],
  s0707: ['Changed the Qi music used in Tianjia to all take Shao as name.', 'Changed the Qi music used in Tianjia to all take Shao as name.'],
  s0708: ['Performers in position fixed; pitch-harmonizing adjutant raises the baton; Grand Music Director kneels praising: "Play Mao Shao music."', 'Performers in position fixed; pitch-harmonizing adjutant raises the baton; Grand Music Director kneels praising: "Play Mao Shao music."'],
  s0709: ['Sending down spirits, play Tong Shao;', 'Sending down spirits, play Tong Shao;'],
  s0710: ['When victims enter and exit, play Jie Shao;', 'When victims enter and exit, play Jie Shao;'],
  s0711: ['When the emperor enters the altar and returns to the side hall, play Mu Shao.', 'When the emperor enters the altar and returns to the side hall, play Mu Shao.'],
  s0712: ['Emperor\'s first two bows—dance Seven Virtues; performers holding shields and spears; at song\'s end, repeat and join.', 'Emperor\'s first two bows—dance Seven Virtues; performers holding shields and spears; at song\'s end, repeat and join.'],
  s0713: ['Exit toward the east of the suspension, then dance Nine Sequence; performers holding feathers and flutes.', 'Exit toward the east of the suspension, then dance Nine Sequence; performers holding feathers and flutes.'],
  s0714: ['Presenting goblets to the Heaven spirit and Grand Ancestor\'s seat, play ascent song.', 'Presenting goblets to the Heaven spirit and Grand Ancestor\'s seat, play ascent song.'],
  s0715: ['When the emperor drinks blessing wine, play Jia Shao;', 'When the emperor drinks blessing wine, play Jia Shao;'],
  s0716: ['Approaching the burning outlook, play Bao Shao.', 'Approaching the burning outlook, play Bao Shao.'],
  s0717: ['Down to the eleventh month of year 6, Attendant Cavalier, Left Vice Minister of the Masters of Writing, Marquis of Jianchang Xu Ling, and Gentleman of Ritual Affairs Shen Han memorialized next year\'s New Year assembly ritual regulations, saying Palace Attendant Cai Jingli received the edict: one day before the assembly, Grand Music displays court bell-set, high rope, five stands in the hall courtyard.', 'Down to the eleventh month of year 6, Attendant Cavalier Xu Ling and Gentleman of Ritual Affairs Shen Han memorialized next year\'s New Year assembly ritual regulations, saying Palace Attendant Cai Jingli received the edict: one day before the assembly, Grand Music displays court bell-set, high rope, five stands in the hall courtyard.'],
  s0718: ['When guests enter, play Harmonizing Five Introductions.', 'When guests enter, play Harmonizing Five Introductions.'],
  s0719: ['When the emperor exits, the Palace Gentleman raises the baton in the hall; the music master responds, raising at the steps below—play Kang Shao music.', 'When the emperor exits, the Palace Gentleman raises the baton in the hall; the music master responds, raising at the steps below—play Kang Shao music.'],
  s0720: ['Edict extending to kings and dukes ascending, play Bian Shao.', 'Edict extending to kings and dukes ascending, play Bian Shao.'],
  s0721: ['Presenting jade disks finished, first leading below the hall—playing also the same.', 'Presenting jade disks finished, first leading below the hall—playing also the same.'],
  s0722: ['When the emperor rises, entering the side hall, play Mu Shao.', 'When the emperor rises, entering the side hall, play Mu Shao.'],
  s0723: ['Changing robes and exiting again—playing also the same.', 'Changing robes and exiting again—playing also the same.'],
  s0724: ['When the emperor raises wine, play Sui Shao.', 'When the emperor raises wine, play Sui Shao.'],
  s0725: ['Presenting dishes, play You Shao.', 'Presenting dishes, play You Shao.'],
  s0726: ['When the emperor receives tea and fruit, Grand Master of Ceremonies Assistant kneels requesting advancing dance Seven Virtues, followed by Nine Sequence.', 'When the emperor receives tea and fruit, Grand Master of Ceremonies Assistant kneels requesting advancing dance Seven Virtues, followed by Nine Sequence.'],
  s0727: ['Its impromptu acrobatics took Jin and Song old forms, slightly changed and supplemented.', 'Its impromptu acrobatics took Jin and Song old forms, slightly changed and supplemented.'],
  s0728: ['Formerly the New Year assembly had yellow dragon transformation, patterned deer, lion and similar types—in Taijian early fixed regulations, all were removed.', 'Formerly the New Year assembly had yellow dragon transformation, patterned deer, lion and similar types—in Taijian early fixed regulations, all were removed.'],
  s0729: ['At this time Cai Jingli memorialized—all were restored.', 'At this time Cai Jingli memorialized—all were restored.'],
  s0730: ['Its regulation: one impromptu music section sixteen persons—then thirteen xiao players, two jia players, one drum player.', 'Its regulation: one impromptu music section sixteen persons—thirteen xiao players, two jia players, one drum player.'],
  s0731: ['Eastern Palace one section, reduced three persons—xiao reduced two, jia reduced one.', 'Eastern Palace one section, reduced three persons—xiao reduced two, jia reduced one.'],
  s0732: ['Kings one section, again reduced one person, xiao reduced one.', 'Kings one section, again reduced one person, xiao reduced one.'],
  s0733: ['Common surname one section, again reduced one person, again xiao reduced one.', 'Common surname one section, again reduced one person, again xiao reduced one.'],
  s0734: ['When the Later Lord succeeded, indulging in wine, outside court audiences mostly at banquets.', 'When the Later Lord succeeded, indulging in wine, outside court audiences mostly at banquets.'],
  s0735: ['Especially valuing sound and music, sending palace women to learn northern xiao and drums, called Dai Bei—when deep in wine then playing it.', 'Especially valuing sound and music, sending palace women to learn northern xiao and drums, called Dai Bei—when deep in wine then playing it.'],
  s0736: ['Also among clear music made Yellow Oriole Staying, Jade Tree Courtyard Flower, Golden Hairpin Two Arms Hanging and other tunes—with favorite ministers composing their song texts, ornate and lofty mutually surpassing, extreme in lightness and frivolity.', 'Also among clear music made Yellow Oriole Staying, Jade Tree Courtyard Flower, Golden Hairpin Two Arms Hanging and other tunes—with favorite ministers composing their song texts, ornate and lofty mutually surpassing, extreme in lightness and frivolity.'],
  s0737: ['Men and women singing in alternation—its sound very mournful.', 'Men and women singing in alternation—its sound very mournful.'],
};

const targetPath = process.argv[2];
if (!targetPath) { console.error('Usage: node suishu-013-batch8.mjs <file>'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;
for (const s of data.sentences) { const pair = T[s.id]; if (pair) { s.literal = pair[0]; s.idiomatic = pair[1]; patched++; } }
fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);
