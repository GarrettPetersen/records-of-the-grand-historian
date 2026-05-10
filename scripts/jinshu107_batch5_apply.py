#!/usr/bin/env python3
"""Apply Jinshu chapter 107 batch-5 translations (s0302–s0401) to current_translation_jinshu.json.

Expects `translations/current_translation_jinshu.json` to list exactly those sentence ids (100 segments).

Behavior: fills `literal` and `idiomatic` for every id in `T`; aborts unless each such id appears in
the translation file; after applying, asserts those rows are non-empty.
"""

import json
import sys
from pathlib import Path

T = [
    ("s0302", "Shi Zhi's defender of the south Liu Guo came from Fanyang to join Liu Kun.", "Shi Zhi's southern commander Liu Guo marched up from Fanyang to rendezvous with Liu Kun."),
    ("s0303", "Ran Min greatly defeated Liu Kun at Handan; the dead exceeded ten thousand.", "At Handan Ran Min shattered Liu Kun's army, leaving more than ten thousand dead."),
    ("s0304", "Liu Guo returned and encamped at Fanyang.", "Liu Guo withdrew his camps to Fanyang."),
    ("s0305", "Fu Jian from Fangtou entered the passes.", "Fu Jian led his followers from Fangtou into the Guanzhong passes."),
    ("s0306", "Zhang Hedeng and Duan Qin joined Liu Guo and Jin Tun at Changcheng; they intended to strike Ye.", "Zhang Hedeng and Duan Qin concentrated Liu Guo and Jin Tun at Changcheng for an advance on Ye."),
    ("s0307", "Ran Min dispatched left vice-director of Masters-of-Book Liu Qun as commander-in-chief of the mobile headquarters, ordered his generals Wang Tai, Cui Tong, Zhou Cheng and others to lead one hundred twenty thousand foot and horse and halt at Huangcheng, Ran Min personally commanded eighty thousand picked troops to follow, and they fought at Cangting.", "Ran Min put Liu Qun, left vice-director of the secretariat, in charge of the field headquarters and sent Wang Tai, Cui Tong, and Zhou Cheng ahead with a hundred twenty thousand mixed troops to Huangcheng; he followed with eighty thousand elites and offered battle at Cangting."),
    ("s0308", "Hedeng and the others were greatly defeated; twenty-eight thousand died; they pursued and beheaded Jin Tun at Yin'an township, wholly captured their host, shook the troops and returned.", "Hedeng's coalition collapsed with twenty-eight thousand casualties; Ran Min ran Jin Tun down at Yin'an, bagged the army, and marched home in order."),
    ("s0309", "Martial troops exceeded three hundred thousand; banners, bells, and drums stretched more than a hundred li—even at the height of the Shi clan nothing surpassed this.", "Over three hundred thousand soldiers with banners and drums lined a hundred li of road—a display even Shi Zhao's zenith had never matched."),
    ("s0310", "Ran Min arrived from Cangting, performed the post-victory drinking rite, clarified and settled the nine ranks, granted posts according to talent; Confucian scholars from humble households mostly won conspicuous promotion—at the time opinion united in comparing the moment to the beginning of Wei and Jin.", "Returning from Cangting Ran Min held the victory feast, regularized the nine-grade bureaucracy, matched talent to office, and elevated poor scholars—observers likened the mood to the fresh order of early Wei-Jin."),
    ("s0311", "Ran Min led one hundred thousand foot and horse to attack Shi Zhi at Xiangguo, appointed his son Prince of Taiyuan Yin grand chanyu and chief agile cavalry general, and assigned one thousand surrendered Hu under his command.", "Ran Min invested Xiangguo with a hundred thousand troops, named Prince Yin of Taiyuan grand chanyu and chief of agile cavalry, and attached a thousand surrendered Hu fighters to his staff."),
    ("s0312", "Supernumerary palace gentleman Wei Xiao submitted a remonstrance that was very cutting; Ran Min read it and was greatly angry; he executed Xiao and his descendants.", "Wei Xiao remonstrated bluntly in memorial; Ran Min read it, exploded in rage, and extirpated his line."),
    ("s0313", "Ran Min attacked Xiangguo over a hundred days; he built earthen hills and covered ways, erected shelters and turned the soil as if to farm.", "For more than a hundred days Ran Min besieged Xiangguo with siege mounds, tunnels, and huts, signaling a war of attrition."),
    ("s0314", "Zhi was greatly afraid; he cast off the emperor's title, styled himself king of Zhao, and sent envoys to Murong Jun and Yao Yizhong to beg for troops.", "Panicked, Shi Zhi dropped his imperial claim, called himself Zhao prince, and implored Murong Jun and Yao Yizhong for relief armies."),
    ("s0315", "When Shi Kun came from Jizhou to aid Zhi, Yizhong again sent his son Xiang with thirty-eight thousand cavalry from Ge Ford, and Jun sent general Yue Wan with thirty thousand armored troops from Longcheng; the three hosts combined to more than one hundred thousand crack soldiers.", "Shi Kun marched from Jizhou to Shi Zhi's aid while Yao Yizhong sent Yao Xiang with thirty-eight thousand riders from Ge Ford and Murong Jun sent Yue Wan with thirty thousand armored men from Longcheng—well over a hundred thousand veterans converged."),
    ("s0316", "Ran Min dispatched chariot-and-cavalry Hu Mu to block Yao Xiang below Changlu in the paddock, and general Sun Wei to await Kun at Huangqiu; both were defeated by the enemy, their troops nearly exhausted, and Mu and Wei returned alone on horseback.", "Hu Mu failed to stop Yao Xiang near Changlu and Sun Wei failed against Shi Kun at Huangqiu—both units were shredded and the generals rode back alone."),
    ("s0317", "Kun's army was about to arrive; Ran Min was going to go out and strike them; guard-general Wang Tai remonstrated, saying, \"Cornered bandits are sure to cling to delusion and hope for outside rescue.", "As Shi Kun closed in Ran Min prepared to sally; guard-general Wang Tai urged, \"Besieged foes will cling to fantasy and outside rescue."),
    ("s0318", "Now strong relief hosts gather like clouds; they want us to come out and fight so they can strike us front and rear.", "Relief columns are massing to lure us out and hit us from both sides."),
    ("s0319", "We ought to hold the ramparts and not emerge, watch how matters shift, and move so as to break their design.", "Hold the walls, read the field, and move only to frustrate their plan."),
    ("s0320", "Now Your Majesty personally bears arms; if we forfeit perfect safety, the great enterprise is lost.", "If Your Majesty takes the field and anything goes wrong, the whole venture collapses."),
    ("s0321", "I beg you not to venture out; your servant asks to lead the generals and destroy them for Your Majesty.", "Stay inside—I will lead the commanders and finish them for you."),
    ("s0322", "\" Ran Min was about to consent when the Daoist Fa Rao stepped forward and said, \"The White Planet has crossed the Mao asterism—this means the Hu king must die; one battle wins all—do not miss it.", "\" Ran Min nearly agreed until Daoist Fa Rao insisted the White Planet over Mao doomed the Hu ruler and promised total victory in a single clash."),
    ("s0323", "\" Ran Min threw back his sleeves and declared loudly, \"My mind is fixed on battle; whoever remonstrates shall be beheaded!", "\" Ran Min rolled up his sleeves and roared that the fight was settled and advisors would die."),
    ("s0324", "\" Thereupon he brought the whole host out to fight.", "\" He then hurled every man into the open field."),
    ("s0325", "Yao Xiang, Yue Wan, Shi Kun and others attacked from three sides while Zhi struck their rear; Ran Min's army was catastrophically defeated.", "Yao Xiang, Yue Wan, and Shi Kun closed from three sides while Shi Zhi drove into Ran Min's rear—his army collapsed."),
    ("s0326", "Ran Min hid in the traveling palace at Xiangguo and, with a dozen-odd riders, fled to Ye.", "Ran Min slipped into the Xiangguo lodge and bolted for Ye with barely a dozen horsemen."),
    ("s0327", "The surrendered Hu Sogdian Kang and others seized Ran Yin and left vice-director Liu Qi and others, delivered them to Zhi, and executed them all.", "Surrendered Hu led by the Sogdian Kang seized Ran Yin and vice-director Liu Qi, handed them to Shi Zhi, and put them to death."),
    ("s0328", "Minister of works Shi Pu, Masters-of-Book chief Xu Ji, chariot-and-cavalry Hu Mu, attendant Li Lin, palace secretariat overseer Lu Chen, chamberlain for the palace treasury Wang Yu, Masters-of-Book Liu Qin and Liu Xiu and other officers and soldiers who died numbered more than one hundred thousand—talent and materiel were wiped out.", "Pu, Xu Ji, Hu Mu, Lu Chen, and hosts of ministers and generals fell—over a hundred thousand dead—and Ran Min's regime lost its backbone."),
    ("s0329", "Bandits sprang up like wasps; Si and Ji suffered great famine; people devoured one another.", "Brigands swarmed; Si and Ji starved until cannibalism spread."),
    ("s0330", "From the last years of Shi Hu, Ran Min had emptied the granaries to buy private loyalty.", "Ever since Shi Hu's twilight Ran Min had drained the treasuries to purchase favor."),
    ("s0331", "He fought Qiang and Hu month after month without pause.", "War against Qiang and Hu fronts never paused."),
    ("s0332", "Several million relocated households from Qing, Yong, You, and Jingzhou together with Di, Qiang, Hu, and Man peoples started homeward in every direction; routes crossed, they slaughtered and robbed one another, hunger and plague carried most off, and only two or three in ten reached safety.", "Millions of uprooted Han and non-Han peoples crossed paths heading home, killing and looting amid famine and pestilence—fewer than a third survived the trek."),
    ("s0333", "The central lands fell into chaos; no farmers remained.", "Heartland agriculture ceased in the general turmoil."),
    ("s0334", "Ran Min regretted it; he executed Fa Rao and his son, cut them limb from limb, and posthumously honored Wei Xiao as grand tutor.", "Ran Min repented, dismembered Fa Rao and his son, and posthumously raised Wei Xiao to grand tutor."),
    ("s0335", "Shi Zhi sent Liu Xian leading seventy thousand men to attack Ye.", "Shi Zhi ordered Liu Xian against Ye with seventy thousand troops."),
    ("s0336", "At that time Ran Min had secretly returned and nobody knew; court and camp alike panicked, all believing Ran Min had already perished.", "Ran Min had sneaked back unseen; rumor spread that he was dead and dread seized everyone."),
    ("s0337", "Colonel of archers who shoot by sound Zhang Ai urged Ran Min to perform the suburban sacrifice in person to steady morale; Ran Min followed him and the false tales ceased.", "Zhang Ai persuaded Ran Min to lead a suburban rite to calm the troops; he agreed and the rumors died."),
    ("s0338", "Liu Xian halted at Mingguang Palace, twenty-three li from Ye; Ran Min was afraid and summoned guard-general Wang Tai to deliberate.", "Liu Xian camped twenty-three li out at Mingguang Palace; a frightened Ran Min called Wang Tai to council."),
    ("s0339", "Tai resented that Ran Min had not followed his plan and pleaded severe sores as excuse.", "Wang Tai still smarted over the ignored advice and claimed bleeding wounds."),
    ("s0340", "Ran Min visited him in person to inquire; he insisted his illness was grave.", "Ran Min went to his bedside; Wang Tai swore he was dying."),
    ("s0341", "Ran Min grew angry, returned to the palace, and said to those beside him, \"Ba slaves—does your lord need you to grant him life!", "Furious back at court Ran Min sneered that \"Ba\" lackeys would not dictate his fate."),
    ("s0342", "I mean first to wipe out the Hu hordes, then behead Wang Tai.", "He vowed to butcher the Hu first and take Wang Tai's head next."),
    ("s0343", "\" Thereupon he committed the whole host; he routed Liu Xian's army, chased them to Yangping, and took more than thirty thousand heads.", "\" He threw full strength into the fight, shattered Liu Xian at Yangping, and piled thirty thousand skulls."),
    ("s0344", "Xian was afraid; he secretly sent envoys offering surrender and begged to kill Zhi to prove loyalty; Ran Min shook the troops and returned.", "Liu Xian sued for peace in secret, offered to murder Shi Zhi as earnest, and Ran Min marched home."),
    ("s0345", "Meanwhile someone reported that Wang Tai was rallying Qin men intending to flee into Guanzhong; Ran Min was angry, executed Tai, and extirpated his three clans.", "Word came that Wang Tai was collecting Qin followers for a dash to Guanzhong; Ran Min executed him and annihilated his kin."),
    ("s0346", "Liu Xian indeed killed Zhi together with grand tutor Zhao Lu and more than ten others, sent the heads to Ye, and forwarded hostages begging orders.", "Liu Xian slew Shi Zhi, Zhao Lu, and a dozen courtiers, boxed the heads to Ye, and sent pledges for mercy."),
    ("s0347", "Chief agile cavalry Shi Ning fled to Bairen.", "Shi Ning, chief of agile cavalry, bolted to Bairen."),
    ("s0348", "Ran Min ordered Shi Zhi's head burned at a crossroads.", "Ran Min had Shi Zhi's head burnt in the public way."),
    ("s0349", "Ran Min's Xuzhou governor Liu Qi surrendered Juancheng.", "Liu Qi, Ran Min's Xuzhou governor, yielded Juancheng."),
    ("s0350", "Liu Xian again led a host against Ye; Ran Min defeated him.", "Liu Xian struck Ye again and Ran Min turned him back."),
    ("s0351", "He returned and assumed title at Xiangguo.", "He fell back to Xiangguo and reclaimed imperial style there."),
    ("s0352", "Ran Min's Xuzhou governor Zhou Cheng, Yanzhou governor Wei Tong, Yuzhou shepherd Ran Yu, and Jingzhou governor Yue Hong all surrendered their cities.", "Zhou Cheng, Wei Tong, Ran Yu, and Yue Hong—Ran Min's regional governors—handed over their walls."),
    ("s0353", "Pacifier of the south Gao Chong and general who subdues barbarians Lu Hu seized Luozhou governor Zheng Xi and brought the Three Rivers region over.", "Gao Chong and Lu Hu captured Zheng Xi and submitted the Three Rivers."),
    ("s0354", "Murong Biao took Zhongshan, killed Ran Min's defender of the north Bai Tong and Youzhou governor Liu Zhun, and yielded to Murong Jun.", "Murong Biao seized Zhongshan, executed Bai Tong and Liu Zhun, and went over to Murong Jun."),
    ("s0355", "At the time there appeared yellow-red clouds rising in the northeast stretching more than a hundred zhang; a white bird flew southwest through them—diviners counted it an evil omen.", "Yellow-red vapors a hundred zhang long lifted from the northeast while a white bird cut southwest through them—soothsayers read disaster."),
    ("s0356", "Liu Xian led a host against Changshan; prefect Su Hai appealed to Ran Min for aid.", "Liu Xian marched on Changshan; Su Hai begged Ran Min for rescue."),
    ("s0357", "Ran Min left grand general Jiang Gan and others to assist crown prince Zhi in holding Ye and personally led eight thousand cavalry to relieve them.", "He left Jiang Gan to steady Crown Prince Zhi in Ye and rode to the rescue with eight thousand horse."),
    ("s0358", "The grand marshal whom Xian had appointed, Prince of Qinghe Ning, surrendered Zaoyang to Ran Min; Ran Min gathered the survivors, struck Xian, defeated him, and chased him to Xiangguo.", "Prince Ning of Qinghe, Liu Xian's grand marshal, defected at Zaoyang; Ran Min rallied the remainder, crushed Liu Xian, and pursued him to Xiangguo."),
    ("s0359", "Xian's general Cao Fuju opened the gates in collusion; they entered Xiangguo, executed Xian and more than one hundred dukes and ministers below him, burned the palace compounds, and moved the common people to Ye.", "Cao Fuju betrayed the walls; Ran Min stormed Xiangguo, slew Liu Xian and his hundred-plus officials, torched the palaces, and shipped the populace to Ye."),
    ("s0360", "Xian's army director Fan Lu led over a thousand men, broke through the barrier, and fled to Fangtou.", "Army director Fan Lu hacked through the passes with a thousand followers and raced to Fangtou."),
    ("s0361", "By then Murong Jun had taken You and Ji and his advance reached Jizhou.", "Murong Jun already held You and Ji and was probing into Jizhou."),
    ("s0362", "Ran Min led cavalry to block him and met Murong Ke at Weichang.", "Ran Min moved horse to intercept and encountered Murong Ke at Weichang."),
    ("s0363", "Ran Min's grand general Dong Run and chariot-and-cavalry Zhang Wen told Ran Min, \"The Xianbei ride the momentum of victory and their vigor is unstoppable; we cannot withstand them—please avoid them to bleed their spirit, then raise fresh troops and strike; we can win.", "Dong Run and Zhang Wen warned that triumphant Xianbei could not be met head-on and urged Ran Min to sidestep Murong Ke until their zeal faded."),
    ("s0364", "\" Ran Min angrily said, \"I brought a finished army forth intending to pacify Youzhou and behead Murong Jun.", "\" Ran Min retorted that he had marched to flatten Youzhou and take Murong Jun's head."),
    ("s0365", "Now if I meet Ke and avoid him, people will mock me.", "Backing away from Murong Ke would make him a laughingstock."),
    ("s0366", "\" Thereupon he engaged Ke and defeated him in ten encounters.", "\" He closed with Murong Ke and won ten straight skirmishes."),
    ("s0367", "Ke then chained horses with iron links, picked five thousand Xianbei who shot well yet lacked stubborn nerve, and advanced in square formation.", "Murong Ke locked mounts with iron chains and sent five thousand flexible Xianbei bowmen forward in a tight square."),
    ("s0368", "Ran Min's red horse was called Zhu Long; it covered a thousand li a day; he bore a double-edged spear in his left hand and a hooked halberd in his right; riding the wind he struck and beheaded more than three hundred Xianbei.", "His charger Zhu Long—said to run a thousand li a day—carried him as he wielded twin-headed spear and hook halberd and cut down three hundred Xianbei in the gust."),
    ("s0369", "Soon Yan cavalry arrived in strength and ringed him round after round.", "Then Yan horse flooded in and wound coil after coil around him."),
    ("s0370", "Ran Min was outnumbered; he vaulted his horse through the cordon and fled east; after twenty-some li the horse died for no clear reason; Ke captured him together with Dong Run, Zhang Wen and others and sent them to Ji.", "Outmatched, he punched through eastward until his mount dropped dead twenty li out; Murong Ke seized him along with Dong Run and Zhang Wen and shipped them to Ji."),
    ("s0371", "Jun made Ran Min stand and asked him, \"You are mean talent of slave stock—how dare you style yourself Son of Heaven?", "Murong Jun had Ran Min stand trial: \"A menial upstart—what right had you to call yourself emperor?"),
    ("s0372", "\" Ran Min said, \"All under heaven is in great chaos; you people are barbarian Di—human faces with beasts' hearts—and still you scheme usurpation.", "\" Ran Min shot back that barbarians with human masks still plotted treason while the realm burned."),
    ("s0373", "I am a hero of the age—why may I not be emperor!", "He insisted a man of his stature could wear the purple."),
    ("s0374", "\" Jun was angry, flogged him three hundred strokes, sent him to Longcheng, and reported the matter at the shrines of Gui and Huang.", "\" Murong Jun flogged him three hundred times, sent him to Longcheng, and notified the shrines of Murong Gui and Murong Huang."),
    ("s0375", "He dispatched Murong Ping leading a host to besiege Ye.", "He ordered Murong Ping to invest Ye."),
    ("s0376", "Liu Ning and his younger brother Chong led three thousand Hu cavalry to Jinyang; Su Hai abandoned Changshan for Xinxing.", "Liu Ning and Liu Chong galloped three thousand Hu riders to Jinyang while Su Hai fled Changshan for Xinxing."),
    ("s0377", "Ye starved; people ate one another; palace women from Shi Hu's time were nearly all consumed.", "Inside Ye cannibalism reigned and Shi Hu's former palace women were eaten to the last."),
    ("s0378", "Ran Zhi was still young; Jiang Gan sent attendant-in-chamber Miao Song and household mentor Liu Yi with a memorial of submission and a plea for Jin reinforcements.", "Crown Prince Ran Zhi was a child; Jiang Gan sent Miao Song and Liu Yi to declare allegiance and beg Eastern Jin for troops."),
    ("s0379", "Puyang governor Dai Shi moved from Cangyuan to Jijin, stopped Liu Yi from advancing, and demanded the imperial seal.", "Dai Shi blocked Liu Yi at Jijin and insisted on the Heirloom Seal."),
    ("s0380", "Yi sent Song back to Ye to report; Gan hesitated; Shi then led more than a hundred stalwarts into Ye, helped guard the Three Terraces, and deceived him, saying, \"For now bring the seal out to me.", "Liu Yi sent Miao Song home while Jiang Gan wavered; Dai Shi slipped into Ye with a hundred braves, reinforced the Three Terraces, and coaxed Jiang Gan to hand over the seal."),
    ("s0381", "Now fierce bandits are outside; roads are blocked—I dare not send it yet.", "He claimed bandits cut the roads and the seal could not travel."),
    ("s0382", "Once I hold the seal I can gallop to report to the Son of Heaven.", "Possession would let him notify the emperor at speed."),
    ("s0383", "When the Son of Heaven learns the seal is with me he will trust your utmost sincerity and surely dispatch grain and troops in generous relief.", "The court would trust their loyalty and flood Ye with supplies once the seal rested with Dai Shi."),
    ("s0384", "\" Gan thought it right and brought out the seal and gave it to him.", "\" Jiang Gan agreed and surrendered the Heirloom Seal."),
    ("s0385", "Shi publicly declared he was sending protector-general He Rong to welcome grain while secretly ordering him to carry the seal to the capital.", "Dai Shi announced grain convoys under He Rong but secretly smuggled the seal toward Jiankang."),
    ("s0386", "Colonel of changshui Ma Yuan and dragon soaring Tian Xiang opened the gates and surrendered to Ping.", "Ma Yuan and Tian Xiang threw open Ye's gates to Murong Ping."),
    ("s0387", "Shi, Rong, and Jiang Gan were lowered by ropes and fled to Cangyuan.", "Dai Shi, He Rong, and Jiang Gan rappelled the walls and escaped to Cangyuan."),
    ("s0388", "Ping sent Ran Min's wife Lady Dong, heir Zhi, grand commandant Shen Zhong, minister of works Tiao You, palace secretariat overseer Nie Xiong, metropolitan commandant Ji Pi, palace secretariat director Li Yuan, and various royal dukes and ministers to Ji.", "Murong Ping shipped Lady Dong, Ran Zhi, Grand Commandant Shen Zhong, minister Tiao You, Nie Xiong, Ji Pi, Li Yuan, and the captured ministers to Ji."),
    ("s0389", "Masters-of-Book chief Wang Jian, left vice-director Zhang Qian, and right vice-director Lang Su killed themselves.", "Wang Jian, Zhang Qian, and Lang Su committed suicide."),
    ("s0390", "After Jun sent Ran Min and he reached Longcheng, he executed him at Ejing Mountain.", "Murong Jun had Ran Min executed at Ejing Mountain once he reached Longcheng."),
    ("s0391", "For seven li around the mountain grass and trees withered; locusts swarmed; from the fifth month until the twelfth no rain fell.", "Vegetation withered for seven li around, locusts boiled up, and drought gripped from May through December."),
    ("s0392", "Jun dispatched envoys to sacrifice to him, gave him the posthumous title Martial-Lament Heavenly King, and that day great snow fell.", "Murong Jun offered sacrifice, canonized him Martial-Lament Heavenly King, and snow fell that same day."),
    ("s0393", "That year was the eighth year of Yonghe.", "The year was Yonghe 8."),
    ("s0394", "Historical appraisal.", "Section rubric: historians' verdict."),
    ("s0395", "The historians say: Dragging the drowning from the flood and rescue from fire belong to the armies of true kings;", "The chroniclers declare that pulling victims from flood and flame marks legitimate imperial hosts;"),
    ("s0396", "Running riot in utmost cruelty is the way of Rong and Di.", "unbridled cruelty is the barbarians' habit."),
    ("s0397", "These foolish mixed breeds have been a scourge since antiquity; penned behind frontier walls we still feared their raids—how much worse when they occupy the central lands, spy on our royal rule, seize slack and disorder, spy gaps of peril and ruin, and every one howls with clans and whistles arrows to overturn heaven's constant!", "Such mongrel peoples troubled China for ages; even behind the long walls their raids terrified—yet once they seized the heartland, watched our throne stumble, and exploited every crack, none failed to rally kin, loose shafts, and smash natural order."),
    ("s0398", "Shi Le sprang from the Qiangqu branch and stood out odd among base stock.", "Shi Le rose from Qiangqu herdsmen and seemed freakish among riffraff."),
    ("s0399", "When drums sounded in Shangdang, Jizi judged him no ordinary man;", "His drums in Shangdang told Ji Zi he was no common soldier;"),
    ("s0400", "when he whistled leaning on Luoyang's walls, Yifu knew him for trouble.", "his whistle against Luoyang warned Wang Yan he would bring ruin."),
    ("s0401", "When Emperor Hui lost the reins and the realm shattered, he gathered ant-like followers, fanned disaster through every opening, slaughtered our capitals, and mowed down our people.", "Once Emperor Hui lost control and the empire flew apart, he rallied mobs, fed on every breach, butchered our cities, and cut down the common folk."),
]


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    path = root / "translations" / "current_translation_jinshu.json"
    if not path.is_file():
        print("missing", path, file=sys.stderr)
        sys.exit(1)
    data = json.loads(path.read_text(encoding="utf-8"))
    by_id = {sid: (lit, idio) for sid, lit, idio in T}
    file_ids = [s["id"] for s in data.get("sentences", [])]
    file_id_set = set(file_ids)
    missing_in_file = sorted(sid for sid in by_id if sid not in file_id_set)
    if missing_in_file:
        print("translation file missing ids required by T:", missing_in_file, file=sys.stderr)
        sys.exit(1)
    for s in data["sentences"]:
        if s["id"] in by_id:
            lit, idio = by_id[s["id"]]
            s["literal"] = lit
            s["idiomatic"] = idio
    for s in data["sentences"]:
        sid = s["id"]
        if sid in by_id and (not (s.get("literal") or "").strip() or not (s.get("idiomatic") or "").strip()):
            print("failed to apply", sid, file=sys.stderr)
            sys.exit(1)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("updated", len(by_id), "translations; verified each id in T is present and non-empty")


if __name__ == "__main__":
    main()
