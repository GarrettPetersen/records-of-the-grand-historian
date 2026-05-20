#!/usr/bin/env python3
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "current_translation_chenshu.json"


def apply(patch_name: str):
    patch = json.loads(Path(__file__).with_name(patch_name).read_text())
    data = json.loads(TARGET.read_text())
    n = 0
    for s in data["sentences"]:
        if s["id"] in patch:
            s["literal"] = patch[s["id"]]["literal"]
            s["idiomatic"] = patch[s["id"]]["idiomatic"]
            n += 1
    TARGET.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"Applied {n} from {patch_name}")


if __name__ == "__main__":
    apply(sys.argv[1])
