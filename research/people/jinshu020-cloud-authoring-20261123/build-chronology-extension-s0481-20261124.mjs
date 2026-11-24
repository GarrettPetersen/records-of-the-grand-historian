#!/usr/bin/env node
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readJson } from '../../../scripts/lib/people-content.mjs';
import { validateDateAuditReport } from '../../../scripts/lib/people-date-audit.mjs';

const ART = '/agent/repos/records-of-the-grand-historian/research/people/jinshu020-cloud-authoring-20261123';
const prior = readJson(`${ART}/date-audit-report-partial-s0037-s0480.json`);
const pin = readJson(`${ART}/date-audit-packet-post-editorial-pin.json`);
const unitMap = new Map(pin.units.map((u) => [u.id, u]));

function q(unitId, quote) {
  const zh = unitMap.get(unitId)?.zh ?? '';
  if (!zh.includes(quote)) throw new Error(`Quote mismatch ${unitId} ${quote}`);
  return { unit: unitId, quote };
}

function row(id, verdict, event, reason, unit, quote) {
  return { id, verdict, event, reason, evidence: [q(unit, quote)] };
}

const wangClose = [
  row('claim-213', 'research-blocked', 'Granary-section clerk Wei Heng on former-wife mourning.', 'Wei Heng argues at s0484 in the Wang Chang aftermath; no Taikang year appears on the line.', 's0484', '衛恆議'),
  row('claim-214', 'research-blocked', 'Chief clerk Liu Bian on元妃 versus继室 ranking.', 'Liu Bian speaks at s0489 in the same debate without a sourced reign year.', 's0489', '劉卞議'),
  row('claim-215', 'supported', 'Zhao Ji yielded precedence to Shu Wei in the Spring and Autumn parallel.', 's0492 cites趙姬/叔隗 as classical precedent; BC dating is allusive only.', 's0492', '趙姬'),
  row('claim-216', 'supported', 'Shu Wei in the Zhao Ji parallel.', 's0492 names叔隗 in the cited parallel with clear identity.', 's0492', '叔隗'),
  row('claim-217', 'supported', 'Yuan Tong insisted on Xuan Meng as heir in the parallel.', 's0493 gives原同/宣孟 as paired Spring and Autumn precedent.', 's0493', '原同'),
  row('claim-218', 'research-blocked', 'Prince of Qi Sima You opposed Wang Chang former-wife mourning.', 'Sima You cites the Li ji at s0498 without Taikang 2 on the memorial line.', 's0498', '齊王攸議'),
  row('claim-219', 'research-blocked', 'Sima You continuation on tax-mourning for former wife.', 's0499 continues the Qi prince argument in the Wang Chang cluster without a calendar witness.', 's0499', '追服'),
  row('claim-220', 'supported', 'Council conclusion that Wang Chang should not pursue former-wife mourning.', 's0500 states昌不宜追服 as the ruling direction in the debate sequence.', 's0500', '昌不宜追服'),
  row('claim-221', 'research-blocked', 'Minister of Education Li Yin on Wang Bi’s marriage after rebellion.', 'Li Yin argues at s0501 with江南已叛 context but no Taikang year on the line.', 's0501', '李胤議'),
  row('claim-222', 'supported', 'Wang Bi as Huangmen lang during Wu rebellion in Li Yin’s argument.', 's0501 names毖為黃門侍郎 with clear person reference in the debate.', 's0501', '黃門侍郎'),
  row('claim-223', 'research-blocked', 'Grand Marshal noncommittal in Wang Chang council.', 's0503 records大司馬騫不議 without dating the council session.', 's0503', '大司馬'),
  row('claim-224', 'research-blocked', 'Grand Commandant in Wang Chang majority line.', 's0503 names太尉充 as aligning with the winning memorial side without a year label.', 's0503', '太尉充'),
  row('claim-225', 'research-blocked', 'Prince of Runan in Wang Chang majority line.', 's0503 names汝南王亮 in the same undated council record.', 's0503', '汝南王亮'),
  row('claim-226', 'research-blocked', 'Yu Pu rebuts Bian Cui on mourning for non-kin.', 'Yu Pu speaks at s0504 in the ongoing Wang Chang controversy without Taikang 2 in Chinese.', 's0504', '溥又駁粹'),
  row('claim-227', 'research-blocked', 'Capital clerk Yu Pu in Wang Chang debate.', 'The same s0504 memorial continues Yu Pu’s argument without a calendar anchor on the line.', 's0504', '喪從甯戚'),
  row('claim-228', 'supported', 'Bo Yi yielding Guzhu cited against dual-primary precedent.', 's0509 cites伯夷讓孤竹 as historical argument; BC frame is allusive.', 's0509', '伯夷'),
  row('claim-229', 'supported', 'Zisi mourning a birth mother outside the temple.', 's0525 cites子思哭出母 as Confucian precedent in the council.', 's0525', '子思哭出母'),
  row('claim-230', 'supported', 'Zhao Ji precedent for flexible ranking between wives.', 's0531 discusses趙姬之舉 in the imperial decision discussion.', 's0531', '趙姬之舉'),
  row('claim-231', 'supported', 'Wang Chang’s former mother compared to Shu Wei.', 's0533 directs昌之前母 to follow叔隗 parallel.', 's0533', '叔隗為比'),
  row('claim-232', 'supported', 'Zhao Huai enforcing precedence over Shu Wei in the parallel.', 's0541 cites趙衰/隗氏 in the edict reasoning.', 's0541', '趙衰'),
  row('claim-233', 'research-blocked', 'Formulation sent to Taichang for Dongping prince to execute.', 's0536 records太常報楳奉行 without reign-year precision on the promulgation line.', 's0536', '下太常'),
  row('claim-234', 'supported', 'Historian Gan Bao’s Taixing-era essay on Wang Bi’s case.', 's0544 opens太興初 with Gan Bao’s retrospective on Wang Bi as explicit Eastern Jin dating.', 's0544', '太興初'),
  row('claim-235', 'research-blocked', 'Thieves-section clerk Zhang Yun in Gan Bao summary.', 's0553 names張惲 among debaters without a separate year on that summary line.', 's0553', '張惲'),
  row('claim-236', 'research-blocked', 'Chief clerk Liu Bian in Gan Bao summary.', 'The same s0553 line lists劉卞 without calendar precision beyond the prior 太兴 frame.', 's0553', '劉卞'),
  row('claim-237', 'research-blocked', 'Granary clerk Wei Heng in Gan Bao summary.', 's0553 names衛恆 in retrospective summary without an independent reign year.', 's0553', '衛恆'),
];

