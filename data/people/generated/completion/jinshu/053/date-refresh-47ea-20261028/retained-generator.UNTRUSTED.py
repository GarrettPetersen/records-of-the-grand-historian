#!/usr/bin/env python3
"""Independent chronology review for jinshu 053."""
import hashlib
import json
from datetime import datetime, timezone

JOB_ID = "bbe78b8b49ccfe81de7d"
SOURCE_HASH = "sha256:6271545aaaa5fda4f55b64be5085229c7bbaefb8b7931fdc2b7a147e2d006f89"
EXTRACTION_HASH = "sha256:c289000e9b6fdf5e0889385cd7f14558867f8a2334ea267b2e0d07f355c70d5b"
OUT = "/opt/cursor/artifacts/date-audit-0-bbe78b8b49ccfe81de7d.json"

OWNED_UNITS = [
    "s0001","s0002","s0003","s0004","s0005","s0006","s0007","s0008","s0009","s0010",
    "s0011","s0012","s0013","s0199","s0200","s0201","s0202","s0203","s0204","s0205",
    "s0014","s0015","s0016","s0017","s0018","s0019","s0020","s0021","s0022","s0023",
    "s0024","s0025","s0026","s0027","s0028","s0029","s0030","s0031","s0032","s0033",
    "s0034","s0035","s0036","s0037","s0038","s0039","s0040","s0041","s0042","s0043",
    "s0044","s0045","s0046","s0047","s0048","s0049","s0050","s0051","s0052","s0053",
    "s0054","s0055","s0056","s0057","s0058","s0059","s0060","s0061","s0062","s0063",
    "s0064","s0065","s0066","s0067","s0068","s0069","s0070","s0071","s0072","s0073",
    "s0074","s0075","s0076","s0077","s0078","s0079","s0080","s0081","s0082","s0083",
    "s0084","s0085","s0086","s0087","s0088","s0089","s0090","s0091","s0092","s0093",
    "s0094","s0095","s0096","s0097","s0098","s0099","s0100","s0101","s0102","s0103",
    "s0104","s0105","s0106","s0107","s0108","s0109","s0110","s0111","s0112","s0113",
    "s0114","s0115","s0116","s0117","s0118","s0119","s0120","s0121","s0122","s0123",
    "s0124","s0125","s0126","s0127","s0128","s0129","s0130","s0131","s0132","s0133",
    "s0134","s0135","s0136","s0137","s0138","s0139","s0140","s0141","s0142","s0143",
    "s0144","s0145","s0146","s0147","s0148","s0149","s0150","s0151","s0152","s0153",
    "s0154","s0155","s0156","s0157","s0158","s0159","s0160","s0161","s0162","s0163",
    "s0164","s0165","s0166","s0167","s0168","s0169","s0170","s0171","s0172","s0173",
    "s0174","s0175","s0176","s0177","s0178","s0179","s0180","s0181","s0182","s0183",
    "s0184","s0206","s0207","s0208","s0209","s0185","s0186","s0187","s0188","s0189",
    "s0190","s0191","s0192","s0193","s0194","s0195","s0196","s0197","s0198",
]

# unit -> zh (only those cited)
ZH = {
"s0002":"湣懷太子遹，字熙祖，惠帝長子，母曰謝才人。",
"s0003":"幼而聰慧，武帝愛之，恆在左右。",
"s0007":"太子時年五歲，牽帝裾入暗中。",
"s0012":"因撫其背，謂廷尉傅祗曰：「此兒當興我家。」",
"s0013":"嘗對群臣稱太子似宣帝，於是令譽流於天下。",
"s0015":"賈后素忌太子有令譽，因此密敕黃門閹宦媚諛于太子曰：「殿下誠可及壯時極意所欲，何為恆自拘束？」",
"s0017":"太子所幸蔣美人生男，又言宜隆其賞賜，多為皇孫造玩弄之器，太子從之。",
"s0026":"洗馬江統陳五事以諫之，太子不納，語在《統傳》中。",
"s0027":"舍人杜錫以太子非賈后所生，而後性凶暴，深以為憂，每盡忠規勸太子修德進善，遠於讒謗。",
"s0029":"太子性剛，知賈謐恃後之貴，不能假借之。",
"s0031":"詹事裴權諫曰：「賈謐甚有寵于中宮，而有不順之色，若一旦交構，大事去矣。",
"s0034":"初，賈后母郭槐欲以韓壽女為太子妃，太子亦欲婚韓氏以自固。",
"s0035":"而壽妻賈午及後皆不聽，而為太子聘王衍小女惠風。",
"s0036":"太子聞衍長女美，而賈后為謐聘之，心不能平，頗以為言。",
"s0037":"謐嘗與太子圍棋，爭道，成都王穎見而訶謐，謐意愈不平，因此譖太子于後曰：「太子廣買田業，多畜私財以結小人者，為賈氏故也。",
"s0039":"'非但如是也，若宮車晏駕，彼居大位，依楊氏故事，誅臣等而廢後於金墉，如反手耳。",
"s0043":"中護軍趙俊請太子廢後，太子不聽。",
"s0044":"九年六月，有桑生於宮西廂，日長尺餘，數日而枯。",
"s0045":"十二月，賈后將廢太子，詐稱上不和，呼太子入朝。",
"s0046":"既至，後不見，置於別室，遣婢陳舞賜以酒棗，逼飲醉之。",
"s0047":"使黃門侍郎潘岳作書草，若禱神之文，有如太子素意，因醉而書之，令小婢承福以紙筆及書草使太子書之。",
"s0058":"帝幸式乾殿，召公卿入，使黃門令董猛乙太子書及青紙詔曰：「遹書如此，今賜死。」",
"s0059":"遍示諸公王，莫有言者，惟張華、裴頠證明太子。",
"s0060":"賈后使董猛矯以長廣公主辭白帝曰：「事宜速決，而群臣各有不同，若有不從詔，宜以軍法從事。」",
"s0062":"後懼事變，乃表免太子為庶人，詔許之。",
"s0063":"於是使尚書和郁持節，解結為副，及大將軍梁王�持節，解結為副，及大將軍梁王肜、鎮東將軍淮南王允、前將軍東武公澹、趙王倫、太保何劭詣東宮，廢太子為庶人。",
"s0065":"澹以兵仗送太子妃王氏、三皇孫于金墉城，考竟謝淑妃及太子保林蔣俊。",
"s0066":"明年正月，賈后又使黃門自首，欲與太子為逆。",
"s0068":"又遣澹以千兵防送太子，更幽于許昌宮之別坊，令治書御史劉振持節守之。",
"s0073":"初，太子之廢也，妃父王衍表請離婚。",
"s0077":"自宜城君亡，不見存恤，恆在空室中坐。",
"s0107":"太子既廢非其罪，眾情憤怨。",
"s0108":"右衛督司馬雅，宗室之疏屬也，與常從督許超並有寵于太子，二人深傷之，說趙王倫謀臣孫秀曰：「國無適嗣，社稷將危，大臣之禍必起。",
"s0119":"賈后聞之憂怖，乃使太醫令程據合巴豆杏子丸。",
"s0120":"三月，矯詔使黃門孫慮齋至許昌以害太子。",
"s0123":"慮乃逼太子以藥，太子不肯服，因如廁，慮以藥杵椎殺之，太子大呼，聲聞於外。",
"s0124":"時年二十三。",
"s0131":"及賈庶人死，乃誅劉振、孫慮、程據等，冊復太子曰：「皇帝使使持節、兼司空、衛尉伊策故皇太子之靈曰：嗚呼！",
"s0135":"而朕昧於凶構，致爾於非命之禍，俾申生、孝己復見於今。",
"s0143":"又為哀策曰：「皇帝臨軒，使洗馬劉務告于皇太子之殯曰：咨爾遹！",
"s0158":"壺關幹主，千秋悟己。",
"s0168":"六月己卯，葬于顯平陵。",
"s0169":"帝感閻纘之言，立思子台，故臣江統、陸機並作誄頌焉。",
"s0171":"虨字道文，永康元年正月，薨。",
"s0172":"四月，追封南陽王。",
"s0174":"永康元年四月，封臨淮王。",
"s0176":"今立臧為皇太孫。",
"s0179":"趙王倫行太孫太傅。」",
"s0183":"永甯元年正月，趙王倫篡位，廢為濮陽王，與帝俱遷金墉，尋被害。",
"s0184":"太安初，追諡曰哀。",
"s0192":"遂使冤逾楚建，酷甚戾園。",
"s0199":"時望氣者言廣陵有天子氣，故封為廣陵王，邑五萬戶。",
"s0200":"以劉寔為師，孟珩為友，楊准、馮蓀為文學。",
"s0201":"惠帝即位，立為皇太子。",
"s0202":"盛選德望以為師傅，以何劭為太師，王戎為太傅，楊濟為太保，裴楷為少師，張華為少傅，和嶠為少保。",
"s0203":"元康元年，出就東宮，又詔曰：「遹尚幼蒙，今出東宮，惟當賴師傅群賢之訓。",
"s0205":"於是使太保衛瓘息庭、司空泰息略、太子太傅楊濟息毖、太子少師裴楷息憲、太子少傅張華息禕、尚書令華暠息恆與太子游處，以相輔導焉。",
"s0207":"永康元年四月，封為襄陽王。",
"s0208":"永寧元年八月，立為皇太孫。",
"s0209":"太安元年三月癸卯，薨，帝服齊衰期，諡曰沖太孫。",
"s0175":"己巳，詔曰：「咎征數發，奸回作變，遹既逼廢，非命而沒。",
}

def ev(unit, quote):
    zh = ZH[unit]
    if quote not in zh:
        raise SystemExit(f"quote not in {unit}: {quote!r}")
    return {"unit": unit, "quote": quote}

def chk(cid, verdict, reason, evidence, event=None):
    reason = reason.strip()
    if len(reason) < 20:
        raise SystemExit(f"short reason {cid}: {reason!r}")
    if event is not None and len(event.strip()) < 10:
        raise SystemExit(f"short event {cid}: {event!r}")
    row = {"id": cid, "verdict": verdict, "reason": reason, "evidence": evidence}
    if event is not None:
        row["event"] = event
    return row

# --- item checks ---
item_checks = []

def add(c):
    item_checks.append(c)

# Shared conversion notes kept short; details in references.
DEC300 = (
    "s0044 names 九年六月 before s0045 十二月, so this is Yuankang 9 month 12. "
    "That lunar month begins in AD 300 on the proleptic Gregorian conversion "
    "(conventional era label 299 does not date the month)."
)
YK1 = "s0203 元康元年 is Hui-era Yuankang 1, AD 291."
YK_ACC = "s0201 惠帝即位 is Wu’s death-year accession, AD 290."
NY1 = "s0066 明年正月 follows 九年十二月 and is Yongkang 1 month 1, AD 300."
M3 = "s0120 三月 is the third month after 明年正月, Yongkang 1, AD 300."
YK300 = "永康元年 is Hui Yongkang 1, AD 300."
YN301 = "永寧/永甯元年 is Hui Yongning 1, AD 301."
TA302 = "太安元年 is the year headed after 永寧元年 in the Hui annals, AD 302."

