#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {peopleExtractionFiles} from './lib/people-corpus.mjs';
import {getPeopleSchemaValidator} from './lib/people-schema.mjs';
import {PEOPLE_DIR,readJson} from './lib/people-content.mjs';
import {validateClaimVocabulary} from './validate-people-extraction.mjs';

export function extractionVocabularyErrors(extraction,context) {
  const schemaIds={1:'https://24histories.com/schema/people/extraction-v1.json',2:'https://24histories.com/schema/people/compact-extraction-v2.json'};
  const id=schemaIds[extraction.schemaVersion];
  if(!id)return [`Unknown extraction schemaVersion ${JSON.stringify(extraction.schemaVersion)}`];
  const validate=getPeopleSchemaValidator().getSchema(id);
  if(!validate)throw new Error(`Missing schema ${id}`);
  // Structural failures also fail: an invalid shape must not hide label rows.
  const errors=[];
  if(!validate(extraction))errors.push(...validate.errors.map(e=>`${e.instancePath||'/'} ${e.message}${e.keyword==='enum'?` (approved: ${JSON.stringify(e.params.allowedValues)})`:''}`));
  if(errors.length)return errors;
  const compact=extraction.schemaVersion===2;
  const claims=compact?extraction.claims.map((row,index)=>({id:`claim-${index+1}`,subject:row[0],predicate:row[1],value:row[2],certainty:row[3],evidence:row[4]})):extraction.claims;
  if(compact)for(const person of extraction.people)for(const [index,role] of person[6].entries())claims.push({id:`${person[0]}/role-${index+1}`,subject:person[0],predicate:'role',value:{roleId:role[0]},evidence:role[2]});
  for(const claim of claims){
    const found=[];validateClaimVocabulary(claim,{context},found);
    // This gate concerns labels/controlled IDs, not a second date-audit gate.
    errors.push(...found.filter(error=>/unknown |not supplied in its packet|receptionType|reception kind|reception event kind|retrospective-reference|Conflicting later-reception/u.test(error)));
  }
  return errors;
}

if(process.argv[1]&&fs.realpathSync(process.argv[1])===fileURLToPath(import.meta.url)) {
  const context={roles:readJson(path.join(PEOPLE_DIR,'curation','role-vocabulary.json')).roles,polities:readJson(path.join(PEOPLE_DIR,'chronology','polities.json')).polities,reigns:readJson(path.join(PEOPLE_DIR,'chronology','reigns.json')).reigns};
  const files=peopleExtractionFiles();
  if(!files.length)throw new Error('No canonical people extractions found; refusing an empty vocabulary check');
  let failures=0;
  for(const file of files)for(const error of extractionVocabularyErrors(readJson(file),context)){failures++;console.error(`${path.relative(process.cwd(),file)}: ${error}`);}
  console.log(`People vocabulary: ${files.length} canonical extractions; ${failures} errors`);
  if(failures)process.exitCode=1;
}