const liuPei = [
  row('claim-238', 'supported', 'Liu Zhongwu remarried after Guqiu Jian’s failed rebellion.', 's0560 gives毌丘儉反敗 and Liu Zhongwu’s remarriage narrative with clear event sequencing.', 's0560', '毌丘儉反敗'),
  row('claim-239', 'supported', 'Liu Zhongwu’s first marriage to the Guqiu clan.', 's0559 introduces沛國劉仲武先娶毌丘氏 with explicit family setup.', 's0559', '劉仲武'),
  row('claim-240', 'supported', 'Lady Guqiu as first wife in the Liu Zhongwu case.', 's0559 names毌丘氏 as first wife and mother of Zhengshu and Zhengzhe.', 's0559', '毌丘氏'),
  row('claim-241', 'supported', 'Son Zhengshu in the prolonged burial dispute.', 's0562 records舒不釋服 over Guqiu burial refusal in the Liu household.', 's0562', '舒不釋服'),
  row('claim-242', 'supported', 'Lady Wang as Liu Zhongwu’s second wife bearing Tao.', 's0560 states娶王氏，生陶 in the Zhongwu narrative.', 's0560', '王氏'),
  row('claim-243', 'supported', 'Son Tao as child of the second wife.', 'The same s0560 line names陶 as Wang’s son in the Liu household dispute.', 's0560', '生陶'),
];

