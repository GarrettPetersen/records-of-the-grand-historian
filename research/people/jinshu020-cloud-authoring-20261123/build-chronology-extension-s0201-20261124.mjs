#!/usr/bin/env node
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readJson } from '../../../scripts/lib/people-content.mjs';
import { validateDateAuditReport } from '../../../scripts/lib/people-date-audit.mjs';

const ART = '/agent/repos/records-of-the-grand-historian/research/people/jinshu020-cloud-authoring-20261123';
const prior = readJson(`${ART}/date-audit-report-partial-s0037-s0200.json`);
const pin = readJson(`${ART}/date-audit-packet-post-editorial-pin.json`);
const unitMap = new Map(pin.units.map(u => [u.id, u]));

function quote(unitId, q) {
  const zh = unitMap.get(unitId)?.zh ?? '';
  if (!zh.includes(q)) throw new Error(`Quote mismatch ${unitId} ${q}`);
  return { unit: unitId, quote: q };
}

const newItemChecks = [
  { id: 'claim-123', verdict: 'supported', event: 'Crown-prince guard commander Xu Miao on Honored Lady Chen mourning grade.', reason: 'Xu Miao memorializes at s0202 in the 太元十五年 Honored Lady Chen sequence opened at s0200; Taiyuan 15 contextual dating is warranted.', evidence: [quote('s0202', '徐邈議')] },
  { id: 'claim-124', verdict: 'supported', event: 'Emperor Hui reign anchor for the grand-heir death memorial.', reason: 's0207 gives 惠帝太安元年三月 explicitly for the 皇太孙尚薨 event.', evidence: [quote('s0207', '惠帝太安元年')] },
  { id: 'claim-125', verdict: 'supported', event: 'Imperial grand-heir Shang died in Taian 1 month 3.', reason: 'The same s0207 line dates and names the grand-heir death that triggers the mourning debate.', evidence: [quote('s0207', '皇太孫尚薨')] },
  { id: 'claim-126', verdict: 'supported', event: 'Cavalier attendant Xie Heng on grand-heir shang mourning grade.', reason: 'Xie Heng argues at s0210 immediately after the Taian 1 court debate; contextual Taian 1 follows s0207.', evidence: [quote('s0210', '散騎常侍謝衡')] },
  { id: 'claim-127', verdict: 'supported', event: 'Director Bian Cui opposing Xie Heng on grand-heir mourning.', reason: 'Bian Cui speaks at s0212 within the same Taian 1 grand-heir controversy.', evidence: [quote('s0212', '中書令卞粹')] },
  { id: 'claim-128', verdict: 'supported', event: 'Erudite Cai Ke agreeing with Bian Cui.', reason: 's0222 states Cai Ke sides with Bian Cui in the Taian 1 grand-heir mourning deliberation.', evidence: [quote('s0222', '博士蔡克同粹')] },
  { id: 'claim-129', verdict: 'supported', event: 'Palace Library director Zhi Yu on arms during mourning.', reason: 'Zhi Yu argues at s0229–s0256 during the Jin ritual reform block that follows the Taian 1 memorial cluster.', evidence: [quote('s0229', '摯虞以為')] },
  { id: 'claim-130', verdict: 'supported', event: 'King Cheng cited for armed vigil at royal death.', reason: 's0230 cites Cheng Wang’s death and guard arrangements as Zhou ritual precedent; BC dating is allusive.', evidence: [quote('s0230', '成王崩')] },
  { id: 'claim-131', verdict: 'supported', event: 'Zheng grand officer in funeral-procession precedent.', reason: 's0240 cites Gongsun Zi’s death and the great chariot gift as Spring and Autumn proof text.', evidence: [quote('s0240', '公孫蠆卒')] },
  { id: 'claim-132', verdict: 'supported', event: 'Han Emperor Wu cited for origin of funeral dirges.', reason: 's0249 attributes dirges to Han Wudi’s labor songs as historical explanation, not a Jin dated event.', evidence: [quote('s0249', '漢武帝')] },
  { id: 'claim-133', verdict: 'supported', event: 'Prince Mu of Anping died in Xianning 2 without heirs.', reason: 's0258 gives 咸寧二年 and 安平穆王薨 with explicit reign-year precision.', evidence: [quote('s0258', '咸寧二年')] },
  { id: 'claim-134', verdict: 'supported', event: 'Prince Dun succeeded as heir to Prince Xian after Mu’s death.', reason: 's0258 names 敦上繼獻王后 in the Xianning 2 succession question.', evidence: [quote('s0258', '以母弟敦上繼獻王後')] },
  { id: 'claim-135', verdict: 'supported', event: 'Prince Xian of Anping as the succession line referenced.', reason: 'The Xianning 2 inquiry at s0258–s0260 concerns献王後 inheritance involving Prince Xian’s line.', evidence: [quote('s0258', '繼獻王後')] },
  { id: 'claim-136', verdict: 'supported', event: 'Erudite Zhang Jing answered mourning grade for the Anping succession.', reason: 's0259 records Zhang Jing’s Lu Xi parallel answer in the Xianning 2 Anping debate.', evidence: [quote('s0259', '博士張靖答')] },
  { id: 'claim-137', verdict: 'supported', event: 'Duke Xi of Lu cited via Zhang Jing’s Lu mourning parallel.', reason: 's0259 references依魯僖服閔三年例 as classical precedent; BC hints are interpretive only.', evidence: [quote('s0259', '魯僖')] },
  { id: 'claim-138', verdict: 'supported', event: 'Duke Min of Lu in the Xi–Min mourning comparison.', reason: 's0260 contrasts穆王/敦 with 閔僖 using Lu ducal mourning logic.', evidence: [quote('s0260', '閔僖不同')] },
  { id: 'claim-139', verdict: 'supported', event: 'Sun Yu memorializing Anping mourning grade.', reason: 's0261 lists Sun Yu’s view that Dun should wear one-cycle dress in the Xianning 2 debate.', evidence: [quote('s0261', '孫毓')] },
  { id: 'claim-140', verdict: 'supported', event: 'Song Chang memorializing with Sun Yu.', reason: 'Song Chang is named with Sun Yu at s0261 in the same memorial pairing.', evidence: [quote('s0261', '宋昌議')] },
  { id: 'claim-141', verdict: 'supported', event: 'Zheng Xuan cited in Sun Yu’s commentary quotation.', reason: 's0269 continues Zheng Xuan’s gloss on三年者 during the Anping mourning debate; person is commentarial precedent.', evidence: [quote('s0269', '有三年者')] },
  { id: 'claim-142', verdict: 'supported', event: 'Wei Emperor Ming cited for Chenliu prince mourning.', reason: 's0275 describes燕公承明帝祀 and the edict that private kinship mourning cannot override Wei state sacrifice.', evidence: [quote('s0276', '不得服其私親')] },
  { id: 'claim-143', verdict: 'incorrect', event: 'Emperor Mu reign dating for Donghai mourning dispute.', reason: 's0277 gives 穆帝时 without 永和六年; Yonghe 6 Western year is table-only on this line.', evidence: [quote('s0277', '穆帝時')] },
  { id: 'claim-144', verdict: 'supported', event: 'King Ai of Donghai in the overdue mourning dispute.', reason: 's0277 states哀王薨逾年 and the Donghai memorial under穆帝时 with clear person identity.', evidence: [quote('s0277', '哀王薨')] },
  { id: 'claim-145', verdict: 'incorrect', event: 'Historian Sun Sheng critiquing the Donghai consort mourning outcome.', reason: 'Sun Sheng comments at s0281 in the same narrative block but the line carries no 永和六年.', evidence: [quote('s0281', '孫盛以為')] },
  { id: 'claim-146', verdict: 'supported', event: 'Chamberlain Che Yin memorialized on tertiary-son mourning reform.', reason: 's0284 gives 太元十七年 and s0303 十八年 for Che Yin’s serial memorials on庶子为母之服.', evidence: [quote('s0284', '太元十七年'), quote('s0303', '十八年')] },
  { id: 'claim-147', verdict: 'incorrect', event: 'Prince of Wuling seeking mourning for birth mother.', reason: 's0307 reads 升平四年, not Shengping 4; the extractor mislabeled the Xiaowen-era reign year.', evidence: [quote('s0307', '升平四年')] },
  { id: 'claim-148', verdict: 'supported', event: 'Prince of Liang seeking mourning for birth mother.', reason: 's0308 gives 興寧三年 explicitly for the Liang prince birth-mother mourning petition.', evidence: [quote('s0308', '興甯三年')] }
];

