#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { inspectPeopleGitStorage } from './lib/people-git-storage.mjs';

const MAX_SOURCE_BYTES = 64 * 1024 * 1024;
export function validatePeopleCheckpointPaths(files) {
  if (!Array.isArray(files) || !files.length || new Set(files).size !== files.length) throw Error('Explicit unique source paths required');
  for (const file of files) {
    if (typeof file !== 'string' || path.isAbsolute(file) || file.split('/').some(p => !p || p === '.' || p === '..') ||
      /(?:^|\/)\.env(?:\.|$)/.test(file) ||
      /^(?:public|dist|node_modules|\.git|\.codex)(?:\/|$)/.test(file) ||
      /^data\/people\/generated(?:\/|$)/.test(file) || /^fonts\/\.cache(?:\/|$)/.test(file) ||
      (file.startsWith('.') && !file.startsWith('.github/')))
      throw Error('Recovery checkpoint refuses generated, private or broad-copy path: ' + file);
  }
  return files;
}

export function createPeopleRecoveryCheckpoint({ root, files, prefix }) {
  root = fs.realpathSync(root);
  validatePeopleCheckpointPaths(files);
  if (!/^refs\/recovery\/[a-zA-Z0-9][a-zA-Z0-9/_-]+$/.test(prefix ?? '') || prefix.includes('//') || prefix.endsWith('/')) throw Error('Named refs/recovery prefix required');
  const git = (args, env = process.env, input) => {
    const r = spawnSync('git', ['-C', root, ...args], { env, input, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    if (r.error || r.status) throw Error(`git ${args[0]} failed: ${r.error?.message ?? r.stderr}`);
    return r.stdout.trim();
  };
  const common = fs.realpathSync(git(['rev-parse', '--path-format=absolute', '--git-common-dir']));
  if (path.dirname(common) !== root) throw Error('Source checkpoint must run in the sole primary host checkout');
  for (const name of ['index.lock', 'packed-refs.lock', 'people-storage-compaction.lock', 'people-checkpoint.lock']) {
    if (fs.existsSync(path.join(common, name))) throw Error('Active Git/storage writer: ' + name);
  }
  if (git(['for-each-ref', '--format=%(refname)', prefix])) throw Error('Recovery prefix already exists; reuse its receipt');
  // Bound new snapshot objects instead of discovering multi-GB recovery copies
  // after disk is full. Every captured path is explicit, source-only and nonignored.
  let bytes = 0;
  for (const file of files) {
    const absolute = path.join(root, file);
    let ancestor = root;
    for (const component of file.split('/').slice(0, -1)) {
      ancestor = path.join(ancestor, component);
      const s = fs.lstatSync(ancestor);
      if (!s.isDirectory() || s.isSymbolicLink()) throw Error('Recovery path traverses a redirected directory: ' + file);
    }
    if (!fs.existsSync(absolute)) { git(['ls-files', '--error-unmatch', '--', file]); continue; }
    const s = fs.lstatSync(absolute);
    if (!s.isFile() || s.isSymbolicLink()) throw Error('Recovery requires individual regular source files: ' + file);
    bytes += s.size;
    if (bytes > MAX_SOURCE_BYTES) throw Error('Source checkpoint exceeds 64 MiB; split explicitly owned source changes, never copy the corpus');
    const ignored = spawnSync('git', ['-C', root, 'check-ignore', '--no-index', '-q', '--', file]);
    if (ignored.status !== 1) throw Error('Recovery refuses ignored/unverifiable source path: ' + file);
  }
  if (inspectPeopleGitStorage(root).looseBytes >= 1024 ** 3) throw Error('At least 1 GiB loose Git storage: compact losslessly before another recovery checkpoint');
  const lock = path.join(common, 'people-checkpoint.lock'), fd = fs.openSync(lock, 'wx', 0o600);
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'people-source-index-'));
  try {
    const index = path.join(common, 'index'), original = fs.readFileSync(index);
    const head = git(['rev-parse', 'HEAD']), headTree = git(['rev-parse', 'HEAD^{tree}']);
    const alternate = path.join(scratch, 'index'); fs.writeFileSync(alternate, original);
    const env = { ...process.env, GIT_INDEX_FILE: alternate };
    const indexTree = git(['write-tree'], env);
    for (const file of files) {
      const absolute = path.join(root, file);
      if (!fs.existsSync(absolute)) git(['update-index', '--force-remove', '--', file], env);
      else {
        const oid = git(['hash-object', '--no-filters', '-w', '--', file]);
        const saved = spawnSync('git', ['-C', root, 'cat-file', 'blob', oid], { maxBuffer: MAX_SOURCE_BYTES + 1024 });
        if (saved.error || saved.status !== 0 || !saved.stdout.equals(fs.readFileSync(absolute))) throw Error('Source checkpoint bytes differ: ' + file);
        const mode = fs.statSync(absolute).mode & 0o111 ? '100755' : '100644';
        git(['update-index', '--add', '--cacheinfo', `${mode},${oid},${file}`], env);
      }
    }
    const workingTree = git(['write-tree'], env);
    const indexCommit = indexTree === headTree ? head : git(['commit-tree', indexTree, '-p', head], env, 'Exact original staged source checkpoint\n');
    const workingCommit = workingTree === indexTree ? indexCommit : git(['commit-tree', workingTree, '-p', indexCommit], env, 'Explicit owned source checkpoint; generated/recovery files excluded\n');
    if (!fs.readFileSync(index).equals(original) || git(['rev-parse', 'HEAD']) !== head) throw Error('Concurrent host Git writer; primary index/HEAD preserved');
    git(['update-ref', '--stdin'], process.env,
      `start\ncreate ${prefix}/head ${head}\ncreate ${prefix}/index ${indexCommit}\ncreate ${prefix}/working ${workingCommit}\nprepare\ncommit\n`);
    return { schemaVersion: 1, kind: 'source-only-recovery-checkpoint', prefix, files, sourceBytes: bytes,
      head, index: indexCommit, working: workingCommit, primaryIndexSha256: createHash('sha256').update(original).digest('hex'),
      generatedCopied: false, ignoredCopied: false, primaryHeadAndIndexUnchanged: true };
  } finally { fs.closeSync(fd); fs.unlinkSync(lock); fs.rmSync(scratch, { recursive: true }); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length !== 4 || args[0] !== '--files' || args[2] !== '--prefix') throw Error('Usage: --files EXPLICIT_JSON_ARRAY --prefix refs/recovery/NAME');
  console.log(JSON.stringify(createPeopleRecoveryCheckpoint({ root: process.cwd(), files: JSON.parse(fs.readFileSync(args[1])), prefix: args[3] }), null, 2));
}
