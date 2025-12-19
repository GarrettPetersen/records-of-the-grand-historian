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
	@echo "  make first-untranslated     # Find first chapter needing translation"
	@echo ""
	@echo "Cleanup commands:"
	@echo "  make clean-shiji            # Remove all Shiji data"
	@echo "  make clean-hanshu           # Remove all Hanshu data"
	@echo "  make clean-all              # Remove all scraped data"
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
	@$(SCRAPE) $(BOOK) $(CHAPTER) --glossary $(GLOSSARY) $(STDERR_REDIRECT) > data/$(BOOK)/$(CHAPTER).json
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
.PHONY: clean-shiji clean-hanshu clean-all
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
	@$(NODE) score-translations.js $(CHAPTER)

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

# Find first untranslated chapter
.PHONY: first-untranslated
first-untranslated:
	@echo "Searching for first untranslated chapter..."
	@found=0; \
	for dir in data/*/; do \
		if [ -d "$$dir" ] && [ "$$(basename $$dir)" != "public" ]; then \
			book=$$(basename $$dir); \
			for file in $$dir*.json; do \
				if [ -f "$$file" ]; then \
					translated=$$(jq -r '.meta.translatedCount // 0' "$$file" 2>/dev/null); \
					if [ "$$translated" = "0" ]; then \
						chapter=$$(basename "$$file" .json); \
						echo "Found: $$book chapter $$chapter"; \
						echo "  File: $$file"; \
						jq -r '.meta | "  Title: \(.title.zh // .title.raw)", "  Sentences: \(.sentenceCount)", "  URL: \(.url)"' "$$file" 2>/dev/null; \
						found=1; \
						break 2; \
					fi; \
				fi; \
			done; \
		fi; \
	done; \
	if [ $$found -eq 0 ]; then \
		echo "No untranslated chapters found!"; \
	fi