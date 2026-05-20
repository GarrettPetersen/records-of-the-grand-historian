#!/usr/bin/env python3
"""Apply batch translations from JSON to current_translation file."""
import json
import sys

def main():
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <batch.json> <target.json>", file=sys.stderr)
        sys.exit(1)
    batch_path, target_path = sys.argv[1], sys.argv[2]
    with open(batch_path) as f:
        batch = json.load(f)
    with open(target_path) as f:
        data = json.load(f)
    by_id = {s["id"]: s for s in data["sentences"]}
    applied = 0
    for sid, t in batch.items():
        if sid not in by_id:
            raise KeyError(f"{sid} not in target file")
        by_id[sid]["literal"] = t["literal"]
        by_id[sid]["idiomatic"] = t["idiomatic"]
        applied += 1
    with open(target_path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"Applied {applied} translations")

if __name__ == "__main__":
    main()
