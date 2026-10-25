import fs from 'node:fs';import path from 'node:path';
import {baselineApi,changedRecords,hash} from '../../../../ownership-plan-draft-v2-30e2e9-20261025/scripts/lib/people-ownership-plan.mjs';
const dir=path.dirname(new URL(import.meta.url).pathname),old=path.join(dir,'../owner-full-author-20261026'),commit='fe23b5c8f6aefd758dbd53834819d8fee74213c4';
const read=n=>JSON.parse(fs.readFileSync(n,'utf8')),write=(n,o)=>fs.writeFileSync(path.join(dir,n),JSON.stringify(o,null,2)+'\n');
const api=await baselineApi(process.cwd(),commit),source=read(path.join(old,'source.json')),base=read(path.join(old,'extraction.json')),rows=read(path.join(dir,'english-proposals.compact-rows.json')).translationRepairs;
let afterSource=structuredClone(source);function units(x,out=[]){if(Array.isArray(x))x.forEach(v=>units(v,out));else if(x&&typeof x==='object'){if(x.id&&x.zh)out.push(x);else Object.values(x).forEach(v=>units(v,out));}return out;}
for(const r of rows){let u=units(afterSource).find(u=>u.id===r[0]);if(u.translations[0][r[1]]!==r[2])throw Error('stale proposal');u.translations[0][r[1]]=r[3];}
write('afterSource.UNAPPROVED.json',afterSource);
const beforePacket=api.p.buildPeopleExtractionPacket('jinshu','053'),afterPacket=api.p.buildPeopleExtractionPacket('jinshu','053',{chapterData:afterSource});
let c=read(path.join(old,'full-ownership.compact.json'));
// Replace the two partial names with their complete source references, and capture actual Yu title callback.
for(const [p,oldText,text,sid]of [['p049','Yu','He Yu','s0063'],['p038','Wang','Wang consort','s0065']]){let s=c.surfaces.find(s=>s[0]===p&&s[3]===oldText&&s[4].some(l=>l[0]===sid));if(!s)throw Error('span missing');s[3]=text;}
c.surfaces.push(['p001','title-reference','en','crown prince',[['s0063',[0]]]],['p001','alternate-name','en','white sand',[['s0070',[0]]]],['p001','alternate-name','zh','白沙',[['s0070',[0]]]],['p026','alternate-name','en','South wind',[['s0070',[0]]]],['p026','alternate-name','zh','南風',[['s0070',[0]]]]);
c.people.find(p=>p[0]==='p001')[5].push([{kind:'alternate-name',en:'white sand',zh:'白沙'},'strongly-inferred',['s0070','s0072']]);
c.surfaces.push(['p026','title-reference','zh','殿下',[['s0095',[0]]]]);
// Retain siblinghood and order, remove only unsupported maternal classifications.
for(const i of [83,96,97,98])delete c.claims[i][2].sharedParentage;
delete c.claims[80][2].relationshipState;
c.claims.splice(87,1);
let lady=c.people.find(p=>p[0]==='p056');lady[3]="Lady of Yicheng mentioned in Sima Yu's letter";lady[4].r=lady[4].r.filter(p=>p!=='p003');lady[5]=lady[5].filter(n=>n[0].en!=='Mother of Lady Xie');lady[6]=lady[6].filter(r=>r[0]!=='family-member');c.people.find(p=>p[0]==='p003')[4].r=c.people.find(p=>p[0]==='p003')[4].r.filter(p=>p!=='p056');
for(const p of c.people.filter(p=>['p002','p004','p006'].includes(p[0])))for(const n of p[5])if(n[0].kind==='temple-name')n[0].kind='posthumous-name';
// Source-backed historical allusions: no dates, parentage or imported life facts.
c.people.push(['p072',['Elder of Huguan','壺關',null],'historical','Historical remonstrator alluded to in the condolence text',{n:[],r:[],a:[],p:[],e:[],x:'The allusive 壺關 identifies the elder of Huguan; pinned Hanshu073 s0031 supports the reading. No life date is inferred.'},[[{kind:'title',en:'Elder of Huguan',zh:'壺關'},'strongly-inferred',['s0158']]],[['named-individual','explicit',['s0158']]]],['p073',['Qianqiu','千秋','Qianqiu'],'historical','Historical remonstrator alluded to in the condolence text',{n:[],r:[],a:[],p:[],e:[],x:'The name 千秋 alludes to the remonstrator documented in pinned Hanshu077 s0072–77. No surname, life date or office is imported.'},[[{kind:'given',en:'Qianqiu',zh:'千秋',pinyin:'Qianqiu'},'explicit',['s0158']]],[['named-individual','explicit',['s0158']]]]);
c.surfaces.push(['p072','alternate-name','zh','壺關',[['s0158',[0]]]],['p073','personal-name','zh','千秋',[['s0158',[0]]]]);
for(const p of ['p072','p073'])c.claims.push([p,'attestation',{undatedSourceAttestation:true,event:'Retrospectively alluded to as a historical remonstrator in the condolence text; no life date is stated.'},'explicit',['s0158']],[p,'event-participation',{kind:'retrospective-reference',receptionType:'retrospective',role:'exemplum',action:'alluded-to-in-condolence-text'},'explicit',['s0158']]);
// Remove the old place disposition for Huguan once exact named allusion is linked.
const oldHuguan=beforePacket.preflight.candidates.filter(x=>x.unit==='s0158'&&x.exact==='壺關').map(x=>x.id.split(':').at(-1));
for(const d of c.candidateDispositions)d[2]=d[2].filter(([id])=>!oldHuguan.includes(id));
c.candidateDispositions=c.candidateDispositions.filter(d=>d[2].length);
const review=structuredClone(c);review.translationRepairs.push(...rows);review.input=api.p.buildCompactPeopleExtractionSeed(beforePacket,base.run.model).input;
write('reviewExtraction.UNAPPROVED.compact.json',review);
try{const er=api.v.validateCompactPeopleExtraction(review,beforePacket,{strictAliasDispositions:true}).normalized;write('reviewExtraction.expanded.json',er);write('editorialDecisionSeed.UNFILLED.json',api.e.editorialDecisionSeed(er));write('proposalContracts.json',api.e.proposalContracts(er));console.log('REVIEW PASS',er.people.length,er.claims.length,er.mentions.length);}catch(e){console.log('REVIEW FAIL',e.message);}
const final=structuredClone(c);final.translationRepairs.push(...rows.map(r=>[...r.slice(0,6),'applied']));final.input=api.p.buildCompactPeopleExtractionSeed(afterPacket,base.run.model).input;
// Translation changed the literal/idiomatic naming surfaces in the reviewed units.
final.surfaces.push(['p026','title-reference','en','Your Highness',[['s0095',[0]]]],['p055','personal-name','en','Liu Zhen',[['s0122',[0]]]],['p061','personal-name','en','Lü',[['s0122',[0]]]],['p072','alternate-name','en','elder of Huguan',[['s0158',[0]]]],['p073','personal-name','en','Qianqiu',[['s0158',[0]]]]);
for(const s of final.surfaces)if(s[0]==='p040'&&s[3]==='Prince Chengdu of Ying')s[3]='Ying, Prince of Chengdu';
// Keep scanner accounts only for surviving exact candidates, then print unaccounted newcomers for substantive review.
const live=new Set(afterPacket.preflight.candidates.map(x=>x.id.split(':').at(-1)));for(const d of final.candidateDispositions)d[2]=d[2].filter(([id])=>live.has(id));final.candidateDispositions=final.candidateDispositions.filter(d=>d[2].length);
write('afterExtraction.UNAPPROVED-PROJECTION.compact.json',final);write('afterPacket.json',afterPacket);
try{const ea=api.v.validateCompactPeopleExtraction(final,afterPacket,{strictAliasDispositions:true}).normalized;write('afterExtraction.expanded.json',ea);const eb=api.v.validateCompactPeopleExtraction(base,beforePacket,{strictAliasDispositions:true}).normalized;write('complete-semantic-drift.json',{sourceDeltas:api.d.computeCurationDrift(api.d.parseCurationDriftJson(JSON.stringify(source)),api.d.parseCurationDriftJson(JSON.stringify(afterSource))),extractionDeltas:api.d.computeCurationDrift(api.d.parseCurationDriftJson(JSON.stringify(base)),api.d.parseCurationDriftJson(JSON.stringify(final))),changedRecords:changedRecords(eb,ea)});const originalEditorial=JSON.parse(api.read('data/people/editorial-decisions/jinshu/053.json'));
const historicalOnly=structuredClone(ea);historicalOnly.translationRepairs=historicalOnly.translationRepairs.slice(0,base.translationRepairs.length);
api.e.validateAppliedEditorialDecisions(originalEditorial,historicalOnly);
write('old-history-preservation-proof.json',{status:'Original historical components validated against candidate facts with ONLY the existing24repair prefix; not approval of11newrepairs',old24RepairRowsIdentical:JSON.stringify(base.translationRepairs)===JSON.stringify(final.translationRepairs.slice(0,24)),originalEditorialSha256:hash(api.read('data/people/editorial-decisions/jinshu/053.json')),originalHistoricalFourContractsValidated:true,originalEditorialMutated:false,newApprovalsOrComponentsCreated:false});
console.log('AFTER PASS',ea.people.length,ea.claims.length,ea.mentions.length);}catch(e){console.log('AFTER FAIL',e.message);}
console.log('PROPOSALS',rows.length);
