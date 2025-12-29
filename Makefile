# Makefile for scraping the 24 Dynastic Histories
#
# Usage:
#   make shiji-001                    # Scrape a specific chapter
#   make shiji CHAPTERS="001 002 003" # Scrape multiple chapters
#   make shiji-all                    # Scrape all known Shiji chapters (1-130)
#   make hanshu-001                   # Scrape Book of Han chapter 1
#   make clean-shiji                  # Remove all scraped Shiji data
#   make manifest                     # Generate manifest.json for web frontend

GLOSSARY := data/glossary.json
NODE := node
SCRAPE := $(NODE) scrape.js
STDERR_REDIRECT := 2>/dev/null

# Create data directories
data/shiji data/hanshu data/houhanshu data/sanguozhi data/jinshu data/songshu data/nanqishu data/liangshu data/chenshu data/weishu data/beiqishu data/zhoushu data/suishu data/nanshi data/beishi data/jiutangshu data/xintangshu data/jiuwudaishi data/xinwudaishi data/songshi data/liaoshi data/jinshi data/yuanshi data/mingshi:
	@mkdir -p $@

# Default target
.PHONY: help
help:
	@echo "Makefile for scraping the 24 Dynastic Histories"
	@echo ""
	@echo "Common commands:"
	@echo "  make update                 # Fix counts, regenerate manifest, sync (run after manual edits)"
	@echo "  make shiji-001              # Scrape Shiji chapter 1"
	@echo "  make shiji-010              # Scrape Shiji chapter 10"
	@echo "  make shiji-all              # Scrape all Shiji chapters (1-130)"
	@echo "  make hanshu-all             # Scrape all Hanshu chapters (1-100)"
	@echo ""
	@echo "Scraping commands:"
	@echo "  make <book>-<chapter>       # Scrape single chapter (e.g., make songshi-369)"
	@echo "  make ctext BOOK=shiji CHAPTER=013 CTEXT_URL='https://ctext.org/shiji/san-dai-shi-biao'  # Scrape from ctext.org"
	@echo "  make <book> CHAPTERS='...'  # Scrape multiple (e.g., make shiji CHAPTERS='001 002')"
	@echo "  make list                   # List all 24 books available to scrape"
	@echo ""
	@echo "Maintenance commands:"
	@echo "  make fix-counts             # Recalculate translatedCount in all chapter files"
	@echo "  make nuke-translations      # ⚠️  Emergency: Remove ALL translations from a chapter"
	@echo "  make manifest               # Generate manifest.json (includes sync)"
	@echo "  make generate-pages         # Generate static HTML pages for SEO"
	@echo "  make sync                   # Copy data/ to public/data/ for web frontend"
	@echo "  make stats                  # Show chapter counts per book"
	@echo "  make validate               # Check all JSON files are valid"
	@echo "  make score-translations     # Score translations for quality issues"
	@echo "  make batch-quality-check    # Batch quality check on multiple chapters (all books)"
	@echo "  make quality-score          # Score translation quality subjectively (1-10 scale)"
	@echo "  make first-untranslated     # Find first chapter needing idiomatic translations"
	@echo "  make first-untranslated BOOK=hanshu  # Find in specific book only"
	@echo "  make start-translation BOOK=shiji     # Start translation session (extract 50 sentences)"
	@echo "  make continue                        # Submit current batch and start next (quicker workflow)"
	@echo "  make submit-translations TRANSLATOR=\"Garrett M. Petersen (2025)\" MODEL=\"grok-1.5\"  # Submit translations from current_translation.json"
	@echo "  make submit-translations TRANSLATOR=\"...\" MODEL=\"...\" FILE=\"path/to/file.json\"  # Submit from custom file"
	@echo ""
	@echo "Cleanup commands:"
	@echo "  make clean-shiji            # Remove all Shiji data"
	@echo "  make clean-hanshu           # Remove all Hanshu data"
	@echo "  make clean-all              # Remove all scraped data"
	@echo "  make clean-translations     # Remove all temporary translation files"
	@echo ""
	@echo "Books available: shiji, hanshu, houhanshu, sanguozhi, jinshu, songshu,"
	@echo "                 nanqishu, liangshu, chenshu, weishu, beiqishu, zhoushu,"
	@echo "                 suishu, nanshi, beishi, jiutangshu, xintangshu,"
	@echo "                 jiuwudaishi, xinwudaishi, songshi, liaoshi, jinshi,"
	@echo "                 yuanshi, mingshi"

# List available books
.PHONY: list
list:
	@$(SCRAPE) --list

