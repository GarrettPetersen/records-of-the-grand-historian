#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_WINDOW_DAYS = 180;

function parseWindowDays(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_WINDOW_DAYS;
}

function readReviewCommitDates(windowDays) {
  const args = [
    'log',
    `--since=${windowDays}.days`,
    '--pretty=format:%ct\t%s',
    '--grep=^Review .* chapter [0-9][0-9]*$'
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

  return output
    .split('\n')
    .map(line => {
      const [timestamp] = line.split('\t');
      const parsed = Number.parseInt(timestamp, 10);
      return Number.isFinite(parsed) ? parsed * 1000 : null;
    })
    .filter(Boolean);
}

function toUtcDayKey(date) {
  return date.toISOString().slice(0, 10);
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
      reviewCommits: 0,
      activeDays: 0,
      completedChapters: completedChapters || 0,
      totalChapters: totalChapters || 0,
      remainingChapters: 0,
      chaptersPerDay: 0,
      chaptersPerActiveDay: 0,
      estimatedDaysRemaining: 0,
      estimatedCompletionDate: new Date().toISOString(),
      source: 'git review commits'
    };
  }

  const commitDates = readReviewCommitDates(windowDays);
  if (commitDates.length === 0) {
    return null;
  }

  const dailyCounts = new Map();
  for (const timestamp of commitDates) {
    const key = toUtcDayKey(new Date(timestamp));
    dailyCounts.set(key, (dailyCounts.get(key) || 0) + 1);
  }

  const reviewCommits = commitDates.length;
  const activeDays = dailyCounts.size;
  const chaptersPerDay = reviewCommits / windowDays;
  const chaptersPerActiveDay = activeDays > 0 ? reviewCommits / activeDays : 0;

  if (chaptersPerDay <= 0) {
    return null;
  }

  const estimatedDaysRemaining = remainingChapters / chaptersPerDay;
  const estimatedCompletionDate = new Date(Date.now() + estimatedDaysRemaining * DAY_MS).toISOString();

  return {
    windowDays,
    reviewCommits,
    activeDays,
    completedChapters: completedChapters || 0,
    totalChapters: totalChapters || 0,
    remainingChapters,
    chaptersPerDay,
    chaptersPerActiveDay,
    estimatedDaysRemaining,
    estimatedCompletionDate,
    source: 'git review commits'
  };
}

export { estimateCompletionFromGitHistory };
