import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems} from '../../../../../../scripts/lib/people-date-audit.mjs';
import {buildPeopleExtractionPacket} from '../../../../../../scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from '../../../../../../scripts/validate-people-extraction.mjs';

const dir = 'data/people/generated/date-workflow/jinshu/022/';
const pins = new Map([
  ['data/jinshu/022.json','813d92343fcc37d0cb43e961bf88ab9b4da8fceec3da3bbb7709b185a763ec38'],
  [dir+'selected-receptions-candidate-incomplete.json','2319764510c4848a8d07355273497f3844fd003c687433b5cf1367eb1b7ba7ac'],
  [dir+'ritual-narrow-candidate-20261020-incomplete.json','b0acecb4a5e109bd6248ec54ad1222c2b81dcbb314df3e00a91aacdb2c3797e6'],
  [dir+'ritual-narrow-candidate-diagnostics-20261020-incomplete.json','4980374f37f97f300ae42f49c697368099ae339dfb1fc7461c19dfc62b7be75e'],
  [dir+'ritual-narrow-independent-verification-20261020-incomplete.md','056cfe9a333a17f4b4d99db2ffa8f9cf070911af86da2d3303bffccc4b61daa1'],
  [dir+'hymn-seven-removals-candidate-incomplete.json','166d012fdff423c2fc5786cdad2767d4684868e4c2d9ac0973c6a48cd1a95977'],
  [dir+'hymn-seven-removals-diagnostics-incomplete.json','db179ef3828b995e38b1a946050d4ad1dbc38c352c8afde1bd697911b5237c93'],
  [dir+'hymn-seven-independent-verification-20261020-incomplete.md','1b6f1d6a9228f0f56c7edd3929477ba2212440daa5529f2304ae1b3af59dd4ee'],
]);
const sha = file => createHash('sha256').update(readFileSync(file)).digest('hex');
for (const [file, expected] of pins) if (sha(file) !== expected) throw new Error(`Input changed: ${file}`);
const read = file => JSON.parse(readFileSync(file));
const base = read(dir+'selected-receptions-candidate-incomplete.json');
const ritual = read(dir+'ritual-narrow-candidate-diagnostics-20261020-incomplete.json').changes.map(c => ({...c, lane:'ritual'}));
const hymn = read(dir+'hymn-seven-removals-diagnostics-incomplete.json').removed.map(c => ({id:c.originalClaimId,before:c.before,after:null,lane:'hymn'}));
if (ritual.length !== 9 || hymn.length !== 7) throw new Error('Unexpected changes count');
const findUnique = change => {
  const matches = base.claims.flatMap((row,i) => isDeepStrictEqual(row,change.before) ? [i] : []);
  if (matches.length !== 1) throw new Error(`Non-unique or missing full-row match: ${change.id}`);
  if (`claim-${matches[0]+1}` !== change.id) throw new Error(`Pinned claim identifier mismatch: ${change.id}`);
  return matches[0];
};
function apply(changes) {
  const targets = new Map();
  for (const change of changes) {
    const index = findUnique(change);
    if (targets.has(index)) throw new Error(`Overlapping edits to ${change.id}`);
    targets.set(index,change);
  }
  const result = structuredClone(base);
  result.claims = base.claims.flatMap((row,index) => {
    const change = targets.get(index);
    return !change ? [structuredClone(row)] : change.after === null ? [] : [structuredClone(change.after)];
  });
  return result;
}
for (const [changes, file] of [[ritual,dir+'ritual-narrow-candidate-20261020-incomplete.json'],[hymn,dir+'hymn-seven-removals-candidate-incomplete.json']]) {
  if (!isDeepStrictEqual(apply(changes),read(file))) throw new Error(`Reconstructed candidate mismatch: ${file}`);
}
const changes = [...ritual,...hymn];
const temporalKeys = new Set(['dateContext','sourceDate','westernYear','westernInterval','westernBounds','undatedSourceAttestation','unresolved','unresolvedReason']);
function temporalFields(value, path = '', found = {}) {
  if (value && typeof value === 'object') for (const [key,child] of Object.entries(value)) {
    const next = `${path}/${key}`;
    if (temporalKeys.has(key)) found[next] = child;
    else temporalFields(child,next,found);
  }
  return found;
}
for (const change of changes) if (change.after !== null && !isDeepStrictEqual(temporalFields(change.before),temporalFields(change.after))) throw new Error(`Temporal field changed: ${change.id}`);
const candidate = apply(changes);
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
const output = dir+'cumulative-ritual-hymn-candidate-20261020-incomplete.json';
const report = dir+'cumulative-ritual-hymn-diagnostics-20261020-incomplete.json';
writeFileSync(output,JSON.stringify(candidate,null,2)+'\n',{flag:'wx'});
writeFileSync(report,JSON.stringify({status:'incomplete; not a date, identity, editorial, or publication approval',inputs:Object.fromEntries(pins),candidate:output,candidateSha256:sha(output),candidateSemanticFingerprint:packet.extractionHash,changes,validation,dateDiagnostics,limitations:['Both inputs reconstruct exactly from full original rows; edits overlap nowhere. Claim IDs refer to the pinned base and shift after removals.','Surviving temporal fields and holds are unchanged and unapproved. Deleted honor claims 121, 305 and 306 contain date contexts duplicated on retained event claims; no date on the latter is approved.','Claims 307 and 308 retain posthumous event kinds and the AD 266 date pending a fresh audit; claims 305–306 removal conflicts with review-4 and requires explicit reconciliation.','Claims 338, 342, 347, 349–350, 928–929, p046 false-person and translation matters remain open; hymn companion claims and identity/family inferences are not verified by this reconciliation.','Current local validator and diagnostics are not a complete gate; reseal and require fresh independent audit, identity, editorial, chapter-link and ebook checks before publication.']},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({output,outputSha256:sha(output),semanticFingerprint:packet.extractionHash,report,reportSha256:sha(report),changes:changes.length,validation:validation.status,validationErrors:validation.errors?.length??0,dateDiagnostics:dateDiagnostics.length}));
