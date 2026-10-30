from pathlib import Path
J=Path(__file__).resolve().parent
s=(J/'runtime.mjs').read_text()
s="import {fixtureFilesystem, fixtureChildProcess, fixtureNativeFs} from './fixture-io.mjs';\n"+s
for name in ['readFileSync','existsSync','readdirSync','statSync']:
 s=s.replace('return fs.'+name+'(', 'return fixtureNativeFs.'+name+'(')
a=s.index('const proxy=new Proxy(fs,');b=s.index('async function synthetic(',a)
s=s[:a]+"const proxy=fixtureFilesystem(methods,ROOT);\nconst childTools=fixtureChildProcess(ROOT,fileURLToPath(new URL('./run-pinned-test.mjs',import.meta.url)));\n"+s[b:]
s=s.replace("meta.url=pathToFileURL(ROOT+'/'+file).href;", "meta.url=pathToFileURL(ROOT+'/'+file).href;meta.resolve=specifier=>new URL(specifier,meta.url).href;")
a=s.index("async function linker(");b=s.index('export async function load(',a)
s=s[:a]+"""async function linker(specifier,from){
 if(specifier==='node:fs'||specifier==='fs')return synthetic(specifier,{...Object.fromEntries(Object.keys(fs).map(key=>[key,proxy[key]])),default:proxy});
 if(specifier==='node:child_process')return synthetic(specifier,{...childTools,default:childTools});
 if(specifier.startsWith('.'))return sourceModule(path.posix.normalize(path.posix.join(path.posix.dirname(from.identifier),specifier)));
 return synthetic(specifier,await import(specifier));
}
"""+s[b:]
s=s.replace("initializeImportMeta(meta){","importModuleDynamically:async(specifier,from)=>{const child=await linker(specifier,from);if(child.status==='unlinked')await child.link(linker);if(child.status==='linked')await child.evaluate();return child;},initializeImportMeta(meta){")
s=s.replace("return absolute===ROOT?'':","return absolute.startsWith(ROOT+'/node_modules/')?null:absolute===ROOT?'':")
(J/'fixture-runtime.mjs').write_text(s)
