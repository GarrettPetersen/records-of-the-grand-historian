import fs from 'fs';

const target = process.argv[2];
const patch = process.argv[3];
const data = JSON.parse(fs.readFileSync(target, 'utf8'));
const items = JSON.parse(fs.readFileSync(patch, 'utf8'));
const byId = new Map(items.map((x) => [x.id, x]));
for (const s of data.sentences) {
  const p = byId.get(s.id);
  if (!p) continue;
  s.literal = p.literal;
  s.idiomatic = p.idiomatic;
}
fs.writeFileSync(target, JSON.stringify(data, null, 2) + '\n');