const mergedChecks = [...prior.itemChecks];
const seen = new Set(prior.itemChecks.map(c => c.id));
for (const c of newItemChecks) {
  if (seen.has(c.id)) throw new Error(`Duplicate ${c.id}`);
  mergedChecks.push(c);
  seen.add(c.id);
}

const newPeople = {
  p123: { verdict: 'supported', event: 'Xu Miao on Honored Lady Chen mourning grade.', reason: '徐邈 is named at s0202 in the Taiyuan 15 Honored Lady Chen deliberation.', evidence: [quote('s0202', '徐邈')] },
  p124: { verdict: 'supported', event: 'Emperor Hui in the Taian 1 grand-heir episode.', reason: '惠帝 and 太安元年 anchor s0207 with unambiguous identity.', evidence: [quote('s0207', '惠帝')] },
  p128: { verdict: 'supported', event: 'Xie Heng in Taian 1 grand-heir mourning debate.', reason: '謝衡 leads argument at s0210 in the memorial chain after s0207.', evidence: [quote('s0210', '謝衡')] },
  p129: { verdict: 'supported', event: 'Zhi Yu in Jin mourning ritual reform cluster.', reason: '摯虞 repeatedly argues from s0229 through s0256 on weapons, processions, and dirges.', evidence: [quote('s0229', '摯虞')] },
  p133: { verdict: 'supported', event: 'Prince Mu of Anping at Xianning 2 death.', reason: '安平穆王 and 咸寧二年 appear at s0258 with explicit dating.', evidence: [quote('s0258', '安平穆王')] },
  p147: { verdict: 'supported', event: 'Che Yin as Chamberlain memorializing mourning discipline.', reason: '太常车胤 at s0284 is Che Yin’s office title in the Taiyuan 17 memorial sequence.', evidence: [quote('s0284', '太常車胤')] },
  p152: { verdict: 'supported', event: 'Prince of Wuling in birth-mother mourning petition.', reason: '武陵王所生母喪 appears at s0307; only the Shengping year label on claim-147 is wrong.', evidence: [quote('s0307', '武陵王')] },
  p151: { verdict: 'supported', event: 'Prince of Liang in birth-mother mourning petition.', reason: '梁王 at s0308 with 興寧三年 gives clear identity and reign year.', evidence: [quote('s0308', '梁王')] }
};

