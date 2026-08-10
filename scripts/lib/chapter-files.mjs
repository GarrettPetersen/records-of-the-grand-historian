import fs from 'node:fs';
import path from 'node:path';

const CHAPTER_FILE = /^\d{3}\.json$/u;

export function bookDataDirectories(root) {
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(root, entry.name))
    .filter((directory) => fs.readdirSync(directory).some((name) => CHAPTER_FILE.test(name)))
    .sort();
}

export function discoverChapterFiles(inputs) {
  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const stat = fs.statSync(entry);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) enqueue(path.join(entry, child));
    } else if (CHAPTER_FILE.test(path.basename(entry))) {
      files.push(entry);
    }
  };
  for (const input of inputs) enqueue(input);
  return [...new Set(files)].sort();
}
