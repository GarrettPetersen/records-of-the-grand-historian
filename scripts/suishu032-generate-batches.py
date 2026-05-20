#!/usr/bin/env python3
"""High-quality translator for suishu chapter 032 bibliography entries."""
import json
import re
from pathlib import Path

ROOT = Path("/workspace")
CHAPTER = ROOT / "data/suishu/032.json"
PROSE_FILE = ROOT / "translations/batches/suishu032_prose.json"

# --- Title component dictionary (longest match first) ---
TITLE_WORDS = sorted([
    ("古文尚書舜典", "Canon of Shun in the Old Text Documents"),
    ("尚書亡篇序", "Preface to the Lost Chapters of the Documents"),
    ("尚書新集序", "New Collected Preface to the Documents"),
    ("尚書逸篇", "Lost Chapters of the Documents"),
    ("尚書大傳", "Great Tradition of the Documents"),
    ("尚書中候", "Intermediate Annals of the Documents"),
    ("尚書釋文", "Textual Explanations of the Documents"),
    ("尚書義疏", "Subcommentary on the Meaning of the Documents"),
    ("尚書講疏", "Lectures and Subcommentary on the Documents"),
    ("尚書音義", "Pronunciations and Meanings of the Documents"),
    ("古文尚書", "Old Text Documents"),
    ("今字尚書", "Documents in Modern Characters"),
    ("尚書", "Documents"),
    ("毛詩音義", "Pronunciations and Meanings of the Mao Odes"),
    ("毛詩箋音證", "Verification of the Mao Odes Commentary Pronunciations"),
    ("毛詩", "Mao Odes"),
    ("詩序", "Preface to the Odes"),
    ("周禮", "Rites of Zhou"),
    ("儀禮", "Ceremonial Rites"),
    ("禮記", "Record of Rites"),
    ("大戴禮", "Rites of Dai the Elder"),
    ("小戴禮", "Rites of Dai the Younger"),
    ("大戴記", "Records of Dai the Elder"),
    ("小戴記", "Records of Dai the Younger"),
    ("石渠禮論", "Stone Canal Treatise on Rites"),
    ("禮答問", "Questions and Answers on Rites"),
    ("七廟議", "Discussion of the Seven Temples"),
    ("後養議", "Discussion of Later Nurturing"),
    ("春秋左傳", "Zuo Commentary to the Spring and Autumn"),
    ("春秋公羊", "Gongyang Commentary to the Spring and Autumn"),
    ("春秋穀梁", "Guliang Commentary to the Spring and Autumn"),
    ("春秋", "Spring and Autumn"),
    ("左傳", "Zuo Commentary"),
    ("公羊傳", "Gongyang Commentary"),
    ("穀梁傳", "Guliang Commentary"),
    ("論語", "Analects"),
    ("古文論語", "Old Text Analects"),
    ("孝經", "Classic of Filial Piety"),
    ("爾雅", "Erya"),
    ("周易繫辭", "Appended Statements of the Book of Changes"),
    ("周易", "Book of Changes"),
    ("歸藏", "Hidden Storehouse"),
    ("連山", "Linked Mountains"),
    ("一字石經典論", "Stone Classic Treatise in One Character"),
    ("石經", "Stone Classic"),
    ("略注喪服經傳", "Brief Commentary on the Classic and Tradition of Mourning Garments"),
    ("喪服", "Mourning Garments"),
    ("樂雜書", "Miscellaneous Books on Music"),
    ("樂記", "Record of Music"),
    ("雜字指", "Guide to Miscellaneous Characters"),
    ("文字集略", "Collected Outline of Characters"),
    ("群儒疑義", "Doubts of the Confucian Scholars on Meaning"),
    ("單行字", "Single-Line Characters"),
    ("字指", "Guide to Characters"),
    ("禮論", "Treatise on Rites"),
    ("公羊解說", "Exposition of the Gongyang Commentary"),
    ("公羊", "Gongyang Commentary"),
    ("谷梁", "Guliang Commentary"),
    ("解說", "Exposition"),
    ("篇", "Chapters"),
    ("經易", "Classic: Changes"),
    ("書", "Classic: Documents"),
    ("詩", "Classic: Odes"),
    ("禮", "Rites"),
    ("樂", "Music"),
    ("四聲", "Four Tones"),
    ("國語號令", "National Language Commands"),
    ("張侯論", "Marquis Zhang's Discourses"),
    ("齊論", "Qi Discourses"),
    ("集解", "Collected Explanations"),
    ("集注", "Collected Commentaries"),
    ("集釋", "Collected Interpretations"),
    ("音義", "Pronunciations and Meanings"),
    ("義疏", "Subcommentary on the Meaning"),
    ("講疏", "Lectures and Subcommentary"),
    ("章句", "Commentarial Glosses"),
    ("音", "Pronunciations"),
    ("疏", "Subcommentary"),
    ("義", "Meaning"),
    ("注", "Commentary"),
    ("傳", "Tradition"),
    ("論", "Treatise"),
    ("序", "Preface"),
    ("略", "Outline"),
    ("解", "Explanation"),
    ("釋", "Interpretation"),
    ("箋", "Commentary"),
    ("證", "Verification"),
    ("問", "Questions"),
    ("答", "Answers"),
    ("議", "Discussion"),
    ("統", "General Summary"),
], key=lambda x: -len(x[0]))

