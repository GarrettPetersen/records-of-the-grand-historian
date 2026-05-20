#!/usr/bin/env node
import fs from 'node:fs';
const T = {
  "s0301": [
    "Celestial Granary has six stars south of Bond—where stored grain is kept.",
    "Celestial Granary's six stars south of Bond store grain."
  ],
  "s0302": [
    "If the stars are yellow and large, the year ripens.",
    "Yellow, large stars mean a ripe year."
  ],
  "s0303": [
    "Four stars in the southwest are called Celestial Storehouse—the place where kitchen grain is accumulated.",
    "Four southwestern stars are Celestial Storehouse, holding kitchen grain."
  ],
  "s0304": [
    "Celestial Round Granary has thirteen stars south of Stomach.",
    "Celestial Round Granary's thirteen stars lie south of Stomach."
  ],
  "s0305": [
    "Round granary belongs to the category of storehouses, governing supply of imperial grain.",
    "A round granary governs imperial grain supply."
  ],
  "s0306": [
    "If the stars appear, granaries are full; if not seen, they are empty.",
    "Visible stars mean full granaries; invisible, empty stores."
  ],
  "s0307": [
    "Celestial Manger has four stars south of Hairy Head—also called Celestial Storehouse, governing livestock of millet and grain for sacrifice; the Spring and Autumn Annals' \"Imperial Manger\" images this.",
    "Celestial Manger's four stars south of Hairy Head store millet for sacrifice—the \"Imperial Manger\" of the Spring and Autumn Annals."
  ],
  "s0308": [
    "Celestial Park has sixteen stars south of Net and Hairy Head—the Son of Heaven's park, where birds and beasts are kept, governing horses, cattle, sheep, and goats.",
    "Celestial Park's sixteen stars south of Net and Hairy Head are the royal preserve for horses and livestock."
  ],
  "s0309": [
    "If the stars are bright, cattle and horses are abundant; if sparse, they die.",
    "Bright stars mean abundant livestock; sparse stars, deaths."
  ],
  "s0310": [
    "Six stars west of the Park are called Fodder Hay—for feeding cattle and horses.",
    "Six stars west of the Park are Fodder Hay for livestock."
  ],
  "s0311": [
    "One is called Celestial Accumulation—the Son of Heaven's treasury.",
    "Also Celestial Accumulation—the Son of Heaven's treasury."
  ],
  "s0312": [
    "If the stars flourish, the year is abundant; if sparse, wealth scatters.",
    "Flourishing stars mean abundance; sparse stars, scattered wealth."
  ],
  "s0313": [
    "Thirteen stars south of the Park are called Celestial Garden—where fruits and vegetables are planted.",
    "Thirteen stars south of the Park are Celestial Garden for fruits and vegetables."
  ],
  "s0314": [
    "Eight stars south of Attached Ear are called Celestial Knob—the envoy's staff.",
    "Eight stars south of Attached Ear are Celestial Knob, the envoy's staff."
  ],
  "s0315": [
    "Nine stars below Celestial Knob are called Nine Provinces Special Mouth—the office that understands local customs and interprets through multiple translators.",
    "Nine stars below Celestial Knob are Nine Provinces Special Mouth, interpreting foreign customs."
  ],
  "s0316": [
    "Five stars west of Net's handle are called Celestial Yin.",
    "Five stars west of Net's handle are Celestial Yin."
  ],
  "s0317": [
    "Banner of Three Stars has nine stars west of Three Stars—also Celestial Banner, also Celestial Bow, governing the drawing of bows and crossbows and watching for change and defense against calamity.",
    "Banner of Three Stars' nine stars west of Three Stars govern bows and watch for calamity."
  ],
  "s0318": [
    "Jade Well has four stars at Three Stars' left foot—governing water and broth for the kitchen.",
    "Jade Well's four stars at Three Stars' left foot supply the kitchen."
  ],
  "s0319": [
    "Nine stars in the southwest are called Nine Wanderers—the Son of Heaven's banners.",
    "Nine southwestern stars are Nine Wanderers—the Son of Heaven's banners."
  ],
  "s0320": [
    "Four stars southeast of Jade Well are called Army Well—the marching army's well.",
    "Four stars southeast of Jade Well are Army Well for marching armies."
  ],
  "s0321": [
    "Before Army Well is reached, the general does not speak of thirst—this is where the name comes from.",
    "Before Army Well is reached, generals do not speak of thirst—hence the name."
  ],
  "s0322": [
    "Screen has two stars south of Jade Well—the screen is a wind screen.",
    "Screen's two stars south of Jade Well form a wind screen."
  ],
  "s0323": [
    "If a guest star enters, four-legged creatures suffer great pestilence.",
    "Guest stars entering bring plague among four-legged creatures."
  ],
  "s0324": [
    "Celestial Privy has four stars east of Screen—the latrine, governing watching disease under Heaven.",
    "Celestial Privy's four stars east of Screen watch disease throughout the realm."
  ],
  "s0325": [
    "Celestial Arrow is one star south of the Privy—yellow color is auspicious; all other colors are inauspicious.",
    "Celestial Arrow south of the Privy: yellow is auspicious; other colors, ill."
  ],
  "s0326": [
    "Army Market has thirteen stars southeast of Three Stars—the Celestial Army's trading market, enabling exchange of goods.",
    "Army Market's thirteen stars southeast of Three Stars trade army supplies."
  ],
  "s0327": [
    "Wild Chicken is one star governing strange transformations, in Army Market.",
    "Wild Chicken in Army Market governs strange transformations."
  ],
  "s0328": [
    "Two stars southwest of Army Market are called Elder; two stars east of Elder are called Son; two stars east of Son are called Grandson.",
    "Southwest of Army Market: Elder; east of Elder: Son; east of Son: Grandson."
  ],
  "s0329": [
    "Four stars southwest of Eastern Well are called Water Office, governing the water officials.",
    "Four stars southwest of Eastern Well are Water Office, governing water officials."
  ],
  "s0330": [
    "Four stars at the eastern wall of Eastern Well are called Four Channels—the essences of the Yangtze, Yellow River, Huai, and Ji.",
    "Four stars at Eastern Well's eastern wall are Four Channels—Yangtze, Yellow, Huai, and Ji."
  ],
  "s0331": [
    "Wolf is one star southeast of Eastern Well.",
    "Wolf is one star southeast of Eastern Well."
  ],
  "s0332": [
    "Wolf is the wild general, governing raiding and plunder.",
    "Wolf is the wild general, governing raids and plunder."
  ],
  "s0333": [
    "Its color should be constant—one does not wish it to change and move.",
    "Its color should stay constant—not shift and move."
  ],
  "s0334": [
    "If horned and changing color and trembling, bandits arise, Hu armies rise, and people eat one another.",
    "Horns, color change, and trembling bring bandits, Hu armies, and cannibalism."
  ],
  "s0335": [
    "If restless, the ruler is unsettled, does not dwell in his palace, and gallops across the realm.",
    "Restlessness means an unsettled ruler who gallops across the realm."
  ],
  "s0336": [
    "Seven stars north are called Celestial Dog, governing guarding wealth.",
    "Seven northern stars are Celestial Dog, guarding wealth."
  ],
  "s0337": [
    "Bow has nine stars southeast of Wolf—the Celestial Bow, guarding against bandits, always facing Wolf.",
    "Bow's nine stars southeast of Wolf guard against bandits, facing Wolf."
  ],
  "s0338": [
    "If Bow and Arrow move and shift unlike normal, many bandits and great Hu armies rise.",
    "Abnormal Bow and Arrow movement brings bandits and great Hu armies."
  ],
  "s0339": [
    "If Bow and Arrow are drawn, harm reaches the Hu and the realm falls into chaos.",
    "Drawn Bow and Arrow harm the Hu and bring chaos."
  ],
  "s0340": [
    "It is also said: if the Celestial Bow is drawn, armies fill the realm and lord and minister plot against each other.",
    "Also: a drawn Celestial Bow means armies everywhere and lord-minister plots."
  ],
  "s0341": [
    "Six stars south of Bow are the Celestial Altar.",
    "Six stars south of Bow are the Celestial Altar."
  ],
  "s0342": [
    "In antiquity Gong Gong's son Gou Long could level water and earth—therefore he was sacrificed to match the altar; his essence became a star.",
    "Gou Long, Gong Gong's son, leveled water and earth—his essence became the altar star."
  ],
  "s0343": [
    "Old Man is one star south of Bow—also called South Pole.",
    "Old Man, one star south of Bow, is also the South Pole."
  ],
  "s0344": [
    "It regularly appears at dawn on the autumn equinox in the bing direction and sets at dusk on the spring equinox in the ding direction.",
    "It appears at autumn-equinox dawn in bing and sets at spring-equinox dusk in ding."
  ],
  "s0345": [
    "If seen, transformation is peaceful, the lord lives long; if gone, the ruler is in peril and replaces Heaven.",
    "If seen, peace and long life; if gone, the ruler faces peril."
  ],
  "s0346": [
    "Regularly at the autumn equinox it is observed at the southern suburb.",
    "It is observed at the southern suburb on the autumn equinox."
  ],
  "s0347": [
    "Six stars south of Willow are called Outer Kitchen.",
    "Six stars south of Willow are Outer Kitchen."
  ],
  "s0348": [
    "One star south of the Kitchen is called Celestial Record, governing the teeth of birds and beasts.",
    "One star south of the Kitchen is Celestial Record, governing beasts' teeth."
  ],
  "s0349": [
    "Millet has five stars south of Seven Stars.",
    "Millet has five stars south of Seven Stars."
  ],
  "s0350": [
    "Millet is the Minister of Agriculture.",
    "Millet is the Minister of Agriculture."
  ],
  "s0351": [
    "It takes the longest of the hundred grains as its title.",
    "It takes the chief of grains as its name."
  ],
  "s0352": [
    "Fourteen stars south of Extended Net are called Celestial Temple—the Son of Heaven's ancestral temple.",
    "Fourteen stars south of Extended Net are Celestial Temple, the royal ancestral shrine."
  ],
  "s0353": [
    "If a guest star guards it, sacrificial officers face grief.",
    "Guest stars guarding it bring grief to sacrificial officers."
  ],
  "s0354": [
    "Five stars south of Wings are called Eastern Region—barbarian stars.",
    "Five stars south of Wings are Eastern Region—barbarian stars."
  ],
  "s0355": [
    "Thirty-two stars south of Chariot are called Instrument Storehouse—the storehouse of musical instruments.",
    "Thirty-two stars south of Chariot are Instrument Storehouse for musical instruments."
  ],
  "s0356": [
    "Green Mound has seven stars southeast of Chariot—the name of a barbarian state.",
    "Green Mound's seven stars southeast of Chariot mark a barbarian state."
  ],
  "s0357": [
    "Four stars west of Green Mound are called Earth Minister, governing boundaries—also called Minister of Public Works.",
    "Four stars west of Green Mound are Earth Minister, governing boundaries."
  ],
  "s0358": [
    "Two stars north of Earth Minister are called Army Gate, governing camp watch, leopard tail, and battle flags.",
    "Two stars north of Earth Minister are Army Gate, governing camp watch and flags."
  ],
  "s0359": [
    "From Sceptre Holder to here, in all two hundred fifty-four officials and one thousand two hundred eighty-three stars.",
    "From Sceptre Holder to here: two hundred fifty-four officials and one thousand two hundred eighty-three stars."
  ],
  "s0360": [
    "Together with the twenty-eight lodges' assisting officials, they are called the constant fixed stars.",
    "With the twenty-eight lodges' assistants, they are the constant fixed stars."
  ],
  "s0361": [
    "Near and far have their measures; small and large have their differences.",
    "Near and far have measure; large and small, difference."
  ],
  "s0362": [
    "If they ever lose normality, it truly signals disaster and anomaly.",
    "Abnormality truly signals disaster."
  ],
  "s0363": [
    "The Celestial River rises in the east, passing between Tail and Winnowing Basket—called the River Ford.",
    "The Celestial River rises east, passing Tail and Winnowing Basket—the River Ford."
  ],
  "s0364": [
    "It then divides into two paths: the southern passes Fu Yue, Fish, Celestial Key, Celestial Cap, and River Drum; the northern passes Tortoise, pierces below Winnowing Basket, then links Southern Dipper head and Left Banner, reaching below Heavenly Ford and joining the southern path.",
    "It divides south through Fu Yue, Fish, and River Drum, and north through Tortoise and Southern Dipper, joining at Heavenly Ford."
  ],
  "s0365": [
    "It then travels southwest, again divides to flank Gourd, links Human Star, Pestle, Zao Fu, Coiled Snake, Wang Liang, Fu Road, north end of Level Road, Great Mound, Celestial Ship, Rolled Tongue southward, links Five Chariots, passes south of North River, enters Eastern Well Water Level southeast, links South River, Gate Mound, Celestial Dog, Celestial Record, Celestial Millet south of Seven Stars, and sets.",
    "Then southwest through Gourd, Five Chariots, Eastern Well, and Seven Stars, where it sets."
  ],
  "s0366": [
    "Heaven's divination, the Hong Fan Wuxing Commentary says: \"Clear and bright is Heaven's body; if Heaven suddenly changes color, this is called altering the constant.\"",
    "The Hong Fan Wuxing Commentary says: \"Clear and bright is Heaven's body; sudden color change alters the constant.\""
  ],
  "s0367": [
    "Heaven splits—yang is insufficient, meaning ministers are strong, subordinates will harm superiors, the state later splits, and the lord below will suffer for it.",
    "Heaven splits means insufficient yang—strong ministers, split realm, suffering lords."
  ],
  "s0368": [
    "Heaven opens and light appears—blood flows in torrents.",
    "Heaven opening to light brings torrents of blood."
  ],
  "s0369": [
    "Heaven splits and people are seen—armies rise and the state perishes.",
    "Heaven splitting with visible people means war and national ruin."
  ],
  "s0370": [
    "Heaven sounds with noise—the Supreme One grieves and is startled.",
    "Heaven's sound means the Supreme One grieves and startles."
  ],
  "s0371": [
    "All are born of a disordered state.",
    "All arise from a disordered state."
  ],
  "s0372": [
    "\"",
    "\""
  ],
  "s0373": [
    "In Han Emperor Hui's second year, Heaven opened in the northeast, thirty-plus zhang long and ten-plus zhang wide.",
    "In Han Hui's second year, Heaven opened northeast—thirty-plus zhang long."
  ],
  "s0374": [
    "Afterward came the Lü clan's rebellion.",
    "Afterward came the Lü clan rebellion."
  ],
  "s0375": [
    "In Jin Emperor Hui's Tai'an second year, Heaven split at the center.",
    "In Jin Hui's Tai'an second year, Heaven split at center."
  ],
  "s0376": [
    "Emperor Mu's Shengping fifth year, it split again, several zhang wide, and there was sound like thunder.",
    "Mu Di's Shengping fifth year: another split, several zhang wide, with thunder."
  ],
  "s0377": [
    "Afterward all had responses of warfare.",
    "Afterward all brought warfare."
  ],
  "s0378": [
    "The seven luminaries: the sun follows the Yellow Path eastward, traveling one degree in one day and night, completing a circuit in three hundred sixty-five and a fraction days.",
    "The sun follows the ecliptic eastward one degree per day, circling in 365+ days."
  ],
  "s0379": [
    "Traveling the eastern quarter is called spring; southern, summer; western, autumn; northern, winter.",
    "Eastern travel is spring; southern, summer; western, autumn; northern, winter."
  ],
  "s0380": [
    "Its travel completes the nodes of yin-yang, cold and heat.",
    "Its travel sets the nodes of yin-yang and seasons."
  ],
  "s0381": [
    "Therefore the Commentary says: \"The sun is the essence of Great Yang, governing nurturing virtue and grace, the image of the human lord.\"",
    "The Commentary says: \"The sun is Great Yang's essence, the image of the human lord.\""
  ],
  "s0382": [
    "Also, when the human lord has flaws, his wickedness must be exposed to give warning.",
    "When the ruler has flaws, his wickedness is exposed as warning."
  ],
  "s0383": [
    "Therefore when sun and moon travel through a state with the Way, they are bright, the lord is auspicious, and the people are at peace.",
    "Sun and moon in a righteous state shine bright—the lord prospers and people are at peace."
  ],
  "s0384": [
    "If the sun changes color, with armies they are destroyed; without armies, marquises and kings mourn.",
    "Sun color change destroys armies—or mourns lords without armies."
  ],
  "s0385": [
    "If the lord lacks virtue and ministers disorder the state, the sun is red without light.",
    "A virtueless lord and disorderly ministers make the sun red and dim."
  ],
  "s0386": [
    "If the sun loses color, the state it faces does not flourish.",
    "A discolored sun means the state it faces fails."
  ],
  "s0387": [
    "If the sun is dim at midday, travelers cast no shadow until evening without stopping, punishments above are harsh, people below cannot live—in less than a year, great flood.",
    "Midday dim sun with no shadows means harsh punishments and great flood within a year."
  ],
  "s0388": [
    "If the sun is dim at day and crows flock, government is lost.",
    "Daytime dim sun with flocking crows means lost government."
  ],
  "s0389": [
    "If a crow appears in the sun, the lord is not enlightened, government is chaotic, and the state has a white-clad assembly.",
    "A crow in the sun means a darkened lord, chaotic rule, and white-clad assembly."
  ],
  "s0390": [
    "Black spots, black qi, or black clouds in the sun, appearing three or five at a time—ministers depose their lord.",
    "Black spots, qi, or clouds in the sun mean ministers depose their lord."
  ],
  "s0391": [
    "Solar eclipse: yin invades yang, ministers cover the lord—there is a fallen state, a dead lord, or great flood.",
    "Solar eclipse: yin invades yang—fallen states, dead lords, or great floods."
  ],
  "s0392": [
    "If stars are seen during solar eclipse, a lord is killed and the realm splits.",
    "Stars visible during eclipse mean a killed lord and a split realm."
  ],
  "s0393": [
    "Kings cultivate virtue to avert it.",
    "Kings cultivate virtue to avert it."
  ],
  "s0394": [
    "The moon is the essence of yin.",
    "The moon is yin's essence."
  ],
  "s0395": [
    "Its form is round, its substance clear; when sunlight shines on it, its brightness is seen.",
    "Round and clear, it shows brightness when sunlight strikes it."
  ],
  "s0396": [
    "Where sunlight does not shine is called the dark portion.",
    "Where sunlight does not reach is the dark portion."
  ],
  "s0397": [
    "Thus on the full-moon day, sun and moon face each other; people stand between them and see all its brightness—therefore the form is round.",
    "At full moon, sun and moon face each other; people between see a round disk."
  ],
  "s0398": [
    "On the two quarter days, sunlight strikes the side and people view from the side—therefore half bright and half dark.",
    "At quarter moons, sunlight strikes the side—half bright, half dark."
  ],
  "s0399": [
    "On new and full moon days, sunlight strikes the face and people are within—therefore it is not seen.",
    "At new and full moon, sunlight strikes the face and the moon is not seen."
  ],
  "s0400": [
    "Its travel has slow and fast phases.",
    "Its motion has slow and fast phases."
  ]
};
const targetPath = process.argv[2];
if (!targetPath) { console.error('Usage'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;
for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) { s.literal = pair[0]; s.idiomatic = pair[1]; patched++; }
}
fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log('Patch count: ' + patched);
if (patched !== Object.keys(T).length) process.exitCode = 1;
