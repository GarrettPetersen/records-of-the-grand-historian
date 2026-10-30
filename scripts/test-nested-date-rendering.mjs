import assert from 'node:assert/strict';
import { renderClaimValue, renderDateValue, renderFamilyAssertionDetails, generatePersonHtml } from './generate-people-pages.mjs';

const y = (era,year) => ({era,year,precision:'year'});
const bounds = {westernBounds:{after:y('BC',207),onOrBefore:y('AD',3)},sourceDate:{text:'某年'}};
const direct = renderDateValue(bounds);
assert.match(direct,/after BC 207 and on or before AD 3/u);
assert.match(direct,/某年/u);
const nested = {dateContext:bounds};
assert.match(renderClaimValue({predicate:'event-participation',value:nested},new Map()),/after BC 207 and on or before AD 3/u);
const reason = {unresolvedReason:'Outer <condition>',dateContext:{unresolved:true,unresolvedReason:'Nested & caveat',sourceDate:{text:'某年'}}};
const details = renderClaimValue({predicate:'event-participation',value:reason},new Map());
assert.match(details,/Outer &lt;condition&gt;/u);
assert.match(details,/Nested &amp; caveat/u);
assert.match(renderFamilyAssertionDetails(nested,new Map()),/after BC 207 and on or before AD 3/u);
assert.match(renderFamilyAssertionDetails(reason,new Map()),/Outer &lt;condition&gt;/u);
assert.match(renderFamilyAssertionDetails(reason,new Map()),/Nested &amp; caveat/u);
assert.match(renderFamilyAssertionDetails({startDate:bounds,unresolvedReason:'Condition applies'},new Map()),/Condition applies/u);
const top = renderClaimValue({predicate:'attestation',value:{...bounds,unresolvedReason:'unresolved here'}},new Map());
assert.equal((top.match(/unresolved here/gu)||[]).length,1);
assert.doesNotMatch(top,/Western Bounds/u);
assert.throws(() => renderDateValue({westernBounds:{after:y('AD',3),before:y('AD',2)}}),/Invalid Western bounds/u);
const mixed = renderDateValue({westernBounds:{onOrBefore:y('AD',13)},sourceDate:{text:'outer source'},dateContext:{westernYear:y('AD',12),sourceDate:{text:'nested source'}}});
assert.match(mixed,/on or before AD 13/u);
assert.match(mixed,/AD 12/u);
assert.match(mixed,/outer source/u);
assert.match(mixed,/nested source/u);
const person = {id:'per_0123456789ABCDEFGHJK',slug:'person-test',preferredName:{en:'Person Test'},description:{en:'Official'},
  curation:{notes:[]},historicity:'historical',identificationStatus:'named',sex:null,names:[],roles:[],references:[],externalIds:{},
  familyRelationships:[],familySummaries:[],life:{birth:[],death:[],ageClaims:[],attestedActivity:[
    {predicate:'attestation',certainty:'uncertain',value:{...nested,unresolvedReason:'This is conditional'},evidence:[]}
  ]},ethnicities:[],lineages:[],occupations:[],polityAssociations:[],placeAssociations:[],organizationAssociations:[],offices:[],titlesAndHonors:[],statuses:[],education:[],credentials:[],beliefs:[],skills:[],works:[]};
const html = generatePersonHtml(person,{peopleById:new Map(),familyEdgesById:new Map(),preview:true});
assert.match(html,/after BC 207 and on or before AD 3/u);
assert.match(html,/This is conditional/u);
assert.match(html,/Uncertain/u);
console.log('nested/direct bound and unresolved reason rendering PASS');