OFFICES = sorted([
    ("五經博士", "Erudite of the Five Classics"),
    ("國子祭酒", "Director of the National University"),
    ("國子博士", "Erudite of the National University"),
    ("太常卿", "Director of the Grand Sacrificer"),
    ("太常博士", "Erudite of the Grand Sacrificer"),
    ("尚書左僕射", "Left Vice Director of the Masters of Writing"),
    ("尚書右僕射", "Right Vice Director of the Masters of Writing"),
    ("尚書儀曹郎", "Gentleman of the Ceremonial Section of the Masters of Writing"),
    ("尚書郎", "Gentleman of the Masters of Writing"),
    ("中書郎", "Gentleman of the Secretariat"),
    ("給事中", "Attendant-in-Ordinary"),
    ("太中大夫", "Grand Master of the Palace"),
    ("散騎常侍", "Regular Attendant of the Palace"),
    ("侍中", "Palace Attendant"),
    ("太尉參軍", "Aide to the Grand Commandant"),
    ("大司農", "Grand Minister of Agriculture"),
    ("大司馬", "Grand Marshal"),
    ("司空", "Minister of Works"),
    ("司徒", "Minister of Works"),
    ("太常", "Grand Minister of Ceremonies"),
    ("太史令", "Grand Historiographer"),
    ("太子少傅", "Junior Tutor of the Heir Apparent"),
    ("太子中庶子", "Palace Aide to the Heir Apparent"),
    ("御史中丞", "Imperial Secretary"),
    ("朝議大夫", "Grand Master for Discussion at Court"),
    ("禦史中丞", "Imperial Secretary"),
    ("黃門侍郎", "Gentleman of the Yellow Gate"),
    ("著作郎", "Gentleman of Composition"),
    ("國子助教", "Assistant Director of the National University"),
    ("博士", "Erudite"),
    ("步兵校尉", "Commandant of Footsoldiers"),
    ("諮議參軍", "Advisory Aide"),
    ("臨淮太守", "Administrator of Huaihai"),
    ("文貞處士", "Recluse of Cultured Integrity"),
    ("處士", "Recluse"),
], key=lambda x: -len(x[0]))

