#!/usr/bin/env node
import fs from 'node:fs';
const T={
  "s0901": [
    "Earth Net Hidden Light—five phases' qi, emerging from four seasons' earth qi.",
    "Earth Net Hidden Light: four seasons' earth qi."
  ],
  "s0902": [
    "Also: star emerges large red, two-three zhang from earth, like moon—at first emergence called Earth Net Hidden Light.",
    "Large red two-three zhang like moon: Earth Net Hidden Light."
  ],
  "s0903": [
    "Stars at four corners, seen four zhang from earth, red-yellow trembling, Fill Star class—central field star, emerging four corners, called Earth Net Hidden Light.",
    "Four-corner red-yellow Fill-class stars: Earth Net Hidden Light."
  ],
  "s0904": [
    "Emerging northeast corner—great flood under Heaven.",
    "Northeast: great flood."
  ],
  "s0905": [
    "Emerging southeast corner—great drought under Heaven.",
    "Southeast: great drought."
  ],
  "s0906": [
    "Emerging southwest corner—armies rise.",
    "Southwest: armies."
  ],
  "s0907": [
    "Emerging northwest corner—realm chaos, armies rise greatly.",
    "Northwest: chaos and great armies."
  ],
  "s0908": [
    "Also: Earth Net Hidden Light seen—below chaotic ones perish, virtuous ones flourish.",
    "Seen: chaotic perish, virtuous flourish."
  ],
  "s0909": [
    "Seven is Woman Silk.",
    "Seven: Woman Silk."
  ],
  "s0910": [
    "Woman Silk—five stars' qi combined transformation, emerging northeast, water-wood qi combined.",
    "Northeast water-wood combined: Woman Silk."
  ],
  "s0911": [
    "Also: northeast star three zhang emerging—called Woman Silk; seen—armies rise, or great mourning.",
    "Northeast three zhang: Woman Silk—armies or mourning."
  ],
  "s0912": [
    "Also northeast large star emerging—called Woman Silk; seen—great mourning under Heaven.",
    "Large northeast star: great mourning."
  ],
  "s0913": [
    "Eight is Bandit Star.",
    "Eight: Bandit Star."
  ],
  "s0914": [
    "Bandit Star—five stars' qi combined transformation, emerging southeast, fire-wood qi combined.",
    "Southeast fire-wood combined: Bandit Star."
  ],
  "s0915": [
    "Also: southeast star three zhang emerging—called Bandit Star; seen—great bandit under Heaven, many robbers.",
    "Southeast three zhang: great bandit, many robbers."
  ],
  "s0916": [
    "Nine is Accumulated Mound.",
    "Nine: Accumulated Mound."
  ],
  "s0917": [
    "Accumulated Mound—five stars' qi combined transformation, emerging northwest, metal-water qi combined.",
    "Northwest metal-water combined: Accumulated Mound."
  ],
  "s0918": [
    "Also: southwest star three zhang—called Accumulated Mound; seen—frost falls under Heaven, armies rise greatly, five grains fail, people hunger.",
    "Southwest three zhang: frost, armies, failed grain, hunger."
  ],
  "s0919": [
    "Ten is Terminal Star.",
    "Ten: Terminal Star."
  ],
  "s0920": [
    "Terminal Star—five stars' qi combined transformation, emerging with metal-wood-fire-water combined at four corners.",
    "Four-corner metal-wood-fire-water combined: Terminal Star."
  ],
  "s0921": [
    "Also four-corner star large red, green within when examined, often moving, four zhang long.",
    "Four-corner large red, green within, moving, four zhang."
  ],
  "s0922": [
    "This earth qi, effecting four seasons—called Four-Corner Terminal Star; emergence—armies rise greatly.",
    "Four seasons' earth qi—Four-Corner Terminal: great armies."
  ],
  "s0923": [
    "Eleven is Dusk Prosperity.",
    "Eleven: Dusk Prosperity."
  ],
  "s0924": [
    "Star emerges northwest, green-red qi encircling it, red within green without—called Dusk Prosperity; seen—armies rise, state changes government.",
    "Northwest green-red encircled: Dusk Prosperity—armies, changed government."
  ],
  "s0925": [
    "First rising flourishes; later rising perishes.",
    "First rising flourishes; later perishes."
  ],
  "s0926": [
    "Ten zhang high—chaos one year.",
    "Ten zhang: one year chaos."
  ],
  "s0927": [
    "Twenty zhang—chaos two years.",
    "Twenty zhang: two years."
  ],
  "s0928": [
    "Thirty zhang—chaos three years.",
    "Thirty zhang: three years."
  ],
  "s0929": [
    "Twelve is Shen Star.",
    "Twelve: Shen Star."
  ],
  "s0930": [
    "Star emerges northwest, shaped as if two rings—called Mountain Diligence.",
    "Northwest two rings: Mountain Diligence."
  ],
  "s0931": [
    "One star seen—feudal lords lose land, northwest states.",
    "One star: northwest lords lose land."
  ],
  "s0932": [
    "Thirteen is White Star.",
    "Thirteen: White Star."
  ],
  "s0933": [
    "Like star not star, shaped like sliced melon, has victorious armies—called White Star.",
    "Not-star like sliced melon with victorious armies: White Star."
  ],
  "s0934": [
    "White Star emerging—male mourning.",
    "White Star: male mourning."
  ],
  "s0935": [
    "Fourteen is Tu Chang.",
    "Fourteen: Tu Chang."
  ],
  "s0936": [
    "Northwest Tu Chang star, red-green encircled, calamity, green means water.",
    "Northwest Tu Chang red-green encircled: calamity, green water."
  ],
  "s0937": [
    "This star seen—realm transformed.",
    "Seen: realm transformed."
  ],
  "s0938": [
    "Fifteen is Ge Ze, shaped like blazing fire.",
    "Fifteen: Ge Ze like blazing fire."
  ],
  "s0939": [
    "Also: Ge Ze star, yellow above white below, from earth upward, large below sharp above—seen then harvest without planting.",
    "Yellow-white from earth, harvest without planting."
  ],
  "s0940": [
    "Also: if not earthwork, certainly great guest from neighboring state, term one-two years.",
    "Or: neighboring guest, one-two years."
  ],
  "s0941": [
    "Also: Ge Ze qi red like fire, blazing mid-heaven, same color above-below, east-west spanning heaven, if north-south four-five li long.",
    "Red fire spanning heaven four-five li."
  ],
  "s0942": [
    "This Sparkling Fire transformation—seen armies rise, below corpses and blood, term three years.",
    "Sparkling Fire transformation: armies, blood, three years."
  ],
  "s0943": [
    "Sixteen is Return Wickedness, shaped like star not star, like cloud not cloud.",
    "Sixteen: Return Wickedness—not star, not cloud."
  ],
  "s0944": [
    "Or: two red comets upward, above canopy-like qi, below linked stars.",
    "Two red comets upward with canopy qi."
  ],
  "s0945": [
    "Or: seen—certainly one returning to state.",
    "Seen: one returning to state."
  ],
  "s0946": [
    "Seventeen is Mist Star—at night red qi like banner teeth, long and short four directions, most in southwest.",
    "Seventeen: Mist Star—banner-tooth red qi, most southwest."
  ],
  "s0947": [
    "Also called Blade Star—image of chaos.",
    "Also Blade Star—chaos image."
  ],
  "s0948": [
    "Also: thin clouds across heaven, four directions produce red-yellow qi three chi, appearing and disappearing, all soon vanish.",
    "Thin clouds, red-yellow qi three chi, vanishing."
  ],
  "s0949": [
    "Also: Blade Star seen—realm has armies, battle flowing blood.",
    "Blade Star: armies and blood."
  ],
  "s0950": [
    "Or: thin clouds across heaven, four directions together eight qi, dark white three chi, appearing and disappearing.",
    "Eight dark-white qi three chi, appearing and disappearing."
  ],
  "s0951": [
    "Han Jing Fang authored Wind Angle Book with Collected Stars Chapter—the baleful stars recorded all appear beside the moon, each with five-color directional clouds, seen on five yin days, each five stars' generated clouds.",
    "Han Jing Fang's Collected Stars Chapter: baleful stars beside moon with five-color clouds."
  ],
  "s0952": [
    "Celestial Spear Star born in Winnowing Basket lodge, Celestial Root in Tail, Celestial Thorn in Heart, Zhen Ruo in Chamber, Celestial Yuan in Root, Celestial Tower in Neck, Celestial Rampart in left Horn—all Year Star generated.",
    "Spear, Root, Thorn, Ruo, Yuan, Tower, Rampart—Year Star generated."
  ],
  "s0953": [
    "Seen on jiayin day—all stars have two green方 beside them.",
    "On jiayin day: two green方 beside each."
  ],
  "s0954": [
    "Celestial Yin born in Chariot, Jin Ruo in Wings, Official Zhang in Extended Net, Celestial Confusion in Seven Stars, Celestial Sparrow in Willow, Red Ruo in Ghost, Chiyou in Well—all Sparkling Fire generated.",
    "Yin, Ruo, Zhang, Confusion, Sparrow, Red Ruo, Chiyou—Sparkling Fire generated."
  ],
  "s0955": [
    "Emerging on bingyin day—two red方 beside them.",
    "On bingyin day: two red方 beside each."
  ],
  "s0956": [
    "Heaven Up, Heaven Punishment, Follow Star, Celestial Pivot, Celestial Di, Heaven Boil, Thorn Comet—all Fill Star generated.",
    "Up, Punishment, Follow, Pivot, Di, Boil, Comet—Fill generated."
  ],
  "s0957": [
    "Emerging on wuyin day—two yellow方 beside them.",
    "On wuyin day: two yellow方 beside each."
  ],
  "s0958": [
    "Ruo Star born in Three Stars, Broom in Turtle Beak, Ruo Comet in Net, Bamboo Comet in Hairy Head, Wall in Stomach, Yuan in Bond, White Reed in Strider—all Great White generated.",
    "Ruo, Broom, Comet, Bamboo, Wall, Yuan, Reed—Great White generated."
  ],
  "s0959": [
    "Emerging on gengyin day—two white方 beside them.",
    "On gengyin day: two white方 beside each."
  ],
  "s0960": [
    "Heaven Beauty born in Wall, Heaven Caterpillar in Encampment, Heaven Du in Rooftop, Heaven Hemp in Emptiness, Heaven Forest in Weaving Maid, Heaven Height in Ox, Terminal Below in Dipper—all Chronogram generated.",
    "Beauty, Caterpillar, Du, Hemp, Forest, Height, Terminal Below—Chronogram generated."
  ],
  "s0961": [
    "Emerging on renyin day—two black方 beside them.",
    "On renyin day: two black方 beside each."
  ],
  "s0962": [
    "The preceding thirty-five stars—five phases' qi generated—all emerge in moon-left-right方 qi, each at its generated star's days before emergence take omens.",
    "Thirty-five stars from five phases beside moon—omen before emergence."
  ],
  "s0963": [
    "If seen before not yet emerging—seen means flood, drought, armies, mourning, famine, chaos; pointed direction loses state and land, king dies, broken armies and slain generals.",
    "Seen before emergence: disaster, lost state, dead king."
  ],
  "s0964": [
    "Guest stars—Zhou Bo, Laozi, Wang Pengxu, State Sovereign, Warm Star—generally five stars, all guest stars.",
    "Guest stars: Zhou Bo, Laozi, Wang Pengxu, State Sovereign, Warm Star."
  ],
  "s0965": [
    "Traveling the lodges—twelve states' field divisions, each in the state it faces, guarding the lodge—take omens for fortune and misfortune.",
    "Traveling lodges—twelve states' omens by facing and guarding."
  ],
  "s0966": [
    "Zhou Bo—large and yellow, brilliant.",
    "Zhou Bo: large yellow brilliant."
  ],
  "s0967": [
    "State where seen—armies rise, or mourning, realm famine, multitudes wander exile from their villages.",
    "Seen state: armies, mourning, famine, exile."
  ],
  "s0968": [
    "Auspicious star names and forms same as this but omens differ.",
    "Auspicious stars same name, different omens."
  ],
  "s0969": [
    "Laozi—bright large, white, pure and thick.",
    "Laozi: bright large white pure."
  ],
  "s0970": [
    "State where emerges—famine, calamity, good, evil, joy, anger.",
    "Emerging state: famine, good, evil, joy, anger."
  ],
  "s0971": [
    "Regularly emerging—armies rise greatly, human lord grieves.",
    "Regular emergence: armies, lord grieves."
  ],
  "s0972": [
    "King amnesty removes blame then calamity disappears.",
    "Royal amnesty removes calamity."
  ],
  "s0973": [
    "Wang Pengxu—shaped like powder fluff, fluttering.",
    "Wang Pengxu: powder fluff fluttering."
  ],
  "s0974": [
    "Seen—state armies rise, or mourning, white-clad assembly, state famine and perish.",
    "Seen: armies, mourning, white assembly, famine."
  ],
  "s0975": [
    "Also: Wang Pengxu—star color green and glowing.",
    "Also green glowing."
  ],
  "s0976": [
    "State where seen—wind and rain not by season, scorching drought, things not born, five grains not ripe, locusts many.",
    "Seen state: drought, failed grain, locusts."
  ],
  "s0977": [
    "State Sovereign star—emerging large, color yellow-white, seen with horned rays.",
    "State Sovereign: large yellow-white with horns."
  ],
  "s0978": [
    "Seen—armies rise, state much change, or flood famine, human lord hates, multitudes much disease.",
    "Seen: armies, change, flood, disease."
  ],
  "s0979": [
    "Warm Star—color white and large, shaped as if wind trembling, regularly emerging four corners.",
    "Warm Star: large white wind-trembling at four corners."
  ],
  "s0980": [
    "Emerging southeast—realm has armies, general emerges in field.",
    "Southeast: armies, general in field."
  ],
  "s0981": [
    "Emerging northeast—certainly thousand-li sudden armies.",
    "Northeast: thousand-li sudden armies."
  ],
  "s0982": [
    "Emerging northwest—also likewise.",
    "Northwest: likewise."
  ],
  "s0983": [
    "Emerging southwest—state armies and mourning together, or great flood, people hunger.",
    "Southwest: armies, mourning, flood, hunger."
  ],
  "s0984": [
    "Also: Warm Star emerging southeast—great general's uniform bent cannot deploy.",
    "Southeast: general unable to deploy."
  ],
  "s0985": [
    "Emerging northeast—exposed bones three thousand li.",
    "Northeast: bones three thousand li."
  ],
  "s0986": [
    "Emerging west also likewise.",
    "West: likewise."
  ],
  "s0987": [
    "Generally guest stars seen in their division—if lingering stationary, take omens for fortune and misfortune by their color.",
    "Guest stars in division: omens by color if lingering."
  ],
  "s0988": [
    "Large star large affair, small star small affair.",
    "Large star: large affair; small: small."
  ],
  "s0989": [
    "Star color yellow gains earth, white has mourning, green has grief, black has death, red has armies—each by five colors take omens, all within three years.",
    "Yellow earth, white mourning, green grief, black death, red armies—within three years."
  ],
  "s0990": [
    "Also: guest star entering lodges inside and outside officials—each by emerged department lodge official name for the affair.",
    "Entering officials: affair by lodge official name."
  ],
  "s0991": [
    "Where it goes is its plot; states below all suffer its calamity.",
    "Where it goes: plot; states below suffer."
  ],
  "s0992": [
    "By guarded lodge as term, by five qi mutual conquest as envoy.",
    "Guarded lodge sets term; five qi conquest sets envoy."
  ],
  "s0993": [
    "Shooting stars—Heaven's envoys.",
    "Shooting stars: Heaven's envoys."
  ],
  "s0994": [
    "Descending from above is shooting; ascending from below is flying.",
    "Descending: shooting; ascending: flying."
  ],
  "s0995": [
    "Large ones are rushing; rushing is also shooting stars.",
    "Large: rushing—also shooting stars."
  ],
  "s0996": [
    "Large star large envoy, small star small envoy.",
    "Large star: large envoy; small: small."
  ],
  "s0997": [
    "Sound rumbling—image of anger.",
    "Rumbling: anger."
  ],
  "s0998": [
    "Fast travel—term fast; slow travel—term slow.",
    "Fast: fast term; slow: slow term."
  ],
  "s0999": [
    "Large without light—multitudes' affair.",
    "Large without light: multitudes' affair."
  ],
  "s1000": [
    "Small with light—noble persons' affair.",
    "Small with light: nobles' affair."
  ]
};
const p=process.argv[2];if(!p)process.exit(1);
const d=JSON.parse(fs.readFileSync(p,'utf8'));let c=0;
for(const s of d.sentences){if(T[s.id]){s.literal=T[s.id][0];s.idiomatic=T[s.id][1];c++;}}
fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');console.log('Patch count: '+c);
if(c!==Object.keys(T).length)process.exitCode=1;
