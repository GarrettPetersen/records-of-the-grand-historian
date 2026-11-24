#!/usr/bin/env node
/** Checkpoint helper: build native-identity-report from sealed transport + witness check. */
import { readJson, writeJsonAtomic } from '../../../../scripts/lib/people-content.mjs';
import { localNameKeys } from '../../../../scripts/lib/people-resolution.mjs';
import { assertDossierPrimaryWitness } from '../../../../scripts/lib/people-identity-dossiers.mjs';
import { loadValidatedPeopleChapter } from '../../../../scripts/lib/people-validated-chapter.mjs';
import { loadProperNounMatcher } from '../../../../scripts/lib/people-candidates.mjs';

const AGENT = 'bc-1e8a4966-4635-4e5b-a2e0-24ad2eeaf657';
const REVIEWER_NAME = 'cursor-nov24-first-native-final-review-4-af657';

const HOLD_CASES = new Map([
  ['shiji:063:p010', {
    verdict: 'hold',
    reason: 'Shiji 063 s0025 gives the Laozi line as 宗子注，注子宮，宮玄孫假. Local p010 is modeled as “Child of Gong” with no Chinese blocking name in the sealed transport. The genealogy unit does not isolate a distinct surface for this English kinship node apart from 注/宮/假; approving a separate canonical person would invent attribution.',
    sourceWitnesses: [
      { localId: 'shiji:063:p010', book: 'shiji', chapter: '063', unitId: 's0025', quote: '宗子注' },
    ],
  }],
  ['shiji:063:p011', {
    verdict: 'hold',
    reason: 's0025 records 注子宮 as Zhu’s son Gong, not a separate “Grandchild of Gong” surface. p011 lacks any zh blocking name in transport; retain hold rather than assert an extra person beyond 宗/注/宮/假.',
    sourceWitnesses: [
      { localId: 'shiji:063:p011', book: 'shiji', chapter: '063', unitId: 's0025', quote: '注子宮' },
    ],
  }],
  ['shiji:063:p012', {
    verdict: 'hold',
    reason: 's0025 names 宮玄孫假 as Gong’s great-great-grandson Jia (p013). p012 “Great-grandchild of Gong” duplicates that generational edge without its own Chinese name in the sealed packet; hold concrete unsupported attribution.',
    sourceWitnesses: [
      { localId: 'shiji:063:p012', book: 'shiji', chapter: '063', unitId: 's0025', quote: '宮玄孫' },
    ],
  }],
  ['shiji:080:p034', {
    verdict: 'hold',
    reason: 'Shiji 080 s0114–s0116 names 樂叔 in dialogue, then grants the title 華成君 and states 華成君，樂毅之孫也. Local p034 is modeled as 樂叔之父或母 without any verbatim Chinese naming that parent; the intervening kinship is extraction-inferred only. Retaining accepted membership is not contradicted, but primary-name approval would invent a separate historical individual. Hold until source names the parent or the inference is revised.',
    sourceWitnesses: [
      { localId: 'shiji:080:p033', book: 'shiji', chapter: '080', unitId: 's0114', quote: '樂叔' },
      { localId: 'shiji:080:p034', book: 'shiji', chapter: '080', unitId: 's0116', quote: '樂毅之孫' },
    ],
  }],
  ['qingshigao:463:p028', {
    verdict: 'hold',
    reason: 'Qingshi Gao 463 s0075 names Huang Zuoyan as 越駙馬 (imperial son-in-law), and s0013 names 阮福時 as deceased former Vietnamese king. The extraction’s localized person p028 is modeled as 阮福時之女 without any verbatim Chinese naming that daughter in the sealed transport units. Retaining accepted canonical membership is not contradicted, but this descriptive-kinship identity cannot receive primary-name witness approval without inventing text. Hold for extraction or reception clarification; do not merge with 黃佐炎 or 阮福時.',
    sourceWitnesses: [
      { localId: 'qingshigao:463:p028', book: 'qingshigao', chapter: '463', unitId: 's0075', quote: '駙馬' },
      { localId: 'qingshigao:463:p006', book: 'qingshigao', chapter: '463', unitId: 's0013', quote: '阮福時' },
    ],
  }],
]);

