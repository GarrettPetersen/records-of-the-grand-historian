# Records of the Grand Historian

A web frontend for translated copies of the official 24 Dynastic Histories of China (二十四史), scraped from [chinesenotes.com](https://chinesenotes.com) and [ctext.org](https://ctext.org).

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

1. **Scrape** - Download Chinese text from chinesenotes.com or ctext.org
2. **Translate** - Manually translate sentences using AI assistance (no automated scripts)
3. **Quality Check** - Validate translations and fix any issues
4. **Build** - Generate static pages and update metadata
5. **Deploy** - Push to Cloudflare Pages

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

Some chapters (especially early Shiji chapters from chinesenotes.com) include existing English translations. The scraper automatically aligns these with the Chinese text using an improved algorithm.

**For chapters with existing translations:** The alignment algorithm matches Chinese sentences with English translations using character-to-word ratios and distribution strategies.

**For chapters without existing translations:** Most chapters start with no English translations, so the alignment step is skipped. You must translate from scratch.

**Note:** The vast majority of chapters in this project have no existing English translations and need to be translated manually by AI assistants.

## Translation Workflow

### Translating a Chapter

This project uses AI-assisted translation to translate untranslated or partially translated chapters. **All translations must be done manually by AI assistants - no automated scripts or batch processing.**

**⚠️ CRITICAL REQUIREMENTS FOR AI TRANSLATORS:**
- YOU are the translator. Translate each sentence individually.
- Provide **real, accurate English translations** - no placeholders, no Chinese text, no "[Translation needed]" messages.
- Maintain **historical accuracy and academic tone**.
- Use **scholarly English** appropriate for classical Chinese historical texts.
- **DO NOT** use automated scripts, batch processing, or external API calls.

### Quick Translation Process

**Step 1: Check what needs translation**

```bash
# Find the next untranslated chapter
make first-untranslated

# Or check a specific chapter's status
node extract-untranslated.js data/shiji/016.json
```

**Step 2: Extract untranslated content**

```bash
# Extract untranslated sentences from a chapter
node extract-untranslated.js data/shiji/016.json

# Output: translations/untranslated_016.json
# Contains: { "s0001": "Chinese text...", "s0002": "..." }
```

**Step 3: Create translation file**

Create `translations/translations_016.json` with your manual translations:

```json
{
  "s0001": "In ancient times, when the Qin dynasty first rose to power...",
  "s0002": "The emperor toured the eastern provinces...",
  "s0003": "Five years passed with these events..."
}
```

**Step 4: Apply translations**

```bash
# Apply your translations to the chapter
node apply-translations.js data/shiji/016.json translations/translations_016.json "Garrett M. Petersen (2025)" "grok-1.5"
```

**Step 5: Verify and update**

```bash
# Update all metadata and rebuild site
make update
```

### Handling Large Chapters

For chapters with 500+ sentences, translate in smaller batches to maintain quality and track progress:

**Step 1: Extract and split into batches**

```bash
# Extract all untranslated sentences
node extract-untranslated.js data/shiji/014.json
# Creates: translations/untranslated_014.json

# Split into manageable batches (use a text editor or jq)
# Create batch_014_01.json (first 100 sentences)
# Create batch_014_02.json (next 100 sentences)
# etc...
```

**Step 2: Translate each batch**

For each batch file, create a corresponding translation file:

```bash
# For batch_014_01.json, create:
# translations/batch_014_01_translations.json
{
  "s0123": "Translation of first sentence...",
  "s0124": "Translation of second sentence...",
  // ... up to 100 entries
}
```

**Step 3: Apply batches sequentially**

```bash
# Apply each batch one at a time
node apply-translations.js data/shiji/014.json translations/batch_014_01_translations.json "Garrett M. Petersen (2025)" "grok-1.5"
node apply-translations.js data/shiji/014.json translations/batch_014_02_translations.json "Garrett M. Petersen (2025)" "grok-1.5"

# Check progress after each batch
node extract-untranslated.js data/shiji/014.json
```

**Step 4: Final update**

```bash
# When all batches are complete
make update
```

### Translation Quality Guidelines

**✅ DO:**
- Translate each sentence individually and accurately
- **Use smooth, flowing English rather than word-by-word, choppy translations**
- Maintain historical and scholarly tone
- Preserve classical Chinese naming conventions
- Use consistent terminology throughout chapters
- Keep cultural and historical context
- Translate such that each sentence is readable and grammatically correct in English

**❌ DON'T:**
- Leave Chinese characters in English translations
- Use modern slang or informal language
- Add commentary or interpretation beyond the text
- Skip difficult sentences - translate everything
- Use automated scripts or batch processing
- Maintain Chinese sentence structure extremely literally in a way that makes the English unreadable

**Common Issues to Avoid:**
- **Orphan quotes:** Ensure closing quotes belong to the correct sentence
- **Run-together words:** Separate concatenated terms (e.g., "EmperorQin" → "Emperor Qin")
- **Inconsistent romanization:** Use standard Pinyin throughout
- **Missing context:** Consider the historical setting and character relationships

If you find that you have used any kind of automated substitution script to translate, delete all translations and start over.

**Quality Check Commands:**

```bash
# Check for translation issues
node score-translations.js data/shiji/016.json

# Find and fix orphan quotes
node find-orphan-quotes.js data/shiji/016.json
node fix-orphan-quotes.js data/shiji/016.json

# Validate JSON structure
make validate

# Review and improve translation readability (manual editing approach)

# Step 1: Extract translations for review
make extract-review CHAPTER=data/shiji/024.json
# Creates review_024.json with all translations

# Step 2: Manually edit the JSON file
# Open review_XXX.json in your editor and improve the "english" fields
# Focus on: readability, grammar, natural English flow, proper punctuation
# This is a MANUAL process - edit each translation individually for quality
# ⚠️ DO NOT create automated scripts to "improve" translations
# ⚠️ Manual review ensures accuracy and maintains scholarly quality

# Step 3: Apply the reviewed translations
make apply-review CHAPTER=data/shiji/024.json REVIEW=review_024.json
```

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

## Sources

Text is scraped from multiple sources:

**Chinese Notes (chinesenotes.com):**
- Primary source for narrative chapters
- Provides word-level annotations (pinyin, definitions)
- Some early Shiji chapters include existing English translations

**CText.org (ctext.org):**
- Used for tabular/genealogical chapters (chapters 13-16, etc.)
- Provides structured historical tables and chronicles
- High-quality classical Chinese texts

**Note:** Most chapters have no existing English translations and must be translated manually by AI assistants.

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