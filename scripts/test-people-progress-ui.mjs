import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

class Element {
  constructor() { this.children = []; this.style = {}; this.dataset = {}; this.textContent = ''; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this[name] = value; }
}

const elements = new Map();
const document = {
  addEventListener() {},
  createElement() { return new Element(); },
  getElementById(id) {
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  },
};
const script = fs.readFileSync(new URL('../public/progress.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../public/progress.html', import.meta.url), 'utf8');
const context = vm.createContext({ document, console, setTimeout });
vm.runInContext(`${script}\nthis.testApi = { renderOverview, createBookSection };`, context);
const summary = {
  currentPromptVersion: 7, sourceChapters: 2, extractedChapters: 1, currentChapters: 1,
  preliminaryChapters: 1, dateReviewChapters: 0, dateAuditedChapters: 1,
  editorialReviewChapters: 0, identityReviewChapters: 0, identityReviewedChapters: 1,
  identityPendingChapters: 0, identityPendingCases: 0, reviewedAmbiguousCases: 1,
  reviewedAmbiguousPeople: 1, zeroPersonExtractions: 0, rereviewChapters: 0, missingChapters: 1,
  peopleRecords: 1, factClaims: 1, familyRelationships: 0, attestations: 0,
  appliedTranslationRepairs: 0, pendingTranslationRepairs: 0,
};
context.testApi.renderOverview(summary);
const metrics = elements.get('corpus-metrics').children;
assert.equal(metrics[0].children[0].textContent, 'Preliminary checks passed');
assert.equal(metrics[0].children[1].textContent, '1');
assert.match(metrics[0].children[2].textContent, /not a completion or publication count/);
assert.match(elements.get('publication-note').textContent, /do not establish whole-chapter editorial review/);
assert.equal(elements.get('coverage-percent').textContent, '50.0%');
assert.match(elements.get('publication-note').textContent, /1 reviewed source identifications retain cross-chapter uncertainty/);
const incomplete = { ...summary }; delete incomplete.identityPendingCases;
assert.throws(() => context.testApi.renderOverview(incomplete), /invalid identityPendingCases/);
const book = context.testApi.createBookSection('fixture', {
  name: 'Fixture', chapters: [{ chapter: '001', title: 'Test', peopleGlossary: {
    glossaryState: 'current', state: 'current', dateAudit: { status: 'audited' },
    peopleRecords: 1, factClaims: 1, familyRelationships: 0, attestations: 0,
    appliedTranslationRepairs: 0, promptVersion: 7, identityReview: { targetCases: 1, approvedCases: 1, heldCases: 0, reviewedAmbiguousCases: 1 },
  } }],
});
assert.match(book.children[1].children[0].children[1].textContent, /preliminary checks passed/);
assert.match(book.children[2].children[0].title, /completion unverified/);
assert.match(book.children[2].children[0].title, /Attestations:/);
assert.doesNotMatch(book.children[2].children[0].title, /Dated attestations/);
assert.equal(metrics[4].children[0].textContent, 'No accepted extraction');
assert.match(metrics[6].children[2].textContent, /attestations recorded/);
assert.doesNotMatch(metrics[6].children[2].textContent, /dated attestations/);
assert.match(html, /Chapters passing preliminary checks/);
assert.match(html, /Preliminary checks passed; completion unverified/);
assert.doesNotMatch(html, /Glossary complete/);
assert.match(html, /Proposed repairs pending/);
assert.match(html, /No accepted extraction/);
console.log('people progress UI tests passed');
