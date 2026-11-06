import {createHash} from 'node:crypto';
import {isDeepStrictEqual as same} from 'node:util';
import {SOURCE_EPOCH_CHECKS} from './source-review-validation.mjs';
export const FRESH_EPOCH_CHECKS=['sealed-configuration-and-runtime-binding','post-reservation-canonical-pins','conservative-eight-check-proof-reuse'];
const need=(v,m)=>{if(!v)throw Error(m)},hash=s=>createHash('sha256').update(s).digest('hex');
function replaceRegion(code,name,replacement){
 const start='// '+name+'_BEGIN',end='// '+name+'_END',lines=code.split('\n'),first=lines.findIndex(l=>l.trim()===start),last=lines.findIndex(l=>l.trim()===end);
 need(first>=0&&last>first&&lines.filter(l=>l.trim()===start).length===1&&lines.filter(l=>l.trim()===end).length===1,'Unique explicitly reviewed code patch boundary required: '+name);
 lines.splice(first,last-first+1,...(replacement?replacement.replace(/\n$/u,'').split('\n'):[]));return lines.join('\n');
}
export function normalizeEpochPatch(currentCode,originalCode){
 const start=originalCode.indexOf(' validateSourceCodeReview(report,reviewInput,'),end=originalCode.indexOf(' need(report.sourceHash===config.sourceHash',start);
 need(start>=0&&end>start&&originalCode.indexOf(' validateSourceCodeReview(report,reviewInput,',start+1)<0,'Exact original review gate required');
 let code=currentCode;for(const region of ['EPOCH_RECHECK_IMPORT','EPOCH_CONFIG_PATH','EPOCH_CANONICAL_PIN'])code=replaceRegion(code,region,'');
 return replaceRegion(code,'EPOCH_RECHECK_GATE',originalCode.slice(start,end));
}
export function composeSourceEpochReview(priorInput,priorReport,input,report,currentCode,currentConfig,originalConfig,rawProofs){
 const failed=['shared-ownership-and-fail-closed-current-pins','reviewed-code-and-clean-runtime-boundaries'];
 need(same(priorInput.requiredChecks,SOURCE_EPOCH_CHECKS)&&priorReport.verdict==='needs-revision'&&priorReport.findings.length===2&&same(priorReport.findings.map(f=>f.id).sort(),['source-bytes-not-rechecked-after-reservation','unbound-application-config'])&&priorReport.checks.length===10&&new Set(priorReport.checks.map(c=>c.id)).size===10&&SOURCE_EPOCH_CHECKS.every(id=>priorReport.checks.some(c=>c.id===id&&c.verdict===(failed.includes(id)?'needs-revision':'approve'))),'Only the exact two original boundary findings can be superseded');
 need(same(input.requiredChecks,FRESH_EPOCH_CHECKS)&&report.verdict==='approve'&&report.findings.length===0&&report.checks.length===3&&new Set(report.checks.map(c=>c.id)).size===3&&FRESH_EPOCH_CHECKS.every(id=>report.checks.some(c=>c.id===id&&c.verdict==='approve'&&c.reason?.trim().length>=20)),'All three fresh independent boundary/proof checks required');
 for(const key of ['sourceHash','extractionHash','canonicalExtractionHash','manifestSha256'])need(input[key]===priorInput[key],'Source/preparation fingerprints changed; require full new review');
 need(Buffer.isBuffer(rawProofs?.priorInputBytes)&&Buffer.isBuffer(rawProofs.priorReportBytes)&&Buffer.isBuffer(rawProofs.originalConfigBytes),'Exact raw original proof/config bytes required');
 need(hash(rawProofs.priorInputBytes)===input.priorReview.inputSha256&&hash(rawProofs.priorReportBytes)===input.priorReview.resultSha256&&hash(rawProofs.originalConfigBytes)===input.originalConfigSha256&&same(JSON.parse(rawProofs.priorInputBytes),priorInput)&&same(JSON.parse(rawProofs.priorReportBytes),priorReport)&&same(JSON.parse(rawProofs.originalConfigBytes),originalConfig),'Immutable original proof/config bytes changed');
 const originalCode=priorInput.codeFiles['source-epoch-bundle.mjs'];need(normalizeEpochPatch(currentCode,originalCode)===originalCode,'An unreviewed code region changed; require full new review');
 const restored=structuredClone(currentConfig);restored.application.reviewCase=originalConfig.application.reviewCase;need(same(restored,originalConfig)&&currentConfig.application.reviewCase==='source-epoch-code-recheck','Only the declared reviewer-case metadata may change in the original config');
 need(input.originalConfigSha256===priorInput.sealedFileSha256['D|closure-review-c72620a9.json']&&input.configFile.endsWith('/closure-review-c72620a9.json')&&input.configuration.application.runtimeHead===priorInput.runtimeBoundary.head&&same(input.configuration,currentConfig),'Exact active/original config and original reviewed runtime required');
 for(const[key,digest]of Object.entries(priorInput.sealedFileSha256))if(!['D|source-epoch-bundle.mjs','D|closure-review-c72620a9.json'].includes(key))need(input.sealedFileSha256[key]===digest,'An unchanged code/source proof seal changed: '+key);
 return {reusedChecks:priorReport.checks.filter(c=>c.verdict==='approve').map(c=>c.id),freshChecks:FRESH_EPOCH_CHECKS,originalFindingsResolved:failed,allOtherCodeByteIdentical:true,EnglishAndChronologyProofsUnchanged:true};
}