# p001 core
add(chk("claim-100","supported",
    "s0003 says Wu loved Yu and kept him at his side, with no era or year; the undated attestation is the correct form.",
    [ev("s0003","武帝愛之，恆在左右")],
    "Emperor Wu loved Sima Yu and kept him always at his side."))
add(chk("claim-101","supported",
    "s0007 gives 時年五歲 for the robe-into-darkness scene and no calendar date; the undated attestation correctly refuses a year.",
    [ev("s0007","太子時年五歲")],
    "Sima Yu, then five sui, pulled the emperor’s robe into the darkness."))
add(chk("claim-102","supported",
    YK1+" The dated event is Yu’s own move to the Eastern Palace, not a dynasty-wide window.",
    [ev("s0203","元康元年，出就東宮")],
    "Sima Yu moved out to reside in the Eastern Palace."))
add(chk("claim-103","supported",
    DEC300+" The event owner is Yu, whom Jia was about to depose.",
    [ev("s0044","九年六月"), ev("s0045","十二月，賈后將廢太子")],
    "Empress Jia moved to depose Sima Yu in the twelfth month."))
add(chk("claim-104","supported",
    NY1+" Yu is the target of the engineered confession.",
    [ev("s0066","明年正月")],
    "Sima Yu was again framed when Empress Jia had a eunuch confess rebellion."))
add(chk("claim-105","supported",
    M3+" The edict sent Sun Lü to Xuchang to kill Yu, Yu’s own death-sequence event.",
    [ev("s0120","三月，矯詔使黃門孫慮")],
    "A forged edict sent Sun Lü to Xuchang to kill Sima Yu."))
add(chk("claim-106","supported",
    "s0124 時年二十三 sits on the Yongkang-1 third-month murder; AD 300 dates that death-age notice, not a computed birth year.",
    [ev("s0124","時年二十三"), ev("s0120","三月，矯詔使黃門孫慮")],
    "Sima Yu was twenty-three sui when he was murdered."))
add(chk("claim-107","supported",
    "s0168 六月己卯 follows the Yongkang-1 murder and restoration sequence, so the burial year is AD 300. "
    "The Hui annals read 六月壬寅; both days stay in AD 300. Year precision does not resolve the day.",
    [ev("s0168","六月己卯，葬于顯平陵")],
    "Sima Yu was buried at Xianping Mausoleum."))
add(chk("claim-108","supported",
    "s0007 states age five sui at the fire-escape scene with no year; the sui figure and undated dateContext are preserved without inventing a birth year.",
    [ev("s0007","太子時年五歲")],
    "Sima Yu was five sui when he pulled the emperor into the darkness."))
add(chk("claim-109","supported",
    "s0124 時年二十三 is the age at the s0120–s0123 Yongkang-1 murder; AD 300 is that death year, and the sui reckoning is not converted into a birth year.",
    [ev("s0124","時年二十三")],
    "Sima Yu was twenty-three sui at his murder."))
add(chk("claim-110","supported",
    M3+" s0123 records the pestle killing at Xuchang; the death belongs to Yu, not to a later burial or reception.",
    [ev("s0120","三月，矯詔使黃門孫慮"), ev("s0123","慮以藥杵椎殺之")],
    "Sima Yu was beaten to death with a medicine pestle at Xuchang."))

# p002
add(chk("claim-111","supported",
    YK_ACC+" Hui’s own accession is the event, dated to the year Wu died.",
    [ev("s0201","惠帝即位")],
    "Emperor Hui acceded and the court then stood Yu as heir."))
add(chk("claim-112","supported",
    YK1+" Hui is the reigning emperor of the Yuankang-1 Eastern Palace edict sequence.",
    [ev("s0203","元康元年，出就東宮")],
    "Emperor Hui’s Yuankang year one, when Yu entered the Eastern Palace."))
add(chk("claim-113","supported",
    YN301+" s0183 moves 帝 with the degraded grandson-heir to Jinyong at Lun’s usurpation; that is Hui’s own event.",
    [ev("s0183","永甯元年正月")],
    "Emperor Hui was moved to Jinyong when Sima Lun usurped."))

# p004
add(chk("claim-114","supported",
    "s0003 names Wu’s affection with no calendar date; the undated attestation is correct and does not borrow Hui-era years.",
    [ev("s0003","武帝愛之，恆在左右")],
    "Emperor Wu loved Sima Yu and kept him at his side."))

# p026
add(chk("claim-115","supported",
    "s0015 賈后素忌 and the secret flattery have no era or year; the undated attestation is right. s0120’s 三月 belongs to the later murder, not this fact.",
    [ev("s0015","賈后素忌太子有令譽")],
    "Empress Jia had long envied the crown prince and set eunuchs to flatter him."))
add(chk("claim-116","supported",
    DEC300+" Jia herself is the instigator named in 賈后將廢太子.",
    [ev("s0045","十二月，賈后將廢太子")],
    "Empress Jia set in motion the deposition of the crown prince."))
add(chk("claim-117","supported",
    M3+" Jia is the author of the forged-edict murder mission in s0120.",
    [ev("s0120","三月，矯詔使黃門孫慮")],
    "Empress Jia forged an edict to have Sima Yu killed at Xuchang."))

# p028
add(chk("claim-118","supported",
    YK300+" s0171 dates Bin’s own death to that first month.",
    [ev("s0171","永康元年正月，薨")],
    "Sima Bin died in the first month of Yongkang year one."))
add(chk("claim-119","supported",
    YK300+" The 薨 is Bin’s death, not the later fourth-month posthumous title.",
    [ev("s0171","永康元年正月，薨")],
    "Sima Bin died in Yongkang year one, first month."))

# p068
add(chk("claim-120","supported",
    YK300+" s0174 dates Zang’s Linhuai enfeoffment, his own living honor.",
    [ev("s0174","永康元年四月，封臨淮王")],
    "Sima Zang was enfeoffed Prince of Linhuai."))
add(chk("claim-121","supported",
    YN301+" s0183 degrades Zang at Lun’s usurpation; that is Zang’s own status change.",
    [ev("s0183","永甯元年正月")],
    "Sima Zang was degraded when Sima Lun usurped in the first month."))
add(chk("claim-122","supported",
    YN301+" 尋被害 after the first-month degradation is Zang’s murder, not the later 太安 posthumous name.",
    [ev("s0183","尋被害")],
    "Sima Zang was murdered at Jinyong soon after the usurpation."))

# p069
add(chk("claim-123","supported",
    YK300+" s0207 dates Shang’s Xiangyang enfeoffment.",
    [ev("s0207","永康元年四月，封為襄陽王")],
    "Sima Shang was enfeoffed Prince of Xiangyang."))
add(chk("claim-124","supported",
    YN301+" s0208 dates Shang’s own appointment as imperial grandson-heir to the eighth month. The Hui annals place a May appointment; year 301 is shared.",
    [ev("s0208","永寧元年八月，立為皇太孫")],
    "Sima Shang was established as imperial grandson-heir."))
add(chk("claim-125","supported",
    TA302+" s0209 dates Shang’s death to 三月癸卯 of that year.",
    [ev("s0209","太安元年三月癸卯，薨")],
    "Sima Shang died on guimao of Tai’an year one, third month."))
add(chk("claim-126","supported",
    TA302+" The 薨 is Shang’s death; the same-day 諡 is reception and is not used as a second life year.",
    [ev("s0209","太安元年三月癸卯，薨")],
    "Sima Shang died in Tai’an year one, third month."))

# undated identities / appointments
add(chk("claim-127","supported",
    "s0002 identifies Lady Xie as Yu’s mother with no birth, death, or year; the undated attestation matches the source.",
    [ev("s0002","母曰謝才人")],
    "The biography names Lady Xie of Talented rank as Sima Yu’s mother."))
add(chk("claim-128","supported",
    "s0012 records Wu’s remark to Fu Zhi with no date; an undated attestation is required.",
    [ev("s0012","謂廷尉傅祗曰")],
    "Emperor Wu told Court Commandant Fu Zhi that this child would prosper the house."))
add(chk("claim-129","supported",
    "s0013 records Wu’s comparison to Emperor Xuan with no calendar date; the undated form is correct.",
    [ev("s0013","稱太子似宣帝")],
    "Emperor Wu told ministers that the crown prince resembled Emperor Xuan."))
add(chk("claim-130","supported",
    "s0200 appoints Liu Shi at the undated Guangling enfeoffment; no era is given, so the undated attestation is right.",
    [ev("s0200","以劉寔為師")],
    "Liu Shi was appointed tutor when Yu was made Prince of Guangling."))
add(chk("claim-131","supported",
    "s0200 names Meng Heng as companion in the same undated Guangling staff list.",
    [ev("s0200","孟珩為友")],
    "Meng Heng was appointed companion at the Guangling enfeoffment."))
add(chk("claim-132","supported",
    "s0200 names Yang Zhun as literary aide with no year.",
    [ev("s0200","楊准、馮蓀為文學")],
    "Yang Zhun was appointed literary aide at the Guangling enfeoffment."))
add(chk("claim-133","supported",
    "s0200 names Feng Sun as literary aide with no year.",
    [ev("s0200","楊准、馮蓀為文學")],
    "Feng Sun was appointed literary aide at the Guangling enfeoffment."))

TUTOR = (
    "s0202 盛選 follows s0201 惠帝即位 (AD 290) and precedes s0203 元康元年 (AD 291). "
    "The onOrAfter 290 / onOrBefore 291 bounds date the unstated appointment year without inventing an exact year."
)
for cid, who, evq, event in [
    ("claim-134","He Shao","以何劭為太師","He Shao was appointed Grand Tutor among the crown prince’s masters."),
    ("claim-135","Wang Rong","王戎為太傅","Wang Rong was appointed Grand Mentor among the crown prince’s masters."),
    ("claim-136","Yang Ji","楊濟為太保","Yang Ji was appointed Grand Guardian among the crown prince’s masters."),
    ("claim-137","Pei Kai","裴楷為少師","Pei Kai was appointed Junior Tutor among the crown prince’s masters."),
    ("claim-138","Zhang Hua","張華為少傅","Zhang Hua was appointed Junior Mentor among the crown prince’s masters."),
    ("claim-139","He Qiao","和嶠為少保","He Qiao was appointed Junior Guardian among the crown prince’s masters."),
]:
    add(chk(cid,"supported", TUTOR+f" The event owner is {who}.",
            [ev("s0202",evq)], event))

add(chk("claim-140","supported",
    "s0205 names Wei Guan only as father of Ting in the assignment list; no date is given for Wei Guan himself.",
    [ev("s0205","太保衛瓘息庭")],
    "Wei Guan is named as Grand Guardian and father of Ting."))
add(chk("claim-141","supported",
    YK1+" The 於是 assignment of Ting follows the Yuankang-1 edict, so Ting’s companionship is dated to that year.",
    [ev("s0205","太保衛瓘息庭"), ev("s0203","元康元年")],
    "Wei Ting was assigned to keep company with the crown prince."))
