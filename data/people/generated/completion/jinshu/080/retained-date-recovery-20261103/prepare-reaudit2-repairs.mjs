import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {buildDateAuditPacket, unresolvedDateAuditItems} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import {applyDateRepairProposal} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-workflow.mjs';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';

// Preparation only. Never changes the active workflow, ledger, or canonical inputs.
const root='/Users/garrettpetersen/records-of-the-grand-historian';
const base=path.dirname(fileURLToPath(import.meta.url));
const read=f=>JSON.parse(fs.readFileSync(f));
const need=(ok,message)=>{if(!ok)throw Error(message);};
need(process.argv.length===2,'This prepares an isolated proposal only');
need(!inspectLocalDisk(root).errors.length,'Resource guard rejected preparation');
const dir=root+'/data/people/generated/date-workflow/jinshu/080';
const state=read(dir+'/state.json');
need(state.phase==='reaudit'&&state.round===2&&!state.circuitBreaker,'Preserve current review or circuit state');
const source=read(dir+'/'+state.candidate), packet=buildDateAuditPacket('jinshu','080',{extraction:source});
need(packet.extractionHash==='sha256:af2ead9e282388392087d7c7f57b97362656fa7d88d355844a63fee1e208af28','Candidate changed');
const proposal=read(base+'/pending-marriage-upper-bound-proposal.json');
need(proposal.extractionHash===packet.extractionHash&&proposal.changes.length===4,'Marriage proposal changed');
const clone=v=>structuredClone(v), changes=proposal.changes;
const year=n=>({era:'AD',year:n,precision:'year'});
const row=n=>source.claims[n-1];
function replace(n,edit,reason){const before=row(n),after=clone(before);edit(after);changes.push({kind:'replace',id:'claim-'+n,before,after,reason});}
function hints(id,after,reason){const p=source.people.find(p=>p[0]===id);need(p,'Unknown person');changes.push({kind:'hints',personId:id,before:p[4].a,after,reason});}
replace(153,r=>{delete r[2].westernInterval;r[2].westernBounds={onOrBefore:year(353)};r[2].event='Wang Xizhi urged concord between Yin Hao and Huan Wen before the narrated northern expedition and Yao Xiang defeat; his Kuaiji appointment is not dated by this claim.';},
  'The chapter places the concord appeal before the expedition and Yao Xiang defeat; Jinshu008 dates that defeat to Jin Mu Di Yonghe9/10 (AD353). Retain only this secure ceiling, not AD351 inferred from an appointment chronology or a claim that conflict began in AD352. See retained independent report reaudit-2-e003df41912ea828ce3c and its primary annals references.');
hints('p001',['AD 340','on or before AD 353'],'Keep the separate AD340 event and synchronize the concord appeal to its secure upper bound; neither an appointment year nor a first year of political discord is established.');
for(const n of [173,186,210])replace(n,r=>{r[2].westernInterval.start=year(352);},
  'Preserve both reviewed readings of the yearless Kuaiji-prince letter: the competing Yonghe8 chronology and the post-Shansang Yonghe9-10 narrative placement. AD352-354 is an uncertainty window of conventional Jin Mu Di reign-year labels, not an exact Gregorian date or continuous activity. See independent report reaudit-2-240e0cfd766ba4f0cdf8 and its pinned annals/chronology witnesses.');
for(const id of ['p021','p024'])hints(id,['AD 352-354'],'Synchronize the letter activity hint to the reviewed competing Yonghe8-10 datings, without selecting a single winning year.');
hints('p028',['AD 352-354','AD 353'],'Retain the contested Kuaiji letter window and the separate explicit Lanting year. AD355 resignation belongs to a later episode; the famine remains explicitly undated.');
replace(962,r=>{delete r[2].sourceDate;delete r[2].westernBounds;r[2].dateContext={undatedSourceAttestation:true,event:'Wang Xizhi alludes to Lu Zhonglian in his yearless letter to Xie An about the commandery; this is reception, not Lu Zhonglian life activity.'};},
  'The phrase 蹈東海 is an allusion, not a date. Chapter080 s0085-88 gives no calendar year for this Xie An letter; the AD352-354 Kuaiji-prince letter window cannot be borrowed. Preserve the retrospective event, action, role and empty life hints.');
