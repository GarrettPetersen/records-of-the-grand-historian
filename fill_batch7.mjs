import fs from "fs";

/** Chinese field exactly equals "=" */
const EQ = (s) => s === "=";
/** Chinese field begins with "=" (citation / editorial marker) */
const EQi = (s) => typeof s === "string" && s.startsWith("=");

const TMP = fs.readFileSync("/workspace/tmp_batch7.txt", "utf8");
const tmpLines = TMP.trim().split("\n");
const tmpMap = Object.fromEntries(
  tmpLines.map((line) => {
    const i = line.indexOf("|");
    const id = line.slice(0, i);
    const chinese = line.slice(i + 1);
    return [id, chinese];
  }),
);

/** Literal + idiomatic for Jinshu 027 batch 7 (s0602–s0701). Ken Liu–style pair. */
const B7 = {
  s0602: {
    literal:
      "By the end of the Yuankang era, women wore the double-panel skirt outward, placing it above the overlapping collar—this was 'the inner emerging outward.'",
    idiomatic:
      "Late in Yuankang, women reversed their skirts so the panels rode above the crossed collar—what should stay beneath showed on top.",
  },
  s0603: {
    literal:
      "Those who fashioned carriages prized lightness and fineness, repeatedly altering their shapes, all using white bamboo splints for edging—likely a lingering likeness of ancient mourning carts.",
    idiomatic:
      "Carriage-makers chased flimsy, ever-changing designs trimmed with white bamboo—echoes of funeral hearses from antiquity.",
  },
  s0604: {
    literal: "Now, riding is the instrument of the gentleman.",
    idiomatic: "The carriage is the gentleman's proper equipage.",
  },
  s0605: {
    literal:
      "For the gentleman sets his mind without constancy and does not honor substance in his affairs.",
    idiomatic:
      "It matched gentlemen whose aims shifted and who prized display over substance.",
  },
  s0606: {
    literal: "Gan Bao took it as an omen of calamity for Jin.",
    idiomatic: "Gan Bao read it as a portent of Jin's ruin.",
  },
  s0607: {
    literal:
      "When Emperor Hui ascended the throne, controlling authority lay with favored ministers—the correspondence of 'below masking above.'",
    idiomatic:
      "When Emperor Hui took the throne, power rested with favored courtiers—the pattern of inferiors overshadowing their sovereign.",
  },
  s0608: {
    literal:
      "By the end of Yongjia, talented women of the six palaces drifted away and were lost among the Rong and Di—it was the correspondence of 'inner emerging outward.'",
    idiomatic:
      "By Yongjia's end, palace ladies had scattered into barbarian hands—the inner court cast outward among outsiders.",
  },
  s0609: {
    literal:
      "When all under heaven was thrown into turmoil, chief ministers and regional shepherds often betrayed their charges, and repeatedly altered offices without honoring substance—the correspondence thereof.",
    idiomatic:
      "As the realm unraveled, ministers and governors failed their posts while titles changed without fixing anything—the omen of empty show.",
  },
  s0610: {
    literal:
      "After the Taishi era, the Central Lands came to esteem Hu benches and Mo trays, and to prepare Qiang-boil and Mo-roast dishes; the noble and wealthy kept such utensils ready, and at auspicious feasts and joyous gatherings they put them first.",
    idiomatic:
      "After Taishi, Central Plains folk embraced alien benches and platters, Qiang-style boiled fare and roasted Mo dishes—the rich stocked them for every banquet.",
  },
  s0611: {
    literal:
      "In the Taikang period, they further used felt for head-wraps and for belt bands and trouser cuffs.",
    idiomatic:
      "By Taikang, felt wrapped the head, belt, and trouser legs—steppe style on the body.",
  },
  s0612: {
    literal:
      "The common folk jested among themselves, saying the Central Lands would surely be broken by the Hu.",
    idiomatic:
      "People joked that the heartland would fall to the steppe peoples.",
  },
  s0613: {
    literal:
      "Now felt and coarse wool are produced among the Hu, yet all under heaven used them for head-wraps, belts, and trouser cuffs—the Hu had already imposed three kinds of restraint; could there be no defeat!",
    idiomatic:
      "Felt comes from the north, yet everyone wrapped head, waist, and ankles in it—the barbarians had claimed three garments off the body; defeat followed.",
  },
  s0614: {
    literal:
      "By the Yuankang era, Di and Qiang rose against each other in turn; after Yongjia, Liu and Shi seized the central capital; thereafter the four Yi in succession occupied the Chinese soil—it was the correspondence of clothing prodigies.",
    idiomatic:
      "Through Yuankang the Di and Qiang rebelled; after Yongjia Liu and Shi took Luoyang; then outsiders held the heartland—the 'ominous dress' omen fulfilled.",
  },
  s0615: {
    literal:
      "When clogs were first made, women's toes were round, men's square.",
    idiomatic: "Early clogs had round toes for women, square for men.",
  },
  s0616: {
    literal: "Round means yielding; it served to distinguish male from female.",
    idiomatic: "Round signified yielding—the line drawn between the sexes.",
  },
  s0617: {
    literal:
      "By early Taikang, women's clogs had square toes, no different from men's.",
    idiomatic:
      "Come Taikang, women's clog toes went square like men's—the distinction blurred.",
  },
  s0618: {
    literal: "This was an omen of Empress Jia's jealous monopoly.",
    idiomatic: "It foretold Empress Jia's jealous grip on power.",
  },
  s0619: {
    literal:
      "In Taikang, all under heaven performed the dance of 'Jin at Peace,' catching cups and platters in the hands and flipping them, singing 'Jin at peace—dance with cups and platters.'",
    idiomatic:
      "Taikang saw the 'Jin at Peace' dance—hands tossing cups and bowls while singers cried that peace in Jin meant spinning the cups.",
  },
  s0620: {
    literal:
      "Those who understood omens said: 'Music is born from the human heart; thereby one observes affairs.'",
    idiomatic:
      "Critics said music springs from the heart and lays bare the age.",
  },
  s0621: {
    literal:
      "Now to catch cups and platters in the hands and flip them—this is an affair of utmost peril.",
    idiomatic: "Juggling dishes in the hand is peril itself.",
  },
  s0622: {
    literal:
      "Cups and platters are vessels for wine and food, yet the piece is named 'Jin at Peace'—it says the gentlemen of Jin sneak mere pleasure in wine and food, their knowledge reaching no farther; Jin's 'peace' is like cups and platters held in the hand.'",
    idiomatic:
      "Cups mean feast and drink, yet the song promises peace—Jin's elite cared only for the banquet; their peace was as fragile as china in the palm.",
  },
  s0623: {
    literal:
      "In Emperor Hui's Yuankang era, women's ornaments included 'five-weapons' pendants; they further fashioned axes, halberds, spears, and ji from gold, silver, and tortoiseshell to serve as hairpins.",
    idiomatic:
      "Yuankang ladies wore jewelry shaped like weapons—metal axes and halberds as hairpins.",
  },
  s0624: {
    literal:
      "Gan Bao thought: 'The distinction between man and woman is the great norm of the state; hence garments differ in grade and ritual offerings differ.'",
    idiomatic:
      "Gan Bao: gender norms anchor the state—dress and ritual gifts must differ.",
  },
  s0625: {
    literal:
      "Now for women to take weapons as ornaments—this is the utmost of feminine prodigy.",
    idiomatic: "Arming women with ornaments was prodigy at its worst.",
  },
  s0626: {
    literal: "Thereupon there came the affair of Empress Jia.'",
    idiomatic: "Then came Empress Jia's coup against the heir.",
  },
  s0627: {
    literal: "In the end the realm perished.",
    idiomatic: "The dynasty fell.",
  },
  s0628: {
    literal:
      "At this time, among women who bound their hair, once the arrangement was complete, they tightly bound the coil with silk and called it the 'plucked-child knot.'",
    idiomatic:
      "Women finished their coifs, then cinched them tight with silk—the 'plucked-child bun.'",
  },
  s0629: {
    literal: "It began in the inner palace; all under heaven imitated it.",
    idiomatic: "The palace set the fashion; the realm copied it.",
  },
  s0630: {
    literal:
      "Afterward it corresponded to Empress Jia's deposition and murder of the heir apparent.",
    idiomatic: "It matched Empress Jia's destruction of the crown prince.",
  },
  s0631: {
    literal:
      "In Yuankang, all under heaven began to imitate crow-headed staffs braced under the arm; later they gradually fitted ferrules, and when resting planted them upright.",
    idiomatic:
      "Yuankang folk copied crow-head staffs tucked under the arm—later capped with metal ferrules and planted like poles when idle.",
  },
  s0632: {
    literal: "Wood is the phase of the east; it is subject to metal.",
    idiomatic: "Wood belongs to the east; it yields to metal.",
  },
  s0633: {
    literal:
      "The staff is an instrument to support the body; crowning it with a crow's head makes it especially handy.",
    idiomatic: "A staff steadies the walker; a crow tip made it handier.",
  },
  s0634: {
    literal: "That it must brace under the arm—this is an image of rescue from the side.",
    idiomatic: "Tucking it under the arm suggested sidelong rescue.",
  },
  s0635: {
    literal:
      "They fitted its metal; braced on the staff it stands planted—it says wood depends on metal and can stand alone.",
    idiomatic:
      "Metal ferrules let the planted staff stand—wood leaning on metal yet standing alone.",
  },
  s0636: {
    literal:
      "By the reigns of Emperors Huai and Min, the royal house suffered many crises and the central capital fell; Emperor Yuan, a feudal prince, planted virtue in the east and upheld all under heaven—the correspondence of bracing under the arm.",
    idiomatic:
      "When Luoyang fell, Yuan as prince raised the east—exactly the 'underarm brace' sign.",
  },
  s0637: {
    literal:
      "When altars had no master and the realm turned to him, he received Heaven's mandate, founded the capital south of the Yangtze, and stood alone—the correspondence thereof.",
    idiomatic:
      "When nothing held the center, the realm rallied south—the sign of standing alone became court.",
  },
  s0638: {
    literal:
      "Between Yuankang and Tai'an, in the Jiang-Huai region worn sandals piled of themselves on the roads—sometimes forty or fifty pairs; people might scatter them into pits and valleys, yet next morning they were as before.",
    idiomatic:
      "Yuankang–Tai'an: tattered sandals heaped on Jiang-Huai roads—scatter them at night, they reappeared by dawn.",
  },
  s0639: {
    literal: "Some said they saw foxes gather them in their mouths.",
    idiomatic: "Some swore foxes stacked them.",
  },
  s0640: {
    literal:
      "Gan Bao thought: 'Sandals are the mean clothing of men; they dwell in toil and shame—the image of the black-haired populace.'",
    idiomatic: "Gan Bao: sandals are laborers' shoes—the common folk in grime.",
  },
  s0641: {
    literal: "'Tattered' is the image of exhaustion;",
    idiomatic: "'Worn' meant spent strength.",
  },
  s0642: {
    literal:
      "'Road' is where the four quarters come and go—thereby the king's commands travel.",
    idiomatic: "Roads carry the king's orders.",
  },
  s0643: {
    literal:
      "'Now worn sandals pile on the roads—it images the black-haired folk weary and sick, about to gather in rebellion and cut off the king's command.'",
    idiomatic:
      "Sandals heaped on highways meant exhausted masses rising to sever the throne.",
  },
  s0644: {
    literal: "In Tai'an they levied the ren-wu army; the hundred surnames resented and rebelled.",
    idiomatic: "Tai'an's ren-wu draft drove commoners to revolt.",
  },
  s0645: {
    literal:
      "Zhang Chang of Jiangxia raised rebellion; Jing and Chu followed like flowing water.",
    idiomatic: "Zhang Chang rose in Jiangxia; Jing-Chu rushed to join him.",
  },
  s0646: {
    literal: "Thereupon arms rose year after year—a clothing prodigy.",
    idiomatic: "War followed yearly—the dress omen fulfilled.",
  },
  s0647: {
    literal:
      "At first Wei made white kerchiefs, sewing the front crosswise to distinguish back from front; they called them 'face kerchiefs' and handed them down.",
    idiomatic:
      "Wei issued white caps with a cross seam front-to-back—the 'face kerchief.'",
  },
  s0648: {
    literal:
      "By Yongjia they gradually removed the seam—called 'no-face kerchiefs'; women's hair bun bindings grew ever looser; the knot could not stand on its own; hair draped over the forehead until only the eyes showed.",
    idiomatic:
      "Yongjia dropped the seam—'faceless' caps—and women's buns went slack, hair falling past brows.",
  },
  s0649: {
    literal: "'No face' is language of shame.",
    idiomatic: "'No face' spoke of shame.",
  },
  s0650: {
    literal: "'Covering the forehead' is the appearance of remorse.",
    idiomatic: "Hair masking the brow looked like hiding one's face in guilt.",
  },
  s0651: {
    literal:
      "That the looseness grew extreme speaks of all under heaven losing ritual and rightness, indulging nature to the utmost, reaching great shame.",
    idiomatic:
      "The ever-looser binding meant ritual collapsed and appetite ran to utter disgrace.",
  },
  s0652: {
    literal: "After Yongjia, the two emperors did not return; all under heaven was shamed.",
    idiomatic: "After Yongjia two emperors never came home—the realm hung its head.",
  },
  s0653: {
    literal:
      "Under Emperor Huai of Jin's Yongjia era, gentlemen competed to wear raw paper single robes.",
    idiomatic: "Yongjia scholars vied to wear stiff raw-paper robes.",
  },
  s0654: {
    literal:
      "Those who understood pointed and said: 'This is like the ancient cui straw mourning—what feudal lords wore for the Son of Heaven.'",
    idiomatic:
      "Critics pointed: that's cui mourning straw—what lords wear for the Son of Heaven.",
  },
  s0655: {
    literal: "Now to wear it without cause—perhaps there is a correspondence!",
    idiomatic: "With no bereavement? A bad sign.",
  },
  s0656: {
    literal:
      "' Thereafter came the turmoil of Hu bandits, and the emperor was murdered thereby.",
    idiomatic: "Then barbarian armies rose and killed the emperor.",
  },
  s0657: {
    literal: "In Emperor Yuan's Daxing era, soldiers bound their topknots with crimson pouches.",
    idiomatic: "Daxing troops tied topknots in red silk bags.",
  },
  s0658: {
    literal:
      "Those who understood said: 'The topknot is on the head—it is Qian, the way of the lord.'",
    idiomatic: "Critics: the bun crowns the head—Qian, the ruler.",
  },
  s0659: {
    literal: "'The pouch is Kun—the way of the minister.'",
    idiomatic: "The bag is Kun—the minister.",
  },
  s0660: {
    literal:
      "'Now to bind the topknot with a vermilion pouch—it is the image of the minister's way encroaching on the lord.'",
    idiomatic: "Red sack on the ruler's knot—ministers climbing past their lord.",
  },
  s0661: {
    literal: "' Thereupon Wang Dun lorded over his sovereign.",
    idiomatic: "Then Wang Dun bullied the throne.",
  },
  s0662: {
    literal:
      "Formerly feather-fan handles were carved in wood like bone pattern; they arrayed ten feathers—taking the complete number.",
    idiomatic: "Old feather fans used ten plumes—the full count.",
  },
  s0663: {
    literal:
      "From the first restoration, when Wang Dun campaigned south, they began to make long handles extending below for gripping, and reduced the feathers to eight.",
    idiomatic:
      "After the court fled south, Wang Dun's campaign brought long handles and cut feathers to eight.",
  },
  s0664: {
    literal:
      "Those who understood faulted it, saying: 'The feather fan—the name of wings.'",
    idiomatic: "Critics: feathers mean wings.",
  },
  s0665: {
    literal:
      "'To invent a long handle is to grasp the handle and control the wings.'",
    idiomatic: "A long shaft means seizing the haft to master the wings.",
  },
  s0666: {
    literal:
      "'To change ten to eight is to take from what is not yet ready what is already ready.'",
    idiomatic: "Ten cut to eight—strip the prepared of their surplus.",
  },
  s0667: {
    literal:
      "'This is likely Wang Dun's usurping authority to control the court's handle, and moreover intending with talent without virtue to steal a seat not his own.'",
    idiomatic:
      "It foretold Wang Dun grabbing the reins—unworthy talent eyeing the throne.",
  },
  s0668: {
    literal:
      "' At that time, those who made garments made the upper short; sashes reached only to the armpit; those who wore caps further bound the neck with the sash.",
    idiomatic:
      "Meanwhile jackets shrank, belts barely reached the armpit, hat strings choked the neck.",
  },
  s0669: {
    literal: "Below pressing above; above there is no ground.",
    idiomatic: "Below crowding above—the ruler had nowhere to stand.",
  },
  s0670: {
    literal:
      "Those who made trousers used straight panels for the mouth, without taper—an image of large below.",
    idiomatic: "Trousers went straight-cut and baggy below—the top-heavy omen.",
  },
  s0671: {
    literal: "Soon Wang Dun plotted rebellion and twice attacked the capital.",
    idiomatic: "Soon Wang Dun rebelled and struck the capital twice.",
  },
  s0672: {
    literal: "When Prince Hai of the West succeeded, he forgot to set out the leopard tail.",
    idiomatic: "When Emperor Hai ascended, he omitted the leopard-tail insignia.",
  },
  s0673: {
    literal:
      "Heaven's warning seemed to say: the leopard tail is master of ceremonial dress—by it great men 'leopard-transform.'",
    idiomatic:
      "Heaven warned: the leopard tail crowns ritual dress—the great man's transformation.",
  },
  s0674: {
    literal:
      "Yet on the day Prince Hai 'leopard-transformed,' what ought not be forgotten was forgotten.",
    idiomatic: "Yet on the day he should transform, he forgot the very emblem.",
  },
  s0675: {
    literal:
      "He is not one to master the altars; hence he forgot his leopard tail—it showed he would not last.",
    idiomatic: "No true steward of the realm—forgot the tail; doomed not to endure.",
  },
  s0676: {
    literal: "Soon he was deposed.",
    idiomatic: "He was deposed soon after.",
  },
  s0677: {
    literal:
      "Under Emperor Xiaowu's Taiyuan era, people no longer wore forehead kerchiefs.",
    idiomatic: "Taiyuan folk quit wearing forehead cloths.",
  },
  s0678: {
    literal:
      "Heaven's warning seemed to say: the head is the sovereign element; the kerchief assists the head as adornment.",
    idiomatic: "Heaven: the head is supreme; the kerchief aids it as ornament.",
  },
  s0679: {
    literal:
      "Now suddenly to discard it is like the lord standing alone without assistants, unto peril and ruin.",
    idiomatic: "To shed it was like a ruler bereft of ministers—hurtling toward ruin.",
  },
  s0680: {
    literal: "By Emperor An, Huan Xuan then usurped the throne.",
    idiomatic: "Come Emperor An, Huan Xuan seized the throne.",
  },
  s0681: {
    literal:
      "Formerly clogs had teeth reaching onto the upper—called 'exposed mao.'",
    idiomatic: "Old clogs had pegs showing above the vamp—'bright mao.'",
  },
  s0682: {
    literal:
      "In Taiyuan they suddenly did not penetrate through—called 'hidden mao.'",
    idiomatic:
      "Taiyuan suddenly hid the pegs—'dark mao.' (Graph 名日 for 名曰.)",
  },
  s0683: {
    literal:
      "Those who understood thought mao means 'plot'—there must be matters of secret plotting.",
    idiomatic: "Critics: mao puns with 'plot'—conspiracy ahead.",
  },
  s0684: {
    literal:
      "By the end of Emperor Liezong, Cavalry Adjutant Yuan Yuezhi first wove intrigue inside and outside; in Long'an he then plotted fraud and mutual toppling, bringing great turmoil.",
    idiomatic:
      "Late Liezong, Yuan Yuezhi spun palace intrigue; Long'an brought coups and chaos.",
  },
  s0685: {
    literal:
      "In Taiyuan, princesses and women invariably loosened their sideburn locks and tilted their chignons, deeming it grand adornment.",
    idiomatic:
      "Taiyuan noblewomen wore loose side hair and slanted buns as high fashion.",
  },
  s0686: {
    literal:
      "Because supplementary hairpieces were many and could not always be worn, they first mounted them on wood and cages—called false chignon, or false head.",
    idiomatic:
      "Heavy hairpieces could not be worn daily—they mounted them on frames first, 'wig-head.'",
  },
  s0687: {
    literal:
      "As for poor households that could not supply them, they called themselves 'without heads' and borrowed heads from others.",
    idiomatic: "Poor families called themselves 'headless' and borrowed wigs.",
  },
  s0688: {
    literal: "It spread through all under heaven—again a clothing prodigy.",
    idiomatic: "The fad spread—a dress omen again.",
  },
  s0689: {
    literal:
      "Before long, Emperor Xiaowu died in his carriage and all under heaven was in turmoil; executions were countless, many losing their heads.",
    idiomatic:
      "Soon Emperor Xiaowu died; the realm erupted in executions and decapitations.",
  },
  s0690: {
    literal:
      "When it came to laying out for burial, all carved wood and wax or bound rush grass for heads—this was the correspondence of the false head, it is said.",
    idiomatic:
      "Come burial, families carved wood, wax, or rush heads—the false-head omen fulfilled.",
  },
  s0691: {
    literal:
      "When Huan Xuan usurped, he hung crimson curtains in the hall, chased gold for borders; golden dragons at the four corners held five-colored feather plumes and tassels.",
    idiomatic:
      "Huan Xuan's usurpation brought scarlet hall drapes, gold fretwork, dragons at corners trailing colored plumes.",
  },
  s0692: {
    literal:
      "The assembled ministers said to one another: 'Rather like a bier hearse.'",
    idiomatic: "Courtiers whispered: looks like a funeral hearse.",
  },
  s0693: {
    literal: "' Soon Huan Xuan was defeated—this was prodigy in dress.",
    idiomatic: "Huan fell soon after—a costume prodigy.",
  },
  s0694: {
    literal:
      "At Jin's end all wore small caps but vast robes and skirts; they copied one another in elegance until even grooms and runners made it custom.",
    idiomatic:
      "Late Jin: tiny caps, billowing robes—fashion aped even by servants.",
  },
  s0695: {
    literal:
      "Those who understood said: 'Small above and large below—this is the image of abdication and replacement.'",
    idiomatic: "Critics: small top, big bottom—the abdication sign.",
  },
  s0696: {
    literal: "' Soon Song received the abdication and ended [Jin].'",
    idiomatic: "Song took the mandate soon after.",
  },
  s0697: {
    literal: "=",
    idiomatic:
      "— (editorial break before the subsection on fowl prodigies.)",
  },
  s0698: {
    literal: "Chicken calamities.",
    idiomatic: "Chicken Omens",
  },
  s0699: {
    literal:
      "= Wei Mingdi—in the Minister of Justice compound a hen turned into a cock; it did not crow and did not lead.",
    idiomatic:
      "Wei Mingdi: in the Court of Justice yard a hen became a rooster—it did not crow and did not lead the flock.",
  },
  s0700: {
    literal:
      "Gan Bao said: 'That year Emperor Xuan pacified Liaodong; the hundred surnames first had the sense of yielding to the capable—this was its image",
    idiomatic:
      "Gan Bao: that year the court pacified Liaodong and the people learned to yield to the worthy—that matched one half of the sign;",
  },
  s0701: {
    literal:
      "yet the three later Jin empresses all ended as subjects—neither crowing nor leading—again Heaven's intent.'",
    idiomatic:
      "yet three Jin empresses all ended as mere subjects—still silent, still not leading: Heaven's intent again.",
  },
};

// Validate keys and tmp_batch7 alignment
const ids = [];
for (let n = 602; n <= 701; n++) ids.push(`s0${n}`);
for (const id of ids) {
  if (!B7[id]) throw new Error(`Missing B7[${id}]`);
  if (tmpMap[id] === undefined) throw new Error(`Missing tmp line ${id}`);
  const ch = tmpMap[id];
  if (EQ(ch) && !EQ(B7[id].literal)) {
    throw new Error(`Expected chinese "=" for ${id} to pair with literal "="`);
  }
}

const path = "translations/current_translation_jinshu.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

for (const row of data.sentences) {
  const u = B7[row.id];
  if (u) {
    row.literal = u.literal;
    row.idiomatic = u.idiomatic;
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log("OK");
