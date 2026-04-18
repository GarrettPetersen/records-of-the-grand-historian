# AGENTS.md

## Cursor Cloud specific instructions

This is a static-site project (no framework, no build toolchain, no database). All scripts are vanilla Node.js ES modules requiring Node v22+.

### Key commands

- **Install deps:** `npm install` (sole dependency is `cheerio`)
- **Build/rebuild site:** `make update` — runs citations, counts, manifest, progress, static page generation, and data sync to `public/`
- **Validate JSON:** `make validate` (requires `jq`)
- **Serve locally:** `cd public && python3 -m http.server 8000`
- **View stats:** `make stats`
- See `make help` and the README for full command reference.

### Translation workflow

The standard translation loop is: `make start-translation BOOK=<book>` → fill in translations → `make submit-translations` (or `make continue`). See `prompt.txt` and README for full details.

- **Economical model choice:** The bulk of chapters consist of formulaic annalistic military records ("In year X, General Y attacked Z"). A less expensive model handles these well. Reserve a more capable model for famous rhetorical passages (speeches, debates, Sima Qian's commentary) where literary quality matters most.
- **TRANSLATOR and MODEL metadata:** Always use `TRANSLATOR="Garrett M. Petersen (2026)"` and set `MODEL` to the actual model name you are running as (e.g. `MODEL="Composer 2"`). Do **not** use your agent identity (e.g. "Cursor Agent") as the translator — the translator is always **Garrett M. Petersen**.
- **Article validator:** The `submit-translations.js` validator warns (non-blocking) when idiomatic translations lack English articles (`the`/`a`/`an`). These are informational only and do not block submission.
- **FILE= parameter:** Always use `FILE=translations/current_translation_shiji.json` (or the appropriate book name) with `make submit-translations` to avoid ambiguity if multiple translation files exist.
- **Batch size:** `start-translation` extracts 100 sentences per batch by default. For a 244-sentence chapter, expect ~3 batches. Commit every 4 batches per the workflow convention.
- **Score-translations length mismatches:** The quality scorer flags "length mismatch" for short classical Chinese sentences with longer English translations. These are false positives inherent to translating terse classical Chinese and can be ignored.

### Gotchas

- `jq` is a required system tool for `make validate` and scraping targets — it is pre-installed in the VM.
- There is no linter, test suite, or TypeScript — the project has `"test": "echo \"Error: no test specified\" && exit 1"` in `package.json`.
- The `make update` command is the canonical "build" step; it regenerates all static HTML pages and syncs data to `public/`.
- Scraping targets (`make shiji-001`, etc.) require internet access to chinesenotes.com/ctext.org and are interactive (prompt before overwriting translated chapters).
- `package-lock.json` is gitignored, so `npm install` resolves latest compatible versions each time.
