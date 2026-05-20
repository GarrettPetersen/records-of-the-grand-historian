#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_WINDOW_DAYS = 30;
const MIN_CHAPTERS_PER_DAY = 24;
const PROGRESS_FILE = 'data/progress.json';

function parseWindowDays(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_WINDOW_DAYS;
}

function readTranslationHistory(windowDays) {
  const args = [
    'log',
    `--since=${windowDays}.days`,
    '--pretty=format:__COMMIT__%H\t%ct',
    '--',
    PROGRESS_FILE
  ];

  let output = '';
  try {
    output = execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return [];
  }

  if (!output) {
    return [];
  }

  const commits = [];
  for (const line of output.split('\n')) {
    if (!line) continue;
    if (!line.startsWith('__COMMIT__')) continue;
    const [hash, timestamp] = line.slice('__COMMIT__'.length).split('\t');
    commits.push({
      hash,
      timestamp: Number.parseInt(timestamp, 10) * 1000
    });
  }

  return commits;
}

function toUtcDayKey(date) {
  return date.toISOString().slice(0, 10);
}

function hasMeaningfulTranslation(item) {
  for (const t of item?.translations || []) {
    if (
      (typeof t?.literal === 'string' && t.literal.trim()) ||
      (typeof t?.idiomatic === 'string' && t.idiomatic.trim()) ||
      (typeof t?.text === 'string' && t.text.trim()) ||
      (typeof t?.translation === 'string' && t.translation.trim())
    ) {
      return true;
    }
  }
  return false;
}

function countCompletedChaptersFromProgressJson(progressJson) {
  const books = Object.values(progressJson?.books || {});
  let total = 0;

  for (const book of books) {
    for (const chapter of book?.chapters || []) {
      const status = chapter?.status;
      if (status === 'green') {
        total += 1;
      }
    }
  }

  return total;
}

function readProgressSnapshotAtRevision(revision) {
  const spec = `${revision}:${PROGRESS_FILE}`;
  let output = '';
  try {
    output = execFileSync('git', ['show', spec], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });
  } catch {
    return 0;
  }

  try {
    const data = JSON.parse(output);
    const summaryCompleted = Number(data?.summary?.completedChapters);
    const summaryTotal = Number(data?.summary?.totalChapters);
    return {
      completedChapters: Number.isFinite(summaryCompleted) && summaryCompleted >= 0
        ? summaryCompleted
        : countCompletedChaptersFromProgressJson(data),
      totalChapters: Number.isFinite(summaryTotal) && summaryTotal >= 0
        ? summaryTotal
        : Object.values(data?.books || {}).reduce(
            (sum, book) => sum + (book?.chapters?.length || 0),
            0
          )
    };
  } catch {
    return null;
  }
}

function estimateCompletionFromGitHistory({
  completedChapters,
  totalChapters,
  windowDays = parseWindowDays(process.env.PROGRESS_ESTIMATE_WINDOW_DAYS)
} = {}) {
  const remainingChapters = Math.max(0, (totalChapters || 0) - (completedChapters || 0));

  if (remainingChapters === 0) {
    return {
      windowDays,
      progressSnapshots: 0,
      activeDays: 0,
      completedChapters: completedChapters || 0,
      totalChapters: totalChapters || 0,
      remainingChapters: 0,
      rawChaptersPerDay: 0,
      chaptersPerDay: 0,
      chaptersPerActiveDay: 0,
      completedChaptersAdded: 0,
      estimatedDaysRemaining: 0,
      estimatedCompletionDate: new Date().toISOString(),
      source: 'git progress snapshots'
    };
  }

  const commits = readTranslationHistory(windowDays);
  if (commits.length === 0) {
    return null;
  }

  const snapshots = commits
    .map(commit => {
      const snapshot = readProgressSnapshotAtRevision(commit.hash);
      return snapshot
        ? {
            ...commit,
            completedChapters: snapshot.completedChapters,
            totalChapters: snapshot.totalChapters
          }
        : null;
    })
    .filter(snapshot => snapshot && Number.isFinite(snapshot.completedChapters));

  if (snapshots.length === 0) {
    return null;
  }

  snapshots.sort((a, b) => a.timestamp - b.timestamp);

  const dailyCounts = new Map();
  let completedChaptersAdded = 0;
  let progressSnapshots = 0;

  let previous = null;
  for (const snapshot of snapshots) {
    if (previous) {
      const delta = snapshot.completedChapters - previous.completedChapters;
      if (delta > 0) {
        completedChaptersAdded += delta;
        progressSnapshots += 1;
        const key = toUtcDayKey(new Date(snapshot.timestamp));
        dailyCounts.set(key, (dailyCounts.get(key) || 0) + delta);
      }
    }
    previous = snapshot;
  }

  const activeDays = dailyCounts.size;
  const rawChaptersPerDay = completedChaptersAdded / windowDays;
  const chaptersPerDay = rawChaptersPerDay > 0 ? Math.max(rawChaptersPerDay, MIN_CHAPTERS_PER_DAY) : 0;
  const chaptersPerActiveDay = activeDays > 0 ? completedChaptersAdded / activeDays : 0;

  if (chaptersPerDay <= 0) {
    return null;
  }

  const estimatedDaysRemaining = remainingChapters / chaptersPerDay;
  const estimatedCompletionDate = new Date(Date.now() + estimatedDaysRemaining * DAY_MS).toISOString();

  return {
    windowDays,
    progressSnapshots,
    activeDays,
    completedChapters: completedChapters || 0,
    totalChapters: totalChapters || 0,
    remainingChapters,
    completedChaptersAdded,
    rawChaptersPerDay,
    chaptersPerDay,
    chaptersPerActiveDay,
    estimatedDaysRemaining,
    estimatedCompletionDate,
    source: 'git progress snapshots'
  };
}

export { estimateCompletionFromGitHistory };
