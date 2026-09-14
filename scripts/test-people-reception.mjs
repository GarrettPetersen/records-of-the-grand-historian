import assert from 'node:assert/strict';
import test from 'node:test';
import { personClaimReception, personReceptionErrors } from './lib/people-reception.mjs';
import { dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { personLifeSummary, representativePersonYear } from './lib/people-presentation.mjs';
import { personDetailClaimSections } from './generate-people-pages.mjs';
import { validateClaimVocabulary } from './validate-people-extraction.mjs';

const year = value => ({ era: 'AD', year: value, precision: 'year' });
const reception = {
  id: 'c1', predicate: 'event-participation',
  value: { kind: 'posthumous-commemoration', role: 'honoree', dateContext: {
    sourceDate: { text: 'dated later commemoration' }, westernYear: year(320),
  } }, evidence: ['s1'],
};

test('only explicit reception semantics classify a claim', () => {
  assert.equal(personClaimReception(reception), 'posthumous');
  assert.equal(personClaimReception({ value: { kind: 'retrospective-reference' } }), 'retrospective');
  assert.equal(personClaimReception({ value: { receptionType: 'posthumous' } }), 'posthumous');
  assert.equal(personClaimReception({ value: { action: 'posthumous-commemoration' } }), 'posthumous');
  assert.equal(personClaimReception({ value: { westernYear: year(1200), note: 'possibly posthumous' } }), null);
  assert.equal(personClaimReception({ predicate: 'name', value: { kind: 'posthumous-name' } }), null);
});

test('validation rejects reception as living attestation and contradictory classifications', () => {
  assert.deepEqual(personReceptionErrors(reception), []);
  assert.match(personReceptionErrors({ ...reception, predicate: 'attestation' }).join(), /not life events/);
  assert.match(personReceptionErrors({ value: { receptionType: 'alive' } }).join(), /must be/);
  assert.match(personReceptionErrors({ value: { kind: 'retrospective-reference', receptionType: 'posthumous' } }).join(), /Conflicting/);
  const errors = [];
  validateClaimVocabulary({ ...reception, predicate: 'attestation' }, {}, errors);
  assert.ok(errors.some(error => error.includes('not life events')));
  assert.ok(dateAuditDiagnostics({ items: [{ ...reception, predicate: 'attestation' }] })
    .some(item => item.problem.includes('not life events')));
});

test('undated reception is still included in the independent date audit', () => {
  const extraction = { schemaVersion: 2, people: [['p001', {}, 'historical', '', {}]],
    claims: [['p001', 'event-participation', { kind: 'retrospective-reference', role: 'quoted author' }, 'explicit', ['s1']]] };
  assert.equal(dateAuditItems(extraction).items[0].predicate, 'event-participation');
});

test('later reception retains its evidence without extending life, activity or search period', () => {
  const person = { life: { birth: [], death: [{ value: { westernYear: year(220) } }], ageClaims: [],
    attestedActivity: [{ value: { westernYear: year(200) } }] }, events: [reception],
    titlesAndHonors: [{ id: 'c2', predicate: 'honor', value: { receptionType: 'posthumous', title: 'honor' } }] };
  const baseline = { ...person, events: [], titlesAndHonors: [] };
  assert.equal(personLifeSummary(person), personLifeSummary(baseline));
  assert.deepEqual(representativePersonYear(person), representativePersonYear(baseline));
  const sections = new Map(personDetailClaimSections(person));
  assert.deepEqual(sections.get('Later references and commemoration'), [person.titlesAndHonors[0], reception]);
  assert.deepEqual(sections.get('Events and relationships'), []);
  assert.deepEqual(sections.get('Career and standing'), []);
  assert.equal(sections.get('Later references and commemoration')[1].evidence[0], 's1');
});
