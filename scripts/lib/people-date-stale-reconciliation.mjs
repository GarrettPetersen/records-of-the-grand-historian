import fs from 'node:fs';
import path from 'node:path';
import { PEOPLE_DIR, readJson, sha256 } from './people-content.mjs';
import { dateWorkflowDirectory } from './people-date-workflow.mjs';

function archivePath(directory, state) {
  const fingerprint = String(state.extractionHash ?? sha256(JSON.stringify(state)))
    .replace(/^sha256:/u, '')
    .slice(0, 20);
  return `${directory}.stale-${fingerprint}`;
}

/** Moves a stale incomplete generation aside without deleting its artifacts. */
export function archiveStaleDateWorkflow({ book, chapter, sourceHash, extractionHash, peopleDir = PEOPLE_DIR }) {
  const directory = dateWorkflowDirectory(book, chapter, peopleDir);
  const stateFile = path.join(directory, 'state.json');
  if (!fs.existsSync(stateFile)) return null;
  const state = readJson(stateFile);
  if (state.sourceHash === sourceHash && state.extractionHash === extractionHash) return null;
  if (state.phase === 'complete') throw new Error('Completed date workflow must be reconciled through publication recovery');
  const destination = archivePath(directory, state);
  if (fs.existsSync(destination)) throw new Error(`Stale date workflow archive already exists: ${destination}`);
  fs.renameSync(directory, destination);
  return { directory, destination, state };
}

/** Archive the stale report so a new generation cannot seed it accidentally. */
export function archiveStaleDateReport({ book, chapter, peopleDir = PEOPLE_DIR }) {
  const report = path.join(peopleDir, 'date-audits', book, `${chapter}.json`);
  if (!fs.existsSync(report)) return null;
  const document = readJson(report);
  const destination = path.join(peopleDir, 'date-audit-history', book, chapter, `${sha256(JSON.stringify(document)).slice(7)}.json`);
  if (fs.existsSync(destination)) throw new Error(`Stale date report archive already exists: ${destination}`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.renameSync(report, destination);
  return { report, destination };
}
