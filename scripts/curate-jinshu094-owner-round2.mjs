#!/usr/bin/env node
/**
 * Jinshu 094 owner round-2 curation after native apply of 44 accept + 2 revise.
 * - Adds the three reviewer-cited English repairs as proposed-only
 * - Fixes cited extraction residuals 001–008 without inventing membership seals
 * - Preserves uncertain chronology explicitly via unresolved attestations
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { validatePeopleExtraction } from './validate-people-extraction.mjs';
import {
  expandPeopleExtraction,
  compactPeopleExtraction,
  serializeCompactPeopleExtraction,
} from './lib/people-compact.mjs';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  readJson,
  writeJsonAtomic,
  writeTextAtomic,
  sha256,
} from './lib/people-content.mjs';

const book = 'jinshu';
const chapter = '094';
const ns = `${book}:${chapter}`;

const MERGE_INTO = new Map([
  // keep → absorb
  ['p014', ['p018', 'p250']], // Xia Tong
  ['p041', ['p060']], // Fan Can (+ Wuwei office/title fix)
  ['p048', ['p050']], // Fan Qiao
  ['p003', ['p125']], // Qiao Xiu
  ['p005', ['p247']], // Sun Deng
  ['p010', ['p248']], // Dong Jing
  ['p036', ['p251']], // Wu Zixu
  ['p028', ['p252']], // Jia Chong
  ['p196', ['p253']], // Song Xian
  ['p206', ['p212']], // Guo Yu
  ['p224', ['p233']], // Dai Kui
  ['p242', ['p244']], // Tao Qian
  ['p009', ['p120']], // Liuxia Hui
  ['p001', ['p024', 'p066', 'p178', 'p210']], // Confucius local splits
  ['p002', ['p071']], // Xunzi
  ['p012', ['p033', 'p168']], // Yao
  ['p013', ['p034']], // Shun
  ['p015', ['p039']], // Qu Yuan
  ['p046', ['p087']], // Sima Yan
  ['p062', ['p081']], // Zhang Hua
  ['p108', ['p137']], // Wang Dao
  ['p149', ['p159']], // Yu Liang
  ['p150', ['p160']], // Yu Yi
  ['p164', ['p183']], // Shi Le
  ['p165', ['p184']], // Shi Hu
  ['p190', ['p192', 'p213']], // Fu Jian
  ['p072', ['p180', 'p202']], // Zhuangzi
]);

const NEW_ENGLISH = [
  {
    unit: 's0739',
    field: 'idiomatic',
    before: 'Hypocrites hide behind Confucius and Laozi.',
    after: 'As for the falsely thin, that is not a failure of the two roots; rather, those who create the abuse must borrow the two roots to excuse themselves.',
    reason: '二本 is the two roots/foundations from the preceding philosophical contrast, not Confucius and Laozi. This English invention also drives the false Confucius surface at s0739.',
    confidence: 'high',
  },
  {
    unit: 's0623',
    field: 'idiomatic',
    before: 'He taught three thousand students astronomy and classics.',
    after: 'He thoroughly investigated the classics and weft texts; registered disciples numbered more than three thousand.',
    reason: '經緯 is classics and weft/apocryphal texts, not astronomy; 明究 is investigation/mastery, not merely teaching.',
    confidence: 'high',
  },
  {
    unit: 's0004',
    field: 'literal',
    before: 'As for pride toward wealth and noble rank, its meaning was set forth in detail by Master Sun.',
    after: 'As for pride toward wealth and noble rank, its meaning was set forth in detail by Xunzi.',
    reason: 'Parallel to accepted idiomatic repair: 孫子 here is Xunzi/Sun Qing, not an ambiguous Master Sun.',
    confidence: 'high',
  },
];

const MISSING_NAMED = [
  { en: 'Li Quan', zh: '李銓', unit: 's0158', descriptor: 'Guanglu dafu who compared Yang Xiong and Liu Xiang' },
  { en: 'Xu Meng', zh: '許猛', unit: 's0223', descriptor: 'Inspector of Youzhou who admired Zhang Zhong' },
  { en: 'Prince of Yan', zh: '燕王', unit: 's0224', descriptor: 'Source-form title that sent monthly sheep and wine', titleReference: true },
  { en: 'Liu Bang', zh: '漢祖', unit: 's0270', descriptor: 'Han founder cited in money anecdote' },
  { en: 'Li Xiang', zh: '李驤', unit: 's0428', descriptor: 'Uncle of Li Xiong who summoned Qiao Xiu' },
  { en: 'Zhai Fasi', zh: '翟法賜', unit: 's0459', descriptor: 'Son of Zhai Jiao summoned as Cavalier Gentleman' },
  { en: 'Master Chisong', zh: '赤松', unit: 's0504', descriptor: 'Paired with Wang Qiao in 松喬 longevity topos' },
  { en: 'Gai Gong', zh: '蓋公', unit: 's0535', descriptor: 'Daoist exemplar cited in persuasion' },
  { en: 'Qian Lou', zh: '黔婁', unit: 's0545', descriptor: 'Recluse exemplar cited for integrity' },
  { en: 'Wei Hua', zh: '韋華', unit: 's0612', descriptor: 'Named interlocutor in Guo Yu circle' },
  { en: 'Zhang Xing', zh: '張興', unit: 's0638', descriptor: 'Named with Duanmu Gan in Guo Yu teaching lineage' },
  { en: 'Duanmu Gan', zh: '幹木', unit: 's0638', descriptor: 'Duanmu / Ganmu exemplar paired with Zhang Xing' },
  { en: 'Meng Gongming', zh: '孟公明', unit: 's0662', descriptor: 'Named interlocutor across Meng Gongming dialogue' },
  { en: 'Xin Zhang', zh: '辛章', unit: 's0673', descriptor: 'Named in Song Xian narrative' },
  { en: 'Zhang Dayu', zh: '張大豫', unit: 's0674', descriptor: 'Named rebel/actor in Song Xian narrative' },
  { en: 'Suo Gu', zh: '索嘏', unit: 's0678', descriptor: 'Named associate of Song Xian' },
  { en: 'Peng Hezheng', zh: '彭和正', unit: 's0701', descriptor: 'Named with Zhang Tianci' },
  { en: 'Zhang Tianci', zh: '張天錫', unit: 's0701', descriptor: 'Named regional potentate' },
  { en: 'Wang Ya', zh: '王雅', unit: 's0757', descriptor: 'Named in Taiyuan 20 court recommendation' },
  { en: 'Zhang Ye', zh: '張野', unit: 's0834', descriptor: 'Companion of Tao Qian' },
  { en: 'Yang Songling', zh: '羊松齡', unit: 's0834', descriptor: 'Companion of Tao Qian' },
  { en: 'Pang Zun', zh: '寵遵', unit: 's0834', descriptor: 'Companion of Tao Qian (source graph 寵遵)' },
  { en: 'Pang Tongzhi', zh: '龐通之', unit: 's0839', descriptor: 'Named visitor/associate of Tao Qian' },
];

function fullId(short) {
  return short.includes(':') ? short : `${ns}:${short}`;
}

function claimEvidenceUnit(claim, unitId) {
  return claim.evidence.some((e) => e.split(':').at(-1) === unitId);
}

function nextClaimId(extraction) {
  return `${ns}:c${String(extraction.claims.length + 1).padStart(4, '0')}`;
}

function nextPersonShort(extraction) {
  const max = extraction.people.reduce((m, p) => {
    const n = Number(p.localId.split(':').at(-1).replace(/^p/, ''));
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `p${String(max + 1).padStart(3, '0')}`;
}

function retargetId(value, mapping) {
  if (typeof value !== 'string') return value;
  return mapping.get(value) ?? value;
}

function mapNestedIds(value, mapping) {
  if (Array.isArray(value)) return value.map((item) => mapNestedIds(item, mapping));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = mapNestedIds(v, mapping);
    return out;
  }
  return retargetId(value, mapping);
}

function mergeSameNameClaims(claims) {
  const seen = new Map();
  const out = [];
  for (const claim of claims) {
    if (claim.predicate !== 'name') {
      out.push(claim);
      continue;
    }
    const key = `${claim.subject}\u0000${JSON.stringify(claim.value)}`;
    if (seen.has(key)) {
      const existing = seen.get(key);
      existing.evidence = [...new Set([...existing.evidence, ...claim.evidence])];
      continue;
    }
    seen.set(key, claim);
    out.push(claim);
  }
  return out;
}

function syncFamilyHints(extraction) {
  const byId = new Map(extraction.people.map((p) => [p.localId, p]));
  for (const claim of extraction.claims) {
    if (claim.predicate !== 'family-relationship') continue;
    const target = claim.value?.personId;
    const subject = claim.subject;
    if (!byId.has(subject) || !byId.has(target)) continue;
    const sub = byId.get(subject);
    const obj = byId.get(target);
    if (!sub.identityHints.relatedLocalPeople.includes(target)) {
      sub.identityHints.relatedLocalPeople.push(target);
    }
    if (!obj.identityHints.relatedLocalPeople.includes(subject)) {
      obj.identityHints.relatedLocalPeople.push(subject);
    }
  }
}

function absorbPerson(extraction, keepShort, absorbShorts, mapping) {
  const keep = fullId(keepShort);
  for (const abs of absorbShorts) {
    const from = fullId(abs);
    mapping.set(from, keep);
    for (const mention of extraction.mentions) {
      if (mention.person === from) mention.person = keep;
    }
    for (const claim of extraction.claims) {
      if (claim.subject === from) claim.subject = keep;
      claim.value = mapNestedIds(claim.value, mapping);
      if (Array.isArray(claim.evidence)) {
        // evidence stays unit-based
      }
    }
    for (const person of extraction.people) {
      person.identityHints.relatedLocalPeople = person.identityHints.relatedLocalPeople.map((id) =>
        retargetId(id, mapping)
      );
    }
    // Drop absorbed person row
    extraction.people = extraction.people.filter((p) => p.localId !== from);
  }
}

function removeMentionSpan(extraction, personShort, unitId, language, exact) {
  const person = fullId(personShort);
  extraction.mentions = extraction.mentions
    .map((mention) => {
      if (mention.person !== person || mention.unit.id !== unitId) return mention;
      mention.spans[language] = mention.spans[language].filter((span) => span.exact !== exact);
      return mention;
    })
    .filter((mention) => mention.spans.zh.length > 0 || mention.spans.en.length > 0);
}

function addUnresolvedAttestation(extraction, person, unit, sourceText, reason, event) {
  extraction.claims.push({
    id: nextClaimId(extraction),
    subject: person,
    predicate: 'attestation',
    value: {
      sourceDate: { text: sourceText },
      unresolved: true,
      unresolvedReason: reason,
      event,
    },
    certainty: 'uncertain',
    evidence: [`${ns}:${unit}`],
  });
}

function ensureNameRole(extraction, person, nameValue, unit, roleId = 'named-individual') {
  const hasName = extraction.claims.some(
    (c) => c.subject === person && c.predicate === 'name' && JSON.stringify(c.value) === JSON.stringify(nameValue),
  );
  if (!hasName) {
    extraction.claims.push({
      id: nextClaimId(extraction),
      subject: person,
      predicate: 'name',
      value: nameValue,
      certainty: 'explicit',
      evidence: [`${ns}:${unit}`],
    });
  }
  const hasRole = extraction.claims.some((c) => c.subject === person && c.predicate === 'role');
  if (!hasRole) {
    extraction.claims.push({
      id: nextClaimId(extraction),
      subject: person,
      predicate: 'role',
      value: { roleId },
      certainty: 'explicit',
      evidence: [`${ns}:${unit}`],
    });
  }
}

function addSurface(extraction, packet, personShort, kind, language, exact, unitId, occurrence = 0) {
  const unit = packet.units.find((u) => u.id === unitId);
  if (!unit) throw new Error(`missing unit ${unitId}`);
  const text = unit[language];
  if (!text.includes(exact) && language === 'zh' && !unit.zh.includes(exact)) {
    // Skip if surface absent after repairs
    return false;
  }
  // Locate occurrence
  let start = -1;
  let count = -1;
  const hay = unit[language];
  for (let i = 0; i < hay.length; ) {
    const idx = hay.indexOf(exact, i);
    if (idx < 0) break;
    count += 1;
    if (count === occurrence) {
      start = [...hay.slice(0, idx)].length;
      break;
    }
    i = idx + exact.length;
  }
  if (start < 0) return false;
  const end = start + [...exact].length;
  const person = fullId(personShort);
  let mention = extraction.mentions.find(
    (m) => m.person === person && m.unit.id === unitId && m.kind === kind,
  );
  const span = {
    exact,
    occurrence,
    startCodePoint: start,
    endCodePoint: end,
  };
  if (!mention) {
    mention = {
      id: `${ns}:m${String(extraction.mentions.length + 1).padStart(4, '0')}`,
      person,
      unit: {
        id: unit.id,
        kind: unit.kind,
        blockIndex: unit.blockIndex,
        collection: unit.collection,
        itemIndex: unit.itemIndex,
      },
      kind,
      spans: { zh: [], en: [] },
      candidateRefs: [],
    };
    extraction.mentions.push(mention);
  }
  const spans = mention.spans[language];
  if (!spans.some((s) => s.startCodePoint === start && s.endCodePoint === end)) {
    spans.push(span);
  }
  return true;
}

function addOffice(extraction, person, unit, label, action, certainty = 'explicit') {
  extraction.claims.push({
    id: nextClaimId(extraction),
    subject: fullId(person),
    predicate: 'office',
    value: { label, action },
    certainty,
    evidence: [`${ns}:${unit}`],
  });
}

function addFamily(extraction, subject, relation, object, unit, kinshipTerm) {
  extraction.claims.push({
    id: nextClaimId(extraction),
    subject: fullId(subject),
    predicate: 'family-relationship',
    value: {
      relation,
      personId: fullId(object),
      ...(kinshipTerm ? { kinshipTerm } : {}),
    },
    certainty: 'explicit',
    evidence: [`${ns}:${unit}`],
  });
}

function main() {
  const chapterFile = path.join(REPO_ROOT, 'data', book, `${chapter}.json`);
  const extractionFile = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
  const chapterData = readJson(chapterFile);
  const stored = readJson(extractionFile);
  const matcher = loadProperNounMatcher();
  const packet = buildPeopleExtractionPacket(book, chapter, {
    chapterData,
    chapterFile,
    properNounMatcher: matcher,
  });
  const extraction = expandPeopleExtraction(stored, packet);

  // 1) Proposed English repairs (leave for same reviewer)
  for (const repair of NEW_ENGLISH) {
    const unit = packet.units.find((u) => u.id === repair.unit);
    if (!unit) throw new Error(`missing unit ${repair.unit}`);
    const current = repair.field === 'literal' ? unit.literal : unit.en;
    if (current !== repair.before) {
      throw new Error(`English before mismatch for ${repair.unit}/${repair.field}: ${JSON.stringify(current)}`);
    }
    extraction.translationRepairs.push({
      id: `${ns}:r${String(extraction.translationRepairs.length + 1).padStart(4, '0')}`,
      unit: {
        id: unit.id,
        kind: unit.kind,
        blockIndex: unit.blockIndex,
        collection: unit.collection,
        itemIndex: unit.itemIndex,
      },
      field: repair.field,
      before: repair.before,
      after: repair.after,
      reason: repair.reason,
      confidence: repair.confidence,
      status: 'proposed',
    });
  }

  // 2) False Confucius at s0739 (Chinese has 二本, not Confucius)
  removeMentionSpan(extraction, 'p210', 's0739', 'en', 'Confucius');

  // 3) Merge confirmed local duplicates
  const mapping = new Map();
  for (const [keep, absorb] of MERGE_INTO) {
    absorbPerson(extraction, keep, absorb, mapping);
  }
  extraction.claims = mergeSameNameClaims(
    extraction.claims.map((claim) => ({
      ...claim,
      subject: retargetId(claim.subject, mapping),
      value: mapNestedIds(claim.value, mapping),
    })),
  );

  // 4) Wuwei: p060 absorbed into p041; convert personal-name 武威 into title-reference / office
  for (const claim of extraction.claims) {
    if (
      claim.subject === fullId('p041') &&
      claim.predicate === 'name' &&
      claim.value?.zh === '武威'
    ) {
      claim.predicate = 'office';
      claim.value = {
        label: { en: 'Wuwei title used of Fan Can', zh: '武威' },
        action: 'held',
      };
      claim.certainty = 'explicit';
    }
  }
  // Do not add a competing 武威 zh surface if one already accounts for the unit.

  // 5) Missing named people (conservative; unresolved Western bounds)
  const created = {};
  for (const spec of MISSING_NAMED) {
    // Skip if an existing person already prefers this zh/en
    const existing = extraction.people.find((p) =>
      (spec.zh && p.preferredNameSuggestion?.zh === spec.zh) ||
      (spec.en && p.preferredNameSuggestion?.en === spec.en),
    );
    if (existing) {
      created[spec.en] = existing.localId;
      ensureNameRole(
        extraction,
        existing.localId,
        { kind: 'personal', en: spec.en, zh: spec.zh },
        spec.unit,
      );
      addSurface(
        extraction,
        packet,
        existing.localId.split(':').at(-1),
        spec.titleReference ? 'title-reference' : 'personal-name',
        'zh',
        spec.zh,
        spec.unit,
      );
      continue;
    }
    const short = nextPersonShort(extraction);
    const localId = fullId(short);
    created[spec.en] = localId;
    extraction.people.push({
      localId,
      preferredNameSuggestion: { en: spec.en, zh: spec.zh },
      historicity: 'historical',
      descriptorSuggestion: spec.descriptor,
      identityHints: {
        nativePlaces: [],
        relatedLocalPeople: [],
        activeDateHints: [
          `Source-attested in jinshu/094 ${spec.unit}; Western bounds unresolved pending independent date audit`,
        ],
        polityHints: [],
      },
    });
    ensureNameRole(
      extraction,
      localId,
      { kind: 'personal', en: spec.en, zh: spec.zh },
      spec.unit,
      'named-individual',
    );
    addUnresolvedAttestation(
      extraction,
      localId,
      spec.unit,
      spec.zh,
      `jinshu/094 ${spec.unit} names ${spec.zh} without a convertible Western year in this chapter; preserve as unresolved pending independent date audit.`,
      'Source-named appearance',
    );
    const linked = addSurface(
      extraction,
      packet,
      short,
      spec.titleReference ? 'title-reference' : 'personal-name',
      'zh',
      spec.zh,
      spec.unit,
    );
    if (!linked) {
      // Some graphs are abbreviated / variant; keep mentionException rather than inventing a span.
      const person = extraction.people.find((p) => p.localId === localId);
      person.mentionException =
        `Source-form ${spec.zh} is attested at ${spec.unit} but the exact graph is not an isolated preflight surface; retained for independent mention geometry review.`;
    }
  }

  // Liang Hong / Guan Ning / Xiao Jing already present as p254–p256
  created['Liang Hong'] = fullId('p254');
  created['Guan Ning'] = fullId('p255');
  created['Xiao Jing'] = fullId('p256');

  // 6) Missing unnamed people (minimal kinship placeholders)
  function addAnonymous(en, zh, unit, descriptor, related, relation, kinshipTerm) {
    const short = nextPersonShort(extraction);
    const localId = fullId(short);
    extraction.people.push({
      localId,
      preferredNameSuggestion: { en, ...(zh ? { zh } : {}) },
      historicity: 'historical',
      descriptorSuggestion: descriptor,
      identityHints: {
        nativePlaces: [],
        relatedLocalPeople: related ? [fullId(related)] : [],
        activeDateHints: [
          `Kinship/anonymous figure in jinshu/094 ${unit}; Western bounds unresolved`,
        ],
        polityHints: [],
      },
      mentionException: `Unnamed or kinship-only figure at ${unit}; retained without forcing a display surface.`,
    });
    ensureNameRole(
      extraction,
      localId,
      { kind: 'personal', en, ...(zh ? { zh } : {}) },
      unit,
      'named-individual',
    );
    addUnresolvedAttestation(
      extraction,
      localId,
      unit,
      zh || en,
      `jinshu/094 ${unit} requires this anonymous/kinship person for relationship coverage; no convertible Western year is supplied.`,
      'Kinship/anonymous attestation',
    );
    if (related && relation) addFamily(extraction, short, relation, related, unit, kinshipTerm);
    return short;
  }

  function addKin(extraction, subject, object, unit, kinshipTerm) {
    addFamily(extraction, subject, 'kin-of', object, unit, kinshipTerm);
  }

  // Zhang Hua's son (s0188), Dong Yang's wife (s0216), Gong Zhuang father/uncle (s0375),
  // Liu Linzhi's father (approx s0514), Fan Xuan elder brother + daughter (s0719),
  // Tao Qian wife/children/student/sons — add only the clearly cited ones.
  const zhangHua = extraction.people.find((p) => p.preferredNameSuggestion?.en === 'Zhang Hua');
  if (zhangHua) {
    addAnonymous("Zhang Hua's son", '子', 's0188', 'Son of Zhang Hua sent to Lu Sheng', zhangHua.localId.split(':').at(-1), 'child-of', {
      en: 'son',
      zh: '子',
    });
  }
  const dongYang = extraction.people.find((p) => p.preferredNameSuggestion?.en === 'Dong Yang' || p.preferredNameSuggestion?.zh === '董养' || p.preferredNameSuggestion?.zh === '董養');
  if (dongYang) {
    addAnonymous("Dong Yang's wife", '妻', 's0216', "Dong Yang's wife", dongYang.localId.split(':').at(-1), 'kin-of', {
      en: 'wife',
      zh: '妻',
    });
  }
  const gongZhuang = extraction.people.find((p) => p.preferredNameSuggestion?.en === 'Gong Zhuang' || p.preferredNameSuggestion?.zh === '龔壯');
  if (gongZhuang) {
    addAnonymous("Gong Zhuang's father", '父', 's0375', "Gong Zhuang's father killed by Li Te", gongZhuang.localId.split(':').at(-1), 'kin-of', {
      en: 'father',
      zh: '父',
    });
    addAnonymous("Gong Zhuang's uncle", '叔', 's0375', "Gong Zhuang's uncle killed by Li Te", gongZhuang.localId.split(':').at(-1), 'kin-of', {
      en: 'uncle',
      zh: '叔',
    });
  }
  const fanXuan = extraction.people.find((p) => p.preferredNameSuggestion?.en === 'Fan Xuan' || p.preferredNameSuggestion?.zh === '范宣');
  const daiKui = extraction.people.find((p) => p.localId === fullId('p224'));
  if (fanXuan) {
    const elder = addAnonymous("Fan Xuan's elder brother", '兄', 's0719', "Fan Xuan's elder brother", fanXuan.localId.split(':').at(-1), 'sibling-of', {
      en: 'elder brother',
      zh: '兄',
    });
    const daughter = addAnonymous("Fan Xuan's elder brother's daughter", '兄女', 's0719', "Became Dai Kui's wife", elder, 'child-of', {
      en: "elder brother's daughter",
      zh: '兄女',
    });
    if (daiKui) {
      addKin(extraction, daughter, 'p224', 's0719', { en: 'wife', zh: '妻' });
    }
  }

  // 7) Key relationship repairs (extraction-008)
  const liXiong = extraction.people.find((p) => p.preferredNameSuggestion?.zh === '李雄' || p.preferredNameSuggestion?.en === 'Li Xiong');
  const liShou = extraction.people.find((p) => p.preferredNameSuggestion?.zh === '李壽' || p.preferredNameSuggestion?.en === 'Li Shou');
  if (created['Li Xiang'] && liXiong) {
    addKin(extraction, created['Li Xiang'].split(':').at(-1), liXiong.localId.split(':').at(-1), 's0428', {
      en: 'uncle',
      zh: '叔父',
    });
  }
  if (created['Li Xiang'] && liShou) {
    addFamily(extraction, liShou.localId.split(':').at(-1), 'child-of', created['Li Xiang'].split(':').at(-1), 's0428', {
      en: 'son',
      zh: '子',
    });
  }
  const bingYuan = extraction.people.find((p) => p.preferredNameSuggestion?.zh === '邴原' || p.preferredNameSuggestion?.en === 'Bing Yuan');
  const bingYu = extraction.people.find((p) => p.preferredNameSuggestion?.zh === '邴郁' || p.preferredNameSuggestion?.en === 'Bing Yu');
  if (bingYuan && bingYu) {
    addKin(extraction, bingYu.localId.split(':').at(-1), bingYuan.localId.split(':').at(-1), 's0420', {
      en: 'great-grandson',
      zh: '曾孫',
    });
  }
  const fanBen = extraction.people.find((p) => p.preferredNameSuggestion?.zh === '范賁' || p.preferredNameSuggestion?.en === 'Fan Ben');
  if (fanBen && created['Xiao Jing']) {
    extraction.claims.push({
      id: nextClaimId(extraction),
      subject: created['Xiao Jing'],
      predicate: 'event-participation',
      value: {
        kind: 'rebellion',
        role: 'rebel',
        relatedPersonId: fanBen.localId,
        summary: 'Rebelled in succession with Fan Ben',
      },
      certainty: 'explicit',
      evidence: [`${ns}:s0432`],
    });
  }

  // 8) Key office claims (extraction-007) — only where person clearly exists
  const zhuChong = extraction.people.find((p) => p.preferredNameSuggestion?.zh === '朱沖' || p.preferredNameSuggestion?.en === 'Zhu Chong');
  if (zhuChong) addOffice(extraction, zhuChong.localId.split(':').at(-1), 's0120', { en: 'Erudite (appointed; declined)', zh: '博士' }, 'appointed');
  if (extraction.people.some((p) => p.localId === fullId('p041'))) {
    addOffice(extraction, 'p041', 's0127', { en: 'Aide-de-camp / staff office', zh: '參軍' }, 'held', 'uncertain');
  }
  const hanJi = extraction.people.find((p) => p.preferredNameSuggestion?.zh === '韓績' || p.preferredNameSuggestion?.en === 'Han Ji');
  if (hanJi) addOffice(extraction, hanJi.localId.split(':').at(-1), 's0472', { en: 'Erudite (summoned; declined)', zh: '博士' }, 'appointed');
  const zhaiTang = extraction.people.find((p) => p.preferredNameSuggestion?.zh === '翟湯' || p.preferredNameSuggestion?.en === 'Zhai Tang');
  if (zhaiTang) addOffice(extraction, zhaiTang.localId.split(':').at(-1), 's0472', { en: 'court summons with Han Ji (declined)', zh: '徵' }, 'appointed', 'uncertain');

  // Fix Wuwei office action if converted from name
  for (const claim of extraction.claims) {
    if (claim.predicate === 'office' && claim.value?.action === 'referred-as') {
      claim.value.action = 'held';
      claim.value.label = {
        en: 'Wuwei title used of Fan Can',
        zh: '武威',
      };
    }
  }

  // 9) Preserve uncertain chronology: mark flagged misaligned/legendary attestations unresolved when they carry invented Western intervals
  const uncertainPeople = new Set([
    'Yao', 'Shun', 'Yu the Great', 'Xu You', 'Bo Yi', 'Jiang Ziya', 'Wang Qiao', 'Liuxia Hui',
  ]);
  for (const person of extraction.people) {
    if (!uncertainPeople.has(person.preferredNameSuggestion?.en)) continue;
    for (const claim of extraction.claims) {
      if (claim.subject !== person.localId || claim.predicate !== 'attestation') continue;
      if (claim.value?.westernInterval && !claim.value.unresolved) {
        const text = claim.value.sourceDate?.text || person.preferredNameSuggestion.zh || person.preferredNameSuggestion.en;
        claim.value = {
          sourceDate: { text },
          unresolved: true,
          unresolvedReason: 'Legendary or early exemplar chronology in this chapter is an external convention, not a convertible chapter witness; preserved unresolved for independent date audit.',
          event: claim.value.event || 'Comparative/legendary reference',
        };
        claim.certainty = 'uncertain';
      }
    }
  }

  // Keep family hint mirrors in sync after merges and new kinship claims
  syncFamilyHints(extraction);

  // Clear mentionException when mentions exist
  const mentioned = new Set(extraction.mentions.map((m) => m.person));
  for (const person of extraction.people) {
    if (mentioned.has(person.localId) && person.mentionException) delete person.mentionException;
  }

  // Account for any leftover preflight candidates on merged/altered surfaces by
  // attaching them when uniquely contained, else classify with a conservative note.
  const disposed = new Set(extraction.candidateDispositions.map((d) => d.candidate));
  for (const mention of extraction.mentions) {
    for (const id of mention.candidateRefs) disposed.add(id);
  }
  for (const candidate of packet.preflight.candidates) {
    if (disposed.has(candidate.id)) continue;
    const containing = extraction.mentions.filter((mention) => {
      if (mention.unit.id !== candidate.unit) return false;
      return mention.spans[candidate.language].some(
        (span) => span.startCodePoint <= candidate.startCodePoint && span.endCodePoint >= candidate.endCodePoint,
      );
    });
    if (containing.length === 1) {
      containing[0].candidateRefs.push(candidate.id);
      disposed.add(candidate.id);
      continue;
    }
  }
  // s0739 English still says Confucius until the new proposed repair is accepted;
  // Chinese has 二本 only, so classify the stale surface as not-a-name.
  if (!disposed.has('jinshu:094:cand_322a7cc658fdea33')) {
    extraction.candidateDispositions.push({
      candidate: 'jinshu:094:cand_322a7cc658fdea33',
      disposition: 'not-person',
      reason: 'other',
      note: 's0739 Chinese has 二本 (two roots), not Confucius; English false surface pending proposed idiomatic repair jinshu-094-reviewer-en-001.',
    });
  }

  // Renumber mention/claim ids stably after edits
  extraction.mentions.forEach((mention, index) => {
    mention.id = `${ns}:m${String(index + 1).padStart(4, '0')}`;
  });
  extraction.claims.forEach((claim, index) => {
    claim.id = `${ns}:c${String(index + 1).padStart(4, '0')}`;
  });
  extraction.translationRepairs.forEach((repair, index) => {
    repair.id = `${ns}:r${String(index + 1).padStart(4, '0')}`;
  });

  const validated = validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });
  const compact = compactPeopleExtraction(validated.normalized, packet);
  writeTextAtomic(extractionFile, serializeCompactPeopleExtraction(compact));

  const receipt = {
    schemaVersion: 1,
    kind: 'jinshu094-owner-round2-curation',
    book,
    chapter,
    curatedAt: new Date().toISOString(),
    agentId: 'bc-64160cca-fb61-4c6e-ba29-27cd0fc0ada1',
    baseAfterEditorialApply: true,
    operations: {
      proposedEnglishRepairs: NEW_ENGLISH.map((r) => `${r.unit}/${r.field}`),
      localMerges: [...MERGE_INTO.entries()].map(([keep, absorb]) => ({ keep, absorb })),
      missingNamedAdded: MISSING_NAMED.map((m) => m.en),
      falseMentionRemoved: ['s0739 Confucius on p210'],
      wuweiOfficeFix: 'p060 absorbed into p041; 武威 demoted from personal-name to office/title association',
      uncertainChronologyPreserved: [...uncertainPeople],
    },
    validation: validated.stats,
    extractionSha256: sha256(serializeCompactPeopleExtraction(compact)),
    chapterFingerprint: packet.input.chapterFingerprint,
  };
  const outDir = path.join(REPO_ROOT, 'research/people/checkpoints/jinshu094-owner-round2-20261123');
  fs.mkdirSync(outDir, { recursive: true });
  writeJsonAtomic(path.join(outDir, 'curation-receipt.json'), receipt);
  console.log(JSON.stringify({ ok: true, stats: validated.stats, receipt: path.relative(REPO_ROOT, path.join(outDir, 'curation-receipt.json')) }, null, 2));
}

main();
