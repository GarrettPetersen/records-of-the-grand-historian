#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PLAN = 'sha256:bab94742b782991ae226bd516a959cdc67e19bb1199776a56348727d87a7ae5a';
const REVIEWER = {
  agentId: 'bc-ca56fb16-d4fd-4ced-a2fb-3640376ab1df',
  name: 'Independent Jinshu 020 identity reviewer (bc-ca56fb16)',
};

function loadPart(n) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, `transport-part-${String(n).padStart(3, '0')}.json`), 'utf8'));
}

function unitMap(transport) {
  return new Map(transport.units.map((u) => [`${u.book}:${u.chapter}:${u.id}`, u]));
}

function assertQuote(transport, book, chapter, unitId, quote) {
  const u = unitMap(transport).get(`${book}:${chapter}:${unitId}`);
  if (!u || !u.zh.includes(quote)) throw new Error(`Quote missing: ${book}/${chapter}/${unitId} ${quote}`);
  return { localId: null, book, chapter, unitId, quote };
}

function approveCase(reviewCase, fields) {
  return {
    caseId: reviewCase.caseId,
    verdict: 'approve',
    canonicalPersonId: reviewCase.canonicalPersonId,
    membershipReviewed: true,
    membershipFingerprint: reviewCase.canonicalMembership.fingerprint,
    ambiguityReviewed: true,
    unresolvedIdentity: fields.unresolvedIdentity,
    reason: fields.reason,
    sourceWitnesses: fields.sourceWitnesses,
  };
}

function holdCase(reviewCase, reason) {
  return {
    caseId: reviewCase.caseId,
    verdict: 'hold',
    canonicalPersonId: reviewCase.canonicalPersonId,
    membershipReviewed: true,
    membershipFingerprint: reviewCase.canonicalMembership.fingerprint,
    ambiguityReviewed: true,
    unresolvedIdentity: true,
    reason,
    sourceWitnesses: [],
  };
}

function w(localId, book, chapter, unitId, quote) {
  return { localId, book, chapter, unitId, quote };
}

function buildPart1() {
  const t = loadPart(1);
  const byId = Object.fromEntries(t.reviewCases.map((c) => [c.caseId, c]));
  const reviews = [
    approveCase(byId['sha256:c8adfd25455750d0f073624b6309cf55ba62f2d6004454266d9d84a303489f73'], {
      unresolvedIdentity: true,
      reason:
        'Jinshu 020 ritual-debate passage names 博士張靖 with a specific mourning proposal (s0259); retains canonical assignment. Bounded same-name overflow remains unreviewed equivalence, not separation.',
      sourceWitnesses: [w('jinshu:020:p129', 'jinshu', '020', 's0259', '張靖')],
    }),
    approveCase(byId['sha256:3ee87abe9f5ca7371e21dd2a09c170a08c5ce74c49385133f027a8b25af16598'], {
      unresolvedIdentity: false,
      reason:
        'Source explicitly gives the personal name 元釁 for Cai’s son on s0585; this chapter cites only that individual with no competing bounded dossiers in-case. Cross-chapter equivalence outside the capped retrieval is not asserted.',
      sourceWitnesses: [w('jinshu:020:p261', 'jinshu', '020', 's0585', '元釁')],
    }),
    approveCase(byId['sha256:4d9cce9150b806a8317b84615a30056196c5ad3c1197ebb53170082f92b9597f'], {
      unresolvedIdentity: true,
      reason:
        '荀勖 appears by personal name in the Western Jin mourning council list (s0473). Accept retained membership; overflow same-name dossiers were not primary-proved in this bounded packet.',
      sourceWitnesses: [w('jinshu:020:p189', 'jinshu', '020', 's0473', '荀勖')],
    }),
    approveCase(byId['sha256:675af5c4ea63c426b740775a2661bceb757090d481b69ae83161e775a00b7381'], {
      unresolvedIdentity: true,
      reason:
        '漢武帝 is named as the historical source of the lament-song funeral custom (s0249). Classical sovereign title here identifies the cited Han individual; separate-registry overflow stays uncertain.',
      sourceWitnesses: [w('jinshu:020:p137', 'jinshu', '020', 's0249', '漢武帝')],
    }),
  ];
  for (const r of reviews) for (const s of r.sourceWitnesses) assertQuote(t, s.book, s.chapter, s.unitId, s.quote);
  return { schemaVersion: 1, planFingerprint: PLAN, reviewer: REVIEWER, reviews };
}