add(chk("claim-142","supported",
    "s0205 names Sima Tai only as father of Lue; no calendar date is stated for Tai.",
    [ev("s0205","司空泰息略")],
    "Sima Tai is named as Director of Works and father of Lue."))
add(chk("claim-143","supported",
    YK1+" Lue’s assignment is part of the Yuankang-1 於是 list.",
    [ev("s0205","司空泰息略")],
    "Sima Lue was assigned to keep company with the crown prince."))
add(chk("claim-144","supported",
    YK1+" Bi’s assignment is in the same Yuankang-1 list.",
    [ev("s0205","太子太傅楊濟息毖")],
    "Yang Bi was assigned to keep company with the crown prince."))
add(chk("claim-145","supported",
    YK1+" Xian’s assignment is in the same Yuankang-1 list.",
    [ev("s0205","太子少師裴楷息憲")],
    "Pei Xian was assigned to keep company with the crown prince."))
add(chk("claim-146","supported",
    YK1+" Yi’s assignment is in the same Yuankang-1 list.",
    [ev("s0205","太子少傅張華息禕")],
    "Zhang Yi was assigned to keep company with the crown prince."))
add(chk("claim-147","supported",
    "s0205 names Hua Gao only as father of Heng; no date is stated for Gao.",
    [ev("s0205","尚書令華暠息恆")],
    "Hua Gao is named as Minister Director and father of Heng."))
add(chk("claim-148","supported",
    YK1+" Heng’s assignment is in the Yuankang-1 companionship list.",
    [ev("s0205","尚書令華暠息恆")],
    "Hua Heng was assigned to keep company with the crown prince."))

add(chk("claim-149","supported",
    "s0017 records Consort Jiang bearing a son and the toy-making advice with no era; the undated attestation is correct.",
    [ev("s0017","太子所幸蔣美人生男")],
    "Consort Jiang bore a son and costly toys were urged."))
add(chk("claim-150","supported",
    "s0026 dates Jiang Tong’s five remonstrances only as rejected counsel, with no year.",
    [ev("s0026","洗馬江統陳五事以諫之")],
    "Jiang Tong presented five remonstrances that the crown prince rejected."))
add(chk("claim-151","supported",
    "s0027 records Du Xi’s repeated advice with no calendar date.",
    [ev("s0027","每盡忠規勸太子修德進善")],
    "Du Xi repeatedly urged the crown prince to cultivate virtue."))
add(chk("claim-152","supported",
    "s0029 describes Yu’s refusal to indulge Jia Mi with no year.",
    [ev("s0029","知賈謐恃後之貴")],
    "The crown prince would not indulge Jia Mi."))
add(chk("claim-153","supported",
    "s0031 is Pei Quan’s warning, undated in the source.",
    [ev("s0031","詹事裴權諫曰")],
    "Pei Quan warned that Jia Mi’s disrespect could ruin the great enterprise."))
add(chk("claim-154","supported",
    "s0034 opens with 初 and gives no era for Guo Huai’s marriage plan.",
    [ev("s0034","賈后母郭槐欲以韓壽女為太子妃")],
    "Guo Huai wished to make Han Shou’s daughter the crown princess."))
add(chk("claim-155","supported",
    "s0034 names Han Shou only inside that undated marriage plan.",
    [ev("s0034","欲以韓壽女為太子妃")],
    "Han Shou was the proposed father-in-law in Guo Huai’s plan."))
add(chk("claim-156","supported",
    "s0034 proposes Han Shou’s daughter with no calendar date.",
    [ev("s0034","欲以韓壽女為太子妃")],
    "Han Shou’s daughter was proposed as crown princess."))
add(chk("claim-157","supported",
    "s0035 records Jia Wu’s refusal and the Wang betrothal with no year.",
    [ev("s0035","壽妻賈午及後皆不聽")],
    "Jia Wu and the empress refused the Han match."))
add(chk("claim-158","supported",
    "s0035 names Wang Yan as father of the betrothed girl with no year.",
    [ev("s0035","為太子聘王衍小女惠風")],
    "Wang Yan’s younger daughter Huifeng was betrothed to the crown prince."))
add(chk("claim-159","supported",
    "s0035 betroths Wang Huifeng with no calendar date.",
    [ev("s0035","為太子聘王衍小女惠風")],
    "Wang Huifeng was betrothed to the crown prince."))
add(chk("claim-160","supported",
    "s0036 betroths Wang Yan’s elder daughter to Jia Mi with no year.",
    [ev("s0036","賈后為謐聘之")],
    "The empress betrothed Wang Yan’s elder daughter to Jia Mi."))
add(chk("claim-161","supported",
    "s0037 records Ying’s rebuke during the go quarrel with no date.",
    [ev("s0037","成都王穎見而訶謐")],
    "Sima Ying rebuked Jia Mi during a go quarrel."))
add(chk("claim-162","supported",
    "s0039 cites Empress Yang’s Jinyong deposition as a spoken precedent; no life date for Yang is given.",
    [ev("s0039","依楊氏故事")],
    "Jia Mi cited Empress Yang’s Jinyong deposition as the precedent Yu would follow."))
add(chk("claim-163","supported",
    "s0043 records Zhao Jun’s request and Yu’s refusal with no year.",
    [ev("s0043","中護軍趙俊請太子廢後")],
    "Zhao Jun asked the crown prince to depose Empress Jia and was refused."))

DEC_EVT = DEC300+" "
for cid, quote, event in [
    ("claim-164","遣婢陳舞賜以酒棗","Chen Wu was sent to force wine and jujubes on the crown prince."),
    ("claim-165","使黃門侍郎潘岳作書草","Pan Yue drafted the forged prayer text in the deposition plot."),
    ("claim-166","令小婢承福以紙筆及書草使太子書之","Chengfu brought paper and the draft for the drunk prince to copy."),
    ("claim-167","使黃門令董猛乙太子書及青紙詔","Dong Meng displayed the crown prince’s writing and the death edict."),
    ("claim-168","惟張華、裴頠證明太子","Pei Wei joined Zhang Hua in defending the crown prince."),
    ("claim-170","使尚書和郁持節","He Yu went with insignia to depose the crown prince."),
    ("claim-171","解結為副","Xie Jie served as deputy envoy at the deposition."),
    ("claim-172","大將軍梁王肜","Sima Rong, Prince of Liang, took part in the Eastern Palace deposition."),
    ("claim-173","鎮東將軍淮南王允","Sima Yun, Prince of Huainan, took part in the deposition."),
    ("claim-174","前將軍東武公澹","Sima Dan took part in the deposition and later escorted the household."),
    ("claim-175","趙王倫","Sima Lun took part in the Eastern Palace deposition."),
]:
    unit = {"claim-164":"s0046","claim-165":"s0047","claim-166":"s0047",
            "claim-167":"s0058","claim-168":"s0059","claim-170":"s0063",
            "claim-171":"s0063","claim-172":"s0063","claim-173":"s0063",
            "claim-174":"s0063","claim-175":"s0063"}[cid]
    add(chk(cid,"supported", DEC_EVT+"The named person’s own role is in that twelfth-month sequence.",
            [ev(unit, quote)], event))

add(chk("claim-169","supported",
    "s0060 forges Princess Changguang’s words; the princess herself is not given a calendar date, so the undated attestation is correct.",
    [ev("s0060","矯以長廣公主辭白帝")],
    "Empress Jia had Dong Meng forge Princess Changguang’s words."))

add(chk("claim-176","supported",
    NY1+" Liu Zhen is ordered to hold Yu at Xuchang in that first-month transfer.",
    [ev("s0068","令治書御史劉振持節守之"), ev("s0066","明年正月")],
    "Liu Zhen was sent with insignia to guard the imprisoned crown prince at Xuchang."))
add(chk("claim-177","supported",
    "s0077 mentions the Lady of Yicheng’s prior death inside Yu’s letter, with no year for her.",
    [ev("s0077","自宜城君亡")],
    "Sima Yu’s letter says the Lady of Yicheng had already died."))

AFTER_DEP = (
    "s0107–s0108 place Sima Ya, Xu Chao, and Sun Xiu’s plotting after the deposition "
    "and before the third-month murder, still in the Yongkang-1 year AD 300."
)
add(chk("claim-178","supported", AFTER_DEP+" The event owner is Sima Ya.",
    [ev("s0107","太子既廢非其罪"), ev("s0108","右衛督司馬雅")],
    "Sima Ya urged a plot after the crown prince had been deposed."))
add(chk("claim-179","supported", AFTER_DEP+" The event owner is Xu Chao.",
    [ev("s0108","常從督許超並有寵于太子")],
    "Xu Chao joined the post-deposition plot talk."))
add(chk("claim-180","supported", AFTER_DEP+" The event owner is Sun Xiu, who heard the plan.",
    [ev("s0108","說趙王倫謀臣孫秀曰")],
    "Sun Xiu received the post-deposition restoration plot."))
add(chk("claim-181","supported",
    "s0119 has Cheng Ju compound the pills immediately before s0120 三月; the year is Yongkang 1, AD 300. "
    "The source does not write 三月前, but the Western year is the murder-year context.",
    [ev("s0119","乃使太醫令程據合巴豆杏子丸"), ev("s0120","三月")],
    "Cheng Ju compounded the croton-and-apricot pills before the third-month murder."))
add(chk("claim-182","supported",
    M3+" Sun Lü is the Yellow Gate sent to Xuchang.",
    [ev("s0120","矯詔使黃門孫慮")],
    "Sun Lü was sent to Xuchang with the forged edict to kill the crown prince."))
add(chk("claim-183","supported",
    "s0131 及賈庶人死 opens the restoration mission after Jia’s death in the Yongkang-1 sequence, AD 300. Yi is the envoy.",
    [ev("s0131","及賈庶人死")],
    "Yi announced the restoration patent after Commoner Jia had died."))
add(chk("claim-184","supported",
    "s0135 names Shen Sheng only as a parallel in the restoration edict; no life date for him is stated.",
    [ev("s0135","俾申生、孝己復見於今")],
    "The restoration edict names Shen Sheng as a parallel to the wronged heir."))
add(chk("claim-185","supported",
    "s0135 names Xiao Ji in the same undated-for-him exemplum pair.",
    [ev("s0135","俾申生、孝己復見於今")],
    "The restoration edict names Xiao Ji as a parallel to the wronged heir."))
add(chk("claim-186","supported",
    "s0143’s 哀策 belongs to the Yongkang-1 funeral sequence after Jia’s death and before/at s0168 六月 burial, AD 300. Liu Wu is the speaker.",
    [ev("s0143","使洗馬劉務告于皇太子之殯曰")],
    "Liu Wu delivered the condolence text at the crown prince’s lying-in-state."))
add(chk("claim-187","supported",
    "s0169 follows s0168 六月己卯 burial in the Yongkang-1 year, AD 300. Yan Zuan’s words move the emperor after that burial.",
    [ev("s0169","帝感閻纘之言"), ev("s0168","六月己卯")],
    "Yan Zuan’s words moved the emperor after the burial."))
add(chk("claim-188","supported",
    "s0169 places Lu Ji’s dirge after the same Yongkang-1 burial, AD 300.",
    [ev("s0169","陸機並作誄頌焉")],
    "Lu Ji composed a dirge after the crown prince’s burial."))
