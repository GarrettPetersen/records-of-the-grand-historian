#!/usr/bin/env node
/**
 * Snapshot in-flight cloud translation work after stopping the orchestrator.
 *
 *   node scripts/sdk-drain-status.mjs
 *   node scripts/sdk-drain-status.mjs --log /tmp/sdk-translate-cloud.log
 */

import fs from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isChapterTranslated } from './progress-status.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DEFAULT_LOG = '/tmp/sdk-translate-cloud.log';

function parseArgs() {
  const i = process.argv.indexOf('--log');
  const logPath = i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : DEFAULT_LOG;
  return { logPath };
}

function parseLogInFlight(logText) {
  const byBook = new Map();
  const lineRe = /^\[([^\]]+)\]\s+(.*)$/;
  for (const line of logText.split('\n')) {
    const m = line.match(lineRe);
    if (!m) continue;
    const [, book, rest] = m;
    const entry = byBook.get(book) || {};
    if (rest.includes('agent bc-')) {
      const url = rest.match(/https:\/\/cursor\.com\/agents\/[^\s)]+/)?.[0];
      const id = rest.match(/bc-[a-f0-9-]+/)?.[0];
      entry.agentUrl = url;
      entry.agentId = id;
    }
    if (rest.startsWith('run run-')) {
      entry.runId = rest.replace('run ', '').trim();
    }
    if (rest.includes('waiting for merge')) {
      entry.mergePr = rest.match(/pull\/(\d+)/)?.[1] || rest.match(/PR #(\d+)/)?.[1];
    }
    if (rest.startsWith('finished run ')) {
      entry.lastFinished = rest;
      const status = rest.match(/status=(\w+)/)?.[1];
      entry.lastStatus = status;
    }
    byBook.set(book, entry);
  }
  return byBook;
}

function listOpenPrs() {
  try {
    const out = execSync(
      'gh pr list --state open --limit 50 --json number,title,headRefName,createdAt,url',
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    return JSON.parse(out);
  } catch {
    return null;
  }
}

function loadIncompleteSummary() {
  const progressPath = path.join(ROOT, 'public/data/progress.json');
  if (!fs.existsSync(progressPath)) return null;
  const progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
  const rows = [];
  for (const [bookId, book] of Object.entries(progress.books || {})) {
    const chapters = book.chapters || [];
    const incomplete = chapters.filter((c) => !isChapterTranslated(c.status)).length;
    if (incomplete > 0) {
      rows.push({ bookId, incomplete, total: chapters.length });
    }
  }
  rows.sort((a, b) => a.incomplete - b.incomplete);
  return rows;
}

const { logPath } = parseArgs();
console.log(`Drain status — ${new Date().toISOString()}\n`);

if (!fs.existsSync(logPath)) {
  console.log(`Log not found: ${logPath}`);
} else {
  const logText = fs.readFileSync(logPath, 'utf8');
  const stopped = logText.includes('orchestrator stopped');
  console.log(`Orchestrator: ${stopped ? 'stopped (see log marker)' : 'no stop marker in log'}`);
  console.log(`Log: ${logPath}\n`);

  const inFlight = [...parseLogInFlight(logText).entries()]
    .filter(([, e]) => e.agentId || e.runId || e.mergePr)
    .filter(([book]) => !book.includes('orchestrator'));

  const activeBooks = ['jinshi', 'jiutangshu', 'songshu', 'mingshi', 'zizhitongjian'];
  console.log('Last cloud activity (5 active books at shutdown):');
  for (const book of activeBooks) {
    const e = parseLogInFlight(logText).get(book) || {};
    console.log(`  ${book}:`);
    if (e.mergePr) console.log(`    awaiting merge: PR #${e.mergePr}`);
    if (e.runId) console.log(`    run: ${e.runId} (${e.lastStatus || 'in progress?'})`);
    if (e.agentUrl) console.log(`    agent: ${e.agentUrl}`);
    if (!e.mergePr && !e.runId && !e.agentUrl) console.log('    (no recent session in log)');
  }
  console.log('');
}

const prs = listOpenPrs();
if (prs === null) {
  console.log('Open PRs: (gh not available — check GitHub manually)\n');
} else if (prs.length === 0) {
  console.log('Open PRs: none\n');
} else {
  console.log(`Open PRs (${prs.length}):`);
  for (const pr of prs) {
    console.log(`  #${pr.number} ${pr.title}`);
    console.log(`    ${pr.url}`);
  }
  console.log('');
}

const incomplete = loadIncompleteSummary();
if (incomplete) {
  const totalInc = incomplete.reduce((s, r) => s + r.incomplete, 0);
  console.log(`Incomplete chapters (gray/yellow, local progress.json): ${totalInc} across ${incomplete.length} books`);
  console.log('  nearest done:', incomplete.slice(0, 5).map((r) => `${r.bookId} (${r.incomplete})`).join(', '));
}

console.log('\nWatch merges: tail -f /tmp/sdk-translate-cloud.log');
console.log('Next wave: per-chapter cloud runs (orchestrator loop is off).');
