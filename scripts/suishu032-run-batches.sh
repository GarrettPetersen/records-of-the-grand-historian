#!/bin/bash
set -euo pipefail
cd /workspace
TRANSLATOR="Garrett M. Petersen (2026)"
MODEL="Composer 2.5"
FILE="translations/current_translation_suishu.json"

for batch in 04 05 06 07 08 09 10 11 12 13 14; do
  echo "=== Batch $batch ==="
  make start-translation BOOK=suishu CHAPTER=032
  python3 scripts/apply-batch-translations.py "translations/batches/suishu032_batch${batch}.json" "$FILE"
  make submit-translations TRANSLATOR="$TRANSLATOR" MODEL="$MODEL" FILE="$FILE"
done

jq '.meta.translatedCount, .meta.sentenceCount' data/suishu/032.json
