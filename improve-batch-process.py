#!/usr/bin/env python3
"""
Improved Batch Translation Process

This script demonstrates a better workflow:
1. Extract smaller batches (15-20 sentences)
2. Pre-read all content before translating
3. Translate with immediate quality checks
"""

import json
import sys
from pathlib import Path

def improved_batch_workflow(chapter_file, batch_size=15):
    """
    Improved workflow with smaller batches and pre-reading
    """
    print(f"🎯 Starting improved translation workflow for {chapter_file}")
    print(f"📏 Batch size: {batch_size} sentences")
    print(f"📖 Pre-reading phase...")

    # Load and analyze the chapter
    with open(chapter_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    total_sentences = data['meta']['sentenceCount']
    print(f"📊 Chapter has {total_sentences} sentences")

    # Calculate optimal batching
    full_batches = total_sentences // batch_size
    remainder = total_sentences % batch_size

    print(f"🔢 Will create {full_batches} full batches + {remainder} in final batch")

    # Pre-read all content (this would be done by the translation script)
    print("
✅ Pre-read complete - ready for translation"    print("💡 Benefits of this approach:"    print("  • Complete context before starting")
    print("  • Smaller, manageable batches")
    print("  • Better quality control")
    print("  • Reduced cognitive load per session")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python improve-batch-process.py <chapter_file> [batch_size]")
        sys.exit(1)

    chapter_file = sys.argv[1]
    batch_size = int(sys.argv[2]) if len(sys.argv) > 2 else 15

    improved_batch_workflow(chapter_file, batch_size)