const dualWivesWen = [
  row('claim-244', 'supported', 'Wu Zhu’s Chen wife in cross-border family dispute.', 's0563 opens the Zhu/Chen two-wives narrative used for later Jin comparisons.', 's0563', '陳氏'),
  row('claim-245', 'supported', 'Jin gift-wife and Taiyuan-era harmonious dual-mother household.', 's0565 states太康之中 for the Zhu brothers’雙母 ordering example.', 's0565', '太康之中'),
  row('claim-246', 'supported', 'Cheng Liang with two principal wives in Anfeng.', 's0567 records程諒立二嫡 in a later ministerial reference case.', 's0567', '二嫡'),
  row('claim-247', 'supported', 'Cheng Liang’s second son in mourning-grade doubt.', 's0568 discusses后妻子勳疑所服 in the Cheng Liang household.', 's0568', '子勳'),
  row('claim-248', 'research-blocked', 'Director Zhang Hua’s hypothetical dual-wife question.', 'Zhang Hua poses甲乙之問 at s0569 without Taikang year on the interrogatory line.', 's0569', '張華造'),
  row('claim-249', 'research-blocked', 'Grand Tutor Zheng Chong on dual-primary sons’ mourning.', 'Zheng Chong argues at s0574 in the Taiyuan-era debate without explicit year on line.', 's0574', '鄭沖議'),
  row('claim-250', 'research-blocked', 'Jia Chong aligned with Zheng Chong on dual-primary mourning.', 'Jia Chong’s view at s0576 is undated on the cited memorial line.', 's0576', '賈充'),
  row('claim-251', 'research-blocked', 'Ren Kai aligned with Zheng Chong on dual-primary mourning.', 'Ren Kai is named with Jia Chong at s0576 without calendar witness.', 's0576', '任愷'),
  row('claim-252', 'research-blocked', 'Grand Commandant Xun Yi on paired empresses as ancient precedent.', 'Xun Yi cites春秋 at s0577 without a reign year on the argument line.', 's0577', '荀顗議'),
  row('claim-253', 'supported', 'Qu Jian removing water-chestnut cited as ritual precedent.', 's0581 cites屈建去芰 as classical example; BC dating is allusive.', 's0581', '屈建'),
  row('claim-254', 'research-blocked', 'Director Xun Xu recounts Zheng Ziqun two-wife case.', 'Xun Xu memorial at s0583 uses contemporary Taiyuan-era story-telling but lacks Taikang 2 on line.', 's0583', '荀勖議'),
  row('claim-255', 'research-blocked', 'Wife Chen in Xun Xu’s Zheng Ziqun narrative.', 'The same s0583 memorial discusses陳司空從妹 without calendar label.', 's0583', '陳司空'),
  row('claim-256', 'research-blocked', 'Wife Cai in Xun Xu’s Zheng Ziqun narrative.', 's0583 discusses蔡氏女 remarriage after Lü Bu turmoil without dated anchor.', 's0583', '蔡氏女'),
  row('claim-257', 'supported', 'Chen wife returned after Xuzhou pacification with dual households.', 's0584 states徐州平定，陳氏得還，遂二妃並存 with processional clarity.', 's0584', '二妃並存'),
  row('claim-258', 'research-blocked', 'Cai son Yuan Xin mourning for principal mother Chen.', 's0585 describes元釁服嫡母之服 without Taikang on the witness line.', 's0585', '元釁'),
  row('claim-259', 'research-blocked', 'Clan elder rebuked Yuan Xin for depressing birth mother.', 's0586 records族兄宗伯責元釁 in the same undated anecdote cluster.', 's0586', '宗伯'),
  row('claim-260', 'supported', 'Local elders approved Yuan Xin’s mourning compromise.', 's0586 states鄉里先達以元釁為合宜 closing the anecdote.', 's0586', '元釁為合宜'),
  row('claim-261', 'supported', 'Clan elder Zong Bo in Yuan Xin dispute.', 's0586 names宗伯曾責元釁 with explicit actor reference.', 's0586', '宗伯曾責'),
  row('claim-262', 'supported', 'Wen Jiao declined office while mother’s burial unsettled in Jianwu 1.', 's0588 gives建武元年 and Wen Jiao’s refusal to assume 散騎侍郎 until reburial.', 's0588', '建武元年'),
  row('claim-263', 'supported', 'Emperor Yuan’s edict on Wen Jiao’s mourning versus public duty.', 's0589 records元帝詔 on Wen Jiao’s non-acceptance of office.', 's0589', '元帝詔'),
  row('claim-264', 'research-blocked', 'Prince of Xiyang Yang in Wen Jiao deliberation.', 'Yang is named at s0597 in the council without 永和 or other year on the line.', 's0597', '西陽王'),
  row('claim-265', 'research-blocked', 'Director Xun Zu in Wen Jiao deliberation.', 's0597 lists臨潁公組 among Wen Jiao councillors without explicit calendar on line.', 's0597', '臨潁公'),
  row('claim-266', 'research-blocked', 'Grand Tutor Wang Dao in Wen Jiao deliberation.', 's0597 names即丘子導 with unambiguous identity but no sourced reign year on the memorial.', 's0597', '即丘子導'),
  row('claim-267', 'research-blocked', 'Attendant Ji Zhan in Wen Jiao deliberation.', 's0597 lists紀瞻 in the council list without calendar precision.', 's0597', '紀瞻'),
  row('claim-268', 'research-blocked', 'Minister Zhou Yi in Wen Jiao deliberation.', 's0597 names周顗 among councillors without year on line.', 's0597', '周顗'),
  row('claim-269', 'research-blocked', 'Cavalier Xun Sui in Wen Jiao deliberation.', 's0597 lists荀邃 in the Wen Jiao council without dated anchor.', 's0597', '荀邃'),
  row('claim-270', 'research-blocked', 'Wu Zixu parallel in Wen Jiao council argument.', 'The s0597 memorial cites伍員 as historical parallel without attaching a calendar year.', 's0597', '伍員'),
  row('claim-271', 'research-blocked', 'Wen Jiao’s repeated illness excuses while awaiting reburial.', 's0607 discusses嶠以未得改卜 in continuation without new year label.', 's0607', '嶠以未得'),
  row('claim-272', 'supported', 'He Xun on parents lost to bandits with ambiguous survival.', 's0612 records賀循 on二親生離 with clear ritual reasoning in Eastern Jin restoration context.', 's0612', '賀循曰'),
  row('claim-273', 'supported', 'Emperor Yuan accepted He Xun on captive-parent mourning.', 's0613 states元帝令以循議為然.', 's0613', '元帝令'),
  row('claim-274', 'supported', 'Director Xun Zu on parents lost to bandits in Taixing 2.', 's0614 gives太興二年 and Xun Zu’s寇难 mourning rule explicitly.', 's0614', '太興二年'),
  row('claim-275', 'supported', 'Yu Weizhi on parents captured with unknown fate.', 's0615 gives庾蔚之 on二親為戎狄所破 as commentary in the same statutory cluster.', 's0615', '庾蔚之'),
  row('claim-276', 'supported', 'Li Fan’s sister and Chen Shen bandit-loss case in Xiankang 2.', 's0619 gives咸康二年 and Li Fan’s sister narrative with explicit reign year.', 's0619', '咸康二年'),
  row('claim-277', 'research-blocked', 'Li Fan complex remarriage and mourning dispute continuation.', 'claim-277’s primary chain continues beyond s0619; this span checks s0619 anchor only while later units remain for a future pass.', 's0619', '李繁'),
];