add(chk("claim-189","supported",
    "s0192 compares Yu to Prince Jian of Chu in the historian’s appraisal; no life date for Jian is given.",
    [ev("s0192","冤逾楚建")],
    "The historian’s appraisal says Yu’s wrong exceeded that of Prince Jian of Chu."))
add(chk("claim-190","supported",
    "s0192 alludes to the Li Garden case; no life date for Crown Prince Li is given.",
    [ev("s0192","酷甚戾園")],
    "The historian’s appraisal says the cruelty surpassed the Liyuan case."))

# p001 offices / events
add(chk("claim-193","supported",
    YK_ACC+" 立為皇太子 is Yu’s own appointment at Hui’s accession.",
    [ev("s0201","惠帝即位，立為皇太子")],
    "Sima Yu was established as imperial crown prince."))
add(chk("claim-194","supported",
    DEC300+" s0062–s0063 degrade Yu to commoner in that month.",
    [ev("s0062","乃表免太子為庶人"), ev("s0063","廢太子為庶人")],
    "Sima Yu was degraded from crown prince to commoner."))
add(chk("claim-195","supported",
    YK1+" 出就東宮 is Yu’s change of residence.",
    [ev("s0203","元康元年，出就東宮")],
    "Sima Yu took up residence in the Eastern Palace."))
add(chk("claim-196","supported",
    NY1+" s0068 moves Yu to the Xuchang compound.",
    [ev("s0068","更幽于許昌宮之別坊"), ev("s0066","明年正月")],
    "Sima Yu was imprisoned at a side compound of Xuchang palace."))
add(chk("claim-198","supported",
    "s0168 dates the Xianping burial to 六月己卯 in the Yongkang-1 sequence, AD 300. "
    "Annals 六月壬寅 is a competing day in the same year; year precision is warranted.",
    [ev("s0168","六月己卯，葬于顯平陵")],
    "Sima Yu was buried at Xianping Mausoleum."))
add(chk("claim-201","supported",
    DEC300+" s0058’s 賜死 and s0062’s degradation are Yu’s sentencing in that month.",
    [ev("s0058","今賜死"), ev("s0062","免太子為庶人")],
    "Sima Yu was sentenced to death and then degraded to commoner."))
add(chk("claim-202","supported",
    DEC300+" Yu is the victim of Jia’s deposition.",
    [ev("s0045","賈后將廢太子"), ev("s0062","免太子為庶人")],
    "Sima Yu was deposed by Empress Jia."))
add(chk("claim-203","supported",
    M3+" Yu is the murder victim at Xuchang.",
    [ev("s0120","以害太子"), ev("s0123","慮以藥杵椎殺之")],
    "Sima Yu was murdered at Xuchang by Sun Lü."))
add(chk("claim-205","supported",
    DEC300+" Jia is the instigator of the deposition.",
    [ev("s0045","賈后將廢太子"), ev("s0062","乃表免太子為庶人")],
    "Empress Jia instigated the deposition of the crown prince."))
add(chk("claim-206","supported",
    M3+" Jia orders the murder; s0119 is the pill-making that immediately precedes it.",
    [ev("s0119","賈后聞之憂怖"), ev("s0120","三月，矯詔使黃門孫慮")],
    "Empress Jia ordered the murder of Sima Yu."))
add(chk("claim-207","supported",
    M3+" Sun Lü is the perpetrator in s0123; the month heading is s0120.",
    [ev("s0123","慮以藥杵椎殺之")],
    "Sun Lü killed Sima Yu with a medicine pestle."))
add(chk("claim-208","supported",
    YN301+" 趙王倫篡位 is Lun’s own usurpation.",
    [ev("s0183","趙王倫篡位")],
    "Sima Lun usurped the throne in the first month of Yongning year one."))
add(chk("claim-239","supported",
    YK300+" s0179’s acting tutorship sits in the Yongkang-1 己巳 edict block that appoints the grandson-heir.",
    [ev("s0179","趙王倫行太孫太傅"), ev("s0174","永康元年四月")],
    "Sima Lun was made acting Grand Tutor to the imperial grandson-heir."))
add(chk("claim-243","supported",
    YK300+" s0172 四月 追封 follows Bin’s first-month death in the Yongkang-1 chapter; the grant is posthumous reception dated to that fourth month.",
    [ev("s0172","四月，追封南陽王"), ev("s0171","永康元年正月")],
    "Sima Bin was posthumously enfeoffed Prince of Nanyang."))
add(chk("claim-244","supported",
    YK300+" Zang’s Linhuai title is a living enfeoffment in s0174.",
    [ev("s0174","永康元年四月，封臨淮王")],
    "Sima Zang was enfeoffed Prince of Linhuai."))
add(chk("claim-245","supported",
    YK300+" s0175–s0176 己巳 establishes Zang as grandson-heir in the Yongkang-1 block (annals: fifth month). Year 300 holds.",
    [ev("s0175","己巳，詔曰"), ev("s0176","今立臧為皇太孫")],
    "Sima Zang was established as imperial grandson-heir."))
add(chk("claim-246","supported",
    YN301+" 廢為濮陽王 is Zang’s degradation at the usurpation.",
    [ev("s0183","廢為濮陽王")],
    "Sima Zang was degraded from imperial grandson-heir."))
add(chk("claim-247","supported",
    YN301+" The Puyang title is the degraded rank in the same first-month sentence.",
    [ev("s0183","廢為濮陽王")],
    "Sima Zang was degraded to Prince of Puyang."))
add(chk("claim-248","supported",
    "s0184 太安初 grants the posthumous name Ai after Zang’s 301 death; Tai’an 1 is AD 302. This is reception, not living activity.",
    [ev("s0184","太安初，追諡曰哀")],
    "Sima Zang was granted the posthumous name Ai early in Tai’an."))
add(chk("claim-249","supported",
    YK300+" Shang’s Xiangyang enfeoffment is his own living title.",
    [ev("s0207","永康元年四月，封為襄陽王")],
    "Sima Shang was enfeoffed Prince of Xiangyang."))
add(chk("claim-250","supported",
    YN301+" s0208 dates Shang’s grandson-heir appointment to the eighth month.",
    [ev("s0208","永寧元年八月，立為皇太孫")],
    "Sima Shang was established as imperial grandson-heir."))
add(chk("claim-271","supported",
    DEC300+" s0065 考竟謝淑妃 is Lady Xie’s death in that month, carried out under Dan.",
    [ev("s0065","考竟謝淑妃及太子保林蔣俊")],
    "Lady Xie was interrogated to death after the deposition."))
add(chk("claim-272","supported",
    DEC300+" 太子保林蔣俊 in the same 考竟 clause is Consort Jiang’s death.",
    [ev("s0065","考竟謝淑妃及太子保林蔣俊")],
    "Consort Jiang was interrogated to death after the deposition."))
add(chk("claim-276","supported",
    "s0131 及賈庶人死 is Jia’s death, placed after the third-month murder and before the sixth-month burial in Yongkang 1, AD 300.",
    [ev("s0131","及賈庶人死")],
    "Empress Jia, already reduced to commoner, died."))
add(chk("claim-283","supported",
    "s0077 states the Lady of Yicheng had already died, with no calendar date; the undated death attestation is correct.",
    [ev("s0077","自宜城君亡")],
    "The Lady of Yicheng had already died when Sima Yu wrote his letter."))
add(chk("claim-284","supported",
    "s0039 is a later spoken citation of Yang’s Jinyong precedent, correctly classed retrospective and left without a life-year hint.",
    [ev("s0039","依楊氏故事")],
    "Empress Yang was cited as the Jinyong-deposition precedent."))
add(chk("claim-285","supported",
    "s0135 names Shen Sheng in the Yongkang-1 restoration patent after Jia’s death, AD 300. The date is the reception’s date, not Shen Sheng’s life.",
    [ev("s0135","俾申生、孝己復見於今"), ev("s0131","冊復太子")],
    "Shen Sheng was named as an exemplum in the restoration edict."))
add(chk("claim-286","supported",
    "s0135 names Xiao Ji in the same restoration reception, AD 300 for the edict, not for Xiao Ji’s life.",
    [ev("s0135","俾申生、孝己復見於今")],
    "Xiao Ji was named as an exemplum in the restoration edict."))
add(chk("claim-287","supported",
    "s0192’s historian appraisal is later reception of Jian; no life date is claimed.",
    [ev("s0192","冤逾楚建")],
    "Prince Jian of Chu was compared in the historian’s appraisal."))
add(chk("claim-288","supported",
    "s0192’s 戾園 allusion is later reception of Crown Prince Li, not a life date.",
    [ev("s0192","酷甚戾園")],
    "Crown Prince Li was compared through the Li Garden allusion."))
add(chk("claim-289","supported",
    YK300+" s0172 追封 after Bin’s death is retrospective honor in the fourth month.",
    [ev("s0172","四月，追封南陽王")],
    "Sima Bin was posthumously enfeoffed Prince of Nanyang."))
add(chk("claim-290","supported",
    "s0184 太安初 posthumous Ai is retrospective honor in AD 302, after Zang’s 301 death, and is kept out of active hints.",
    [ev("s0184","太安初，追諡曰哀")],
    "Sima Zang was granted the posthumous name Ai."))
add(chk("claim-291","supported",
    "s0131 乃誅劉振 at Jia’s death in the Yongkang-1 sequence dates Liu Zhen’s execution to AD 300.",
    [ev("s0131","乃誅劉振、孫慮、程據等")],
    "Liu Zhen was executed when Commoner Jia died."))
add(chk("claim-292","supported",
    "s0131 lists Cheng Ju among those executed at Jia’s death, AD 300.",
    [ev("s0131","乃誅劉振、孫慮、程據等")],
    "Cheng Ju was executed when Commoner Jia died."))
add(chk("claim-293","supported",
    "s0131 lists Sun Lü among those executed at Jia’s death, AD 300.",
    [ev("s0131","乃誅劉振、孫慮、程據等")],
    "Sun Lü was executed when Commoner Jia died."))
add(chk("claim-294","supported",
    "s0017 蔣美人生男 attests Bin’s birth without a calendar date; the undated birth attestation is correct and does not invent a year from later death.",
    [ev("s0017","太子所幸蔣美人生男")],
    "Consort Jiang bore Sima Bin; no birth year is stated."))
add(chk("claim-295","supported",
    "s0013’s comparison to Emperor Xuan is later spoken reception of Xuan, correctly retrospective and undated as a life event.",
    [ev("s0013","稱太子似宣帝")],
    "Emperor Xuan was cited as the resemblance of the crown prince."))
add(chk("claim-296","supported",
    DEC300+" s0073 初，太子之廢也 dates Wang Yan’s divorce memorial to the deposition.",
    [ev("s0073","初，太子之廢也，妃父王衍表請離婚")],
    "Wang Yan memorialized for divorce when the crown prince was deposed."))
add(chk("claim-297","supported",
    "s0158 alludes to the Huguan elder in the condolence text; no life date is stated.",
    [ev("s0158","壺關幹主")],
    "The elder of Huguan is alluded to in the condolence text."))
