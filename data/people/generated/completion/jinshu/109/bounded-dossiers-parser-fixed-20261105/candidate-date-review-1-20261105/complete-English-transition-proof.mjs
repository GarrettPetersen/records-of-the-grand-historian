import fs from 'node:fs';
import {hash,same,need,read} from './complete-English-source-common.mjs';
export const applicationBody=code=>{const marker='for(const[k,f]of Object.entries(manifest.files))';need(code.split(marker).length===2,'Unique unchanged application body boundary required');return code.slice(code.indexOf(marker));};
export function composeTransitionChecks(priorInput,priorReport,input,report,currentCode){
 const failed='immutable-seals-and-reused-runtime-boundary',fresh=[failed,'conservative-proof-composition'];
 need(priorInput.requiredChecks.includes(failed)&&priorReport.verdict==='needs-revision'&&priorReport.findings.length===1&&priorReport.checks.length===priorInput.requiredChecks.length&&new Set(priorReport.checks.map(c=>c.id)).size===priorInput.requiredChecks.length&&priorInput.requiredChecks.every(id=>priorReport.checks.some(c=>c.id===id&&c.verdict===(id===failed?'reject':'approve'))),'Only the exact single runtime-seal hold may be superseded');
 need(same(input.requiredChecks,fresh)&&report.verdict==='approve'&&!report.findings.length&&report.checks.length===fresh.length&&new Set(report.checks.map(c=>c.id)).size===fresh.length&&fresh.every(id=>report.checks.some(c=>c.id===id&&c.verdict==='approve'&&c.reason?.trim().length>=20)),'Both fresh independent seal and proof-composition checks required');
 for(const k of ['sourceHash','canonicalExtractionHash','stagedExtractionHash','manifestSha256'])need(input[k]===priorInput[k],'Unchanged source/preparation fingerprints required for proof reuse');
 const oldBody=applicationBody(priorInput.codeFiles['apply-complete-English-source.mjs']),newBody=applicationBody(currentCode);need(oldBody===newBody&&hash(Buffer.from(newBody))===input.retainedApplicationBodySha256,'Any application-body change requires a complete fresh transition review');
 for(const[f,h]of Object.entries(priorInput.sealedFileSha256))if(f!=='apply-complete-English-source.mjs')need(input.sealedFileSha256[f]===h,'Cannot reuse approval of changed code/source evidence: '+f);
 return {reusedChecks:priorReport.checks.filter(c=>c.verdict==='approve').map(c=>c.id),freshChecks:fresh,originalHoldResolved:failed,applicationBodyUnchanged:true};
}
export function validateFinalTransitionProof(control,currentCode){
 const prior=control.jobs.find(j=>j.stem==='code-transition-01'),job=control.jobs.find(j=>j.stem==='code-transition-02');
 need(control.phase==='ready-next'&&prior?.phase==='returned'&&prior.verdict==='needs-revision'&&job?.phase==='returned'&&job.verdict==='approve'&&control.jobs.every(j=>j.phase==='returned'&&(j===prior||j.verdict==='approve')),'Only the exact captured hold with a fresh independent resolution may proceed');
 const inputBytes=fs.readFileSync(job.inputFile),raw=fs.readFileSync(job.rawFile),input=JSON.parse(inputBytes),report=JSON.parse(raw),priorInputBytes=fs.readFileSync(prior.inputFile),priorRaw=fs.readFileSync(prior.rawFile),priorInput=JSON.parse(priorInputBytes),priorReport=JSON.parse(priorRaw);
 for(const[j,b,r,p]of [[job,inputBytes,raw,input],[prior,priorInputBytes,priorRaw,priorInput]]){const parsed=JSON.parse(r);need(hash(b)===j.inputSha256&&hash(r)===j.resultSha256&&parsed.packetSha256===j.inputSha256&&parsed.kind==='independent-code-and-source-transition-review'&&parsed.reviewer.agentId===j.agentId&&parsed.reviewer.independentOfAuthors===true&&!p.excludedReviewerIds.includes(j.agentId),'Exact captured independent review lineage required');}
 need(input.priorReview.inputSha256===prior.inputSha256&&input.priorReview.resultSha256===prior.resultSha256&&input.priorReview.runId===prior.runId,'Original negative review must remain immutable and explicitly referenced');
 const composition=composeTransitionChecks(priorInput,priorReport,input,report,currentCode);
 // This effective view composes the immutable prior19 approvals with the fresh
 // boundary/guard approval. Neither original reviewer report is rewritten.
 return {job,packet:{...input,requiredChecks:[...new Set([...priorInput.requiredChecks,...input.requiredChecks])]},composition};
}