# Sync data to public directory for frontend
.PHONY: sync
sync:
	@echo "Syncing data to public/data..."
	@mkdir -p public/data
	@for dir in data/*/; do \
		if [ -d "$$dir" ] && [ "$$(basename $$dir)" != "public" ]; then \
			book=$$(basename $$dir); \
			mkdir -p public/data/$$book; \
			cp -r $$dir*.json public/data/$$book/ 2>/dev/null || true; \
			echo "  Synced $$book"; \
		fi; \
	done
	@cp data/glossary.json public/data/ 2>/dev/null || true
	@cp data/manifest.json public/data/ 2>/dev/null || true
	@echo "Sync complete."

# Generate static HTML pages for SEO
.PHONY: generate-pages
generate-pages:
	@echo "Generating static HTML pages..."
	@$(NODE) generate-static-pages.js
	@echo "Static pages generated."

# Update workflow: update citations, fix counts, regenerate manifest, generate static pages, sync to public
# Run this after any manual edits to chapter JSON files
.PHONY: update
update:
	@echo "=== Running update workflow ==="
	@echo "🎯 Remember: Translate like Ken Liu - prioritize semantic fidelity and modern readability"
	@echo "   • Focus on semantic fidelity and modern readability"
	@echo "   • Avoid added narrative or stylistic ornament"
	@echo "   • Aim for the literary quality and natural flow of Ken Liu's translation style"
	@echo ""
	@echo "Step 1/5: Updating citations..."
	@$(NODE) update-citations.js
	@echo ""
	@echo "Step 2/5: Fixing translated counts..."
	@$(NODE) fix-translated-counts.js || echo "Note: fix-translated-counts.js not found, skipping..."
	@echo ""
	@echo "Step 3/5: Regenerating manifest..."
	@$(NODE) generate-manifest.js
	@echo ""
	@echo "Step 4/5: Generating static pages..."
	@$(NODE) generate-static-pages.js
	@echo ""
	@echo "Step 5/5: Syncing to public..."
	@$(MAKE) sync
	@echo ""
	@echo "=== Update complete ==="

# Fix translated counts in existing files
.PHONY: fix-counts
fix-counts:
	@echo "Recalculating translated counts..."
	@$(NODE) fix-translated-counts.js

# Nuke all translations from a chapter (emergency reset)
.PHONY: nuke-translations
nuke-translations:
	@if [ -z "$(CHAPTER)" ]; then \
		echo "Error: CHAPTER variable not set."; \
		echo "Usage: make nuke-translations CHAPTER=data/shiji/017.json"; \
		exit 1; \
	fi
	@echo "⚠️  NUKING ALL TRANSLATIONS from $(CHAPTER)"
	@echo "This will permanently delete all existing translations!"
	@echo "Press Enter to continue or Ctrl+C to abort..."
	@read -r || true
	@$(NODE) nuke-translations.js $(CHAPTER)
	@echo "✅ Translations nuked. Run 'make update' to update the website."

# Nuke only idiomatic translations from a chapter (preserve literal)
.PHONY: nuke-idiomatic
nuke-idiomatic:
	@if [ -z "$(CHAPTER)" ]; then \
		echo "Error: CHAPTER variable not set."; \
		echo "Usage: make nuke-idiomatic CHAPTER=data/shiji/062.json"; \
		exit 1; \
	fi
	@echo "⚠️  NUKING IDIOMATIC TRANSLATIONS from $(CHAPTER)"
	@echo "This will permanently remove only idiomatic translations while preserving literal ones!"
	@echo "Press Enter to continue or Ctrl+C to abort..."
	@read -r || true
	@$(NODE) nuke-idiomatic-translations.js $(CHAPTER)
	@echo "✅ Idiomatic translations nuked. Run 'make update' to update the website."

# Generate manifest for web frontend
.PHONY: manifest
manifest:
	@echo "Generating manifest..."
	@$(NODE) generate-manifest.js
	@echo "Manifest generated at data/manifest.json"
	@$(MAKE) sync

# Generic rule to scrape a single chapter for any book
# Usage: make <book>-<chapter>
# Example: make shiji-001, make hanshu-042
%-001 %-002 %-003 %-004 %-005 %-006 %-007 %-008 %-009 %-010 \
%-011 %-012 %-013 %-014 %-015 %-016 %-017 %-018 %-019 %-020 \
%-021 %-022 %-023 %-024 %-025 %-026 %-027 %-028 %-029 %-030 \
%-031 %-032 %-033 %-034 %-035 %-036 %-037 %-038 %-039 %-040 \
%-041 %-042 %-043 %-044 %-045 %-046 %-047 %-048 %-049 %-050 \
%-051 %-052 %-053 %-054 %-055 %-056 %-057 %-058 %-059 %-060 \
%-061 %-062 %-063 %-064 %-065 %-066 %-067 %-068 %-069 %-070 \
%-071 %-072 %-073 %-074 %-075 %-076 %-077 %-078 %-079 %-080 \
%-081 %-082 %-083 %-084 %-085 %-086 %-087 %-088 %-089 %-090 \
%-091 %-092 %-093 %-094 %-095 %-096 %-097 %-098 %-099 %-100 \
%-101 %-102 %-103 %-104 %-105 %-106 %-107 %-108 %-109 %-110 \
%-111 %-112 %-113 %-114 %-115 %-116 %-117 %-118 %-119 %-120 \
%-121 %-122 %-123 %-124 %-125 %-126 %-127 %-128 %-129 %-130 \
%-131 %-132 %-133 %-134 %-135 %-136 %-137 %-138 %-139 %-140 \
%-141 %-142 %-143 %-144 %-145 %-146 %-147 %-148 %-149 %-150 \
%-151 %-152 %-153 %-154 %-155 %-156 %-157 %-158 %-159 %-160 \
%-161 %-162 %-163 %-164 %-165 %-166 %-167 %-168 %-169 %-170 \
%-171 %-172 %-173 %-174 %-175 %-176 %-177 %-178 %-179 %-180 \
%-181 %-182 %-183 %-184 %-185 %-186 %-187 %-188 %-189 %-190 \
%-191 %-192 %-193 %-194 %-195 %-196 %-197 %-198 %-199 %-200 \
%-201 %-202 %-203 %-204 %-205 %-206 %-207 %-208 %-209 %-210 \
%-211 %-212 %-213 %-214 %-215 %-216 %-217 %-218 %-219 %-220 \
%-221 %-222 %-223 %-224 %-225 %-226 %-227 %-228 %-229 %-230 \
%-231 %-232 %-233 %-234 %-235 %-236 %-237 %-238 %-239 %-240 \
%-241 %-242 %-243 %-244 %-245 %-246 %-247 %-248 %-249 %-250 \
%-251 %-252 %-253 %-254 %-255 %-256 %-257 %-258 %-259 %-260 \
%-261 %-262 %-263 %-264 %-265 %-266 %-267 %-268 %-269 %-270 \
%-271 %-272 %-273 %-274 %-275 %-276 %-277 %-278 %-279 %-280 \
%-281 %-282 %-283 %-284 %-285 %-286 %-287 %-288 %-289 %-290 \
%-291 %-292 %-293 %-294 %-295 %-296 %-297 %-298 %-299 %-300 \
%-301 %-302 %-303 %-304 %-305 %-306 %-307 %-308 %-309 %-310 \
%-311 %-312 %-313 %-314 %-315 %-316 %-317 %-318 %-319 %-320 \
%-321 %-322 %-323 %-324 %-325 %-326 %-327 %-328 %-329 %-330 \
%-331 %-332 %-333 %-334 %-335 %-336 %-337 %-338 %-339 %-340 \
%-341 %-342 %-343 %-344 %-345 %-346 %-347 %-348 %-349 %-350 \
%-351 %-352 %-353 %-354 %-355 %-356 %-357 %-358 %-359 %-360 \
%-361 %-362 %-363 %-364 %-365 %-366 %-367 %-368 %-369 %-370 \
%-371 %-372 %-373 %-374 %-375 %-376 %-377 %-378 %-379 %-380 \
%-381 %-382 %-383 %-384 %-385 %-386 %-387 %-388 %-389 %-390 \
%-391 %-392 %-393 %-394 %-395 %-396 %-397 %-398 %-399 %-400 \
%-401 %-402 %-403 %-404 %-405 %-406 %-407 %-408 %-409 %-410 \
%-411 %-412 %-413 %-414 %-415 %-416 %-417 %-418 %-419 %-420 \
%-421 %-422 %-423 %-424 %-425 %-426 %-427 %-428 %-429 %-430 \
%-431 %-432 %-433 %-434 %-435 %-436 %-437 %-438 %-439 %-440 \
%-441 %-442 %-443 %-444 %-445 %-446 %-447 %-448 %-449 %-450 \
%-451 %-452 %-453 %-454 %-455 %-456 %-457 %-458 %-459 %-460 \
%-461 %-462 %-463 %-464 %-465 %-466 %-467 %-468 %-469 %-470 \
%-471 %-472 %-473 %-474 %-475 %-476 %-477 %-478 %-479 %-480 \
%-481 %-482 %-483 %-484 %-485 %-486 %-487 %-488 %-489 %-490 \
%-491 %-492 %-493 %-494 %-495 %-496 %-497 %-498 %-499 %-500: | data/%
	@$(eval BOOK := $(word 1,$(subst -, ,$@)))
	@$(eval CHAPTER := $(word 2,$(subst -, ,$@)))
	@echo "Scraping $(BOOK) chapter $(CHAPTER)..."
	@if [ -f "data/ctext-urls.json" ]; then \
		CTEXT_URL=$$(jq -r '.$(BOOK)."$(CHAPTER)" // empty' data/ctext-urls.json 2>/dev/null); \
		if [ -n "$$CTEXT_URL" ] && [ "$$CTEXT_URL" != "null" ]; then \
			echo "Using ctext.org URL: $$CTEXT_URL"; \
			$(SCRAPE) $(BOOK) $(CHAPTER) --url "$$CTEXT_URL" --glossary $(GLOSSARY) $(STDERR_REDIRECT) > data/$(BOOK)/$(CHAPTER).json; \
		else \
			$(SCRAPE) $(BOOK) $(CHAPTER) --glossary $(GLOSSARY) $(STDERR_REDIRECT) > data/$(BOOK)/$(CHAPTER).json; \
		fi; \
	else \
		$(SCRAPE) $(BOOK) $(CHAPTER) --glossary $(GLOSSARY) $(STDERR_REDIRECT) > data/$(BOOK)/$(CHAPTER).json; \
	fi
	@echo "Saved to data/$(BOOK)/$(CHAPTER).json"

# Scrape from ctext.org with custom URL
# Usage: make ctext BOOK=shiji CHAPTER=013 CTEXT_URL="https://ctext.org/shiji/san-dai-shi-biao"
.PHONY: ctext
ctext: | data/$(BOOK)
	@if [ -z "$(BOOK)" ]; then \
		echo "Error: BOOK variable not set."; \
		echo "Usage: make ctext BOOK=shiji CHAPTER=013 CTEXT_URL='https://ctext.org/book/chapter-url'"; \
		exit 1; \
	fi
	@if [ -z "$(CHAPTER)" ]; then \
		echo "Error: CHAPTER variable not set."; \
		echo "Usage: make ctext BOOK=shiji CHAPTER=013 CTEXT_URL='https://ctext.org/book/chapter-url'"; \
		exit 1; \
	fi
	@if [ -z "$(CTEXT_URL)" ]; then \
		echo "Error: CTEXT_URL variable not set."; \
		echo "Usage: make ctext BOOK=shiji CHAPTER=013 CTEXT_URL='https://ctext.org/book/chapter-url'"; \
		exit 1; \
	fi
	@echo "Scraping $(BOOK) chapter $(CHAPTER) from ctext.org..."
	@$(SCRAPE) $(BOOK) $(CHAPTER) --url "$(CTEXT_URL)" --glossary $(GLOSSARY) $(STDERR_REDIRECT) > data/$(BOOK)/$(CHAPTER).json
	@echo "Saved to data/$(BOOK)/$(CHAPTER).json"

# Scrape multiple chapters of a book
# Usage: make shiji CHAPTERS="001 002 003"
.PHONY: shiji hanshu houhanshu sanguozhi jinshu songshu nanqishu liangshu chenshu weishu beiqishu zhoushu suishu nanshi beishi jiutangshu xintangshu jiuwudaishi xinwudaishi songshi liaoshi jinshi yuanshi mingshi
shiji hanshu houhanshu sanguozhi jinshu songshu nanqishu liangshu chenshu weishu beiqishu zhoushu suishu nanshi beishi jiutangshu xintangshu jiuwudaishi xinwudaishi songshi liaoshi jinshi yuanshi mingshi: | data/$@
	@if [ -z "$(CHAPTERS)" ]; then \
		echo "Error: CHAPTERS variable not set."; \
		echo "Usage: make $@ CHAPTERS='001 002 003'"; \
		exit 1; \
	fi
	@for chapter in $(CHAPTERS); do \
		echo "Scraping $@ chapter $$chapter..."; \
		$(SCRAPE) $@ $$chapter --glossary $(GLOSSARY) $(STDERR_REDIRECT) > data/$@/$$chapter.json; \
		echo "Saved to data/$@/$$chapter.json"; \
	done

# Scrape all chapters for specific books (predefined ranges)
# Shiji has 130 chapters
.PHONY: shiji-all
shiji-all: | data/shiji
	@echo "Scraping all Shiji chapters (1-130)..."
	@for i in $$(seq -f "%03g" 1 130); do \
		if [ ! -f data/shiji/$$i.json ]; then \
			echo "Scraping shiji chapter $$i..."; \
			$(SCRAPE) shiji $$i --glossary $(GLOSSARY) $(STDERR_REDIRECT) > data/shiji/$$i.json && \
			echo "Saved to data/shiji/$$i.json"; \
		else \
			echo "Skipping shiji chapter $$i (already exists)"; \
		fi; \
	done

# Hanshu has 100 chapters
.PHONY: hanshu-all
hanshu-all: | data/hanshu
	@echo "Scraping all Book of Han chapters (1-100)..."
	@for i in $$(seq -f "%03g" 1 100); do \
		if [ ! -f data/hanshu/$$i.json ]; then \
			echo "Scraping hanshu chapter $$i..."; \
			$(SCRAPE) hanshu $$i --glossary $(GLOSSARY) $(STDERR_REDIRECT) > data/hanshu/$$i.json && \
			echo "Saved to data/hanshu/$$i.json"; \
		else \
			echo "Skipping hanshu chapter $$i (already exists)"; \
		fi; \
	done

# Clean targets
.PHONY: clean-shiji clean-hanshu clean-all clean-translations
clean-shiji:
	@echo "Removing all Shiji data..."
	@rm -rf data/shiji/*.json
	@echo "Done."

clean-hanshu:
	@echo "Removing all Book of Han data..."
	@rm -rf data/hanshu/*.json
	@echo "Done."

clean-all:
	@echo "Removing all scraped data..."
	@rm -rf data/*/*.json
	@echo "Done."

