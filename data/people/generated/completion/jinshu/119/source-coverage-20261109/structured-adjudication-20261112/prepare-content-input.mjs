import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {buildPeopleExtractionPacket} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import {expandPeopleExtraction} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-compact.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url)),base=path.dirname(dir),root='/Users/garrettpetersen/records-of-the-grand-historian';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));
const write=(name,data)=>fs.writeFileSync(path.join(dir,name),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const pins={
 'data/jinshu/119.json':'6dfc672b2d80926464480722baa3a9f1ab09b2ac611551238aba3066e6c5423c',
 'data/people/extractions/jinshu/119.json':'4a1114d93e54faa26103ba6b5ec6b76010cc9681e237a515a499b6c0c7e270d3',
 [path.relative(root,path.join(base,'independent-decisions/candidate.compact.json'))]:'c96699fc43e16a94ad51de8936dc1196e0861fc76b9558bbaaf0880e6a835b3c',
 [path.relative(root,path.join(base,'independent-decisions/validated-review.json'))]:'4a02e936f91606197d9d7b8525d9aa5450f6e20b133ffc69c9a3d1a5ba1eb749',
 [path.relative(root,path.join(base,'candidate-review/structural-review.json'))]:'3f76dba26edbf36b80326d86fc1ad1c170a55eea6a6447fcc09d6ac9b936f93e',
 [path.relative(root,path.join(base,'candidate-review/p190-date-research.json'))]:'564221e3478c63732530703dece3de62c2aed962af3a796990bee8d93a2af955',
};
for(const [p,digest] of Object.entries(pins))if(hash(path.join(root,p))!==digest)throw new Error('Pin drift: '+p);
const packet=buildPeopleExtractionPacket('jinshu','119');
const compact=read(path.join(base,'independent-decisions/candidate.compact.json'));
const extraction=expandPeopleExtraction(compact,packet);
const claim=id=>{const c=extraction.claims.find(c=>c.id==='jinshu:119:'+id);if(!c)throw new Error('Missing '+id);return structuredClone(c);};
const witness=(unit,excerpt)=>({source:'chapter-text',citation:'Jinshu 119 '+unit,excerpt});
const changes=[];
function revise(id,repairId,after,reason,sourceWitness){changes.push({changeId:id,operation:'revise',repairId:'jinshu:119:'+repairId,before:claim(id),after,reason,sourceWitness});}
function retract(id,repairId,reason,sourceWitness){changes.push({changeId:id,operation:'retract',repairId:'jinshu:119:'+repairId,before:claim(id),reason,sourceWitness});}
for(const [id,repair,unit,event,quote] of [
 ['c1447','r0165','s0154','Yao Hui is identified through his maternal uncle Gou He; the implied mother has no dated personal activity in this passage.','恢舅苟和'],
 ['c1448','r0129','s0120','Yao Yi is identified as Yao Hong’s younger brother of the same mother; the unnamed shared mother has no dated personal activity in this passage.','殿下以母弟之親'],
]){const after=claim(id);after.value={undatedSourceAttestation:true,event};after.certainty='strongly-inferred';revise(id,repair,after,'The source entails this unnamed woman through kinship but does not attest that she was alive or active in AD 417. Preserve her record, name, sex, family role and all family links.',witness(unit,quote));}
retract('c1478','r0129','No service by Yao Hui’s mother is asserted in s0120 or s0154. Retain her distinct person and family links. Later Qin may remain an identity context for the ruler’s family, not a service claim.',witness('s0154','恢舅苟和'));
retract('c1479','r0129','No service by Hong and Yi’s shared mother is asserted. Retain the source-supported mother and both sons, without assigning a living date.',witness('s0120','殿下以母弟之親'));
const sibling=claim('c1483');sibling.value.line='maternal';revise('c1483','r0129',sibling,'母弟 explicitly identifies a younger brother through the same mother. Preserve the full sibling claim and both mother-son edges; remove the contradictory paternal-only line.',witness('s0120','殿下以母弟之親'));
const genealogy=claim('c1956');genealogy.value.kinshipTerm={en:'son'};revise('c1956','r0277',genealogy,'子略 is Xing’s courtesy name, not a kinship term. The father-son identification is a contextual inference from Chang→Xing succession/先構, independently corroborated by Jinshu 117 s0003; retain strongly-inferred certainty and no invented Chinese son span.',{source:'other',citation:'Jinshu 117 s0003; Jinshu 119 s0249 and s0260',excerpt:'姚興，字子略，萇之長子也。'});
changes.push({changeId:'c2095',operation:'add',repairId:'jinshu:119:r0275',after:{id:'jinshu:119:c2095',subject:'jinshu:119:p190',predicate:'event-participation',value:{kind:'retrospective-reference',receptionType:'retrospective',role:'deceased-former-lord',action:'Fu Jian’s corpse was exhumed and abused by Yao Chang, the act condemned by the historian.',otherPersonId:'jinshu:119:p183',provenance:{mode:'historian-judgment'}},certainty:'strongly-inferred',evidence:['jinshu:119:s0258']},reason:'舊主 is Fu Jian; Jinshu 116 s0175 explicitly describes exhumation of his corpse. This is posthumous reception, not living activity. Retain the existing retractions of c0743/c1858/c1904 and revisions of c0742/c0745. Do not restore the unsupported life interval from 苻亡. The researched accession AD 357 and death AD 385 remain separately cited research, not fabricated local attestation.',sourceWitness:{source:'other',citation:'Jinshu 119 s0258; Jinshu 116 s0175',excerpt:'薦棘而陵舊主；萇乃掘苻堅屍，鞭撻無數，裸剝衣裳，薦之以棘，坎土而埋之。'}});
const structure=read(path.join(base,'candidate-review/structural-review.json'));
const retainedReview=read(path.join(base,'independent-decisions/validated-review.json'));
const unitIds=[...new Set(structure.structural.map(([id])=>id).concat(['s0154','s0155','s0134','s0249','s0258','s0261']))];
const sourceUnits=packet.units.filter(u=>unitIds.includes(u.id));
const supportingUnits=[];
for(const [book,chapter,ids] of [['jinshu','117',['s0003']],['jinshu','113',['s0035']],['jinshu','114',['s0486','s0487','s0488']],['jinshu','116',['s0175','s0208','s0209','s0210','s0211','s0226']]]){
 const p=buildPeopleExtractionPacket(book,chapter);const source=path.join(root,'data',book,chapter+'.json');supportingUnits.push({book,chapter,file:source,sha256:hash(source),units:p.units.filter(u=>ids.includes(u.id))});
}
write('input.json',{schemaVersion:1,kind:'focused-structured-content-adjudication',book:'jinshu',chapter:'119',owner:'jinshu-release-dates-cursor-sdk',preparedAt:new Date().toISOString(),author:'codex-thread:01a1d320-8b64-7212-838a-0003aa367356',runtimeRelease:'60849db832e126bbacbf4da483644aa25a00fa09',pins,changes,sourceUnits,supportingUnits,structuralFindings:structure.structural,priorAcceptedStructuredChanges:{file:path.join(base,'independent-decisions/validated-review.json'),sha256:hash(path.join(base,'independent-decisions/validated-review.json')),claimRevisions:retainedReview.claimRevisions,claimRetractions:retainedReview.claimRetractions,claimAdditions:retainedReview.claimAdditions},personRecords:extraction.people.filter(p=>['p118','p119','p190','p193'].some(id=>p.localId.endsWith(':'+id))),affectedClaims:extraction.claims.filter(c=>['p118','p119','p190','p193'].some(id=>c.subject.endsWith(':'+id))||['c1483','c1493','c2045'].some(id=>c.id.endsWith(':'+id))),englishAlreadyAccepted:{file:path.join(base,'supplemental-adjudication-20261112/accepted-english-fields.json'),sha256:hash(path.join(base,'supplemental-adjudication-20261112/accepted-english-fields.json')),fields:16},authorExclusions:[...read(path.join(base,'supplemental-adjudication-20261112/input.json')).authorExclusions,'/root/jinshu119_supplement_reviewer_v2','codex-thread:01a1d320-8b64-7212-838a-0003aa367356'],scope:'Independently accept/revise/reject each concrete structured change, reconcile all 11 structural findings against retained source/claims/candidates, identify exact residual holds. This is not a new full date audit or chapter approval. All 202 legitimate people and 30 family relationships must survive unless an explicitly reviewed source-based contradiction requires a different accounting. Supplemental English stays outside native closed date/identity schemas. No canonical or shared Git writes by reviewer.'});
console.log(JSON.stringify({input:path.join(dir,'input.json'),sha256:hash(path.join(dir,'input.json')),bytes:fs.statSync(path.join(dir,'input.json')).size,changes:changes.length,sourceUnits:sourceUnits.length,structuralFindings:structure.structural.length,canonicalChanges:0}));
