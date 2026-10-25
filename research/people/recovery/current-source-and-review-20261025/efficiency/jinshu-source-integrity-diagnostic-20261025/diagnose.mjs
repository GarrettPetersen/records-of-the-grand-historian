import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const root='/Users/garrettpetersen/records-of-the-grand-historian';
const revision='6f03021c25f441d002e0382d2f307556eca2df86';
const oldRevision='58b2288ce65d8b57a461736dec0b21684cb45d37';
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
process.env.PEOPLE_REPO_ROOT='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
const imp=f=>import(pathToFileURL(`${runtime}/scripts/${f}`));
const {contentUnits}=await imp('lib/people-content.mjs');
const {buildPeopleExtractionPacket}=await imp('build-people-extraction-packet.mjs');
const {expandPeopleExtraction,isCompactPeopleExtraction}=await imp('lib/people-compact.mjs');
const out=path.dirname(new URL(import.meta.url).pathname);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(args,opts={})=>execFileSync('git',args,{cwd:root,maxBuffer:100*1024*1024,...opts});
const sourcePaths=git(['ls-tree','--name-only',`${revision}:data/jinshu`],{encoding:'utf8'}).trim().split('\n').filter(p=>/^\d{3}\.json$/.test(p)).map(p=>`data/jinshu/${p}`);
const extractionPaths=git(['ls-tree','--name-only',`${revision}:data/people/extractions/jinshu`],{encoding:'utf8'}).trim().split('\n').filter(p=>/^\d{3}\.json$/.test(p)).map(p=>`data/people/extractions/jinshu/${p}`);
assert.equal(sourcePaths.length,130);assert.equal(extractionPaths.length,61);
const requests=[...sourcePaths.map(p=>`${revision}:${p}`),...extractionPaths.map(p=>`${revision}:${p}`),`${oldRevision}:data/jinshu/053.json`];
const response=git(['cat-file','--batch'],{input:requests.join('\n')+'\n'});
let offset=0;const objects=new Map();
for(const request of requests){const end=response.indexOf(10,offset);assert.ok(end>=offset);const header=response.subarray(offset,end).toString();const m=header.match(/^([a-f0-9]{40}) blob (\d+)$/);assert.ok(m,`Unexpected git object header: ${header}`);const size=Number(m[2]);const bytes=response.subarray(end+1,end+1+size);assert.equal(bytes.length,size);assert.equal(response[end+1+size],10);offset=end+size+2;objects.set(request,{request,gitBlob:m[1],bytes:bytes.length,rawSha256:hash(bytes),json:JSON.parse(bytes.toString('utf8'))});}
assert.equal(offset,response.length);
const pins=[],gapHits=[],mononymHits=[];
const gapPattern=/：\s*、/gu;
function gaps(object){const hits=[];for(const u of contentUnits(object.json)){for(const m of u.zh.matchAll(gapPattern))hits.push({chapter:object.json.meta.chapter,unit:u.id,locator:{blockIndex:u.blockIndex,collection:u.collection,itemIndex:u.itemIndex},codePointOffset:[...u.zh.slice(0,m.index)].length,matched:m[0],quote:u.zh,provenanceUrl:object.json.meta.url,sourcePin:{request:object.request,gitBlob:object.gitBlob,rawSha256:object.rawSha256}});}return hits;}
for(const sourcePath of sourcePaths){const source=objects.get(`${revision}:${sourcePath}`);pins.push((({json,...pin})=>pin)(source));gapHits.push(...gaps(source));}
for(const extractionPath of extractionPaths){const e=objects.get(`${revision}:${extractionPath}`);const chapter=path.basename(extractionPath,'.json');const s=objects.get(`${revision}:data/jinshu/${chapter}.json`);assert.ok(s);const units=contentUnits(s.json),byId=new Map(units.map(u=>[u.id,u]));const packet=buildPeopleExtractionPacket('jinshu',chapter,{chapterData:s.json});const expanded=isCompactPeopleExtraction(e.json)?expandPeopleExtraction(e.json,packet):e.json;assert.ok(Array.isArray(expanded.claims));pins.push((({json,...pin})=>pin)(e));for(const c of expanded.claims){if(c.predicate!=='name'||c.value?.kind!=='personal-name')continue;const name=c.value.zh;if(typeof name!=='string'||!/^[\p{Script=Han}]$/u.test(name))continue;if(units.some(u=>u.zh.includes(name)))continue;assert.ok(Array.isArray(c.evidence));const evidence=c.evidence.map(ref=>{const id=ref.split(':').at(-1);const u=byId.get(id);assert.ok(u,`Missing evidence ${ref}`);return {ref,unit:id,quote:u.zh,containsName:u.zh.includes(name)};});assert.ok(evidence.every(x=>!x.containsName));mononymHits.push({reviewOnly:true,chapter,person:c.subject,claim:c.id,certainty:c.certainty,name,citedEvidence:evidence,claimValue:c.value,provenanceUrl:s.json.meta.url,sourcePin:{request:s.request,gitBlob:s.gitBlob,rawSha256:s.rawSha256},extractionPin:{request:e.request,gitBlob:e.gitBlob,rawSha256:e.rawSha256}});}}
const old=objects.get(`${oldRevision}:data/jinshu/053.json`),current=objects.get(`${revision}:data/jinshu/053.json`);const oldHits=gaps(old),newHits=gaps(current);assert.ok(oldHits.some(h=>h.unit==='s0170'));assert.deepEqual(newHits,[]);
const write=(f,x)=>fs.writeFileSync(`${out}/${f}`,JSON.stringify(x,null,2)+'\n');
write('hits.json',{policy:'Review candidates only; no new gate, automatic error, approval, inferred name, or repair. A clear scan is not completeness evidence.',gapPattern:String(gapPattern),gapHits,absentPersonalNameChineseMononyms:mononymHits});
write('known-case-demonstration.json',{oldRevision,oldSourcePin:{request:old.request,gitBlob:old.gitBlob,rawSha256:old.rawSha256},oldHits,newRevision:revision,newSourcePin:{request:current.request,gitBlob:current.gitBlob,rawSha256:current.rawSha256},newHits,meaning:'The corrected list gap clears this narrow punctuation pattern; this does not establish source or date approval.'});
write('receipt.json',{revision,scope:'130 Jinshu source chapters and the 61 Jinshu extractions at the exact Git revision, read as batched in-memory Git objects; no working-copy chapter inputs.',createdAt:new Date().toISOString(),sourceCount:sourcePaths.length,extractionCount:extractionPaths.length,gapHitCount:gapHits.length,mononymReviewCandidateCount:mononymHits.length,runtime,peopleRepoRoot:process.env.PEOPLE_REPO_ROOT,runtimeHashes:['lib/people-content.mjs','build-people-extraction-packet.mjs','lib/people-compact.mjs'].map(file=>({file,sha256:hash(fs.readFileSync(`${runtime}/scripts/${file}`))})),scriptSha256:hash(fs.readFileSync(new URL(import.meta.url))),pins});
console.log(JSON.stringify({revision,sources:130,extractions:61,gapHits:gapHits.length,mononymReviewCandidates:mononymHits.length,knownCaseOld:oldHits.map(h=>h.unit),knownCaseNew:newHits.length,out}));
