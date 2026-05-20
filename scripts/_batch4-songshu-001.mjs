import fs from 'node:fs';

const transPath = 'translations/current_translation_songshu.json';
const dataPath = 'data/songshu/001.json';

function loadSentencesFromData() {
  const book = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const out = new Map();
  for (const block of book.content) {
    for (const s of block.sentences || []) {
      out.set(s.id, { chinese: s.zh, blockIndex: block.blockIndex ?? null });
    }
  }
  return out;
}

let data;
if (fs.existsSync(transPath)) {
  data = JSON.parse(fs.readFileSync(transPath, 'utf8'));
} else {
  data = {
    metadata: { book: 'songshu', chapter: '001', file: dataPath },
    sentences: [],
  };
}

const source = loadSentencesFromData();
const byId = new Map(data.sentences.map((s) => [s.id, s]));

for (let n = 301; n <= 400; n++) {
  const id = `s${String(n).padStart(4, '0')}`;
  const src = source.get(id);
  if (!src) continue;
  if (!byId.has(id)) {
    const entry = {
      id,
      originalId: id,
      blockIndex: src.blockIndex,
      chinese: src.chinese,
      literal: '',
      idiomatic: '',
    };
    data.sentences.push(entry);
    byId.set(id, entry);
  } else if (!byId.get(id).chinese) {
    byId.get(id).chinese = src.chinese;
  }
}

data.sentences.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

