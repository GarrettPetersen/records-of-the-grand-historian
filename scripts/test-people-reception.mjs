import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import { personClaimReception, personReceptionErrors } from './lib/people-reception.mjs';
import { dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { personLifeSummary, representativePersonYear } from './lib/people-presentation.mjs';
import { personDetailClaimSections } from './generate-people-pages.mjs';
import { validateClaimVocabulary } from './validate-people-extraction.mjs';
import { deathOnlyChronology } from './lib/people-date-values.mjs';

const year = value => ({ era: 'AD', year: value, precision: 'year' });
const reception = {
  id: 'c1', predicate: 'event-participation',
  value: { kind: 'retrospective-reference', role: 'honoree', dateContext: {
    sourceDate: { text: 'dated later commemoration' }, westernYear: year(320),
  } }, evidence: ['s1'],
};

test('only explicit reception semantics classify a claim', () => {
  assert.equal(personClaimReception(reception), 'retrospective');
  assert.equal(personClaimReception({ value: { kind: 'retrospective-reference' } }), 'retrospective');
  assert.equal(personClaimReception({ value: { receptionType: 'posthumous' } }), 'retrospective');
  assert.equal(personClaimReception({ value: { action: 'posthumous-commemoration' } }), 'retrospective');
  assert.equal(personClaimReception({ value: { westernYear: year(1200), note: 'possibly posthumous' } }), null);
  assert.equal(personClaimReception({ predicate: 'name', value: { kind: 'posthumous-name' } }), null);
});

test('validation rejects reception as living attestation and removed categories', () => {
  assert.deepEqual(personReceptionErrors(reception), []);
  assert.match(personReceptionErrors({ ...reception, predicate: 'attestation' }).join(), /not life events/);
  for (const value of ['posthumous', 'alive', null, {}, []]) {
    assert.match(personReceptionErrors({ value: { receptionType: value } }).join(), /must be retrospective/);
  }
  for (const kind of ['posthumous-reference', 'posthumous-commemoration']) {
    assert.match(personReceptionErrors({ predicate: 'event-participation', value: { kind } }).join(), /Removed posthumous/);
    assert.match(personReceptionErrors({ predicate: 'honor', value: { kind } }).join(), /Removed posthumous/);
    assert.deepEqual(personReceptionErrors({ predicate: 'honor', value: { action: kind } }), []);
  }
  assert.deepEqual(personReceptionErrors({ predicate: 'name', value: { kind: 'posthumous-name' } }), []);
  const errors = [];
  validateClaimVocabulary({ ...reception, predicate: 'attestation' }, {}, errors);
  assert.ok(errors.some(error => error.includes('not life events')));
  assert.ok(dateAuditDiagnostics({ items: [{ ...reception, predicate: 'attestation' }] })
    .some(item => item.problem.includes('not life events')));
});

test('invalid legacy reception cannot turn a later date into living chronology during recovery', () => {
  const death = { predicate: 'death', value: { westernYear: year(220) } };
  for (const value of [{ kind: 'posthumous-reference' }, { kind: 'posthumous-commemoration' },
    { receptionType: 'posthumous' }, { action: 'posthumous-reference' }]) {
    const later = { predicate: 'event-participation', value: { ...value, westernYear: year(320) } };
    assert.equal(deathOnlyChronology([death, later]), true);
  }
});

test('both extraction schemas constrain the category but retain descriptive values and chronology', () => {
  const expanded = JSON.parse(readFileSync(new URL('../data/people/schema/extraction.schema.json', import.meta.url)));
  const compact = JSON.parse(readFileSync(new URL('../data/people/schema/compact-extraction.schema.json', import.meta.url)));
  const ajv = new Ajv2020({ strict: false });
  for (const schema of [expanded.$defs.claim.properties.value, compact.$defs.claim.prefixItems[2]]) {
    const validate = ajv.compile(schema);
    for (const value of [{}, { receptionType: 'retrospective', action: 'posthumous-name', note: 'posthumous' },
      { kind: 'posthumous-name', action: 'posthumous-reference' }]) assert.equal(validate(value), true);
    for (const value of ['posthumous', 'alive', null, {}, []]) assert.equal(validate({ receptionType: value }), false);
  }
  assert.ok(expanded.$defs.externalPrimaryChronology);
});

test('undated reception is still included in the independent date audit', () => {
  const extraction = { schemaVersion: 2, people: [['p001', {}, 'historical', '', {}]],
    claims: [['p001', 'event-participation', { kind: 'retrospective-reference', role: 'quoted author' }, 'explicit', ['s1']]] };
  assert.equal(dateAuditItems(extraction).items[0].predicate, 'event-participation');
  extraction.claims[0][2].kind = 'posthumous-reference';
  const packet = dateAuditItems(extraction);
  assert.equal(packet.items[0].predicate, 'event-participation');
  assert.ok(dateAuditDiagnostics(packet).some(item => item.problem.includes('Removed posthumous')));
});

test('later reception retains its evidence without extending life, activity or search period', () => {
  const person = { life: { birth: [], death: [{ value: { westernYear: year(220) } }], ageClaims: [],
    attestedActivity: [{ value: { westernYear: year(200) } }] }, events: [reception],
    titlesAndHonors: [{ id: 'c2', predicate: 'honor', value: { receptionType: 'retrospective', title: 'honor' } }] };
  const baseline = { ...person, events: [], titlesAndHonors: [] };
  assert.equal(personLifeSummary(person), personLifeSummary(baseline));
  assert.deepEqual(representativePersonYear(person), representativePersonYear(baseline));
  const sections = new Map(personDetailClaimSections(person));
  assert.deepEqual(sections.get('Later references and commemoration'), [person.titlesAndHonors[0], reception]);
  assert.deepEqual(sections.get('Events and relationships'), []);
  assert.deepEqual(sections.get('Career and standing'), []);
  assert.equal(sections.get('Later references and commemoration')[1].evidence[0], 's1');
});
