import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { propertySpan, validatePart } from '../../093/bounded-independent-parts-eb9a-20261105/host-part-validation.mjs';
const dir = new URL('.', import.meta.url).pathname, number = Number(process.argv[2]);
const state = JSON.parse(fs.readFileSync(dir + 'review-state.json'));
if (!Number.isInteger(number) || number < 1 || number > state.parts.length) throw Error('Exact owned part required');
const part = state.parts[number - 1], stem = 'part-' + String(number).padStart(3, '0');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const raw = fs.readFileSync(dir + stem + '-provider.raw.json'), original = propertySpan(raw.toString('utf8'), 'identityReport');
const transport = JSON.parse(fs.readFileSync(part.transportFile));
const units = new Map(transport.units.map(unit => [unit.book + ':' + unit.chapter + ':' + unit.id, unit]));
const changes = [];
const repairs = original.parsed.supplementalEditorialRepairs.map((repair, index) => {
  if (typeof repair.pairedFieldChecked === 'string') return repair;
  if (repair.pairedFieldChecked !== true) throw Error('Missing affirmative paired-field check; do not infer review');
  const unit = units.get(repair.book + ':' + repair.chapter + ':' + repair.unitId);
  if (!unit || !['literal', 'idiomatic'].includes(repair.field)) throw Error('Repair source context missing');
  const other = repair.field === 'literal' ? unit.en : unit.literal;
  if (typeof other !== 'string') throw Error('Complete other-field text missing');
  changes.push({ index, field: 'pairedFieldChecked', providerValue: true, derivedValue: other,
    source: 'Exact other English field in the same sealed transport unit; host-derived context, not a new model decision' });
  return { ...repair, pairedFieldChecked: other };
});
if (!changes.length) throw Error('No supported mechanical context derivation needed');
const bytes = Buffer.concat([Buffer.from('{"schemaVersion":1,"identityReport":'), original.bytes,
  Buffer.from(',"supplementalEditorialRepairs":' + JSON.stringify(repairs) + '}\n')]);
const checked = validatePart(bytes, number - 1, part.agentId, dir);
if (!checked.reportBytes.equals(original.bytes)) throw Error('Independent identity report bytes changed');
fs.writeFileSync(dir + stem + '-editorial-context-envelope.json', bytes, { flag: 'wx' });
const derivation = { schemaVersion: 1, providerMessageSha256: hash(raw), contextEnvelopeSha256: hash(bytes),
  originalIdentityReportSha256: hash(original.bytes), identityReportBytesUnchanged: true,
  sourcePacketSha256: state.sourcePacketSha256, changes, editorialProposalsIndependentlyApproved: false,
  completeRepetitionAuditPending: true, canonicalWrites: false };
fs.writeFileSync(dir + stem + '-editorial-context-derivation.json', JSON.stringify(derivation, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ number, identityApprovals: checked.approved, holds: checked.holds.length,
  proposals: checked.repairs.length, contextFieldsDerived: changes.length, identityReportBytesUnchanged: true }));