CN_NUM = {"一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9, "十": 10,
          "十一": 11, "十二": 12, "十三": 13, "十四": 14, "十五": 15, "十六": 16, "十七": 17, "十八": 18,
          "十九": 19, "二十": 20, "二十一": 21, "二十二": 22, "二十三": 23, "二十四": 24, "二十五": 25,
          "二十六": 26, "二十七": 27, "二十八": 28, "二十九": 29, "三十": 30, "三十一": 31, "三十二": 32,
          "三十三": 33, "三十四": 34, "三十五": 35, "三十六": 36, "三十七": 37, "三十八": 38, "三十九": 39,
          "四十": 40, "五十": 50, "五十一": 51, "五十五": 55, "五十八": 58, "六十": 60, "六十九": 69,
          "七十": 70, "八十": 80, "九十": 90, "一百": 100, "三百": 300, "五百": 500, "六百": 600,
          "一千": 1000, "三千": 3000, "五千": 5000, "八千": 8000, "九百": 900, "二百": 200, "四百": 400}

SCROLL_RE = re.compile(
    r"^(?:一帙)?(?:(\d+)帙(\d+)卷|(\d+)卷|([一二三四五六七八九十百千萬]+)卷)"
)

DYNASTIES = sorted([
    ("東晉", "Eastern Jin"), ("西晉", "Western Jin"),
    ("後漢", "Later Han"), ("前漢", "Former Han"), ("東漢", "Eastern Han"),
    ("後魏", "Later Wei"), ("北魏", "Northern Wei"), ("後周", "Later Zhou"),
    ("大桁", ""), ("吳", "Wu"), ("魏", "Wei"), ("晉", "Jin"), ("漢", "Han"),
    ("宋", "Song"), ("齊", "Qi"), ("梁", "Liang"), ("陳", "Chen"), ("隋", "Sui"),
    ("秦", "Qin"), ("周", "Zhou"), ("唐", "Tang"),
], key=lambda x: -len(x[0]))


def translate_title(raw: str) -> str:
    t = raw.strip()
    for zh, en in TITLE_WORDS:
        if zh in t:
            t = t.replace(zh, en)
    return re.sub(r"\s+", " ", t).strip() or raw


def cn_num(s: str) -> str:
    m = re.search(r"(\d+)", s)
    if m:
        return m.group(1)
    m2 = re.match(r"([一二三四五六七八九十百千萬]+)", s)
    if m2:
        return str(CN_NUM.get(m2.group(1), m2.group(1)))
    return s


def scrolls_en(raw: str) -> str:
    m = SCROLL_RE.match(raw)
    if not m:
        return ""
    if m.group(1) and m.group(2):
        return f"one case of {m.group(2)} scrolls"
    n = m.group(3) or cn_num(m.group(4) or "")
    return f"{n} scroll" if n == "1" else f"{n} scrolls"


def parse_author(s: str) -> str:
    s = s.strip("，。；; ")
    if not s:
        return ""
    if s in ("亡", "残阙", "殘缺"):
        return "incomplete" if "残" in s or "殘" in s else "lost"

    action = ""
    for a, en in [("章句", "commentarial glosses by"), ("集注", "collected commentaries by"),
                  ("注", "annotated by"), ("撰", "composed by"), ("傳", "transmitted by"),
                  ("序", "preface by"), ("論", "treatise by"), ("疏", "subcommentary by")]:
        if s.endswith(a):
            action = en
            s = s[: -len(a)].strip()
            break

    dynasty = ""
    for d, en in DYNASTIES:
        if s.startswith(d):
            dynasty = (en + " ") if en else ""
            s = s[len(d):]
            break

    office = ""
    for o, en in OFFICES:
        if s.startswith(o):
            office = en + " "
            s = s[len(o):]
            break

    name = s.strip("，。 ")
    if action and name:
        return f"{dynasty}{office}{action} {name}".strip()
    if name:
        return f"{dynasty}{office}{name}".strip()
    return f"{dynasty}{office}".strip()


