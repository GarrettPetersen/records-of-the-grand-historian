#!/usr/bin/env node
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readJson } from '../../../scripts/lib/people-content.mjs';
import { validateDateAuditReport } from '../../../scripts/lib/people-date-audit.mjs';

const ART = '/agent/repos/records-of-the-grand-historian/research/people/jinshu020-cloud-authoring-20261123';
const prior = readJson(`${ART}/date-audit-report-partial-s0037-s0620.json`);
const pin = readJson(`${ART}/date-audit-packet-post-editorial-pin.json`);
const unitMap = new Map(pin.units.map((u) => [u.id, u]));

function q(unitId, quote) {
  const zh = unitMap.get(unitId)?.zh ?? '';
  if (!zh.includes(quote)) throw new Error(`Quote mismatch ${unitId} ${JSON.stringify(quote)}`);
  return { unit: unitId, quote };
}

function check(id, verdict, event, reason, witnesses) {
  return { id, verdict, event, reason, evidence: witnesses.map(([u, quote]) => q(u, quote)) };
}

const claim277 = check(
  'claim-277',
  'supported',
  'Chen Shen of Nanping in the Xiankang 2 Li Fan mourning dispute.',
  's0619 gives咸康二年 for the Li Fan–Chen Shen household; s0623 and s0646 anchor Yu Liang’s council and adoption of Wang Yanqi’s ruling without contradicting the reign year.',
  [
    ['s0619', '咸康二年'],
    ['s0623', '庾亮'],
    ['s0646', '亮從愆期議定'],
  ],
);

const liFan = [
  check('claim-278', 'supported', 'Li Fan’s elder sister in the Chen Shen mourning controversy.', 's0623 records the mourning doubt after Li’s death; s0634 discusses whether Li still had生冀, both in the Xiankang 2 council chain.', [['s0623', '李亡'], ['s0634', '李雖沒賊']]),
  check('claim-279', 'supported', 'Chen Shen’s second wife Lady Yan.', 's0621 states詵更娶嚴氏 in the same narrative opened at s0619.', [['s0621', '嚴氏']]),
  check('claim-280', 'supported', 'Yu Liang as campaign-general adjudicating Chen Shen’s case.', 'Yu Liang receives the dispute at s0623 and rules at s0646 in one coherent council.', [['s0623', '庾亮府'], ['s0646', '亮從愆期議定']]),
  check('claim-281', 'supported', 'Adjutant Wang Yanqi on Chen Shen mourning.', 'Wang Yanqi leads the memorial at s0624 in the Xiankang 2 Li Fan case.', [['s0624', '王愆期議']]),
  check('claim-282', 'supported', 'Duke Hui of Lu cited via Wang Yanqi’s precedent.', 's0624 cites惠西元妃孟子 as Spring and Autumn precedent; BC hints are allusive.', [['s0624', '惠西元妃']]),
  check('claim-283', 'supported', 'Mencius as first consort in the Lu parallel.', 'The same s0624 line names孟子 as元妃 in the classical citation.', [['s0624', '孟子']]),
  check('claim-284', 'supported', 'Shengzi as successor consort in the Lu parallel.', 's0624 pairs繼室以聲子 with the Lu Hui parallel.', [['s0624', '聲子']]),
  check('claim-285', 'supported', 'Son Hui’s mourning for Li as mother.', 's0629 concludes暉之制服 for Li as Chen Shen’s wife in the council text.', [['s0629', '暉之制服']]),
  check('claim-286', 'supported', 'Shi Xiaoshu’s wife cited in captive-wife parallel.', 's0636 cites有施孝叔之妻 as historical parallel; BC dating is allusive.', [['s0636', '施孝叔']]),
  check('claim-287', 'supported', 'Xi Que cited in the same captive-wife parallel.', 's0636 names郤犨 alongside the Shi Xiaoshu anecdote.', [['s0636', '郤犨']]),
  check('claim-288', 'supported', 'Lady Bo Ji of Song cited as chastity standard.', 's0639 references宋伯姬 as the extreme standard debated in the council.', [['s0639', '宋伯姬']]),
  check('claim-289', 'supported', 'Duke Wen’s daughter Zhao Ji cited.', 's0642 cites趙姬之義 in closing the mixed-opinion summary.', [['s0642', '趙姬之義']]),
];

