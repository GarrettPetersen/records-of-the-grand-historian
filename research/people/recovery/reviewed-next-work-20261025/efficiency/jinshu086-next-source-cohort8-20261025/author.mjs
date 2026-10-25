import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const coherent='/Users/garrettpetersen/.codex/worktrees/jinshu086-date-canonical';
const runtime='/private/var/folders/wx/4cw6l8pd3jl0q9vb_3h58q5c0000gn/T/people-process-release-fB4Moe/verification';
process.env.PEOPLE_REPO_ROOT=coherent;
const out=path.dirname(new URL(import.meta.url).pathname);
const read=p=>JSON.parse(fs.readFileSync(p));
const hash=x=>'sha256:'+crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const narrow=read(path.join(out,'blinded-packet.json'));
const stored=read(narrow.candidateFile);
const prior=read('/Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/efficiency/jinshu086-next-source-cohort7-20261025/aggregate-proposal.json');
const {applyDateRepairProposal}=await import(runtime+'/scripts/lib/people-date-workflow.mjs');
const {buildDateAuditPacket,unresolvedDateAuditItems}=await import(runtime+'/scripts/lib/people-date-audit.mjs');
const {buildPeopleExtractionPacket}=await import(runtime+'/scripts/build-people-extraction-packet.mjs');
const {validateCompactPeopleExtraction}=await import(runtime+'/scripts/validate-people-extraction.mjs');
const {validateAppliedEditorialDecisions}=await import(runtime+'/scripts/lib/people-editorial-decisions.mjs');
const audit=buildDateAuditPacket('jinshu','086',{extraction:stored});
assert.equal(audit.sourceHash,narrow.sourceHash);assert.equal(audit.extractionHash,narrow.extractionHash);
const specs={
'claim-144':{evidence:['s0234','s0235','s0236','s0237','s0239','s0241','s0242','s0243'],text:'遣其將陰監逆保，聲言翼衛，實禦之也 (s0242 in Sima Bao’s flight sequence after s0234 元帝即位/建興六年, conventional onOrAfter AD318); exact interception year unstated',reason:'s0234 explicitly introduces Yuan’s accession and Jianxing6; s0235 then has Bao hear Min’s death and style himself king. 俄而 in s0236 and 未幾 in s0239 connect Bao’s subsequent defeats and appeals for help. s0241 has Bao plan flight to Zhang Shi; s0242 names Yin Jian as the general Shi sends to intercept him. This is Yin Jian’s own mission in that post-accession narrative, supporting the existing onOrAfter AD318 floor. The event supplies no exact mission year or upper endpoint; the separate subsequent 會保薨 notice is not converted into an imported320 endpoint.'},
'claim-158':{evidence:['s0255','s0256','s0257','s0258','s0260'],text:'建興初，南陽王保辟從事中郎，又薦為散騎侍郎、中壘將軍 (s0257 in Zhang Mao’s earlier-career backstory, followed by distinct 二年 appointment s0258); conventional onOrAfter AD313, exact recruitment year unstated',reason:'The heading and opening at s0255–s0256 introduce Zhang Mao’s biography; s0257 then explicitly places Prince of Nanyang Bao’s invitation and recommendations in 建興初. s0258 二年 is a separate court appointment refused because Mao’s father was old, and s0260 later names 太興三年 after Zhang Shi’s death. These anchors distinguish the earlier recruitment from Bao’s later flight/death narrative and identify Min’s Jianxing-era context. Preserve the existing onOrAfter AD313 floor for Bao’s own recruiting/recommending act. 初 remains an opening-period label, not an exact Jianxing1 year, and the distinct 二年 appointment is retained without assigning its exact year to Bao’s invitation.'},
'claim-446':{evidence:['s0234','s0235','s0236','s0239','s0241','s0242','s0243'],text:'會保薨，其眾散奔涼州者萬餘人 (s0243 after Bao’s flight/interception sequence s0235–s0242 following s0234 元帝即位/建興六年); conventional onOrAfter AD318, exact death year unstated',reason:'s0243 directly attests Bao’s death with 會保薨 and reports the dispersal of his followers. It follows his plan to flee to Zhang Shi at s0241 and Shi’s attempted interception at s0242, connected by the repeated named Bao to the post-s0234 accession sequence beginning with his response to Min’s death at s0235. The existing onOrAfter AD318 bound therefore dates Bao’s own death conservatively; this is not a later reception record or another ruler’s event. Preserve the exact death wording, with no exact320 year, Gregorian date, reign interval or latest endpoint imported from the retained Tongjian witness.'}
};
const proposal={schemaVersion:1,book:'jinshu',chapter:'086',sourceHash:audit.sourceHash,extractionHash:audit.extractionHash,author:{name:'Codex source author /root/jin086_next_source_cohort8',independentOfReviewer:true},summary:'Three linked Sima Bao flight/death and earlier recruitment source-context repairs: retain existing AD346 one-sided bounds and make their narrative basis explicit. Partial uninstalled proposal; no date approval.',changes:[]};
for(const item of narrow.items){assert(!prior.changes.some(c=>c.id===item.id));const before=stored.claims[item.claimIndex];assert.equal(hash(before),item.claimHash);const spec=specs[item.id];assert(spec);const after=structuredClone(before);after[2].sourceDate={text:spec.text};delete after[2].unresolved;delete after[2].unresolvedReason;if(after[2].dateContext){after[2].dateContext.sourceDate={text:spec.text};delete after[2].dateContext.unresolved;delete after[2].dateContext.unresolvedReason;assert.deepEqual(after[2].dateContext.westernBounds,before[2].dateContext.westernBounds);assert.equal(after[2].dateContext.event,before[2].dateContext.event);}after[4]=spec.evidence;assert.deepEqual(after[2].westernBounds,before[2].westernBounds);assert.equal(after[2].event,before[2].event);proposal.changes.push({kind:'replace',id:item.id,before,after,reason:spec.reason});}
const candidate=applyDateRepairProposal(stored,proposal,audit);
const combined={sourceHash:audit.sourceHash,extractionHash:audit.extractionHash,changes:[...prior.changes,...proposal.changes]};
const aggregate=applyDateRepairProposal(stored,combined,audit);
const extractionPacket=buildPeopleExtractionPacket('jinshu','086');
const editorial=read(path.join(coherent,'data/people/editorial-decisions/jinshu/086.json'));
function validate(x){const r=validateCompactPeopleExtraction(x,extractionPacket,{strictAliasDispositions:true});validateAppliedEditorialDecisions(editorial,r.normalized);return{compactPassed:true,strictAliasDispositions:true,existingEditorialHistoryPassed:true,stats:r.stats,audit:r.audit};}
const validation=validate(candidate),aggregateValidation=validate(aggregate);
const before=unresolvedDateAuditItems(audit).map(i=>i.id);
const after=unresolvedDateAuditItems(buildDateAuditPacket('jinshu','086',{extraction:candidate})).map(i=>i.id);
const priorCandidate=applyDateRepairProposal(stored,prior,audit);
const priorUnresolved=unresolvedDateAuditItems(buildDateAuditPacket('jinshu','086',{extraction:priorCandidate}));
const combinedUnresolved=unresolvedDateAuditItems(buildDateAuditPacket('jinshu','086',{extraction:aggregate}));
assert.deepEqual(candidate.people,stored.people);assert.deepEqual(candidate.claims[509],stored.claims[509]);
const receipt={schemaVersion:1,recordedAt:new Date().toISOString(),status:'Source-authored partial research only; independent review pending; uninstalled',sourceHash:audit.sourceHash,extractionHash:audit.extractionHash,proposalHash:hash(proposal),candidateHash:hash(candidate),cohortIds:narrow.items.map(i=>i.id),operations:proposal.changes.length,heldClaims:[],sourceUnitsRead:narrow.units.map(u=>u.id),validation,aggregateValidation,unresolvedBefore:before.length,unresolvedAfter:after.length,removedUnresolved:before.filter(id=>!after.includes(id)),prior117Unresolved:priorUnresolved.length,aggregate120Unresolved:combinedUnresolved.length,aggregateCandidateHash:hash(aggregate),canonicalOrStateFilesChanged:false,hintsChanged:false,boundsChanged:false,retrospectiveReclassification:false,limitations:'This is not a full source audit or approval. Existing 117 operations remain uninstalled. The three repaired calendar bounds were already encoded; source-specific connection is clarified without asserting exact event years. All remaining genuine conflicts and research holds remain. Production unresolvedDateAuditItems is used for all counts.'};
for(const [name,x]of Object.entries({'proposal.json':proposal,'aggregate-proposal.json':combined,'source-judgment.json':{heldClaims:receipt.heldClaims,items:Object.entries(specs).map(([id,s])=>({id,...s})),scope:'Only eight selected claims; no independent approval'},'receipt.json':receipt}))fs.writeFileSync(path.join(out,name),JSON.stringify(x,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(receipt,null,2));
