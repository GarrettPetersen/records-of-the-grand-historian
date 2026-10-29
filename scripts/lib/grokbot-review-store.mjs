import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import Ajv from 'ajv';
import {acquireProcessRunLock} from './process-run-lock.mjs';

const ID=/^[a-z0-9][a-z0-9-]{0,63}$/u;
const WORKER=/^grokbot-[a-z0-9][a-z0-9-]{0,47}$/u;
const HASH=/^[a-f0-9]{64}$/u;
const KINDS=new Set(['identity-review','editorial-review','date-review']);
const LIMIT=256*1024;
const need=(v,m)=>{if(!v)throw Error(m)};
export const reviewFingerprint=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const bytes=value=>Buffer.from(JSON.stringify(value)+'\n');
function writeExclusiveAtomic(file,b){
 const temp=file+'.'+randomUUID()+'.partial',fd=fs.openSync(temp,'wx',0o600);
 try{fs.writeFileSync(fd,b);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
 // Hard-link publication is atomic and cannot overwrite a prior result or symlink.
 // On failure retain the temporary evidence for explicit host reconciliation.
 fs.linkSync(temp,file);fs.unlinkSync(temp);
}

function privateFile(file){
 const stat=fs.lstatSync(file);
 need(stat.isFile()&&!stat.isSymbolicLink()&&(stat.mode&0o077)===0,'Review input must be an owner-only regular file');
 need(stat.size<=LIMIT,'Review input exceeds 256 KiB');
 return fs.readFileSync(file);
}
function privateDirectory(dir,{create=false}={}){
 if(create&&!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true,mode:0o700});
 const stat=fs.lstatSync(dir);
 need(stat.isDirectory()&&!stat.isSymbolicLink()&&(stat.mode&0o077)===0,'Review directory must be owner-only and not a symlink');
}
function assertJob(job){
 need(job&&JSON.stringify(Object.keys(job).sort())===JSON.stringify(['schemaVersion','id','worker','kind','book','chapter','sourceRevision','reviewerAgentId','authorAgentIds','prompt','packet','draft','reportSchema','hostOwnership'].sort()),'Unexpected/missing sealed review job fields');
 need(job?.schemaVersion===1&&ID.test(job.id??'')&&WORKER.test(job.worker??''),'Invalid review job identity');
 need(KINDS.has(job.kind),'Unsupported review job kind');
 need(/^[a-z0-9_-]+$/u.test(job.book??'')&&/^\d{3}$/u.test(job.chapter??''),'Invalid review scope');
 need(/^[a-f0-9]{40}$/u.test(job.sourceRevision??''),'Review source revision required');
 need(typeof job.reviewerAgentId==='string'&&job.reviewerAgentId.length>5,'Real independent reviewer agent ID required');
 need(Array.isArray(job.authorAgentIds)&&job.authorAgentIds.length>0&&job.authorAgentIds.every(id=>typeof id==='string'&&id.length>5)&&!job.authorAgentIds.includes(job.reviewerAgentId),'Reviewer must differ from every author');
 need(typeof job.prompt==='string'&&job.prompt.trim().length>20,'Sealed review instructions required');
 need(job.packet&&typeof job.packet==='object'&&!Array.isArray(job.packet)&&Object.keys(job.packet).length>0,'Nonempty sealed review packet required');
 need(job.draft&&typeof job.draft==='object'&&!Array.isArray(job.draft),'Sealed report seed required');
 need(job.reportSchema&&typeof job.reportSchema==='object'&&!Array.isArray(job.reportSchema),'Closed result schema required');
 need(job.reportSchema.type==='object'&&job.reportSchema.additionalProperties===false&&Array.isArray(job.reportSchema.required)&&job.reportSchema.required.length>0,'Result schema must require a closed report object');
 need(job.hostOwnership&&typeof job.hostOwnership.worker==='string'&&job.hostOwnership.worker.trim()&&typeof job.hostOwnership.scope==='string'&&job.hostOwnership.scope.trim()&&HASH.test(job.hostOwnership.receiptSha256??''),'Host ownership receipt required; this transport does not acquire campaign claims');
 need(bytes(job).length<=LIMIT,'Sealed review job exceeds 256 KiB');
 const validate=new Ajv({allErrors:true,strict:true}).compile(job.reportSchema);
 need(!validate.$async,'Asynchronous report schemas are forbidden');
 return job;
}

