#!/usr/bin/env node
/**
 * Track chapters reserved by open PRs, translation-staging (not yet on master), or local SDK claims.
 *
 *   node scripts/translation-inflight.mjs
 *   node scripts/translation-inflight.mjs --check liaoshi 057
 *   node scripts/translation-inflight.mjs --json
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { DEFAULT_REPO_URL, listOpenCursorTranslationPrs } from './github-pr.mjs';
import { normalizeChapterId } from './normalize-chapter-id.mjs';
import { isChapterTranslated } from './progress-status.mjs';
import { REPO_ROOT } from './sdk-translation-books.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const INFLIGHT_PATH = path.join(REPO_ROOT, 'data', 'translation-inflight.json');
export const DEFAULT_STAGING_BRANCH =
  process.env.TRANSLATION_STAGING_BRANCH || 'translation-staging';

/** @typedef {'open_pr' | 'staging' | 'local_claim'} InflightSource */

/**
 * @typedef {object} InflightEntry
 * @property {string} book
 * @property {string | null} chapter null = chapter unknown (book-level open PR)
 * @property {InflightSource} source
 * @property {string} detail
 * @property {number} [prNumber]
 * @property {string} [url]
 */

/**
 * @param {string} book
 * @param {string | null} chapter
 */
export function chapterKey(book, chapter) {
  if (!chapter) return `${book}/*`;
  return `${book}/${normalizeChapterId(chapter)}`;
}

/**
 * @returns {Set<string>}
 */
export function listKnownBookIds() {
  const dataDir = path.join(REPO_ROOT, 'data');
  if (!fs.existsSync(dataDir)) return new Set();
  return new Set(
    fs
      .readdirSync(dataDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
      .map((d) => d.name),
  );
}

/**
 * @param {{ title?: string, headRef?: string }} pr
 * @param {Set<string>} bookIds
 * @returns {{ book: string, chapter: string | null } | null}
 */
export function parsePrChapter(pr, bookIds) {
  const title = pr.title ?? '';
  const head = pr.headRef ?? '';

  let m = title.match(/translate\s+([a-z][a-z0-9]*)\s+chapter\s+(\d{1,3})\b/i);
  if (m) {
    const book = m[1].toLowerCase();
    if (bookIds.has(book)) {
      return { book, chapter: normalizeChapterId(m[2]) };
    }
  }

  for (const book of bookIds) {
    const re = new RegExp(`\\b${book}\\b[^.\\d]{0,48}chapter\\s+(\\d{1,3})\\b`, 'i');
    m = title.match(re);
    if (m) {
      return { book, chapter: normalizeChapterId(m[1]) };
    }
  }

  m = head.match(/cursor\/(?:translate-)?([a-z][a-z0-9]*)-ch(?:apter)?[_-]?(\d{1,3})\b/i);
  if (m) {
    const book = m[1].toLowerCase();
    if (bookIds.has(book)) {
      return { book, chapter: normalizeChapterId(m[2]) };
    }
  }

  // cursor/jiuwudaishi-148-04c6, cursor/liaoshi-111-28d8
  m = head.match(/cursor\/(?:translate-)?([a-z][a-z0-9]*)-(\d{1,3})\b/i);
  if (m) {
    const book = m[1].toLowerCase();
    if (bookIds.has(book)) {
      return { book, chapter: normalizeChapterId(m[2]) };
    }
  }

  m = head.match(/cursor\/(?:translate-)?([a-z][a-z0-9]*)-translation\b/i);
  if (m) {
    const book = m[1].toLowerCase();
    if (bookIds.has(book)) {
      return { book, chapter: null };
    }
  }

  return null;
}

/**
 * @returns {Array<{ book: string, chapter: string, startedAt: string, agentId?: string, runId?: string, runtime?: string }>}
 */
export function loadLocalClaims() {
  if (!fs.existsSync(INFLIGHT_PATH)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(INFLIGHT_PATH, 'utf8'));
    return Array.isArray(data.claims) ? data.claims : [];
  } catch {
    return [];
  }
}

/**
 * @param {{ book: string, chapter: string, runtime?: string, agentId?: string, runId?: string }} claim
 */
export function addLocalClaim(claim) {
  const claims = loadLocalClaims().filter(
    (c) => !(c.book === claim.book && c.chapter === normalizeChapterId(claim.chapter)),
  );
  claims.push({
    book: claim.book,
    chapter: normalizeChapterId(claim.chapter),
    runtime: claim.runtime ?? 'cloud',
    agentId: claim.agentId,
    runId: claim.runId,
    startedAt: new Date().toISOString(),
  });
  fs.mkdirSync(path.dirname(INFLIGHT_PATH), { recursive: true });
  fs.writeFileSync(
    INFLIGHT_PATH,
    JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), claims }, null, 2) + '\n',
  );
}

/**
 * @param {string} book
 * @param {string} chapter
 */
