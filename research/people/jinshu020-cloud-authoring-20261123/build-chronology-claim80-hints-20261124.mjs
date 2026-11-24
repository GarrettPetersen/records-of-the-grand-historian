#!/usr/bin/env node
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readJson } from '../../../scripts/lib/people-content.mjs';
import { validateDateAuditReport } from '../../../scripts/lib/people-date-audit.mjs';
import {
  findPersonWitness,
  hintVerdictForWitness,
  chunkFindingItems,
  isGenericQuote,
} from './lib/chronology-witness.mjs';

const ROOT = '/agent/repos/records-of-the-grand-historian';
const ART = `${ROOT}/research/people/jinshu020-cloud-authoring-20261123`;
const prior = readJson(`${ART}/date-audit-report-partial-s0037-s0700.json`);
const priorManifest = readJson(`${ART}/owner-chronology-hold-manifest-20261124.json`);
const pin = readJson(`${ART}/date-audit-packet-post-editorial-pin.json`);
const ext = readJson(`${ROOT}/data/people/extractions/jinshu/020.json`);
const unitMap = new Map(pin.units.map((u) => [u.id, u]));

function q(unitId, quote) {
  const zh = unitMap.get(unitId)?.zh ?? '';
  if (!zh.includes(quote)) throw new Error(`Quote mismatch ${unitId} ${JSON.stringify(quote)}`);
  return { unit: unitId, quote };
}

function check(id, verdict, event, reason, witnesses) {
  return { id, verdict, event, reason, evidence: witnesses.map(([u, quote]) => q(u, quote)) };
}