function buildPart2() {
  const t = loadPart(2);
  const byId = Object.fromEntries(t.reviewCases.map((c) => [c.caseId, c]));
  const simaCase = byId['sha256:111d484605d30a1801dcb80901b267327b7df1599e4f55b7601d6f2a1391ac1c'];
  const reviews = [
    approveCase(byId['sha256:79b4315b714a12ae639c8ba4aeda39e58d7fba8ae785b9b4785692a88d5f313d'], {
      unresolvedIdentity: true,
      reason:
        '傅咸 is named in the Yuankang-era mourning precedent (s0449). Chapter attribution and retained canonical id stand; capped 司馬/傅 homonym buckets remain unresolvedIdentity.',
      sourceWitnesses: [w('jinshu:020:p201', 'jinshu', '020', 's0449', '傅咸')],
    }),
    approveCase(simaCase, {
      unresolvedIdentity: true,
      reason:
        'Each chapter-local extraction row is the same Western Jin emperor Sima Yan (武帝/武皇帝/晉武帝) on its cited units; anchor beishi:001:p025 and all seven jinshu:020 locals carry primary Chinese sovereign markers. Overflow dossiers not proved equivalent here.',
      sourceWitnesses: [
        w('beishi:001:p025', 'beishi', '001', 's0057', '晉武帝'),
        w('jinshu:020:p006', 'jinshu', '020', 's0013', '武帝'),
        w('jinshu:020:p020', 'jinshu', '020', 's0122', '武帝'),
        w('jinshu:020:p092', 'jinshu', '020', 's0167', '武帝'),
        w('jinshu:020:p146', 'jinshu', '020', 's0333', '武帝'),
        w('jinshu:020:p167', 'jinshu', '020', 's0404', '武帝'),
        w('jinshu:020:p188', 'jinshu', '020', 's0444', '武皇帝'),
        w('jinshu:020:p293', 'jinshu', '020', 's0661', '武帝'),
      ],
    }),
  ];
  for (const r of reviews) for (const s of r.sourceWitnesses) assertQuote(t, s.book, s.chapter, s.unitId, s.quote);
  return { schemaVersion: 1, planFingerprint: PLAN, reviewer: REVIEWER, reviews };
}

function buildPart3() {
  const t = loadPart(3);
  const byId = Object.fromEntries(t.reviewCases.map((c) => [c.caseId, c]));
  const reviews = [
    approveCase(byId['sha256:4ec61fe7fc169a14c99573e6a15b0753d88261af32fa47866ad3820de3a9753c'], {
      unresolvedIdentity: true,
      reason:
        '吏部郎劉耽 is listed by personal name in the Eastern Jin mourning debate (s0098). English-only extraction label does not remove the Chinese witness; overflow Liu homonyms stay uncertain.',
      sourceWitnesses: [w('jinshu:020:p048', 'jinshu', '020', 's0098', '劉耽')],
    }),
    approveCase(byId['sha256:4dd37498cfcb11eb0bcff38c5aadc9f065be4c7c474067ce6ccb5daceb8192b8'], {
      unresolvedIdentity: true,
      reason:
        'Anchor jinshu:001 gives 司馬懿/宣皇帝; chapter rows cite 宣帝/宣王 on jinshu 020 ritual-historical lines. These are accepted primary aliases for the same retained canonical Sima Yi membership; overflow same-name dossiers not merged.',
      sourceWitnesses: [
        w('jinshu:001:p001', 'jinshu', '001', 's0001', '宣皇帝'),
        w('jinshu:020:p003', 'jinshu', '020', 's0011', '宣帝'),
        w('jinshu:020:p164', 'jinshu', '020', 's0401', '宣帝'),
        w('jinshu:020:p290', 'jinshu', '020', 's0649', '宣王'),
      ],
    }),
    approveCase(byId['sha256:6191cb697ebf332ccfabf8b88112d7017c54b60c81839a8aa357c940c6a25e41'], {
      unresolvedIdentity: true,
      reason:
        '武元楊后 on s0087 is the chapter’s accepted Chinese designation for Empress Wuyuan Yang (楊艷) in the cited funeral-wailing rule; no fabricated personal name. Bounded empress Yang homonyms remain unresolvedIdentity.',
      sourceWitnesses: [w('jinshu:020:p024', 'jinshu', '020', 's0087', '武元楊后')],
    }),
  ];
  for (const r of reviews) for (const s of r.sourceWitnesses) assertQuote(t, s.book, s.chapter, s.unitId, s.quote);
  return { schemaVersion: 1, planFingerprint: PLAN, reviewer: REVIEWER, reviews };
}

