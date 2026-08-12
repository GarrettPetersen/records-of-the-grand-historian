import fs from 'node:fs';
import path from 'node:path';
import {
  PEOPLE_DIR,
  readJson,
  writeTextAtomic,
} from './people-content.mjs';

function resolutionFiles(root) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile() && entry.name.endsWith('.json')) files.push(file);
    }
  };
  visit(root);
  return files.sort();
}

function localPersonPrefix(book, chapter) {
  return `${book}:${String(chapter).padStart(3, '0')}:`;
}

export function pruneResolutionDocument(document, chapters) {
  const prefixes = chapters.map(({ book, chapter }) => localPersonPrefix(book, chapter));
  let touchedDecisions = 0;
  let removedDecisions = 0;
  let removedReferences = 0;
  const decisions = [];

  for (const decision of document.decisions) {
    const localPeople = decision.localPeople.filter((localId) => {
      const stale = prefixes.some((prefix) => localId.startsWith(prefix));
      if (stale) removedReferences += 1;
      return !stale;
    });
    if (localPeople.length === decision.localPeople.length) {
      decisions.push(decision);
      continue;
    }
    touchedDecisions += 1;
    if (localPeople.length < 2) {
      removedDecisions += 1;
      continue;
    }
    const retained = { ...decision, localPeople };
    delete retained.canonicalPersonId;
    decisions.push(retained);
  }

  return {
    document: { ...document, decisions },
    stats: { touchedDecisions, removedDecisions, removedReferences },
  };
}

export function serializeResolutionDocument(document, priorText = '') {
  if (!/\n    \{"decision":/u.test(priorText)) return `${JSON.stringify(document, null, 2)}\n`;
  const header = Object.fromEntries(
    Object.entries(document).filter(([key]) => key !== 'decisions'),
  );
  const headerLines = JSON.stringify(header, null, 2).split('\n').slice(1, -1);
  return [
    '{',
    ...headerLines.map((line, index) => `${line}${index === headerLines.length - 1 ? ',' : ''}`),
    '  "decisions": [',
    ...document.decisions.map((decision, index) => (
      `    ${JSON.stringify(decision)}${index === document.decisions.length - 1 ? '' : ','}`
    )),
    '  ]',
    '}',
    '',
  ].join('\n');
}

export function invalidateResolutionReferences(
  chapters,
  { root = path.join(PEOPLE_DIR, 'resolutions') } = {},
) {
  const totals = {
    filesChanged: 0,
    touchedDecisions: 0,
    removedDecisions: 0,
    removedReferences: 0,
  };
  for (const file of resolutionFiles(root)) {
    const priorText = fs.readFileSync(file, 'utf8');
    const { document, stats } = pruneResolutionDocument(readJson(file), chapters);
    if (stats.removedReferences === 0) continue;
    writeTextAtomic(file, serializeResolutionDocument(document, priorText));
    totals.filesChanged += 1;
    totals.touchedDecisions += stats.touchedDecisions;
    totals.removedDecisions += stats.removedDecisions;
    totals.removedReferences += stats.removedReferences;
  }
  return totals;
}