const claim80_96 = [
  check(
    'claim-80',
    'supported',
    'Han Emperor Wen’s expedited burial and hongshan removal.',
    's0159a24 cites孝文遺詔 for 斂畢便葬; BC dating is historical allusion, not a Jin event.',
    [['s0159a24', '孝文遺詔']],
  ),
  check(
    'claim-81',
    'supported',
    'Shang Gaozong (高宗) in Du Yu’s liang’an argument.',
    's0159a07–a25 discuss殷之高宗諒闇; BC hints are interpretive classical citation.',
    [
      ['s0159a07', '殷之高宗'],
      ['s0159a20', '高宗擅名'],
    ],
  ),
  check(
    'claim-82',
    'supported',
    'Confucius (仲尼) answering Zizhang on Gaozong mourning.',
    's0159a09–a10 place仲尼 in the debate on 三年不言; BC frame is allusive.',
    [
      ['s0159a09', '問仲尼'],
      ['s0159a10', '仲尼答云'],
    ],
  ),
  check(
    'claim-83',
    'supported',
    'Zhang Jing credited in Taishi-era liang’an restoration praise.',
    's0159a30 gives泰始開元 and praises靖等 for recovering classical 諒闇 practice.',
    [
      ['s0159a30', '泰始開元'],
      ['s0159', '張靖等議'],
    ],
  ),
  check(
    'claim-84',
    'supported',
    'Duke of Zhou Dan citing Shang Gaozong precedent.',
    's0159a07 names周公旦 quoting the Gaozong 三年不言 text.',
    [['s0159a07', '周公旦']],
  ),
  check(
    'claim-85',
    'supported',
    'King Jing of Zhou criticized for post-burial music.',
    's0159a10–a13 narrate周景王喪后除喪而樂 with Shu Xiang’s critique.',
    [
      ['s0159a10', '周景王'],
      ['s0159a13', '譏景王'],
    ],
  ),
  check(
    'claim-86',
    'supported',
    'Zizhang doubting the Gaozong mourning precedent.',
    's0159a09 and s0159a20 name子張 questioning 高宗 in Du Yu’s essay.',
    [
      ['s0159a09', '子張疑之'],
      ['s0159a20', '子張致疑'],
    ],
  ),
  check(
    'claim-87',
    'supported',
    'Yao’s death and Shun’s liang’an in classical mourning proof.',
    's0159a14 cites堯崩舜諒闇三年 for 遏密八音; BC dating is allusive.',
    [['s0159a14', '堯崩']],
  ),
  check(
    'claim-88',
    'supported',
    'Shun’s three-year liang’an after Yao’s death.',
    'The same s0159a14 line pairs舜諒闇三年 with Yao’s death narrative.',
    [['s0159a14', '舜諒闇']],
  ),
  check(
    'claim-89',
    'supported',
    'Han Mingdi’s short burial without imperial tombs.',
    's0159a27 cites明帝五旬乃葬 as contrast to Han Wen; AD dating is historical allusion.',
    [['s0159a27', '明帝']],
  ),
  check(
    'claim-90',
    'supported',
    'Dai Sheng’s ritual record cited in mourning-text critique.',
    's0159a32 names戴聖之記 in the discussion of mutilated Zhou funeral classics.',
    [['s0159a32', '戴聖']],
  ),
  check(
    'claim-91',
    'supported',
    'Han Emperor Wen in palace mourning comparison.',
    's0159a47 contrasts孝文之喪 with inner-palace mourning limits.',
    [['s0159a47', '孝文之喪']],
  ),
  check(
    'claim-92',
    'supported',
    'Emperor Jing of Han taking auspicious rites at Weiyang.',
    's0159a47 pairs孝景即吉於未央 with Han Wen’s shortened mourning.',
    [['s0159a47', '孝景即吉']],
  ),
  check(
    'claim-93',
    'supported',
    'Empress Bo excluded from full palace mourning.',
    's0159a47 names薄后 among consorts who could not observe 齊斬于別宮.',
    [['s0159a47', '薄后']],
  ),
  check(
    'claim-94',
    'supported',
    'Empress Dou in the same Han palace mourning example.',
    's0159a47 pairs竇后 with薄后 in the Han inner-palace mourning argument.',
    [['s0159a47', '竇后']],
  ),
  check(
    'claim-95',
    'supported',
    'Gaozong cited again as moral reform exemplar.',
    's0159a40 states高宗所以致雍熙 in Du Yu’s praise of imperial 諒闇 restoration.',
    [['s0159a40', '高宗所以致雍熙']],
  ),
  check(
    'claim-96',
    'supported',
    'Zhai Fangjin observing thirty-six-day chancellor mourning.',
    's0159a56 cites翟方進居喪三十六日 as Han state-law contrast to the crown prince.',
    [['s0159a56', '翟方進']],
  ),
];

const priorByPerson = new Map();
for (const c of prior.itemChecks) {
  const packet = pin.items.find((i) => i.id === c.id);
  const pid = packet?.personId ?? c.id.replace(/^hints-/, '');
  if (!packet?.personId && !c.id.startsWith('hints-')) continue;
  const key = packet?.personId ?? null;
  if (!key) continue;
  if (!priorByPerson.has(key)) priorByPerson.set(key, []);
  for (const e of c.evidence ?? []) priorByPerson.get(key).push(e);
}

const mergedChecks = [...prior.itemChecks];
const seen = new Set(mergedChecks.map((c) => c.id));
for (const c of claim80_96) {
  if (seen.has(c.id)) throw new Error(`Duplicate ${c.id}`);
  mergedChecks.push(c);
  seen.add(c.id);
  const pkt = pin.items.find((i) => i.id === c.id);
  if (pkt?.personId) {
    if (!priorByPerson.has(pkt.personId)) priorByPerson.set(pkt.personId, []);
    priorByPerson.get(pkt.personId).push(...c.evidence);
  }
}

const hintIds = pin.items
  .filter((i) => i.id.startsWith('hints-p') && +i.id.replace(/\D/g, '') >= 18 && !seen.has(i.id))
  .map((i) => i.id)
  .sort((a, b) => +a.replace(/\D/g, '') - +b.replace(/\D/g, ''));

const newHints = [];
const witnessFailures = [];

