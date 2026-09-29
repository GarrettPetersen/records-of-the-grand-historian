#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const primary = fs.realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
let checkout, book, chapter;
let apply = false;
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === '--apply') apply = true;
  else if (['--checkout', '--book', '--chapter'].includes(arg)) {
    const value = process.argv[++i];
    if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value`);
    if (arg === '--checkout') checkout = value;
    else if (arg === '--book') book = value;
    else chapter = value;
  } else throw new Error(`Unknown argument: ${arg}`);
}
if (!checkout || !path.isAbsolute(checkout)) throw new Error('--checkout requires an absolute secondary checkout path');
if (chapter && (!book || !/^\d{3}$/.test(chapter))) throw new Error('--chapter requires --book and three digits');
if (book && !/^[a-z0-9_-]+$/.test(book)) throw new Error('Invalid book');
checkout = fs.realpathSync(checkout);
if (checkout === primary) throw new Error('Refusing the primary checkout; use an idle secondary checkout');
const git = (...args) => execFileSync('git', ['-C', checkout, ...args], { encoding: 'utf8' }).trim();
if (fs.realpathSync(git('rev-parse', '--show-toplevel')) !== checkout) throw new Error('Checkout must be the Git root');
if (git('status', '--porcelain', '--untracked-files=normal')) throw new Error('Checkout has changes; preserve and resolve them before changing sparse selection');
if (book) {
  const source = chapter ? `data/${book}/${chapter}.json` : `data/${book}`;
  git('cat-file', '-e', `HEAD:${source}`);
}
const patterns = ['/*', '!/*/', '/scripts/', '/functions/'];
if (book) {
  patterns.push('/data/*', '!/data/*/', '/data/people/*', '!/data/people/*/',
    '/data/people/schema/', '/data/people/chronology/', '/data/people/curation/');
  if (chapter) {
    patterns.push(`/data/${book}/${chapter}.json`);
    for (const name of ['extractions', 'date-audits']) patterns.push(`/data/people/${name}/${book}/${chapter}.json`);
    for (const name of ['date-repairs', 'date-audit-history']) patterns.push(`/data/people/${name}/${book}/${chapter}/`);
  } else {
    patterns.push(`/data/${book}/`);
    for (const name of ['extractions', 'date-audits', 'date-repairs', 'date-audit-history']) patterns.push(`/data/people/${name}/${book}/`);
  }
}
console.log(JSON.stringify({ checkout, apply, book, chapter, patterns }, null, 2));
if (apply) {
  execFileSync('git', ['-C', checkout, 'sparse-checkout', 'set', '--no-cone', '--stdin'], {
    input: `${patterns.join('\n')}\n`, encoding: 'utf8', stdio: ['pipe', 'inherit', 'inherit'],
  });
  console.log('Sparse selection applied; ignored recovery state remains local.');
}
