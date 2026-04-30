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
2. **Translate** - Manually translate sentences with both literal and idiomatic versions using AI assistance (automated number translation allowed)
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
make hanshu-all                   # Scrape all 118 Book of Han pages on Chinese Notes (001–118; see Makefile)

# View statistics
make stats                        # Show chapter counts per book

# Find next chapter to translate (prioritizes missing idiomatic translations)
make first-untranslated
make first-untranslated BOOK=hanshu  # Find in specific book only

# Streamlined translation workflow
make start-translation BOOK=shiji     # Start translation session (extract 100 sentences by default)
make submit-translations TRANSLATOR="Garrett M. Petersen (2025)" MODEL="grok-1.5"  # Submit translations
make continue TRANSLATOR="Garrett M. Petersen (2025)" MODEL="grok-1.5"  # Submit & continue to next batch

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

**⚠️ IMPORTANT WORKFLOW NOTE**: Use the streamlined `make start-translation` and `make submit-translations` commands for efficient, error-free translation sessions. Both literal and idiomatic translations are required for each sentence.

This project uses AI-assisted translation to translate untranslated or partially translated chapters. **All substantive translations must be done manually by AI assistants.** Automated number translation is the **only allowable form of scripted translation** for pure numerals.

**⚠️ CRITICAL REQUIREMENTS FOR AI TRANSLATORS:**
- YOU are the translator. Translate each sentence individually.
- Provide **real, accurate English translations** - no placeholders, no Chinese text, no "[Translation needed]" messages.
- Generate **both literal and idiomatic translations** for each sentence
- **Literal translation**: Direct, accurate translation prioritizing semantic fidelity
- **Idiomatic translation**: Natural, flowing English prioritizing modern readability (in Ken Liu style)
- Maintain **historical accuracy and academic tone**.
- Use **scholarly English** appropriate for classical Chinese historical texts.
- **DO NOT** use automated scripts, batch processing, or external API calls (except for approved automated number translation).
- **🚨 CRITICAL WORKFLOW REMINDER**: After running `make start-translation`, you MUST fill in BOTH literal and idiomatic translations for each sentence before running `make submit-translations`. Do NOT leave empty fields!

#### Automated Number Translation (Exception)

**The ONLY allowable form of scripted translation** is the automated number translation for pure numerals:

```bash
# Automatically translate pure number sentences (Arabic and Chinese numerals)
node auto-translate-numbers.js data/shiji/025.json

# Apply the generated translations
node apply-translations.js data/shiji/025.json translations/auto_number_translations_025.json "Garrett M. Petersen (2025)" "grok-1.5"
```

This script **ONLY translates sentences that contain pure numbers** (like `"十九"` → `"19"`, `"42"` → `"42"`). It does not translate any historical content, dialogue, or narrative text. All substantive translation work must be done manually by AI assistants.

### Streamlined Translation Process

The streamlined workflow uses two commands to make translation sessions efficient and error-free:

**Step 1: Start a translation session**

```bash
# Find the next chapter needing translation and extract up to 100 sentences (default)
make start-translation BOOK=shiji
# Optional override:
# make start-translation BOOK=shiji BATCH_SIZE=25

# This creates: translations/current_translation_shiji.json
# Contains up to 100 sentences needing both literal and idiomatic translations
```

**Step 2: Fill in translations**

Edit `translations/current_translation_{book}.json` and provide **both literal and idiomatic translations** for each sentence:

```json
{
  "metadata": {
    "book": "shiji",
    "chapter": "016",
    "file": "data/shiji/016.json"
  },
  "sentences": [
    {
      "id": "s0001",
      "chinese": "太史公讀秦楚之際，曰：",
      "literal": "Grand Historian read between Qin Chu interregnum, said:",
      "idiomatic": "The Grand Historian, reading of the period between Qin and Chu, remarked:"
    },
    {
      "id": "s0002",
      "chinese": "初作難，發於陳涉；",
      "literal": "Initially made difficulty, arose from Chen Sheng;",
      "idiomatic": "The initial uprising began with Chen Sheng;"
    }
  ]
}
```

⚠️ **CRITICAL REQUIREMENTS**:
- **Both literal AND idiomatic translations are required** for each sentence
- **Literal translation**: Direct, accurate translation prioritizing semantic fidelity
- **Idiomatic translation**: Natural, flowing English prioritizing modern readability (Ken Liu style)
- **NO placeholders, NO empty fields, NO Chinese text**
- **Maintain historical accuracy and academic tone**