for (const id of hintIds) {
  const hintItem = pin.items.find((i) => i.id === id);
  const person = pin.people.find((p) => p.id === hintItem.personId);
  const witness = findPersonWitness({
    personId: hintItem.personId,
    people: pin.people,
    units: pin.units,
    unitMap,
    unitPeople: pin.unitPeople,
    surfaces: ext.surfaces,
    priorEvidenceByPerson: priorByPerson,
  });
  if (!witness) {
    witnessFailures.push(id);
    continue;
  }
  const { verdict, event, reason } = hintVerdictForWitness({ hintItem, person, witness, unitMap });
  newHints.push(check(id, verdict, event, reason, [[witness.unit, witness.quote]]));
}

if (witnessFailures.length) {
  throw new Error(`No individual witness for hints: ${witnessFailures.join(', ')}`);
}

for (const c of newHints) {
  if (seen.has(c.id)) throw new Error(`Duplicate ${c.id}`);
  mergedChecks.push(c);
  seen.add(c.id);
}

function dedupeFindingItems(findings) {
  const claimed = new Set();
  const out = [];
  for (const f of findings) {
    const items = [...new Set(f.items)].filter((id) => {
      if (claimed.has(id)) return false;
      claimed.add(id);
      return true;
    });
    if (!items.length) continue;
    out.push({ ...f, items: items.sort() });
  }
  return out;
}

let findings = [...prior.findings];
const newBlockedHintIds = newHints.filter((c) => c.verdict === 'research-blocked').map((c) => c.id);
const newIncorrectHintIds = newHints.filter((c) => c.verdict === 'incorrect').map((c) => c.id);

for (const chunk of chunkFindingItems(newBlockedHintIds, 30)) {
  findings.push({
    items: chunk,
    problem: 'Active-date hints cite persons on chapter lines that lack matching reign or Western year wording for the packaged interval.',
    action: 'Owner: retain named mentions; remove or defer active-hint Western/reign intervals until a sourced dated line names this individual.',
  });
}
for (const chunk of chunkFindingItems(newIncorrectHintIds, 30)) {
  findings.push({
    items: chunk,
    problem: 'Active-date hints apply table-only reign or Western intervals to undated roster or narrative lines.',
    action: 'Align with claim-8–13 / claim-11 repairs: drop unsupported intervals from active hints.',
  });
}

findings = dedupeFindingItems(findings);

const gClaimIds = claim80_96.map((c) => c.id);
const gHintIds = newHints.map((c) => c.id);
const uniqueClaimIds = new Set(mergedChecks.filter((c) => c.id.startsWith('claim-')).map((c) => c.id));

const remaining = pin.items.filter((i) => !seen.has(i.id));

const report = {
  ...prior,
  reviewedAt: new Date().toISOString(),
  status: 'needs-revision',
  summary: `Native partial through s0700. Added claim-80–96 (Du Yu s0159a essay) and hints-p018–p325 with person-specific Chinese witnesses. ${mergedChecks.length}/${pin.items.length} packet items checked. Not chapter approval.`,
  reviewContext: {
    ...prior.reviewContext,
    coverage: {
      ...prior.reviewContext.coverage,
      uniqueItemChecks: mergedChecks.length,
      uniqueClaimsChecked: uniqueClaimIds.size,
      claim80Through96: true,
      hintsP018ThroughP325: true,
      remainingPacketItems: remaining.length,
      nextUntouchedItemId: remaining[0]?.id ?? null,
      spanCheckpoints: [
        ...(prior.reviewContext.coverage.spanCheckpoints ?? []),
        {
          span: 'claim-80-96',
          newItemChecks: gClaimIds.length,
          itemIds: gClaimIds,
          anchorUnits: 's0159a07-s0159a56',
        },
        {
          span: 'hints-p018-p325',
          newItemChecks: gHintIds.length,
          itemIds: [`${gHintIds[0]}…${gHintIds.at(-1)}`],
          witnessPolicy: 'person-named Chinese only; no generic shared fallback',
        },
      ],
    },
  },
  itemChecks: mergedChecks,
  findings,
};

