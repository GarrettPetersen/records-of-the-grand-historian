#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: ['The State of Panpan', 'Panpan'],
  s0202: ['The State of Dandan', 'Dandan'],
  s0203: ['The State of Kandhari', 'Kandhari'],
  s0204: [
    'The State of Kandhari lies on isles in the South Sea.',
    'Kandhari stands on South Sea isles.',
  ],
  s0205: [
    'Its customs are roughly the same as Linyi and Funan.',
    'Its customs largely match those of Linyi and Funan.',
  ],
  s0206: [
    'It produces patterned cloth, kapok, and betel nut; its betel nut is especially fine—the best among all the states.',
    'It exports patterned cloth, kapok, and betel; the betel is the finest in the region.',
  ],
  s0207: [
    'In the Xiaowu reign of Song, King Jayabharata sent Chief Clerk Zhulutuo presenting gold, silver, and precious vessels.',
    'Under Song Emperor Xiaowu, King Jayabharata sent Chief Clerk Zhulutuo with gold, silver, and treasure.',
  ],
  s0208: [
    'In the first year of Tianjian, King Gautama Vijayabhadra on the eighth day of the fourth month dreamed of a monk who told him: "China now has a sage ruler; in ten years the Buddhist Law will flourish greatly.',
    'In Tianjian year one, King Gautama Vijayabhadra dreamed on the eighth day of the fourth month that a monk said, "China has a sage king; in ten years the Dharma will rise.',
  ],
  s0209: [
    'If you send envoys to offer tribute and show respect, then the land will be rich and joyful and merchants will multiply a hundredfold;',
    'If you send tribute and honor him, your land will prosper and trade will multiply a hundredfold;',
  ],
  s0210: [
    'if you do not believe me, your borders will not know peace.',
    'if you disbelieve me, your realm will know no peace.',
  ],
  s0211: [
    '" Vijayabhadra at first could not yet believe; then he dreamed again of this monk saying: "If you do not believe me, I shall take you to see for yourself.',
    '" At first Vijayabhadra did not believe; then the monk appeared again in a dream: "If you doubt me, I will take you to see.',
  ],
  s0212: [
    '" Then in the dream he came to China and paid homage to the Son of Heaven.',
    '" In the dream he traveled to China and bowed to the emperor.',
  ],
  s0213: [
    'When he awoke, his heart was stirred.',
    'When he woke, he was deeply moved.',
  ],
  s0214: [
    'Vijayabhadra was skilled at painting; he painted Gaozu\'s appearance as seen in the dream, colored it, and sent envoys together with painters bearing a memorial and presenting a jade platter and other objects.',
    'A painter by trade, he set down Gaozu\'s likeness from the dream in color and sent envoys and painters with a memorial, a jade platter, and other gifts.',
  ],
  s0215: [
    'When the envoys arrived, they traced Gaozu\'s form to take back to their state—and compared with the original painting, it matched exactly.',
    'The envoys traced Gaozu\'s portrait to carry home; it matched the dream painting exactly.',
  ],
  s0216: [
    'They therefore stored it in a precious casket and daily added their reverence.',
    'They enshrined it in a jeweled casket and worshipped it daily.',
  ],
  s0217: [
    'Later Vijayabhadra died, and his son Vijayavarman succeeded.',
    'After Vijayabhadra died, his son Vijayavarman rose.',
  ],
  s0218: [
    'In the seventeenth year, Chief Clerk Vijayavarman sent a memorial saying: "Ever-victorious Son of Heaven Your Majesty: the Buddhas, World-Honored Ones, ever delight in peace and joy, possess the six superknowledges and three knowledges, and are honored above the world—this is called the Tathagata.',
    'In year seventeen, Chief Clerk Vijayavarman memorialized: "Ever-victorious Son of Heaven: the World-Honored Buddhas delight in peace, hold the six and three knowledges, and are lords of the world—the Tathagata.',
  ],
  s0219: [
    'Worthy of offerings, rightly enlightened, leaving behind bodily relics, building pagodas and images, adorning the realm like Mount Sumeru.',
    'Worthy of offerings and perfect enlightenment, he left relics and raised pagodas and images, adorning the land like Mount Sumeru.',
  ],
  s0220: [
    'Settlements and hamlets fill the land in ordered ranks; walls, lodges, and halls are like the Trayastrimsa Heaven.',
    'Towns and villages fill the land in ranks; walls and palaces rise like the Heaven of Thirty-Three.',
  ],
  s0221: [
    'Fully equipped with the four armies, able to subdue hostile foes.',
    'Four armies stand ready and enemies are subdued.',
  ],
  s0222: [
    'The realm is secure and joyous, without disaster or hardship; the people are gentle and kind, receive and transform in the true Law—all blessings reach everywhere.',
    'The realm is safe and glad, free of woe; the people are gentle, ruled by the true Law, and blessed without end.',
  ],
  s0223: [
    'Like dwelling beside snowy mountains, where melting snow pours forth—eight pure flavors, a hundred streams overflowing, winding and bending, all flowing toward the great sea, and every living being alike receives and enjoys.',
    'Like snow mountains feeding pure streams that wind to the sea, so all beings drink their fill.',
  ],
  s0224: [
    'Among all lands it is uniquely supreme—this is called Zhendan.',
    'Supreme among lands—this is Zhendan.',
  ],
  s0225: [
    'The Son of Heaven of Great Liang at Yangdu, benevolent canopy over the four seas, virtue matching Heaven\'s heart—though human in form, born of Heaven to guard the world, a treasury of merit, great compassion saving the world, our venerated life, complete in dignified bearing.',
    'Great Liang\'s Son of Heaven at Yangdu spreads mercy over the four seas; though in human form he guards the world—a treasury of merit and compassion, our lord in full majesty.',
  ],
  s0226: [
    'Therefore with utmost sincerity we reverently bow at the Son of Heaven\'s feet and knock our heads to inquire after your health.',
    'With full sincerity we bow at your feet and beg after your health.',
  ],
  s0227: [
    'We present golden hibiscus, mixed fragrant medicaments, and the like—may you graciously accept.',
    'We offer golden lotus, mixed incense, and more—may you accept them.',
  ],
  s0228: [
    'In the first year of Putong, envoys were again sent presenting local products.',
    'In Putong year one they again sent tribute.',
  ],
  s0229: ['The State of Lang-ya-xiu', 'Lang-ya-xiu'],
  s0230: [
    'The State of Lang-ya-xiu lies in the South Sea.',
    'Lang-ya-xiu stands in the South Sea.',
  ],
  s0231: [
    'Its borders run thirty days\' journey east to west and twenty days north to south; it is twenty-four thousand li from Guangzhou.',
    'It spans thirty days\' travel east-west and twenty north-south, twenty-four thousand li from Guangzhou.',
  ],
  s0232: [
    'Climate and products resemble Funan, but especially abundant in agarwood, aloeswood, and borneol.',
    'Climate and products match Funan, but agarwood, aloeswood, and borneol are especially plentiful.',
  ],
  s0233: [
    'The custom is for men and women alike to bare their torsos and wear their hair loose, using kapok for waist-cloths.',
    'Men and women go bare-chested with loose hair, wearing kapok waist-wraps.',
  ],
  s0234: [
    'The king and great ministers add cloud-brocade cloth over the shoulders, use gold cords for belts, and wear gold rings through the ears.',
    'Kings and nobles drape cloud-brocade over the shoulders, belt themselves with gold cord, and pierce the ears with gold rings.',
  ],
  s0235: [
    'Women wrap in cloth, with strings of jewels around the body.',
    'Women wrap in cloth adorned with jeweled chains.',
  ],
  s0236: [
    'The state piles brick to make walls, with layered gates, towers, and pavilions.',
    'They build brick walls with tiered gates, towers, and halls.',
  ],
  s0237: [
    'When the king goes out he rides an elephant, with pennants of yak-tail, drums and flags, a white canopy, and strong guard formations.',
    'The king rides an elephant under white canopy, with yak-tail banners, drums, flags, and heavy guard.',
  ],
  s0238: [
    'The people say that since the founding of the state four hundred-odd years ago, later descendants grew weak; when there was a worthy man among the royal clan, the people rallied to him.',
    'They say the kingdom is four hundred years old; when the line weakened, a worthy prince drew the people to him.',
  ],
  s0239: [
    'When the king learned of it, he had him imprisoned and bound; the lock broke for no reason—the king took this as divine and therefore dared not harm him, but expelled him beyond the border; he fled to Central Tianzhu, and Tianzhu gave him the eldest princess in marriage.',
    'The king imprisoned him, but his chains broke untouched; taking it for a sign, the king banished him; he fled to Central Tianzhu and married the eldest princess.',
  ],
  s0240: [
    'Before long the Lang-ya king died, and the ministers welcomed him back as king.',
    'Soon the Lang-ya king died and ministers recalled him to the throne.',
  ],
  s0241: [
    'After more than twenty years he died, and his son Bhagadatta succeeded.',
    'After twenty-odd years he died; his son Bhagadatta succeeded.',
  ],
  s0242: [
    'In the fourteenth year of Tianjian, Envoy Ashade sent a memorial saying: "Great auspicious Son of Heaven at your feet: free from lust, anger, and folly, pitying all beings, boundless in compassionate heart.',
    'In Tianjian fourteen, Envoy Ashade memorialized: "Great auspicious Son of Heaven: free of lust, anger, and folly, pitying all beings with boundless compassion.',
  ],
  s0243: [
    'Solemn and fair of appearance, body bright and clear, like the moon in water, shining on all directions.',
    'Your bearing is solemn, your body luminous as the moon in water, shining everywhere.',
  ],
  s0244: [
    'The white tuft between the brows, white as snow, its color radiant, also like moonlight.',
    'The white tuft between your brows gleams like snow and moonlight.',
  ],
  s0245: [
    'Worshipped by heaven\'s good spirits, spreading the treasure of the true Law, increasing hosts who uphold Brahma conduct, adorning the capital.',
    'Heaven\'s spirits worship you; the true Law spreads, the devout increase, and the capital is adorned.',
  ],
  s0246: [
    'Walls and towers high and steep, like Mount Gandhamadana.',
    'Walls and towers rise steep as Gandhamadana.',
  ],
  s0247: [
    'Pavilions and belvederes arrayed in rows; roads and paths level and straight.',
    'Pavilions line the avenues; roads run straight and level.',
  ],
  s0248: [
    'The people flourish; joy and security abound.',
    'The people flourish in joy and peace.',
  ],
  s0249: [
    'Wearing many kinds of garments, like heavenly robes.',
    'They wear many robes like those of heaven.',
  ],
  s0250: [
    'Among all lands, supremely honored and victorious.',
    'Supreme and victorious among all lands.',
  ],
  s0251: [
    'The Heavenly King pities all living beings; the people secure and glad; compassionate heart deep and vast; discipline and rites pure and clear; governed by the true Law; offerings to the Three Treasures; fame proclaimed and spread, filling the world—the common folk delight to see him, like the new moon at its first rising.',
    'Heaven\'s king pities all beings; the people live secure; compassion runs deep; discipline is pure; the Three Treasures are honored; his fame fills the world, and the people rejoice like at the new moon.',
  ],
  s0252: [
    'Like Brahma, lord of the world—all human and divine beings alike take refuge.',
    'Like Brahma, lord of the world, to whom human and divine alike bow.',
  ],
  s0253: [
    'We reverently bow at the feet of the great auspicious Son of Heaven, as though he stood before us; we inherit our predecessors\' legacy—our rejoicing knows no bound.',
    'We bow to the great auspicious Son of Heaven as though he stood before us; inheriting our fathers\' duty, our joy is boundless.',
  ],
  s0254: [
    'We now send envoys to inquire after your great intent.',
    'We send envoys now to greet your will.',
  ],
  s0255: [
    'We wished to come ourselves, but again feared the wind and waves of the great sea would prevent arrival.',
    'We would come ourselves but fear the sea\'s storms.',
  ],
  s0256: [
    'We now present these slight offerings—may Your Majesty graciously bend to receive them."',
    'We offer these humble gifts—may you deign to accept."',
  ],
  s0257: ['The State of Pali', 'Pali'],
  s0258: [
    'The State of Pali lies on isles in the Southeast Sea east of Guangzhou; from Guangzhou it is two months\' voyage.',
    'Pali lies on Southeast Sea isles east of Guangzhou, two months\' sail away.',
  ],
  s0259: [
    'The border runs fifty days\' journey east to west and twenty days north to south.',
    'It spans fifty days\' travel east-west and twenty north-south.',
  ],
  s0260: [
    'There are one hundred thirty-six settlements.',
    'It holds one hundred thirty-six settlements.',
  ],
  s0261: [
    'The climate is hot and humid, like midsummer in China.',
    'The air runs hot and humid as Chinese midsummer.',
  ],
  s0262: [
    'Grain ripens twice a year; grass and trees stay green year-round.',
    'Grain harvests twice; trees stay green year-round.',
  ],
  s0263: [
    'The sea yields patterned shells and purple cowries.',
    'The sea gives patterned shells and purple cowries.',
  ],
  s0264: [
    'There is a stone called han-beiluo; when first quarried it is soft, but when carved into objects and dried it becomes greatly hard and strong.',
    'A stone called han-beiluo is soft when quarried, yet carved and dried becomes very hard.',
  ],
  s0265: [
    'The people of the state wear kapok like a wrap, and also make it into skirt-cloths.',
    'People wear kapok as wraps and skirt-cloths.',
  ],
  s0266: [
    'The king alone uses figured silk cloth, with strings of jewels around the body; on his head he wears a gold crown more than a foot high, shaped like a cap, inlaid with seven-jewel ornament; at his side a gold-hilted sword; he sits askew on a high gold seat, with silver stirrups supporting the feet.',
    'The king alone wears figured silk jeweled at the body, a foot-high gold crown shaped like a cap set with seven treasures, a gold-hilted sword at his side, seated sidewise on a gold throne with silver footrests.',
  ],
  s0267: [
    'Attending women all bear ornament of golden flowers and mixed jewels, or hold white yak-tail whisks and peacock fans.',
    'Serving women wear gold flowers and mixed gems, or carry white yak-tail whisks and peacock fans.',
  ],
  s0268: [
    'When the king goes out, he rides an elephant-drawn carriage; the carriage is made of mixed incense, topped with feather canopy and pearl curtains; the escort blows conches and beats drums.',
    'The king rides an incense-wood carriage under feather canopy and pearl curtains, escorted by conches and drums.',
  ],
  s0269: [
    'The royal surname is Kaccayana; from antiquity it had no contact with China.',
    'The royal house bears the name Kaccayana; until now it had not reached China.',
  ],
  s0270: [
    'Asked about its founders and the count of years, they could not record them; but they say the consort of King Suddhodana was a woman of this state.',
    'They cannot recall founders or years, but say the consort of King Suddhodana came from Pali.',
  ],
  s0271: [
    'In the sixteenth year of Tianjian, envoys sent a memorial saying: "We have heard that the sage king faith-reveres the Three Treasures, builds and raises pagodas and temples, adorns and makes solemn, everywhere throughout the realm.',
    'In Tianjian sixteen they memorialized: "We hear your sage king honors the Three Treasures, builds temples, and adorns the realm.',
  ],
  s0272: [
    'The four thoroughfares are level, clean and without filth;',
    'Crossroads lie level and clean;',
  ],
  s0273: [
    'Terraces and halls arrayed in rows, shaped like heavenly palaces;',
    'Terraces and halls stand in rows like heavenly palaces;',
  ],
  s0274: [
    'Magnificent and subtle—none in the world equals them.',
    'Magnificent beyond compare in all the world.',
  ],
  s0275: [
    'When the sage lord goes out, the four armies are complete; feathered insignia lead the escort, filling left and right.',
    'When the sage lord goes forth, four armies stand complete, insignia filling left and right.',
  ],
  s0276: [
    'Capital gentlemen and ladies, in beautiful dress and luminous ornament.',
    'Capital men and women shine in splendid dress.',
  ],
  s0277: [
    'Markets and shops rich and full, heaped with rare treasures.',
    'Markets overflow with rare treasure.',
  ],
  s0278: [
    'Royal law is pure and ordered; none seize from one another.',
    'Royal law is clear and none rob another.',
  ],
  s0279: [
    'Students all arrive; the Three Vehicles compete to gather.',
    'Students flock in; the Three Vehicles crowd together.',
  ],
  s0280: [
    'Expounding the true Law, like clouds spreading and rain moistening.',
    'The true Law is preached like clouds and rain.',
  ],
  s0281: [
    'The four seas flow together; ten thousand states meet in commerce.',
    'The four seas trade; ten thousand realms meet.',
  ],
  s0282: [
    'The Long River stretches boundless, clear, cool, deep and vast.',
    'The Long River runs clear, deep, and vast.',
  ],
  s0283: [
    'All who live draw sustenance from it; none can defile it.',
    'All living things drink of it; none can soil it.',
  ],
  s0284: [
    'Yin and yang are harmonious and mild; pestilence and calamity do not arise.',
    'Yin and yang stay mild; plague does not come.',
  ],
  s0285: [
    'The sage king of Great Liang at Yangdu is without equal, overlooking the upper realm, with great compassion, nurturing ten thousand folk as children.',
    'Great Liang\'s sage king at Yangdu is peerless, overlooking the realm, nurturing all people with great compassion.',
  ],
  s0286: [
    'Equal in patience and forbearance; foe and kin are not two.',
    'Patient and forbearing alike to foe and friend.',
  ],
  s0287: [
    'Moreover relieving the destitute—nothing hoarded in store.',
    'He relieves the poor and keeps no store.',
  ],
  s0288: [
    'Nothing not illumined and warmed, like the sun\'s brightness;',
    'Nothing lies outside his light, bright as the sun;',
  ],
  s0289: [
    'none not receiving joy, like the pure moon.',
    'all receive joy like the clear moon.',
  ],
  s0290: [
    'Chancellors are worthy; ministers and officials are upright in faith, fully loyal in serving the court, without divergent thoughts in heart.',
    'Chancellors are wise, ministers faithful and wholly loyal without second thought.',
  ],
  s0291: [
    'We humbly consider: the Emperor is our true Buddha; your servant is king of Pali; now we reverently knock our heads and bow at the sage king\'s feet—may the Great King know this heart of ours.',
    'We bow our heads: the Emperor is our true Buddha; I am king of Pali; I bow at your feet—know my heart.',
  ],
  s0292: [
    'This heart is long-standing, not only now.',
    'This heart is old, not new today.',
  ],
  s0293: [
    'Mountains and seas block the way—we could not reach you ourselves; therefore we now send envoys presenting golden mats and the like, declaring this red sincerity."',
    'Mountains and seas block us from coming; we send envoys with golden mats to show our sincere hearts."',
  ],
  s0294: [
    'In the third year of Putong, King Pinjia again sent Envoy Zhubeizhi presenting white parrots, green worms, helmets, glassware, kapok, shell cups, mixed incense, medicaments, and several dozen kinds besides.',
    'In Putong three, King Pinjia sent Envoy Zhubeizhi with white parrots, green worms, helmets, glassware, kapok, shell cups, mixed incense, drugs, and dozens more.',
  ],
  s0295: ['Central Tianzhu', 'Central Tianzhu'],
  s0296: [
    'Central Tianzhu lies several thousand li southeast of the Great Yuezhi; its territory is thirty thousand li square; it is also called Shendu.',
    'Central Tianzhu lies thousands of li southeast of the Great Yuezhi, thirty thousand li square, also called Shendu.',
  ],
  s0297: [
    'In Han times Zhang Qian went as envoy to Daxia and saw Qiong bamboo staves and Shu cloth; the people of that country said they were bought in Shendu.',
    'In Han, Zhang Qian reached Daxia and saw Qiong staves and Shu cloth; locals said they came from Shendu.',
  ],
  s0298: [
    'Shendu is Tianzhu—the sound differs in translation, but in fact they are one.',
    'Shendu is Tianzhu: the names differ in transmission but it is the same land.',
  ],
  s0299: [
    'From the Yuezhi and Gaofu westward, south to the Western Sea, east to Pan Yue—several dozen states in a row, each with its own king; though the names differ, all are Shendu.',
    'From Yuezhi and Gaofu west to the Western Sea and east to Pan Yue, dozens of kingdoms each with its own king—all Shendu under different names.',
  ],
  s0300: [
    'In Han times it was subordinate to the Yuezhi; its custom is settled folk like the Yuezhi, but low, damp, and hot; the people are weak and fear battle—weaker than the Yuezhi.',
    'In Han it owed fealty to Yuezhi; like Yuezhi its people were settled, but the land is low, damp, and hot; the people are soft and fear war— weaker than Yuezhi.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_054_b3.mjs <translation.json>'
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