clean-translations:
	@echo "Removing all temporary translation files..."
	@rm -f translations/batch_*.json translations/*_translations.json translations/*_filtered.json translations/*_review.json translations/untranslated_*.json
	@echo "Done."

# Force re-scrape (ignore existing files)
.PHONY: force-shiji-all force-hanshu-all
force-shiji-all: | data/shiji
	@echo "Force scraping all Shiji chapters (1-130)..."
	@for i in $$(seq -f "%03g" 1 130); do \
		echo "Scraping shiji chapter $$i..."; \
		$(SCRAPE) shiji $$i --glossary $(GLOSSARY) $(STDERR_REDIRECT) > data/shiji/$$i.json && \
		echo "Saved to data/shiji/$$i.json"; \
	done

force-hanshu-all: | data/hanshu
	@echo "Force scraping all Book of Han chapters (1-100)..."
	@for i in $$(seq -f "%03g" 1 100); do \
		echo "Scraping hanshu chapter $$i..."; \
		$(SCRAPE) hanshu $$i --glossary $(GLOSSARY) $(STDERR_REDIRECT) > data/hanshu/$$i.json && \
		echo "Saved to data/hanshu/$$i.json"; \
	done

# Validate JSON files
.PHONY: validate
validate:
	@echo "Validating all JSON files..."
	@find data -name "*.json" -type f | while read f; do \
		if ! jq empty "$$f" 2>/dev/null; then \
			echo "Invalid JSON: $$f"; \
		fi; \
	done
	@echo "Validation complete."

# Score translations for quality issues
.PHONY: score-translations
score-translations:
	@echo "Scoring translations for quality issues..."
	@if [ -z "$(CHAPTER)" ]; then \
		echo "Error: CHAPTER variable not set."; \
		echo "Usage: make score-translations CHAPTER=data/shiji/015.json"; \
		exit 1; \
	fi
	@$(NODE) score-translations.js $(CHAPTER) || true
	@echo ""
	@echo "🤔 REFLECTION PROMPT: Are these translations Ken Liu quality?"
	@echo "   • Do they prioritize semantic fidelity and modern readability?"
	@echo "   • Do they avoid added narrative or stylistic ornament?"
	@echo "   • Would Ken Liu himself approve of this literary quality?"
	@echo ""
	@echo "If not, consider re-translating weak sentences to match Ken Liu's style."
	@echo "Use 'make extract-review CHAPTER=...' && 'make apply-review CHAPTER=... REVIEW=...' for manual review workflow"

# Batch quality check on multiple chapters
.PHONY: batch-quality-check
batch-quality-check:
	@echo "Running batch quality check..."
	@if [ -z "$(CHAPTERS)" ]; then \
		echo "Error: CHAPTERS variable not set."; \
		echo "Usage: make batch-quality-check CHAPTERS=043-050"; \
		echo "       make batch-quality-check CHAPTERS=hanshu:043-050"; \
		echo "       make batch-quality-check CHAPTERS=all OPTIONS=\"--summary-only\""; \
		echo "       make batch-quality-check CHAPTERS=hanshu:all OPTIONS=\"--detailed\""; \
		echo "       make batch-quality-check CHAPTERS=043,047,050"; \
		echo "Use OPTIONS variable for additional flags like --summary-only, --detailed, etc."; \
		exit 1; \
	fi
	@$(NODE) batch-quality-check.js $(CHAPTERS) $(OPTIONS)

# Score translation quality subjectively (1-10 scale)
.PHONY: quality-score
quality-score:
	@echo "Quality scoring (1-10 scale) - both interactive and programmatic use..."
	@echo "Scoring guidelines:"
	@echo "  1-2: Poor - Major issues with accuracy, readability, or style"
	@echo "  3-4: Adequate - Generally accurate but could be improved"
	@echo "  5-6: Good - Solid translation with minor issues"
	@echo "  7-8: Very Good - High quality, few noticeable issues"
	@echo "  9-10: Excellent - Exceptional translation quality"
	@echo ""
	@echo "Interactive usage:"
	@echo "  make quality-score                    # Score chapters interactively"
	@echo "  make quality-score BOOK=shiji         # Score specific book"
	@echo "  make quality-score CHAPTER=083        # Score specific chapter"
	@echo ""
	@echo "Programmatic/AI usage:"
	@echo "  node score-quality.js --set-score 8 --chapter 083"
	@echo "  node score-quality.js --batch-scores '{\"083\": 8, \"084\": 7}'"
	@echo ""
	@if [ -n "$(BOOK)" ]; then \
		$(NODE) score-quality.js --book $(BOOK); \
	elif [ -n "$(CHAPTER)" ]; then \
		$(NODE) score-quality.js --chapter $(CHAPTER); \
	else \
		$(NODE) score-quality.js; \
	fi

# Extract translations for MANUAL review and editing
# WARNING: This creates a JSON file for manual editing - do not create automated improvement scripts
.PHONY: extract-review
extract-review:
	@echo "Extracting translations for review..."
	@if [ -z "$(CHAPTER)" ]; then \
		echo "Error: CHAPTER variable not set."; \
		echo "Usage: make extract-review CHAPTER=data/shiji/024.json"; \
		exit 1; \
	fi
	@$(NODE) extract-translations-for-review.js $(CHAPTER)

# Apply reviewed translations back to chapter
.PHONY: apply-review
apply-review:
	@echo "Applying reviewed translations..."
	@if [ -z "$(CHAPTER)" ]; then \
		echo "Error: CHAPTER variable must be set."; \
		echo "Usage: make apply-review CHAPTER=data/shiji/076.json"; \
		echo "       (review file will be auto-detected from translations/ folder)"; \
		exit 1; \
	fi
	@chapter_base=$$(basename $(CHAPTER) .json); \
	review_file="translations/review_$${chapter_base}.json"; \
	if [ ! -f "$$review_file" ]; then \
		echo "Error: Review file not found: $$review_file"; \
		echo "Run 'make extract-review CHAPTER=$(CHAPTER)' first."; \
		exit 1; \
	fi; \
	$(NODE) apply-reviewed-translations.js $(CHAPTER) $$review_file
	@echo "Regenerating static page..."
	@$(MAKE) update

# Apply translations from batch file and immediately check quality
.PHONY: apply-translations
apply-translations:
	@echo "Applying translations from batch file..."
	@if [ -z "$(CHAPTER)" ] || [ -z "$(BATCH)" ]; then \
		echo "Error: CHAPTER and BATCH variables must be set."; \
		echo "Usage: make apply-translations CHAPTER=data/shiji/014.json BATCH=translations/batch_014_01_translations.json TRANSLATOR=\"Garrett M. Petersen (2025)\" MODEL=\"grok-1.5\""; \
		exit 1; \
	fi
	@$(NODE) apply-translations.js $(CHAPTER) $(BATCH) "$(TRANSLATOR)" "$(MODEL)"
	@echo "Applied translations. Now checking quality..."
	@$(MAKE) score-translations CHAPTER=$(CHAPTER)

# Count scraped chapters per book
.PHONY: stats
stats:
	@echo "Scraped chapters per book:"
	@for dir in data/*/; do \
		if [ -d "$$dir" ] && [ "$$(basename $$dir)" != "public" ]; then \
			count=$$(find "$$dir" -name "*.json" -type f | wc -l | tr -d ' '); \
			echo "  $$(basename $$dir): $$count chapters"; \
		fi; \
	done