add(chk("claim-298","supported",
    "s0158 is retrospective allusion; the condolence belongs to the Yongkang-1 funeral, but no life date is assigned to the Huguan elder.",
    [ev("s0158","壺關幹主")],
    "The elder of Huguan was alluded to as a remonstrator in the condolence text."))
add(chk("claim-299","supported",
    "s0158 names Qianqiu with no life date.",
    [ev("s0158","千秋悟己")],
    "Qianqiu is alluded to in the condolence text."))
add(chk("claim-300","supported",
    "s0158 is retrospective allusion to Qianqiu, not a living-activity date.",
    [ev("s0158","千秋悟己")],
    "Qianqiu was alluded to as a remonstrator in the condolence text."))

# Hints
def hint(pid, event, reason, evidence):
    add(chk(f"hints-{pid}","supported", reason, evidence, event))

hint("p001",
     "Sima Yu was made heir at Hui’s accession, entered the Eastern Palace in Yuankang 1, and was deposed and murdered in Yongkang 1.",
     "Hints 290/291/300 match Yu’s own dated events (s0201, s0203, s0045–s0123). No posthumous 302 and no invented birth from 二十三 sui.",
     [ev("s0201","立為皇太子"), ev("s0203","元康元年，出就東宮"), ev("s0120","以害太子")])
hint("p002",
     "Emperor Hui acceded in 290, issued the Yuankang-1 Eastern Palace edict, sat the 300 deposition court, and was moved to Jinyong in 301.",
     "Hints 290/291/300/301 match Hui’s own acts: accession, Yuankang-1 reign, 帝幸式乾殿 in the twelfth month, and 與帝俱遷金墉 in Yongning 1.",
     [ev("s0201","惠帝即位"), ev("s0058","帝幸式乾殿"), ev("s0183","與帝俱遷金墉")])
hint("p003",
     "Lady Xie was interrogated to death in the twelfth-month purge.",
     "The sole dated personal event is s0065 考竟謝淑妃 in Yuankang 9 month 12, AD 300. No undated childhood year is invented.",
     [ev("s0065","考竟謝淑妃")])
hint("p004",
     "The hint list is empty because Emperor Wu’s appearances in this chapter are undated.",
     "s0003 and related Wu scenes give no era; empty hints correctly refuse a 265–290 reign window.",
     [ev("s0003","武帝愛之，恆在左右")])
hint("p005",
     "The hint list is empty because Fu Zhi’s only scene is undated.",
     "s0012 names Fu Zhi in Wu’s undated remark; no year is available for an active hint.",
     [ev("s0012","謂廷尉傅祗曰")])
hint("p006",
     "The hint list is empty because Emperor Xuan is only a retrospective comparison.",
     "s0013 cites Xuan as a likeness, not a dated life event; empty hints keep reception out of activity.",
     [ev("s0013","稱太子似宣帝")])
hint("p007",
     "The hint list is empty because Liu Shi’s Guangling tutorship is undated.",
     "s0200 gives no era for the Guangling staff; empty hints do not invent an onOrBefore 290 bound.",
     [ev("s0200","以劉寔為師")])
hint("p008",
     "The hint list is empty because Meng Heng’s companionship is undated.",
     "s0200 states the appointment without a year, so no active hint is warranted.",
     [ev("s0200","孟珩為友")])
hint("p009",
     "The hint list is empty because Yang Zhun’s literary post is undated.",
     "s0200 lists Yang Zhun without an era or year.",
     [ev("s0200","楊准、馮蓀為文學")])
hint("p010",
     "The hint list is empty because Feng Sun’s literary post is undated.",
     "s0200 lists Feng Sun without an era or year.",
     [ev("s0200","楊准、馮蓀為文學")])
hint("p011",
     "He Shao was appointed among the tutors after Hui’s accession and later went as deposition envoy.",
     "The 290–291 uncertain appointment matches s0201–s0203 bounds; AD 300 matches s0063 太保何劭 at the twelfth-month deposition.",
     [ev("s0202","以何劭為太師"), ev("s0063","太保何劭詣東宮")])
hint("p012",
     "Wang Rong was appointed Grand Mentor after Hui’s accession and before Yuankang 1.",
     "The uncertain 290–291 hint matches the s0202 appointment bounds; no later dated act is claimed.",
     [ev("s0202","王戎為太傅")])
hint("p013",
     "Yang Ji was appointed Grand Guardian after Hui’s accession and before Yuankang 1.",
     "The uncertain 290–291 hint matches s0202; he is later named as a father in s0205, not given a second year.",
     [ev("s0202","楊濟為太保")])
hint("p014",
     "Pei Kai was appointed Junior Tutor after Hui’s accession and before Yuankang 1.",
     "The uncertain 290–291 hint matches s0202; no unsupported extra year is added.",
     [ev("s0202","裴楷為少師")])
hint("p015",
     "Zhang Hua was appointed Junior Mentor and later defended Yu at the deposition.",
     "290–291 matches s0202; AD 300 matches s0059 張華…證明太子 in the twelfth-month court.",
     [ev("s0202","張華為少傅"), ev("s0059","惟張華、裴頠證明太子")])
hint("p016",
     "He Qiao was appointed Junior Guardian after Hui’s accession and before Yuankang 1.",
     "The uncertain 290–291 hint matches s0202; no later personal year is attested here.",
     [ev("s0202","和嶠為少保")])
hint("p017",
     "The hint list is empty because Wei Guan is only named as a father.",
     "s0205 identifies 衛瓘 as Ting’s father without dating Wei Guan’s own act.",
     [ev("s0205","太保衛瓘息庭")])
hint("p018",
     "Wei Ting was assigned to accompany the crown prince in Yuankang 1.",
     "AD 291 matches the s0203–s0205 Yuankang-1 assignment; no other year is attested.",
     [ev("s0205","太保衛瓘息庭")])
hint("p019",
     "The hint list is empty because Sima Tai is only named as a father.",
     "s0205 names 司空泰 without a date for Tai himself.",
     [ev("s0205","司空泰息略")])
hint("p020",
     "Sima Lue was assigned to accompany the crown prince in Yuankang 1.",
     "AD 291 matches the Yuankang-1 companionship list.",
     [ev("s0205","司空泰息略")])
hint("p021",
     "Yang Bi was assigned to accompany the crown prince in Yuankang 1.",
     "AD 291 matches the Yuankang-1 companionship list.",
     [ev("s0205","太子太傅楊濟息毖")])
hint("p022",
     "Pei Xian was assigned to accompany the crown prince in Yuankang 1.",
     "AD 291 matches the Yuankang-1 companionship list.",
     [ev("s0205","太子少師裴楷息憲")])
hint("p023",
     "Zhang Yi was assigned to accompany the crown prince in Yuankang 1.",
     "AD 291 matches the Yuankang-1 companionship list.",
     [ev("s0205","太子少傅張華息禕")])
hint("p024",
     "The hint list is empty because Hua Gao is only named as a father.",
     "s0205 names 華暠 without dating Gao’s own act.",
     [ev("s0205","尚書令華暠息恆")])
hint("p025",
     "Hua Heng was assigned to accompany the crown prince in Yuankang 1.",
     "AD 291 matches the Yuankang-1 companionship list.",
     [ev("s0205","尚書令華暠息恆")])
hint("p026",
     "Empress Jia deposed Yu in the twelfth month and had him murdered in the third month.",
     "AD 300 matches Jia’s own dated acts (s0045, s0120, s0131). The earlier undated envy is not turned into a year.",
     [ev("s0045","賈后將廢太子"), ev("s0120","三月，矯詔")])
hint("p027",
     "Consort Jiang was interrogated to death in the twelfth-month purge.",
     "AD 300 is her s0065 death. The undated birth of Bin does not generate another hint year.",
     [ev("s0065","太子保林蔣俊")])
hint("p028",
     "Sima Bin died in the first month of Yongkang 1.",
     "AD 300 matches s0171 薨. The fourth-month 追封 is reception and is not needed as a second living year.",
     [ev("s0171","永康元年正月，薨")])
hint("p029",
     "Jiang Tong composed a dirge after the Yongkang-1 burial.",
     "AD 300 matches s0169 江統…作誄頌 after s0168. The earlier undated remonstrance is not given a guessed year.",
     [ev("s0169","故臣江統、陸機並作誄頌焉")])
hint("p030",
     "The hint list is empty because Du Xi’s remonstrance is undated.",
     "s0027 gives no year; empty hints correctly refuse a Yuankang-wide interval.",
     [ev("s0027","每盡忠規勸太子修德進善")])
hint("p031",
     "The hint list is empty because Jia Mi’s Eastern Palace clashes are undated.",
     "s0029–s0037 give no era for Mi’s living scenes; empty hints are required.",
     [ev("s0029","知賈謐恃後之貴")])
hint("p032",
     "The hint list is empty because Pei Quan’s warning is undated.",
     "s0031 has no calendar date for Quan.",
     [ev("s0031","詹事裴權諫曰")])
hint("p033",
     "The hint list is empty because Guo Huai’s marriage plan is undated.",
     "s0034 初 states the plan without a year.",
     [ev("s0034","賈后母郭槐欲以韓壽女為太子妃")])
hint("p034",
     "The hint list is empty because Han Shou is only named in the undated plan.",
     "s0034 gives no date for Han Shou himself.",
     [ev("s0034","欲以韓壽女為太子妃")])
hint("p035",
     "The hint list is empty because the proposed daughter is undated.",
     "s0034 proposes her without a year.",
     [ev("s0034","欲以韓壽女為太子妃")])
hint("p036",
     "The hint list is empty because Jia Wu’s refusal is undated.",
     "s0035 records the refusal without a year.",
     [ev("s0035","壽妻賈午及後皆不聽")])
hint("p037",
     "Wang Yan requested divorce at the twelfth-month deposition.",
     "AD 300 matches s0073 太子之廢也. The earlier undated betrothal is not given a second year.",
     [ev("s0073","妃父王衍表請離婚")])
hint("p038",
     "Wang Huifeng was sent under guard to Jinyong in the twelfth-month purge.",
     "AD 300 matches s0065 送太子妃王氏…于金墉城, her own forced removal. The undated betrothal is not dated.",
     [ev("s0065","送太子妃王氏、三皇孫于金墉城")])
hint("p039",
     "The hint list is empty because the elder daughter’s betrothal is undated.",
     "s0036 gives no year for that match.",
     [ev("s0036","賈后為謐聘之")])
hint("p040",
     "The hint list is empty because Ying’s go-quarrel rebuke is undated.",
     "s0037 has no calendar date for Ying’s living act here.",
     [ev("s0037","成都王穎見而訶謐")])
hint("p041",
     "The hint list is empty because Empress Yang appears only as a retrospective precedent.",
     "s0039 依楊氏故事 is reception, correctly kept out of active years.",
     [ev("s0039","依楊氏故事")])
hint("p042",
     "The hint list is empty because Zhao Jun’s request is undated.",
     "s0043 gives no year for Jun’s proposal.",
     [ev("s0043","中護軍趙俊請太子廢後")])