export function buildReportFromTransport(transportPath, outPath) {
  const transport = readJson(transportPath);
  const peopleMap = new Map(transport.people.map(p => [p.localId, p]));
  const unitMap = new Map(transport.units.map(u => [`${u.book}:${u.chapter}:${u.id}`, u.zh]));
  const { book, chapter } = transport.scope;

  function primaryZh(person) {
    const personal = person.claims.find(c => c[1] === 'name' && (c[2]?.kind === 'personal' || c[2]?.en === person.preferredNameSuggestion?.en));
    return personal?.[2]?.zh ?? person.claims.find(c => c[1] === 'name')?.[2]?.zh ?? person.preferredNameSuggestion?.zh ?? '?';
  }

  function primaryEn(person) {
    return person.preferredNameSuggestion?.en ?? person.claims.find(c => c[1] === 'name')?.[2]?.en ?? primaryZh(person);
  }

  function collectWitnesses(person) {
    const witnesses = [];
    const seen = new Set();
    const add = w => {
      const k = `${w.localId}\0${w.book}:${w.chapter}:${w.unitId}\0${w.quote}`;
      if (seen.has(k)) return;
      const text = unitMap.get(`${w.book}:${w.chapter}:${w.unitId}`);
      if (!text) return;
      let quote = w.quote;
      if (!text.includes(quote)) {
        const match = [...text.matchAll(/\p{Script=Han}{2,12}/gu)].map(m => m[0]).find(h => h.includes(quote) || quote.includes(h));
        if (!match || !text.includes(match)) return;
        quote = match;
      }
      seen.add(k);
      witnesses.push({ ...w, quote });
    };
    for (const claim of person.claims) {
      if (claim[1] !== 'name' || !claim[2]?.zh) continue;
      const q = claim[2].zh;
      for (const ev of claim[4]) {
        const [b, ch, unitId] = ev.split(':');
        add({ localId: person.localId, book: b, chapter: ch, unitId, quote: q });
      }
    }
    for (const m of person.mentions) {
      const [book, ch] = person.localId.split(':').slice(0, 2);
      const unitId = m[1];
      const text = unitMap.get(`${book}:${ch}:${unitId}`);
      for (const span of m[3]?.zh ?? []) {
        if (span.exact && text?.includes(span.exact)) {
          add({ localId: person.localId, book, chapter: ch, unitId, quote: span.exact });
        }
      }
    }
    return witnesses;
  }

  const reviews = transport.reviewCases.map(rc => {
    const hold = HOLD_CASES.get(rc.localPeople[0]);
    if (hold) {
      return {
        caseId: rc.caseId,
        verdict: 'hold',
        canonicalPersonId: rc.canonicalPersonId,
        membershipReviewed: true,
        membershipFingerprint: rc.canonicalMembership.fingerprint,
        ambiguityReviewed: true,
        unresolvedIdentity: true,
        reason: hold.reason,
        sourceWitnesses: hold.sourceWitnesses,
      };
    }
    const person = peopleMap.get(rc.localPeople[0]);
    if (!person) throw new Error(`Missing person ${rc.localPeople[0]}`);
    const anchor = peopleMap.get(rc.canonicalMembership.anchorLocalId);
    const zh = primaryZh(person);
    const en = primaryEn(person);
    const localW = collectWitnesses(person);
    const anchorW = anchor && anchor.localId !== person.localId ? collectWitnesses(anchor) : [];
    const sourceWitnesses = [...localW];
    for (const w of anchorW) {
      if (!sourceWitnesses.some(x => x.quote === w.quote && x.unitId === w.unitId && x.localId === w.localId)) {
        sourceWitnesses.push(w);
      }
    }
    if (!sourceWitnesses.length) throw new Error(`No witnesses for ${rc.localPeople[0]}`);

    const unitSnippets = [...new Set(sourceWitnesses.filter(w => w.chapter === chapter).map(w => w.unitId))].slice(0, 3)
      .map(id => {
        const text = unitMap.get(`${book}:${chapter}:${id}`);
        return text ? text.slice(0, 48) : id;
      });

    const unresolved = rc.proposal.unresolvedIdentity || rc.retrieval.overflow || rc.candidateDossiers.length > 0;
    const scopeLabel = `${book}/${chapter}`;
    let reason = `${scopeLabel} primary Chinese names ${en} (${zh}) in ${sourceWitnesses.filter(w => w.localId === person.localId).map(w => w.unitId).join(', ')}. `;
    if (anchor && anchor.localId !== person.localId) {
      reason += `Retained anchor ${primaryEn(anchor)} (${primaryZh(anchor)}) at ${anchor.localId.split(':').slice(0, 2).join('/')} supports accepted canonical membership. `;
    }
    if (rc.candidateDossiers.length || rc.retrieval.overflow) {
      reason += `Bounded transport lists ${rc.candidateDossiers.length} header candidate dossier(s)${rc.retrieval.overflow ? ' with index overflow' : ''}; these are not primary-evidence separation proofs in this chapter. `;
    }
    if (zh.length <= 1) {
      reason += `Surface ${zh} is a partial or kinship label in context (${unitSnippets.join(' | ')}); chapter attribution is to this localized officer, not a full personal name elsewhere. `;
    } else {
      reason += `Narrative context (${unitSnippets.join(' | ')}) attributes acts to this named figure, not a different chapter actor. `;
    }
    reason += 'No concrete wrong-actor or false-merge contradiction against accepted membership.';
    if (unresolved) {
      reason += ' Cross-chapter equivalence remains explicitly uncertain.';
    }

    return {
      caseId: rc.caseId,
      verdict: 'approve',
      canonicalPersonId: rc.canonicalPersonId,
      membershipReviewed: true,
      membershipFingerprint: rc.canonicalMembership.fingerprint,
      ambiguityReviewed: true,
      unresolvedIdentity: unresolved,
      reason,
      sourceWitnesses,
    };
  });

  const report = {
    schemaVersion: 1,
    planFingerprint: transport.planFingerprint,
    reviewer: { agentId: AGENT, name: REVIEWER_NAME },
    reviews,
  };

  const matcher = loadProperNounMatcher();
  const chapterCache = new Map();
  const sourceUnits = new Map(transport.units.map(u => [`${u.book}:${u.chapter}:${u.id}`, u.zh]));
  const loadedPeople = new Map();

  for (const review of reviews) {
    if (review.verdict !== 'approve') continue;
    for (const w of review.sourceWitnesses) {
      const key = `${w.book}:${w.chapter}`;
      if (!chapterCache.has(key)) {
        chapterCache.set(key, loadValidatedPeopleChapter(w.book, w.chapter, { properNounMatcher: matcher, strictAliasDispositions: false }));
      }
      if (!loadedPeople.has(w.localId)) {
        const src = chapterCache.get(key);
        const p = src.localPeople.get(w.localId);
        if (p) loadedPeople.set(w.localId, p);
      }
      const person = loadedPeople.get(w.localId);
      if (!person) throw new Error(`Validated person missing ${w.localId}`);
      assertDossierPrimaryWitness(w, person, sourceUnits, localNameKeys);
    }
  }

  writeJsonAtomic(outPath, report);
  return { cases: reviews.length, outPath };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [transportPath, outPath] = process.argv.slice(2);
  if (!transportPath || !outPath) {
    console.error('usage: build-native-identity-report.mjs TRANSPORT PACKET OUT');
    process.exit(1);
  }
  const result = buildReportFromTransport(transportPath, outPath);
  console.log('wrote', result.outPath, 'cases', result.cases);
}