# Find first partially translated chapter (less than 100%)
# Chronological order of the 24 dynastic histories
CHRONOLOGICAL_ORDER := shiji hanshu houhanshu sanguozhi jinshu songshu nanqishu liangshu chenshu weishu beiqishu zhoushu suishu nanshi beishi jiutangshu xintangshu jiuwudaishi xinwudaishi songshi liaoshi jinshi yuanshi mingshi

.PHONY: first-untranslated
first-untranslated:
	@echo "Searching for first chapter needing idiomatic translations..."
	@if [ -n "$(BOOK)" ]; then \
		echo "Searching only in book: $(BOOK)"; \
	else \
		echo "Searching all books in chronological order..."; \
	fi
	@echo "🎯 Remember: Translate like Ken Liu - prioritize semantic fidelity and modern readability"
	@echo "   • Focus on semantic fidelity and modern readability"
	@echo "   • Avoid added narrative or stylistic ornament"
	@echo "   • Aim for the literary quality and natural flow of Ken Liu's translation style"
	@echo "   • Provide BOTH literal and idiomatic translations for each sentence"
	@echo ""
	@found=0; \
	if [ -n "$(BOOK)" ]; then \
		dirs="data/$(BOOK)/"; \
	else \
		dirs=""; \
		for book in $(CHRONOLOGICAL_ORDER); do \
			if [ -d "data/$$book" ]; then \
				dirs="$$dirs data/$$book/"; \
			fi; \
		done; \
		for other_dir in $$(find data -maxdepth 1 -type d -name "*" | grep -v "^data$$" | grep -v "^data/public$$" | sort); do \
			book_name=$$(basename "$$other_dir"); \
			if ! echo "$(CHRONOLOGICAL_ORDER)" | grep -q "$$book_name"; then \
				dirs="$$dirs $$other_dir/"; \
			fi; \
		done; \
	fi; \
	for dir in $$dirs; do \
		if [ -d "$$dir" ] && [ "$$(basename $$dir)" != "public" ]; then \
			book=$$(basename $$dir); \
			for file in $$dir*.json; do \
				if [ -f "$$file" ]; then \
					idiomatic_missing=$$($(NODE) -e " \
						const data = JSON.parse(require('fs').readFileSync('$$file', 'utf8')); \
						let total = 0, missing = 0; \
						for (const block of data.content) { \
							if (block.type === 'paragraph') { \
								for (const sentence of block.sentences || []) { \
									if (sentence.zh && sentence.zh.trim()) { \
										total++; \
										const trans = sentence.translations?.[0]; \
										const translator = trans?.translator; \
										if (translator !== 'Herbert J. Allen (1894)' && (!trans?.idiomatic || !trans.idiomatic.trim())) { \
											missing++; \
										} \
									} \
								} \
							} else if (block.type === 'table_row') { \
								for (const cell of block.cells || []) { \
									if (cell.content && cell.content.trim()) { \
										total++; \
										const translator = cell.translator; \
										if (translator !== 'Herbert J. Allen (1894)' && (!cell.idiomatic || !cell.idiomatic.trim())) { \
											missing++; \
										} \
									} \
								} \
							} else if (block.type === 'table_header') { \
								for (const sentence of block.sentences || []) { \
									if (sentence.zh && sentence.zh.trim()) { \
										total++; \
										const trans = sentence.translations?.[0]; \
										const translator = trans?.translator; \
										if (translator !== 'Herbert J. Allen (1894)' && (!trans?.idiomatic || !trans.idiomatic.trim())) { \
											missing++; \
										} \
									} \
								} \
							} \
						} \
						console.log(missing); \
					" 2>/dev/null || echo "0"); \
					if [ "$$idiomatic_missing" -gt 0 ] 2>/dev/null; then \
						chapter=$$(basename "$$file" .json); \
						total=$$(jq -r '.meta.sentenceCount // 0' "$$file" 2>/dev/null); \
						translated=$$(jq -r '.meta.translatedCount // 0' "$$file" 2>/dev/null); \
						idiomatic_total=$$(echo "$$total - $$idiomatic_missing" | bc 2>/dev/null || echo "0"); \
						percent=$$(echo "scale=1; $$idiomatic_total * 100 / $$total" | bc 2>/dev/null || echo "0"); \
						echo "Found: $$book chapter $$chapter ($$idiomatic_total/$$total = $${percent}% idiomatic)"; \
						echo "  File: $$file"; \
						jq -r '.meta | "  Title: \(.title.zh // .title.raw)", "  English: \(.title.en // "N/A")", "  URL: \(.url)"' "$$file" 2>/dev/null; \
						echo "  Missing idiomatic: $$idiomatic_missing sentences"; \
						found=1; \
						break 2; \
					fi; \
				fi; \
			done; \
		fi; \
	done; \
	if [ $$found -eq 0 ]; then \
		if [ -n "$(BOOK)" ]; then \
			echo "No chapters with missing idiomatic translations found in $(BOOK)!"; \
		else \
		echo "No chapters with missing idiomatic translations found!"; \
		fi; \
	fi