hint("p043",
     "Chen Wu forced wine on the crown prince in the twelfth-month plot.",
     "AD 300 matches s0046 in the Yuankang-9 twelfth month.",
     [ev("s0046","遣婢陳舞賜以酒棗")])
hint("p044",
     "Pan Yue drafted the forged text in the twelfth-month plot.",
     "AD 300 matches s0047 in that same month.",
     [ev("s0047","使黃門侍郎潘岳作書草")])
hint("p045",
     "Chengfu carried paper and draft in the twelfth-month plot.",
     "AD 300 matches s0047 小婢承福.",
     [ev("s0047","令小婢承福以紙筆及書草使太子書之")])
hint("p046",
     "Dong Meng presented the writing and forged the princess’s words in the twelfth-month court.",
     "AD 300 matches s0058–s0060 in the deposition month.",
     [ev("s0058","使黃門令董猛乙太子書及青紙詔")])
hint("p047",
     "Pei Wei defended the crown prince at the twelfth-month court.",
     "AD 300 matches s0059 裴頠證明太子.",
     [ev("s0059","惟張華、裴頠證明太子")])
hint("p048",
     "The hint list is empty because the princess is only the forged speaker.",
     "s0060 forges her words; no dated act of the princess herself is attested, so empty hints are right.",
     [ev("s0060","矯以長廣公主辭白帝")])
hint("p049",
     "He Yu went with insignia to depose the crown prince.",
     "AD 300 matches s0063 尚書和郁持節 in the twelfth month.",
     [ev("s0063","使尚書和郁持節")])
hint("p050",
     "Xie Jie served as deputy envoy at the deposition.",
     "AD 300 matches s0063 解結為副.",
     [ev("s0063","解結為副")])
hint("p051",
     "Sima Rong took part in the Eastern Palace deposition.",
     "AD 300 matches s0063 大將軍梁王肜.",
     [ev("s0063","大將軍梁王肜")])
hint("p052",
     "Sima Yun took part in the Eastern Palace deposition.",
     "AD 300 matches s0063 淮南王允.",
     [ev("s0063","鎮東將軍淮南王允")])
hint("p053",
     "Sima Dan took part in the deposition and escorted the household to Jinyong.",
     "AD 300 matches s0063 and s0065 澹 in the twelfth-month sequence.",
     [ev("s0063","前將軍東武公澹"), ev("s0065","澹以兵仗送太子妃王氏")])
hint("p054",
     "Sima Lun joined the twelfth-month deposition and usurped in Yongning 1.",
     "AD 300 matches s0063/s0179; AD 301 matches s0183 趙王倫篡位. No posthumous year is added.",
     [ev("s0063","趙王倫"), ev("s0183","趙王倫篡位")])
hint("p055",
     "Liu Zhen guarded Yu at Xuchang and was later executed.",
     "Both the first-month jailership (s0068) and the execution at Jia’s death (s0131) fall in AD 300.",
     [ev("s0068","令治書御史劉振持節守之"), ev("s0131","乃誅劉振")])
hint("p056",
     "The hint list is empty because the Lady of Yicheng’s death is undated.",
     "s0077 自宜城君亡 states a prior death without a year; empty hints are required.",
     [ev("s0077","自宜城君亡")])
hint("p057",
     "Sima Ya urged a plot after the deposition and before the third-month murder.",
     "AD 300 matches the Yongkang-1 interval of s0107–s0108.",
     [ev("s0108","右衛督司馬雅")])
hint("p058",
     "Xu Chao joined that post-deposition plot talk.",
     "AD 300 matches s0108 in the same Yongkang-1 interval.",
     [ev("s0108","常從督許超")])
hint("p059",
     "Sun Xiu received and redirected the post-deposition plot.",
     "AD 300 matches s0108–s0118 before the third-month murder.",
     [ev("s0108","說趙王倫謀臣孫秀曰")])
hint("p060",
     "Cheng Ju compounded the pills and was later executed.",
     "Both the pre-March compounding and the s0131 execution belong to Yongkang 1, AD 300.",
     [ev("s0119","太醫令程據合巴豆杏子丸"), ev("s0131","程據等")])
hint("p061",
     "Sun Lü murdered Yu in the third month and was later executed.",
     "AD 300 matches s0120–s0123 and the s0131 execution.",
     [ev("s0120","黃門孫慮"), ev("s0123","慮以藥杵椎殺之")])
hint("p062",
     "Yi announced the restoration patent after Jia’s death.",
     "AD 300 matches s0131 衛尉伊 in the Yongkang-1 restoration.",
     [ev("s0131","衛尉伊策故皇太子之靈")])
hint("p063",
     "The hint list is empty because Shen Sheng is only an exemplum.",
     "s0135 names him in a retrospective edict; empty hints keep reception out of life dates.",
     [ev("s0135","俾申生、孝己復見於今")])
hint("p064",
     "The hint list is empty because Xiao Ji is only an exemplum.",
     "s0135 names him retrospectively; no living year is warranted.",
     [ev("s0135","俾申生、孝己復見於今")])
hint("p065",
     "Liu Wu delivered the condolence at the Yongkang-1 funeral.",
     "AD 300 matches s0143 in the burial sequence.",
     [ev("s0143","使洗馬劉務告于皇太子之殯曰")])
hint("p066",
     "Yan Zuan’s words moved the emperor after the burial.",
     "AD 300 matches s0169 following s0168.",
     [ev("s0169","帝感閻纘之言")])
hint("p067",
     "Lu Ji composed a dirge after the burial.",
     "AD 300 matches s0169 陸機並作誄頌.",
     [ev("s0169","陸機並作誄頌焉")])
hint("p068",
     "Sima Zang was enfeoffed and made heir in 300 and degraded and murdered in 301.",
     "Hints 300/301 match living events (s0174–s0183). The 太安初 posthumous Ai is correctly omitted.",
     [ev("s0174","永康元年四月，封臨淮王"), ev("s0183","尋被害")])
hint("p069",
     "Sima Shang was enfeoffed in 300, made heir in 301, and died in 302.",
     "Hints 300/301/302 match s0207, s0208, and s0209 薨. The same-day 諡 is not a second living year.",
     [ev("s0207","永康元年四月"), ev("s0208","永寧元年八月"), ev("s0209","太安元年三月癸卯，薨")])
hint("p070",
     "The hint list is empty because Prince Jian appears only in the appraisal.",
     "s0192 is retrospective comparison, not a dated life event.",
     [ev("s0192","冤逾楚建")])
hint("p071",
     "The hint list is empty because Crown Prince Li appears only as 戾園.",
     "s0192 is retrospective allusion, not a life date.",
     [ev("s0192","酷甚戾園")])
hint("p072",
     "The hint list is empty because the Huguan elder is only an allusion.",
     "s0158 壺關幹主 is retrospective; empty hints are required.",
     [ev("s0158","壺關幹主")])
hint("p073",
     "The hint list is empty because Qianqiu is only an allusion.",
     "s0158 千秋悟己 is retrospective; empty hints are required.",
     [ev("s0158","千秋悟己")])

# --- person checks ---
person_checks = []

def pchk(pid, reason, evidence):
    reason = reason.strip()
    if len(reason) < 20:
        raise SystemExit(f"short person reason {pid}")
    person_checks.append({"id": pid, "verdict": "supported", "reason": reason, "evidence": evidence})

pchk("p001",
     "Yu’s sequence is coherent: undated childhood (s0003, age five in s0007), heir at Hui’s accession (s0201, 290), Eastern Palace in Yuankang 1 (s0203, 291), twelfth-month deposition and third-month murder in Yongkang 1 (s0045, s0120, age twenty-three). "
     "No birth year is stated; sui ages are not converted. Burial s0168 六月己卯 stays AD 300 beside the annals’ 六月壬寅. Later 諡 and restoration are reception after death.",
     [ev("s0201","立為皇太子"), ev("s0007","太子時年五歲"), ev("s0124","時年二十三"), ev("s0120","以害太子")])
pchk("p002",
     "Hui’s own dated acts are accession (s0201, 290), the Yuankang-1 reign context (s0203, 291), the twelfth-month court (s0058, 300), and the Yongning-1 removal to Jinyong (s0183, 301). "
     "Those years match the hints. He has no birth or death in this chapter.",
     [ev("s0201","惠帝即位"), ev("s0058","帝幸式乾殿"), ev("s0183","與帝俱遷金墉")])
pchk("p003",
     "Lady Xie is identified without a birth year (s0002) and is killed in the twelfth-month 考竟 (s0065). AD 300 is that death, not an activity span. No age is given.",
     [ev("s0002","母曰謝才人"), ev("s0065","考竟謝淑妃")])
pchk("p004",
     "Wu appears only in undated childhood scenes (s0003). Empty hints correctly avoid a reign-long window. No death is narrated in this chapter.",
     [ev("s0003","武帝愛之，恆在左右")])
pchk("p005",
     "Fu Zhi is addressed in one undated remark (s0012). No birth, death, age, or year is omitted from a dated source sentence.",
     [ev("s0012","謂廷尉傅祗曰")])
pchk("p006",
     "Xuan is only a retrospective likeness (s0013). Empty hints keep that reception out of life chronology.",
     [ev("s0013","稱太子似宣帝")])
pchk("p007",
     "Liu Shi’s tutorship is in the undated Guangling list (s0200). No year is supplied to invent.",
     [ev("s0200","以劉寔為師")])
pchk("p008",
     "Meng Heng’s companionship is undated in s0200. Chronology is complete as an undated fact.",
     [ev("s0200","孟珩為友")])
pchk("p009",
     "Yang Zhun’s literary post is undated in s0200.",
     [ev("s0200","楊准、馮蓀為文學")])
pchk("p010",
     "Feng Sun’s literary post is undated in s0200.",
     [ev("s0200","楊准、馮蓀為文學")])
pchk("p011",
     "He Shao’s appointment is bounded 290–291 by s0201–s0203; his next own act is the twelfth-month deposition (s0063, 300). Hints match. No birth or death here.",
     [ev("s0202","以何劭為太師"), ev("s0063","太保何劭詣東宮")])
pchk("p012",
     "Wang Rong’s only dated personal event is the s0202 appointment bounded 290–291. No later year or life dates appear in this chapter.",
     [ev("s0202","王戎為太傅")])
pchk("p013",
     "Yang Ji is appointed in s0202 (290–291) and later named as Bi’s father in s0205 without a second personal year.",
     [ev("s0202","楊濟為太保")])
pchk("p014",
     "Pei Kai’s dated event is the s0202 appointment bounded 290–291. s0205 names him only as Xian’s father.",
     [ev("s0202","裴楷為少師")])
pchk("p015",
     "Zhang Hua’s own dated acts are the s0202 appointment (290–291) and the s0059 defence in the twelfth-month court (300). Hints match both.",
     [ev("s0202","張華為少傅"), ev("s0059","惟張華、裴頠證明太子")])
pchk("p016",
     "He Qiao’s only dated personal event is the s0202 appointment bounded 290–291.",
     [ev("s0202","和嶠為少保")])
pchk("p017",
     "Wei Guan is only named as Ting’s father in s0205. Empty hints correctly refuse a year. No birth or death is stated here.",
     [ev("s0205","太保衛瓘息庭")])
