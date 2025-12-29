#!/bin/bash
cd "$(dirname "$0")"
python3 -c "
import json
import os
from pathlib import Path

def get_translation_stats():
    books = ['shiji', 'hanshu']
    total_sentences = 0
    total_translated = 0

    for book in books:
        book_path = Path('data') / book
        if book_path.exists():
            for json_file in sorted(book_path.glob('*.json')):
                try:
                    with open(json_file, 'r', encoding='utf-8') as f:
                        data = json.load(f)

                    meta = data.get('meta', {})
                    translated = meta.get('translatedCount', 0)
                    total = meta.get('sentenceCount', 0)

                    total_sentences += total
                    total_translated += translated

                except Exception as e:
                    print(f'Error reading {json_file}: {e}')

    if total_sentences > 0:
        percentage = (total_translated / total_sentences) * 100
        print(f'Overall Progress: {total_translated}/{total_sentences} sentences translated ({percentage:.1f}%)')

        # Break down by book
        for book in books:
            book_path = Path('data') / book
            if book_path.exists():
                book_total = 0
                book_translated = 0
                for json_file in book_path.glob('*.json'):
                    try:
                        with open(json_file, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                        meta = data.get('meta', {})
                        book_translated += meta.get('translatedCount', 0)
                        book_total += meta.get('sentenceCount', 0)
                    except:
                        pass

                if book_total > 0:
                    book_pct = (book_translated / book_total) * 100
                    print(f'  {book.upper()}: {book_translated}/{book_total} ({book_pct:.1f}%)')
    else:
        print('No translation data found.')

get_translation_stats()
"
