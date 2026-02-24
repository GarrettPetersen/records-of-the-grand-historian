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
- **MODEL metadata:** Always set the `MODEL` parameter to the actual model name so provenance is tracked accurately.
- **Article validator quirk:** The `submit-translations.js` validator rejects sentences lacking standalone English articles (`the`/`a`/`an`). This triggers false positives on grammatically correct sentences. Rephrase to include an article naturally rather than fighting the check.

### Gotchas

- `jq` is a required system tool for `make validate` and scraping targets — it is pre-installed in the VM.
- There is no linter, test suite, or TypeScript — the project has `"test": "echo \"Error: no test specified\" && exit 1"` in `package.json`.
- The `make update` command is the canonical "build" step; it regenerates all static HTML pages and syncs data to `public/`.
- Scraping targets (`make shiji-001`, etc.) require internet access to chinesenotes.com/ctext.org and are interactive (prompt before overwriting translated chapters).
- `package-lock.json` is gitignored, so `npm install` resolves latest compatible versions each time.
