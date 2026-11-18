import test from 'node:test';
import assert from 'node:assert/strict';
import { isNameOnlyClaimCorrection, nameCorrectionLinkErrors, supersededByLaterNameCorrection, buildNameCorrectionRevision } from '../scripts/lib/people-name-claim-correction.mjs';
import { makeFixture } from './fixtures/jinshu129-name-correction.mjs';

const scope = { book: 'jinshu', chapter: '129' };
const withRevision = (review, revision) => ({ ...structuredClone(review), claimRevisions: [structuredClone(revision)] });
const presentIn = claims => claim => claims.some(c => JSON.stringify([c.subject, c.predicate, c.value, c.certainty]) === JSON.stringify([claim.subject, claim.predicate, claim.value, claim.certainty]));

test('template: exact ordinary row for the review that accepted r0051', () => {
  const f = makeFixture();
  const row = buildNameCorrectionRevision({ ...scope, historicalReviews: f.beforeEditorial.reviews, review: f.nameReview,
    currentClaims: f.expanded.claims, claimId: 'jinshu:129:c0396', englishRepairId: 'jinshu:129:r0051' });
  assert.deepEqual(row, f.g25NameRevision);
  assert.deepEqual(nameCorrectionLinkErrors(withRevision(f.nameReview, row), row, scope), []);
  assert.throws(() => buildNameCorrectionRevision({ ...scope, historicalReviews: f.beforeEditorial.reviews, review: f.literalReview,
    currentClaims: f.expanded.claims, claimId: 'jinshu:129:c0396', englishRepairId: 'jinshu:129:r0050' }), /not exactly this name substitution/);
  assert.throws(() => buildNameCorrectionRevision({ ...scope, historicalReviews: f.beforeEditorial.reviews, review: f.nameReview,
    currentClaims: f.accepted.claims, claimId: 'jinshu:129:c0396', englishRepairId: 'jinshu:129:r0051' }), /missing or ambiguous/);
});

test('link contract rejects every non-name, unapproved or unwitnessed change', () => {
  const f = makeFixture(), base = f.g25NameRevision;
  const cases = {
    'zh': r => { r.after.value.zh = '乞伏魋尼'; }, 'kind': r => { r.after.value.kind = 'given'; }, 'subject': r => { r.after.subject = 'jinshu:129:p097'; },
    'claim id': r => { r.after.id = 'jinshu:129:c0397'; }, 'certainty': r => { r.after.certainty = 'strongly-inferred'; },
    'evidence': r => { r.after.evidence = ['jinshu:129:s0181']; }, 'extra value field': r => { r.after.value.westernYear = 420; },
    'Han in English': r => { r.after.value.en = 'Qifu 魋尼寅'; }, 'relationship predicate': r => { r.before.predicate = r.after.predicate = 'family-relationship'; },
    'other English reading': r => { r.after.value.en = 'Qifu Tuini Yin'; }, 'short reason': r => { r.reason = 'ok'; },
    'other repair': r => { r.repairId = 'jinshu:129:r0050'; }, 'unknown repair': r => { r.repairId = 'jinshu:129:r0099'; },
    'witness without zh': r => { r.sourceWitness.excerpt = '乞伏'; }, 'unbounded witness': r => { r.sourceWitness.excerpt = '乞伏魋尼寅' + '之'.repeat(28); },
    'other witness unit': r => { r.sourceWitness.citation = 's0181'; }, 'extra field': r => { r.approvedBy = 'host'; },
  };
  for (const [label, edit] of Object.entries(cases)) {
    const r = structuredClone(base); edit(r);
    assert.notDeepEqual(nameCorrectionLinkErrors(withRevision(f.nameReview, r), r, scope), [], label);
  }
  const rejected = withRevision(f.nameReview, base); rejected.decisions[0].decision = 'reject';
  assert.notDeepEqual(nameCorrectionLinkErrors(rejected, base, scope), [], 'rejected English repair');
  const twice = withRevision(f.nameReview, base);
  for (const key of ['before', 'after']) twice.proposals[0][key] += ' Qifu Tuiniiyin.';
  assert.notDeepEqual(nameCorrectionLinkErrors(twice, base, scope), [], 'English reading occurs twice');
  const inWord = withRevision(f.nameReview, base);
  for (const key of ['before', 'after']) inWord.proposals[0][key] = inWord.proposals[0][key].replace(' Qifu', ' XQifu');
  assert.notDeepEqual(nameCorrectionLinkErrors(inWord, base, scope), [], 'English reading inside a longer word');
  const offUnit = withRevision(f.nameReview, base); offUnit.proposals[0].unit = { id: 's0181' };
  const offRow = { ...structuredClone(base), sourceWitness: { ...base.sourceWitness, citation: 's0181' } };
  assert.notDeepEqual(nameCorrectionLinkErrors(offUnit, offRow, scope), [], 'English repair on another unit');
  assert.equal(isNameOnlyClaimCorrection(base.before, base.after), true);
  for (const en of ['Qifu 魋尼寅', ' Qifu Tuiniyin', '', 'Qifu Tuiniiyin']) {
    assert.equal(isNameOnlyClaimCorrection(base.before, { ...base.after, value: { ...base.after.value, en } }), false, JSON.stringify(en));
  }
});

test('chain rule: exactly one later reviewed name correction ending in a present fact', () => {
  const f = makeFixture(), old = f.r0022Revision.after, present = presentIn(f.expanded.claims);
  const later = [f.literalReview, withRevision(f.nameReview, f.g25NameRevision)];
  const opts = { ...scope, present, applied: present };
  assert.equal(supersededByLaterNameCorrection(old, later, opts), true);
  assert.equal(supersededByLaterNameCorrection(old, [f.literalReview, f.nameReview], opts), false, 'no reviewed revision');
  assert.equal(supersededByLaterNameCorrection(old, [...later, withRevision(f.nameReview, f.g25NameRevision)], opts), false, 'ambiguous');
  assert.equal(supersededByLaterNameCorrection(old, later, { ...opts, applied: () => true }), false, 'old fact still applied');
  assert.equal(supersededByLaterNameCorrection(old, later, { ...opts, present: () => false }), false, 'result not present');
  const nonName = structuredClone(f.g25NameRevision); nonName.after.certainty = 'strongly-inferred';
  assert.equal(supersededByLaterNameCorrection(old, [withRevision(f.nameReview, nonName)], { ...opts, present: () => true }), false, 'non-name');
  const loop = withRevision(f.nameReview, { ...structuredClone(f.g25NameRevision), before: f.g25NameRevision.after, after: old });
  assert.equal(supersededByLaterNameCorrection(old, [later[1], loop], { ...opts, present: () => false, applied: () => false }), false, 'cycle');
});
