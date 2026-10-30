from pathlib import Path
import json,hashlib
J=Path(__file__).resolve().parent;C=J/'candidate'
p=C/'scripts/lib/people-chapter-identity.mjs';s=p.read_text()
s=s.replace("'reportFingerprint', 'sourcePeople']", "'reportFingerprint', 'sourcePeople', 'chapterChinese']")
needle="  need(bundle.receipt.authorAgentIds.includes(own.extraction.run.agentId), 'Actual extraction author missing from identity review provenance');"
assert s.count(needle)==1
s=s.replace(needle,needle+"\n  need(bundle.receipt.chapterChinese === chapterChineseEvidenceFingerprint(own.packet), 'Reviewed chapter Chinese source or unit inventory changed; fresh source coverage is required');")
s+="""
// Full target-chapter Chinese is part of the independent coverage proof, including
// previously unmentioned units. A metadata/English edit may reuse unchanged person
// proofs; inserting an unseen actor in an unmentioned Chinese unit may not.
export function chapterChineseEvidenceFingerprint(packet) {
  need(Array.isArray(packet?.units) && packet.units.every(unit => typeof unit.id === 'string' && typeof unit.zh === 'string') &&
    new Set(packet.units.map(unit => unit.id)).size === packet.units.length, 'Complete current Chinese source units required');
  return peopleDigest(packet.units.map(unit => [unit.id, unit.zh]));
}
"""
p.write_text(s)
p=C/'scripts/lib/people-identity-test-fixtures.mjs';s=p.read_text().replace('validateChapterIdentityBundle, identitySourceEvidenceFingerprint','validateChapterIdentityBundle, identitySourceEvidenceFingerprint, chapterChineseEvidenceFingerprint');s=s.replace('planFingerprint: plan.fingerprint, reportFingerprint: peopleDigest(report),','planFingerprint: plan.fingerprint, reportFingerprint: peopleDigest(report), chapterChinese: chapterChineseEvidenceFingerprint(own.packet),');p.write_text(s)
p=C/'scripts/test-people-chapter-identity.mjs';s=p.read_text().replace('IDENTITY_UNCERTAINTY_NOTE, identitySourceEvidenceFingerprint','IDENTITY_UNCERTAINTY_NOTE, identitySourceEvidenceFingerprint, chapterChineseEvidenceFingerprint');s=s.replace("  bundle.receipt.sourcePeople=[own,anchor]", "  bundle.receipt.chapterChinese=chapterChineseEvidenceFingerprint(sources.get('fixture:001').packet);\n  bundle.receipt.sourcePeople=[own,anchor]")
s+="""
test('a new actor in an unmentioned Chinese unit cannot reuse the old chapter proof',()=>{
 const f=fixture();f.sources.get('fixture:001').packet.units.push({id:'s0002',zh:'李忠至。'});
 assert.throws(()=>validate(f),/chapter Chinese source or unit inventory changed/);
});
""";p.write_text(s)
