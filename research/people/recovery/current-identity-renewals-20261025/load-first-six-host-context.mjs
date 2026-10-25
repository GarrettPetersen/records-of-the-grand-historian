import fs from 'node:fs';
import {createHash} from 'node:crypto';
const expected='fcee8af8ed846c3f5063243cee9b4b831558242e519fdd50db77c64b2c6c953d';
export function loadFirstSixHostContext() {
  const bytes=fs.readFileSync(new URL('./first-six-closed-host-context.json',import.meta.url));
  if(createHash('sha256').update(bytes).digest('hex')!==expected)throw Error('First-six current source context drift');
  const context=JSON.parse(bytes);
  if(context.canonicalRevision!=='1b9c1e4262fcd1e5eef069b867e96f4e9d90be59')throw Error('Unexpected context epoch');
  if(Object.keys(context.people).length!==6||context.currentPriorDocuments.length!==0||context.currentExplicitIdentityClaims.length!==0)throw Error('First-six closure changed; obtain new reviewable context');
  return {corpus:{localPeople:new Map(Object.entries(context.people))},summaries:context.candidateSummaries,resolutions:context.currentPriorDocuments,closureProof:context.closureProof};
}