export function removeLocalClaim(book, chapter) {
  const ch = normalizeChapterId(chapter);
  const claims = loadLocalClaims().filter((c) => !(c.book === book && c.chapter === ch));
  if (claims.length === 0) {
    if (fs.existsSync(INFLIGHT_PATH)) fs.unlinkSync(INFLIGHT_PATH);
    return;
  }
  fs.writeFileSync(
    INFLIGHT_PATH,
    JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), claims }, null, 2) + '\n',
  );
}

function gitRefExists(ref) {
  try {
    execSync(`git rev-parse --verify "${ref}"`, {
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return true;
  } catch {
    return false;
  }
}

function fetchGitRefs(stagingBranch) {
  try {
    execSync('git fetch origin master', { cwd: REPO_ROOT, stdio: 'pipe' });
  } catch {
    /* offline */
  }
  if (stagingBranch) {
    try {
      execSync(`git fetch origin ${stagingBranch}`, { cwd: REPO_ROOT, stdio: 'pipe' });
    } catch {
      /* branch may not exist */
    }
  }
}

/**
 * Chapters complete on translation-staging but still gray/yellow on master (via progress.json).
 *
 * @param {string} stagingRef
 * @param {string} masterRef
 * @returns {Array<{ book: string, chapter: string }>}
 */
export function chaptersOnStagingNotMasterFromProgress(stagingRef, masterRef) {
  if (!gitRefExists(stagingRef)) return [];
  let masterRaw;
  let stagingRaw;
  try {
    masterRaw = execSync(`git show "${masterRef}:data/progress.json"`, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    stagingRaw = execSync(`git show "${stagingRef}:data/progress.json"`, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return [];
  }

  const master = JSON.parse(masterRaw);
  const staging = JSON.parse(stagingRaw);
  const pending = [];

  for (const [book, masterBook] of Object.entries(master.books ?? {})) {
    const stagingBook = staging.books?.[book];
    if (!stagingBook?.chapters) continue;
    const stagingByChapter = new Map(
      stagingBook.chapters.map((c) => [c.chapter, c.status]),
    );
    for (const ch of masterBook.chapters ?? []) {
      const needsWork =
        ch.status === 'gray' || ch.status === 'yellow';
      if (!needsWork) continue;
      const stagingStatus = stagingByChapter.get(ch.chapter);
      if (stagingStatus && isChapterTranslated(stagingStatus)) {
        pending.push({ book, chapter: ch.chapter });
      }
    }
  }

  return pending;
}

/**
 * @param {{ repoUrl?: string, stagingBranch?: string, token?: string, fetchGit?: boolean }} [opts]
 * @returns {Promise<{ entries: InflightEntry[], keys: Set<string>, bookOnly: Set<string>, stagingAvailable: boolean }>}
 */
export async function buildInflightRegistry(opts = {}) {
  const repoUrl = opts.repoUrl ?? process.env.GITHUB_REPO_URL ?? DEFAULT_REPO_URL;
  const stagingBranch = opts.stagingBranch ?? DEFAULT_STAGING_BRANCH;
  const bookIds = listKnownBookIds();
  const entries = /** @type {InflightEntry[]} */ ([]);
  const keys = new Set();
  const bookOnly = new Set();

  const add = (entry) => {
    entries.push(entry);
    if (entry.chapter) {
      keys.add(chapterKey(entry.book, entry.chapter));
    } else {
      bookOnly.add(entry.book);
    }
  };

  if (opts.fetchGit !== false) {
    fetchGitRefs(stagingBranch);
  }

  const stagingRef = `origin/${stagingBranch}`;
  const masterRef = 'origin/master';
  const stagingAvailable = gitRefExists(stagingRef);

  for (const claim of loadLocalClaims()) {
    add({
      book: claim.book,
      chapter: claim.chapter,
      source: 'local_claim',
      detail: `SDK session${claim.agentId ? ` ${claim.agentId}` : ''} started ${claim.startedAt}`,
    });
  }

  try {
    const prs = await listOpenCursorTranslationPrs(repoUrl, opts.token);
    for (const pr of prs) {
      const parsed = parsePrChapter(pr, bookIds);
      if (!parsed) {
        add({
          book: '?',
          chapter: null,
          source: 'open_pr',
          detail: `PR #${pr.number} (could not parse book/chapter)`,
          prNumber: pr.number,
          url: pr.url,
        });
        continue;
      }
      add({
        book: parsed.book,
        chapter: parsed.chapter,
        source: 'open_pr',
        detail: `PR #${pr.number} → ${pr.baseRef} (${pr.headRef})`,
        prNumber: pr.number,
        url: pr.url,
      });
    }
  } catch (err) {
    add({
      book: '?',
      chapter: null,
      source: 'open_pr',
      detail: `GitHub PR list failed: ${err instanceof Error ? err.message : err}`,
    });
  }

  if (stagingAvailable) {
    for (const { book, chapter } of chaptersOnStagingNotMasterFromProgress(
      stagingRef,
      masterRef,
    )) {
      const key = chapterKey(book, chapter);
      if (keys.has(key)) continue;
      add({
        book,
        chapter,
        source: 'staging',
        detail: `complete on ${stagingBranch}, not yet on master`,
      });
    }
  }

  return { entries, keys, bookOnly, stagingAvailable };
}

/**
 * @param {string} book
 * @param {string} chapter
 * @param {Awaited<ReturnType<typeof buildInflightRegistry>>} registry
 */
export function isChapterInflight(book, chapter, registry) {
  const key = chapterKey(book, chapter);
  if (registry.keys.has(key)) return true;
  // bookOnly: unparsed open PRs only — do not block every chapter in the book
  return false;
}

/**
 * @param {string} book
 * @param {string} chapter
 * @param {Awaited<ReturnType<typeof buildInflightRegistry>>} registry
 * @returns {InflightEntry[]}
 */
export function inflightReasonsForChapter(book, chapter, registry) {
  const ch = normalizeChapterId(chapter);
  return registry.entries.filter((e) => e.book === book && e.chapter === ch);
}

/**
 * @param {string} book
 * @param {string} chapter
 * @param {{ repoUrl?: string, stagingBranch?: string, registry?: Awaited<ReturnType<typeof buildInflightRegistry>> }} [opts]
 */
export async function assertChapterNotInflight(book, chapter, opts = {}) {
  const registry = opts.registry ?? (await buildInflightRegistry(opts));
  if (!isChapterInflight(book, chapter, registry)) return registry;
  const reasons = inflightReasonsForChapter(book, chapter, registry);
  const lines = reasons.map((r) => `  - [${r.source}] ${r.detail}${r.url ? ` ${r.url}` : ''}`);
  throw new Error(
    `[${book}/${chapter}] already in flight or on translation-staging — do not start another translation:\n${lines.join('\n')}`,
  );
}

/**
 * @param {Awaited<ReturnType<typeof buildInflightRegistry>>} registry
 */
export function formatInflightReport(registry) {
  const lines = [];
  lines.push(`Translation in-flight — ${new Date().toISOString()}`);
  lines.push(`Staging branch on origin: ${registry.stagingAvailable ? 'yes' : 'no'}`);
  lines.push(`Reserved chapters: ${registry.keys.size}${registry.bookOnly.size ? ` (+ ${registry.bookOnly.size} book(s) with unparsed open PR)` : ''}`);
  lines.push('');

  if (registry.entries.length === 0) {
    lines.push('Nothing in flight.');
    return lines.join('\n');
  }

  const bySource = /** @type {Record<string, InflightEntry[]>} */ ({});
  for (const e of registry.entries) {
    (bySource[e.source] ??= []).push(e);
  }

  for (const source of ['open_pr', 'local_claim', 'staging']) {
    const group = bySource[source];
    if (!group?.length) continue;
    lines.push(source === 'open_pr' ? 'Open PRs (cursor/*):' : source === 'local_claim' ? 'Local SDK claims:' : `On ${DEFAULT_STAGING_BRANCH} (not on master):`);
    for (const e of group) {
      const loc = e.chapter ? `${e.book}/${e.chapter}` : `${e.book}/*`;
      lines.push(`  ${loc} — ${e.detail}`);
    }
    lines.push('');
  }

  return lines.join('\n').trimEnd();
}

function parseCliArgs() {
  const json = process.argv.includes('--json');
  const checkIdx = process.argv.indexOf('--check');
  if (checkIdx !== -1) {
    const book = process.argv[checkIdx + 1];
    const chapter = process.argv[checkIdx + 2];
    if (!book || !chapter) {
      throw new Error('Usage: node scripts/translation-inflight.mjs --check <book> <chapter>');
    }
    return { json, check: { book, chapter } };
  }
  return { json, check: null };
}

async function main() {
  const { json, check } = parseCliArgs();
  const registry = await buildInflightRegistry();

  if (check) {
    const ch = normalizeChapterId(check.chapter);
    if (isChapterInflight(check.book, ch, registry)) {
      const reasons = inflightReasonsForChapter(check.book, ch, registry);
      if (json) {
        console.log(JSON.stringify({ ok: false, book: check.book, chapter: ch, reasons }, null, 2));
      } else {
        console.error(`BLOCKED: ${check.book}/${ch} is in flight or on staging.`);
        for (const r of reasons) {
          console.error(`  [${r.source}] ${r.detail}${r.url ? ` ${r.url}` : ''}`);
        }
      }
      process.exit(1);
    }
    if (json) {
      console.log(JSON.stringify({ ok: true, book: check.book, chapter: ch }, null, 2));
    } else {
      console.log(`OK: ${check.book}/${ch} is not reserved.`);
    }
    return;
  }

  if (json) {
    const payload = {
      stagingAvailable: registry.stagingAvailable,
      chapters: [...registry.keys].sort(),
      bookOnly: [...registry.bookOnly],
      entries: registry.entries,
    };
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log(formatInflightReport(registry));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
