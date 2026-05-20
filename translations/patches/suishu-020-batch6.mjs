#!/usr/bin/env node
import fs from 'node:fs';
const T={
  "s0501": [
    "Neck is the Dispersal Temple—Great White's temple.",
    "Neck is Dispersal Temple—Great White's temple."
  ],
  "s0502": [
    "Seven Stars is the Round Office—Chronogram Star's temple.",
    "Seven Stars is Round Office—Chronogram Star's temple."
  ],
  "s0503": [
    "When the five planets reach their temples, carefully await their commands.",
    "At their temples, carefully await the five planets' commands."
  ],
  "s0504": [
    "Generally when the five planets expand, contract, or lose position, their essences descend to earth as humans.",
    "When five planets expand, contract, or lose position, their essences descend as humans."
  ],
  "s0505": [
    "Year Star descending becomes a noble minister;",
    "Year Star descending becomes a noble minister;"
  ],
  "s0506": [
    "Sparkling Fire descending becomes children, songs, and playful games;",
    "Sparkling Fire descending becomes singing children;"
  ],
  "s0507": [
    "Fill Star descending becomes old men and women;",
    "Fill Star descending becomes old men and women;"
  ],
  "s0508": [
    "Great White descending becomes strong men dwelling in forest foothills;",
    "Great White descending becomes strong men in forests;"
  ],
  "s0509": [
    "Chronogram Star descending becomes women.",
    "Chronogram Star descending becomes women."
  ],
  "s0510": [
    "Responses of fortune and misfortune follow their images in announcement.",
    "Fortune and misfortune follow their announced images."
  ],
  "s0511": [
    "Generally among the five planets: wood meeting earth—internal chaos and famine;",
    "Wood meeting earth: internal chaos and famine;"
  ],
  "s0512": [
    "meeting water—changed plots and changed affairs;",
    "meeting water: changed plots and affairs;"
  ],
  "s0513": [
    "meeting fire—famine and drought;",
    "meeting fire: famine and drought;"
  ],
  "s0514": [
    "meeting metal—white-clad assembly;",
    "meeting metal: white-clad assembly;"
  ],
  "s0515": [
    "combining in battle—internal chaos in the state, broken armies in the wild, water.",
    "Battle combination: internal chaos, broken armies, flood."
  ],
  "s0516": [
    "Great White in the south, Year Star in the north—called a male year; grain greatly ripens.",
    "Great White south, Year Star north—a male year, great harvest."
  ],
  "s0517": [
    "Great White in the north, Year Star in the south—the year may or may not have grain.",
    "Great White north, Year Star south—grain uncertain."
  ],
  "s0518": [
    "Fire meeting metal—blazing and mourning; do not raise armies or undertake affairs.",
    "Fire meeting metal: blazing and mourning—no war."
  ],
  "s0519": [
    "Following armies brings army grief; departing armies retreat.",
    "Following armies grieves them; departing armies retreat."
  ],
  "s0520": [
    "Emerging from Great White's yin—partition of estates; from its yang—flank generals battle.",
    "From White's yin: partition; from yang: flank battle."
  ],
  "s0521": [
    "Meeting earth—grief, lord's wicked offspring.",
    "Meeting earth: grief and wicked offspring."
  ],
  "s0522": [
    "Meeting water—northern armies; raising armies and affairs greatly defeated.",
    "Meeting water: northern armies and great defeat."
  ],
  "s0523": [
    "One says: fire meeting water is quenching; do not raise armies.",
    "Also: fire and water quench—no war."
  ],
  "s0524": [
    "Earth meeting water—obstruction; do not raise armies; overturned armies and defeated generals below.",
    "Earth and water obstruct—defeated armies below."
  ],
  "s0525": [
    "One says: changed plots and changed affairs; certainly drought.",
    "Also: changed plots—certain drought."
  ],
  "s0526": [
    "Meeting metal—disease, white-clad assembly, internal armies, state lost land.",
    "Meeting metal: disease, white assembly, internal war, lost land."
  ],
  "s0527": [
    "Meeting wood—state famine.",
    "Meeting wood: famine."
  ],
  "s0528": [
    "Water meeting metal—changed plots, army grief.",
    "Water meeting metal: plots and army grief."
  ],
  "s0529": [
    "Entering Great White and emerging upward—broken armies, slain generals, guest victory.",
    "Entering White and emerging up: broken armies, guest wins."
  ],
  "s0530": [
    "Emerging downward—guest loses land; read the banner's direction for the broken army.",
    "Emerging down: guest loses land—read the banner."
  ],
  "s0531": [
    "Circling Great White as if battling—great war, guest victory.",
    "Circling White in battle: great war, guest wins."
  ],
  "s0532": [
    "Generally wood, fire, earth, metal battling water—all are war; if armies are not outside, all are internal chaos.",
    "Wood, fire, earth, metal battling water—all war or internal chaos."
  ],
  "s0533": [
    "Generally same lodge is combination; mutual domination is battle.",
    "Same lodge: combination; domination: battle."
  ],
  "s0534": [
    "Two stars close—the calamity is great; far apart no harm; within seven cun must be confirmed.",
    "Close stars: great calamity; within seven cun, confirmed."
  ],
  "s0535": [
    "Generally lunar eclipse of five planets—the state perishes.",
    "Lunar eclipse of five planets: state perishes."
  ],
  "s0536": [
    "Year brings famine; Sparkling Fire chaos; Fill killing; Great White strong-state war; Chronogram female chaos.",
    "Year: famine; Fire: chaos; Fill: killing; White: war; Chronogram: female chaos."
  ],
  "s0537": [
    "Generally five planets entering the moon—the field has an expelled chancellor.",
    "Five planets entering moon: expelled chancellor."
  ],
  "s0538": [
    "Great White—the general is punished.",
    "Great White: general punished."
  ],
  "s0539": [
    "Generally where five planets gather—that state's king; the realm follows.",
    "Five planets gathering: that king, realm follows."
  ],
  "s0540": [
    "Year by righteousness; Sparkling Fire by ritual; Fill by weight; Great White by armies; Chronogram by law—each by its affair commands the realm.",
    "Each planet commands the realm by its virtue: righteousness, ritual, weight, armies, law."
  ],
  "s0541": [
    "Three stars if combined—called alarm, standing, severing travel; the state has armies inside and out; Heaven mourns people; marquises and kings are changed.",
    "Three combined: alarm and severed travel—armies, mourning, changed kings."
  ],
  "s0542": [
    "Four stars combined—called Great Yang; the state has armies and mourning together; gentlemen grieve, petty men flee.",
    "Four combined: Great Yang—armies, mourning, flight."
  ],
  "s0543": [
    "Five stars combined—called changing travel; with virtue, blessing; new king established, possessing all four quarters, descendants flourish;",
    "Five combined: changing travel—with virtue, new king and flourishing heirs;"
  ],
  "s0544": [
    "without virtue, calamity; state lost, ancestral temple destroyed, people depart, covered across four quarters.",
    "without virtue: lost state, destroyed temple, exiled people."
  ],
  "s0545": [
    "All five planets large—the affair is also large;",
    "All large: great affair;"
  ],
  "s0546": [
    "all small—the affair is also small.",
    "all small: small affair."
  ],
  "s0547": [
    "Generally five planets' color: round white—mourning and drought;",
    "Round white: mourning and drought;"
  ],
  "s0548": [
    "red uneven in center—armies and grief;",
    "Red uneven center: armies and grief;"
  ],
  "s0549": [
    "green—water;",
    "Green: water;"
  ],
  "s0550": [
    "black—pestilence and many deaths;",
    "Black: pestilence and death;"
  ],
  "s0551": [
    "yellow—auspicious.",
    "Yellow: auspicious."
  ],
  "s0552": [
    "All horned: red—enemies attack our walls;",
    "Horned red: enemies at walls;"
  ],
  "s0553": [
    "yellow—earthly contention;",
    "Yellow: earthly strife;"
  ],
  "s0554": [
    "white—sound of weeping;",
    "White: weeping;"
  ],
  "s0555": [
    "green—army grief;",
    "Green: army grief;"
  ],
  "s0556": [
    "black—water.",
    "Black: water."
  ],
  "s0557": [
    "Five planets same color—armies stilled under Heaven, people secure, song and dance proceed, no disaster or disease, five grains flourish.",
    "Same color: stilled armies, secure people, flourishing grain."
  ],
  "s0558": [
    "Generally Year Star: slow government then no travel; urgent then overstepping; retrograde then take omens.",
    "Year Star slow: no travel; urgent: overstep; retrograde: omens."
  ],
  "s0559": [
    "Sparkling Fire: slow then no entry; urgent then no exit; against path then omens.",
    "Sparkling Fire slow: no entry; urgent: no exit; against path: omens."
  ],
  "s0560": [
    "Fill: slow then no return; urgent then passing lodges; retrograde then omens.",
    "Fill slow: no return; urgent: passing lodges; retrograde: omens."
  ],
  "s0561": [
    "Great White: slow then no exit; urgent then no entry; retrograde then omens.",
    "Great White slow: no exit; urgent: no entry; retrograde: omens."
  ],
  "s0562": [
    "Chronogram: slow then no exit; urgent then no entry; wrong season then omens.",
    "Chronogram slow: no exit; urgent: no entry; wrong season: omens."
  ],
  "s0563": [
    "Five planets not losing their paths—yearly grain flourishes.",
    "Planets on path: flourishing grain."
  ],
  "s0564": [
    "Generally five planets dividing Heaven's center: accumulated in the east—central realm;",
    "Accumulated east: central realm;"
  ],
  "s0565": [
    "accumulated in the west—foreign states.",
    "Accumulated west: foreign states."
  ],
  "s0566": [
    "Those who use armies benefit.",
    "Army users benefit."
  ],
  "s0567": [
    "Chronogram Star not emerging—Great White is guest;",
    "Chronogram not emerging: Great White is guest;"
  ],
  "s0568": [
    "when it emerges, Great White is host.",
    "when emerging: Great White is host."
  ],
  "s0569": [
    "Emerging and not following Great White, each emerging from one direction—is called opposition; armies in the wild do not battle.",
    "Not following White from separate directions: opposition—no battle."
  ],
  "s0570": [
    "Five planets are masters of the five virtues; their travel may enter inside the Yellow Path or outside—like the moon's yin and yang emergence.",
    "Five planets enter or leave the ecliptic like moon yin-yang."
  ],
  "s0571": [
    "Finally entering and exiting the five constants cannot be sought by calculation.",
    "Five constants' entry and exit cannot be calculated."
  ],
  "s0572": [
    "Eastward travel is called direct; westward retrograde; direct is fast, retrograde slow—averaged, it ends as eastward travel.",
    "Eastward is direct and fast; westward retrograde and slow—averaged as eastward."
  ],
  "s0573": [
    "Neither east nor west is called stationary.",
    "Neither east nor west: stationary."
  ],
  "s0574": [
    "Near the sun and not seen is called hidden.",
    "Near sun and unseen: hidden."
  ],
  "s0575": [
    "Hidden at same degree as sun is called conjunction.",
    "Hidden at sun's degree: conjunction."
  ],
  "s0576": [
    "Their stationary, direct, retrograde, hidden, combined travel violating law, domination, color change, and horned rays—each governs by seasonal government, five constants, five offices, and five affairs' gain and loss, showing its transformation.",
    "Stationary, direct, retrograde, hidden, combined motion shows government and five affairs' gain and loss."
  ],
  "s0577": [
    "Wood, fire, earth three stars travel slow, crossing heaven at midnight.",
    "Wood, fire, earth travel slow, crossing heaven at midnight."
  ],
  "s0578": [
    "At first all at conjunction with the sun, then direct travel gradually slow, chasing the sun but not reaching, seen at dawn in the east.",
    "At conjunction then direct, gradually slower, seen at eastern dawn."
  ],
  "s0579": [
    "Travel departing the sun slightly far, near mid-morning then stationary.",
    "Farther from sun, stationary near mid-morning."
  ],
  "s0580": [
    "Stationary past dawn past mid-heaven then retrograde.",
    "Past dawn mid-heaven: retrograde."
  ],
  "s0581": [
    "Retrograde to evening near mid-heaven then again stationary.",
    "Retrograde to evening mid-heaven: again stationary."
  ],
  "s0582": [
    "Stationary then again direct, first slow gradually fast, until evening hiding west, then again conjunction with sun.",
    "Stationary then direct, slow to fast, evening hide west, sun conjunction."
  ],
  "s0583": [
    "Metal and water two stars travel fast and do not cross heaven.",
    "Metal and water travel fast without crossing heaven."
  ],
  "s0584": [
    "From first conjunction with sun, travel fast ahead of sun, seen at dusk in west.",
    "After conjunction, fast ahead of sun, seen western dusk."
  ],
  "s0585": [
    "Departing sun slightly far, near evening wanting south then gradually slow; at greatest slowness stationary.",
    "Evening southward: gradually slow, then stationary."
  ],
  "s0586": [
    "Stationary and near sun, then retrograde and conjunction with sun, behind the sun.",
    "Stationary near sun: retrograde conjunction behind sun."
  ],
  "s0587": [
    "Seen at dawn in east.",
    "Seen eastern dawn."
  ],
  "s0588": [
    "Retrograde extreme then stationary, stationary then again slow.",
    "Retrograde extreme: stationary, then slow."
  ],
  "s0589": [
    "Slow extreme departing sun slightly far, near dawn wanting south, then fast travel chasing sun, dawn hiding east, again conjunction with sun.",
    "Slow extreme then fast chase, dawn hide east, sun conjunction."
  ],
  "s0590": [
    "This is the great principle of five planets' combined appearance, slow-fast, retrograde-direct, and stationary travel.",
    "This is the great principle of five planets' combined, slow, retrograde, and stationary motion."
  ],
  "s0591": [
    "Dusk and dawn are the great division of yin and yang.",
    "Dusk and dawn divide yin and yang."
  ],
  "s0592": [
    "The south is Great Yang's position and Heaven-Earth's meridian.",
    "South is Great Yang's position and the meridian."
  ],
  "s0593": [
    "The seven luminaries traveling to the yang position, at Heaven's meridian, then wane, slant, stay, retrograde and do not dwell.",
    "Seven luminaries at yang meridian wane, slant, stay, retrograde."
  ],
  "s0594": [
    "This is Heaven's constant Way.",
    "This is Heaven's constant Way."
  ],
  "s0595": [
    "Three stars cross heaven; two do not—three heavens two earths' Way.",
    "Three cross heaven; two do not—three heavens, two earths."
  ],
  "s0596": [
    "Generally five planets' appearance, hiding, stationary travel, retrograde-direct, slow-fast responding to calendrical degrees—obtaining their paths, government harmonizes with the constant.",
    "Planets responding to degrees obtain their paths—government in harmony."
  ],
  "s0597": [
    "Violating calendar, missing degrees, losing path, expanding and contracting—disordered travel.",
    "Violating calendar and degrees: disordered travel."
  ],
  "s0598": [
    "Disordered travel becomes baleful stars, comets, and brooms—with fallen states, changed government, armies, famine, mourning, and chaos.",
    "Disordered travel becomes comets and brooms—ruin, war, famine, chaos."
  ],
  "s0599": [
    "Ancient calendars had all five planets direct; Qin calendar first had metal and fire retrograde.",
    "Ancient calendars: all direct; Qin first had metal and fire retrograde."
  ],
  "s0600": [
    "Also Gan and Shi were contemporaries yet had their own differences.",
    "Gan and Shi were contemporaries yet differed."
  ]
};
const p=process.argv[2];if(!p)process.exit(1);
const d=JSON.parse(fs.readFileSync(p,'utf8'));let c=0;
for(const s of d.sentences){if(T[s.id]){s.literal=T[s.id][0];s.idiomatic=T[s.id][1];c++;}}
fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');console.log('Patch count: '+c);
if(c!==Object.keys(T).length)process.exitCode=1;