**Step 3: Submit translations**

```bash
# Validate and apply translations, then run quality checks
make submit-translations TRANSLATOR="Garrett M. Petersen (2025)" MODEL="grok-1.5"

# Use custom file if needed:
make submit-translations TRANSLATOR="Garrett M. Petersen (2025)" MODEL="grok-1.5" FILE="translations/my_custom_file.json"
```

**What happens during submission**:
1. **Validation**: Checks Chinese text matches and both literal/idiomatic translations are present
2. **Application**: Applies translations to the chapter with proper attribution
3. **Quality Check**: Runs `make score-translations` to identify issues
4. **Cleanup**: Deletes the temporary translation file

**Step 3.5: Continue to next batch (optional)**

For efficient multi-batch translation sessions, you can immediately continue to the next batch:

```bash
# After submitting translations, continue with the next batch from the same book
make continue TRANSLATOR="Garrett M. Petersen (2025)" MODEL="grok-1.5"

# This is equivalent to:
# make submit-translations TRANSLATOR="Garrett M. Petersen (2025)" MODEL="grok-1.5"
# make start-translation BOOK=<current-book>
```

**Step 4: Verify and update**

```bash
# Update metadata and rebuild site for the book you edited (fast)
make update BOOK=shiji
# Or rebuild everything under data/ (slower; use after multi-book changes)
make update-all
```

### Alternative: Manual Process (for advanced users)

For manual control over the process, you can still use the individual commands:

```bash
# Find what needs translation
make first-untranslated BOOK=hanshu

# Extract sentences manually
node extract-untranslated.js data/hanshu/008.json

# Validate and apply manually
node validate-translations.js data/hanshu/008.json translations/untranslated_008.json
node apply-translations.js data/hanshu/008.json translations/untranslated_008.json "Garrett M. Petersen (2025)" "grok-1.5"
```

### Large Chapters

The streamlined workflow automatically handles large chapters by extracting up to 100 sentences at a time by default. For chapters with hundreds of untranslated sentences:

1. **Run multiple translation sessions**:
   ```bash
   # First batch of up to 100 sentences
   make start-translation BOOK=shiji
   # Fill in translations...
   make submit-translations TRANSLATOR="Garrett M. Petersen (2025)" MODEL="grok-1.5"

   # Next batch (quick continue)
   make continue TRANSLATOR="Garrett M. Petersen (2025)" MODEL="grok-1.5"
   # Fill in translations...
   make continue TRANSLATOR="Garrett M. Petersen (2025)" MODEL="grok-1.5"

   # Repeat make continue until chapter is complete
   ```

2. **Check overall progress**:
   ```bash
   make first-untranslated BOOK=shiji  # Shows current status
   ```

**Note**: Sentences already translated by Herbert J. Allen (1894) are automatically skipped to maintain proper attribution.

**Step 4: Final update**

```bash
# When all batches are complete
make update BOOK=shiji
```

### Translation Quality Guidelines

### Dual Translation Approach

To combat AI translation slippage toward overly literal renderings, this project requires **both literal and idiomatic translations** for each sentence:

- **Literal Translation**: Direct, semantically faithful translation prioritizing accuracy over flow
- **Idiomatic Translation**: Natural, flowing English translation prioritizing readability (Ken Liu style)

**Benefits:**
- Forces explicit consideration of both accuracy and readability
- Prevents gradual drift toward literal translations
- Provides multiple translation options for different reading preferences
- Enables quality control by comparing literal vs idiomatic versions

**Frontend Behavior:**
- Displays **idiomatic** translation when available (preferred for reading)
- Falls back to **literal** translation if idiomatic is missing
- Maintains backward compatibility with legacy "text" fields

**🎯 TRANSLATE LIKE KEN LIU:**
- **Idiomatic translation**: Prioritize semantic fidelity and modern readability with no added narrative or stylistic ornament
- **Literal translation**: Provide direct, accurate translation as reference
- Aim for the literary quality and natural flow of Ken Liu's translation style
- Focus on accurate meaning while ensuring smooth, readable English

**✅ DO:**
- Translate each sentence individually with **both literal and idiomatic versions**
- **Idiomatic**: Use smooth, flowing English rather than word-by-word, choppy translations
- **Literal**: Provide direct, accurate translation as reference
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
- Use automated scripts or batch processing (except for approved automated number translation)
- Maintain Chinese sentence structure extremely literally in a way that makes the English unreadable