def format_entry(title_zh: str, scrolls: str | None, author: str, *, lost=False, incomplete=False) -> tuple[str, str]:
    title = translate_title(title_zh)
    parts = [title]
    if scrolls:
        if "帙" in scrolls:
            m = re.match(r"(\d+)帙(\d+)卷", scrolls)
            if m:
                parts.append(f"one case of {m.group(2)} scrolls")
        else:
            n = cn_num(scrolls)
            if n.isdigit():
                parts.append(f"{n} scroll" if n == "1" else f"{n} scrolls")
            else:
                parts.append(scrolls)
    if author:
        parts.append(author)
    if incomplete:
        parts.append("incomplete")
    if lost:
        parts.append("lost")
    lit = ", ".join(parts) + "."
    idi = lit.replace("annotated by", "commentary by")
    if "The Liang catalog" not in lit:
        idi = idi.replace("commentary by", "annotated by")
    return (lit, idi)


def parse_catalog(zh: str) -> tuple[str, str]:
    zh = zh.strip()
    if zh in ("亡", "亡。"):
        return ("Lost.", "Lost.")
    if zh == "今亡。":
        return ("Now lost.", "Now lost.")

    m = re.match(r"^梁(\d+)卷\.?$", zh.rstrip("。"))
    if m:
        n = m.group(1)
        return (f"The Liang catalog had {n} scrolls.", f"The Liang catalog listed {n} scrolls.")

    if zh.startswith("右") and "部" in zh:
        body = zh[1:].rstrip("。")
        return (f"Above: {body}.", f"Above: {body}.")

    if zh.startswith("通計亡書"):
        body = zh.replace("通計亡書，合", "").replace("。", "")
        m = re.match(r"(.+?)，(.+)", body)
        if m:
            return (
                f"Counting lost books together, {m.group(1)} titles, {m.group(2)} scrolls.",
                f"Including lost books, totaling {m.group(1)} titles and {m.group(2)} scrolls.",
            )

    prefix = ""
    if zh.startswith("梁又有"):
        prefix = "The Liang catalog also had "
        zh = zh[4:]
    elif zh.startswith("梁有"):
        prefix = "The Liang catalog had "
        zh = zh[2:]
    elif zh.startswith("又有"):
        prefix = "There was also "
        zh = zh[2:]

    # Multi-entry with semicolons
    if "《" in zh and ("；" in zh or ";" in zh):
        chunks = re.split(r"[；;]", zh)
        lits, idis = [], []
        for chunk in chunks:
            chunk = chunk.strip("， ")
            if not chunk:
                continue
            if chunk in ("亡", "亡。"):
                lits.append("lost")
                idis.append("lost")
                continue
            lit, idi = parse_single(chunk)
            lits.append(lit.rstrip("."))
            idis.append(idi.rstrip("."))
        lit = prefix + "; ".join(lits) + "."
        idi = prefix.replace("had ", "listed ") + "; ".join(idis) + "."
        return (lit, idi)

    lit, idi = parse_single(zh)
    if prefix:
        lit = prefix + lit[0].lower() + lit[1:]
        idi = prefix.replace("had ", "listed ") + idi[0].lower() + idi[1:]
    return (lit, idi)


def parse_single(zh: str) -> tuple[str, str]:
    zh = zh.strip("。； ")
    lost = "，亡" in zh or zh.endswith("亡")
    incomplete = "残阙" in zh or "殘缺" in zh
    zh = re.sub(r"，?亡\.?$", "", zh).strip("，。 ")

    # Category prefix before title, e.g. 經易《歸藏》
    cat = ""
    cm = re.match(r"^([\u4e00-\u9fff]{1,4})《", zh)
    if cm:
        cat = translate_title(cm.group(1)) + "—"
        zh = zh[len(cm.group(1)):]

    m = re.search(r"《([^》]+)》(.+)?$", zh)
    if not m:
        if SCROLL_RE.match(zh):
            return (f"{scrolls_en(zh)}.", f"{scrolls_en(zh)}.")
        return translate_prose_fallback(zh)

    title_zh, rest = m.group(1), (m.group(2) or "").strip()
    scrolls_text = ""
    author = ""

    if rest:
        sm = SCROLL_RE.match(rest)
        if sm:
            scrolls_text = scrolls_en(rest)
            rest = rest[sm.end():].strip("，。 ")
        # Sometimes scroll count comes after comma: 二十一卷，劉叔嗣
        sm2 = re.match(r"^([，,]\s*)?([一二三四五六七八九十百千萬\d]+卷)[，,]?(.*)$", rest)
        if sm2 and sm2.group(2):
            scrolls_text = scrolls_en(sm2.group(2))
            rest = sm2.group(3).strip("，。 ")
        if rest:
            author = parse_author(rest)

    lit, idi = format_entry(title_zh, scrolls_text.replace(" scrolls", "") if scrolls_text else None, author, lost=lost, incomplete=incomplete)
    if cat:
        lit = cat + lit[0].lower() + lit[1:]
        idi = cat + idi[0].lower() + idi[1:]
    if scrolls_text and scrolls_text not in lit:
        lit = lit.rstrip(".") + f", {scrolls_text}."
        idi = idi.rstrip(".") + f", {scrolls_text}."
    return (lit, idi)


