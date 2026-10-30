import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as childProcess from 'node:child_process';
const native = { ...fs }, roots = new Set();
const configured = process.env.PEOPLE_REPO_ROOT;
const temp = path.resolve(os.tmpdir());
if (configured) {
  const root = path.resolve(configured);
  if (!root.startsWith(temp + path.sep) || !/^(people-qualified-site|ebook-certified)-/u.test(path.basename(root))) throw new Error('Unauthorized synthetic fixture root');
  roots.add(root);
}
const filePath = p => path.resolve(p instanceof URL ? fileURLToPath(p) : String(p));
function allowed(p) { const file = filePath(p); if (![...roots].some(root => file === root || file.startsWith(root + path.sep))) throw new Error(`Fixture mutation outside its authored root: ${file}`); return file; }
export function fixtureFilesystem(readers, sourceRoot) {
  const wrapped = new Map(), descriptors = new Set();
  const get = key => {
    if (key in native && fs[key] !== native[key]) return fs[key]; // Preserve deliberate failure injection.
    if (key === 'mkdtempSync') return prefix => { const p = filePath(prefix); if (!p.startsWith(temp + path.sep)) throw new Error('Fixture temp prefix outside OS temp'); const root = native.mkdtempSync(prefix); roots.add(path.resolve(root)); return root; };
    if (['readFileSync','readdirSync','existsSync','statSync'].includes(key)) return readers[key];
    if (key === 'copyFileSync') return (from, to, flags) => { allowed(to); native.writeFileSync(to, readers.readFileSync(from), { flag: flags & native.constants.COPYFILE_EXCL ? 'wx' : 'w' }); };
    if (key === 'cpSync') return function copy(from, to, options = {}) { allowed(to); const stat = readers.statSync(from); if (stat.isDirectory()) { if (!options.recursive) throw new Error('Recursive fixture copy must be explicit'); native.mkdirSync(to,{recursive:true}); for (const entry of readers.readdirSync(from,{withFileTypes:true})) { if (entry.isSymbolicLink()) throw new Error('Fixture source symlink refused'); copy(path.join(from,entry.name),path.join(to,entry.name),options); } } else native.writeFileSync(to,readers.readFileSync(from)); };
    if (key === 'renameSync') return (from,to) => { allowed(from); allowed(to); return native.renameSync(from,to); };
    if (key === 'openSync') return (file, ...args) => { allowed(file); const fd = native.openSync(file,...args); descriptors.add(fd); return fd; };
    if (key === 'closeSync') return fd => { if (!descriptors.has(fd)) throw new Error('Unowned fixture descriptor'); descriptors.delete(fd); return native.closeSync(fd); };
    if (typeof key === 'string' && /^(?:writeFile|appendFile|unlink|rm|rmdir|mkdir|truncate|chmod|chown).*Sync$/u.test(key)) return (file,...args) => { if (typeof file === 'number') { if (!descriptors.has(file)) throw new Error('Unowned fixture write descriptor'); } else allowed(file); return native[key](file,...args); };
    if (['symlinkSync','linkSync'].includes(key)) return () => { throw new Error('Synthetic fixtures cannot create links'); };
    return fs[key];
  };
  return new Proxy(fs,{get(_target,key){if (!wrapped.has(key) || (key in native && fs[key] !== native[key])) return get(key); return wrapped.get(key);}});
}
export function fixtureChildProcess(root, wrapper) {
  const redirect = (command,args,options) => {
    if (command !== process.execPath) return {command,args,options};
    const [entry,...rest] = args;
    if (!entry || !path.resolve(entry).startsWith(root + path.sep) || !/\.(?:mjs|js)$/u.test(entry)) throw new Error('Unsupported synthetic Node subprocess entry');
    return { command, args:['--max-old-space-size=3072','--experimental-vm-modules',wrapper,path.relative(root,entry),...rest], options };
  };
  return { ...childProcess,
    spawnSync(command,args,options) { const r=redirect(command,args,options); return childProcess.spawnSync(r.command,r.args,r.options); },
    execFileSync(command,args,options) { const r=redirect(command,args,options); return childProcess.execFileSync(r.command,r.args,r.options); },
  };
}
export const fixtureNativeFs = native;