const newItemChecks = [...wangClose, ...liuPei, ...dualWivesWen];

const mergedChecks = [...prior.itemChecks];
const seen = new Set(prior.itemChecks.map((c) => c.id));
for (const c of newItemChecks) {
  if (seen.has(c.id)) throw new Error(`Duplicate ${c.id}`);
  mergedChecks.push(c);
  seen.add(c.id);
}

const newPeople = {
  p234: { verdict: 'supported', event: 'Gan Bao’s Taixing retrospective on Wang Bi.', reason: '干寶 at s0544 in the 太兴初 essay on Wang Bi’s irregular marriage case.', evidence: [q('s0544', '干寶')] },
  p239: { verdict: 'supported', event: 'Liu Zhongwu two-wife household after Guqiu rebellion.', reason: '劉仲武 narrative spans s0559–s0562 with consistent identity.', evidence: [q('s0559', '劉仲武')] },
  p262: { verdict: 'supported', event: 'Wen Jiao Jianwu mourning versus office conflict.', reason: '溫嶠 at s0588–s0589 with 建武元年 dating.', evidence: [q('s0588', '溫嶠')] },
};

const personChecks = [...prior.personChecks];
const pseen = new Set(prior.personChecks.map((p) => p.id));
for (const [id, body] of Object.entries(newPeople)) {
  if (!pseen.has(id)) {
    personChecks.push({ id, ...body });
    pseen.add(id);
  }
}