# Continue translation workflow - submit current batch and start next one
.PHONY: continue
continue:
	@echo "Continuing translation workflow..."
	@translation_file="translations/current_translation.json"; \
	if [ ! -f "$$translation_file" ]; then \
		echo "Error: No current translation session found."; \
		echo "Try running: make start-translation BOOK=<book_name>"; \
		exit 1; \
	fi; \
	book=$$(jq -r '.metadata.book // empty' "$$translation_file" 2>/dev/null); \
	if [ -z "$$book" ] || [ "$$book" = "null" ]; then \
		echo "Error: Could not determine book from current translation session."; \
		exit 1; \
	fi; \
	echo "Found translation session for book: $$book"; \
	echo "$$book" > translations/.continue_book.tmp; \
	echo "Step 1/2: Submitting current translations..."; \
	if $(MAKE) submit-translations TRANSLATOR="Garrett M. Petersen (2025)" MODEL="grok-1.5"; then \
		echo ""; \
		echo "Step 2/2: Starting next translation batch..."; \
		book=$$(cat translations/.continue_book.tmp 2>/dev/null); \
		rm -f translations/.continue_book.tmp; \
		if [ -z "$$book" ]; then \
			echo "Error: Could not read book from temporary file."; \
			exit 1; \
		fi; \
		$(MAKE) start-translation BOOK=$$book; \
	else \
		echo "❌ Translation submission failed. Please fix the issues and try again."; \
		rm -f translations/.continue_book.tmp; \
		exit 1; \
	fi

