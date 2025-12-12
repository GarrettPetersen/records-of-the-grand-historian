# Records of the Grand Historian

A web frontend for translated copies of the official 24 Dynastic Histories of China (二十四史), scraped from [chinesenotes.com](https://chinesenotes.com).

## The 24 Dynastic Histories

The Twenty-Four Histories are the Chinese official historical books covering Chinese history from approximately 3000 BCE to the Ming dynasty in the 17th century. They are:

1. **史記** (Shǐjì) - Records of the Grand Historian
2. **漢書** (Hànshū) - Book of Han
3. **後漢書** (Hòu Hànshū) - Book of Later Han
4. **三國志** (Sānguó Zhì) - Records of the Three Kingdoms
5. **晉書** (Jìnshū) - Book of Jin
6. **宋書** (Sòngshū) - Book of Song
7. **南齊書** (Nán Qíshū) - Book of Southern Qi
8. **梁書** (Liángshū) - Book of Liang
9. **陳書** (Chénshū) - Book of Chen
10. **魏書** (Wèishū) - Book of Wei
11. **北齊書** (Běi Qíshū) - Book of Northern Qi
12. **周書** (Zhōushū) - Book of Zhou
13. **隋書** (Suíshū) - Book of Sui
14. **南史** (Nánshǐ) - History of the Southern Dynasties
15. **北史** (Běishǐ) - History of the Northern Dynasties
16. **舊唐書** (Jiù Tángshū) - Old Book of Tang
17. **新唐書** (Xīn Tángshū) - New Book of Tang
18. **舊五代史** (Jiù Wǔdàishǐ) - Old History of the Five Dynasties
19. **新五代史** (Xīn Wǔdàishǐ) - New History of the Five Dynasties
20. **宋史** (Sòngshǐ) - History of Song
21. **遼史** (Liáoshǐ) - History of Liao
22. **金史** (Jīnshǐ) - History of Jin
23. **元史** (Yuánshǐ) - History of Yuan
24. **明史** (Míngshǐ) - History of Ming

## Setup

```bash
npm install
```

## Data Structure

```
data/
├── glossary.json              # Shared glossary across all 24 histories
├── shiji/                     # Records of the Grand Historian
│   ├── 001.json
│   ├── 002.json
│   └── ...
├── hanshu/                    # Book of Han
│   ├── 001.json
│   └── ...
└── [other books]/
    └── ...
```

## Scraping

### List available books
```bash
node scrape.js --list
```

### Scrape a specific chapter
```bash
node scrape.js <book-id> <chapter> --glossary data/glossary.json
```

**Examples:**
```bash
# Create directory structure
mkdir -p data/shiji

# Scrape chapter 1 of the Records of the Grand Historian
node scrape.js shiji 001 --glossary data/glossary.json 2>/dev/null > data/shiji/001.json

# Scrape chapter 369 of the History of Song
mkdir -p data/songshi
node scrape.js songshi 369 --glossary data/glossary.json 2>/dev/null > data/songshi/369.json

# Scrape chapter 24 of the History of Jin (with zero-padding)
mkdir -p data/jinshi
node scrape.js jinshi 024 --glossary data/glossary.json 2>/dev/null > data/jinshi/024.json
```

**Note:** Use `2>/dev/null` to suppress status messages (loaded/saved glossary) from stderr.

## Output Format

### Chapter JSON (e.g., `data/shiji/001.json`)

```json
{
  "meta": {
    "book": "shiji",
    "bookInfo": {
      "name": "Records of the Grand Historian",
      "chinese": "史記",
      "pinyin": "Shǐjì",
      "dynasty": "Xia to Han"
    },
    "chapter": "001",
    "url": "https://chinesenotes.com/shiji/shiji001.html",
    "title": {
      "zh": "《本紀‧五帝本紀》 Annals - Annals of the Five Emperors",
      "en": null,
      "raw": "..."
    },
    "sentenceCount": 286,
    "translatedCount": 286,
    "glossarySize": 2701,
    "scrapedAt": "2025-12-12T22:27:17.560Z"
  },
  "content": [
    {
      "type": "paragraph",
      "sentences": [
        {
          "id": "s0001",
          "zh": "黃帝者，少典之子，姓公孫，名曰軒轅。",
          "en": null
        }
      ],
      "en": "Huangdi (Yellow emperor) was the son of Shaodian..."
    }
  ]
}
```

### Glossary (`data/glossary.json`)

Shared across all books, keyed by chinesenotes.com's `headwordId`:

```json
{
  "3023": {
    "id": 3023,
    "text": "張",
    "pinyin": "zhāng",
    "definitions": ["a sheet; a leaf", "Zhang", "to open; to draw [a bow]", ...],
    "isProperNoun": false
  }
}
```

### Structure Details

- **meta**: Book info, chapter, title (Chinese & English when available), counts, timestamp
- **content**: Array of paragraph blocks, each containing:
  - `sentences`: Array with sentence-level Chinese text (`zh`) and placeholder for translations (`en: null`)
  - `id`: Unique sentence identifier for alignment (e.g., `s0001`)
  - `en`: Paragraph-level English translation when available (from chinesenotes.com)
- **glossary**: Maintained separately in `data/glossary.json`, grows as you scrape more chapters

## Workflow

1. **Scrape** chapters to organized JSON files (one per book)
2. **Translate** using LLM (feed chapter JSON, get translations for each sentence)
3. **Build** web frontend with split-pane view (Chinese left, English right)
4. **Highlight** matching sentences on hover/click using sentence IDs
5. **Reference** shared glossary for word-level tooltips

## Source

Text is scraped from [Chinese Notes](https://chinesenotes.com), which provides:
- Classical Chinese source text
- Word-level annotations (pinyin, definitions) 
- Some chapters have existing English translations (especially early Shiji chapters)

## Web Frontend

After scraping chapters, generate the manifest for fast loading:

```bash
node generate-manifest.js
```

Run locally:
```bash
cd public && python3 -m http.server 8000
```

Then visit http://localhost:8000

Deploy to Cloudflare Pages by deploying the `public/` directory.

## License

ISC