function buildPart4() {
  const t = loadPart(4);
  const byId = Object.fromEntries(t.reviewCases.map((c) => [c.caseId, c]));
  const reviews = [
    approveCase(byId['sha256:a217be81fd1c90db72d0624f3e7bf6679febe44f46c2af148c8f06ca0c03cb14'], {
      unresolvedIdentity: true,
      reason:
        '孝文 names Emperor Wen of Han in the cited funeral-custom line (s0159a24). Retained canonical assignment; overflow Han sovereign dossiers not proved here.',
      sourceWitnesses: [w('jinshu:020:p080', 'jinshu', '020', 's0159a24', '孝文')],
    }),
    approveCase(byId['sha256:d0955b7cfcd03c1b053b39a777035667950e309cf1c1ec93586f564fba1d8d9a'], {
      unresolvedIdentity: true,
      reason:
        '成王 is named on the Zhou funeral-security passage (s0230). Title-plus-name witness supports the cited Zhou King Cheng row; cross-chapter overflow stays uncertain.',
      sourceWitnesses: [w('jinshu:020:p135', 'jinshu', '020', 's0230', '成王')],
    }),
    approveCase(byId['sha256:211fd49976a81f21369381d07567cd5205760cd9eee53e4a60c349d7c60ef31c'], {
      unresolvedIdentity: true,
      reason:
        '衛恆 appears by personal name in the mourning-grade argument (s0553). Retained membership; bounded homonym retrieval overflow unresolved.',
      sourceWitnesses: [w('jinshu:020:p226', 'jinshu', '020', 's0553', '衛恆')],
    }),
    approveCase(byId['sha256:20dba59f53e44690860f9c759646739fae8862baa58e0c0132e3b554a365dd1a'], {
      unresolvedIdentity: true,
      reason:
        '明帝 names Emperor Ming of Han on the Han mausoleum practice line (s0159a27). Classical sovereign citation supports the retained row; overflow dossiers not proved equivalent.',
      sourceWitnesses: [w('jinshu:020:p089', 'jinshu', '020', 's0159a27', '明帝')],
    }),
    approveCase(byId['sha256:ccaa3278418e2b687af62bdd064dce65750b8067664843c1e678f012c486df2a'], {
      unresolvedIdentity: true,
      reason:
        '哀帝 in the succession lines (s0088–s0090) is the chapter’s primary Chinese marker for Emperor Ai (Sima Pi); English-only spans do not remove the regnal witness. Overflow Eastern Jin emperors remain uncertain.',
      sourceWitnesses: [
        w('jinshu:020:p025', 'jinshu', '020', 's0088', '哀帝'),
        w('jinshu:020:p025', 'jinshu', '020', 's0090', '哀帝'),
      ],
    }),
    approveCase(byId['sha256:dafd8b8a69b0279f42c20fe8d95cc9ac52813b42bcc7dd6a406f176f2efcca52'], {
      unresolvedIdentity: true,
      reason:
        '顯宗 names Emperor Cheng (Sima Yan) in the Eastern Jin succession debate (s0091). Temple designation is accepted primary evidence on owned Chinese; overflow dossiers not merged.',
      sourceWitnesses: [w('jinshu:020:p031', 'jinshu', '020', 's0091', '顯宗')],
    }),
    approveCase(byId['sha256:4ec1c0e608fd95bce8966ea08c6a57786c8d551fbc41954562394c9abe5d2813'], {
      unresolvedIdentity: true,
      reason:
        '羊璞 is named in the posthumous-title debate (s0652). Retained canonical assignment; bounded 羊 homonyms stay unresolvedIdentity.',
      sourceWitnesses: [w('jinshu:020:p309', 'jinshu', '020', 's0652', '羊璞')],
    }),
    approveCase(byId['sha256:b70166c15113ea6cb5c0f9ffea9385bc6317eb0f7858225d0080f7ffaa50d29e'], {
      unresolvedIdentity: true,
      reason:
        '張華 is named on the jinshu debate unit (s0569) and on the beishi anchor comparison (088 s0142). Same personal name supports retained cross-chapter canonical membership in bounded retrieval; further homonyms remain uncertain.',
      sourceWitnesses: [
        w('beishi:088:p061', 'beishi', '088', 's0142', '張華'),
        w('jinshu:020:p252', 'jinshu', '020', 's0569', '張華'),
      ],
    }),
    holdCase(
      byId['sha256:f545b4e2b1fd90c47e54df91b5be5ae4427530e02717e4af60f1ab20ca5d4d50'],
      'Target row lacks a blocking Chinese personal name on owned mentions (missingBlockingName). Generic 李氏 lines in chapter cite different women (e.g. 太皇太后李氏, 溫嶠前妻李氏) without tying this extraction to one individuated 李氏; hold pending explicit primary name evidence.',
    ),
    approveCase(byId['sha256:4307a88d760be7192715a5a13ea51b4fb350bf5c6d11bb026313f878e7ac8737'], {
      unresolvedIdentity: true,
      reason:
        '顏回 is named in the Confucian mourning anecdote (s0373). Classical personal name supports the retained Yan Hui row; overflow same-name dossiers not proved in this packet.',
      sourceWitnesses: [w('jinshu:020:p186', 'jinshu', '020', 's0373', '顏回')],
    }),
  ];
  for (const r of reviews) {
    if (r.verdict === 'hold') continue;
    for (const s of r.sourceWitnesses) assertQuote(t, s.book, s.chapter, s.unitId, s.quote);
  }
  return { schemaVersion: 1, planFingerprint: PLAN, reviewer: REVIEWER, reviews };
}

const parts = [buildPart1(), buildPart2(), buildPart3(), buildPart4()];
for (let i = 0; i < 4; i++) {
  const file = path.join(ROOT, `independent-review-part-${String(i + 1).padStart(3, '0')}.json`);
  fs.writeFileSync(file, JSON.stringify(parts[i], null, 2) + '\n');
  const approve = parts[i].reviews.filter((r) => r.verdict === 'approve').length;
  const hold = parts[i].reviews.filter((r) => r.verdict === 'hold').length;
  console.log(file, 'reviews', parts[i].reviews.length, 'approve', approve, 'hold', hold);
}