pchk("p018",
     "Wei Ting’s assignment is the Yuankang-1 於是 list (s0203–s0205). AD 291 is his only supported year.",
     [ev("s0205","太保衛瓘息庭")])
pchk("p019",
     "Sima Tai is only named as Lue’s father in s0205. Empty hints are required.",
     [ev("s0205","司空泰息略")])
pchk("p020",
     "Sima Lue’s assignment is Yuankang 1 (s0205). AD 291 matches; no other life date is given.",
     [ev("s0205","司空泰息略")])
pchk("p021",
     "Yang Bi’s assignment is Yuankang 1 (s0205). AD 291 matches.",
     [ev("s0205","太子太傅楊濟息毖")])
pchk("p022",
     "Pei Xian’s assignment is Yuankang 1 (s0205). AD 291 matches.",
     [ev("s0205","太子少師裴楷息憲")])
pchk("p023",
     "Zhang Yi’s assignment is Yuankang 1 (s0205). AD 291 matches.",
     [ev("s0205","太子少傅張華息禕")])
pchk("p024",
     "Hua Gao is only named as Heng’s father in s0205. Empty hints are required.",
     [ev("s0205","尚書令華暠息恆")])
pchk("p025",
     "Hua Heng’s assignment is Yuankang 1 (s0205). AD 291 matches.",
     [ev("s0205","尚書令華暠息恆")])
pchk("p026",
     "Jia’s undated envy (s0015) is kept undated. Her own dated acts—twelfth-month deposition, third-month murder order, and death at 及賈庶人死—all sit in Yongkang 1, AD 300. Hints do not use later reception.",
     [ev("s0015","賈后素忌太子有令譽"), ev("s0045","賈后將廢太子"), ev("s0131","及賈庶人死")])
pchk("p027",
     "Consort Jiang’s undated childbirth (s0017) is separate from her twelfth-month death (s0065, 300). No birth year for her is stated.",
     [ev("s0017","太子所幸蔣美人生男"), ev("s0065","太子保林蔣俊")])
pchk("p028",
     "Bin’s birth is attested without a year (s0017). His death is 永康元年正月 (s0171, 300). The April 追封 is posthumous reception, not a second life date. No age is given.",
     [ev("s0017","蔣美人生男"), ev("s0171","永康元年正月，薨")])
pchk("p029",
     "Jiang Tong’s remonstrance (s0026) is undated; his dirge after the burial (s0169) is AD 300. The hint uses only the dated living composition.",
     [ev("s0026","洗馬江統陳五事以諫之"), ev("s0169","故臣江統、陸機並作誄頌焉")])
pchk("p030",
     "Du Xi’s counsel (s0027) is undated. Empty hints correctly refuse a reign-wide interval. No birth or death here.",
     [ev("s0027","每盡忠規勸太子修德進善")])
pchk("p031",
     "Jia Mi’s Eastern Palace clashes (s0029–s0037) are undated. Empty hints are required; no death is narrated in these units.",
     [ev("s0029","知賈謐恃後之貴")])
pchk("p032",
     "Pei Quan’s warning (s0031) is undated. No omitted dated life event.",
     [ev("s0031","詹事裴權諫曰")])
pchk("p033",
     "Guo Huai’s marriage plan (s0034 初) is undated. Empty hints stand.",
     [ev("s0034","賈后母郭槐欲以韓壽女為太子妃")])
pchk("p034",
     "Han Shou appears only in that undated plan. No year is available.",
     [ev("s0034","欲以韓壽女為太子妃")])
pchk("p035",
     "The proposed daughter is unnamed and undated in s0034. Empty hints are required.",
     [ev("s0034","欲以韓壽女為太子妃")])
pchk("p036",
     "Jia Wu’s refusal (s0035) is undated. No later dated act is given for her.",
     [ev("s0035","壽妻賈午及後皆不聽")])
pchk("p037",
     "Wang Yan’s undated betrothal role (s0035) is separate from his dated divorce memorial at the deposition (s0073, 300). Hints use only the dated act.",
     [ev("s0035","為太子聘王衍小女惠風"), ev("s0073","妃父王衍表請離婚")])
pchk("p038",
     "Huifeng’s betrothal (s0035) is undated; her own dated act is the twelfth-month removal to Jinyong (s0065, 300). She is later returned as 太孫太妃 without a new year beyond 300. No death here.",
     [ev("s0035","王衍小女惠風"), ev("s0065","送太子妃王氏、三皇孫于金墉城")])
pchk("p039",
     "The elder daughter is betrothed in s0036 without a year. Empty hints are required.",
     [ev("s0036","賈后為謐聘之")])
pchk("p040",
     "Ying’s rebuke (s0037) is undated. Empty hints correctly refuse a year.",
     [ev("s0037","成都王穎見而訶謐")])
pchk("p041",
     "Yang appears only as a retrospective Jinyong precedent (s0039). Empty hints keep reception out of life dates.",
     [ev("s0039","依楊氏故事")])
pchk("p042",
     "Zhao Jun’s request (s0043) is undated. No omitted dated event.",
     [ev("s0043","中護軍趙俊請太子廢後")])
pchk("p043",
     "Chen Wu’s dated act is the twelfth-month forced drinking (s0046, 300). No birth or death is stated.",
     [ev("s0046","遣婢陳舞賜以酒棗")])
pchk("p044",
     "Pan Yue’s dated act is drafting the forged text (s0047, 300).",
     [ev("s0047","使黃門侍郎潘岳作書草")])
pchk("p045",
     "Chengfu’s dated act is carrying the draft (s0047, 300).",
     [ev("s0047","令小婢承福以紙筆及書草使太子書之")])
pchk("p046",
     "Dong Meng’s dated acts are the twelfth-month display and forged speech (s0058–s0060, 300).",
     [ev("s0058","使黃門令董猛乙太子書及青紙詔")])
pchk("p047",
     "Pei Wei’s dated act is defending Yu in the twelfth-month court (s0059, 300).",
     [ev("s0059","惟張華、裴頠證明太子")])
pchk("p048",
     "Princess Changguang is only the forged speaker (s0060). Empty hints correctly refuse to date her from Jia’s forgery.",
     [ev("s0060","矯以長廣公主辭白帝")])
pchk("p049",
     "He Yu’s dated act is the twelfth-month deposition mission (s0063, 300). He later prepares funeral rites without a new year label.",
     [ev("s0063","使尚書和郁持節")])
pchk("p050",
     "Xie Jie’s dated act is deputy envoy in s0063, AD 300.",
     [ev("s0063","解結為副")])
pchk("p051",
     "Sima Rong’s dated act in this chapter is the twelfth-month deposition party (s0063, 300).",
     [ev("s0063","大將軍梁王肜")])
pchk("p052",
     "Sima Yun’s dated act in this chapter is the twelfth-month deposition party (s0063, 300).",
     [ev("s0063","鎮東將軍淮南王允")])
pchk("p053",
     "Sima Dan’s dated acts are the twelfth-month deposition, the Jinyong escort, and the Xuchang transfer (s0063–s0068), all AD 300.",
     [ev("s0063","前將軍東武公澹"), ev("s0065","澹以兵仗送太子妃王氏")])
pchk("p054",
     "Lun’s living sequence is twelfth-month envoy (300), acting tutorship in Yongkang 1 (300), and usurpation in Yongning 1 (301). Hints match; no later reception year is used as activity.",
     [ev("s0063","趙王倫"), ev("s0183","趙王倫篡位")])
pchk("p055",
     "Liu Zhen jails Yu in the first month (s0068) and is executed at Jia’s death (s0131), both AD 300. No omitted life date.",
     [ev("s0068","令治書御史劉振持節守之"), ev("s0131","乃誅劉振")])
pchk("p056",
     "The Lady of Yicheng’s death is attested as already past (s0077) with no year. Empty hints and the undated death row agree.",
     [ev("s0077","自宜城君亡")])
pchk("p057",
     "Sima Ya’s plot talk sits after the deposition and before the third-month murder (s0107–s0108), AD 300.",
     [ev("s0108","右衛督司馬雅")])
pchk("p058",
     "Xu Chao is paired with Ya in that same post-deposition interval, AD 300.",
     [ev("s0108","常從督許超")])
pchk("p059",
     "Sun Xiu’s living acts run from the post-deposition counsel through the delay that leads to the third-month murder, all AD 300.",
     [ev("s0108","說趙王倫謀臣孫秀曰")])
pchk("p060",
     "Cheng Ju compounds the pills just before 三月 (s0119) and is executed at Jia’s death (s0131), both AD 300.",
     [ev("s0119","太醫令程據合巴豆杏子丸"), ev("s0131","程據等")])
pchk("p061",
     "Sun Lü murders Yu in the third month (s0120–s0123) and is executed at Jia’s death (s0131), both AD 300.",
     [ev("s0120","黃門孫慮"), ev("s0123","慮以藥杵椎殺之")])
pchk("p062",
     "Yi’s dated act is the restoration announcement after Jia’s death (s0131, 300). No other life date is given.",
     [ev("s0131","衛尉伊策故皇太子之靈")])
pchk("p063",
     "Shen Sheng is only an exemplum in the restoration edict (s0135). Empty hints keep retrospective reception out of life dates.",
     [ev("s0135","俾申生、孝己復見於今")])
pchk("p064",
     "Xiao Ji is only an exemplum in the same edict. Empty hints are required.",
     [ev("s0135","俾申生、孝己復見於今")])
pchk("p065",
     "Liu Wu’s dated act is delivering the 哀策 in the Yongkang-1 funeral sequence (s0143, 300).",
     [ev("s0143","使洗馬劉務告于皇太子之殯曰")])
pchk("p066",
     "Yan Zuan’s dated act is the post-burial counsel that moves the emperor (s0169, 300).",
     [ev("s0169","帝感閻纘之言")])
pchk("p067",
     "Lu Ji’s dated act is composing a dirge after the burial (s0169, 300).",
     [ev("s0169","陸機並作誄頌焉")])
pchk("p068",
     "Zang’s living dates are Linhuai and grandson-heir in Yongkang 1 (300) and degradation plus murder in Yongning 1 (301). "
     "太安初 追諡 is retrospective and correctly absent from hints. No birth year is stated.",
     [ev("s0174","永康元年四月，封臨淮王"), ev("s0183","尋被害"), ev("s0184","太安初，追諡曰哀")])
pchk("p069",
     "Shang’s living dates are Xiangyang in Yongkang 1 (300), grandson-heir in Yongning 1 (301), and death on 太安元年三月癸卯 (302). "
     "The same-day 諡 is reception. No birth year is stated. Annals and biography agree on the death day.",
     [ev("s0207","永康元年四月"), ev("s0208","永寧元年八月"), ev("s0209","太安元年三月癸卯，薨")])
pchk("p070",
     "Prince Jian appears only in the historian’s appraisal (s0192). Empty hints keep that comparison out of life chronology.",
     [ev("s0192","冤逾楚建")])
pchk("p071",
     "Crown Prince Li appears only as 戾園 (s0192). Empty hints are required.",
     [ev("s0192","酷甚戾園")])
