# AGENTS.md

## Cursor Cloud specific instructions

This is a static-site project (no framework, no build toolchain, no database). All scripts are vanilla Node.js ES modules requiring Node v22+.

### Key commands

- **Install deps:** `npm install` (includes `cheerio`, `satori`, `react`, `@resvg/resvg-js` for OG share images)
- **Build/rebuild site:** `make update BOOK=<book>` — runs citations, counts, manifest (merge), progress (merge), static HTML, **Open Graph PNGs** (`generate-og-images.js`), and sync for that book only. Use `make update-all` for every book under `data/` (full rebuild).
- **Cloudflare Pages:** Build command **`npm run build`** (see `package.json`). Output directory **`public`**. Regenerates manifest, progress, static HTML, and **all** `public/og/**/*.png` files. **Do not gitignore those PNGs:** Pages can omit gitignored build outputs from the deploy, so `/og/*.png` would incorrectly return the HTML shell. The build ends with `scripts/verify-og-assets.mjs` to require a valid `public/og/site.png`.
- **OG images:** First run downloads Noto Serif CJK OTF into `fonts/.cache/` (gitignored). Override with `OG_FONT_PATH` + `OG_FONT_FAMILY`. Canonical URLs use `SITE_URL` (default `https://24histories.com`) in `generate-static-pages.js` and `generate-og-images.js`.
- **Validate JSON:** `make validate` (requires `jq`)
- **Serve locally:** `cd public && python3 -m http.server 8000`
- **View stats:** `make stats`
- See `make help` and the README for full command reference.

### Translation workflow

The standard translation loop is: `make start-translation BOOK=<book>` → fill in translations → `make submit-translations` (or `make continue`). See `prompt.txt` and README for full details.

- **Economical model choice:** The bulk of chapters consist of formulaic annalistic military records ("In year X, General Y attacked Z"). A less expensive model handles these well. Reserve a more capable model for famous rhetorical passages (speeches, debates, Sima Qian's commentary) where literary quality matters most.
- **TRANSLATOR and MODEL metadata:** Always use `TRANSLATOR="Garrett M. Petersen (2026)"` and set `MODEL` to the actual model name you are running as (e.g. `MODEL="Opus 4.6"`). Do **not** use your agent identity (e.g. "Cursor Agent") as the translator — the translator is always **Garrett M. Petersen**.
- **Article validator:** The `submit-translations.js` validator warns (non-blocking) when idiomatic translations lack English articles (`the`/`a`/`an`). These are informational only and do not block submission.
- **FILE= parameter:** Always use `FILE=translations/current_translation_shiji.json` (or the appropriate book name) with `make submit-translations` to avoid ambiguity if multiple translation files exist.
- **Batch size:** `start-translation` extracts 100 sentences per batch by default. For a 244-sentence chapter, expect ~3 batches. Commit every 4 batches per the workflow convention.
- **Score-translations length mismatches:** The quality scorer flags "length mismatch" for short classical Chinese sentences with longer English translations. These are false positives inherent to translating terse classical Chinese and can be ignored.

### Gotchas

- `jq` is a required system tool for `make validate` and scraping targets — it is pre-installed in the VM.
- There is no linter, test suite, or TypeScript — the project has `"test": "echo \"Error: no test specified\" && exit 1"` in `package.json`.
- **`make update BOOK=<book>`** is the usual incremental build after editing one book; **`make update-all`** rebuilds the whole site. Both regenerate static HTML and OG assets as appropriate and sync to `public/`. The first time you need a `data/manifest.json`, run `make update-all` (or `make manifest`) once before relying on per-book manifest merge.
- Scraping targets (`make shiji-001`, etc.) require internet access to chinesenotes.com/ctext.org and are interactive (prompt before overwriting translated chapters).
- `package-lock.json` is gitignored, so `npm install` resolves latest compatible versions each time.
