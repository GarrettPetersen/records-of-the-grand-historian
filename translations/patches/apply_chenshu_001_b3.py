#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "current_translation_chenshu.json"
PATCH = Path(__file__).with_name("chenshu_001_b3.json")

data = json.loads(TARGET.read_text())
patch = json.loads(PATCH.read_text())
for s in data["sentences"]:
    if s["id"] in patch:
        s["literal"] = patch[s["id"]]["literal"]
        s["idiomatic"] = patch[s["id"]]["idiomatic"]
TARGET.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
print(f"Applied {len(patch)} entries")
