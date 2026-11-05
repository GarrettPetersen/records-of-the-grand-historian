import fs from 'node:fs';
const dir = new URL('.', import.meta.url).pathname, number = Number(process.argv[2]);
const state = JSON.parse(fs.readFileSync(dir + 'review-state.json'));
if (!Number.isInteger(number) || number < 2 || number > state.parts.length) throw Error('An owned later part is required');
const part = state.parts[number - 1];
if (part.phase !== 'reserved' || !part.agentId) throw Error('Bind the actual independent producer before writing its prompt');
const original = state.parts[0], transport = JSON.parse(fs.readFileSync(dir + part.file));
const stem = String(number).padStart(3, '0');
const prompt = fs.readFileSync(dir + 'part-001-prompt.txt', 'utf8')
  .replace('part001: eight exact owned cases/eight target records.', 'part' + stem + ': ' + transport.reviewCases.length +
    ' exact owned cases/' + transport.reviewCases.flatMap(row => row.localPeople).length + ' target records.')
  .replaceAll(original.agentId, part.agentId).replaceAll(original.sha256, part.sha256)
  .replaceAll('jinshu109-identity-part001.json', 'jinshu109-identity-part' + stem + '.json')
  .replaceAll('source reviewer 01', 'source reviewer ' + String(number).padStart(2, '0'));
const target = dir + 'part-' + stem + '-prompt.txt';
if (fs.existsSync(target)) {
  if (fs.readFileSync(target, 'utf8') !== prompt) throw Error('Retained prompt changed; preserve it');
} else fs.writeFileSync(target, prompt, { flag: 'wx' });
console.log(JSON.stringify({ number, agentId: part.agentId, cases: transport.reviewCases.length,
  records: transport.reviewCases.flatMap(row => row.localPeople).length, promptBytes: Buffer.byteLength(prompt) }));