const personChecks = [...prior.personChecks];
const pseen = new Set(prior.personChecks.map(p => p.id));
for (const [id, body] of Object.entries(newPeople)) {
  if (!pseen.has(id)) {
    personChecks.push({ id, ...body });
    pseen.add(id);
  }
}

const newFindings = [
  { items: ['claim-143', 'claim-145'], problem: 's0277–s0281 use 穆帝时 and Sun Sheng’s comment without 永和六年 on the cited lines.', action: 'Drop Yonghe 6 Western intervals; keep Eastern Jin reign-context precision at 穆帝时 only until a dated memorial line is cited.' },
  { items: ['claim-147'], problem: 'Wuling prince petition is 升平四年 at s0307 but the claim used Shengping 4.', action: 'Repair reign label to Shengping → Shengping is wrong; use 升平四年 (Shengping 4 is wrong name - 升平 is different from 升平). Actually 升平 = Shengping in pinyin? 升平 = Shengping, 升平四年 vs Shengping 4 - same? Extractor said Shengping 4 - Chinese is 升平四年 which IS Shengping 4. Wait - packet says Shengping 4 and source says 升平四年 - those match! Let me re-read.' }
];

// 升平四年 = Shengping reign Shengping 4. Packet has "Shengping 4" - that's CORRECT!
// I made an error - claim-147 should be supported not incorrect
newFindings.pop();
newItemChecks.find(c => c.id === 'claim-147').verdict = 'supported';
newItemChecks.find(c => c.id === 'claim-147').reason = 's0307 gives 升平四年 for the Wuling prince birth-mother mourning petition with explicit reign-year precision.';
newItemChecks.find(c => c.id === 'claim-147').event = 'Prince of Wuling seeking mourning for birth mother in Shengping 4.';

const newFindingsFinal = [
  { items: ['claim-143', 'claim-145'], problem: 's0277–s0281 use 穆帝时 and Sun Sheng’s comment without 永和六年 on the cited lines.', action: 'Drop Yonghe 6 Western intervals; keep Eastern Jin context at 穆帝时 until a dated year appears on the line.' }
];

const findings = [...prior.findings, ...newFindingsFinal];

const reviewedUnits = [...prior.reviewedUnits];
for (let n = 201; n <= 320; n++) {
  const u = `s${String(n).padStart(4, '0')}`;
  if (!reviewedUnits.includes(u)) reviewedUnits.push(u);
}

const spanG3 = [];
for (let n = 201; n <= 260; n++) spanG3.push(`s${String(n).padStart(4, '0')}`);
const spanG4 = [];
for (let n = 261; n <= 320; n++) spanG4.push(`s${String(n).padStart(4, '0')}`);

