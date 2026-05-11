#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_WINDOW_DAYS = 180;
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
  let current = null;

  for (const line of output.split('\n')) {
    if (!line) continue;

    if (line.startsWith('__COMMIT__')) {
      if (current) commits.push(current);
      const [hash, timestamp] = line.slice('__COMMIT__'.length).split('\t');
      current = {
        hash,
        timestamp: Number.parseInt(timestamp, 10) * 1000,
        files: []
      };
      continue;
    }

    if (current && line === PROGRESS_FILE) current.files.push(line);
  }

  if (current) commits.push(current);
  return commits;
}

function toUtcDayKey(date) {
  return date.toISOString().slice(0, 10);
}

function readTranslatedSentenceTotalAtRevision(revision) {
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
    if (Number.isFinite(Number(data?.summary?.translatedSentences))) {
      return Number(data.summary.translatedSentences);
    }

    let total = 0;
    for (const book of Object.values(data.books || {})) {
      for (const chapter of book.chapters || []) {
        total += Number(chapter.translatedCount || 0);
      }
    }
    return total;
  } catch {
    return 0;
  }
}

function estimateCompletionFromGitHistory({
  completedChapters,
  totalChapters,
  remainingSentences,
  windowDays = parseWindowDays(process.env.PROGRESS_ESTIMATE_WINDOW_DAYS)
} = {}) {
  const remainingChapters = Math.max(0, (totalChapters || 0) - (completedChapters || 0));
  const outstandingSentences = Math.max(0, remainingSentences || 0);

  if (outstandingSentences === 0) {
    return {
      windowDays,
      translationCommits: 0,
      activeDays: 0,
      completedChapters: completedChapters || 0,
      totalChapters: totalChapters || 0,
      remainingChapters: 0,
      remainingSentences: 0,
      sentencesPerDay: 0,
      sentencesPerActiveDay: 0,
      translatedSentencesAdded: 0,
      estimatedDaysRemaining: 0,
      estimatedCompletionDate: new Date().toISOString(),
      source: 'git translation commits'
    };
  }

  const commits = readTranslationHistory(windowDays);
  if (commits.length === 0) {
    return null;
  }

  const dailyCounts = new Map();
  let translatedSentencesAdded = 0;
  let translationCommits = 0;

  for (const commit of commits) {
    const currentCount = readTranslatedSentenceTotalAtRevision(commit.hash);
    const parentCount = readTranslatedSentenceTotalAtRevision(`${commit.hash}^`);
    const commitDelta = currentCount - parentCount;

    if (commitDelta > 0) {
      translatedSentencesAdded += commitDelta;
      translationCommits += 1;
      const key = toUtcDayKey(new Date(commit.timestamp));
      dailyCounts.set(key, (dailyCounts.get(key) || 0) + commitDelta);
    }
  }

  const activeDays = dailyCounts.size;
  const sentencesPerDay = translatedSentencesAdded / windowDays;
  const sentencesPerActiveDay = activeDays > 0 ? translatedSentencesAdded / activeDays : 0;

  if (sentencesPerDay <= 0) {
    return null;
  }

  const estimatedDaysRemaining = outstandingSentences / sentencesPerDay;
  const estimatedCompletionDate = new Date(Date.now() + estimatedDaysRemaining * DAY_MS).toISOString();

  return {
    windowDays,
    translationCommits,
    activeDays,
    completedChapters: completedChapters || 0,
    totalChapters: totalChapters || 0,
    remainingChapters,
    remainingSentences: outstandingSentences,
    translatedSentencesAdded,
    sentencesPerDay,
    sentencesPerActiveDay,
    estimatedDaysRemaining,
    estimatedCompletionDate,
    source: 'git translation commits'
  };
}

export { estimateCompletionFromGitHistory };