const wangIds = wangClose.filter((c) => c.verdict === 'research-blocked').map((c) => c.id);
const dualIds = ['claim-248', 'claim-249', 'claim-250', 'claim-251', 'claim-252', 'claim-254', 'claim-255', 'claim-256', 'claim-258', 'claim-259'];
const wenCouncil = ['claim-264', 'claim-265', 'claim-266', 'claim-267', 'claim-268', 'claim-269', 'claim-270', 'claim-271'];

const newFindings = [
  { items: wangIds, problem: 'Wang Chang debate closure memorials (s0484–s0553) lack Taikang 2 on cited Chinese lines.', action: 'Keep person and classical parallels; block Taikang Western intervals unless owner cites a dated council opening.' },
  { items: ['claim-238'], problem: 'Liu Zhongwu case uses AD 255 on claims but s0560 gives only 毌丘儉反敗 without Western year.', action: 'Treat Wei rebellion context as supported; defer AD 255 until a line supplies it.' },
  { items: dualIds, problem: 'Dual-primary and Zheng Ziqun debate units lack Taikang/Taiyuan years on cited memorial lines.', action: 'Hold table intervals; retain narrative actors and 太康之中 where explicit (claim-245).' },
  { items: wenCouncil, problem: 'Wen Jiao council roster at s0597 lists ministers without Jianwu year repetition on each line.', action: 'Anchor to 建武元年 at s0588–s0589; strip unsourced Yonghe/Jianwu variants on roster claims.' },
  { items: ['claim-277'], problem: 'Li Fan dispute evidence continues past s0619; partial span does not cover every evidence unit in the packet.', action: 'Continue chronology from s0620+ for claim-277 residual evidence before full approval.' },
];

const findings = [...prior.findings, ...newFindings];

const reviewedUnits = [...prior.reviewedUnits];
for (let n = 481; n <= 620; n++) {
  const u = `s${String(n).padStart(4, '0')}`;
  if (!reviewedUnits.includes(u)) reviewedUnits.push(u);
}

const g7 = newItemChecks.filter((c) => c.evidence[0].unit >= 's0481' && c.evidence[0].unit <= 's0560').map((c) => c.id);
const g8 = newItemChecks.filter((c) => c.evidence.some((e) => e.unit >= 's0561' && e.unit <= 's0620')).map((c) => c.id);

const priorSpans = prior.reviewContext.coverage.spanCheckpoints ?? [];
const uniqueClaimIds = new Set(mergedChecks.filter((c) => c.id.startsWith('claim-')).map((c) => c.id));
const nextClaim =
  pin.items
    .filter((it) => !seen.has(it.id) && (it.evidence || []).some((u) => +u.slice(1) >= 621))
    .sort((a, b) => +a.id.slice(6) - +b.id.slice(6))[0] ?? null;