/** Artifact transport only. Neither a shaped report nor finalization grants review approval. */
export class GrokbotReviewStore{
 constructor(root){this.root=path.resolve(root);}
 directory(worker){need(WORKER.test(worker??''),'Invalid review worker');return path.join(this.root,worker);}
 jobFile(worker,id){need(ID.test(id??''),'Invalid review job ID');return path.join(this.directory(worker),id+'.job.json');}
 resultFile(worker,id){need(ID.test(id??''),'Invalid review job ID');return path.join(this.directory(worker),id+'.result.json');}
 read(worker,id){
  privateDirectory(this.root);privateDirectory(this.directory(worker));
  const job=assertJob(JSON.parse(privateFile(this.jobFile(worker,id))));
  need(job.worker===worker&&job.id===id,'Review storage identity mismatch');return job;
 }
 register(job){
  assertJob(job);
  privateDirectory(this.root,{create:true});privateDirectory(this.directory(job.worker),{create:true});
  const lock=path.join(this.directory(job.worker),'.registration.lock');
  const release=acquireProcessRunLock(lock,{label:'GrokBot review registration; inspect preserved owner before retrying',failIfExists:true});
  try{
  need(!this.list(job.worker).some(j=>j.status==='pending-review'),'Worker already has a preserved pending review; resume it first');
  const file=this.jobFile(job.worker,job.id),b=bytes(job);
  // Exclusive registration preserves every original job and uncertain dispatch.
  writeExclusiveAtomic(file,b);
  return {id:job.id,worker:job.worker,jobSha256:reviewFingerprint(job),packetSha256:reviewFingerprint(job.packet)};
  }finally{release();}
 }
 list(worker){
  const dir=this.directory(worker);if(!fs.existsSync(this.root))return [];
  privateDirectory(this.root);if(!fs.existsSync(dir))return [];privateDirectory(dir);
  return fs.readdirSync(dir).filter(n=>n.endsWith('.job.json')).sort().map(n=>{
   const job=this.read(worker,n.slice(0,-9)),file=this.resultFile(worker,job.id);
   if(fs.existsSync(file))this.savedResult(job);
   return {id:job.id,kind:job.kind,book:job.book,chapter:job.chapter,status:fs.existsSync(file)?'returned-awaiting-host':'pending-review',jobSha256:reviewFingerprint(job),packetSha256:reviewFingerprint(job.packet),reviewerAgentId:job.reviewerAgentId};
  });
 }
 validateReport(job,report){
  need(report&&typeof report==='object'&&!Array.isArray(report),'Review report must be an object');
  need(JSON.stringify(Object.keys(report).sort())===JSON.stringify(['schemaVersion','jobId','packetSha256','reviewer','result'].sort()),'Unexpected/missing review envelope fields');
  need(report.schemaVersion===1&&report.jobId===job.id&&report.packetSha256===reviewFingerprint(job.packet),'Review report does not match its sealed job');
  need(report.reviewer&&Object.keys(report.reviewer).length===2&&report.reviewer.agentId===job.reviewerAgentId&&typeof report.reviewer.name==='string'&&report.reviewer.name.trim(),'Independent reviewer identity mismatch');
  const validate=new Ajv({allErrors:true,strict:true}).compile(job.reportSchema);
  need(validate(report.result),'Review result failed its host-sealed report schema');
  need(bytes(report).length<=LIMIT,'Review report exceeds 256 KiB');
 }
 savedResult(job){const b=privateFile(this.resultFile(job.worker,job.id)),report=JSON.parse(b);this.validateReport(job,report);return {report,sha256:createHash('sha256').update(b).digest('hex'),bytes:b.length};}
 submit(job,report){
  this.validateReport(job,report);const file=this.resultFile(job.worker,job.id),b=bytes(report);
  if(fs.existsSync(file)){const saved=this.savedResult(job);need(reviewFingerprint(saved.report)===reviewFingerprint(report),'Different report already preserved; host reconciliation required');return this.receipt(job,saved);}
  writeExclusiveAtomic(file,b);
  return this.receipt(job,this.savedResult(job));
 }
 receipt(job,saved){return {received:true,jobId:job.id,worker:job.worker,book:job.book,chapter:job.chapter,kind:job.kind,sha256:saved.sha256,bytes:saved.bytes,status:'returned-awaiting-host',qualityApproved:false,published:false};}
}
