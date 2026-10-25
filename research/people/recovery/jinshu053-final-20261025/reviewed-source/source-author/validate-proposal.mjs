import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const out=path.dirname(new URL(import.meta.url).pathname);
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
process.env.PEOPLE_REPO_ROOT='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
const imp=p=>import(pathToFileURL(path.join(runtime,p)).href);
const {applyDateRepairProposal,deriveDateRepairEditorialAmendment}=await imp('scripts/lib/people-date-workflow.mjs');
const {buildDateAuditPacket}=await imp('scripts/lib/people-date-audit.mjs');
const {buildPeopleExtractionPacket}=await imp('scripts/build-people-extraction-packet.mjs');
const {validateCompactPeopleExtraction}=await imp('scripts/validate-people-extraction.mjs');
const {validateAppliedEditorialDecisions}=await imp('scripts/lib/people-editorial-decisions.mjs');
const {sha256}=await imp('scripts/lib/people-content.mjs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(n,v)=>fs.writeFileSync(path.join(out,n),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const sealed=read(path.join(out,'../packet.json'));
const stored=read(sealed.candidateFile);
const packet=buildDateAuditPacket('jinshu','053',{extraction:stored});
if(packet.sourceHash!==sealed.sourceHash||packet.extractionHash!==sealed.extractionHash)throw new Error('Sealed inputs no longer current');
const claim=stored.claims[103];
if(JSON.stringify(claim)!==JSON.stringify(sealed.rows[0].row))throw new Error('Claim index mismatch');
const wu=stored.people.find(p=>p[0]==='p004');
const proposal={sourceHash:sealed.sourceHash,extractionHash:sealed.extractionHash,author:{name:'Codex targeted source/editorial author',agentId:'/root/jin053_final_source_author'},changes:[
 {kind:'remove',id:'claim-104',before:claim,reason:'s0044 dates a mulberry sprouting in the palace west wing, growing over a chi per day, and withering after several days. No person acts in this sentence. Its placement in Sima Yu’s biography does not make the tree’s date a personal attestation. Preserve the historical event in the chapter; remove only its unsupported ownership as Sima Yu’s life chronology.'},
 {kind:'hints',personId:'p004',before:wu[4].a,after:[],reason:'武帝愛之 in s0003 is an undated affection statement. The existing explicitly undated attestation preserves it correctly. A research sentence is not an active-date hint, and no chapter-supported Western activity interval can replace it.'}
]};
const candidate=applyDateRepairProposal(stored,proposal,packet);
const extractionPacket=buildPeopleExtractionPacket('jinshu','053');
const unit=extractionPacket.units.find(u=>u.id==='s0044');
if(!unit||unit.zh!==sealed.units.find(u=>u.id==='s0044').zh)throw new Error('Source unit mismatch');
const locator=Object.fromEntries(['id','kind','blockIndex','collection','itemIndex'].map(k=>[k,unit[k]]));
const next=stored.translationRepairs.length+1;
const repairs=[
 {id:`jinshu:053:r${String(next).padStart(4,'0')}`,unit:locator,field:'idiomatic',before:unit.en,after:'In the sixth lunar month of the ninth year, a mulberry sprouted in the palace’s west wing. It grew more than a chi each day, then withered after several days.',reason:'The current idiomatic field omits 六月, the extraordinary daily growth 日長尺餘, and the withering 數日而枯. These describe the event, not expendable stylistic detail. 宮西廂 is the palace’s west wing, not west of the halls. Preserve the lunar month without assuming Gregorian June.',confidence:'high',status:'proposed'},
 {id:`jinshu:053:r${String(next+1).padStart(4,'0')}`,unit:locator,field:'literal',before:unit.literal,after:'In the sixth lunar month of the ninth year, a mulberry sprouted in the west wing of the palace; it grew more than a chi each day and withered after several days.',reason:'宮西廂 means the west wing of the palace, rather than a location west of the palace. Retain the sixth lunar month, 尺餘 as more than a chi, and the sequence of daily growth followed by withering after several days; no Gregorian month or metric conversion is supplied.',confidence:'high',status:'proposed'}
];
const validate=c=>{const r=validateCompactPeopleExtraction(c,extractionPacket);return {result:r,summary:{passed:true,stats:r.stats??null,warnings:r.warnings??[]}};};
const validation={dateHelper:{passed:true,inputSourceHash:packet.sourceHash,inputExtractionHash:packet.extractionHash,candidateHash:sha256(JSON.stringify(candidate)),claim104Absent:!candidate.claims.some(c=>JSON.stringify(c)===JSON.stringify(claim)),p004Hints:candidate.people.find(p=>p[0]==='p004')[4].a,p001HintsUnchanged:JSON.stringify(candidate.people.find(p=>p[0]==='p001')[4].a)===JSON.stringify(stored.people.find(p=>p[0]==='p001')[4].a)}};
const dateResult=validate(candidate);validation.productionCompactDateOnly=dateResult.summary;
const decisions=read(path.join(process.env.PEOPLE_REPO_ROOT,'data/people/editorial-decisions/jinshu/053.json'));
try{validateAppliedEditorialDecisions(decisions,dateResult.result.normalized);validation.appliedEditorialHistory={passed:true,amendmentRequired:false};}
catch(e){const amendment=deriveDateRepairEditorialAmendment(decisions,dateResult.result.normalized);validation.appliedEditorialHistory={passed:false,error:e.message,normalWorkflowAmendmentAvailable:!!amendment,amendment};}
const withRepairs=structuredClone(candidate);
withRepairs.translationRepairs.push(...repairs.map(r=>[r.unit.id,r.field,r.before,r.after,r.reason,r.confidence,r.status]));
validation.productionCompactDateAndProposedEditorial=validate(withRepairs).summary;
validation.editorialBeforeValuesMatchCurrentSource=repairs.every(r=>r.before===unit[r.field==='idiomatic'?'en':'literal']);
validation.sourceUnchangedHash=buildDateAuditPacket('jinshu','053',{extraction:stored}).sourceHash;
validation.limitations=['All candidate mutations occurred only in memory. No candidate extraction or source was written.','Proposed English changes are schema/production validated as proposals, not applied or independently approved.','No chapter chronology approval is issued. Source changes require fresh fingerprints and current-source date review; do not preserve stale approvals.'];
write('date-proposal.json',proposal);
write('editorial-proposal.json',{schemaVersion:1,kind:'targeted-editorial-proposal',book:'jinshu',chapter:'053',sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,chapterFingerprint:extractionPacket.input.chapterFingerprint,sourceUnit:{...locator,zh:unit.zh,en:unit.en,literal:unit.literal},translationRepairs:repairs});
write('validation.json',validation);
console.log(JSON.stringify({out,validation},null,2));