const T = {
  s0301: ['Gaozu, fearful and alarmed, went to the palace gate to state his plea; the Son of Heaven could not override him.', 'Gaozu went to court in apparent alarm to plead his case, and the emperor could not refuse him.'],
  s0302: ['That month he returned to garrison Dantu.', 'That month he returned to garrison Dantu.'],
  s0303: ['The Son of Heaven again sent a grand envoy to press him earnestly; again he did not accept.', 'The emperor sent a high envoy to urge him again; again he refused.'],
  s0304: ['Thereupon he was reassigned as Commander-in-Chief of the Military Affairs of the Seven Provinces of Jing, Si, Liang, Yi, Ning, Yong, and Liang, together with the previous sixteen provinces, his original offices remaining as before.', 'He was then given command of seven more provinces in addition to his existing sixteen, with his other titles unchanged.'],
  s0305: ['Thereupon upon accepting the appointment he relinquished Qing Province and was additionally made Inspector of Yan Province.', 'On accepting, he gave up Qing Province and took Yan Province as well.'],
  s0306: ['Lu Xun crossed the sea, captured Guangzhou, and took Inspector Wu Yinzhi prisoner.', 'Lu Xun sailed from the sea, seized Guangzhou, and captured Inspector Wu Yinzhi.'],
  s0307: ['He thereupon made Xun Inspector of Guang Province and his fellow partisan Xu Daofu Administrator of Shixing.', 'Xun was made Inspector of Guang Province and his ally Xu Daofu was made Administrator of Shixing.'],
  s0308: ['In the third month of the second year, he was made Supervisor of Jiao and Guang Provinces.', 'In the third month of year two he was made Supervisor of Jiao and Guang Provinces.'],
  s0309: ['In the tenth month Gaozu submitted a memorial saying: "Formerly Heaven afflicted the imperial house; the great villain indulged usurpation. We, your ministers, by righteousness were old retainers and beforehand received the state\'s grace; looking up we matched the sign of faith and obedience, looking down we sharpened the indignation of subjects—though the altars of state had their spirits, yet the affair also succeeded through the multitude\'s aid.', 'In the tenth month Gaozu memorialized: "When Heaven struck the throne and the great usurper ran wild, we old servants of Jin rose in righteous anger. Though the altars had their spirits, victory came only through many hands.'],
  s0310: ['In rewarding and encouraging loyal and diligent assistants and civil and military men who exerted all strength, I repeatedly held to personal modesty and thereby diminished the great body of the state.', 'Yet in rewarding the loyal I kept too much modesty for myself and slighted the dignity of the state.'],
  s0311: ['I have therefore reported first on behalf of the assembled armies, [19] those who together plotted the uprising: first pacifying the two cities of Jingkou and Guangling—myself and General Who Pacifies the Army Yi and two hundred seventy-two others—and those who afterward joined the righteous cause leaving the capital and fighting along the route, the remaining one thousand five hundred sixty-six; also General Who Assists the State Changmin and the late Palace Attendant Wang Yuande and ten others—in all one thousand eight hundred forty-eight—requesting proper enfeoffment and reward.', 'I therefore submit first, [19] on behalf of the armies that plotted the uprising: the two hundred seventy-two of us who first took Jingkou and Guangling, the one thousand five hundred sixty-six who fought along the road, and ten others including Changmin and the late Wang Yuande—one thousand eight hundred forty-eight in all—seeking proper rewards."'],
  s0312: ['The western campaign armies must be discussed and reported in a follow-up memorial.', 'The western campaign forces will be listed in a later memorial.'],
  s0313: ['" Thereupon the Masters of Writing memorialized enfeoffing the chief plotter of the righteous uprising, General Who Guards the Army Yu, as Duke of Yuzhang with ten thousand households and a fief, granting thirty thousand bolts of silk.', 'The Masters of Writing then enfeoffed Gaozu, chief of the righteous plot, as Duke of Yuzhang with ten thousand households and thirty thousand bolts of silk.'],
  s0314: ['The rest received enfeoffments and rewards each according to rank.', 'The rest were rewarded according to rank.'],
  s0315: ['Staff officers of the General Who Guards the Army\'s headquarters were reduced one grade from those of the late Grand Tutor Xie An\'s headquarters.', 'Staff at Gaozu\'s headquarters were ranked one grade below those of the late Grand Tutor Xie An.'],
  s0316: ['In the eleventh month the Son of Heaven again reiterated the previous order, adding Gaozu as Palace Attendant and advancing his title to General of Chariots and Cavalry with the Honorific Equal to the Three Excellencies.', 'In the eleventh month the emperor again offered him Palace Attendant, General of Chariots and Cavalry, and honors equal to the Three Excellencies.'],
  s0317: ['He firmly declined.', 'He refused.'],
  s0318: ['An edict sent the hundred officials to press him earnestly.', 'The emperor ordered the officials to urge him again.'],
  s0319: ['In the second month of the third year Gaozu returned to the capital and was about to go to the Court of Justice; the Son of Heaven first edicted that prison officials were not to receive him; he went to the palace gate to state his refusal and was then permitted to leave.', 'In the second month of year three Gaozu returned to the capital, tried to surrender himself to the Court of Justice, was turned away by imperial order, pleaded at the gate, and was allowed to go.'],
  s0320: ['He then returned to Dantu.', 'He then returned to Dantu.'],
  s0321: ['In the intercalary month headquarters officer Luo Bing plotted rebellion; about to be seized, he fled alone on horseback; they pursued and beheaded him.', 'In the intercalary month staff officer Luo Bing plotted revolt; caught and fleeing alone on horseback, he was run down and killed.'],
  s0322: ['Bing\'s father, Administrator of Yongjia Qiu, was executed.', 'Bing\'s father Qiu, Administrator of Yongjia, was executed.'],
  s0323: ['Qiu had originally been a clerk of Dongyang Commandery; in Sun En\'s rebellion he had risen in righteousness at Changshan and therefore was promoted and employed.', 'Qiu had been a Dongyang clerk who rose against Sun En at Changshan and was promoted for it.'],
  s0324: ['Initially when Huan Xuan was defeated, because Huan Chong had been loyal and steadfast, he appointed Chong\'s grandson Yin.', 'After Huan Xuan\'s first defeat he had appointed Chong\'s grandson Yin for the Huan clan\'s loyalty.'],
  s0325: ['At this time Bing\'s plot was to make Yin the leader, secretly linking with Administrator of Dongyang Yin Zhongwen.', 'Bing now plotted to make Yin their figurehead and secretly linked with Dongyang Administrator Yin Zhongwen.'],
  s0326: ['Thereupon Zhongwen and Zhongwen\'s two younger brothers were executed.', 'Zhongwen and his two brothers were executed.'],
  s0327: ['All remaining partisans of Huan Xuan were at this time exterminated.', 'Every remaining Huan Xuan partisan was now wiped out.'],
  s0328: ['The Son of Heaven sent Acting Minister of Ceremonies Ge Ji to confer upon the Duke a patent saying: "Youhu flooded heaven; Yi of Xia seized the opportunity; disorderly conduct violated the seasons and in truth overturned the imperial pinnacle.', 'The emperor sent Acting Minister of Ceremonies Ge Ji with a patent of investiture: "Rebellion flooded heaven as Yi of Xia once did; the usurper overturned the throne itself.'],
  s0329: ['The villainous minister Huan Xuan, relying on favor and indulging rebellion, then overthrew Hua and Huo, uprooted Song and Dai; the five peaks were already leveled, the six lands changed their place.', 'The traitor Huan Xuan, drunk on favor, toppled pillars like Hua and Huo and uprooted mountains like Song and Dai.'],
  s0330: ['The Duke, commanding the age by heroic talent, stored capacity awaiting the time; by the heart he drew on reverence, swore to wipe away the state\'s shame, indignant at decline, sincerity issued from sleepless nights.', 'You, hero of the age, waited your moment, swore to wipe away national shame, and burned with sleepless loyalty.'],
  s0331: ['Then years repeatedly passed; the sacred vessel was already distant; loyalty and filial piety were lodged in obscurity—in truth penetrating the three numina.', 'Years passed and the throne seemed lost, yet your loyalty reached heaven, earth, and the spirits.'],
  s0332: ['Thereupon like a steadfast stone at the winning moment, you declared the covenant and completed the undertaking, appealed to azure Heaven as the standard, and swept the righteous host in one drive.', 'Then, firm as stone at the decisive hour, you raised the righteous host under Heaven\'s judgment and swept forward as one.'],
  s0333: ['Rushing spears numbered in the hundreds; momentum was fierce as lightning; a million could not resist the limit; controlling the road, day by day they planted cities.', 'Hundreds of spears charged like lightning; no army could stand before you; city after city fell to your march.'],
  s0334: ['[20] Thus he made rushing whales break their flow, exposed scales on the Jiang and Han; victory from afar was added, heavy miasma was again washed away; the two principles were cleared, the three luminaries reflected again; the affair will endure for generations, merit towers over the founding age—principle subtle, title fitting; righteousness moved Our heart.', '[20] Whales broke in the rivers, the Jiang and Han were cleared, heaven and earth brightened, and the three luminaries shone again—merit beyond founding, righteousness that moved our heart.'],
  s0335: ['If the Way for the person is still to be rewarded with rank, how much more when sincerity and virtue are both deep and merit crowns heaven and man.', 'If even personal service earns rank, how much more merit that crowns heaven and earth?'],
  s0336: ['Therefore We establish this state, forever endow these mountains and rivers; speaking of it fills the heart—it is not enough for repayment.', 'We therefore establish this domain and endow these mountains and rivers, knowing no reward can suffice.'],
  s0337: ['Go—revere it!', 'Go, and revere it!'],
  s0338: ['Make yourself a screen for Us alone, long aid august Jin; flowing wind and enduring fortune, brilliant splendor without end.', 'Be our shield, long support great Jin, and let your glory endure without end.'],
  s0339: ['Descend and receive this fine patent; respond and proclaim Our command."', 'Receive this patent and proclaim our command."'],
  s0340: ['In the twelfth month Regent, Recorder of the Masters of Writing, and Inspector of Yang Province Wang Mi died.', 'In the twelfth month Regent Wang Mi died.'],
  s0341: ['In the first month of the fourth year the Duke was summoned to assist at court and was appointed Palace Attendant, General of Chariots and Cavalry, Honorific Equal to the Three Excellencies, Inspector of Yang Province, and Recorder of the Masters of Writing; Inspector of Xu and Yan Provinces remained as before.', 'In the first month of year four he was summoned to court as Palace Attendant, General of Chariots and Cavalry, Inspector of Yang Province, and Recorder of the Masters of Writing, retaining Xu and Yan.'],
  s0342: ['He memorialized to relinquish Yan Province.', 'He asked to give up Yan Province.'],
  s0343: ['Earlier Champion-General Liu Jingxuan had been sent to campaign against the Shu bandit Qiao Zong and returned without achievement.', 'Earlier Liu Jingxuan had been sent against the Shu rebel Qiao Zong and returned empty-handed.'],
  s0344: ['In the ninth month, because Jingxuan had been defeated and retreated, he yielded his position; it was not permitted.', 'In the ninth month Jingxuan offered to step down after his defeat; the offer was refused.'],
  s0345: ['He was then reduced to General of the Central Army, his headquarters honorific remaining as before.', 'He was demoted to General of the Central Army while keeping his headquarters honors.'],
  s0346: ['Initially the false Yan King, the Xianbei Murong De, had usurped title in Qing Province; when De died, his elder brother\'s son Chao succeeded him; before and after he repeatedly became a border affliction.', 'The Xianbei pretender Murong De had seized Qing Province; after his death his nephew Chao succeeded him and raided the borders repeatedly.'],
  s0347: ['In the second month of the fifth year he greatly plundered north of the Huai, seized Administrator of Yangping Liu Qianzai and Administrator of Jinan Zhao Yuan, and drove off more than a thousand households.', 'In the second month of year five Chao ravaged north of the Huai, seized two administrators, and carried off more than a thousand households.'],
  s0348: ['In the third month the Duke submitted a memorial resisting and campaigning north; he made Administrator of Danyang Meng Chang supervise the central army and remain to manage headquarters affairs.', 'In the third month Gaozu memorialized for a northern campaign and left Meng Chang to supervise headquarters.'],
  s0349: ['In the fourth month the fleet departed the capital, went upstream on the Huai into the Si.', 'In the fourth month the fleet left the capital and sailed up the Huai into the Si.'],
  s0350: ['In the fifth month they reached Xiapi, left ships and baggage, and the infantry advanced to Langya.', 'In the fifth month they reached Xiapi, left the ships and supplies, and marched into Langya.'],
  s0351: ['Wherever they passed they built fortresses and left garrisons.', 'Every place they passed they fortified and garrisoned.'],
  s0352: ['The Xianbei garrisons of Liangfu and Jucheng both fled.', 'The Xianbei garrisons at Liangfu and Jucheng both fled.'],
  s0353: ['When Murong Chao heard the royal army was about to arrive, his great general Gongsun Wulou advised Chao: "You should hold and block the Great Pass, cut the grain seedlings, and empty the countryside to await them.', 'Hearing the imperial army was coming, Chao\'s general Gongsun Wulou advised: "Hold the Great Pass, cut the grain, and strip the countryside to wait them out.'],
  s0354: ['Their expeditionary army has no supplies; unable to obtain battle, within ten days and a month you can break them with a whip.', 'Without supplies they cannot fight; in a month you can beat them with a whip."'],
  s0355: ['" Chao did not follow, saying: "They come from afar weary; their momentum cannot last long—only lead them to pass the pass; I with iron cavalry will tread them down; no worry of not breaking them.', 'Chao refused: "They are tired from afar and cannot last. Let them through the pass and my iron cavalry will crush them.'],
  s0356: ['How could one beforehand cut grain seedlings and first weaken oneself?', 'Why cut our own grain and weaken ourselves first?"'],
  s0357: ['" Initially when the Duke was about to march, those who discussed the matter thought the bandits, hearing the great army had gone far out, would surely not dare fight; if they did not block the Great Pass, they would surely hold Guanggu firmly, cut grain and empty the countryside to cut off the three armies\' supplies—not only would it be hard to achieve merit, they would also be unable to return.', 'Before the march, critics warned that if the Xianbei did not fight at the pass they would hold Guanggu, strip the land, and starve the army—not only failing to win but risking no return.'],
  s0358: ['The Duke said: "I have calculated it thoroughly.', 'Gaozu said: "I have weighed this carefully.'],
  s0359: ['The Xianbei are greedy, [21] unable to plan far; advancing they covet gain, retreating they cherish grain seedlings.', 'The Xianbei are greedy, [21] short-sighted; advancing they want loot, retreating they cling to their grain.'],
  s0360: ['They think my lone army has entered far and cannot endure long—nothing more than advancing to occupy Linqu and retreating to hold Guanggu.', 'They will think our lone army cannot endure and will only advance to Linqu or fall back to Guanggu.'],
  s0361: ['Once I enter the pass, then men will have no heart to retreat; driving troops resolved to die against bandits with divided hearts—what worry of not conquering?', 'Once we are through the pass, my men will not retreat; driving desperate soldiers against wavering foes, how can we fail?'],
  s0362: ['They cannot empty the countryside and hold firm—I guarantee that for you all.', 'They will not strip the land and stand firm—I guarantee it."'],
  s0363: ['" After the Duke had entered the pass, he raised his hand and pointed to heaven, saying: "My affair is accomplished!"', 'Passing through the Great Pass, Gaozu pointed to heaven and cried: "It is done!"'],
  s0364: ['In the sixth month Murong Chao sent Wulou and Prince of Guangning Helailu to first occupy Linqu city.', 'In the sixth month Chao sent Wulou and Prince of Guangning Helailu to hold Linqu.'],
  s0365: ['Having heard the great army had arrived, he left the weak and old to hold Guanggu and then came out with his full force.', 'Hearing the main army had arrived, he left the weak to hold Guanggu and came out in full strength.'],
  s0366: ['At Linqu there was the Jumie River, forty li from the city.', 'Linqu had the Jumie River forty li from the city.'],
  s0367: ['Chao told Wulou: "Hurry and go hold it; if the Jin army gets water, then it will be hard to strike them.', 'Chao told Wulou: "Seize the river at once; if Jin gets water, they will be hard to attack."'],
  s0368: ['" Wulou galloped forward.', 'Wulou raced ahead.'],
  s0369: ['General of the Dragon Cavalry Meng Longfu led cavalry in the van, galloping to contend for it; Wulou then retreated.', 'Meng Longfu\'s cavalry charged for the river and Wulou fell back.'],
  s0370: ['The mass army advanced on foot; there were four thousand carts; they divided the carts into two wings, marching in square file at a steady pace; all carts were draped with curtains; drivers held spears.', 'The infantry advanced with four thousand carts in two wings, curtains drawn, drivers armed with spears.'],
  s0371: ['They also used light cavalry as roaming troops.', 'Light cavalry screened the march.'],
  s0372: ['Military orders were strict; ranks and files were orderly.', 'Discipline was iron; the columns were perfect.'],
  s0373: ['Not yet several li from Linqu, more than ten thousand of the bandits\' iron cavalry arrived before and behind in succession.', 'Still miles from Linqu, more than ten thousand Xianbei horsemen struck front and rear.'],
  s0374: ['The Duke ordered Inspector of Yan Province Liu Fan, his younger brother Inspector of Bing Province Liu Daolian, Adviser Liu Jingxuan, Tao Yanshou, Staff Officer Liu Huaiyu, Shen Zhongdao, Suo Miao, and others to strike them together with combined strength.', 'Gaozu sent Liu Fan, Liu Daolian, Liu Jingxuan, Tao Yanshou, Liu Huaiyu, Shen Zhongdao, Suo Miao, and others to meet them together.'],
  s0375: ['As the sun approached the west, the Duke sent Adviser Tan Shao to charge straight for Linqu.', 'Near sunset he sent Tan Shao straight at Linqu.'],
  s0376: ['The edict led General Who Establishes Might Xiang Mi and Staff Officer Hu Fan to gallop there; that same day they stormed the city, cut down its command pennant, and captured all of Chao\'s baggage.', 'Xiang Mi and Hu Fan galloped up, took the city that day, cut down its pennant, and seized Chao\'s baggage train.'],
  s0377: ['Chao, hearing Linqu had fallen, led his masses in flight; the Duke personally beat the drums; the bandits then fled in great rout.', 'Hearing Linqu had fallen, Chao turned to flee; Gaozu beat the drums himself and the enemy broke.'],
  s0378: ['Chao escaped back to Guanggu.', 'Chao fled back to Guanggu.'],
  s0379: ['They captured Chao\'s horses, false imperial carriage, jade seal, leopard-tail insignia, and the like, and sent them to the capital.', 'They captured Chao\'s horses, false regalia, jade seal, and leopard-tail banners and sent them to the capital.'],
  s0380: ['They beheaded his great general Duan Hui and more than ten others; the rest killed and captured numbered in the thousands.', 'They killed General Duan Hui and more than ten others; thousands more were slain or taken.'],
  s0381: ['The next day the great army advanced on Guanggu, immediately slaughtered the outer city, and Chao retreated to hold the inner city.', 'The next day they reached Guanggu, stormed the outer city, and Chao withdrew into the inner citadel.'],
  s0382: ['Thereupon they set a long encirclement to besiege it; the encirclement was three zhang high; outside they dug three layers of moat.', 'They laid a long siege with a three-zhang wall and three rings of moats.'],
  s0383: ['They halted transport from the Jiang and Huai and stored grain in Qi territory.', 'They cut river supply lines and stored grain locally in Qi.'],
  s0384: ['They comforted and accepted those who surrendered; Chinese and barbarians rejoiced; selecting talent they granted ranks and thereby employed them.', 'They welcomed surrendering Chinese and barbarians alike, enlisting talent as they came.'],
  s0385: ['In the seventh month an edict added the Duke as Inspector of Northern Qing and Ji Provinces.', 'In the seventh month he was additionally made Inspector of Northern Qing and Ji Provinces.'],
  s0386: ['Chao\'s great generals Yuan Zun and Zun\'s younger brother Miao both led their masses to submit.', 'Chao\'s generals Yuan Zun and his brother Miao surrendered with their troops.'],
  s0387: ['The Duke was just preparing siege engines when the men on the wall said: "You cannot get Zhang Gang—what can you do?', 'As Gaozu built siege engines, defenders on the wall taunted: "Without Zhang Gang you can do nothing."'],
  s0388: ['" Gang was Chao\'s false Masters of Writing Gentleman; this man had ingenious thought.', '"Gang" was Chao\'s engineering officer, a man of clever invention.'],
  s0389: ['It happened that Chao sent Gang to declare himself a vassal to Yao Xing and beg troops for rescue.', 'Chao had sent Gang to Yao Xing to beg for aid.'],
  s0390: ['Xing falsely promised, yet in truth feared the Duke and did not dare send troops.', 'Yao Xing promised falsely but feared Gaozu and sent no troops.'],
  s0391: ['Gang returned from Chang\'an; Administrator of Taishan Shen Xuan seized and sent him under escort.', 'Returning from Chang\'an, Gang was seized by Taishan Administrator Shen Xuan.'],
  s0392: ['When Gang was raised on the tower cart, [22] to show those inside the city, everyone inside lost color.', 'Gang was raised on a siege tower, [22] shown to the city, and the defenders went pale.'],
  s0393: ['Thereupon they had Gang greatly prepare siege engines.', 'Gaozu then put Gang to work building siege engines.'],
  s0394: ['Chao\'s plea for rescue was not obtained; Gang in turn was captured; he turned to worry and fear.', 'Rescue never came; Gang was captured instead; Chao grew desperate.'],
  s0395: ['He then requested to declare himself a vassal, asking to cede the Great Pass as a boundary and present a thousand horses.', 'Chao offered submission, the Great Pass as border, and a thousand horses.'],
  s0396: ['They did not listen; the siege grew tighter.', 'Gaozu refused; the siege tightened.'],
  s0397: ['Residents north of the Yellow River carrying spears and grain who arrived numbered more than a thousand each day.', 'More than a thousand northerners a day arrived bearing arms and grain.'],
  s0398: ['Recorder of Affairs Liu Muzhi had talent for strategy and administration; the Duke made him chief planner; in movement and rest he always consulted him.', 'Liu Muzhi, Gaozu\'s chief strategist, was consulted on every move.'],
  s0399: ['At that time Yao Xing sent an envoy to tell the Duke: "Murong Chao and I are neighboring friends; again he has in extremity begged for help; now I shall send one hundred thousand iron cavalry to take Luoyang directly.', 'Yao Xing sent word: "Chao is my neighbor and begged for help; I will send one hundred thousand horsemen straight to Luoyang.'],
  s0400: ['If the Jin army does not withdraw, then I shall send iron cavalry in a long drive forward.', 'If your army does not withdraw, those horsemen will drive straight onward."'],
};

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
  }
}

fs.writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log('Updated', Object.keys(T).length, 'sentences (s0301–s0400)');
