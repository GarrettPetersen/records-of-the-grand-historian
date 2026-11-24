import path from 'node:path';
import fs from 'node:fs';

export function peopleGenerationIsRemote(env = process.env) {
  // A generic CI=1, macOS/Linux detection or an override flag must not turn a
  // local coordinator into another corpus build worker.
  const github = env.GITHUB_ACTIONS === 'true' && env.RUNNER_ENVIRONMENT === 'github-hosted';
  const pages = env.CF_PAGES === '1' && Boolean(env.CF_PAGES_BUILD_ID || env.CF_PAGES_COMMIT_SHA);
  return github || pages;
}
export function assertRemotePeopleGeneration(operation, env = process.env) {
  if (!peopleGenerationIsRemote(env)) throw Error(`${operation} requires GitHub-hosted CI or Cloudflare Pages. ` +
    'Local chapter workers use sealed inputs and bounded lookup; submit reviewed source and inspect remote qualification receipts.');
}

export function assertSharedPeopleRegistry(directory, root) {
  const normalized = path.resolve(directory).split(path.sep).join('/');
  if (root && path.dirname(path.resolve(directory)) !== path.join(path.resolve(root), 'data/people/generated/identity-dossiers'))
    throw Error('Production registry requires the sole shared host registry root');
  const marker = '/data/people/generated/';
  const index = normalized.indexOf(marker);
  if (index < 0) return; // Small isolated library fixtures are not host generations.
  const relative = normalized.slice(index + marker.length);
  if (!/^identity-dossiers\/[^/]+$/.test(relative)) throw Error(
    'Full identity registries must use one shared data/people/generated/identity-dossiers generation, never a chapter/job copy.');
  assertRemotePeopleGeneration('Full identity registry generation');
}

export function assertNoDuplicatePeopleRegistry(parent, identityInputs) {
  for (const entry of fs.readdirSync(parent, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
    const file = path.join(parent, entry.name, 'manifest.json');
    if (!fs.existsSync(file)) continue;
    const s = fs.lstatSync(file);
    if (!s.isFile() || s.isSymbolicLink() || s.size > 1024 * 1024) throw Error('Invalid shared registry manifest: ' + file);
    const manifest = JSON.parse(fs.readFileSync(file));
    if (manifest.kind === 'canonical-identity-dossier-store' && manifest.provenance?.identityInputs === identityInputs) {
      throw Error('A full registry for these exact inputs already exists; reuse its original provenance and path: ' + path.dirname(file));
    }
  }
}
