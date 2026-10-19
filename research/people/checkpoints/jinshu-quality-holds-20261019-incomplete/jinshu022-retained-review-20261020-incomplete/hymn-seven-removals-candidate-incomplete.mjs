import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems} from '../../../../../../scripts/lib/people-date-audit.mjs';
import {buildPeopleExtractionPacket} from '../../../../../../scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from '../../../../../../scripts/validate-people-extraction.mjs';

const dir = 'data/people/generated/date-workflow/jinshu/022/';
const sourceFile = 'data/jinshu/022.json';
const inputFile = `${dir}selected-receptions-candidate-incomplete.json`;
const reviewFile = `${dir}hymn-held-claims-independent-review-20261020-incomplete.md`;
const candidateFile = `${dir}hymn-seven-removals-candidate-incomplete.json`;
const reportFile = `${dir}hymn-seven-removals-diagnostics-incomplete.json`;
const sha = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const inputHash = '2319764510c4848a8d07355273497f3844fd003c687433b5cf1367eb1b7ba7ac';
const sourceHash = '813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38';
if (sha(inputFile) !== inputHash || sha(sourceFile) !== sourceHash) throw new Error('Pinned input or source changed');
const input = JSON.parse(readFileSync(inputFile));
const ids = [355,361,377,384,395,633,644];
const expected = [
  ['p054','honor',{label:{en:'shrine hymn dedicatee',zh:'祠豫章府君登歌'},action:'received',receptionType:'posthumous'},'explicit',['s0226']],
  ['p055','honor',{label:{en:'shrine hymn dedicatee',zh:'祠潁川府君登歌'},action:'received',receptionType:'posthumous'},'explicit',['s0231']],
  ['p058','honor',{title:{en:'Temple Stair Hymn honoree',zh:'祠京兆府君登歌'},action:'received',receptionType:'posthumous'},'explicit',['s0236']],
  ['p059','honor',{title:{en:'Temple Stair Hymn honoree',zh:'祠宣皇帝登歌'},action:'received',receptionType:'posthumous'},'explicit',['s0240']],
  ['p060','honor',{title:{en:'Temple Stair Hymn honoree',zh:'祠景皇帝登歌'},action:'received',receptionType:'posthumous'},'explicit',['s0247']],
  ['p090','noble-title',{title:{en:'Taizu',zh:'太祖'},action:'held',receptionType:'posthumous'},'explicit',['s0426']],
  ['p091','noble-title',{title:{en:'Emperor Jing',zh:'帝景'},action:'held',receptionType:'posthumous'},'explicit',['s0430']],
];
const removed = ids.map((id,index) => {
  const before = input.claims[id-1];
  if (JSON.stringify(before) !== JSON.stringify(expected[index])) throw new Error(`Claim ${id} does not match reviewed row`);
  return {originalClaimId:`claim-${id}`, before};
});
const candidate = structuredClone(input);
const idSet = new Set(ids);
candidate.claims = input.claims.filter((_,index) => !idSet.has(index+1));
if (candidate.claims.length !== input.claims.length - ids.length) throw new Error('Unexpected removal count');
const packet = buildDateAuditPacket('jinshu','022',{extraction:candidate});
const diagnostics = dateAuditDiagnostics(dateAuditItems(candidate));
let validation;
try {
  const result = validateCompactPeopleExtraction(candidate,buildPeopleExtractionPacket('jinshu','022'));
  validation = {status:'passed',stats:result.stats};
} catch (error) {
  if (!Array.isArray(error.errors)) throw error;
  validation = {status:'failed',errors:error.errors};
}
writeFileSync(candidateFile, JSON.stringify(candidate,null,2)+'\n',{flag:'wx'});
writeFileSync(reportFile, JSON.stringify({status:'incomplete; not an audit or publication approval',sourceFile,sourceSha256:sourceHash,inputFile,inputSha256:inputHash,reviewFile,reviewSha256:sha(reviewFile),candidateFile,candidateSha256:sha(candidateFile),candidateSemanticFingerprint:packet.extractionHash,removed,validation,dateDiagnostics:diagnostics},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({candidateFile,reportFile,removed:removed.length,validation:validation.status,validationErrors:validation.errors?.length??0,dateDiagnostics:diagnostics.length}));