const posthumous = [
  check('claim-290', 'research-blocked', 'Wei Emperor Xuan in early Wei posthumous title reforms.', 's0648–s0649 narrate文侯/宣王 changes without Taishi 1 on these lines.', [['s0648', '宣帝為文侯'], ['s0649', '宣文為宣王']]),
  check('claim-291', 'research-blocked', 'Wei Emperor Jing in the same posthumous reform narrative.', 'The same s0648–s0649 cluster discusses景王 titles without Jin Taishi 1 wording.', [['s0648', '景王為武侯'], ['s0649', '忠武為景王']]),
  check('claim-292', 'research-blocked', 'Wei Emperor Wen (King Wen) in posthumous title narrative.', 's0648–s0649 discuss文王改諡 without an on-line Taishi year.', [['s0648', '文王表'], ['s0649', '文王受晉王']]),
  check('claim-293', 'research-blocked', 'Last Wei emperor in the posthumous promotion narrative.', 's0649 mentions魏帝追命 without AD 264 on the line.', [['s0649', '魏帝又追命']]),
  check(
    'claim-294',
    'supported',
    'Guo Yi posthumous title dispute in Taikang 8.',
    's0650 gives太康八年十月; s0651 and s0661 complete the memorial and武帝詔 resolution on the 景 vs 簡 posthumous question.',
    [
      ['s0650', '太康八年'],
      ['s0651', '郭奕為景'],
      ['s0661', '宜諡曰簡'],
    ],
  ),
  check('claim-295', 'research-blocked', 'Wang Ji in Taikang 8 posthumous title debate.', 'Wang Ji speaks at s0652 in the Taikang 8 council without repeating the year on that line.', [['s0652', '王濟']]),
  check('claim-296', 'research-blocked', 'Yang Pu in Taikang 8 posthumous title debate.', 'Yang Pu is named with Wang Ji at s0652.', [['s0652', '羊璞']]),
  check('claim-297', 'research-blocked', 'Cheng Can in Taikang 8 posthumous title debate.', 'Cheng Can appears at s0655 in the same council cluster.', [['s0655', '成粲']]),
  check('claim-298', 'research-blocked', 'Wu Mao in Taikang 8 posthumous title debate.', 'Wu Mao is listed with Cheng Can at s0655.', [['s0655', '武茂']]),
  check('claim-299', 'research-blocked', 'Liu Ne in Taikang 8 posthumous title debate.', 'Liu Ne completes the trio at s0655 without a separate year label.', [['s0655', '劉訥']]),
  check('claim-300', 'supported', 'Yao cited for allowing same posthumous titles.', 's0659 cites堯舜 as sage precedent for同諡; BC frame is allusive.', [['s0659', '堯舜']]),
  check('claim-301', 'supported', 'Shun cited in the same posthumous-title argument.', 'The same s0659 line pairs堯舜 for Zhou-style同諡.', [['s0659', '同符堯舜']]),
  check('claim-302', 'supported', 'Duke of Zhou father–son same posthumous title example.', 's0660 cites周公父子同諡曰文 as classical proof.', [['s0660', '周公父子同諡']]),
  check('claim-303', 'supported', 'Emperor Wu resolved Guo Yi posthumous title as Jian.', 's0661 gives武帝詔 concluding the Taikang 8 dispute.', [['s0661', '武帝詔']]),
  check('claim-304', 'supported', 'Wang Xinzhi memorialized on minister–ruler posthumous conflict.', 's0662 gives太元四年 for Wang Xinzhi’s表 on君臣同諡.', [['s0662', '太元四年']]),
];