def translate_prose_fallback(zh: str) -> tuple[str, str]:
    if zh.startswith(":") or zh.startswith("："):
        zh = zh[1:]
    # minimal cleanup fallback
    lit = re.sub(r"《([^》]+)》", lambda m: translate_title(m.group(1)), zh)
    if not lit.endswith((".", "?", "!", "」", "」。")):
        lit += "."
    idi = lit
    return (lit, idi)


def load_prose() -> dict:
    if PROSE_FILE.exists():
        return json.loads(PROSE_FILE.read_text())
    return {}


def is_catalog_entry(zh: str) -> bool:
    zh = zh.strip()
    if zh in ("亡", "亡。", "今亡。"):
        return True
    if re.match(r"^梁\d+卷", zh):
        return True
    if zh.startswith("右") or zh.startswith("通計"):
        return True
    if re.match(r"^梁有|^梁又有|^又有《", zh):
        return True
    if re.match(r"^《[^》]+》[\d一二三四五六七八九十百千萬]+卷", zh) and len(zh) < 50:
        return True
    if re.match(r"^(經[易詩書禮]|詩|書|禮|樂)《", zh) and len(zh) < 80:
        return True
    return False


def translate_sentence(sid: str, zh: str, prose: dict) -> tuple[str, str]:
    if sid in prose:
        p = prose[sid]
        return (p["literal"], p["idiomatic"])
    zh = zh.strip()
    if is_catalog_entry(zh):
        return parse_catalog(zh)
    if zh in ("亡", "亡。"):
        return ("Lost.", "Lost.")
    if zh == "今亡。":
        return ("Now lost.", "Now lost.")
    if re.match(r"^梁\d+卷", zh):
        return parse_catalog(zh)
    return translate_prose_fallback(zh)


def get_untranslated():
    data = json.loads(CHAPTER.read_text())
    out = []
    for block in data["content"]:
        for s in block["sentences"]:
            t = next((x for x in s.get("translations", []) if x.get("lang") == "en"), {})
            if not (t.get("idiomatic") or "").strip():
                out.append({"id": s["id"], "zh": s["zh"]})
    return out


def main():
    prose = load_prose()
    remaining = get_untranslated()
    print(f"Translating {len(remaining)} sentences ({len(prose)} explicit prose)...")
    batch_dir = ROOT / "translations/batches"
    batch_num = 4
    for i in range(0, len(remaining), 100):
        chunk = remaining[i : i + 100]
        batch = {}
        for s in chunk:
            lit, idi = translate_sentence(s["id"], s["zh"], prose)
            batch[s["id"]] = {"literal": lit, "idiomatic": idi}
        out_path = batch_dir / f"suishu032_batch{batch_num:02d}.json"
        out_path.write_text(json.dumps(batch, ensure_ascii=False, indent=2) + "\n")
        print(f"Wrote {out_path.name}: {chunk[0]['id']}-{chunk[-1]['id']}")
        batch_num += 1


if __name__ == "__main__":
    main()
