#!/bin/bash

# fix-all-quotes.sh - Run quote fixes on all Shiji chapters
# 
# Usage: bash fix-all-quotes.sh [--dry-run]

DRY_RUN=""
if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN="--dry-run"
  echo "=== DRY RUN MODE ==="
  echo
fi

TOTAL_FILES=0
TOTAL_ORPHANS=0
TOTAL_MOVED=0
TOTAL_DOUBLES=0

for file in data/shiji/*.json; do
  TOTAL_FILES=$((TOTAL_FILES + 1))
  chapter=$(basename "$file" .json)
  
  echo "Processing $chapter..."
  
  # Run orphan quote fixer
  output=$(node fix-orphan-quotes.js "$file" $DRY_RUN 2>&1)
  
  if echo "$output" | grep -q "No orphan quotes found"; then
    echo "  ✅ No orphan quotes"
  else
    removed=$(echo "$output" | grep "Removed.*orphan-only" | grep -oE '[0-9]+' | head -1)
    moved=$(echo "$output" | grep "Moved.*leading closing" | grep -oE '[0-9]+' | head -1)
    
    if [[ -n "$removed" ]]; then
      echo "  🔧 Removed $removed orphan-only sentence(s)"
      TOTAL_ORPHANS=$((TOTAL_ORPHANS + removed))
    fi
    
    if [[ -n "$moved" ]]; then
      echo "  🔧 Moved $moved leading closing quote(s)"
      TOTAL_MOVED=$((TOTAL_MOVED + moved))
    fi
  fi
  
  # Run double quote fixer (only if not dry run, since orphan fixer already ran)
  if [[ -z "$DRY_RUN" ]]; then
    output=$(node fix-double-quotes.js "$file" 2>&1)
    
    if echo "$output" | grep -q "No double quotes found"; then
      echo "  ✅ No double quotes"
    else
      fixed=$(echo "$output" | grep "Found and fixed" | grep -oE '[0-9]+' | head -1)
      if [[ -n "$fixed" ]]; then
        echo "  🔧 Fixed $fixed double quote(s)"
        TOTAL_DOUBLES=$((TOTAL_DOUBLES + fixed))
      fi
    fi
  fi
  
  echo
done

echo "=============================================="
echo "Summary:"
echo "  Files processed: $TOTAL_FILES"
echo "  Orphan-only sentences removed: $TOTAL_ORPHANS"
echo "  Leading quotes moved: $TOTAL_MOVED"
echo "  Double quotes fixed: $TOTAL_DOUBLES"
echo "=============================================="

if [[ -n "$DRY_RUN" ]]; then
  echo
  echo "This was a DRY RUN - no files were modified."
  echo "Run without --dry-run to apply changes."
fi