const report = {
  ...prior,
  reviewedAt: new Date().toISOString(),
  summary:
    'Native partial through s0620 on draft #5488. Prior 189 item checks preserved. New spans: Wang Chang debate closure (s0481–s0558), Liu Zhongwu/Guqiu case (s0559–s0562), dual-wife and Wen Jiao statutory cluster (s0563–s0619 opening). Not chapter approval.',
  reviewContext: {
    ...prior.reviewContext,
    nextSpan: { startUnit: 's0621', endUnit: 's0720', label: 'Li Fan dispute continuation and mid-late statutory catalogue' },
    coverage: {
      ...prior.reviewContext.coverage,
      reviewedUnits: reviewedUnits.length,
      uniqueItemChecks: mergedChecks.length,
      uniqueClaimsChecked: uniqueClaimIds.size,
      nextUntouchedSpan: {
        startUnit: 's0621',
        endUnit: 's0720',
        label: 'Residual claim-277 evidence and bandit-captive mourning statutes',
      },
      nextUntouchedItemId: nextClaim?.id ?? null,
      spanCheckpoints: [
        ...priorSpans,
        { span: 's0481-s0560', newItemChecks: g7.length, itemIds: g7.sort() },
        { span: 's0561-s0620', newItemChecks: g8.length, itemIds: g8.sort() },
      ],
    },
  },
  reviewedUnits,
  itemChecks: mergedChecks,
  personChecks,
  findings,
  references: [
    ...prior.references,
    { kind: 'internal', book: 'jinshu', chapter: '020', unit: 's0544', quote: '太興初', sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0544').zh).digest('hex')}`, reason: 'Gan Bao Wang Bi retrospective anchor.' },
    { kind: 'internal', book: 'jinshu', chapter: '020', unit: 's0588', quote: '建武元年', sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0588').zh).digest('hex')}`, reason: 'Wen Jiao office-refusal anchor.' },
    { kind: 'internal', book: 'jinshu', chapter: '020', unit: 's0614', quote: '太興二年', sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0614').zh).digest('hex')}`, reason: 'Bandit-captive parents statutory anchor.' },
  ],
};

validateDateAuditReport(report, pin);

const out = `${ART}/date-audit-report-partial-s0037-s0620.json`;
fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);

const checkpoint = (label, start, end, ids) => ({
  schemaVersion: 1,
  kind: 'jinshu020-chronology-span-checkpoint',
  draftCommit: prior.reviewContext.draftCommit,
  span: { startUnit: start, endUnit: end, label },
  preservedPriorThrough: 's0480',
  preservedItemChecks: 189,
  preservedUniqueClaimsChecked: 182,
  newItemCheckIds: ids.sort(),
  newItemCheckCount: ids.length,
  cumulativeReviewedUnits: reviewedUnits.length,
  cumulativeItemChecks: mergedChecks.length,
  cumulativeUniqueClaimsChecked: uniqueClaimIds.size,
  nextUntouchedItemId: nextClaim?.id ?? null,
  nextUntouchedSpan: report.reviewContext.coverage.nextUntouchedSpan,
  notChapterApproval: true,
});

fs.writeFileSync(`${ART}/chronology-span-checkpoint-s0481-s0560.json`, `${JSON.stringify(checkpoint('Wang Chang closure and edict; Liu Zhongwu opening', 's0481', 's0560', g7), null, 2)}\n`);
fs.writeFileSync(`${ART}/chronology-span-checkpoint-s0561-s0620.json`, `${JSON.stringify(checkpoint('Dual-wife cases, Wen Jiao Jianwu, captive-parent statutes', 's0561', 's0620', g8), null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      out,
      reviewedUnits: reviewedUnits.length,
      itemChecks: mergedChecks.length,
      uniqueClaimsChecked: uniqueClaimIds.size,
      nextItem: nextClaim?.id,
      g7: g7.length,
      g8: g8.length,
    },
    null,
    2,
  ),
);