#!/usr/bin/env node
/**
 * Import the single exact extraction artifact from a Grok Bot submission PR.
 * This is deliberately a narrow host-side handoff: it does not merge the PR,
 * accept the queue claim, or alter any source chapter.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, index, all) => {
  if (value.startsWith('--')) pairs.push([value.slice(2), all[index + 1]]);
  return pairs;
}, []));
for (const required of ['pr', 'book', 'chapter']) {
  if (!args[required]) throw new Error(`Missing --${required}`);
}
if (!/^\d{3}$/.test(args.chapter)) throw new Error('--chapter must be a three-digit chapter');

const expectedPath = `data/people/extractions/${args.book}/${args.chapter}.json`;
const pr = JSON.parse(execFileSync('gh', ['pr', 'view', args.pr, '--json', 'baseRefName,headRefName,files'], {
  cwd: root,
  encoding: 'utf8',
}));
if (pr.baseRefName !== 'codex/people-glossary-staging-v2') {
  throw new Error(`PR #${args.pr} has unexpected base ${pr.baseRefName}`);
}
if (pr.files.length !== 1 || pr.files[0].path !== expectedPath || pr.files[0].deletions !== 0) {
  throw new Error(`PR #${args.pr} must contain only ${expectedPath}`);
}
const raw = execFileSync('gh', ['api', '--method', 'GET', `repos/GarrettPetersen/records-of-the-grand-historian/contents/${expectedPath}`, '-f', `ref=${pr.headRefName}`, '--jq', '.content'], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
});
const bytes = Buffer.from(raw.replace(/\s/g, ''), 'base64');
const parsed = JSON.parse(bytes.toString('utf8'));
if (parsed.book !== args.book || parsed.chapter !== args.chapter) {
  throw new Error(`Artifact identity is ${parsed.book}/${parsed.chapter}, expected ${args.book}/${args.chapter}`);
}
const destination = path.join(root, expectedPath);
fs.mkdirSync(path.dirname(destination), { recursive: true });
if (fs.existsSync(destination) && !fs.readFileSync(destination).equals(bytes)) {
  throw new Error(`Refusing to overwrite non-identical local artifact: ${expectedPath}`);
}
fs.writeFileSync(destination, bytes, { flag: fs.existsSync(destination) ? 'w' : 'wx' });
console.log(`Imported ${expectedPath}: ${bytes.length} bytes, sha256 ${createHash('sha256').update(bytes).digest('hex')}`);
