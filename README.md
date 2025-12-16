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

## Workflow Overview

1. **Scrape** - Download Chinese text (and existing translations if available) from chinesenotes.com
2. **Translate** - Add English translations for untranslated sentences using AI
3. **Build** - Generate static pages and manifest for the web frontend
4. **Deploy** - Push to Cloudflare Pages

## Scraping Chapters

### Quick Start with Makefile

The easiest way to scrape chapters is using the Makefile:

```bash
# List available books
make list

# Scrape a single chapter
make shiji-001                    # Scrape Shiji chapter 1
make hanshu-042                   # Scrape Book of Han chapter 42

# Scrape multiple chapters
make shiji CHAPTERS="001 002 003" # Scrape Shiji chapters 1-3
make hanshu CHAPTERS="001 002"    # Scrape Book of Han chapters 1-2

# Scrape entire books (predefined ranges)
make shiji-all                    # Scrape all 130 Shiji chapters
make hanshu-all                   # Scrape all 100 Book of Han chapters

# View statistics
make stats                        # Show chapter counts per book

# Find next chapter to translate
make first-untranslated

# Validate all JSON
make validate

# Help
make help                         # Show all available commands
```

### Manual Scraping (without Makefile)

```bash
# List available books
node scrape.js --list

# Scrape a specific chapter
node scrape.js <book-id> <chapter> --glossary data/glossary.json

# Examples:
node scrape.js shiji 001 --glossary data/glossary.json 2>/dev/null > data/shiji/001.json
node scrape.js songshi 369 --glossary data/glossary.json 2>/dev/null > data/songshi/369.json
```

**Note:** The scraper automatically:
- Segments Chinese text into sentences
- Extracts word-level annotations (pinyin, definitions)
- Aligns existing English translations when available
- Updates the shared glossary
- Merges orphan closing quotes with previous sentences

### Data Structure

```
data/
├── glossary.json              # Shared glossary across all 24 histories
├── manifest.json              # Index of all scraped chapters
├── shiji/                     # Records of the Grand Historian
│   ├── 001.json
│   ├── 002.json
│   └── ... (130 chapters)
├── hanshu/                    # Book of Han
│   ├── 001.json
│   └── ... (100 chapters)
└── [other books]/
    └── ...
```

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

## Translation Alignment

The scraper includes an improved alignment algorithm (`align-translations.js`) that matches Chinese sentences with English translations when available (currently only early Shiji chapters have translations from chinesenotes.com).

The algorithm:
- Generates multiple candidate alignments using different distribution strategies
- Scores each alignment based on:
  - Character-to-word ratio consistency across sentence pairs
  - Penalties for unmapped Chinese sentences
- Selects the best-scoring alignment

For histories without English translations, the alignment step is automatically skipped.

## Translation Workflow

### Translating a Chapter

This project uses AI-assisted translation (e.g. with Claude Sonnet 4) to translate untranslated or partially translated chapters.

**Step 1: Extract untranslated sentences**

```bash
# Extract untranslated sentences from a chapter
node extract-untranslated.js data/shiji/010.json

# Output: translations/untranslated_010.json
# Contains: { "s0001": "Chinese text...", "s0002": "..." }
```

**Step 2: Create translations file**

Manually create `translations/translations_010.json` with English translations:

```json
{
  "s0001": "English translation of sentence 1...",
  "s0002": "English translation of sentence 2...",
  ...
}
```

**Note:** Ensure translations do NOT start with closing quotation marks (`"` or `」`). The quote should be at the end of the previous sentence.

**Step 3: Apply translations to chapter**

```bash
node apply-translations.js data/shiji/010.json translations/translations_010.json "Garrett M. Petersen (2025)" "claude-sonnet-4"
```

(Substitute in the model used if different.)

This merges the translations into the chapter JSON file and updates metadata.

**Step 4: Update everything**

```bash
make update
```

This will:
1. Update citations
2. Fix translated counts
3. Regenerate manifest
4. Generate static HTML pages for SEO
5. Sync data to public/

**Step 5: Clean up (optional)**

After successfully applying translations, you can archive or delete the translation work files:

```bash
# The translations are now in the chapter JSON
# You can remove the temporary files if desired
rm translations/untranslated_010.json translations/translations_010.json
```

### Translation File Organization

```
translations/
├── untranslated_005.json    # Sentences needing translation
├── translations_005.json    # Completed translations
├── untranslated_007.json
├── translations_007.json
└── ...
```

### Quality Control

After translating, you can:

```bash
# Check for orphan quotes
node find-orphan-quotes.js data/shiji/010.json

# Fix orphan quotes
node fix-orphan-quotes.js data/shiji/010.json

# Fix doubled quotes
node fix-double-quotes.js data/shiji/010.json
```

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
          "translations": [
            {
              "lang": "en",
              "text": "Huangdi (Yellow emperor) was the son of Shaodian...",
              "translator": "Herbert J. Allen (1894)"
            }
          ]
        }
      ],
      "translations": [
        {
          "lang": "en",
          "text": "Huangdi (Yellow emperor) was the son of Shaodian...",
          "translator": "Herbert J. Allen (1894)"
        }
      ]
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
  - `sentences`: Array with sentence-level Chinese text (`zh`) and translations
  - `id`: Unique sentence identifier for alignment (e.g., `s0001`)
  - `translations`: Sentence-level English translation when available (aligned from paragraph)
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

### Building the Site

After scraping or translating chapters:

```bash
make update
```

This runs the complete build process:
1. Updates citations metadata
2. Fixes translated counts
3. Generates manifest.json
4. **Generates static HTML pages for SEO**
5. Syncs data to public/

**Individual commands:**

```bash
make manifest          # Generate manifest.json
make generate-pages    # Generate static HTML pages
make sync              # Copy data/ to public/data/
```

### Static Pages for SEO

The site generates individual HTML files for each chapter with:
- Full content embedded (not loaded via JavaScript)
- Unique URLs (`/shiji/006.html`, `/shiji/007.html`, etc.)
- Proper meta tags (title, description, Open Graph)
- Schema.org structured data for search engines
- Previous/Next chapter navigation
- Translation percentage badges

**Generate static pages:**

```bash
# Generate all chapters for all books
node generate-static-pages.js

# Generate all chapters for one book
node generate-static-pages.js --book shiji

# Generate one specific chapter
node generate-static-pages.js --book shiji --chapter 006
```

### Running Locally

```bash
cd public && python3 -m http.server 8000
```

Then visit http://localhost:8000

### Deployment

Deploy to Cloudflare Pages by deploying the `public/` directory.

The site includes:
- Privacy Policy page (`/privacy.html`)
- About page (`/about.html`)
- ads.txt for Google AdSense
- Static HTML pages for each chapter

## License

ISC