**Common Issues to Avoid:**
- **Orphan quotes:** Ensure closing quotes belong to the correct sentence
- **Run-together words:** Separate concatenated terms (e.g., "EmperorQin" → "Emperor Qin")
- **Inconsistent romanization:** Use standard Pinyin throughout
- **Missing context:** Consider the historical setting and character relationships

If you find that you have used any kind of automated substitution script to translate (except for the approved auto-translate-numbers.js script for pure numerals), delete all translations and start over.

**Migration Note:** All existing translations have been migrated to the dual literal/idiomatic format. Herbert J. Allen (1894) translations are automatically placed in the "idiomatic" field. Progress tracking now prioritizes idiomatic translation completeness.

**Quality Check Commands:**

```bash
# Check individual chapter for translation issues
node score-translations.js data/shiji/016.json

# Batch quality check multiple chapters at once
node batch-quality-check.js 043-050 --summary-only
node batch-quality-check.js hanshu:001-010 --detailed
node batch-quality-check.js all --output=json

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
# ⚠️ DO NOT create automated scripts to "improve" translations (except for approved automated number translation)
# ⚠️ Manual review ensures accuracy and maintains scholarly quality

# Step 3: Apply the reviewed translations
make apply-review CHAPTER=data/shiji/024.json REVIEW=review_024.json
```

### Batch Quality Checking

Run automated quality checks on multiple chapters at once. The batch quality checker detects technical issues like length mismatches, corrupted characters, and missing translations.

**Usage:**
```bash
node batch-quality-check.js <chapter-spec> [options]
```

**Chapter Specifications:**
- `043-050` - Range of chapters (shiji by default)
- `hanshu:043-050` - Range of chapters in specific book
- `043,045,047` - Specific chapters
- `all` - All available chapters (shiji by default)
- `hanshu:all` - All chapters in specific book
- `data/hanshu/*.json` - Glob patterns

**Options:**
- `--summary-only` - Show only summary statistics
- `--detailed` - Show detailed problems for each chapter
- `--samples-only` - Show only random samples, skip problem details
- `--output=json` - Output results as JSON
- `--min-problems=N` - Only show chapters with N+ problems

**Examples:**
```bash
# Direct script usage
node batch-quality-check.js 043-050 --summary-only
node batch-quality-check.js hanshu:001-010 --detailed
node batch-quality-check.js all --output=json
node batch-quality-check.js hanshu:all --min-problems=5

# Makefile usage
make batch-quality-check CHAPTERS=043-050 OPTIONS="--summary-only"
make batch-quality-check CHAPTERS=hanshu:001-010 OPTIONS="--detailed"
make batch-quality-check CHAPTERS=all OPTIONS="--output=json"
```

**Quality Checks Performed:**
- ✅ Length ratio validation (Chinese vs English)
- ✅ Corrupted character detection
- ✅ Missing translation detection
- ✅ Chinese characters in English detection
- ✅ Random spot-check sampling for manual review

**Step 4: Update everything**

```bash
make update BOOK=hanshu
# or: make update-all
```

This will (per book with `make update BOOK=…`, or all books with `make update-all`):
1. Update citations
2. Fix translated counts
3. Regenerate manifest (single-book mode merges that book into the existing manifest)
4. Generate translation progress data (single-book mode merges that book into `progress.json`)
5. Generate static HTML pages for SEO
6. Generate Open Graph share images (PNG)
7. Sync chapter JSON to `public/data/` (single-book sync copies only that book’s JSON plus manifest and glossary)

## Quality Scoring

After translating chapters, you can score their quality subjectively using a 1-10 scale:

**Interactive Quality Scoring:**

```bash
# Score chapters interactively
make quality-score

# Score chapters from a specific book
make quality-score BOOK=shiji

# Score a specific chapter
make quality-score CHAPTER=083

# View scoring statistics
node score-quality.js --stats

# List unscored chapters
node score-quality.js --list
```

**AI/Programmatic Quality Scoring:**

The scoring tool is designed for both human and AI use:

```bash
# Set score for a specific chapter
node score-quality.js --set-score 8 --chapter 083

# Set score for a chapter in a different book
node score-quality.js --set-score 9 --chapter 042 --book hanshu

# Batch score multiple chapters at once
node score-quality.js --batch-scores '{"083": 8, "084": 7, "085": 9}'

# Show help and all options
node score-quality.js --help
```

