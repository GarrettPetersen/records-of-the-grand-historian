#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'I accepted the commission without demur, truly intending to repay it with service.',
    'I took the commission without hesitation, meaning to repay it in full.',
  ],
  s0302: [
    'I meant to plant my banners on Song and Hua, raise my standards in Ji and Zhao, sweep away and cleanse Liu Yi, and restore order under Heaven—',
    'I meant to plant banners on Song and Hua, raise standards in Ji and Zhao, sweep the land clean, and set the realm right—',
  ],
  s0303: [
    'Your Majesty would cross the river in court robes, announce completion at the Eastern Peak, make Great Liang equal in splendor to Xuanyuan and Huangdi, and I would rank with Yi Yin and Lü Shang in merit, grace the generations after, and leave my name in the annals—this was truly my life\'s ambition.',
    'You would cross the river in court robes, proclaim victory at the Eastern Peak, lift Great Liang to the glory of Xuanyuan and Huangdi, and I would stand beside Yi Yin and Lü Shang in fame—blessing posterity, my name in the histories. That was my life\'s wish.',
  ],
  s0304: [
    'Yet Your Majesty wanted to share the credit, would not grant me free command, had me strike Hebei while intending to raise Xu Province yourself, sent the weak and timid Zhenyáng, put arrogant and greedy Hu and Zhao in charge—and at the first sight of banners and drums they scattered like birds and broke like fish. Murong Shaozong rode the victory in a sweeping tide, and every fortress at Woyang cast off its armor.',
    'Yet you wanted to share the glory, withheld full command, sent me against Hebei while you meant to raise Xu yourself, put timid Zhenyáng in the field and arrogant, greedy Hu and Zhao in charge—and at the first drum they broke like fish in a net. Murong Shaozong swept the victory onward, and every Woyang garrison threw down its arms.',
  ],
  s0305: [
    'Thunder comes too fast to cover the ears; scattered ground cannot be held firm. You left me disheveled, stripped of position, my wife and children slaughtered—this is how deeply Your Majesty has wronged me.',
    'Thunder strikes before you can cover your ears; scattered ground cannot be held. You left me ruined and bereft, my wife and children killed—this is how deeply you have wronged me.',
  ],
  s0306: [
    'This was fault two.',
    'That was the second fault.',
  ],
  s0307: [
    'Wei An held Shouyang with fewer than a regiment; Murong\'s army was savage and sharp, intending to water their horses in the Yangtze. Had I not withdrawn to hold the Huai south, their momentum could not have been gauged.',
    'Wei An held Shouyang with less than a brigade while Murong\'s fierce troops meant to water their horses in the Yangtze. Had I not fallen back to the south Huai, no one could have guessed what would follow.',
  ],
  s0308: [
    'Once he fled, the borderlands found peace, and Your Majesty made me governor of this province as a barrier defense.',
    'Once he fled the border quieted, and you made me governor here as a frontier shield.',
  ],
  s0309: [
    'I was just gathering the embers, comforting and settling the survivors, sharpening troops and feeding horses, to renew the fight, bury the dead of Hanshan, and wash away the shame of Woyang.',
    'I was gathering the survivors, settling the people, sharpening arms and feeding horses, to fight again—bury Hanshan\'s dead and wipe away Woyang\'s shame.',
  ],
  s0310: [
    'Your Majesty lost your spirit and could no longer hold resolve; you believed Zhenyáng\'s false reports and again sought peace.',
    'You lost heart entirely, believed Zhenyáng\'s lying dispatches, and again sued for peace.',
  ],
  s0311: [
    'I repeatedly stated my firm view, yet you shut your ears in suspicion and would not listen.',
    'I argued again and again, yet you closed your ears in suspicion and refused to hear me.',
  ],
  s0312: [
    'To turn about like this—even a child would be ashamed;',
    'To flip back and forth like this—even a child would blush;',
  ],
  s0313: [
    'how much more a sovereign, whose virtue should not waver.',
    'how much more a ruler whose word should stand firm.',
  ],
  s0314: [
    'This was fault three.',
    'That was the third fault.',
  ],
  s0315: [
    'Cowardice and delay in the field have fixed military law.',
    'Cowardice and delay on campaign are punished by fixed military law.',
  ],
  s0316: [
    'Ziyu suffered a small defeat and was put to death by Chu;',
    'Ziyu lost a minor battle and Chu put him to death;',
  ],
  s0317: [
    'Wang Hui broke discipline and was executed by Han.',
    'Wang Hui violated command and Han executed him.',
  ],
  s0318: [
    'Zhenyáng had tens of thousands in fine armor, weapons piled like hills; Murong\'s light troops numbered fewer than a hundred chariots—and yet Zhenyáng could not resist and was taken captive.',
    'Zhenyáng had tens of thousands in fine armor and weapons heaped like hills; Murong\'s light force was less than a hundred chariots wide—yet Zhenyáng could not hold and was taken alive.',
  ],
  s0319: [
    'As the Emperor\'s own nephew, bound face-forward in the enemy camp, he should have been struck from the clan rolls and offered as blood on the war drums.',
    'As the Emperor\'s own nephew, bound before the enemy, he should have been cut from the clan register and offered to the war drums.',
  ],
  s0320: [
    'Your Majesty never pursued blame; pitying his bare survival, you meant to trade me for him.',
    'You never held him to account; pitying his survival, you meant to trade me away for him.',
  ],
  s0321: [
    'Is this how a sovereign\'s law should run?',
    'Is this how a ruler\'s law should work?',
  ],
  s0322: [
    'This was fault four.',
    'That was the fourth fault.',
  ],
  s0323: [
    'Xuanchuo was a great frontier prefecture, anciently called Ru and Ying.',
    'Xuanchuo was a great frontier command, anciently known as Ru and Ying.',
  ],
  s0324: [
    'I brought the whole province over in submission, yet Yang Yaren stubbornly refused to enter;',
    'I brought the whole province over to you, yet Yang Yaren would not enter it;',
  ],
  s0325: [
    'and once he entered, he abandoned it for no cause. Your Majesty never reproached him and had him return to North Si.',
    'and once he did enter, he abandoned it for no reason. You never blamed him and sent him back to North Si.',
  ],
  s0326: [
    'Yaren abandoned it without penalty; I gained it without credit.',
    'Yaren lost it without punishment; I took it without reward.',
  ],
  s0327: [
    'This was fault five.',
    'That was the fifth fault.',
  ],
  s0328: [
    'My withdrawal from Woyang was no fault of battle—it came from Your Majesty and your ministers jointly misleading one another.',
    'My retreat from Woyang was no defeat in the field—it came from you and your ministers misleading one another.',
  ],
  s0329: [
    'Yet he returned to Shouyang without a trace of shame, reverently serving the court, hiding evil and proclaiming good.',
    'Yet he returned to Shouyang unashamed, dutiful toward the court, hiding faults and praising virtues.',
  ],
  s0330: [
    'Yaren knew he had abandoned the province; grinding his teeth in regret, ashamed and afraid within, he then reported that I meant to rebel.',
    'Yaren knew he had abandoned the province; gnashing his teeth in shame and fear, he then reported that I meant to rebel.',
  ],
  s0331: [
    'Rebellion should leave traces—what proof was there?',
    'Rebellion ought to leave signs—what evidence was there?',
  ],
  s0332: [
    'The slander came so abruptly, yet Your Majesty never examined it and silently believed.',
    'The accusation came out of nowhere, yet you never investigated and silently believed it.',
  ],
  s0333: [
    'How can one who bears the greatest crime of false accusation still serve the lord shoulder to shoulder?',
    'How can a man guilty of the gravest slander still stand beside his lord in service?',
  ],
  s0334: [
    'This was fault six.',
    'That was the sixth fault.',
  ],
  s0335: [
    'Zhao Bochao was promoted though utterly without talent; as a frontier governor he only plundered the people and amassed troops and horses—not to serve the state but to enrich himself, bribing the powerful for fame bought at a price.',
    'Zhao Bochao was raised from nothing though he had no ability; as a frontier governor he preyed on the people and hoarded troops and horses—not to serve the state but to make himself rich, bribing the powerful and buying a name.',
  ],
  s0336: [
    'Zhu Yi and his kind, having amassed gold and shells, made all call Hu and Zhao the equals of Guan and Zhang of old, deceiving Heaven\'s ear into taking it for truth.',
    'Zhu Yi and his circle, fat with gold and treasure, made everyone call Hu and Zhao the equals of Guan and Zhang, deceiving the throne into believing it.',
  ],
  s0337: [
    'At Hanshan he brought courtesans in his train; at the first enemy drum he fled with his concubines, not waiting for Zhenyáng—so not a single wheel returned.',
    'At Hanshan he brought singing girls with him; at the first enemy drum he fled with his concubines, never waiting for Zhenyáng—not one chariot wheel came back.',
  ],
  s0338: [
    'For this crime he deserved execution to the ninth degree;',
    'For that crime he deserved death to the ninth degree of kin;',
  ],
  s0339: [
    'yet after bribing the palace eunuchs he returned to his provincial post.',
    'yet after bribing the inner court he returned to his provincial post.',
  ],
  s0340: [
    'Bochao went unpunished—what reckoning did my merit receive?',
    'Bochao went free—what credit did my service receive?',
  ],
  s0341: [
    'When reward and punishment have no rule, how can there be a state?',
    'When reward and punishment have no order, how can a state endure?',
  ],
  s0342: [
    'This was fault seven.',
    'That was the seventh fault.',
  ],
  s0343: [
    'I have always governed strictly without seizing property; market tolls were all remitted, and the people of Shouyang enjoyed real relief.',
    'I have always ruled strictly and taken nothing from the people; market taxes were all waived, and the folk of Shouyang knew real relief.',
  ],
  s0344: [
    'Pei Zhidi and others who garrisoned there feared my oversight and fled home without cause;',
    'Pei Zhidi and others who helped garrison there feared my discipline and fled home without cause;',
  ],
  s0345: [
    'and again reported that I meant to rebel.',
    'and again reported that I meant to rebel.',
  ],
  s0346: [
    'Your Majesty did not punish their dereliction but instead swallowed their soaked-in slander.',
    'You did not punish their desertion but swallowed their dripping slander instead.',
  ],
  s0347: [
    'Treat me thus—where could I find peace?',
    'Treat me like this—where could I rest secure?',
  ],
  s0348: [
    'This was fault eight.',
    'That was the eighth fault.',
  ],
  s0349: [
    'Though my talent falls short of the ancients, I have seen much service; from youth to age, leading people and troops, I have seldom moved without a plan left behind.',
    'Though I am no match for the ancients in talent, I have seen much of war; from youth to age, leading people and armies, I have rarely acted without a plan that held.',
  ],
  s0350: [
    'Since I submitted to the Way, I have poured out loyal counsel—yet every memorial was blocked.',
    'Since I submitted to your court I have poured out loyal counsel—yet every memorial was stifled.',
  ],
  s0351: [
    'Zhu Yi monopolized military decisions; Zhou Shizhen controlled arms; Lu Yan and Xu Lin managed grain and cloth—all openly demanding bribes, without which no order would pass.',
    'Zhu Yi ruled the armies alone; Zhou Shizhen held all weapons; Lu Yan and Xu Lin controlled grain and cloth—all openly asking for bribes, and nothing moved without payment.',
  ],
  s0352: [
    'The truth beyond the borders was decided in the Secretariat;',
    'The enemy\'s strength beyond the border was decided in the Secretariat;',
  ],
  s0353: [
    'generals were chosen and campaigns launched only after reports reached the chief clerk\'s desk.',
    'generals were chosen and armies sent out only after reports reached the chief clerk\'s desk.',
  ],
  s0354: [
    'I bribed no one at court, and so was constantly overruled.',
    'I paid no one in the inner court, and so was constantly overruled.',
  ],
  s0355: [
    'This was fault nine.',
    'That was the ninth fault.',
  ],
  s0356: [
    'Poyang garrisoned Hefei, bordering my territory.',
    'Poyang held Hefei on my border.',
  ],
  s0357: [
    'I honored him as imperial kin and always showed respect;',
    'I treated him as imperial kin and always showed respect;',
  ],
  s0358: [
    'yet the heir prince was timid and cowardly, shamming defense; whenever I had business he attacked—sometimes crying that I rebelled, sometimes reporting petty faults.',
    'yet the heir prince was timid and cowardly, pretending to guard the frontier; whenever I had business he attacked—sometimes crying rebellion, sometimes reporting petty faults.',
  ],
  s0359: [
    'Winning loyalty requires courtesy—how can the loyal and fierce endure such treatment!',
    'Winning men requires courtesy—how can the loyal and fierce bear such treatment!',
  ],
  s0360: [
    'This was fault ten.',
    'That was the tenth fault.',
  ],
  s0361: [
    'The remaining counts cannot all be listed.',
    'The rest cannot all be set down here.',
  ],
  s0362: [
    'Advancing or retreating I walked a narrow gorge, memorial after memorial.',
    'Whether I advanced or withdrew I stood in peril, memorial after memorial.',
  ],
  s0363: [
    'My words were blunt and my tone hard, touching the dragon\'s scales—so a stern edict was issued and I was marked for attack.',
    'My words were blunt and my tone fierce, touching the dragon\'s scales—so a stern edict came down and I was marked for attack.',
  ],
  s0364: [
    'Even Shun in pure filial piety fled his brutal father\'s staff;',
    'Even Shun, filial to the core, fled his brutal father\'s beating;',
  ],
  s0365: [
    'Zhao Dun the loyal worthy did not pursue the regicide.',
    'Zhao Dun the loyal minister did not hunt the king-killer.',
  ],
  s0366: [
    'What kinship or crime do I have, that I should sit and accept annihilation?',
    'What kinship or crime do I have, that I should sit still and be destroyed?',
  ],
  s0367: [
    'Han Xin was a towering hero who destroyed Xiang Yu and helped Han rule—yet in the end a woman boiled him alive, and only then did he regret ignoring Kuai Tong\'s counsel.',
    'Han Xin was a towering hero who overthrew Xiang Yu and helped Han rule—yet in the end a woman boiled him alive, and only then did he regret ignoring Kuai Tong.',
  ],
  s0368: [
    'Whenever I read that in the histories, I laugh in my heart.',
    'Whenever I read that in the histories I laugh to myself.',
  ],
  s0369: [
    'How could I follow that overturned cart and please Your Majesty\'s flatterers?',
    'How could I follow that overturned cart and please your sycophants?',
  ],
  s0370: [
    'Therefore I have raised the armor of Jinyang, crossed the Yangtze in disorder, hoping to ascend the red steps, tread the court stones, speak wrong and right with my mouth, mark good and ill with my hand, execute the evil ministers at the sovereign\'s side, cleanse the state\'s chaff from government, then return to guard the frontier and keep my loyalty—this is my deepest wish.',
    'So I have raised the armies of Jinyang, crossed the Yangtze in force, hoping to climb the red steps, stand on the court stones, speak wrong and right aloud, mark good and ill with my hand, kill the evil ministers at your side, purge the state\'s rotten policy, then return to guard the frontier and keep my loyalty—that is my deepest wish.',
  ],
  s0371: [
    'On the first day of the third month, inside the city flames and drums rose because Jing had broken the treaty; then Yang Yaren, Liu Jingli, and the Poyang heir Si marched against the East Palace quarter\'s north wall.',
    'On the first day of the third month the city raised beacon fires and drums because Jing had broken the treaty; then Yang Yaren, Liu Jingli, and the Poyang heir Si advanced on the north wall of the East Palace quarter.',
  ],
  s0372: [
    'Their ramparts were not yet finished when Jing\'s general Song Zixian struck them; they were routed, and thousands died drowning in the Huai.',
    'Their palisades were not yet up when Jing\'s general Song Zixian struck them; they were routed, and thousands drowned in the Huai.',
  ],
  s0373: [
    'The rebels sent the severed heads to the palace gate.',
    'The rebels sent the heads to the palace gate.',
  ],
  s0374: [
    'Jing again sent Yu Ziyue to renew the plea for peace.',
    'Jing again sent Yu Ziyue to ask for peace once more.',
  ],
  s0375: [
    'The court sent Censor-in-Chief Shen Jun to Jing\'s camp; Jing had no intent to leave, and Jun pressed him hard.',
    'The court sent Censor-in-Chief Shen Jun to Jing\'s camp; Jing had no thought of leaving, and Jun pressed him hard.',
  ],
  s0376: [
    'Jing flew into rage, dammed the water before the Stone Gate, assaulted from a hundred directions day and night without rest, and the city fell.',
    'Jing flew into rage, broke the water before the Stone Gate, and assaulted from a hundred directions day and night without pause until the city fell.',
  ],
  s0377: [
    'Then he plundered the imperial regalia and palace women, gathered princes and court officials into Yongfu Province, and stripped both palaces of their guards.',
    'Then he looted the imperial carriage and regalia and the palace women, gathered princes and court officials into Yongfu Province, and stripped both palaces of their guards.',
  ],
  s0378: [
    'He put Wang Wei in Wude Hall, garrisoned Yu Ziyue in the Eastern Hall of Taiji, forged an edict of general amnesty, and made himself Grand Commander of all armies at home and abroad, Recorder of the Masters of Writing—with his prior posts as Palace Attendant, Commissioner Bearing the Staff, Grand Chancellor, and Prince unchanged.',
    'He put Wang Wei in Wude Hall, garrisoned Yu Ziyue in the Eastern Hall of Taiji, forged a general amnesty, and made himself Grand Commander of all armies at home and abroad and Recorder of the Masters of Writing—keeping his posts as Palace Attendant, Commissioner Bearing the Staff, Grand Chancellor, and Prince.',
  ],
  s0379: [
    'At first corpses piled in the city too fast to bury; some dead unshrouded, some not yet dead—Jing gathered them all and burned them, and the stench carried ten li.',
    'At first corpses piled in the city faster than they could be buried; some dead and unshrouded, some not yet dead—Jing gathered them all and burned them, and the stench carried more than ten li.',
  ],
  s0380: [
    'Palace Attendant for External Armies Bao Zheng lay gravely ill; rebels dragged him out and burned him, twisting in the flames a long while before he died.',
    'Palace Attendant for External Armies Bao Zheng lay gravely ill; rebels dragged him out and burned him alive, writhing in the fire a long while before he died.',
  ],
  s0381: [
    'The relief armies then dispersed.',
    'The relief armies then broke apart.',
  ],
  s0382: [
    'Jing forged an edict: "Recently wicked ministers seized command and nearly destroyed the state; thanks to the Chancellor\'s timely rise to assist Us in person, frontier generals and provincial governors may each resume their original posts.',
    'Jing forged an edict: "Recently wicked ministers seized command and nearly destroyed the state; thanks to the Chancellor\'s timely rise to assist Us in person, frontier generals and provincial governors may each resume their original posts.',
  ],
  s0383: [
    '" He demoted Xiao Zhengde to Palace Attendant and Grand Marshal; all officials resumed their posts.',
    '" He demoted Xiao Zhengde to Palace Attendant and Grand Marshal, and all officials resumed their posts.',
  ],
  s0384: [
    'Jing sent Dong Shaoxian to storm Guangling; Inspector of South Yanzhou, Prince Huili of Nankang, surrendered the city.',
    'Jing sent Dong Shaoxian to strike Guangling; Prince Huili of Nankang, inspector of South Yanzhou, surrendered the city.',
  ],
  s0385: [
    'Jing made Shaoxian Inspector of South Yanzhou.',
    'Jing made Shaoxian inspector of South Yanzhou.',
  ],
  s0386: [
    'Earlier, Inspector of North Yanzhou Marquis Zhi of Dingxiang, Marquis Tui of Xiangtan, and former Inspector of Tongzhou Guo Feng had raised troops together to march to the relief.',
    'Earlier Marquis Zhi of Dingxiang, inspector of North Yanzhou, Marquis Tui of Xiangtan, and former Tongzhou inspector Guo Feng had raised troops together to march to the relief.',
  ],
  s0387: [
    'Now Feng plotted to hand Huaiyin to Jing; Zhi and the others could not stop him and all fled to Wei.',
    'Now Feng plotted to hand Huaiyin to Jing; Zhi and the others could not restrain him and all fled to Wei.',
  ],
  s0388: [
    'Jing made Xiao Nongzhang Inspector of North Yanzhou; the province\'s people raised troops to resist. Jing sent Colonel Qiu Ziying and Direct Gate General Yang Hai to aid him; Hai killed Ziying and led his army to surrender to Wei, and Wei then held Huaiyin.',
    'Jing made Xiao Nongzhang inspector of North Yanzhou; the province\'s people raised troops to resist. Jing sent Colonel Qiu Ziying and Direct Gate General Yang Hai to aid him; Hai killed Ziying, led his army to surrender to Wei, and Wei then held Huaiyin.',
  ],
  s0389: [
    'Jing again sent Commandants Yu Ziyue and Zhang Dahei into Wu; Administrator of Wu Commandery Yuan Junzheng welcomed them and surrendered.',
    'Jing again sent Commandants Yu Ziyue and Zhang Dahei into Wu; Wu commandery administrator Yuan Junzheng welcomed them and surrendered.',
  ],
  s0390: [
    'When Ziyue and the others arrived they ravaged Wu, requisitioning wildly, seizing sons and daughters, brutalizing the people—every man in Wu nursed rage, and each district raised palisades to resist.',
    'When Ziyue and the others arrived they ravaged Wu, requisitioning at will, seizing sons and daughters, brutalizing the people—every man in Wu nursed rage, and each district raised palisades to resist.',
  ],
  s0391: [
    'That month Jing shifted camp to West Province and sent Commandant Ren Yue as Southern Route Mobile Headquarters, garrisoning Gushu.',
    'That month Jing moved camp to West Province and sent Commandant Ren Yue as Southern Route Mobile Headquarters to garrison Gushu.',
  ],
  s0392: [
    'In the fifth month Gaozu died in Wende Hall.',
    'In the fifth month Gaozu died in Wende Hall.',
  ],
  s0393: [
    'When the Terrace City fell, Jing first sent Wang Wei and Chen Qing to call on Gaozu. Gaozu asked, "Where is Jing now?',
    'When the Terrace City fell, Jing first sent Wang Wei and Chen Qing to call on Gaozu. Gaozu asked, "Where is Jing now?',
  ],
  s0394: [
    'Summon him here."',
    'Summon him here."',
  ],
  s0395: [
    'Gaozu sat in Wende Hall; Jing then came to court with five hundred armored men as escort, wearing his sword as he ascended the hall.',
    'Gaozu sat in Wende Hall; Jing then came to court with five hundred armored men as escort, sword at his side as he climbed the steps.',
  ],
  s0396: [
    'After the bow Gaozu asked, "You have been long in the field—is it not weary work?"',
    'After the bow Gaozu asked, "You have been long in the field—is the work not wearying?"',
  ],
  s0397: [
    'Jing was silent.',
    'Jing said nothing.',
  ],
  s0398: [
    'Again he asked, "What province are you from, that you dare come here?"',
    'Again he asked, "What province are you from, that you dare come here?"',
  ],
  s0399: [
    'Jing could not answer; a follower replied for him.',
    'Jing could not answer; a follower answered for him.',
  ],
  s0400: [
    'On leaving, he said to Colonel Wang Senggui: "I have often sat my saddle facing the enemy, arrows and blades falling together, yet my spirit stayed easy—I had no fear at all.',
    'On leaving, he said to Colonel Wang Senggui: "I have often sat my saddle facing the enemy, arrows and blades falling together, yet my spirit stayed easy—I had no fear at all.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_056_b4.mjs <translation.json>'
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
