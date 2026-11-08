// Load the proposed modules in place; resolve unchanged imports from the pinned clean runtime.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const drafts = new URL('./scripts/', import.meta.url).href;
const runtime = '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/';
export async function resolve(specifier, context, next) {
  if (context.parentURL?.startsWith(drafts) && specifier.startsWith('.')) {
    const target = new URL(specifier, context.parentURL);
    if (!fs.existsSync(target)) return next(pathToFileURL(path.join(runtime,
      path.relative(fileURLToPath(drafts), fileURLToPath(target)))).href, context);
  }
  return next(specifier, context);
}