# Start a translation session - find next chapter and extract sentences
.PHONY: start-translation
start-translation:
	@echo "Starting translation session..."
	@if [ -z "$(BOOK)" ]; then \
		echo "Error: BOOK variable not set."; \
		echo "Usage: make start-translation BOOK=shiji"; \
		exit 1; \
	fi
	@echo "🎯 Remember: Translate like Ken Liu - prioritize semantic fidelity and modern readability"
	@echo "   • Focus on semantic fidelity and modern readability"
	@echo "   • Avoid added narrative or stylistic ornament"
	@echo "   • Aim for the literary quality and natural flow of Ken Liu's translation style"
	@echo "   • Provide BOTH literal and idiomatic translations for each sentence"
	@echo ""
	@$(NODE) start-translation.js $(BOOK)

# Submit translations from a translation session
.PHONY: submit-translations
submit-translations:
	@echo "Submitting translations..."
	@if [ -z "$(TRANSLATOR)" ]; then \
		echo "Error: TRANSLATOR variable not set."; \
		echo "Usage: make submit-translations TRANSLATOR=\"Garrett M. Petersen (2025)\" MODEL=\"grok-1.5\""; \
		exit 1; \
	fi
	@if [ -z "$(MODEL)" ]; then \
		echo "Error: MODEL variable not set."; \
		echo "Usage: make submit-translations TRANSLATOR=\"Garrett M. Petersen (2025)\" MODEL=\"grok-1.5\""; \
		exit 1; \
	fi
	@translation_file="translations/current_translation.json"; \
	if [ -n "$(FILE)" ]; then \
		translation_file="$(FILE)"; \
	fi; \
	if [ ! -f "$$translation_file" ]; then \
		echo "Error: Translation file not found: $$translation_file"; \
		exit 1; \
	fi; \
	chapter_file=$$(jq -r '.metadata.file' "$$translation_file" 2>/dev/null); \
	if ! $(NODE) submit-translations.js "$$translation_file" "$(TRANSLATOR)" "$(MODEL)"; then \
		exit 1; \
	fi; \
	echo "Translations applied. Running quality check..."; \
	if [ -n "$$chapter_file" ] && [ "$$chapter_file" != "null" ] && [ -f "$$chapter_file" ]; then \
		$(MAKE) score-translations CHAPTER=$$chapter_file; \
	else \
		echo "Warning: Could not find chapter file to check quality."; \
	fi