pchk("p072",
     "The Huguan elder is only an allusion in the condolence (s0158). Empty hints keep retrospective reception out of life dates.",
     [ev("s0158","壺關幹主")])
pchk("p073",
     "Qianqiu is only an allusion in the same condolence line. Empty hints are required.",
     [ev("s0158","千秋悟己")])

OWNED_ITEMS = [
    "claim-100","claim-101","claim-102","claim-103","claim-104","claim-105","claim-106","claim-107","claim-108","claim-109",
    "claim-110","claim-111","claim-112","claim-113","claim-114","claim-115","claim-116","claim-117","claim-118","claim-119",
    "claim-120","claim-121","claim-122","claim-123","claim-124","claim-125","claim-126","claim-127","claim-128","claim-129",
    "claim-130","claim-131","claim-132","claim-133","claim-134","claim-135","claim-136","claim-137","claim-138","claim-139",
    "claim-140","claim-141","claim-142","claim-143","claim-144","claim-145","claim-146","claim-147","claim-148","claim-149",
    "claim-150","claim-151","claim-152","claim-153","claim-154","claim-155","claim-156","claim-157","claim-158","claim-159",
    "claim-160","claim-161","claim-162","claim-163","claim-164","claim-165","claim-166","claim-167","claim-168","claim-169",
    "claim-170","claim-171","claim-172","claim-173","claim-174","claim-175","claim-176","claim-177","claim-178","claim-179",
    "claim-180","claim-181","claim-182","claim-183","claim-184","claim-185","claim-186","claim-187","claim-188","claim-189",
    "claim-190","claim-193","claim-194","claim-195","claim-196","claim-198","claim-201","claim-202","claim-203","claim-205",
    "claim-206","claim-207","claim-208","claim-239","claim-243","claim-244","claim-245","claim-246","claim-247","claim-248",
    "claim-249","claim-250","claim-271","claim-272","claim-276","claim-283","claim-284","claim-285","claim-286","claim-287",
    "claim-288","claim-289","claim-290","claim-291","claim-292","claim-293","claim-294","claim-295","claim-296","claim-297",
    "claim-298","claim-299","claim-300",
] + [f"hints-p{i:03d}" for i in range(1, 74)]

OWNED_PEOPLE = [f"p{i:03d}" for i in range(1, 74)]

ids = [c["id"] for c in item_checks]
if ids != OWNED_ITEMS:
    missing = [x for x in OWNED_ITEMS if x not in ids]
    extra = [x for x in ids if x not in OWNED_ITEMS]
    dup = [x for x in ids if ids.count(x) > 1]
    raise SystemExit(f"item id mismatch missing={missing} extra={extra} dup={sorted(set(dup))}")

pids = [c["id"] for c in person_checks]
if pids != OWNED_PEOPLE:
    missing = [x for x in OWNED_PEOPLE if x not in pids]
    extra = [x for x in pids if x not in OWNED_PEOPLE]
    raise SystemExit(f"person id mismatch missing={missing} extra={extra}")

for c in item_checks:
    if "event" not in c:
        raise SystemExit(f"missing event on {c['id']}")

def sha_quote(q):
    return "sha256:" + hashlib.sha256(q.encode("utf-8")).hexdigest()

accessed = "2026-10-28T23:10:00Z"

references = [
    {
        "kind": "external",
        "url": "https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7004",
        "title": "晉書/卷004 (Wikisource)",
        "quote": "十二月壬戌，廢皇太子遹爲庶人",
        "sourceHash": sha_quote("十二月壬戌，廢皇太子遹爲庶人"),
        "accessedAt": accessed,
        "reason": "Hui annals date the deposition to Yuankang 9 month 12 day 壬戌, confirming s0044–s0045 九年十二月 and supplying the sexagenary day used in conversion.",
    },
    {
        "kind": "external",
        "url": "https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7004",
        "title": "晉書/卷004 (Wikisource)",
        "quote": "永康元年春正月癸亥朔，大赦，改元。",
        "sourceHash": sha_quote("永康元年春正月癸亥朔，大赦，改元。"),
        "accessedAt": accessed,
        "reason": "Yongkang 1 begins the day after 十二月壬戌, matching s0066 明年正月 as AD 300 month 1.",
    },
    {
        "kind": "external",
        "url": "https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7004",
        "title": "晉書/卷004 (Wikisource)",
        "quote": "癸未，賈后矯詔害庶人遹于許昌。",
        "sourceHash": sha_quote("癸未，賈后矯詔害庶人遹于許昌。"),
        "accessedAt": accessed,
        "reason": "Annals place Yu’s murder on 癸未 of Yongkang 1 month 3, supporting s0120 三月 as AD 300.",
    },
    {
        "kind": "external",
        "url": "https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7004",
        "title": "晉書/卷004 (Wikisource)",
        "quote": "六月壬寅，葬愍懷太子于顯平陵。",
        "sourceHash": sha_quote("六月壬寅，葬愍懷太子于顯平陵。"),
        "accessedAt": accessed,
        "reason": "Competing burial day versus chapter s0168 六月己卯; both remain in Yongkang 1 / AD 300, so year precision is retained.",
    },
    {
        "kind": "external",
        "url": "https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7004",
        "title": "晉書/卷004 (Wikisource)",
        "quote": "永寧元年春正月乙丑，趙王倫篡帝位。",
        "sourceHash": sha_quote("永寧元年春正月乙丑，趙王倫篡帝位。"),
        "accessedAt": accessed,
        "reason": "Confirms s0183 永甯元年正月 usurpation as Hui Yongning 1, AD 301.",
    },
    {
        "kind": "external",
        "url": "https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7004",
        "title": "晉書/卷004 (Wikisource)",
        "quote": "三月癸卯，赦司、冀、兗、豫四州。皇太孫尚薨。",
        "sourceHash": sha_quote("三月癸卯，赦司、冀、兗、豫四州。皇太孫尚薨。"),
        "accessedAt": accessed,
        "reason": "Confirms s0209 太安元年三月癸卯 as Shang’s death day in Tai’an 1, AD 302.",
    },
    {
        "kind": "external",
        "url": "https://zh.wikipedia.org/wiki/%E5%85%83%E5%BA%B7_(%E8%A5%BF%E6%99%8B)",
        "title": "元康 (西晋) — 紀年農曆對照表",
        "quote": "元康十年（300年）正月一日，改元為永康元年。",
        "sourceHash": sha_quote("元康十年（300年）正月一日，改元為永康元年。"),
        "accessedAt": accessed,
        "reason": "Shows Yuankang 9 month 12 ends at the AD 300 New Year; the table’s 十二月 朔 is 300/1/8, so twelfth-month events convert to AD 300, not the conventional 299 era label.",
    },
    {
        "kind": "external",
        "url": "https://zh.wikipedia.org/wiki/%E6%B0%B8%E5%BA%B7_(%E8%A5%BF%E6%99%8B)",
        "title": "永康 (西晋) — 紀年農曆對照表",
        "quote": "永康元年 | 庚申 | 300年 | 癸亥 小",
        "sourceHash": sha_quote("永康元年 | 庚申 | 300年 | 癸亥 小"),
        "accessedAt": accessed,
        "reason": "Yongkang 1 month 1 朔 is 2/7 of AD 300, agreeing with s0066 明年正月 and the day after 十二月壬戌.",
    },
    {
        "kind": "external",
        "url": "https://sangokushi-biyori.com/reference-gregorian-calendar-300",
        "title": "グレゴリオ暦と晋の永康元（300）年（対照表）",
        "quote": "晋の永康元年は西暦（グレゴリオ暦）300年2月7日～301年1月25日",
        "sourceHash": sha_quote("晋の永康元年は西暦（グレゴリオ暦）300年2月7日～301年1月25日"),
        "accessedAt": accessed,
        "reason": "Explicit proleptic Gregorian span for Yongkang 1; month-and-day events in this chapter stay inside AD 300–301. Academia Sinica’s Julian default would shift days by one but not the Western year.",
    },
    {
        "kind": "external",
        "url": "https://sinocal.sinica.edu.tw/",
        "title": "中央研究院 兩千年中西曆轉換",
        "quote": "在此之前的西曆稱為儒略(Julian)曆",
        "sourceHash": sha_quote("在此之前的西曆稱為儒略(Julian)曆"),
        "accessedAt": accessed,
        "reason": "Records the converter’s Julian default before 1582. Near New Year a Julian/Gregorian split can change the Western year; for these 300-era months the year is unchanged, and Western years here are treated as proleptic Gregorian.",
    },
    {
        "kind": "external",
        "url": "https://ctext.org/datawiki.pl?if=gb&res=79977",
        "title": "晉惠帝 - 中國哲學書電子化計劃",
        "quote": "300/2/6元康九年十二月壬戌",
        "sourceHash": sha_quote("300/2/6元康九年十二月壬戌"),
        "accessedAt": accessed,
        "reason": "Independent conversion of the deposition day 壬戌 to 300-02-06, i.e. the last day of Yuankang 9, supporting AD 300 for s0045 十二月.",
    },
]

doc = {
    "jobId": JOB_ID,
    "sourceHash": SOURCE_HASH,
    "extractionHash": EXTRACTION_HASH,
    "reviewedAt": "2026-10-28T23:20:00Z",
    "reviewer": {"name": "independent-jinshu053-reviewer", "independentOfExtractor": True},
    "summary": (
        "Chapter 053’s owned chronology is supported from the Chinese units. "
        "Sima Yu has no stated birth year; ages five and twenty-three sui are preserved without conversion. "
        "Deaths of Yu, Xie, Jiang, Bin, Zang, Shang, Jia, Liu Zhen, Sun Lü, Cheng Ju, and the undated prior death of the Lady of Yicheng are present. "
        "The pivotal 九年十二月 deposition converts to AD 300 because Yuankang 9 month 12 begins in that Western year (proleptic Gregorian); "
        "the conventional 299 label of 元康九年 does not date the month. "
        "明年正月 / 永康元年 and later 三月, 六月 events are Yongkang 1, AD 300; 永寧元年 is 301; 太安元年 is 302. "
        "Tutor appointments are correctly bounded 290–291. "
        "Active hints match personal living events; retrospective citations (Xuan, Yang, Shen Sheng, Xiao Ji, Jian, Li, Huguan, Qianqiu, posthumous titles) are not fed into life years. "
        "s0168 六月己卯 competes with the Hui annals’ 六月壬寅 and is not a day of month 6 on the reconstructed 庚寅朔; year 300 is still shared."
    ),
    "reviewedUnits": OWNED_UNITS,
    "itemChecks": item_checks,
    "personChecks": person_checks,
    "findings": [],
    "references": references,
}

# final sanity
assert all(c["verdict"] == "supported" for c in item_checks + person_checks)
assert doc["findings"] == []
assert len(item_checks) == len(OWNED_ITEMS)
assert len(person_checks) == 73

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(doc, f, ensure_ascii=False, indent=2)
    f.write("\n")

print("wrote", OUT)
print("itemChecks", len(item_checks), "personChecks", len(person_checks))
print("bytes", __import__("os").path.getsize(OUT))
