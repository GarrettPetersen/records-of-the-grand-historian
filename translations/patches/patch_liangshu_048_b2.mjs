#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'After four years in office he was summoned as Left Director of the Department of State Affairs.',
    'After four years he was recalled as Left Director of the Secretariat.',
  ],
  s0102: [
    'When Zhen left and returned, though among kin he left nothing, he alone sent gifts to former Secretariat Director Wang Liang.',
    'Leaving office he gave nothing to kin but sent gifts to former Director Wang Liang.',
  ],
  s0103: [
    'When Zhen served in Qi he and Liang had been colleagues in the same office as gentlemen; they were old friends, and now Liang had been cast aside and was at home.',
    'In Qi he and Liang had been colleagues and friends; now Liang was dismissed at home.',
  ],
  s0104: [
    'Zhen himself had welcomed the royal army and aimed at the hubs of power; when his hopes were not fulfilled he was often discontent, and so he privately drew close to Liang to set the times aright, as it were.',
    'Zhen had welcomed the royal army hoping for high power; unfulfilled, he grew resentful and privately befriended Liang to rebalance the times.',
  ],
  s0105: [
    'Later he was ultimately implicated through Liang and exiled to Guangzhou; the account is in',
    'He was finally implicated with Liang and sent to Guangzhou; see',
  ],
  s0106: [
    'Biography of Liang',
    'the Biography of Liang',
  ],
  s0107: [
    '.',
    '.',
  ],
  s0108: [
    'Earlier, when Zhen was in the Qi era, he had once attended Prince of Jingling Zi Liang.',
    'Earlier in Qi he had attended Prince of Jingling Zi Liang.',
  ],
  s0109: [
    'Zi Liang was deeply devoted to Buddhism, while Zhen strongly asserted there was no Buddha.',
    'Zi Liang deeply believed Buddhism; Zhen insisted there was no Buddha.',
  ],
  s0110: [
    'Zi Liang asked: "If you do not believe in cause and effect, how can there be wealth and honor in the world, and how can there be poverty and low station?',
    'Zi Liang asked: "If you deny cause and effect, why are some rich and noble and others poor?',
  ],
  s0111: [
    '" Zhen answered: "Human birth is like flowers on one tree—they issue from one branch, open on one calyx, and fall with the wind; some brush the curtain and fall on cushions and mats, some pass the fence and fall beside the privy.',
    '"; Zhen answered: "Life is like flowers on one tree—same branch, same bud, wind-blown down; some land on cushions, some in the privy.',
  ],
  s0112: [
    'Those who fall on cushions and mats—that is Your Highness;',
    'Those on cushions—that is Your Highness;',
  ],
  s0113: [
    'those who fall beside the privy—that is this humble office.',
    'those in the privy—that is me.',
  ],
  s0114: [
    'Though noble and base follow different paths, where indeed is cause and effect?',
    'Noble and base differ—but where is cause and effect?',
  ],
  s0115: [
    '" Zi Liang could not refute him and was deeply astonished.',
    '"; Zi Liang could not answer and was deeply struck.',
  ],
  s0116: [
    'Zhen withdrew and debated the principle, composing On the Annihilation of the Spirit, which says:',
    'Zhen withdrew, argued the point, and wrote On the Annihilation of the Spirit:',
  ],
  s0117: [
    'Someone asked me: "If the spirit is annihilated, how do you know it is annihilated?',
    'Someone asked: "If the spirit is destroyed, how do you know it is destroyed?',
  ],
  s0118: [
    '" I answered: "Spirit is form and form is spirit;',
    '"; I answered: "Spirit is form and form is spirit;',
  ],
  s0119: [
    'therefore when form exists spirit exists; when form perishes spirit is annihilated."',
    'so when form exists spirit exists; when form ends spirit is destroyed."',
  ],
  s0120: [
    'The questioner said: "Form is what is called without knowing; spirit is what is called with knowing.',
    'He asked: "Form is the name for the unknowing; spirit for the knowing.',
  ],
  s0121: [
    'Knowing and not knowing are different in the matter; spirit and form cannot share one principle—form and spirit as one has not been heard of.',
    'Knowing and not knowing differ; spirit and form cannot be one—unity of form and spirit is unheard of.',
  ],
  s0122: [
    '" I answered: "Form is the substance of spirit; spirit is the function of form;',
    '"; I answered: "Form is spirit\'s substance; spirit is form\'s function;',
  ],
  s0123: [
    'thus form names its substance and spirit names its function;',
    'form names substance, spirit names function;',
  ],
  s0124: [
    'form and spirit cannot differ."',
    'form and spirit cannot differ."',
  ],
  s0125: [
    'The questioner said: "If spirit is not substance and form is not function, they cannot differ—where is the meaning?',
    'He asked: "If spirit is not substance and form not function, how can they not differ—what is the sense?',
  ],
  s0126: [
    '" I answered: "The names differ but the body is one."',
    '"; I answered: "Names differ but the body is one."',
  ],
  s0127: [
    'The questioner said: "If the names are already different, how can the body be one?',
    'He asked: "If names differ, how is the body one?',
  ],
  s0128: [
    '" I answered: "Spirit to substance is like sharpness to knife;',
    '"; I answered: "Spirit to substance is like sharpness to a knife;',
  ],
  s0129: [
    'form to function is like knife to sharpness;',
    'form to function is like the knife to sharpness;',
  ],
  s0130: [
    'the name sharpness is not knife, and the name knife is not sharpness.',
    'sharpness is not the knife, and the knife is not sharpness.',
  ],
  s0131: [
    'Yet abandon sharpness and there is no knife; abandon knife and there is no sharpness.',
    'Yet without sharpness there is no knife; without knife no sharpness.',
  ],
  s0132: [
    'One never hears that the knife is gone while sharpness remains—how could form perish while spirit remains?"',
    'No one hears of a knife gone while sharpness remains—how could form die while spirit stays?"',
  ],
  s0133: [
    'The questioner said: "Knife and sharpness may be as you say;',
    'He said: "Knife and sharpness may be as you say;',
  ],
  s0134: [
    'form and spirit are not so in meaning.',
    'but form and spirit are not the same.',
  ],
  s0135: [
    'Why do I say so?',
    'Why?',
  ],
  s0136: [
    'The substance of wood is without knowing; the substance of man has knowing;',
    'Wood\'s substance has no knowing; man\'s has knowing;',
  ],
  s0137: [
    'if man has a substance like wood and also knowing unlike wood, is that not wood having one and man having two?',
    'if man has wood-like substance and unlike-wood knowing, does man have two where wood has one?',
  ],
  s0138: [
    '" I answered: "Strange words indeed!',
    '"; I answered: "Strange words!',
  ],
  s0139: [
    'If man had a wood-like substance as form and also unlike-wood knowing as spirit, then your argument could stand.',
    'If man had wood-like substance as form and unlike-wood knowing as spirit, your point might stand.',
  ],
  s0140: [
    'Now man\'s substance has knowing;',
    'But man\'s substance has knowing;',
  ],
  s0141: [
    'wood\'s substance has no knowing.',
    'wood\'s has none.',
  ],
  s0142: [
    'Man\'s substance is not wood\'s substance, and wood\'s substance is not man\'s substance—how could there be wood-like substance and also unlike-wood knowing?"',
    'Man\'s substance is not wood\'s, nor wood\'s man\'s—how could there be wood-like substance with unlike-wood knowing?"',
  ],
  s0143: [
    'The questioner said: "The reason man\'s substance differs from wood\'s is that he has knowing.',
    'He asked: "Man differs from wood because he has knowing.',
  ],
  s0144: [
    'If man had no knowing, how would he differ from wood?',
    'Without knowing, how would he differ from wood?',
  ],
  s0145: [
    '" I answered: "Man has no substance without knowing, just as wood has no form with knowing."',
    '"; I answered: "Man has no unknowing substance, as wood has no knowing form."',
  ],
  s0146: [
    'The questioner said: "The corpse\'s frame—is it not a substance without knowing?',
    'He asked: "A corpse\'s frame—is that not unknowing substance?',
  ],
  s0147: [
    '" I answered: "That is substance without a person."',
    '"; I answered: "That is substance without a person."',
  ],
  s0148: [
    'The questioner said: "If so, then man indeed has a wood-like substance and also unlike-wood knowing.',
    'He said: "Then man has wood-like substance and unlike-wood knowing.',
  ],
  s0149: [
    '" I answered: "The dead are like wood and have no unlike-wood knowing;',
    '"; I answered: "The dead are like wood without unlike-wood knowing;',
  ],
  s0150: [
    'the living have unlike-wood knowing and no wood-like substance."',
    'the living have unlike-wood knowing without wood-like substance."',
  ],
  s0151: [
    'The questioner said: "The dead person\'s bones—are they not the living person\'s frame?',
    'He asked: "Dead bones—are they not the living person\'s frame?',
  ],
  s0152: [
    '" I answered: "The living form is not the dead form; the dead form is not the living form—the distinction is already changed.',
    '"; I answered: "Living form is not dead form, dead not living—the distinction has changed.',
  ],
  s0153: [
    'How could there be a living person\'s frame and also a dead person\'s bones?"',
    'How could one have a living frame and dead bones?"',
  ],
  s0154: [
    'The questioner said: "If the living person\'s frame is not the dead person\'s bones,',
    'He said: "If the living frame is not dead bones,',
  ],
  s0155: [
    'if it is not the dead person\'s bones, then it should not come from the living person\'s frame;',
    'then it should not come from the living frame;',
  ],
  s0156: [
    'if it does not come from the living person\'s frame, then from where did these bones arrive?',
    'if not from the living frame, whence these bones?',
  ],
  s0157: [
    '" I answered: "It is the living person\'s frame transformed into the dead person\'s bones."',
    '"; I answered: "The living frame became the dead bones."',
  ],
  s0158: [
    'The questioner said: "Though the living person\'s frame changes into the dead person\'s bones, surely it is because there was life that there is death?',
    'He asked: "Though the living frame becomes dead bones, is death not from life?',
  ],
  s0159: [
    'Then one knows the dead body is still the living body."',
    'Then the dead body is still the living body."',
  ],
  s0160: [
    '" I answered: "If it is like flourishing wood changing into withered wood, is the substance of withered wood still the body of flourishing wood?"',
    '"; I answered: "As flourishing wood becomes withered, is withered substance still flourishing body?"',
  ],
  s0161: [
    'The questioner said: "If the flourishing body changes into the withered body, the withered body is the flourishing body;',
    'He said: "Flourishing body becomes withered; withered is flourishing;',
  ],
  s0162: [
    'if silk substance changes into thread substance, thread substance is silk substance—what difference is there?',
    'silk becomes thread; thread is silk—what difference?',
  ],
  s0163: [
    '" I answered: "If withered is flourishing and flourishing is withered, then in flourishing time it should wither, and in withering time it should bear fruit.',
    '"; I answered: "If withered is flourishing, flourishing should wither and withering bear fruit.',
  ],
  s0164: [
    'Moreover flourishing wood should not change into withered wood, for if flourishing is withered there is nothing further to change.',
    'Flourishing wood should not become withered if flourishing is withered—nothing left to change.',
  ],
  s0165: [
    'Why not first wither and then flourish?',
    'Why not wither first, then flourish?',
  ],
  s0166: [
    'Why must it first flourish and then wither?',
    'Why must it flourish first, then wither?',
  ],
  s0167: [
    'The meaning of silk and thread is the same refutation."',
    'Silk and thread fail the same way."',
  ],
  s0168: [
    'The questioner said: "When the living form perishes, it ought at once to be wholly extinguished.',
    'He asked: "When the living form ends, it should vanish at once.',
  ],
  s0169: [
    'Why then, having just received the dead form, does it linger on without end?',
    'Why does the dead form linger on?',
  ],
  s0170: [
    '" I answered: "Substances of birth and extinction must have their sequence for this reason.',
    '"; I answered: "Birth and extinction have sequence for this reason.',
  ],
  s0171: [
    'What is born in a flash must perish in a flash; what is born gradually must perish gradually.',
    'What is born suddenly perishes suddenly; what is born gradually perishes gradually.',
  ],
  s0172: [
    'What is born in a flash is like a gust of wind;',
    'Sudden birth is like a gust;',
  ],
  s0173: [
    'what is born gradually is like moving things and plants.',
    'gradual birth is like animals and plants.',
  ],
  s0174: [
    'Having flash and gradual is the principle of things."',
    'Flash and gradual are nature\'s law."',
  ],
  s0175: [
    'The questioner said: "If form is spirit, are the hands also so?',
    'He asked: "If form is spirit, are the hands too?',
  ],
  s0176: [
    '" I answered: "They are all portions of spirit."',
    '"; I answered: "All are portions of spirit."',
  ],
  s0177: [
    'The questioner said: "If they are all portions of spirit, and spirit can deliberate, should the hands also be able to deliberate?',
    'He asked: "If all are spirit\'s portions and spirit deliberates, should hands deliberate too?',
  ],
  s0178: [
    '" I answered: "The hands also ought to have knowing of pain and itch, but not deliberation of right and wrong."',
    '"; I answered: "Hands may know pain and itch but not right and wrong."',
  ],
  s0179: [
    'The questioner said: "Are knowing and deliberation one or different?',
    'He asked: "Are knowing and deliberation one or two?',
  ],
  s0180: [
    '" I answered: "Knowing is deliberation.',
    '"; I answered: "Knowing is deliberation.',
  ],
  s0181: [
    'Shallow it is knowing; deep it is deliberation."',
    'Shallow is knowing; deep is deliberation."',
  ],
  s0182: [
    'The questioner said: "If so, there ought to be two deliberations;',
    'He said: "Then there should be two deliberations;',
  ],
  s0183: [
    'if deliberation has two, are there two spirits?',
    'if two deliberations, two spirits?',
  ],
  s0184: [
    '" I answered: "The human body is only one—how could spirit be two?"',
    '"; I answered: "The body is one—how could spirit be two?"',
  ],
  s0185: [
    'The questioner said: "If it cannot be two, how can there be knowing of pain and itch and also deliberation of right and wrong?',
    'He asked: "If not two, how both pain-itch knowing and right-wrong deliberation?',
  ],
  s0186: [
    '" I answered: "As hands and feet differ yet together make one person.',
    '"; I answered: "Hands and feet differ yet are one person.',
  ],
  s0187: [
    'Right-wrong and pain-itch, though they differ again, are also altogether one spirit."',
    'Right-wrong and pain-itch differ yet are one spirit."',
  ],
  s0188: [
    'The questioner said: "Deliberation of right and wrong does not concern hands and feet—what should it concern?',
    'He asked: "Right-wrong deliberation is not in hands and feet—where then?',
  ],
  s0189: [
    '" I answered: "Deliberation of right and wrong is ruled by the organ of the heart."',
    '"; I answered: "Right-wrong deliberation is ruled by the heart organ."',
  ],
  s0190: [
    'The questioner said: "The heart organ is the heart among the five viscera—is it not?',
    'He asked: "The heart organ is the heart among the five viscera, is it not?',
  ],
  s0191: [
    '" I answered: "It is."',
    '"; I answered: "Yes."',
  ],
  s0192: [
    'The questioner said: "What special difference among the five viscera makes the heart alone have deliberation of right and wrong?',
    'He asked: "Why should the heart alone deliberate right and wrong among the five viscera?',
  ],
  s0193: [
    '" I answered: "The seven apertures also differ—why are their uses unequal?"',
    '"; I answered: "The seven apertures differ too—why are their uses unequal?"',
  ],
  s0194: [
    'The questioner said: "Deliberative thought has no fixed place—how do you know it is ruled by the heart organ?',
    'He asked: "Thought has no fixed place—how know the heart rules it?',
  ],
  s0195: [
    '" I answered: "The five viscera each have their charge; none can deliberate—therefore one knows the heart is the root of deliberation."',
    '"; I answered: "Each viscus has its charge; none deliberates—so the heart is deliberation\'s root."',
  ],
  s0196: [
    'The questioner said: "Why not lodge it in the portion of the eyes and the like?',
    'He asked: "Why not lodge it in the eye\'s portion?',
  ],
  s0197: [
    '" I answered: "If deliberation could lodge in the eye\'s portion, why should the eye not lodge in the ear\'s portion?"',
    '"; I answered: "If deliberation lodged in the eye, why not the eye in the ear?"',
  ],
  s0198: [
    'The questioner said: "The substance of deliberation has no root, so it can lodge in the eye\'s portion;',
    'He said: "Deliberation has no root, so it can lodge in the eye;',
  ],
  s0199: [
    'the eye has its own root and need not lodge in another portion."',
    'the eye has its own root and need not lodge elsewhere."',
  ],
  s0200: [
    '" I answered: "Why should the eye have a root while deliberation has no root;',
    '"; I answered: "Why should the eye have a root while deliberation has none;',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_048_b2.mjs <translation.json>'
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
