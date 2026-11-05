import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',dir=new URL('.',import.meta.url).pathname,out=dir+'complete-English-coverage-c4f6b535-20261105/';
const read=p=>JSON.parse(fs.readFileSync(p)),hash=b=>createHash('sha256').update(b).digest('hex'),need=(v,m)=>{if(!v)throw Error(m)};
need(!inspectLocalDisk(root).errors.length,'Resource hold');
const m=read(out+'manifest.json'),preview=process.argv.includes('--preview');
need(hash(fs.readFileSync(root+'/data/jinshu/109.json'))===m.sourceByteSha256&&hash(fs.readFileSync(root+'/data/people/extractions/jinshu/109.json'))===m.canonicalByteSha256,'Frozen source changed');
if(!preview)need(m.parts.every(p=>p.phase==='returned')&&m.coveredUnits===302,'Finish all source coverage before sealing repair cross-reviews');
const jobs=[];
for(const part of m.parts.filter(p=>p.phase==='returned')){
  const input=read(part.inputFile),raw=fs.readFileSync(part.rawFile),r=JSON.parse(raw);
  need(hash(raw)===part.resultSha256,'Retained original reviewer result changed');
  const proposals=[...r.knownDecisions.filter(c=>c.decision==='amend'),...r.additionalCorrections].map((p,i)=>({...p,id:`coverage-${part.index}-english-${i+1}`,recordKind:'source-English'}));
  proposals.push(...r.recordCorrections.map((p,i)=>({...p,id:`coverage-${part.index}-record-${i+1}`})));
  const byId=new Map(input.sourceUnits.map(u=>[u.id,u]));
  const packet=group=>{
    const blocks=new Set([0]);for(const p of group){const u=byId.get(p.unit);need(u,'Source unit missing');for(const n of [u.blockIndex-1,u.blockIndex,u.blockIndex+1])blocks.add(n);}
    const recordIds=new Set(group.filter(p=>p.recordKind!=='source-English').map(p=>p.recordId));
    return {schemaVersion:1,kind:'independent-source-English-repair-packet',book:'jinshu',chapter:'109',sourceHash:m.sourceHash,canonicalExtractionHash:m.canonicalExtractionHash,stagedExtractionHash:m.stagedExtractionHash,sourceReviewer:{agentId:part.agentId,runId:part.runId,resultSha256:part.resultSha256},excludedReviewerIds:[part.agentId,'codex-thread:01a18e17-07b3-7f13-8e34-cb207908be33'],proposals:group,sourceUnits:input.sourceUnits.filter(u=>blocks.has(u.blockIndex)),sourceIssues:r.sourceIssues.filter(x=>blocks.has(byId.get(x.unit)?.blockIndex)),localClaimLabelHints:input.localClaimLabelHints.filter(h=>recordIds.has(h.id)),localPersonLabelHints:input.localPersonLabelHints.filter(h=>recordIds.has(h.id)),textualCaution:input.textualCaution,scope:'Independently check exact proposed source/record wording, whole paragraphs, both English fields and repeated uses. No date, identity or publication approval.'};
  };
  let group=[],sub=0;
  const flush=()=>{if(!group.length)return;const value=packet(group),bytes=JSON.stringify(value)+'\n',stem=`cross-part${String(part.index).padStart(3,'0')}-${String(++sub).padStart(2,'0')}`;need(Buffer.byteLength(bytes)<=56500,'Complete paragraph repair packet too large');jobs.push({stem,part:part.index,proposals:group.length,inputSha256:hash(bytes),inputBytes:Buffer.byteLength(bytes),value,bytes});group=[];};
  for(const p of proposals){if(group.length&&Buffer.byteLength(JSON.stringify(packet([...group,p])))>56500)flush();group.push(p);}flush();
}
if(preview){console.log(JSON.stringify({coverageReturned:m.returned,proposals:jobs.reduce((n,j)=>n+j.proposals,0),jobs:jobs.map(({stem,proposals,inputBytes})=>({stem,proposals,inputBytes})),writes:0}));}
else{
  const manifestFile=out+'cross-review-manifest.json';need(!fs.existsSync(manifestFile),'Preserve existing sealed cross-review cohort');
  for(const j of jobs)fs.writeFileSync(out+j.stem+'.input.json',j.bytes,{flag:'wx'});
  const stored=jobs.map(({value,bytes,...j})=>({...j,phase:'prepared',inputFile:out+j.stem+'.input.json',promptFile:out+j.stem+'.prompt.txt',rawFile:out+j.stem+'.review.raw.json'}));
  fs.writeFileSync(manifestFile,JSON.stringify({kind:'independent-source-English-repair-cohort',at:new Date().toISOString(),phase:'prepared',coverageManifest:out+'manifest.json',sourceHash:m.sourceHash,canonicalExtractionHash:m.canonicalExtractionHash,stagedExtractionHash:m.stagedExtractionHash,jobs:stored,canonicalWrites:0,chapterApproved:false},null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify({jobs:jobs.length,proposals:jobs.reduce((n,j)=>n+j.proposals,0),canonicalWrites:0}));
}
