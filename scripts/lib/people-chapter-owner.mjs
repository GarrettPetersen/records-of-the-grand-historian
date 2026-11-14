import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomBytes,timingSafeEqual} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {spawnSync} from 'node:child_process';
import {contentUnits,setTranslationField,writeJsonAtomic} from './people-content.mjs';

export const digest = bytes => 'sha256:'+createHash('sha256').update(bytes).digest('hex');
const need=(ok,message)=>{if(!ok)throw Error(message);};
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const roleTargets={owner:['extraction','materialization','editorial-proposals'],reviewer:['editorial','identity-review','date-report','review-validation','input-seal']};
export const ownerDirectory=(root,id)=>{need(/^[a-z0-9_-]+-\d{3}-[a-f0-9]{12}$/.test(id),'Invalid chapter job ID');return path.join(root,'data/people/generated/chapter-owners',id);};
const regular=file=>{const s=fs.lstatSync(file);need(s.isFile()&&!s.isSymbolicLink(),'Expected regular artifact');return s;};
export function pinChapterNativeRuntime(root,job,nativeRoot){
 job.nativeRoot=fs.realpathSync(nativeRoot);
 const files=['scripts/validate-people-extraction.mjs','scripts/build-people-extraction-packet.mjs','scripts/lib/people-compact.mjs','scripts/lib/people-combined-curation-review.mjs','scripts/lib/people-combined-footnote-review.mjs','scripts/lib/people-combined-curation.mjs','scripts/lib/people-editorial-decisions.mjs','scripts/lib/people-date-audit.mjs','scripts/lib/people-content.mjs','scripts/lib/people-candidates.mjs','scripts/publish-people-combined-curation.mjs',...fs.readdirSync(path.join(job.nativeRoot,'data/people/schema')).filter(n=>n.endsWith('.schema.json')).map(n=>'data/people/schema/'+n)];
 job.nativeSeals=files.map(file=>({file,sha256:digest(fs.readFileSync(path.join(job.nativeRoot,file)))}));
 job.artifacts=job.artifacts.filter(a=>!a.id.startsWith('native-'));
 for(const [index,pin] of job.nativeSeals.entries())job.artifacts.push({id:'native-'+index,file:path.relative(root,path.join(job.nativeRoot,pin.file)),bytes:fs.statSync(path.join(job.nativeRoot,pin.file)).size,sha256:pin.sha256,use:'pinned-production-contract'});
 return job;
}
export function prepareChapterOwner(root,{book,chapter,lane,worker,ledger,extra=[]}){
 need(/^[a-z0-9_-]+$/.test(book)&&/^\d{3}$/.test(chapter),'Invalid chapter scope');
 need(['cursor-sdk','grokbot'].includes(lane)&&worker,'Explicit supported lane and stable worker required');
 const key=book+'/'+chapter,priorDate=ledger.dateAudits?.[key];
 need(!priorDate?.executorToken||Date.parse(priorDate.executorExpiresAt)<=Date.now(),'A live date executor owns this chapter');
 need(!ledger.chapterOwners?.[key]||ledger.chapterOwners[key].status==='published','Chapter already has an owner; resume it');
 const id=`${book}-${chapter}-${randomBytes(6).toString('hex')}`,dir=ownerDirectory(root,id);
 fs.mkdirSync(dir,{recursive:true,mode:0o700});
 const source=path.join(root,`data/${book}/${chapter}.json`),extraction=path.join(root,`data/people/extractions/${book}/${chapter}.json`);
 const candidates=new Set([source,extraction]),hostOnlyReferences=[];
 for(const kind of ['editorial-decisions','date-audits','chapter-identity','identity-certificates']){
  const file=path.join(root,`data/people/${kind}/${book}/${chapter}.json`);if(fs.existsSync(file))candidates.add(file);
 }
 const generated=path.join(root,'data/people/generated');
 const walk=directory=>{
  for(const item of fs.readdirSync(directory,{withFileTypes:true})){
   const file=path.join(directory,item.name);
   if(item.isSymbolicLink()||item.isDirectory()&&['node_modules','.git','public'].includes(item.name)){
    hostOnlyReferences.push({file:path.relative(root,file),reason:'Dependency/workspace reference; deliberately not followed or copied'});continue;
   }
   if(item.isDirectory())walk(file);else if(item.isFile()&&/\.(json|jsonl|md|txt|mjs)$/.test(item.name))candidates.add(file);
  }
 };
 for(const category of ['completion','date-workflow','chunk-extractions','rejected-chunk-extractions','editorial-review','independent-date-source-review','openrouter-extractions','grokbot','stale-source-extractions']){
  const parent=path.join(generated,category,book);if(!fs.existsSync(parent))continue;
  for(const item of fs.readdirSync(parent,{withFileTypes:true}))if(item.name===chapter||item.name.startsWith(chapter+'.')){
   const file=path.join(parent,item.name);if(item.isDirectory())walk(file);else if(item.isFile())candidates.add(file);
  }
 }
 for(const item of fs.readdirSync(generated,{withFileTypes:true}))if(item.name.includes(book+chapter)){
  const file=path.join(generated,item.name);if(item.isDirectory())walk(file);else if(item.isFile())candidates.add(file);
 }
 for(const file of extra){const resolved=fs.realpathSync(file);need(resolved.startsWith(root+path.sep),'Extra recovery must be inside the shared checkout');regular(resolved);candidates.add(resolved);}
 // Documentation/code contracts are bounded explicit inputs, never an entire checkout.
 for(const name of ['PEOPLE_SINGLE_OWNER_WORKFLOW.md','PEOPLE_DATE_AUDIT.md','scripts/publish-people-combined-curation.mjs','scripts/lib/people-combined-curation-review.mjs','scripts/lib/people-compact.mjs','data/people/schemas/people-extraction-compact.schema.json']){
  const file=path.join(root,name);if(fs.existsSync(file))candidates.add(file);
 }
 const artifacts=[...candidates].sort().flatMap((file,index)=>{
  const size=regular(file).size;
  if(size>16*1024*1024){hostOnlyReferences.push({file:path.relative(root,file),bytes:size,reason:'Oversized recovery: request bounded indexed host evidence, not a full-file download'});return[];}
  return[{id:'a'+String(index).padStart(4,'0'),file:path.relative(root,file),bytes:size,sha256:digest(fs.readFileSync(file)),
   use:file===source||file===extraction?'current-input':'recovery-evidence-not-approval'}];
 });
 const recovery={extraction:read(path.join(generated,'extraction-state.json')).chapters?.[key]??null,
  dateClaim:priorDate??null,extractionClaim:ledger.claims[key]??null,identityClaim:ledger.identityReviews?.[key]??null};
 writeJsonAtomic(path.join(dir,'recovery-state.json'),recovery);
 const snapshot=path.join(dir,'recovery-state.json');artifacts.push({id:'recovery-state',file:path.relative(root,snapshot),bytes:fs.statSync(snapshot).size,sha256:digest(fs.readFileSync(snapshot)),use:'recovery-evidence-not-approval'});
 const sourceValue=read(source),extractionValue=read(extraction);
 const job={schemaVersion:1,id,book,chapter,lane,worker,status:'prepared',revision:0,createdAt:new Date().toISOString(),
  sourceSha256:digest(fs.readFileSync(source)),extractionSha256:digest(fs.readFileSync(extraction)),artifacts,hostOnlyReferences,
  unitIds:contentUnits(sourceValue).map(u=>u.id),coveredUnits:[],authors:[...new Set([extractionValue.run?.agentId,...(extractionValue.run?.chunks??[]).map(c=>c.agentId)].filter(Boolean))],originalAuthorWorkerIds:ledger.claims[key]?.lane==='grokbot'?[ledger.claims[key].worker]:[],findings:[],repairs:[],
  priorDateClaim:priorDate??null,priorDateClaimHash:priorDate?digest(JSON.stringify(priorDate)):null,
  lookupGeneration:'snapshots/cb756c508e0265caad63cdac5c50b49c06d4ca2d2d19bb6e1ef9bde48db40aac'};
 writeJsonAtomic(path.join(dir,'source.json'),sourceValue);writeJsonAtomic(path.join(dir,'extraction.json'),extractionValue);
 for(const name of ['materialization','editorial-proposals','identity-review','date-report','review-validation','input-seal'])writeJsonAtomic(path.join(dir,name+'.json'),{});
 const existingEditorial=path.join(root,`data/people/editorial-decisions/${book}/${chapter}.json`);
 if(fs.existsSync(existingEditorial))fs.copyFileSync(existingEditorial,path.join(dir,'editorial.json'));else writeJsonAtomic(path.join(dir,'editorial.json'),{});
 job.editorialHistorySealed=true;
 for(const role of ['owner','reviewer'])fs.writeFileSync(path.join(dir,role+'-token'),randomBytes(32).toString('hex'),{flag:'wx',mode:0o600});
 writeJsonAtomic(path.join(dir,'job.json'),job);return job;
}
export function authenticateChapterRole(root,id,role,token){
 need(['owner','reviewer'].includes(role),'Invalid chapter role');
 const dir=ownerDirectory(root,id),expected=fs.readFileSync(path.join(dir,role+'-token'),'utf8');
 const actual=Buffer.from(token??''),wanted=Buffer.from(expected);
 need(actual.length===wanted.length&&timingSafeEqual(actual,wanted),'Invalid scoped chapter credential');
 return{dir,role};
}
function pointer(document,p){
 need(p===''||p.startsWith('/'),'Expected a JSON pointer');
 const keys=p===''?[]:p.slice(1).split('/').map(k=>k.replace(/~1/g,'/').replace(/~0/g,'~'));
 need(!keys.some(k=>['__proto__','prototype','constructor'].includes(k)),'Unsafe JSON pointer');
 let value=document;for(const key of keys){need(value!==null&&typeof value==='object'&&Object.hasOwn(value,key),'Unknown pointer '+p);value=value[key];}return{keys,value};
}
export function chapterOperation(root,id,role,operation,args={}){
 const dir=ownerDirectory(root,id),file=path.join(dir,'job.json'),job=read(file);
 const access=path.join(dir,'access.jsonl');
 need(!fs.existsSync(access)||fs.statSync(access).size<8*1024*1024,'Chapter access journal reached its bound; host reconciliation required');
 fs.appendFileSync(access,JSON.stringify({at:new Date().toISOString(),role,agentId:role==='owner'?job.ownerAgentId:job.reviewAgentId,operation,artifact:args.artifact,pointer:args.pointer})+'\n',{mode:0o600});
 if(operation==='manifest')return{...job,repairs:undefined,repairOperations:job.repairs.length,repairDetails:'chapter_read artifact repair-log (paged)',artifacts:job.artifacts.slice(args.artifactOffset??0,(args.artifactOffset??0)+40),nextArtifactOffset:(args.artifactOffset??0)+40<job.artifacts.length?(args.artifactOffset??0)+40:null,priorDateClaim:undefined,authors:job.authors,artifactCount:job.artifacts.length,
  instructions:'Read current source and extraction, then RESUME/HANDOFF and partial reviews. Reuse all valid work. Recovery evidence is not approval. Use bounded artifact reads and small patch/repair/coverage/finding calls. For a new array record call chapter_patch with add:true, pointer:/claims/N (N=current array length, or /claims/-), after:ONE_RECORD and no before. Do not replace whole arrays to append. Terminal clients can call list_tools for exact argument schemas. Do not clone, create a worktree, build or edit Git. Host owns canonical publication. A finish call requests host validation; it does not grant approval.'};
 if(operation==='read'){
  let value,fileInfo;
  if(args.artifact==='repair-log'){
   value=job.repairs;const bytes=Buffer.from(JSON.stringify(value));fileInfo={file:null,bytes:bytes.length,sha256:digest(bytes),computedView:true};
  }else if(args.artifact?.startsWith('draft:')){
   const target=args.artifact.slice(6);need(['source','extraction','materialization','editorial','editorial-proposals','identity-review','date-report','review-validation','input-seal','native-validation'].includes(target),'Unknown draft');
   const file=path.join(dir,target+'.json'),bytes=fs.readFileSync(file);value=JSON.parse(bytes);fileInfo={file,bytes:bytes.length,sha256:digest(bytes)};
  }else{
   const item=job.artifacts.find(a=>a.id===args.artifact);need(item,'Unknown sealed artifact');
   const target=path.join(root,item.file);need(fs.realpathSync(target)===target,'Sealed artifact path changed');
   const bytes=fs.readFileSync(target);need(digest(bytes)===item.sha256,'Sealed input changed; host reconciliation required');
   const text=bytes.toString('utf8');value=/\.json$/.test(item.file)?JSON.parse(text):text;
   fileInfo={file:target,bytes:bytes.length,sha256:item.sha256};
  }
  if(args.pointer!==undefined)value=pointer(value,args.pointer).value;
  const text=typeof value==='string'?value:JSON.stringify(value,null,2),offset=args.offset??0;
  need(Number.isSafeInteger(offset)&&offset>=0&&offset<=text.length,'Invalid artifact offset');
  return{...fileInfo,documentHash:digest(JSON.stringify(value)),text:text.slice(offset,offset+16000),offset,nextOffset:offset+16000<text.length?offset+16000:null,totalCharacters:text.length};
 }
 if(operation==='validate'){
  const guard=spawnSync(process.execPath,['scripts/check-local-disk.mjs'],{cwd:root,encoding:'utf8',env:{...process.env,PEOPLE_REPO_ROOT:root}});
  need(guard.status===0,'Resource guard failed; host remediation required: '+(guard.stdout||guard.stderr).slice(-5000));
  need(job.nativeRoot&&path.isAbsolute(job.nativeRoot)&&job.nativeSeals,'Host must pin the current production runtime; never validate modern recovery with the old checkout schema');
  for(const pin of job.nativeSeals)need(digest(fs.readFileSync(path.join(job.nativeRoot,pin.file)))===pin.sha256,'Pinned native runtime changed; host reconciliation required');
  const code=`
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
import {buildPeopleExtractionPacket} from './scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from './scripts/validate-people-extraction.mjs';
import {loadProperNounMatcher} from './scripts/lib/people-candidates.mjs';
const d=process.env.PEOPLE_CHAPTER_JOB_DIR,j=JSON.parse(fs.readFileSync(path.join(d,'job.json')));
const sourceBytes=fs.readFileSync(path.join(d,'source.json')),candidateBytes=fs.readFileSync(path.join(d,'extraction.json'));
const source=JSON.parse(sourceBytes),candidate=JSON.parse(candidateBytes);
const hash=bytes=>'sha256:'+createHash('sha256').update(bytes).digest('hex');
const packet=buildPeopleExtractionPacket(j.book,j.chapter,{chapterData:source,properNounMatcher:loadProperNounMatcher()});
const report={sourceSha256:hash(sourceBytes),extractionSha256:hash(candidateBytes),packetInput:packet.input};
try{const result=validateCompactPeopleExtraction(candidate,packet,{dataDir:process.env.PEOPLE_CHAPTER_DATA_DIR,strictAliasDispositions:true});report.passed=true;report.stats=result.stats;}
catch(e){report.passed=false;report.errors=e.errors??[e.message];process.exitCode=1;}
console.log(JSON.stringify(report));`;
  const result=spawnSync(process.execPath,['--max-old-space-size=512','--input-type=module','-'],{cwd:job.nativeRoot,input:code,encoding:'utf8',timeout:60000,maxBuffer:1024*1024,env:{...process.env,PEOPLE_REPO_ROOT:job.nativeRoot,PEOPLE_CHAPTER_JOB_DIR:dir,PEOPLE_CHAPTER_DATA_DIR:path.join(root,'data')}});
  need(!result.error,'Native validator execution failed: '+result.error?.message);
  need(result.stdout.trim(),'Native validator failed without a report: '+result.stderr.slice(-2000));
  const report=JSON.parse(result.stdout.trim());
  need(report.sourceSha256===digest(fs.readFileSync(path.join(dir,'source.json')))&&report.extractionSha256===digest(fs.readFileSync(path.join(dir,'extraction.json'))),'Draft changed during native validation; validate the current revision');
  report.nativeRoot=job.nativeRoot;report.nativeSeals=job.nativeSeals;
  const priorReport=path.join(dir,'native-validation.json');
  if(fs.existsSync(priorReport)){const history=path.join(dir,'validation-history');fs.mkdirSync(history,{recursive:true});fs.renameSync(priorReport,path.join(history,Date.now()+'-'+digest(fs.readFileSync(priorReport)).slice(7,19)+'.json'));}
  writeJsonAtomic(priorReport,report);
  return JSON.stringify(report).length<16000?report:{passed:report.passed,errors:report.errors?.slice(0,10),fullReport:'draft:native-validation',packetInput:{...report.packetInput,unitDigests:undefined}};
 }
 need(Number.isSafeInteger(args.revision)&&args.revision===job.revision,'Stale draft revision; get manifest and reconcile');
 const journal=path.join(dir,'operations.jsonl');
 need(Buffer.byteLength(JSON.stringify(args))<=64000,'Submit one bounded record per tool call');
 need(!fs.existsSync(journal)||fs.statSync(journal).size<16*1024*1024,'Chapter mutation journal reached 16 MiB; host inspection required');
 need(!(role==='owner'&&['ready-for-review','reviewing'].includes(job.status)),'Finished owner candidate is frozen pending host reconciliation');
 need(!(role==='reviewer'&&job.status!=='reviewing'),'Reviewer writes require an active independent review phase');
 need(['prepared','working','ready-for-review','reviewing'].includes(job.status),'Job is held or finished');
 if(operation==='append'){
  need(roleTargets[role]?.includes(args.target),'Role cannot write that artifact');
  need(Array.isArray(args.records)&&args.records.length>0&&args.records.length<=32,'Append between one and 32 reviewed records');
  const target=path.join(dir,args.target+'.json'),document=read(target),array=pointer(document,args.pointer).value;
  need(Array.isArray(array)&&array.length===args.expectedLength,'Append array length changed; reconcile current draft');
  array.push(...args.records);need(Buffer.byteLength(JSON.stringify(document))<=16*1024*1024,'Chapter draft exceeded 16 MiB');writeJsonAtomic(target,document);
 }else if(operation==='patch'){
  const allowed=roleTargets[role];
  need(allowed.includes(args.target),'Role cannot write that artifact');
  const target=path.join(dir,args.target+'.json'),document=read(target),keys=args.pointer===''?[]:args.pointer.slice(1).split('/').map(k=>k.replace(/~1/g,'/').replace(/~0/g,'~'));
  need(args.pointer?.startsWith('/')&&keys.length>0&&!keys.some(k=>['__proto__','prototype','constructor'].includes(k)),'Use a safe non-root JSON pointer');
  let parent=document;for(const key of keys.slice(0,-1)){need(parent&&Object.hasOwn(parent,key),'Unknown patch parent');parent=parent[key];}
  let key=keys.at(-1);need(parent&&typeof parent==='object','Invalid patch parent');
  if(args.add===true&&Array.isArray(parent)&&key==='-')key=String(parent.length);
  if(args.add===true){need(!Object.hasOwn(parent,key),'Add would replace existing data');if(Array.isArray(parent))need(key===String(parent.length),'Only append to an array');}
  else need(Object.hasOwn(parent,key)&&isDeepStrictEqual(parent[key],args.before),'Patch exact-before mismatch');
  need(Buffer.byteLength(JSON.stringify(args.after))<=48000,'Patch too large; submit individual records');
  parent[key]=args.after;need(Buffer.byteLength(JSON.stringify(document))<=16*1024*1024,'Chapter draft exceeded 16 MiB; host must inspect');writeJsonAtomic(target,document);
 }else if(operation==='repair'){
  need(role==='owner','Reviewer cannot author a repair');
  need(args.reason?.trim()&&['idiomatic','literal'].includes(args.field),'Repair needs idiomatic/literal field and source reason');
  need(args.before!==args.after,'No English repair is needed when before and after are identical');
  need(args.confidence===undefined||['high','medium','low'].includes(args.confidence),'Unknown confidence');
  need(typeof args.after==='string'&&Buffer.byteLength(args.after)<=48000,'Repair must be a bounded complete English replacement');
  const source=read(path.join(dir,'source.json')),unit=contentUnits(source).find(u=>u.id===args.unitId);need(unit,'Unknown source unit');
  setTranslationField(source,unit,args.field,args.before,args.after);
  writeJsonAtomic(path.join(dir,'source.json'),source);job.repairs.push({unitId:args.unitId,field:args.field,before:args.before,after:args.after,reason:args.reason,confidence:args.confidence});
 }else if(operation==='coverage'){
  need(role==='owner'&&Array.isArray(args.unitIds)&&args.bothEnglishFields===true,'Owner must attest both English fields');
  need(args.unitIds.every(u=>job.unitIds.includes(u)),'Unknown covered unit');job.coveredUnits=[...new Set([...job.coveredUnits,...args.unitIds])];
 }else if(operation==='finding'){
  need(typeof args.text==='string'&&args.text.trim()&&args.text.length<=12000,'Bounded concrete finding required');
  need(args.disposition===undefined||['note','repair-required','research-hold'].includes(args.disposition),'Unknown finding disposition');
  job.findings.push({role,disposition:args.disposition??'note',text:args.text});
 }else if(operation==='finish'){
  need(role==='owner'?job.coveredUnits.length===job.unitIds.length:job.reviewAgentId&&job.reviewAgentId!==job.ownerAgentId,'Incomplete coverage or missing independent reviewer');
  if(role==='owner'){
   const validation=read(path.join(dir,'native-validation.json'));
   need(validation.passed&&validation.sourceSha256===digest(fs.readFileSync(path.join(dir,'source.json')))&&validation.extractionSha256===digest(fs.readFileSync(path.join(dir,'extraction.json'))),'Current candidate must pass native extraction validation');
  }
  job.status=role==='owner'?'ready-for-review':'review-returned';
 }else throw Error('Unknown chapter operation');
 job.revision++;if(job.status==='prepared')job.status='working';
 fs.appendFileSync(path.join(dir,'operations.jsonl'),JSON.stringify({at:new Date().toISOString(),role,operation,args,resultRevision:job.revision})+'\n',{mode:0o600});
 writeJsonAtomic(file,job);return{saved:true,revision:job.revision,status:job.status,approvalGranted:false};
}
