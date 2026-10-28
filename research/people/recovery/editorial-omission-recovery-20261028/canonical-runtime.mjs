import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {pathToFileURL,fileURLToPath} from 'node:url';
export const ROOT='/Users/garrettpetersen/records-of-the-grand-historian';
export const REF='128527f37f5f89f9a09fc10fcba261d5b1b494e1';
export const overlay=new Map(),writes=new Set(),readPins=new Map();
const cache=new Map(),modules=new Map();
const git=(...args)=>execFileSync('git',args,{cwd:ROOT,maxBuffer:16*1024*1024});
const rel=p=>{const absolute=path.resolve(p instanceof URL?fileURLToPath(p):String(p));return absolute===ROOT?'':absolute.startsWith(ROOT+'/')?absolute.slice(ROOT.length+1):null;};
function blob(file){if(overlay.has(file))return overlay.get(file);if(cache.has(file))return cache.get(file);const b=git('show',REF+':'+file);cache.set(file,b);return b;}
function exists(file){if(file===''||overlay.has(file)||cache.has(file))return true;return git('ls-tree',REF,'--',file).length>0;}
const writable=file=>{file=file?.replace(/\/\.(\d{3}\.json)\.\d+\.tmp$/, '/$1');if(!file||!/^data\/(?:jinshu\/(?:031|053)\.json|zizhitongjian\/083\.json|people\/(?:extractions|editorial-decisions)\/(?:jinshu\/(?:031|053)|zizhitongjian\/083)\.json|people\/generated\/)/.test(file))throw Error('Nontransactional write rejected: '+file);};
const methods={
 readFileSync(p,options){const file=rel(p);if(file===null)return fs.readFileSync(p,options);const b=blob(file);readPins.set(file,true);return typeof options==='string'||options?.encoding?b.toString(typeof options==='string'?options:options.encoding):Buffer.from(b);},
 existsSync(p){const file=rel(p);if(file===null)return fs.existsSync(p);return exists(file)},
 readdirSync(p,options){const file=rel(p);if(file===null)return fs.readdirSync(p,options);return git('ls-tree',REF+(file?':'+file:':')).toString().trim().split('\n').filter(Boolean).map(line=>{const[meta,name]=line.split('\t');const type=meta.split(' ')[1];return options?.withFileTypes?{name,isFile:()=>type==='blob',isDirectory:()=>type==='tree',isSymbolicLink:()=>meta.startsWith('120000'),isBlockDevice:()=>false,isCharacterDevice:()=>false,isFIFO:()=>false,isSocket:()=>false}:name;});},
 statSync(p){const file=rel(p);if(file===null)return fs.statSync(p);const type=git('cat-file','-t',REF+':'+file).toString().trim();return {isDirectory:()=>type==='tree',isFile:()=>type==='blob',isSymbolicLink:()=>false,size:type==='blob'?blob(file).length:0};},
 mkdirSync(p){const file=rel(p);if(file===null||!file.startsWith('data/'))throw Error('Directory write outside transaction');},
 writeFileSync(p,data){const file=rel(p);writable(file);overlay.set(file,Buffer.isBuffer(data)?Buffer.from(data):Buffer.from(String(data)));writes.add(file);},
 renameSync(a,b){const from=rel(a),to=rel(b);writable(to);if(!overlay.has(from))throw Error('Rename lacks transactional source');overlay.set(to,overlay.get(from));overlay.delete(from);writes.delete(from);writes.add(to);},
};
const proxy=new Proxy(fs,{get(target,key){if(key in methods)return methods[key];if(typeof key==='string'&&/^(?:write|append|unlink|rm|rmdir|mkdir|rename|copy|link|symlink|truncate|chmod|chown|open)/.test(key))return()=>{throw Error('Unsupported filesystem mutation: '+key)};return target[key];}});
async function synthetic(key,namespace){if(modules.has(key))return modules.get(key);const m=new vm.SyntheticModule(Object.keys(namespace),function(){for(const[k,v]of Object.entries(namespace))this.setExport(k,v);},{identifier:key});modules.set(key,m);return m;}
function sourceModule(file){if(modules.has(file))return modules.get(file);const m=new vm.SourceTextModule(blob(file).toString(),{identifier:file,initializeImportMeta(meta){meta.url=pathToFileURL(ROOT+'/'+file).href;}});modules.set(file,m);return m;}
async function linker(specifier,from){if(specifier==='node:fs')return synthetic(specifier,{...fs,...methods,default:proxy});if(specifier.startsWith('.'))return sourceModule(path.posix.normalize(path.posix.join(path.posix.dirname(from.identifier),specifier)));return synthetic(specifier,await import(specifier));}
export async function load(file){const m=sourceModule(file);if(m.status==='unlinked')await m.link(linker);if(m.status==='linked')await m.evaluate();return m.namespace;}
export function read(file){return JSON.parse(blob(file).toString());}
export function set(file,value){overlay.set(file,Buffer.from(JSON.stringify(value,null,2)+'\n'));}

export function has(file){return exists(file);}