**Quality Scoring Scale:**
- **1-2**: Poor - Major issues with accuracy, readability, or style
- **3-4**: Adequate - Generally accurate but could be improved
- **5-6**: Good - Solid translation with minor issues
- **7-8**: Very Good - High quality, few noticeable issues
- **9-10**: Excellent - Exceptional translation quality

The scoring system preserves scores when regenerating the manifest, so your subjective quality assessments are maintained across updates.

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
              "literal": "Huangdi (Yellow emperor) was the son of Shaodian...",
              "idiomatic": "The Yellow Emperor was Shaodian's son...",
              "translator": "Garrett M. Petersen (2025)",
              "model": "grok-1.5"
            }
          ]
        }
      ],
      "translations": [
        {
          "lang": "en",
          "literal": "Huangdi (Yellow emperor) was the son of Shaodian...",
          "idiomatic": "The Yellow Emperor was Shaodian's son...",
          "translator": "Garrett M. Petersen (2025)",
          "model": "grok-1.5"
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

### Translation Schema: Literal vs Idiomatics

This project uses a dual translation approach to ensure both accuracy and readability:

- **Literal Translation**: Direct, semantically faithful translation prioritizing accuracy
- **Idiomatic Translation**: Natural, flowing English prioritizing readability (Ken Liu style)

**Frontend Display Priority:**
1. Show **idiomatic** translation when available
2. Fall back to **literal** translation if idiomatic is missing
3. Fall back to legacy "text" field for backward compatibility

**Progress Tracking:**
- `make first-untranslated` prioritizes chapters missing idiomatic translations
- Translation completeness considers idiomatic availability first

### Structure Details

- **meta**: Book info, chapter, title (Chinese & English when available), counts, timestamp
- **content**: Array of paragraph blocks, each containing:
  - `sentences`: Array with sentence-level Chinese text (`zh`) and translations
  - `id`: Unique sentence identifier for alignment (e.g., `s0001`)
  - `translations`: Sentence-level English translation object with `literal`/`idiomatic` fields
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
make update BOOK=shiji
# Full rebuild for every book:
make update-all
```

This runs the build pipeline (seven steps): citations, translated counts, manifest, progress, static HTML, OG PNGs, and sync. Use `BOOK=` to limit work and file copies to one book; use `make update-all` when you need the entire site refreshed.

**Individual commands:**

```bash
make manifest                    # Generate manifest.json (all books)
make manifest BOOK=shiji        # Merge one book into manifest (requires existing manifest)
make generate-pages              # Static HTML + OG images (all books)
make generate-pages BOOK=shiji   # Same for one book only
make sync                        # Copy all book JSON + manifest + glossary to public/data/
make sync BOOK=shiji             # Copy one book’s JSON + manifest + glossary
make progress                    # Regenerate progress.json (all books)
make progress BOOK=shiji         # Recompute one book in progress.json (merge)
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

### Deployment (Cloudflare Pages)

**The Build command in the Pages dashboard cannot be empty.** If it is blank, Cloudflare does not run Node: it only uploads whatever is already committed under `public/`. You will not get fresh `manifest.json` / static HTML / **`public/og/*.png`** share cards from the generator on that deploy.

**Pages project settings**

| Setting | Value |
| --- | --- |
| **Build command** | `npm run build` (required) |
| **Build output directory** | `public` |
| **Root directory** | `/` (repository root) |
| **Node.js version** | **22** (see `.node-version` and `package.json` `engines`) |

The build runs, in order: sync chapter JSON into `public/data/`, regenerate `manifest.json` and `progress.json`, regenerate static HTML, then write **`public/sitemap.xml`** and **`public/robots.txt`** (`scripts/generate-sitemap.mjs`), then render OG PNGs incrementally (first build may download the Noto CJK font; network required). `wrangler.toml` only sets `pages_build_output_dir` for Wrangler CLI; it does **not** replace the dashboard build command for Git-connected Pages.

**Open Graph rasters** live under **`public/og/`** as **`*.png`** plus **`*.png.sha256`** input fingerprints; they are **committed** so Pages clones include them and incremental skips avoid re-rendering when sources are unchanged. If `/og/site.png` ever returns HTML instead of PNG after a deploy, see `AGENTS.md` under Cloudflare Pages.

For local iteration you can still use `make update BOOK=…` / `make update-all`; commit source and `data/` changes. Production parity requires the dashboard build command above so each push runs `npm run build` on Cloudflare.

The site includes:
- Privacy Policy page (`/privacy.html`)
- About page (`/about.html`)
- ads.txt for Google AdSense
- Static HTML pages for each chapter

## License

ISC
