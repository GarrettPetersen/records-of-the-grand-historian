#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { createHash } from 'node:crypto';
import { parseArgs } from 'node:util';
const {values}=parseArgs({options:{registry:{type:'string'},out:{type:'string'}}});
if(!values.registry||!values.out)throw Error('Use --registry DIRECTORY --out NEW_DIRECTORY');
const registry=fs.realpathSync(values.registry),out=path.resolve(values.out);
const bytes=fs.readFileSync(path.join(registry,'manifest.json'));
const source=JSON.parse(bytes);
if(source.kind!=='canonical-identity-dossier-store'||source.schemaVersion!==1)throw Error('Expected native immutable dossier store');
for(const role of ['headers','metadata'])if(!/^[a-f0-9]{64}$/.test(source[role]?.sha256??'')||!Number.isSafeInteger(source[role]?.bytes))throw Error('Invalid native store seal');
if(source.headers.file!=='dossiers.jsonl'||source.metadata.file!=='index.jsonl')throw Error('Unexpected native store filenames');
if(fs.existsSync(out))throw Error('Export directory already exists; retain partial state and choose a new output or reuse a verified completed export');
fs.mkdirSync(path.join(out,'index'),{recursive:true,mode:0o700});
const manifest={schemaVersion:1,kind:'read-only-canonical-people-api',generation:createHash('sha256').update(bytes).digest('hex'),
  dossierCount:source.dossierCount,provenance:source.provenance,sourceStore:{headers:source.headers,metadata:source.metadata},
  indexPolicy:{postingIdsStored:64,searchResults:8,chunkBytes:32*1024*1024},
  sourceEditorialApproval:false,chronologyApproval:false,publicationApproval:false};
const descriptors=new Map(),counts=new Map();let rowCount=0;
const fdFor=name=>{
  if(descriptors.has(name)){const fd=descriptors.get(name);descriptors.delete(name);descriptors.set(name,fd);return fd;}
  if(descriptors.size>=24){const [old,fd]=descriptors.entries().next().value;fs.closeSync(fd);descriptors.delete(old);}
  const fd=fs.openSync(path.join(out,'index',name+'.jsonl'),'a',0o600);descriptors.set(name,fd);return fd;
};
// Hash all original bytes; only export the three read-only lookup families.
const metadataHash=createHash('sha256');let metadataBytes=0;
const input=fs.createReadStream(path.join(registry,source.metadata.file));
input.on('data',chunk=>{metadataHash.update(chunk);metadataBytes+=chunk.length;});
try {
 for await(const line of readline.createInterface({input,crlfDelay:Infinity})){
  if(Buffer.byteLength(line)>8*1024*1024)throw Error('Oversized native index record');
  const [kind,key,original]=JSON.parse(line);
  if(!['dossier','postings','canonicalByKnownId'].includes(kind))continue;
  const value=kind==='postings'?{...original,ids:original.ids.slice(0,64)}:original;
  const rowKey=JSON.stringify([kind,key]),bucket=createHash('sha256').update(rowKey).digest('hex').slice(0,3);
  const data=JSON.stringify([rowKey,value])+'\n';
  fs.writeSync(fdFor(bucket),data);counts.set(bucket,(counts.get(bucket)??0)+Buffer.byteLength(data));rowCount++;
 }
}finally{for(const fd of descriptors.values())fs.closeSync(fd);}
if(metadataBytes!==source.metadata.bytes||metadataHash.digest('hex')!==source.metadata.sha256)throw Error('Native index changed or fails its source seal');
const headersHash=createHash('sha256');let headersBytes=0;
for await(const chunk of fs.createReadStream(path.join(registry,source.headers.file))){headersHash.update(chunk);headersBytes+=chunk.length;}
if(headersBytes!==source.headers.bytes||headersHash.digest('hex')!==source.headers.sha256)throw Error('Native dossier bytes fail their source seal');
const parts=[];
for(const name of fs.readdirSync(path.join(out,'index')).sort()){
 const content=fs.readFileSync(path.join(out,'index',name));
 if(content.length>256*1024)throw Error(`Lookup shard ${name} exceeds service bound; repartition rather than increasing request CPU`);
 parts.push({key:`index/${name}`,bytes:content.length,sha256:createHash('sha256').update(content).digest('hex')});
}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx',mode:0o600});
fs.writeFileSync(path.join(out,'export.json'),JSON.stringify({registry,prefix:`snapshots/${manifest.generation}`,manifest,parts},null,2)+'\n',{flag:'wx',mode:0o600});
console.log(JSON.stringify({out,prefix:`snapshots/${manifest.generation}`,dossiers:manifest.dossierCount,indexParts:parts.length,indexBytes:[...counts.values()].reduce((a,b)=>a+b,0),rows:rowCount}));
