import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { inspectCombinedBefore } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-combined-curation.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url)), root = process.cwd();
const read = p => JSON.parse(fs.readFileSync(p));
const save = (file, object) => fs.writeFileSync(path.join(dir, file), JSON.stringify(object, null, 2)+'\n',{flag:'wx'});
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const sibling = '../record-and-mention-candidate-20261107/';
const evidence = read(path.resolve(dir,sibling,'content-review-evidence.json'));
const receipt = read(path.resolve(dir,sibling,'preparation-receipt.json'));
const retrieved = read(path.resolve(dir,sibling,'current-extraction-packet.json'));
const {book, chapter, sourceHash, beforeExtractionHash, proposedExtractionHash} = evidence;
for (const [filename, sha] of Object.entries(evidence.sealedFiles)) assert.equal(hash(filename),sha);
const before = inspectCombinedBefore({root,book,chapter});
assert.equal(before.sourceHash,sourceHash); assert.equal(before.extractionHash,beforeExtractionHash);
const beforeFile = 'before-extraction.json', candidateFile = sibling+'candidate-extraction.json';
fs.copyFileSync(path.resolve(root,'data/people/extractions/jinshu/127.json'),path.join(dir,beforeFile),fs.constants.COPYFILE_EXCL);
const current = read(path.join(dir,beforeFile)), candidate = read(path.resolve(dir,candidateFile));
assert.equal(hash(path.resolve(dir,candidateFile)),receipt.candidateSha256);
const changes = evidence.wordingProposals.map((v,i)=>({type:i===0?'alias-wording':'assessment-wording',
  pointer:v.jsonPointer,person:v.personId,unit:v.unit,before:v.before,after:v.after,witness:'非復吳下阿蒙',reason:v.sourceReason}));
changes.push({type:'add-mention',person:'p001',unit:'s0010',kind:'personal-name',language:'zh',exact:'德',
  occurrence:0,witness:'德兄垂甚壯之',reason:evidence.mentionProposal.reason});
function unitSurfaces(doc, id) {
  return doc.surfaces.filter(s=>s[4].some(([u])=>u===id)).map(s=>[...s.slice(0,4),s[4].filter(([u])=>u===id)]);
}
const units = retrieved.units.map(({id,zh,en,literal,blockIndex})=>({id,zh,en,literal,blockIndex}));
assert.equal(units.length,278);
assert.equal(new Set(units.map(u=>u.id)).size,278);
assert.ok(units.every(u=>u.zh && u.en && u.literal));
const authorId='codex-thread:01a18e17-07b3-7f13-8e34-cb207908be33';
save('record-review.input.json',{kind:'chapter-record-corrections-v1',book,chapter,sourceHash,
  extractionHash:beforeExtractionHash,owner:'jinshu-completion-127-source-quality',generationId:'a6dc476b-5e0c-4284-b7dc-e61524ceb7c9',
  authorId,excludedReviewerIds:[authorId,'dddb08ed-6a6f-4878-872a-436e19e2882a','codex-thread:01a1b878-1a90-72d0-a4db-5cebfcd74ce4'],
  before,beforeFile,candidateFile,candidateHash:proposedExtractionHash,candidateByteHash:'sha256:'+receipt.candidateSha256,
  changes,sourceUnits:evidence.sourceUnits,p001Names:evidence.p001Names,person9:current.people[8],assessment:current.claims[88],
  beforeSurfaces:unitSurfaces(current,'s0010'),afterSurfaces:unitSurfaces(candidate,'s0010'),
  sealedFileSha256:{...evidence.sealedFiles,[path.join(dir,beforeFile)]:before.extractionByteHash.slice(7),
    [path.resolve(dir,candidateFile)]:receipt.candidateSha256}});
const common = {kind:'bounded-source-English-review',book,chapter,sourceHash,extractionHash:beforeExtractionHash,
  sourceByteHash:before.sourceByteHash,sourceTitle:retrieved.source.title,
  assignment:'Review every listed Chinese unit against both English fields. Check proposition coverage, names, kinship, attribution, events and repeated uses. Return assessed IDs and each definite defect as a complete before/after field replacement with source reason. Preserve gaps explicitly. This part grants no date, identity or chapter approval.'};
const files = [];
// Keep the remaining 16 KiB of the 64 KiB attachment limit available for instructions and evidence.
let part = [];
function flush() {
  const file = 'English-part-'+String(files.length+1).padStart(2,'0')+'.json';
  save(file,{...common,units:part});
  assert.ok(fs.statSync(path.join(dir,file)).size<=49152);
  files.push({file,sha256:hash(path.join(dir,file)),units:part.map(u=>u.id)});part=[];
}
for (const unit of units) {
  const bytes = Buffer.byteLength(JSON.stringify({...common,units:[...part,unit]},null,2)+'\n');
  if (part.length && bytes>49152) flush();
  part.push(unit);
}
if (part.length) flush();
assert.deepEqual(files.flatMap(f=>f.units),units.map(u=>u.id));
save('English-parts.json',{status:'prepared-unreviewed',sourceHash,sourceByteHash:before.sourceByteHash,
  count:units.length,fields:['en','literal'],reviewedParts:0,files});
console.log(JSON.stringify({recordChanges:changes.length,s0010Before:unitSurfaces(current,'s0010').length,
  s0010After:unitSurfaces(candidate,'s0010').length,sourceUnits:units.length,parts:files.map(f=>f.units.length)}));