const wenWives = [
  check(
    'claim-305',
    'supported',
    'Wen Jiao’s three wives in the posthumous consort debate.',
    's0664–s0666 narrate李氏、王氏、何氏 and the court question on夫人 status; s0676 notes posthumous seals omitted Li.',
    [
      ['s0664', '溫嶠前妻李氏'],
      ['s0665', '王氏、何氏'],
      ['s0666', '三人並得為夫人'],
      ['s0676', '不及李氏'],
    ],
  ),
  check(
    'claim-306',
    'research-blocked',
    'Li as Wen Jiao’s early wife excluded from posthumous honors.',
    'Identity and exclusion are clear at s0664 and s0676, but Xianhe 4 is not stated on these lines.',
    [
      ['s0664', '李氏'],
      ['s0676', '不及李氏'],
    ],
  ),
  check(
    'claim-307',
    'research-blocked',
    'Wang and He as Wen Jiao’s later wives receiving honors.',
    's0665 and s0676 support narrative identity; Xianhe 4 Western year remains table-only.',
    [
      ['s0665', '王氏'],
      ['s0676', '贈王、何二人'],
    ],
  ),
  check('claim-308', 'research-blocked', 'Chen Shu answered on multiple wives as mutual consorts.', 'Chen Shu is questioned at s0666 without Xianhe 4 on the line.', [['s0666', '陳舒']]),
  check('claim-309', 'research-blocked', 'Yu Weizhi on low-status wives versus posthumous elevation.', 's0675 gives庾蔚之 rule without Yuanxi 12 on the cited line.', [['s0675', '庾蔚之']]),
  check('claim-310', 'supported', 'Pengcheng petition for Li consort posthumous title.', 's0677 gives永和十一年 for the Pengcheng posthumous petition.', [['s0677', '永和十一年']]),
  check('claim-311', 'supported', 'Erudite Cao Danzhi on posthumous titles for consorts.', 'Cao Danzhi argues at s0678 in the Yonghe 11 deliberation cluster.', [['s0678', '曹耽之議']]),
  check('claim-312', 'supported', 'Hu Na on wives taking husbands’ posthumous titles.', 'Hu Na speaks at s0680 in the same Yonghe-era consort-title debate.', [['s0680', '胡訥']]),
  check('claim-313', 'incorrect', 'Consort Li of Anping king in undated posthumous panel.', 's0682 lists安平獻王李妃 without Taishi 8 on the line; table Taishi 8 is unsupported.', [['s0682', '安平獻王李妃']]),
  check('claim-314', 'supported', 'King Xian of Anping named in consort posthumous panel.', 's0682 names安平獻王 with consort Li in the memorial list.', [['s0682', '安平獻王']]),
  check('claim-315', 'incorrect', 'Consort Zhuge of Langye king with wrong reign attach.', 's0682 lists琅邪武王諸葛妃 without Taikang 4 on the line.', [['s0682', '諸葛妃']]),
  check('claim-316', 'supported', 'King Wu of Langye in consort posthumous panel.', 's0682 pairs琅邪武王 with consort Zhuge.', [['s0682', '琅邪武王']]),
  check('claim-317', 'incorrect', 'Consort Pei of Donghai king with Yongjia attach.', 's0682 names太傅東海王裴妃 without Yongjia on the line.', [['s0682', '裴妃']]),
  check('claim-318', 'supported', 'Grand Tutor King of Donghai in consort posthumous panel.', 's0682 names太傅東海王 with consort Pei.', [['s0682', '東海王']]),
  check('claim-319', 'supported', 'Wang Biaozhi on female posthumous titles as ritual decay.', 'Wang Biaozhi argues at s0683 in continuation of the consort-title debate.', [['s0683', '王彪之']]),
  check('claim-320', 'supported', 'Consort of Duke Hui of Lu (Shengzi) in classical posthumous debate.', 's0684 cites聲子為諡 with BC allusion; not a Jin event date.', [['s0684', '聲子']]),
  check('claim-321', 'supported', 'Du Yu cited that women lack posthumous titles.', 's0685 records杜預 on婦人無諡 in the same discussion.', [['s0685', '杜預']]),
  check('claim-322', 'research-blocked', 'Grand Commandant Xun Yi on remote posthumous bestowal.', 'Xun Yi’s rule appears at s0688 without Taishi 6 on the line.', [['s0688', '荀顗上諡法']]),
  check(
    'claim-323',
    'supported',
    'Palace attendant Kong Anguo summoned in Taiyuan 13.',
    's0689 gives太元十三年 and s0690 records his taboo petition regarding Wang Yu.',
    [
      ['s0689', '太元十三年'],
      ['s0690', '安國表'],
    ],
  ),
  check('claim-324', 'supported', 'Wang Yu’s name taboo conflict with Kong Anguo.', 's0690 names黃門郎王愉 in Kong Anguo’s Taiyuan 13 memorial.', [['s0690', '王愉']]),
  check('claim-325', 'supported', 'Wang You petitioned on father’s name taboo in Taiyuan 13 cluster.', 's0695 records王祐名犯父諱 in the same taboo-policy episode as s0690.', [['s0695', '王祐']]),
];

const newItemChecks = [claim277, ...liFan, ...posthumous, ...wenWives];

