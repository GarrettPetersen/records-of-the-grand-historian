#!/usr/bin/env node
/** Apply s0401–s0500 translations for mingshi ch.230 */
import fs from 'node:fs';

const FILE = 'translations/current_translation_mingshi.json';

const T = {
  s0401: [
    'Censor Song Tao memorialized to save him, again slandered Yiguan, and attacked Tingji.',
    'The censor Song Tao pleaded for Jiang\'s pardon but renewed his attacks on Shen Yiguan and aimed barbs at Li Tingji.',
  ],
  s0402: [
    'The emperor grew angrier still, banished Tao to Pingding judge, again banished Shichang to Xing\'an clerk.',
    'The emperor\'s wrath deepened: Tao was demoted to judge at Pingding, and Shichang was demoted again to clerk at Xing\'an.',
  ],
  s0403: [
    'Shichang loved learning, exhorted name and restraint.',
    'Shichang was studious and strict in guarding his reputation.',
  ],
  s0404: [
    'In residence constantly resenting the age, hating custom, wishing with body to pull it back.',
    'He lived in constant indignation at the times and the mores, and wished to set them right by his own effort.',
  ],
  s0405: [
    'Therefore although occupying scattered office, several times had proposals and constructions, in the end clashed teeth to finish.',
    'Though he held only minor posts, he submitted advice again and again, yet ended his career in repeated conflict.',
  ],
  s0406: [
    'The year after Shichang\'s banishment, Ministry of Rites Director Zheng Zhenxian impeached Geng and others with twelve great crimes; also carved three ranks, transferred to border region for use.',
    'The year after Shichang\'s demotion, Zheng Zhenxian of the Ministry of Rites impeached Zhu Geng and others on twelve grave charges; he too was demoted three ranks and assigned to the frontier.',
  ],
  s0407: ['Song Tao, Tai\'an man.', 'Song Tao was a native of Tai\'an.'],
  s0408: [
    'Wanli twenty-ninth year advanced scholar.',
    'He passed the metropolitan examination in the twenty-ninth year of Wanli.',
  ],
  s0409: [
    'From Hanlin academician received censor, bore spirit loved striking blows.',
    'After service as a Hanlin academician he was made a censor; he was headstrong and loved to strike at opponents.',
  ],
  s0410: [
    'Went out inspecting Yingtian prefectures, memorial expelled chief minister Zhu Geng.',
    'On circuit in the Yingtian prefectures he memorialized against the chief minister Zhu Geng.',
  ],
  s0411: [
    'Court ministers successively had requests, all blamed assisting ministers; its beginning from Tao issued.',
    'Court officials followed with further petitions, all blaming the chief ministers—a movement Tao had begun.',
  ],
  s0412: [
    'When he sat in banishment, soon requested leave and returned.',
    'After his demotion he soon took leave and went home.',
  ],
  s0413: ['Died at home.', 'He died at home.'],
  s0414: [
    'At Tianqi beginning, posthumously granted Shichang Grand Master of the Court, Tao Vice Minister of Imperial Household.',
    'At the start of the Tianqi reign Shichang was posthumously made Grand Master of the Court and Tao Vice Minister of the Imperial Household.',
  ],
  s0415: [
    'Ma Mengzhen, style Taifu, Tongcheng man.',
    'Ma Mengzhen, courtesy name Taifu, was a native of Tongcheng.',
  ],
  s0416: [
    'Wanli twenty-sixth year advanced scholar.',
    'He passed the metropolitan examination in the twenty-sixth year of Wanli.',
  ],
  s0417: ['Received Fenyi magistrate.', 'He was appointed magistrate of Fenyi.'],
  s0418: [
    'About to be summoned within, because tax collection did not reach four-tenths, by Ministry of Revenue Minister Zhao Shiqing impeached, edict carved two ranks.',
    'When he was about to be recalled to the capital, Zhao Shiqing, Minister of Revenue, impeached him because tax collection had not reached forty percent, and by edict he was demoted two ranks.',
  ],
  s0419: [
    'Just three days, yet people\'s arrears all completed.',
    'Within three days the people paid every arrear in full.',
  ],
  s0420: [
    'Zou Yuanbiao, Wan Guoqin and company urgently praised him.',
    'Zou Yuanbiao, Wan Guoqin, and others praised him at once.',
  ],
  s0421: ['Continued appointment censor.', 'He was soon made a censor.'],
  s0422: [
    'Documents Selection Director Wang Yongguang, Ritual Regulations Director Zhang Sicheng, Chief Supervising Secretaries Yao Wenwei, Chen Zeze, because of attaching to government raised to capital ministers, Nanjing Right Censor-in-Chief Shen Zimu age nearly eighty not resigned office—Mengzhen together memorialized on them.',
    'Mengzhen jointly memorialized against Wang Yongguang and Zhang Sicheng of the Ministry of Rites, chief supervising secretaries Yao Wenwei and Chen Zeze—promoted to capital posts for siding with the government—and Shen Zimu of Nanjing, who at nearly eighty still would not retire.',
  ],
  s0423: [
    'Grand Secretary Li Tingji was impeached, memorial defended, saying from entering office until now, at first no great error.',
    'When Li Tingji was impeached he defended himself, claiming that since taking office he had committed no grave fault.',
  ],
  s0424: [
    'Mengzhen refuted saying: "Tingji in Ministry of Rites was intimate with evil and recklessly with Director Peng Zungu, yet Nie Yunhan spoke words opposing the times, then suppressed to death.',
    'Mengzhen rebutted: "While at the Ministry of Rites Tingji favored the corrupt director Peng Zungu, yet when Nie Yunhan spoke against the times Tingji hounded him to his death.',
  ],
  s0425: [
    'Holding government not long, Jiang Shichang, Song Tao, Zheng Zhenxian all received offense.',
    'Shortly after he took power, Jiang Shichang, Song Tao, and Zheng Zhenxian were all punished.',
  ],
  s0426: [
    'Yao Wenwei and others were lavished appointment to capital halls; Chen Yongbin and others repeatedly drafted lenient edicts.',
    'Men such as Yao Wenwei were improperly given capital posts, while Chen Yongbin and others repeatedly drafted lenient edicts.',
  ],
  s0427: [
    'Still not call it error?',
    'Can this still be called no grave error?"',
  ],
  s0428: [
    '" Wang Xijue declined summons, secret memorial bitterly slandered speakers.',
    '" Wang Xijue declined recall and in a secret memorial bitterly denounced the critics.',
  ],
  s0429: [
    'Mengzhen and Nanjing supervising secretary Duan Ran together ascended memorials arguing to the limit.',
    'Mengzhen and Duan Ran, supervising secretary at Nanjing, submitted forceful counter-memorials.',
  ],
  s0430: [
    'Soon presented merchant-levy harms, exposed Ministry of Works Directors Chen Minzhi, Fan Bang for venal goods crimes.',
    'He soon exposed the harm of merchant levies and impeached Chen Minzhi and Fan Bang of the Ministry of Works for corruption.',
  ],
  s0431: [
    'Again presented five matters: penetrating obstruction, recording upright ministers, deciding employment and dismissal, pitying people\'s poverty, urgent border provisions.',
    'He also urged five reforms: ending obstruction, recalling upright ministers, deciding appointments, relieving the people\'s distress, and securing frontier pay.',
  ],
  s0432: [
    'Requested summon and employ Zou Yuanbiao, Zhao Nanxing, Wang Dewan, release Tingji to return to fields and hamlets.',
    'He asked that Zou Yuanbiao, Zhao Nanxing, and Wang Dewan be recalled, and that Tingji be sent home to his fields.',
  ],
  s0433: ['All not answered.', 'None of these received a response.'],
  s0434: [
    'Thirty-ninth year summer, Yi Spirit Hall disaster.',
    'In the summer of the thirty-ninth year the Yi Spirit Hall burned.',
  ],
  s0435: [
    'Mengzhen said: "Twenty years now, suburban temples, court lectures, summoned audiences, face-to-face discussion all abolished; what penetrates lower feelings is only memorials.',
    'Mengzhen wrote: "For twenty years suburban rites, court lectures, imperial audiences, and face-to-face deliberation have all lapsed; only memorials still carry grievances upward.',
  ],
  s0436: [
    'Yet memorials entering and edicts issuing all by inner attendants; whether they thoroughly reach imperial perusal and truly issue from sage intent cannot be known—this court government is cause for concern.',
    'Yet memorials go in and edicts come out entirely through eunuchs, so whether they reach the emperor\'s eyes or truly express his will cannot be known—this is alarming for statecraft.',
  ],
  s0437: [
    'Ministers split into streams and separate households, entering master exiting slave, love-hate from heart, orpiment yellow believed mouth, wandering words flying tales, soaring into forbidden court—this scholar custom is cause for concern.',
    'Officials have split into factions, slavish to patrons and fickle in judgment; rumor and slander fly into the palace—this is alarming for the conduct of scholars.',
  ],
  s0438: [
    'Capital region, Shandong, Shanxi, Henan, in recent years drought and famine.',
    'The capital region, Shandong, Shanxi, and Henan have suffered drought and famine in successive years.',
  ],
  s0439: [
    'Among people selling daughters vending sons, eating wives chewing sons, dagger running toward danger, urgent how can choose.',
    'Families sell daughters and sons; some eat wife and child; driven to desperation they cannot choose their course.',
  ],
  s0440: [
    'One call four responses, then small robbers combine groups, will become heroes\'s footing—this people\'s feeling is cause for concern.',
    'At one shout they answer from four sides; petty bandits gather and may become the foundation for rebels—this is alarming for the people\'s temper.',
  ],
  s0441: ['" The emperor also did not reflect.', '" The emperor took no notice.'],
  s0442: [
    'Ministry of Personnel Vice Minister Xiao Yunju assisted capital evaluation, had those sheltered; Mengzhen first memorial attacked him.',
    'When Vice Minister Xiao Yunju of the Ministry of Personnel ran the capital evaluation and showed favoritism, Mengzhen was the first to attack him in a memorial.',
  ],
  s0443: [
    'Discussers daily many, Yunju led departure.',
    'Critics multiplied daily until Yunju withdrew.',
  ],
  s0444: [
    'Shanhai garrison commander Li Huoyang offended tax supervisor, entered prison died; Mengzhen for him argued injustice, thereby requested pardon Bian Kongshi, Wang Bangcai, Man Chaojian, Li Shishan and others among those in prison, and said: "Chu-clan one case, dead already many; now those locked behind high walls—who are not Great Ancestor\'s descendants, yet made to reach this.',
    'Li Huoyang, garrison commander at Shanhai, defied the tax commissioner and died in prison; Mengzhen pleaded his case and asked clemency for Bian Kongshi, Wang Bangcai, Man Chaojian, Li Shishan, and others still imprisoned, adding: "In the Chu-clan affair many are already dead; those now walled in the heights—who is not a descendant of the founding emperor, yet brought to this pass?',
  ],
  s0445: ['" All not listened.', '" All went unheeded.'],
  s0446: [
    'Forty-second year winter, examination selection censorate circuit, Secretariat Drafter Zhang Guangfang, magistrates Zhao Yunchang, Zhang Tinggong, Kuang Mingluan, Pu Zhongyu, because speech opposed the times, suppressed not permitted to participate.',
    'In the winter of the forty-second year, when censorate posts were filled, Zhang Guangfang, Zhao Yunchang, Zhang Tinggong, Kuang Mingluan, and Pu Zhongyu were barred because their outspoken views offended the court.',
  ],
  s0447: [
    'Mengzhen not level, complete memorial discussed it.',
    'Mengzhen protested and submitted a full memorial on the matter.',
  ],
  s0448: [
    'At this time three factions\' power spread, hated Mengzhen\'s forthright straightness, sent out as Guangdong vice commissioner.',
    'The three factions were ascendant and resented his blunt integrity; he was posted out as vice commissioner in Guangdong.',
  ],
  s0449: ['Moved illness not attended.', 'He pleaded illness and did not take up the post.'],
  s0450: [
    'Tianqi beginning, raised Nanjing Vice Minister of Imperial Household, summoned changed to Court of Imperial Studs.',
    'At the start of Tianqi he was recalled as Vice Minister of the Imperial Household at Nanjing, then summoned to the Court of Imperial Studs.',
  ],
  s0451: ['Because mourning returned.', 'He returned home on mourning leave.'],
  s0452: [
    'Wei Zhongxian obtained will, by censor Wang Yehao impeached, then stripped registry.',
    'When Wei Zhongxian rose to power, censor Wang Yehao impeached him and he was struck from the rolls.',
  ],
  s0453: ['Chongzhen beginning, restored office.', 'At the start of Chongzhen his office was restored.'],
  s0454: ['Mengzhen young poor.', 'Mengzhen was poor in youth.'],
  s0455: [
    'Already passed prominent, family without surplus funds.',
    'Even after he rose to prominence his household held no surplus wealth.',
  ],
  s0456: [
    'Only harbored Zhao Shiqing\'s suppressing self; already entered censorate then memorial impeached Shiqing—people thought narrow.',
    'He alone bore a grudge against Zhao Shiqing for demoting him; once on the Censorate he impeached Shiqing, which many judged petty.',
  ],
  s0457: [
    'Wang Ruolin, style Shifu, Guangzhou man.',
    'Wang Ruolin, courtesy name Shifu, was a native of Guangzhou.',
  ],
  s0458: ['Father Zhi, Baoding prefect.', 'His father Zhi was prefect of Baoding.'],
  s0459: [
    'Ruolin raised Wanli twentieth year advanced scholar, received emissary.',
    'Ruolin passed the metropolitan examination in Wanli 20 and was made an emissary.',
  ],
  s0460: [
    'Thirty-third year, promoted Household Section supervising secretary.',
    'In the thirty-third year he was promoted to supervising secretary of the Household Section.',
  ],
  s0461: [
    'Said "functionaries greedy cruel, on average follow light sentencing, not law;',
    'He said, "When officials are greedy and cruel, sentences are habitually too light—this is not lawful;',
  ],
  s0462: [
    'Border officials exhaust fat and cream, outward flattering enemy, inward flattering key ford, yet capital army hundred thousand half false claims, not plan.',
    'frontier officers drain the people to flatter enemies abroad and patrons at court, while half the capital garrison of a hundred thousand men exist only on paper—this is no policy."',
  ],
  s0463: [
    '" Ministry of War Minister Xiao Daheng was impeached requesting departure, Ministry of Personnel deliberated retain; Ruolin forcefully slandered ministry deliberation.',
    '" When Minister Xiao Daheng of War was impeached and asked to retire, the Ministry of Personnel voted to keep him; Ruolin fiercely attacked that decision.',
  ],
  s0464: [
    'Yunnan people\'s mutiny, killed tax envoy Yang Rong; edict followed Grand Coordinator Chen Yongbin\'s words, ordered Sichuan Qiu Chengyun concurrently to lead.',
    'A Yunnan uprising killed the tax commissioner Yang Rong; the court followed Grand Coordinator Chen Yongbin and ordered Qiu Chengyun of Sichuan to take concurrent charge.',
  ],
  s0465: [
    'Ruolin said: "Yongbin nourished and completed Rong\'s evil; now not straight requesting abolish tax, yet initiating discussion to lead at Sichuan—bearing country very.',
    'Ruolin wrote: "Yongbin nurtured Rong\'s abuses; instead of demanding an end to the levies he proposed putting Sichuan in charge—this deeply betrays the state.',
  ],
  s0466: [
    'Beg urgently expel Yongbin, pursue halt former command.',
    'I beg that Yongbin be dismissed at once and the prior order revoked."',
  ],
  s0467: ['" All not answered.', '" None of this was heeded.'],
  s0468: ['Advanced Ritual Section Right supervising secretary.', 'He was promoted to right supervising secretary of the Ritual Section.'],
  s0469: [
    'From first month to fourth month no rain; Ruolin ascended memorial saying: "Your servant examined Hong Fan\'s tradition: words not followed, this is called not bright, its punishment constant drought.',
    'From the first month through the fourth no rain fell; Ruolin memorialized: "I have consulted the Hong Fan tradition: when counsel goes unheeded, it is called obscurity, and the punishment is lasting drought.',
  ],
  s0470: [
    'Now suburban temples ought to be attended in person, court assemblies ought to be held, Eastern Palace lectures ought to be opened—these below repeatedly spoke, yet above did not follow.',
    'The suburban altars should be attended in person, court audiences held, and lectures for the heir apparent resumed—matters urged again and again below yet never heeded above.',
  ],
  s0471: [
    'Also there are above speaking yet midway changing: tax affairs returned to functionaries, powerful eunuchs still invade and seize;',
    'Some policies were announced and then reversed: taxes were restored to civil officials, yet powerful eunuchs still seized them;',
  ],
  s0472: [
    'Raising the dismissed had clear edict, yet memorials still sink in the archive—is this.',
    'recalled officials were covered by a clear edict, yet their cases still languish in the archives.',
  ],
  s0473: [
    'There are above repeatedly speaking yet long undecided, below several times speaking yet above not cutting off: inner and outer great ministers\' recommendation and supplementation, impeached various ministers\' advance and retreat—is this.',
    'Some matters were urged repeatedly above yet long unresolved, or many times below yet never decided above: appointments of high ministers at court and in the provinces, and the fate of impeached officials.',
  ],
  s0474: [
    'All these are the category of words not followed.',
    'All these belong to counsel unheeded.',
  ],
  s0475: [
    'Accumulated depression becomes disaster, Heaven and man constant principle.',
    'Grievances piled high become calamities—such is the constant way of Heaven and man.',
  ],
  s0476: [
    'Your Majesty how can indifferent and stop!',
    'How can Your Majesty remain indifferent!"',
  ],
  s0477: [
    '" At that time Nanjing Household and Works two ministries lacked ministers, Ritual lacked vice minister; court recommendation former minister Xu Yuantai, Guizhou Grand Coordinator Guo Zizhang, former Household Tutor Fan Chunjing.',
    '" At that time the Nanjing ministries of Revenue and Works lacked ministers and the Ministry of Rites a vice minister; the court recommended former minister Xu Yuantai, Guizhou grand coordinator Guo Zizhang, and former household tutor Fan Chunjing.',
  ],
  s0478: [
    'Ruolin said: "The three men insufficient to bear office, moreover recommenders cannot be without private.',
    'Ruolin said, "These three are unfit for office, and the recommenders cannot be free of private motive.',
  ],
  s0479: [
    'Request from now court recommendation not with one person presiding, the multitude all drawing assent.',
    'I ask that hereafter no single man dominate a court recommendation while all others merely assent.',
  ],
  s0480: [
    'Ought register recommender names, restore ancestral linked-sitting law.',
    'Record the recommenders\' names and restore the ancestral law of joint liability."',
  ],
  s0481: [
    '" Edict sternly admonished as Ruolin said; those recommended all reported shelved.',
    '" An edict rebuked the court as Ruolin urged, and every nominee was left in abeyance.',
  ],
  s0482: [
    'Ministry of War Director Zhang Rulin, Grand Secretary Zhu Geng\'s son-in-law.',
    'Zhang Rulin, a director in the Ministry of War, was son-in-law to Grand Secretary Zhu Geng.',
  ],
  s0483: [
    'Presided over Shandong examination, those taken as scholars had compositions not complete.',
    'As examiner in Shandong he passed candidates whose examination essays were incomplete.',
  ],
  s0484: [
    'Ruolin memorial impeached him, stopped his salary.',
    'Ruolin impeached him by memorial and his salary was suspended.',
  ],
  s0485: [
    'Inner attendant Yang Zhizhong perverted law flogging killed Commander Zheng Guangzhuo; Ruolin led colleagues listing his ten crimes, not answered.',
    'The eunuch Yang Zhizhong tortured and killed Commander Zheng Guangzhuo contrary to law; Ruolin and his colleagues listed ten crimes against him, without response.',
  ],
  s0486: [
    'Zhu Geng alone chief minister, court affairs increasingly slack.',
    'Zhu Geng served as sole grand secretary and court business grew ever more lax.',
  ],
  s0487: [
    'Ruolin said: "Your Majesty alone chiefs one Geng, yet again scheduled audiences unheard, supplementary memorials none answered—this greatest worry.',
    'Ruolin wrote: "Your Majesty relies on Geng alone, yet scheduled audiences go unheld and supplementary memorials unanswered—this is the gravest worry.',
  ],
  s0488: [
    'Just now discipline broken, government affairs obstructed, talent exhausted, common offices empty, people\'s strength exhausted, border regions abandoned, palace minions rampant, bandits and thieves numerous, scholar-officials nearly forgot integrity shame and ritual righteousness, yet small people\'s bitter suffering and wronged pain\'s sound penetrates the realm within.',
    'Discipline is ruined, government blocked, talent spent, posts vacant, the people drained, frontiers neglected, eunuchs rampant, banditry rife; scholar-officials have nearly forgotten integrity, while the cries of the suffering common folk fill the realm.',
  ],
  s0489: [
    'Assisting ministers ought boldly to bear the realm\'s weight, gather up people\'s hearts, to offer effect to the throne.',
    'The chief ministers should boldly shoulder the realm, rally hearts, and serve the throne.',
  ],
  s0490: [
    'If only modest yielding not yet at leisure, or because of men\'s words, lightly cherish going and coming, then Your Majesty on what rely?',
    'If they only defer in false modesty or lightly quit office at rumor, on whom can Your Majesty rely?"',
  ],
  s0491: [
    '" Geng then followed Ruolin\'s finger, forcefully requested emperor urgently enact new government.',
    '" Geng then took Ruolin\'s cue and urgently begged the emperor to enact new policies.',
  ],
  s0492: ['The emperor also did not reflect.', 'The emperor again took no notice.'],
  s0493: ['Fifth month first day, great rain hail.', 'On the first day of the fifth month hail fell in torrents.'],
  s0494: [
    'Ruolin said employment not broad, great ministers monopolizing power\'s sign, complete memorial sharply spoke it.',
    'Ruolin held that narrow appointments and ministers\' monopoly of power were portents, and stated this bluntly in a memorial.',
  ],
  s0495: [
    'Already after capital long rain, ruined fields and huts.',
    'Soon afterward prolonged rain in the capital ruined fields and houses.',
  ],
  s0496: [
    'Ruolin again said great ministers banded together leaning on each other, small ministers catching wind, its flow increasingly severe;',
    'Ruolin again charged that great ministers formed cliques and small officials followed the current, worsening the tide;',
  ],
  s0497: [
    'Intent again slandered Geng and new assistant Li Tingji and company.',
    'again aiming at Zhu Geng and the new assistant Li Tingji and his circle.',
  ],
  s0498: [
    'Thirty-sixth year, inspected treasury stores, saw old treasury only silver eighty thousand, yet outer treasury desolate, various border army provisions overdue reaching more than a million.',
    'In the thirty-sixth year he inspected the treasuries: the old vault held only eighty thousand taels of silver, the outer vaults were bare, and frontier pay was in arrears by more than a million.',
  ],
  s0499: [
    'Memorial requested gather deliberation long strategy, also retained within.',
    'He memorialized for a council to devise a long-term plan, but it too was shelved.',
  ],
  s0500: [
    'Earlier, Ministry of Personnel listed upward examination selection those to receive censorate circuit: magistrates Xinjian Wang Yuangong, Jinxian Huang Ruheng, Nanchang Huang Yiteng among them.',
    'Earlier the Ministry of Personnel had submitted candidates for censorate appointment, including the magistrates Wang Yuangong of Xinjian, Huang Ruheng of Jinxian, and Huang Yiteng of Nanchang.',
  ],
};

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
let n = 0;
for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  const [literal, idiomatic] = pair;
  if (!literal?.trim() || !idiomatic?.trim()) throw new Error(`empty: ${s.id}`);
  if (literal.trim() === idiomatic.trim()) throw new Error(`identical: ${s.id}`);
  s.literal = literal;
  s.idiomatic = idiomatic;
  n++;
}
if (n !== 100) throw new Error(`expected 100 updates, got ${n}`);
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
console.log(`Updated ${n} sentences in ${FILE}`);
