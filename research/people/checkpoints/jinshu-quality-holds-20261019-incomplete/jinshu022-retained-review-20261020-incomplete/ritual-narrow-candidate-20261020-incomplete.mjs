import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems} from '../../../../../../scripts/lib/people-date-audit.mjs';
import {buildPeopleExtractionPacket} from '../../../../../../scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from '../../../../../../scripts/validate-people-extraction.mjs';

const dir = 'data/people/generated/date-workflow/jinshu/022/';
const source = 'data/jinshu/022.json';
const input = `${dir}selected-receptions-candidate-incomplete.json`;
const review = `${dir}held-ritual-claims-independent-review-20261020-incomplete.md`;
const output = `${dir}ritual-narrow-candidate-20261020-incomplete.json`;
const report = `${dir}ritual-narrow-candidate-diagnostics-20261020-incomplete.json`;
const sha = file => createHash('sha256').update(readFileSync(file)).digest('hex');
for (const [file, expected] of [[source,'813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38'],[input,'2319764510c4848a8d07355273497f3844fd003c687433b5cf1367eb1b7ba7ac'],[review,'7c3e362aeb6384e32f41724c728e382464d0961cabec4cfb77c60f752df0ad5a']]) {
  if (sha(file) !== expected) throw new Error(`Input changed: ${file}`);
}
const original = JSON.parse(readFileSync(input));
const changes = [];
const edits = new Map([
  [112, row => { row[2].kind = 'ritual'; delete row[2].receptionType; }],
  [307, row => { row[2].action = 'praised in the hymn as fit to be paired with Heaven'; delete row[2].otherPersonId; }],
  [308, row => { row[2].action = 'praised in the hymn as fit to be paired with Heaven'; delete row[2].otherPersonId; }],
  [348, row => { row[2].action = 'named in the heading of a shrine hymn'; row[4] = ['s0221']; }],
]);
const removed = new Set([121,305,306,332,346]);
const candidate = structuredClone(original);
candidate.claims = original.claims.flatMap((before, index) => {
  const number = index + 1;
  if (removed.has(number)) {
    changes.push({id:`claim-${number}`, before, after:null});
    return [];
  }
  if (!edits.has(number)) return [structuredClone(before)];
  const after = structuredClone(before);
  edits.get(number)(after);
  changes.push({id:`claim-${number}`,before,after});
  return [after];
});
if (changes.length !== 9) throw new Error('Unexpected changed-claim count');
const packet = buildDateAuditPacket('jinshu','022',{extraction:candidate});
const dateDiagnostics = dateAuditDiagnostics(dateAuditItems(candidate));
let validation;
try {
  const result = validateCompactPeopleExtraction(candidate,buildPeopleExtractionPacket('jinshu','022'));
  validation = {status:'passed',stats:result.stats};
} catch (error) {
  if (!Array.isArray(error.errors)) throw error;
  validation = {status:'failed',errors:error.errors};
}
writeFileSync(output, JSON.stringify(candidate,null,2)+'\n', {flag:'wx'});
writeFileSync(report, JSON.stringify({status:'incomplete; not a date audit, identity approval, or publication approval',source,sourceSha256:sha(source),input,inputSha256:sha(input),review,reviewSha256:sha(review),candidate:output,candidateSha256:sha(output),candidateSemanticFingerprint:packet.extractionHash,changes,validation,dateDiagnostics,limitations:['All date fields and holds on retained rows remain unapproved and unchanged; removed claims 121, 305 and 306 contain date contexts duplicated on retained companion event rows. Claims 307 and 308 retain invalid posthumous event kinds intentionally: only wording and cross-person links were reviewed for this candidate.','Claims 305 and 306 removal conflicts with prior review-4; reconcile in the next independent audit.','Claim 338 and identity of 342 remain held; claims 347, 349–350 and 928–929 need review.','Deletion shifts claim indexes: the change identifiers refer solely to the pinned input.','Neither existing approvals nor review results bind this candidate; final source and extraction require fresh full independent date audit.']},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({candidate:output,candidateSha256:sha(output),semanticFingerprint:packet.extractionHash,report,reportSha256:sha(report),changes:changes.length,validation:validation.status,validationErrors:validation.errors?.length??0,dateDiagnostics:dateDiagnostics.length}));
