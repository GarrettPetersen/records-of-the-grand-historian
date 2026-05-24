#!/usr/bin/env node
/**
 * List cursor/* branches with translation diffs vs origin/master.
 */
import { execSync } from 'node:child_process';

const BRANCHES = execSync('git branch -r', { encoding: 'utf8' })
  .split('\n')
  .map((l) => l.trim())
  .filter((b) => b.startsWith('origin/cursor/'));

function idiomaticRatio(ref, file) {
  try {
    const json = execSync(`git show ${ref}:${file}`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
    const data = JSON.parse(json);
    let t = 0;
    let m = 0;
    for (const block of data.content ?? []) {
      const rows = block.type === 'table_row' ? (block.cells ?? []) : (block.sentences ?? []);
      for (const s of rows) {
        const tr = s.translations?.[0]?.translator ?? s.translator;
        if (tr === 'Herbert J. Allen (1894)') continue;
        const zh = (s.zh ?? s.content ?? '').trim();
        if (!zh) continue;
        t++;
        const idio = s.translations?.[0]?.idiomatic ?? s.idiomatic ?? '';
        if (idio.trim()) m++;
      }
    }
    return { m, t, book: data.meta?.book, chapter: data.meta?.chapter, title: data.meta?.title?.en };
  } catch {
    return null;
  }
}

const since = process.argv[2] ?? '2026-05-23';
const master = 'origin/master';

/** @type {Array<{ branch: string, date: string, chapters: object[], files: number }>} */
const rows = [];

for (const branch of BRANCHES) {
  let date;
  try {
    date = execSync(`git log -1 --format=%cs "${branch}"`, { encoding: 'utf8' }).trim();
  } catch {
    continue;
  }
  if (date < since) continue;

  let files;
  try {
    files = execSync(`git diff --name-only ${master}..."${branch}" -- 'data/*/*.json'`, {
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    continue;
  }
  if (files.length === 0) continue;

  const chapters = [];
  for (const file of files) {
    const onMaster = idiomaticRatio(master, file);
    const onBranch = idiomaticRatio(branch, file);
    if (!onBranch) continue;
    const worthMerge =
      onBranch.m === onBranch.t &&
      onBranch.t > 0 &&
      (!onMaster || onMaster.m < onMaster.t);
    chapters.push({
      file,
      worthMerge,
      master: onMaster ? `${onMaster.m}/${onMaster.t}` : 'missing',
      branch: `${onBranch.m}/${onBranch.t}`,
      title: onBranch.title,
      book: onBranch.book,
      chapter: onBranch.chapter,
    });
  }

  const worth = chapters.filter((c) => c.worthMerge);
  if (worth.length === 0 && chapters.length === 0) continue;

  rows.push({ branch, date, chapters, worthCount: worth.length, fileCount: files.length });
}

rows.sort((a, b) => b.date.localeCompare(a.date) || a.branch.localeCompare(b.branch));

for (const r of rows) {
  console.log(`\n${r.branch} (${r.date}) data/json=${r.fileCount} worth=${r.worthCount}`);
  for (const c of r.chapters) {
    const flag = c.worthMerge ? 'MERGE' : 'skip';
    console.log(`  [${flag}] ${c.book} ${c.chapter} ${c.title} master=${c.master} branch=${c.branch}`);
  }
}

console.log(`\n${rows.length} branch(es) since ${since}`);
