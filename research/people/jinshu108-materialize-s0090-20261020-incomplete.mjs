// Isolated, unapproved research materialization; never writes canonical paths.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { buildPeopleExtractionPacket } from '../../scripts/build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from '../../scripts/lib/people-candidates.mjs';
import { buildCompactInput } from '../../scripts/lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from '../../scripts/validate-people-extraction.mjs';
import { mergeEditorialDecisionReview, validateAppliedEditorialDecisions, validateEditorialDecisions } from '../../scripts/lib/people-editorial-decisions.mjs';
import { documentHash } from '../../scripts/lib/people-combined-curation-review.mjs';

const hash = b => createHash('sha256').update(b).digest('hex');
function read(file, expected) {
  const bytes = fs.readFileSync(file);
  if (hash(bytes) !== expected) throw Error(`Input changed: ${file}`);
  return JSON.parse(bytes);
}
const base = 'data/people/generated/date-workflow/jinshu/108';
const ed = 'data/people/generated/editorial-review/jinshu/108-s0090-recovery-20261020-incomplete';
const source = read('data/jinshu/108.json','8c3f789a55588e130f64eac778decf43ebde6809f3ecb81ddc91b54a76d6cfbb');
const beforeSource = structuredClone(source);
const retained = read(`${base}/candidate-2.json`,'c2eeee0bea6a07b506feab07f655ec46882ace1c4f02faae84baee61a3821413');
const candidate = read(`${base}/s0090-link-candidate-v2-20261019-incomplete.json`,'c4c3ac872baea71eec5e71cc540445fb4939732f3da70ed75fef424fc2a7892b');
const proposed = read(`${ed}/proposed-candidate.json`,'ff65c8a2d675f8ad532693a02bf4ac9f9cde384b880a9e01112693aed55c5f35');
const incoming = read(`${ed}/independent-decisions-date127-20261020-incomplete.json`,'187da53312050a8af44cfdb22e721638eadedf28ccb2561d82f141ad69b075b9');
const oldEditorial = read('data/people/editorial-decisions/jinshu/108.json','bbf4eff8391fd9ef6e6c773b2f911436944c1082cda45b821437d304a41c730a');
const matcher = loadProperNounMatcher();
const oldPacket = buildPeopleExtractionPacket('jinshu','108',{chapterData:beforeSource,properNounMatcher:matcher});
const proposedNormalized = validateCompactPeopleExtraction(proposed,oldPacket,{strictAliasDispositions:true}).normalized;
validateEditorialDecisions(incoming,proposedNormalized,oldPacket);
if (!isDeepStrictEqual(candidate.translationRepairs,retained.translationRepairs) || !isDeepStrictEqual(proposed.translationRepairs.slice(0,retained.translationRepairs.length),retained.translationRepairs)) throw Error('Old repairs changed');
const unit = source.content.flatMap(b => b.sentences ?? []).find(s => s.id === 's0090');
const english = unit?.translations?.filter(t => t.lang === 'en');
if (unit?.zh !== '廆懼，首服。' || english?.length !== 1 || Object.hasOwn(english[0],'footnote')) throw Error('Unexpected source unit');
const additions = proposed.translationRepairs.slice(retained.translationRepairs.length);
if (additions.length !== 2 || incoming.decisions.length !== 2) throw Error('Unexpected proposal count');
for (const [i,row] of additions.entries()) {
  const decision = incoming.decisions[i], proposal = incoming.proposals.find(p => p.id === decision.repairId);
  if (decision.decision !== 'accept' || proposal?.unit.id !== row[0] || proposal.field !== row[1] || proposal.before !== row[2] || proposal.after !== row[3] || row[6] !== 'proposed' || english[0][row[1]] !== row[2]) throw Error('Editorial proposal mismatch');
  english[0][row[1]] = row[3];
  candidate.translationRepairs.push([row[0],row[1],row[2],row[3],decision.reason,row[5],'applied']);
}
const afterRepairs = structuredClone(source);
const note = 'The displayed Chinese names Hui (廆); a Siku-labelled Wikisource digital transcription instead names Tao (燾), consistent with the surrounding account.';
english[0].footnote = note;
const contract = {schemaVersion:1,kind:'english-footnote-additions',book:'jinshu',chapter:'108',authorAgentId:'/root/material108',beforeSourceHash:documentHash(afterRepairs),afterSourceHash:documentHash(source),additions:[{unit:'s0090',text:note}]};
const packet = buildPeopleExtractionPacket('jinshu','108',{chapterData:source,properNounMatcher:matcher});
candidate.input = buildCompactInput(packet);
const result = validateCompactPeopleExtraction(candidate,packet,{strictAliasDispositions:true});
const editorial = mergeEditorialDecisionReview(oldEditorial,incoming);
validateAppliedEditorialDecisions(editorial,result.normalized);
const outputs = {'source.json':source,'candidate.json':candidate,'editorial-decisions.json':editorial,'footnote-contract-unapproved.json':contract};
const outputDir = `${base}/materialized-s0090-20261020-incomplete`;
fs.mkdirSync(outputDir,{recursive:false});
const hashes = {};
for (const [name,value] of Object.entries(outputs)) {
  const bytes = Buffer.from(`${JSON.stringify(value,null,2)}\n`);
  fs.writeFileSync(`${outputDir}/${name}`,bytes,{flag:'wx'});
  hashes[name] = `sha256:${hash(bytes)}`;
}
console.log(JSON.stringify({status:'isolated-incomplete-not-approved-for-publication',hashes,sourceFingerprint:packet.input.chapterFingerprint,contractDocumentHash:documentHash(contract),stats:result.stats,remaining:'Independent footnote, identity and fresh complete date reviews; sealed combined receipt, publication and rendered web/ebook verification'},null,2));