replace(964,r=>{r[2].dateContext={sourceDate:{text:'永和九年，歲在癸丑，暮春之初',regnalYear:9},westernYear:year(353)};r[4]=[...new Set([...r[4],'s0115'])];},
  'The Peng Zu allusion in s0127 belongs to the Lanting preface explicitly dated in s0115 to Eastern Jin Mu Di Yonghe9, guichou, early late spring (AD353 at year precision). Date the reception only; do not invent a numbered day or Peng Zu life hint.');
for(const n of [457,458,459,482,483])replace(n,r=>{const date=r[2].dateContext??r[2];date.westernBounds.onOrAfter=year(348);},
  'Jiankang Shilu08 places Liu Tan’s Danyang appointment in Jin Mu Di Yonghe3 winter twelfth month, whose verified month start falls in January348; the bounds describe proleptic Gregorian years. Keep the independently supported AD349 ceiling and Chinese office wording; no exact gathering year is asserted. See retained independent report reaudit-2-43b25019f28d55d00211 and its pinned witnesses.');
for(const id of ['p059','p060','p061'])hints(id,source.people.find(p=>p[0]===id)[4].a.map(x=>x.replace('on or after AD 347','on or after AD 348')),
  'Synchronize only the Danyang-tenure/gathering lower bound to the verified winter-twelfth-month appointment in Gregorian348; preserve every other activity hint and the AD349 upper bound.');
// The returned Wang Shu finding permits the existing ceiling when actual
// supplementary annals are pinned. Its own report now supplies those witnesses.
// Make the attribution visible in the candidate rather than mislabeling an
// external reign year as wording found in chapter080 s0156.
for(const n of [377,968])replace(n,r=>{const c=r[2].dateContext??r[2];c.event='Wang Shu was appointed Inspector of Yang province; the date comes from Jinshu008 Mu Di annals, Yonghe10 second month, not from the yearless wording in Jinshu080 s0156.';},
  'Jinshu008 records 以前會稽內史王述爲揚州刺史 under Jin Mu Di Yonghe10 second month (AD354). This externally derived personal appointment already has both an office claim and an attestation; preserve the supported active hint while making the supplementary date witness explicit. See report reaudit-2-7b2ebaf23940ef3a408d references.');
replace(387,r=>{r[2].dateContext.event='Wang Shu’s mother died before his completed mourning and appointment as Inspector of Yang; Jinshu075 supplies that sequence and Jinshu008 dates the appointment to Yonghe10 second month (AD354). This is a death ceiling, not a death year.';},
  'The reviewer explicitly permits restoring an AD354 ceiling with the pinned Jinshu008 annal and Jinshu075 母憂去職。服闋，代殷浩為揚州刺史. Both witnesses are in the returned report. Preserve the one-sided bound; do not infer a death year from mourning duration or add an activity hint to the mother.');
const output=applyDateRepairProposal(source,proposal,packet);
const next=buildDateAuditPacket('jinshu','080',{extraction:output});
need(!unresolvedDateAuditItems(next).length,'Unresolved research remains; do not dispatch another doomed review');
const selected=new Set(changes.filter(c=>c.kind==='replace').map(c=>Number(c.id.slice(6))-1));
for(let n=0;n<source.claims.length;n++)if(!selected.has(n))need(JSON.stringify(source.claims[n])===JSON.stringify(output.claims[n]),'Unrelated claim changed');
need(JSON.stringify(source.surfaces)===JSON.stringify(output.surfaces),'Mention evidence changed');
const bytes=JSON.stringify(proposal,null,2)+'\n';
const receipt={at:new Date().toISOString(),kind:'isolated-reaudit2-repair-preparation',sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,proposalSha256:createHash('sha256').update(bytes).digest('hex'),candidateExtractionHash:next.extractionHash,changes:changes.length,changedClaims:selected.size,unresolvedItems:0,canonicalWrites:0,workflowWrites:0,queueWrites:0,productionValidation:'pending idle invocation boundary',independentApproval:false,chapterApproved:false,scope:'Returned findings only; the complete cohort must finish and all findings be reconciled before adoption.'};
fs.writeFileSync(base+'/pending-reaudit2-repairs-proposal.json',bytes,{flag:'wx'});
fs.writeFileSync(base+'/pending-reaudit2-repairs-preview.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(receipt));