const mergedChecks = prior.itemChecks.filter((c) => c.id !== 'claim-277');
const seen = new Set(mergedChecks.map((c) => c.id));
for (const c of newItemChecks) {
  if (seen.has(c.id)) throw new Error(`Duplicate ${c.id}`);
  mergedChecks.push(c);
  seen.add(c.id);
}

const newPeople = {
  p277: { verdict: 'supported', event: 'Chen Shen in Xiankang 2 Li household mourning dispute.', reason: '陳詵 anchors the s0619–s0646 narrative with咸康二年 dating.', evidence: [q('s0619', '陳詵'), q('s0623', '詵疑制服')] },
  p280: { verdict: 'supported', event: 'Yu Liang adjudicating Chen Shen mourning.', reason: '庾亮 receives and decides the case at s0623 and s0646.', evidence: [q('s0623', '庾亮'), q('s0646', '亮從愆期議定')] },
  p305: { verdict: 'supported', event: 'Wen Jiao’s three wives in posthumous consort debate.', reason: '溫嶠三妻 narrative is explicit across s0664–s0676.', evidence: [q('s0664', '溫嶠'), q('s0666', '三人並得為夫人')] },
};

const personChecks = [...prior.personChecks];
const pseen = new Set(personChecks.map((p) => p.id));
for (const [id, body] of Object.entries(newPeople)) {
  if (!pseen.has(id)) {
    personChecks.push({ id, ...body });
    pseen.add(id);
  }
}

const newFindings = [
  { items: ['claim-290', 'claim-291', 'claim-292', 'claim-293'], problem: 'Wei posthumous-title history at s0648–s0649 lacks Jin Taishi 1 / AD years on cited lines.', action: 'Keep narrative actors; strip Jin reign intervals until lines supply them.' },
  { items: ['claim-295', 'claim-296', 'claim-297', 'claim-298', 'claim-299'], problem: 'Taikang 8 posthumous debate speakers at s0652–s0655 lack the year on each memorial line (anchor is s0650).', action: 'Use contextual Taikang 8 from s0650 only; do not attach Taikang 8 Western years per speaker line.' },
  { items: ['claim-306', 'claim-307', 'claim-308'], problem: 'Wen Jiao wife honors are narrated at s0664–s0676 without Xianhe 4 on lines.', action: 'Hold Xianhe 4 Western labels; retain explicit person facts and Li exclusion at s0676.' },
  { items: ['claim-309'], problem: 'Yu Weizhi rule at s0675 lacks Yuanxi 12 on the line.', action: 'Defer Yuanxi year until cited.' },
  { items: ['claim-313', 'claim-315', 'claim-317'], problem: 'Consort posthumous panel at s0682 lists figures without per-consort reign years.', action: 'Owner: remove table-only Taishi/Taikang/Yongjia attaches; keep undated panel citation.' },
  { items: ['claim-322'], problem: 'Xun Yi posthumous-distance rule at s0688 has no Taishi 6 on line.', action: 'Defer Western year; procedural rule may stand undated.' },
];

const findings = [
  ...prior.findings.filter((f) => !f.items?.includes('claim-277')),
  ...newFindings,
];

const reviewedSet = new Set(prior.reviewedUnits);
for (let n = 621; n <= 700; n++) {
  const u = `s${String(n).padStart(4, '0')}`;
  if (unitMap.has(u)) reviewedSet.add(u);
}
const reviewedUnits = [...reviewedSet].sort((a, b) => +a.slice(1) - +b.slice(1));

const g9ids = newItemChecks.filter((c) => c.evidence.some((e) => e.unit >= 's0621' && e.unit <= 's0651')).map((c) => c.id);
const g10ids = newItemChecks.filter((c) => c.evidence.some((e) => e.unit >= 's0652' && e.unit <= 's0663')).map((c) => c.id);
const g11ids = newItemChecks.filter((c) => c.evidence.some((e) => e.unit >= 's0664' && e.unit <= 's0695')).map((c) => c.id);

const priorSpans = prior.reviewContext.coverage.spanCheckpoints ?? [];
const uniqueClaimIds = new Set(mergedChecks.filter((c) => c.id.startsWith('claim-')).map((c) => c.id));

const nextClaim =
  pin.items
    .filter((it) => !seen.has(it.id))
    .sort((a, b) => +a.id.replace(/\D/g, '') - +b.id.replace(/\D/g, ''))[0] ?? null;

