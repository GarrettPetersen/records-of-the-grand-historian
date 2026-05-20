#!/usr/bin/env node
import fs from 'node:fs';
const T = {
  "s0901": [
    "Nine Rivers governs the records of all affairs and adjudicates grievances and lawsuits.",
    "Nine Rivers records all affairs and settles lawsuits."
  ],
  "s0902": [
    "When bright, lawsuits multiply across the realm; when vanished, governance fails and state order collapses; if scattered and broken, earthquakes and mountain collapses.",
    "Brightness brings lawsuits; vanishing ruins order; scattering brings quakes."
  ],
  "s0903": [
    "Weaving Maid is three stars at the eastern end of Celestial Record—a celestial woman governing fruits, melons, silk, brocade, and treasures.",
    "Three Weaving Maid stars at Celestial Record's east govern produce, silk, and treasures."
  ],
  "s0904": [
    "When the king is utmost filial and spirits all rejoice, Weaving Maid stars all shine—peace across the realm.",
    "Ultimate filial piety makes Weaving Maid bright and the realm peaceful."
  ],
  "s0905": [
    "If the great star shows angry horns, cloth and silk become expensive.",
    "An angry-horned great star makes cloth and silk costly."
  ],
  "s0906": [
    "Four stars of the eastern foot are called Gradual Terrace—a waterside terrace.",
    "Four eastern-foot stars are Gradual Terrace by the water."
  ],
  "s0907": [
    "It governs gnomon, clepsydra, and pitch-pipe affairs.",
    "It governs gnomon, clepsydra, and pitch pipes."
  ],
  "s0908": [
    "Five western stars are called Imperial Carriage Way—the Son of Heaven's path of pleasure excursions; the Han carriage way connecting south and north palaces images this.",
    "Five western Carriage Way stars are the emperor's pleasure route, imaging Han's north-south palace road."
  ],
  "s0909": [
    "Two stars between the left and right Horn stars are called officials of the Level Way.",
    "Two stars between the Horns are Level Way officials."
  ],
  "s0910": [
    "One star west of Level Way is called Advance the Worthy—it governs ministers recommending outstanding talent.",
    "West of Level Way is Advance the Worthy, recommending talent."
  ],
  "s0911": [
    "Two stars north of the Horn are called Celestial Field.",
    "Two stars north of the Horn are Celestial Field."
  ],
  "s0912": [
    "Six stars north of Kang are called Kang Pool.",
    "Six Kang Pool stars lie north of Kang."
  ],
  "s0913": [
    "Kang—boats;",
    "Kang means boats;"
  ],
  "s0914": [
    "Pool—water.",
    "Pool means water."
  ],
  "s0915": [
    "It governs sending off and welcoming arrivals.",
    "It governs departures and welcomes."
  ],
  "s0916": [
    "One star north of Di is called Celestial Milk—it governs sweet dew.",
    "North of Di is Celestial Milk, governing sweet dew."
  ],
  "s0917": [
    "One star in the Heart corridor is called Jupiter; if it lodges there, yin and yang are balanced.",
    "A Heart corridor star is Jupiter; lodging there balances yin and yang."
  ],
  "s0918": [
    "Two stars west of Heart, north and south in a row, are called Celestial Blessing—governing chariot offices, like the Rites' Chariot and Public Chariot administrations.",
    "Two stars west of Heart are Celestial Blessing, chariot offices of the Rites."
  ],
  "s0919": [
    "It governs sacrificial affairs.",
    "It governs sacrifices."
  ],
  "s0920": [
    "Eastern Salt and Western Salt are four stars each, north of Heart and Fang—the path of sun, moon, and five planets.",
    "Four Eastern and four Western Salt stars north of Heart and Fang mark the luminaries' path."
  ],
  "s0921": [
    "The door of Fang—therefore guarding against licentiousness.",
    "Fang's door guards against licentiousness."
  ],
  "s0922": [
    "When stars are bright, auspicious; when dim, inauspicious.",
    "Bright stars are lucky; dim stars unlucky."
  ],
  "s0923": [
    "If the moon or five planets invade or lodge there, secret plotting occurs.",
    "Moon or five planets striking there bring secret plots."
  ],
  "s0924": [
    "Three stars west of Eastern Salt, north-south in a row, are called Penalty Star—it governs receiving gold ransom.",
    "Three Penalty stars west of Eastern Salt govern gold ransom."
  ],
  "s0925": [
    "Key and Lock is one star northeast of Fang, near Gouqian—it governs keys and locks.",
    "Key and Lock northeast of Fang near Gouqian guards locks."
  ],
  "s0926": [
    "The Celestial Market Enclosure is twenty-two stars northeast of Heart and Fang—it governs the balance scale and gathering multitudes.",
    "Twenty-two Celestial Market stars northeast of Heart and Fang govern scales and crowds."
  ],
  "s0927": [
    "Also called the Celestial Banner Court—it governs executions and slayings.",
    "Also the Banner Court governing executions."
  ],
  "s0928": [
    "When market stars are many and moist, the harvest is abundant; when sparse, the harvest is poor.",
    "Many moist market stars mean rich harvests; sparse stars mean poor ones."
  ],
  "s0929": [
    "If Mars lodges there, disloyal ministers are executed.",
    "Mars lodging there executes disloyal ministers."
  ],
  "s0930": [
    "It is also said: if angry with horns and lodging, the executed minister kills the ruler.",
    "Also: angry horned Mars there means ministers kill the sovereign."
  ],
  "s0931": [
    "If a comet clears it, the market moves and the capital changes.",
    "A comet clearing it moves the market and changes the capital."
  ],
  "s0932": [
    "If a guest star enters, great war rises; if it exits, noble mourning occurs.",
    "Guest star entry brings war; exit brings noble death."
  ],
  "s0933": [
    "Six stars in the market near Ji are called Market Tower—the market administration, governing market prices and standards.",
    "Six Market Tower stars by Ji govern prices and market law."
  ],
  "s0934": [
    "Their yang side is money; yin side pearls and jade.",
    "Yang side is coin; yin side gems."
  ],
  "s0935": [
    "Changes are interpreted each by what they govern.",
    "Changes are read by each star's domain."
  ],
  "s0936": [
    "Four northern stars are called Celestial Dipper—they govern measure.",
    "Four northern Celestial Dipper stars govern measuring."
  ],
  "s0937": [
    "Two stars northwest of the Dipper are called Ranked Shops—they govern treasures of jade.",
    "Two Ranked Shop stars northwest govern jade goods."
  ],
  "s0938": [
    "Two stars within the left market gate star are called Chariot Market—the district of many merchants.",
    "Inside the left gate are Chariot Market stars for many traders."
  ],
  "s0939": [
    "Imperial Seat is one star in the Celestial Market, west of Observer Star—the celestial court.",
    "Imperial Seat in the market west of Observer Star is the celestial court."
  ],
  "s0940": [
    "Bright and lustrous—the Son of Heaven is auspicious and commands are enforced.",
    "Bright and moist means the emperor thrives and orders run."
  ],
  "s0941": [
    "Slight dimness is inauspicious—great men bear it.",
    "Slight fading is ill-omen for great men."
  ],
  "s0942": [
    "Observer Star is northeast of Imperial Seat—it watches yin and yang.",
    "Observer Star northeast watches yin and yang."
  ],
  "s0943": [
    "Bright and large means assistant ministers are strong and the four barbarians open.",
    "Brightness and size mean strong aides and open frontiers."
  ],
  "s0944": [
    "If the observer is faint the realm is secure; if vanished the ruler loses position; if shifted the ruler is unsettled.",
    "Faint observer means peace; vanished means lost throne; shifted means unrest."
  ],
  "s0945": [
    "Four Eunuch stars are southwest of Imperial Seat—attending punished and mutilated persons.",
    "Four Eunuch stars southwest attend the mutilated."
  ],
  "s0946": [
    "Faint stars are auspicious; bright is inauspicious; if not as usual, eunuchs have worry.",
    "Faint eunuch stars are good; bright or abnormal ones trouble eunuchs."
  ],
  "s0947": [
    "Dipper is five stars south of Eunuchs—it governs leveling measure.",
    "Five Dipper stars south of Eunuchs level measure."
  ],
  "s0948": [
    "If upturned, bushels and pecks are uneven across the realm; if overturned, the year is abundant.",
    "Upturned means uneven measures; overturned means abundance."
  ],
  "s0949": [
    "Two Director of Imperial Clan stars are southeast of Imperial Seat—clan grand masters.",
    "Two Clan Director stars southeast image clan grand masters."
  ],
  "s0950": [
    "If a comet lodges there, or color fades, the clan director has affairs.",
    "Comet lodging or fading color troubles the clan director."
  ],
  "s0951": [
    "If a guest star lodges and moves, the Son of Heaven's relatives change.",
    "Guest star motion changes imperial kin."
  ],
  "s0952": [
    "If a guest star lodges there, nobles die.",
    "Guest star lodging kills nobles."
  ],
  "s0953": [
    "Two Clan Stars are east of Observer Star—the image of the imperial clan, blood-kin assistant ministers.",
    "Two Clan Stars east of Observer image imperial blood kin."
  ],
  "s0954": [
    "If a guest star lodges there, clan members are discordant.",
    "Guest star lodging brings clan discord."
  ],
  "s0955": [
    "Two northeastern stars are called Silk Measure; two northeastern stars are called Butcher Market—each governs its affair.",
    "Silk Measure and Butcher Market stars northeast each govern their trades."
  ],
  "s0956": [
    "Celestial River is four stars north of Tail—it governs the Great Yin.",
    "Four Celestial River stars north of Tail govern the Great Yin."
  ],
  "s0957": [
    "If river stars are incomplete, ferries, rivers, and passes are blocked across the realm.",
    "Incomplete river stars block rivers and passes."
  ],
  "s0958": [
    "If bright and wavering, great flood emerges and great armies rise.",
    "Bright motion brings floods and war."
  ],
  "s0959": [
    "If uneven, horses become expensive.",
    "Uneven stars make horses costly."
  ],
  "s0960": [
    "If Mars lodges there, a king is installed.",
    "Mars lodging installs a king."
  ],
  "s0961": [
    "If a guest star enters.",
    "If a guest star enters,"
  ],
  "s0962": [
    "river crossings are cut.",
    "river crossings are severed."
  ],
  "s0963": [
    "Celestial Key is eight stars west of the Southern Dipper handle—it governs closure.",
    "Eight Celestial Key stars west of the Dipper handle govern closing."
  ],
  "s0964": [
    "Establishment Stars are six stars north of the Southern Dipper—also called Celestial Banner, capital pass of Heaven.",
    "Six Establishment stars north of the Dipper are Heaven's capital pass."
  ],
  "s0965": [
    "For planning affairs, the Celestial Drum, and the Celestial Horse.",
    "They govern planning, the Celestial Drum, and Celestial Horse."
  ],
  "s0966": [
    "The southern two stars are the Celestial Storehouse.",
    "Southern pair is Celestial Storehouse."
  ],
  "s0967": [
    "The central two stars are the market—and axe and mace.",
    "Central pair is market and axe-mace."
  ],
  "s0968": [
    "The upper two stars are the banner base.",
    "Upper pair is banner base."
  ],
  "s0969": [
    "Between Dipper establishment is the path of the three luminaries.",
    "Between Dipper markers lies the luminaries' path."
  ],
  "s0970": [
    "When stars move, people toil.",
    "Star motion means popular toil."
  ],
  "s0971": [
    "If the moon is haloed, dragons appear and cattle and horses sicken.",
    "Lunar halos bring dragons and livestock plague."
  ],
  "s0972": [
    "If the moon or five planets strike, ministers slander one another and ministers plot against the ruler;",
    "Moon or five planets striking bring slander and regicide plots;"
  ],
  "s0973": [
    "also passes and bridges are blocked and great flood comes.",
    "also blocked passes and great floods."
  ],
  "s0974": [
    "Four southeastern stars are called Dog Country—it governs Xianbei, Wuhuan, and Woju.",
    "Four Dog Country stars govern Xianbei, Wuhuan, and Woju."
  ],
  "s0975": [
    "If Mars lodges there, outer tribes change.",
    "Mars lodging changes outer tribes."
  ],
  "s0976": [
    "If Venus retrograde lodges there, that state falls into chaos.",
    "Retrograde Venus lodging brings that state's chaos."
  ],
  "s0977": [
    "If a guest star invades or lodges there, great bandits appear and its king will come.",
    "Guest star strike brings bandits and the king's arrival."
  ],
  "s0978": [
    "Two stars north of Dog Country are called Celestial Cock—it governs observing time.",
    "Two Celestial Cock stars north observe time."
  ],
  "s0979": [
    "Celestial Cap is nine stars north of Establishment Stars—the head of market officials.",
    "Nine Celestial Cap stars north head market officers."
  ],
  "s0980": [
    "It governs ranked shops and round markets, market registers, and knowing market treasures.",
    "It governs shops, market lanes, registers, and market goods."
  ],
  "s0981": [
    "Stars should be bright—auspicious.",
    "Stars should shine bright for luck."
  ],
  "s0982": [
    "If a comet invades or lodges there, grain is expensive and convicts raise armies.",
    "Comet strike makes grain costly and convicts rebel."
  ],
  "s0983": [
    "River Drum is three stars; Banner is nine stars north of Ox—Celestial Drum, governing military drums and axe and mace.",
    "Three River Drum and nine Banner stars north of Ox govern war drums and arms."
  ],
  "s0984": [
    "Also called Three Warriors—they govern the Son of Heaven's three generals.",
    "Also Three Warriors for the emperor's three generals."
  ],
  "s0985": [
    "The central great star is the Grand General; the left star the Left General; the right star the Right General.",
    "Center is Grand General; left Left General; right Right General."
  ],
  "s0986": [
    "The left star, the southern star, guards passes and bridges and repels danger—establishing garrisons at perilous passes, knowing stratagems and signs.",
    "The southern left star guards passes, holds defiles, and reads omens."
  ],
  "s0987": [
    "The banner is the River Drum's banner—the standard.",
    "The banner is River Drum's standard."
  ],
  "s0988": [
    "Left Banner is nine stars beside the drum's left.",
    "Nine Left Banner stars sit left of the drum."
  ],
  "s0989": [
    "The drum should stand straight and bright, yellow color and luster—generals are auspicious;",
    "Straight bright yellow drums mean lucky generals;"
  ],
  "s0990": [
    "if not straight, military worry.",
    "crooked drums mean military trouble."
  ],
  "s0991": [
    "Angry stars make horses expensive; motion brings war; curvature means the general loses plan and power.",
    "Angry stars raise horse prices; motion brings war; bending loses the general's plan."
  ],
  "s0992": [
    "If banner stars are skewed, chaos and mutual oppression.",
    "Skewed banners bring chaos and oppression."
  ],
  "s0993": [
    "Four stars at the banner tip, north-south in a row, are called Celestial Drumstick.",
    "Four tip stars north-south are Celestial Drumstick."
  ],
  "s0994": [
    "Fu—the drumstick.",
    "Fu is the drumstick."
  ],
  "s0995": [
    "If stars are not bright, clepsydra marks miss time.",
    "Dim stars mean clepsydra error."
  ],
  "s0996": [
    "Near River Drum ahead, if drumstick and drum align straight, both drumstick and drum are used.",
    "Aligned drumstick and drum near River Drum mean they are deployed."
  ],
  "s0997": [
    "Separated Pearls are five stars north of Xunu—Xunu's storehouse, stars of women.",
    "Five Separated Pearls north of Xunu are women's stars in Xunu's storehouse."
  ],
  "s0998": [
    "If stars are not as before, the inner palace is disorderly.",
    "Abnormal stars disorder the inner palace."
  ],
  "s0999": [
    "If a guest star strikes, the inner palace is inauspicious.",
    "Guest star strike harms the inner palace."
  ],
  "s1000": [
    "North of Void, two stars are called Director of Fate; north two Director of Emolument; north two Director of Peril; north two Director of Wrong.",
    "North of Void: Director of Fate, Emolument, Peril, and Wrong pairs."
  ]
};
const p=process.argv[2]; if(!p)process.exit(1);
const d=JSON.parse(fs.readFileSync(p,'utf8')); let c=0;
for(const s of d.sentences){const x=T[s.id];if(x){s.literal=x[0];s.idiomatic=x[1];c++;}}
fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n'); console.log('Patch',c);