const checksG3 = newItemChecks.filter(c => c.evidence.some(e => spanG3.includes(e.unit))).map(c => c.id);
const checksG4 = newItemChecks.filter(c => c.evidence.some(e => spanG4.includes(e.unit))).map(c => c.id);

const priorSpans = prior.reviewContext.coverage.spanCheckpoints ?? [];

const uniqueClaimIds = new Set(mergedChecks.filter(c => c.id.startsWith('claim-')).map(c => c.id));

const report = {
  ...prior,
  reviewedAt: new Date().toISOString(),
  summary: 'Native partial chronology through s0320 on draft #5488. Prior 99 item checks and s0037–s0200 preserved. New spans: Taiyuan 15 Chen mourning (s0201–s0206), Taian 1 grand-heir and ritual reforms (s0207–s0257), Xianning 2 Anping succession (s0258–s0274), Donghai and Che Yin discipline (s0275–s0308). Not chapter approval.',
  reviewContext: {
    ...prior.reviewContext,
    nextSpan: {
      startUnit: 's0321',
      endUnit: 's0400',
      label: 'Ministry memorial on tertiary-son mourning through late-chapter grade codification'
    },
    coverage: {
      ...prior.reviewContext.coverage,
      reviewedUnits: reviewedUnits.length,
      uniqueItemChecks: mergedChecks.length,
      uniqueClaimsChecked: uniqueClaimIds.size,
      preservedEnglishRepairs: 97,
      preservedCandidateDispositions: 38,
      nextUntouchedSpan: {
        startUnit: 's0321',
        endUnit: 's0400',
        label: 'Che Yin follow-up and ministerial mourning-grade codification'
      },
      spanCheckpoints: [
        ...priorSpans,
        { span: 's0201-s0260', newItemChecks: checksG3.length, itemIds: checksG3.sort() },
        { span: 's0261-s0320', newItemChecks: checksG4.length, itemIds: checksG4.sort() }
      ]
    }
  },
  reviewedUnits,
  itemChecks: mergedChecks,
  personChecks,
  findings,
  references: [
    ...prior.references,
    { kind: 'internal', book: 'jinshu', chapter: '020', unit: 's0207', quote: '惠帝太安元年', sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0207').zh).digest('hex')}`, reason: 'Taian 1 grand-heir death anchor.' },
    { kind: 'internal', book: 'jinshu', chapter: '020', unit: 's0258', quote: '咸寧二年', sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0258').zh).digest('hex')}`, reason: 'Xianning 2 Anping Mu prince death anchor.' },
    { kind: 'internal', book: 'jinshu', chapter: '020', unit: 's0284', quote: '太元十七年', sourceHash: `sha256:${createHash('sha256').update(unitMap.get('s0284').zh).digest('hex')}`, reason: 'Che Yin Taiyuan 17 mourning-discipline memorial.' }
  ]
};

validateDateAuditReport(report, pin);

const out = `${ART}/date-audit-report-partial-s0037-s0320.json`;
fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);

const checkpoint = (label, start, end, ids) => ({
  schemaVersion: 1,
  kind: 'jinshu020-chronology-span-checkpoint',
  draftCommit: prior.reviewContext.draftCommit,
  span: { startUnit: start, endUnit: end, label },
  preservedPriorThrough: 's0200',
  preservedItemChecks: 99,
  newItemCheckIds: ids.sort(),
  newItemCheckCount: ids.length,
  cumulativeReviewedUnits: reviewedUnits.length,
  cumulativeItemChecks: mergedChecks.length,
  cumulativeUniqueClaimsChecked: uniqueClaimIds.size,
  nextUntouchedSpan: report.reviewContext.coverage.nextUntouchedSpan,
  notChapterApproval: true
});

fs.writeFileSync(`${ART}/chronology-span-checkpoint-s0201-s0260.json`, `${JSON.stringify(checkpoint('Chen mother, Taian grand-heir, ritual reforms, Xianning Anping opening', 's0201', 's0260', checksG3), null, 2)}\n`);
fs.writeFileSync(`${ART}/chronology-span-checkpoint-s0261-s0320.json`, `${JSON.stringify(checkpoint('Anping debate through Wuling/Liang birth-mother precedents', 's0261', 's0320', checksG4), null, 2)}\n`);

console.log(JSON.stringify({
  out,
  reviewedUnits: reviewedUnits.length,
  itemChecks: mergedChecks.length,
  uniqueClaimsChecked: uniqueClaimIds.size,
  g3: checksG3.length,
  g4: checksG4.length
}, null, 2));