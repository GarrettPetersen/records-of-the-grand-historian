# AGENTS.md

## Cursor Cloud specific instructions

This is a static-site project (no framework, no build toolchain, no database). All scripts are vanilla Node.js ES modules requiring Node v22+.

### Key commands

- **Install deps:** `npm install` (includes `cheerio`, `satori`, `react`, `@resvg/resvg-js` for OG share images)
- **Build/rebuild site:** `make update BOOK=<book>` — runs citations, counts, manifest (merge), progress (merge), static HTML, **`scripts/generate-sitemap.mjs`** (`public/sitemap.xml` + `public/robots.txt`), **Open Graph PNGs** (`generate-og-images.js` with **`--incremental` by default**: skips when `*.png.sha256` matches the current source fingerprint), and sync for that book only. Use `make update-all` for every book under `data/`. To **re-raster every OG card** after layout/font changes, run with **`OG_FULL=1`** (e.g. `make update-all OG_FULL=1`), or bump **`OG_LAYOUT_VERSION`** in `scripts/og-fingerprint.mjs`. **`make backfill-og-sidecars`** writes only sidecars next to existing PNGs (no raster).
- **Cloudflare Pages:** In the project **Settings → Builds**, set **Build command** to **`npm run build`** (cannot be empty). **Build output directory:** **`public`**. Git-connected Pages does **not** read a build command from `wrangler.toml`—only the dashboard (or API) sets that. An empty build command skips the whole pipeline and deploys committed `public/` as-is (no manifest/HTML/OG regeneration). **`public/og/**/*.png` and `*.png.sha256` are tracked in Git** so clones and deploys include share cards; incremental builds still skip raster work when fingerprints match. The build ends with `scripts/verify-og-assets.mjs` (PNG validity + fingerprint checks). **`public/sitemap.xml`** lists chapter and hub URLs for crawlers; **`public/robots.txt`** references it via **`Sitemap:`**. After a deploy, spot-check `curl -sI https://<site>/og/site.png` returns **`Content-Type: image/png`**; HTML there usually means a missing file or rewrite rule.
- **OG images:** First run downloads Noto Serif CJK OTF into `fonts/.cache/` (gitignored). Override with `OG_FONT_PATH` + `OG_FONT_FAMILY`. Canonical URLs use `SITE_URL` (default `https://24histories.com`) in `generate-static-pages.js` and `generate-og-images.js`. Speed on CI: **`OG_CHAPTER_CONCURRENCY`** (max 16) and **`STATIC_GEN_CONCURRENCY`** (max 32) parallelize chapter OG and HTML; when unset, both scripts pick a default from **`os.availableParallelism()`** (see `scripts/build-parallelism.mjs`) and log it—override in Pages if you want a fixed cap. **`OG_BOOK_RESVG_CHUNK`** (default 16) batches book-hub SVG→PNG in fewer child processes (`scripts/og-resvg-batch.mjs`).
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