validateDateAuditReport(report, pin);

const out = `${ART}/date-audit-report-partial-s0037-s0700.json`;
fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);

const checkpoint = {
  schemaVersion: 1,
  kind: 'jinshu020-chronology-bounded-evidence-checkpoint',
  draftCommit: prior.reviewContext.draftCommit,
  preservedItemChecks: 329,
  preservedOwnerFindingGroups: 37,
  preservedOwnerHeldIds: 109,
  span: 'claim-80-96 + hints-p018-p325',
  newItemCheckIds: [...gClaimIds, ...gHintIds],
  newItemCheckCount: gClaimIds.length + gHintIds.length,
  cumulativeItemChecks: mergedChecks.length,
  cumulativeUniqueClaims: uniqueClaimIds.size,
  witnessPolicy: 'Each hint verified against a named Chinese substring for that individual',
  remainingPacketItems: remaining.length,
  nextPacketItemId: remaining[0]?.id ?? null,
  notChapterApproval: true,
};

fs.writeFileSync(`${ART}/chronology-span-checkpoint-claim80-hints-20261124.json`, `${JSON.stringify(checkpoint, null, 2)}\n`);

function rebuildOwnerManifest(rep, prev) {
  const byVerdict = { incorrect: [], 'research-blocked': [] };
  for (const c of rep.itemChecks) {
    if (c.verdict === 'supported') continue;
    byVerdict[c.verdict]?.push(c.id);
  }
  const findingRows = rep.findings.map((f, i) => ({
    groupId: `hold-${String(i + 1).padStart(3, '0')}`,
    itemIds: [...new Set(f.items)].sort(),
    problem: f.problem,
    action: f.action,
  }));
  const idToGroups = new Map();
  for (const row of findingRows) {
    for (const id of row.itemIds) {
      if (!idToGroups.has(id)) idToGroups.set(id, []);
      idToGroups.get(id).push(row.groupId);
    }
  }
  return {
    ...prev,
    generatedAt: rep.reviewedAt,
    coverage: {
      reviewedUnits: rep.reviewedUnits.length,
      itemChecks: rep.itemChecks.length,
      uniqueClaimsChecked: uniqueClaimIds.size,
      claim80Through96Complete: true,
      hintsP018ThroughP325Complete: true,
      remainingPacketItems: remaining.length,
      nextPacketItemId: remaining[0]?.id ?? null,
      fullPacketCoverage: remaining.length === 0,
    },
    summaryCounts: {
      incorrectItemChecks: byVerdict.incorrect.length,
      researchBlockedItemChecks: byVerdict['research-blocked'].length,
      findingGroups: findingRows.length,
      dedupedFindingItemIds: idToGroups.size,
      previousFindingGroups: prev.summaryCounts?.findingGroups ?? 37,
      previousDedupedHeldIds: prev.summaryCounts?.dedupedFindingItemIds ?? 109,
    },
    findingGroups: findingRows,
    itemIndex: [...idToGroups.entries()]
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([itemId, groups]) => ({ itemId, groups: [...new Set(groups)] })),
    appendNote: 'New finding groups hold-038+ appended; IDs deduplicated across groups.',
  };
}

const manifest = rebuildOwnerManifest(report, priorManifest);
fs.writeFileSync(`${ART}/owner-chronology-hold-manifest-20261124.json`, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      out,
      newClaims: gClaimIds.length,
      newHints: gHintIds.length,
      itemChecks: mergedChecks.length,
      uniqueClaims: uniqueClaimIds.size,
      findings: findings.length,
      manifestGroups: manifest.summaryCounts.findingGroups,
      manifestHeldIds: manifest.summaryCounts.dedupedFindingItemIds,
      remaining: remaining.length,
    },
    null,
    2,
  ),
);