const report = {
  ...prior,
  reviewedAt: new Date().toISOString(),
  summary:
    'Native partial through s0700 on draft #5488. Prior s0037–s0620 preserved except claim-277 completed with multi-witness merge. Spans: Xiankang Li Fan–Chen Shen (s0619–s0646), Taikang/Taiyuan posthumous titles (s0648–s0663), Wen Jiao consorts and taboo law (s0664–s0695). Not chapter approval.',
  reviewContext: {
    ...prior.reviewContext,
    nextSpan: { startUnit: 's0696', endUnit: 's0700', label: 'Chapter tail and backfill of early-unit claim/hint rows' },
    coverage: {
      ...prior.reviewContext.coverage,
      reviewedUnits: reviewedUnits.length,
      uniqueItemChecks: mergedChecks.length,
      uniqueClaimsChecked: uniqueClaimIds.size,
      nextUntouchedSpan: { startUnit: 's0696', endUnit: 's0700', label: 'Chapter tail units plus unscheduled early claim/hint rows' },
      nextUntouchedItemId: nextClaim?.id ?? null,
      spanCheckpoints: [
        ...priorSpans,
        { span: 's0621-s0651', newItemChecks: g9ids.length, itemIds: [...new Set(g9ids)].sort() },
        { span: 's0652-s0663', newItemChecks: g10ids.length, itemIds: [...new Set(g10ids)].sort() },
        { span: 's0664-s0695', newItemChecks: g11ids.length, itemIds: [...new Set(g11ids)].sort() },
      ],
    },
  },
  reviewedUnits,
  itemChecks: mergedChecks,
  personChecks,
  findings,
  references: [
    ...prior.references,
    { kind: 'internal', book: 'jinshu', chapter: '020', unit: 's0619', quote: '咸康二年', sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0619').zh).digest('hex')}`, reason: 'Li Fan–Chen Shen dispute anchor.' },
    { kind: 'internal', book: 'jinshu', chapter: '020', unit: 's0650', quote: '太康八年', sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0650').zh).digest('hex')}`, reason: 'Guo Yi posthumous title anchor.' },
    { kind: 'internal', book: 'jinshu', chapter: '020', unit: 's0677', quote: '永和十一年', sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0677').zh).digest('hex')}`, reason: 'Pengcheng consort posthumous petition.' },
  ],
};

validateDateAuditReport(report, pin);

const out = `${ART}/date-audit-report-partial-s0037-s0700.json`;
fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);

const cp = (label, start, end, ids) => ({
  schemaVersion: 1,
  kind: 'jinshu020-chronology-span-checkpoint',
  draftCommit: prior.reviewContext.draftCommit,
  span: { startUnit: start, endUnit: end, label },
  preservedPriorThrough: 's0620',
  preservedItemChecks: 254,
  preservedUniqueClaimsChecked: 247,
  newItemCheckIds: [...new Set(ids)].sort(),
  newItemCheckCount: [...new Set(ids)].length,
  cumulativeReviewedUnits: reviewedUnits.length,
  cumulativeItemChecks: mergedChecks.length,
  cumulativeUniqueClaimsChecked: uniqueClaimIds.size,
  nextUntouchedItemId: nextClaim?.id ?? null,
  nextUntouchedSpan: report.reviewContext.coverage.nextUntouchedSpan,
  notChapterApproval: true,
});

fs.writeFileSync(`${ART}/chronology-span-checkpoint-s0621-s0651.json`, `${JSON.stringify(cp('Li Fan–Chen Shen (Xiankang 2)', 's0621', 's0651', g9ids), null, 2)}\n`);
fs.writeFileSync(`${ART}/chronology-span-checkpoint-s0652-s0663.json`, `${JSON.stringify(cp('Same-name posthumous titles (Taikang/Taiyuan)', 's0652', 's0663', g10ids), null, 2)}\n`);
fs.writeFileSync(`${ART}/chronology-span-checkpoint-s0664-s0695.json`, `${JSON.stringify(cp('Wen Jiao consorts, female posthumous titles, name taboo', 's0664', 's0695', g11ids), null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      out,
      reviewedUnits: reviewedUnits.length,
      itemChecks: mergedChecks.length,
      uniqueClaimsChecked: uniqueClaimIds.size,
      nextItem: nextClaim?.id,
    },
    null,
    2,
  ),
);