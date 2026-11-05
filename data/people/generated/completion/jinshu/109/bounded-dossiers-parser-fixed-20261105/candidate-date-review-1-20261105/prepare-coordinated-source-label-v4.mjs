import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import {buildDateAuditPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import {validateCompactPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
import {validateAppliedEditorialDecisions} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',dir=new URL('.',import.meta.url).pathname,v3=dir+'reviewed-English-source-prepared-v3/',out=dir+'reviewed-English-label-source-prepared-v4/';
const read=p=>JSON.parse(fs.readFileSync(p)),need=(v,m)=>{if(!v)throw Error(m)},write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'}),hash=b=>createHash('sha256').update(b).digest('hex');
need(!inspectLocalDisk(root).errors.length,'Resource guard hold');need(!fs.existsSync(out),'Preserve existing coordinated preparation');
const source=read(v3+'prospective-packet.json'),editorial=read(v3+'editorial.json'),rows=[];
for(const[name,file]of [['canonical','extraction.json'],['replayed18','date-replay-candidate.json']]){
 const before=read(v3+file),after=structuredClone(before),person=after.people.find(p=>p[0]==='p112');
 need(person?.[1]?.[0]==='Heir of King Gao Zhen','Unexpected canonical label');person[1][0]='Heir of King Gao Zhao';
 const restored=structuredClone(after);restored.people.find(p=>p[0]==='p112')[1][0]='Heir of King Gao Zhen';need(JSON.stringify(restored)===JSON.stringify(before),'Non-label extraction data changed');
 const valid=validateCompactPeopleExtraction(after,source,{strictAliasDispositions:true});validateAppliedEditorialDecisions(editorial,valid.normalized);
 const options={dataDir:v3+'date-input',peopleDir:root+'/data/people'},oldPacket=buildDateAuditPacket('jinshu','109',{...options,extraction:before}),packet=buildDateAuditPacket('jinshu','109',{...options,extraction:after});
 need(JSON.stringify(oldPacket.items)===JSON.stringify(packet.items),'Date item, claim hash or hints changed');
 const people=structuredClone(packet.people);people.find(p=>p.id==='p112').names[0]='Heir of King Gao Zhen';need(JSON.stringify(people)===JSON.stringify(oldPacket.people),'Other person date fields changed');
 rows.push({name,after,packet,baselineExtractionHash:oldPacket.extractionHash,stats:valid.stats});
}
fs.mkdirSync(out);fs.linkSync(v3+'source.json',out+'source.json');fs.linkSync(v3+'editorial.json',out+'editorial.json');
for(const row of rows){write(out+(row.name==='canonical'?'extraction.json':'date-replay-candidate.json'),row.after);write(out+(row.name==='canonical'?'date-canonical-packet.json':'date-replay-packet.json'),row.packet)}
write(out+'label-delta-validation.json',{at:new Date().toISOString(),kind:'coordinated-source-label-preparation',personId:'p112',before:'Heir of King Gao Zhen',after:'Heir of King Gao Zhao',sourceHash:rows[0].packet.sourceHash,sourceFileSha256:hash(fs.readFileSync(out+'source.json')),generations:rows.map(r=>({name:r.name,baselineExtractionHash:r.baselineExtractionHash,proposedExtractionHash:r.packet.extractionHash,dateItems:r.packet.items.length,stats:r.stats})),claimsAndDateItemsUnchanged:true,otherPersonFieldsUnchanged:true,normalValidation:true,editorialValidation:true,independentLabelApproval:false,sourceApplied:false,canonicalWrites:0});
console.log(JSON.stringify({generations:rows.map(r=>({name:r.name,hash:r.packet.extractionHash,items:r.packet.items.length})),canonicalWrites:0,independentApproval:false}));
