from pathlib import Path
J=Path(__file__).resolve().parent;C=J/'candidate'
p=C/'scripts/prepare-people-chapter-identity.mjs';s=p.read_text().replace('export async function prepareChapterIdentityReview({ book, chapter, registry, out }) {','export async function buildChapterIdentityReviewPacket({ book, chapter, registry }) {')
a=s.index('    fs.mkdirSync(out,');b=s.index('    const receipt =',a)
s=s[:a]+"    const bytes = Buffer.from(JSON.stringify(packet, null, 2) + '\\n');\n"+s[b:]
a=s.index("    fs.writeFileSync(path.join(out, 'preparation-receipt.json')");b=s.index("if (process.argv[1]",a)
s=s[:a]+"    need(!inspectLocalDisk(REPO_ROOT).errors.length, 'Host guard failed after dossier preparation; preserve artifacts, dispatch no new work');\n    return { plan, packet, receipt };\n  } finally { index.close(); }\n}\nexport async function prepareChapterIdentityReview({ out, ...options }) {\n  const { plan, packet, receipt } = await buildChapterIdentityReviewPacket(options);\n  fs.mkdirSync(out, { recursive: false });\n  for (const [file, value] of [['plan.json', plan], ['source-review-packet.json', packet], ['preparation-receipt.json', receipt]]) {\n    fs.writeFileSync(path.join(out, file), JSON.stringify(value, null, 2) + '\\n', { flag: 'wx' });\n  }\n  return receipt;\n}\n"+s[b:]
s=s.replace("const unit = source.packet.units.find(row => row.id === unitId);", "if (!source.unitMap) source.unitMap = new Map(source.packet.units.map(unit => [unit.id, unit]));\n      const unit = source.unitMap.get(unitId);")
p.write_text(s)
